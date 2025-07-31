import { Button } from "@/components/ui/button";
import { Mic } from "lucide-react";

interface VoiceRecorderProps {
  isRecording: boolean;
  onToggleRecording: () => void;
  isSpeechSupported?: boolean;
}

export default function VoiceRecorder({ isRecording, onToggleRecording, isSpeechSupported = true }: VoiceRecorderProps) {
  return (
    <div className="flex flex-col items-center">
      <Button
        variant="outline"
        size="sm"
        onClick={onToggleRecording}
        disabled={!isSpeechSupported}
        className={`p-3 rounded-xl border transition-colors ${
          isRecording 
            ? 'border-red-500 text-red-500 bg-red-50' 
            : !isSpeechSupported
            ? 'border-gray-200 text-gray-400 cursor-not-allowed'
            : 'border-gray-300 text-gray-600 hover:border-primary hover:text-primary'
        }`}
      >
        <Mic size={20} />
      </Button>
      
      {isRecording && (
        <div className="mt-2 flex flex-col items-center space-y-1">
          <div className="flex items-center space-x-2 text-red-500">
            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
            <span className="text-xs font-medium">Listening...</span>
            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
          </div>
          <div className="text-xs text-gray-500 text-center max-w-32">
            Speak now, then click again to stop
          </div>
        </div>
      )}
      
      {!isRecording && (
        <div className="mt-1 text-xs text-gray-400 text-center max-w-32">
          {isSpeechSupported 
            ? "Voice input (Chrome/Edge recommended)" 
            : "Voice input not supported in this browser"
          }
        </div>
      )}
    </div>
  );
}
