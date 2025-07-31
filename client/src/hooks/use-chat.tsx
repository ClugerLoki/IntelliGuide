import { useState, useCallback } from "react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { type Message, type Category } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";

interface ChatResponse {
  message: Message;
  sessionId: string;
}

export function useChat(category: Category) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [sessionId, setSessionId] = useState<string | undefined>();
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [showRecommendations, setShowRecommendations] = useState(false);
  const { toast } = useToast();

  const chatMutation = useMutation({
    mutationFn: async (message: string): Promise<ChatResponse> => {
      const response = await apiRequest("POST", "/api/chat", {
        message,
        category,
        sessionId,
        userId: undefined, // For guest users
      });
      return response.json();
    },
    onSuccess: (data) => {
      setMessages(prev => [...prev, data.message]);
      setSessionId(data.sessionId);
      
      // Check if AI response contains recommendations
      if (data.message.content.toLowerCase().includes('recommend') || 
          data.message.content.toLowerCase().includes('suggestion')) {
        // For demo purposes, we'll show mock recommendations
        // In a real app, you'd parse the AI response for structured recommendations
        setTimeout(() => {
          setShowRecommendations(true);
        }, 1000);
      }
    },
    onError: (error) => {
      console.error("Chat error:", error);
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
    },
  });

  const sendMessage = useCallback(
    async (message: string) => {
      if (!message.trim()) return;

      // Add user message immediately
      const userMessage: Message = {
        id: Date.now().toString(),
        content: message,
        sender: "user",
        timestamp: new Date(),
        category,
      };
      
      setMessages(prev => [...prev, userMessage]);
      
      // Send to API
      chatMutation.mutate(message);
    },
    [category, chatMutation]
  );

  return {
    messages,
    inputMessage,
    setInputMessage,
    isLoading: chatMutation.isPending,
    sendMessage,
    recommendations,
    showRecommendations,
    setShowRecommendations,
  };
}
