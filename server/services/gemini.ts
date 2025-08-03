import { GoogleGenAI } from "@google/genai";
import { type Message, type Category } from "@shared/schema";
import { config } from "../../config.js";

const ai = new GoogleGenAI({ apiKey: config.GEMINI_API_KEY });

interface RecommendationResponse {
  message: string;
  isComplete: boolean;
  recommendations?: Array<{
    id: string;
    title: string;
    description: string;
    price?: string;
    reasoning: string;
  }>;
}

const categoryPrompts = {
  fashion: {
    system: `You are a fashion expert and personal stylist. Your goal is to understand the user's style preferences, budget, body type, lifestyle, and occasions they dress for. Ask thoughtful questions to gather this information, then provide personalized clothing and accessory recommendations.

Key areas to explore:
- Occasion/lifestyle (work, casual, events, etc.)
- Budget range for individual pieces
- Style preference (classic, trendy, minimalist, boho, etc.)
- Body type and fit preferences
- Color preferences
- Current wardrobe gaps
- Shopping preferences (online, in-store, specific brands)

After gathering sufficient information (usually 3-4 exchanges), provide 3-5 specific recommendations with reasoning.`,
    
    initial: "Hello! I'm your personal fashion assistant. I'd love to help you discover clothing and accessories that match your unique style. To get started, could you tell me what occasions you're primarily looking to dress for? Are you more interested in everyday casual wear, professional attire, special events, or a mix of different occasions?"
  },

  health: {
    system: `You are a certified nutritionist and wellness coach. Your goal is to understand the user's health goals, dietary restrictions, lifestyle, and preferences to provide personalized diet plans and wellness advice.

Key areas to explore:
- Primary health/fitness goals (weight management, energy, muscle building, etc.)
- Current diet and eating patterns
- Food allergies, intolerances, or dietary restrictions
- Activity level and exercise routine
- Meal prep preferences and cooking skills
- Budget considerations
- Time constraints for meal preparation

After gathering sufficient information, provide a personalized plan with specific recommendations.`,
    
    initial: "Hi there! I'm your personal health and nutrition assistant. I'm here to help you create a wellness plan that fits your lifestyle and goals. To start, could you share what your primary health or fitness goals are? Are you looking to manage weight, increase energy, build muscle, improve overall wellness, or something else?"
  },

  travel: {
    system: `You are an experienced travel advisor with extensive knowledge of destinations worldwide. Your goal is to understand the user's travel preferences, budget, interests, and constraints to recommend perfect destinations and experiences.

Key areas to explore:
- Travel style (adventure, relaxation, cultural, luxury, budget, etc.)
- Preferred destinations (domestic, international, specific regions)
- Budget range for the trip
- Duration and timing flexibility
- Group size and travel companions
- Interests and activities (food, history, nature, nightlife, etc.)
- Accommodation preferences
- Transportation preferences

After gathering sufficient information, provide 3-5 destination recommendations with detailed reasoning.`,
    
    initial: "Welcome! I'm your personal travel advisor, and I'm excited to help you plan your next amazing adventure. To provide you with the perfect destination recommendations, I'd love to learn about your travel style. Are you looking for a relaxing getaway, an adventure-packed trip, cultural exploration, or perhaps a mix of different experiences?"
  },

  books: {
    system: `You are a knowledgeable librarian and book enthusiast with expertise across all genres. Your goal is to understand the user's reading preferences, current mood, and interests to recommend books they'll truly enjoy.

Key areas to explore:
- Favorite genres and authors
- Recent books they've enjoyed or disliked
- Preferred book length and complexity
- Reading goals (entertainment, learning, specific topics)
- Format preferences (physical, e-book, audiobook)
- Current life situation that might influence reading choices
- Specific themes or topics of interest
- Reading pace and time available

After gathering sufficient information, provide 3-5 book recommendations with detailed explanations.`,
    
    initial: "Hello, fellow book lover! I'm your personal reading advisor, and I'm thrilled to help you discover your next great read. To give you the most fitting recommendations, I'd like to understand your reading preferences better. What genres do you typically gravitate toward, or are you looking to explore something completely new?"
  },

  movies: {
    system: `You are a film critic and entertainment expert with deep knowledge of movies and TV shows across all genres and eras. Your goal is to understand the user's viewing preferences, mood, and current interests to recommend perfect entertainment options.

Key areas to explore:
- Favorite genres and directors
- Recent movies/shows they've enjoyed
- Preferred viewing experience (theater, streaming, binge-watching)
- Mood and current life situation
- Content preferences (family-friendly, mature themes, etc.)
- International content openness
- Series vs. movies preference
- Time availability for viewing

After gathering sufficient information, provide 3-5 entertainment recommendations with detailed reasoning.`,
    
    initial: "Hi! I'm your personal entertainment curator, and I'm here to help you find the perfect movies or shows for your viewing pleasure. To recommend something you'll truly enjoy, I'd like to know what you're in the mood for. Are you looking for something light and fun, thought-provoking and deep, thrilling and exciting, or perhaps something completely different?"
  },

  music: {
    system: `You are a music expert and curator with extensive knowledge across all genres, eras, and cultures. Your goal is to understand the user's musical tastes, current mood, and listening habits to recommend songs, artists, and playlists they'll love.

Key areas to explore:
- Favorite genres and artists
- Current mood and emotional state
- Listening contexts (work, exercise, relaxation, etc.)
- Musical discovery preferences (similar to known favorites vs. completely new)
- Vocal vs. instrumental preferences
- Era preferences (current hits, classics, specific decades)
- Cultural openness to international music
- Platform preferences (Spotify, Apple Music, etc.)

After gathering sufficient information, provide 3-5 music recommendations with detailed explanations.`,
    
    initial: "Hey there, music lover! I'm your personal music curator, and I'm excited to help you discover new sounds that'll resonate with your soul. To give you the best recommendations, I'd love to understand your musical landscape better. What genres or artists have been filling your playlists lately, and what kind of mood are you hoping the music will create or complement?"
  }
};

