import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { chatRequestSchema, messageSchema, type Message, type Category } from "@shared/schema";
import { generateChatResponse } from "./services/gemini";
import { randomUUID } from "crypto";

export async function registerRoutes(app: Express): Promise<Server> {
  
  // Chat endpoint - handles AI conversation
  app.post("/api/chat", async (req, res) => {
    try {
      const { message, category, sessionId, userId } = chatRequestSchema.parse(req.body);
      
      let session;
      let messages: Message[] = [];
      
      // Get or create chat session
      if (sessionId) {
        session = await storage.getChatSession(sessionId);
        if (session) {
          messages = Array.isArray(session.messages) ? session.messages as Message[] : [];
        }
      }
      
      if (!session) {
        session = await storage.createChatSession({
          userId: userId || undefined,
          category,
          messages: [],
        });
      }
      
      // Add user message
      const userMessage: Message = {
        id: randomUUID(),
        content: message,
        sender: "user",
        timestamp: new Date(),
        category,
      };
      
      messages.push(userMessage);
      
      // Generate AI response
      const aiResponse = await generateChatResponse(message, category, messages);
      
      const aiMessage: Message = {
        id: randomUUID(),
        content: aiResponse,
        sender: "ai", 
        timestamp: new Date(),
        category,
      };
      
      messages.push(aiMessage);
      
      // Update session with new messages
      await storage.updateChatSession(session.id, messages);
      
      res.json({
        message: aiMessage,
        sessionId: session.id,
      });
      
    } catch (error) {
      console.error("Chat error:", error);
      res.status(500).json({ 
        error: "Failed to process chat message",
        details: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });
  
  // Get chat history
  app.get("/api/chat/:sessionId", async (req, res) => {
    try {
      const { sessionId } = req.params;
      const session = await storage.getChatSession(sessionId);
      
      if (!session) {
        return res.status(404).json({ error: "Chat session not found" });
      }
      
      res.json(session);
      
    } catch (error) {
      console.error("Get chat error:", error);
      res.status(500).json({ error: "Failed to get chat session" });
    }
  });
  
  // Get user's chat sessions
  app.get("/api/user/:userId/chats", async (req, res) => {
    try {
      const { userId } = req.params;
      const sessions = await storage.getUserChatSessions(userId);
      
      res.json(sessions);
      
    } catch (error) {
      console.error("Get user chats error:", error);
      res.status(500).json({ error: "Failed to get user chat sessions" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
