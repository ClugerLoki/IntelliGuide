import { useEffect, useRef } from "react";
import { useLocation, useRoute } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Bot, ArrowLeft, Volume2, MoreVertical, Mic, Send } from "lucide-react";
import { categories } from "@/lib/categories";
import { useChat } from "@/hooks/use-chat";
import { useSpeech } from "@/hooks/use-speech";
import { useSpeechAlternative } from "@/hooks/use-speech-alternative";
import MessageBubble from "@/components/chat/message-bubble";
import TypingIndicator from "@/components/chat/typing-indicator";
import VoiceRecorder from "@/components/chat/voice-recorder";
import RecommendationModal from "@/components/recommendations/recommendation-modal";

export default function ChatPage() {
  const [, params] = useRoute("/chat/:category");
  const [, setLocation] = useLocation();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const category = categories.find(c => c.id === params?.category);
  const { 
    messages, 
    inputMessage, 
    setInputMessage, 
    isLoading, 
    sendMessage, 
    recommendations,
    showRecommendations,
    setShowRecommendations 
  } = useChat((params?.category as any) || 'fashion');
  
  // Try the original speech hook first, fallback to alternative
  const originalSpeech = useSpeech();
  const alternativeSpeech = useSpeechAlternative();
  
  // Use alternative if original doesn't support speech or fails
  const speechHook = originalSpeech.isSpeechSupported ? originalSpeech : alternativeSpeech;
  
  const { 
    isVoiceEnabled, 
    toggleVoice, 
    isRecording, 
    startRecording, 
    stopRecording, 
    speak,
    isSpeechSupported
  } = speechHook;

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;
    await sendMessage(inputMessage);
    setInputMessage("");
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleVoiceRecording = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording((transcript) => {
        setInputMessage(transcript);
      });
    }
  };

  if (!category) {
    return <div>Category not found</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Card className="bg-white shadow-sm border-b border-gray-200 rounded-none">
        <CardContent className="p-4">
          <div className="max-w-4xl mx-auto flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setLocation("/categories")}
                className="p-2"
              >
                <ArrowLeft className="text-gray-600" size={20} />
              </Button>
              <div className="w-10 h-10 bg-gradient-to-r from-primary to-secondary rounded-xl flex items-center justify-center">
                <Bot className="text-white" size={20} />
              </div>
              <div>
                <h2 className="font-semibold text-gray-900">{category.name} Assistant</h2>
                <div className="flex items-center space-x-1">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm text-gray-600">Online</span>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleVoice}
                className={`p-2 ${isVoiceEnabled ? 'text-primary' : 'text-gray-600'}`}
              >
                <Volume2 size={20} />
              </Button>
              <Button variant="ghost" size="sm" className="p-2">
                <MoreVertical className="text-gray-600" size={20} />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex-1 overflow-y-auto p-4">
        <div className="max-w-4xl mx-auto space-y-4">
          {messages.map((message) => (
            <MessageBubble
              key={message.id}
              message={message}
              onSpeak={isVoiceEnabled ? speak : undefined}
            />
          ))}
          
          {isLoading && <TypingIndicator />}
          <div ref={messagesEndRef} />
        </div>
      </div>

      <Card className="bg-white border-t border-gray-200 rounded-none">
        <CardContent className="p-4">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-end space-x-3">
              <VoiceRecorder
                isRecording={isRecording}
                onToggleRecording={handleVoiceRecording}
                isSpeechSupported={isSpeechSupported}
              />
              
              <div className="flex-1 relative">
                <Textarea
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Type your message or tap the microphone to speak..."
                  className="resize-none border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent"
                  rows={1}
                />
              </div>
              
              <Button
                onClick={handleSendMessage}
                disabled={!inputMessage.trim() || isLoading}
                className="p-3 bg-primary text-white rounded-xl hover:bg-primary-dark"
              >
                <Send size={20} />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <RecommendationModal
        isOpen={showRecommendations}
        onClose={() => setShowRecommendations(false)}
        recommendations={recommendations}
        category={category}
      />
    </div>
  );
}