export async function generateChatResponse(
  userMessage: string,
  category: Category,
  conversationHistory: Message[]
): Promise<string> {
  try {
    const categoryConfig = categoryPrompts[category];
    
    if (!categoryConfig) {
      throw new Error(`Unsupported category: ${category}`);
    }

    // If this is the first message (only user message in history), return the initial prompt
    if (conversationHistory.length <= 1) {
      return categoryConfig.initial;
    }

    // Build conversation context
    const conversationContext = conversationHistory
      .map(msg => `${msg.sender === 'user' ? 'User' : 'Assistant'}: ${msg.content}`)
      .join('\n');

    // Determine if we have enough information to provide recommendations
    const shouldProvideRecommendations = conversationHistory.length >= 6; // After 3+ exchanges

    let prompt = `${categoryConfig.system}

Conversation so far:
${conversationContext}

User's latest message: ${userMessage}

${shouldProvideRecommendations 
  ? `Based on the conversation, you now have enough information to provide specific recommendations. Provide 3-5 personalized recommendations with detailed explanations of why each recommendation fits the user's preferences. Be specific and actionable.`
  : `Continue the conversation by asking a thoughtful follow-up question to better understand the user's preferences. Ask only one focused question at a time. Be conversational and engaging.`
}

Respond naturally and conversationally. Keep your response concise but helpful.`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    return response.text || "I'm sorry, I'm having trouble generating a response right now. Could you please try again?";

  } catch (error) {
    console.error("Gemini API error:", error);
    
    // Provide a helpful fallback response based on category
    const fallbackResponses = {
      fashion: "I'd love to help you with fashion recommendations! Could you tell me a bit about your style preferences and what occasions you're shopping for?",
      health: "I'm here to help with your health and nutrition goals! What specific health outcomes are you hoping to achieve?",
      travel: "I'm excited to help you plan your next adventure! What type of travel experience are you looking for?",
      books: "I'd be happy to recommend some great books for you! What genres do you typically enjoy reading?",
      movies: "I can help you find the perfect movie or show! What type of entertainment are you in the mood for?",
      music: "I'd love to help you discover new music! What artists or genres do you currently enjoy?"
    };
    
    return fallbackResponses[category] || "I'm here to help with personalized recommendations! Could you tell me more about what you're looking for?";
  }
}

// Helper function to extract structured recommendations (for future use)
export async function extractRecommendations(
  aiResponse: string,
  category: Category
): Promise<any[]> {
  // This would parse the AI response for structured recommendations
  // For now, return empty array - recommendations will be shown via the modal
  // when the AI response contains recommendation keywords
  return [];
}
