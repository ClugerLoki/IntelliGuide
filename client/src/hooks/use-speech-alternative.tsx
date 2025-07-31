import { useState, useCallback } from "react";

// Alternative voice input that doesn't require HTTPS
export function useSpeechAlternative() {
  const [isRecording, setIsRecording] = useState(false);
  const [isVoiceEnabled, setIsVoiceEnabled] = useState(false);

  const toggleVoice = useCallback(() => {
    setIsVoiceEnabled(prev => !prev);
  }, []);

  const speak = useCallback((text: string) => {
    if (!isVoiceEnabled || !('speechSynthesis' in window)) return;
    
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.9;
    utterance.pitch = 1;
    window.speechSynthesis.speak(utterance);
  }, [isVoiceEnabled]);

  const startRecording = useCallback((onResult: (transcript: string) => void) => {
    setIsRecording(true);
    
    // Show instructions for manual voice input
    const message = prompt(
      "🎤 Voice Input (Alternative Mode)\n\n" +
      "Since direct microphone access requires HTTPS, you can:\n\n" +
      "1. Use Windows Speech Recognition (Win + H)\n" +
      "2. Use your phone's voice-to-text\n" +
      "3. Type your message directly\n\n" +
      "Enter your message below:"
    );
    
    setIsRecording(false);
    
    if (message && message.trim()) {
      console.log('Alternative voice input received:', message.trim());
      onResult(message.trim());
    } else {
      console.log('No message entered in alternative voice input');
    }
  }, []);

  const stopRecording = useCallback(() => {
    setIsRecording(false);
  }, []);

  return {
    isVoiceEnabled,
    toggleVoice,
    isRecording,
    startRecording,
    stopRecording,
    speak,
    isSpeechSupported: true, // Always supported with this alternative
  };
} 