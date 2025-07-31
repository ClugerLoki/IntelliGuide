import { type User, type InsertUser, type ChatSession, type InsertChatSession, type Message } from "@shared/schema";
import { firestore, isFirebaseEnabled, initializeFirebase } from "./firebase";
import { randomUUID } from "crypto";

export interface IStorage {
  // User operations
  getUser(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Chat session operations
  getChatSession(id: string): Promise<ChatSession | undefined>;
  createChatSession(session: InsertChatSession): Promise<ChatSession>;
  updateChatSession(id: string, messages: Message[]): Promise<ChatSession>;
  getUserChatSessions(userId: string): Promise<ChatSession[]>;
}

export class FirebaseStorage implements IStorage {
  private usersCollection = firestore.collection('users');
  private chatSessionsCollection = firestore.collection('chatSessions');

  async getUser(id: string): Promise<User | undefined> {
    try {
      const doc = await this.usersCollection.doc(id).get();
      if (!doc.exists) return undefined;
      
      return {
        id: doc.id,
        ...doc.data()
      } as User;
    } catch (error) {
      console.error('Error getting user:', error);
      return undefined;
    }
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    try {
      const query = await this.usersCollection.where('email', '==', email).limit(1).get();
      if (query.empty) return undefined;
      
      const doc = query.docs[0];
      return {
        id: doc.id,
        ...doc.data()
      } as User;
    } catch (error) {
      console.error('Error getting user by email:', error);
      return undefined;
    }
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    try {
      const id = randomUUID();
      const userData = {
        ...insertUser,
        createdAt: new Date(),
      };
      
      await this.usersCollection.doc(id).set(userData);
      
      return {
        id,
        ...userData,
      } as User;
    } catch (error) {
      console.error('Error creating user:', error);
      throw new Error('Failed to create user');
    }
  }

  async getChatSession(id: string): Promise<ChatSession | undefined> {
    try {
      const doc = await this.chatSessionsCollection.doc(id).get();
      if (!doc.exists) return undefined;
      
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        createdAt: data?.createdAt?.toDate() || new Date(),
        updatedAt: data?.updatedAt?.toDate() || new Date(),
      } as ChatSession;
    } catch (error) {
      console.error('Error getting chat session:', error);
      return undefined;
    }
  }

  async createChatSession(insertSession: InsertChatSession): Promise<ChatSession> {
    try {
      const id = randomUUID();
      
      // Create session data, ensuring no undefined values
      const sessionData: any = {
        category: insertSession.category,
        messages: insertSession.messages || [],
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      
      // Only add userId if it's not undefined or null
      if (insertSession.userId !== undefined && insertSession.userId !== null) {
        sessionData.userId = insertSession.userId;
      }
      
      // Remove any undefined values from the data before saving
      const cleanData = Object.fromEntries(
        Object.entries(sessionData).filter(([_, value]) => value !== undefined)
      );
      
      await this.chatSessionsCollection.doc(id).set(cleanData);
      
      return {
        id,
        ...cleanData,
      } as ChatSession;
    } catch (error) {
      console.error('Error creating chat session:', error);
      throw new Error('Failed to create chat session');
    }
  }

  async updateChatSession(id: string, messages: Message[]): Promise<ChatSession> {
    try {
      const sessionRef = this.chatSessionsCollection.doc(id);
      const doc = await sessionRef.get();
      
      if (!doc.exists) {
        throw new Error("Chat session not found");
      }
      
      const updateData = {
        messages,
        updatedAt: new Date(),
      };
      
      await sessionRef.update(updateData);
      
      const updatedDoc = await sessionRef.get();
      const data = updatedDoc.data();
      
      return {
        id: updatedDoc.id,
        ...data,
        createdAt: data?.createdAt?.toDate() || new Date(),
        updatedAt: data?.updatedAt?.toDate() || new Date(),
      } as ChatSession;
    } catch (error) {
      console.error('Error updating chat session:', error);
      throw new Error('Failed to update chat session');
    }
  }

  async getUserChatSessions(userId: string): Promise<ChatSession[]> {
    try {
      const query = await this.chatSessionsCollection
        .where('userId', '==', userId)
        .orderBy('updatedAt', 'desc')
        .get();
      
      return query.docs.map((doc: any) => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          createdAt: data?.createdAt?.toDate() || new Date(),
          updatedAt: data?.updatedAt?.toDate() || new Date(),
        } as ChatSession;
      });
    } catch (error) {
      console.error('Error getting user chat sessions:', error);
      return [];
    }
  }
}

// In-memory fallback storage for when Firebase is not available
export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private chatSessions: Map<string, ChatSession>;

  constructor() {
    this.users = new Map();
    this.chatSessions = new Map();
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.email === email);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { 
      id,
      name: insertUser.name || null,
      email: insertUser.email || null,
      authProvider: insertUser.authProvider || "guest",
      createdAt: new Date(),
    };
    this.users.set(id, user);
    return user;
  }

  async getChatSession(id: string): Promise<ChatSession | undefined> {
    return this.chatSessions.get(id);
  }

  async createChatSession(insertSession: InsertChatSession): Promise<ChatSession> {
    const id = randomUUID();
    const session: ChatSession = {
      id,
      userId: insertSession.userId || null,
      category: insertSession.category,
      messages: insertSession.messages || [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.chatSessions.set(id, session);
    return session;
  }

  async updateChatSession(id: string, messages: Message[]): Promise<ChatSession> {
    const session = this.chatSessions.get(id);
    if (!session) {
      throw new Error("Chat session not found");
    }
    
    const updatedSession: ChatSession = {
      ...session,
      messages,
      updatedAt: new Date(),
    };
    
    this.chatSessions.set(id, updatedSession);
    return updatedSession;
  }

  async getUserChatSessions(userId: string): Promise<ChatSession[]> {
    return Array.from(this.chatSessions.values())
      .filter(session => session.userId === userId)
      .sort((a, b) => (b.updatedAt?.getTime() || 0) - (a.updatedAt?.getTime() || 0));
  }
}

// Initialize Firebase first
initializeFirebase();

// Use Firebase if available, otherwise fall back to in-memory storage
export const storage = isFirebaseEnabled && firestore 
  ? new FirebaseStorage() 
  : new MemStorage();

console.log('Storage initialized:', isFirebaseEnabled ? 'Firebase Firestore' : 'In-memory (fallback)');
