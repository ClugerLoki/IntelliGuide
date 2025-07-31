import type { Express } from "express";
import { createServer, type Server } from "http";
import { chatRequestSchema, messageSchema, type Message, type Category } from "@shared/schema";
import { generateChatResponse } from "./services/gemini";
import { randomUUID } from "crypto";

// Lazy import storage to ensure environment variables are loaded first
let storage: any = null;
async function getStorage() {
  if (!storage) {
    const { storage: storageModule } = await import("./storage.js");
    storage = storageModule;
  }
  return storage;
}

export async function registerRoutes(app: Express): Promise<Server> {
  
  // Chat endpoint - handles AI conversation
  app.post("/api/chat", async (req, res) => {
    try {
      const { message, category, sessionId, userId } = chatRequestSchema.parse(req.body);
      
      let session;
      let messages: Message[] = [];
      
      // Get or create chat session
      const storageInstance = await getStorage();
      if (sessionId) {
        session = await storageInstance.getChatSession(sessionId);
        if (session) {
          messages = Array.isArray(session.messages) ? session.messages as Message[] : [];
        }
      }
      
      if (!session) {
        const sessionData: any = {
          category,
          messages: [],
        };
        
        // Only add userId if it's not falsy
        if (userId) {
          sessionData.userId = userId;
        }
        
        session = await storageInstance.createChatSession(sessionData);
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
      await storageInstance.updateChatSession(session.id, messages);
      
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
      const storageInstance = await getStorage();
      const session = await storageInstance.getChatSession(sessionId);
      
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
      const storageInstance = await getStorage();
      const sessions = await storageInstance.getUserChatSessions(userId);
      
      res.json(sessions);
      
    } catch (error) {
      console.error("Get user chats error:", error);
      res.status(500).json({ error: "Failed to get user chat sessions" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
