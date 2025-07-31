import { useState } from "react";
import { useLocation } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Bot, Chrome, Mail } from "lucide-react";

export default function WelcomePage() {
  const [, setLocation] = useLocation();
  const [isLoading, setIsLoading] = useState(false);

  const handleAuth = async (type: 'google' | 'email' | 'guest') => {
    setIsLoading(true);
    
    try {
      // For demo purposes, we'll just navigate to categories
      // In a real app, you'd implement actual authentication here
      setTimeout(() => {
        setLocation("/categories");
        setIsLoading(false);
      }, 1000);
    } catch (error) {
      console.error("Auth error:", error);
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary to-secondary flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-white rounded-3xl shadow-2xl border-0">
        <CardContent className="p-8 text-center">
          <div className="mb-8">
            <div className="w-20 h-20 bg-gradient-to-r from-primary to-secondary rounded-2xl mx-auto mb-4 flex items-center justify-center">
              <Bot className="text-white text-3xl" size={32} />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">IntelliGuide</h1>
            <p className="text-gray-600">Your AI Companion for Personalized Recommendations</p>
          </div>
          
          <div className="space-y-4 mb-8">
            <Button
              onClick={() => handleAuth('google')}
              disabled={isLoading}
              variant="outline"
              className="w-full py-3 px-6 rounded-xl font-medium border-2 border-gray-200 hover:bg-gray-50"
            >
              <Chrome className="mr-2 text-red-500" size={20} />
              Continue with Google
            </Button>
            
            <Button
              onClick={() => handleAuth('email')}
              disabled={isLoading}
              className="w-full bg-primary text-white py-3 px-6 rounded-xl font-medium hover:bg-primary-dark"
            >
              <Mail className="mr-2" size={20} />
              Sign in with Email
            </Button>
          </div>
          
          <div className="border-t border-gray-200 pt-6">
            <Button
              onClick={() => handleAuth('guest')}
              disabled={isLoading}
              variant="ghost"
              className="text-primary hover:text-primary-dark font-medium"
            >
              Continue as Guest
            </Button>
            <p className="text-xs text-gray-500 mt-2">Chat history won't be saved</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
