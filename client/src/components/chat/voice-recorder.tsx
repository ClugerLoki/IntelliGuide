import { Button } from "@/components/ui/button";
import { Mic } from "lucide-react";

interface VoiceRecorderProps {
  isRecording: boolean;
  onToggleRecording: () => void;
}

export default function VoiceRecorder({ isRecording, onToggleRecording }: VoiceRecorderProps) {
  return (
    <div className="flex flex-col items-center">
      <Button
        variant="outline"
        size="sm"
        onClick={onToggleRecording}
        className={`p-3 rounded-xl border transition-colors ${
          isRecording 
            ? 'border-red-500 text-red-500 bg-red-50' 
            : 'border-gray-300 text-gray-600 hover:border-primary hover:text-primary'
        }`}
      >
        <Mic size={20} />
      </Button>
      
      {isRecording && (
        <div className="mt-2 flex items-center space-x-2 text-primary">
          <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
          <span className="text-xs font-medium">Recording...</span>
          <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
        </div>
      )}
    </div>
  );
}
