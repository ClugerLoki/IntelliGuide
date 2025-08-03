import { Button } from "@/components/ui/button";
import { Bot, User, Play } from "lucide-react";
import { type Message } from "@shared/schema";

interface MessageBubbleProps {
  message: Message;
  onSpeak?: (text: string) => void;
}

export default function MessageBubble({ message, onSpeak }: MessageBubbleProps) {
  const isAI = message.sender === "ai";
  const time = new Date(message.timestamp).toLocaleTimeString([], { 
    hour: '2-digit', 
    minute: '2-digit' 
  });

  return (
    <div className={`flex items-start space-x-3 ${!isAI ? 'flex-row-reverse space-x-reverse' : ''}`}>
      <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
        isAI 
          ? 'bg-gradient-to-r from-primary to-secondary' 
          : 'bg-gray-300'
      }`}>
        {isAI ? (
          <Bot className="text-white text-sm" size={16} />
        ) : (
          <User className="text-gray-600 text-sm" size={16} />
        )}
      </div>
      
      <div className={`rounded-2xl p-4 shadow-sm max-w-md ${
        isAI 
          ? 'bg-white rounded-tl-sm' 
          : 'bg-gradient-to-r from-primary to-secondary text-white rounded-tr-sm'
      }`}>
        <p className={isAI ? 'text-gray-900' : 'text-white'}>
          {message.content}
        </p>
        
        <div className={`flex items-center justify-between mt-3 pt-2 border-t ${
          isAI 
            ? 'border-gray-100' 
            : 'border-white border-opacity-20'
        }`}>
          <span className={`text-xs ${
            isAI 
              ? 'text-gray-500' 
              : 'text-white text-opacity-80'
          }`}>
            {time}
          </span>
          
          {isAI && onSpeak && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onSpeak(message.content)}
              className="p-1 h-auto text-gray-400 hover:text-primary"
            >
              <Play size={14} />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
