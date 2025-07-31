import { useState, useCallback, useRef } from "react";

// Extend window interface for speech recognition
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

export function useSpeech() {
  const [isVoiceEnabled, setIsVoiceEnabled] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const recognitionRef = useRef<any>(null);

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
    // Check for permissions first
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices.getUserMedia({ audio: true })
        .then(() => {
          console.log('Microphone access granted');
          initializeSpeechRecognition(onResult);
        })
        .catch((error) => {
          console.error('Microphone access denied:', error);
          alert('Please allow microphone access to use voice recording. Check your browser permissions and try again.');
        });
    } else {
      initializeSpeechRecognition(onResult);
    }
  }, []);

  const initializeSpeechRecognition = useCallback((onResult: (transcript: string) => void) => {
    if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      alert('Voice recording requires Chrome, Edge, or Safari. Please use a supported browser.');
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    
    // Configure recognition settings
    recognition.continuous = false;
    recognition.interimResults = false; // Simplified to avoid complexity
    recognition.lang = 'en-US';
    recognition.maxAlternatives = 1;

    let hasResult = false;

    recognition.onstart = () => {
      setIsRecording(true);
      hasResult = false;
      console.log('Speech recognition started - please speak now');
    };

    recognition.onresult = (event: any) => {
      if (event.results.length > 0) {
        const transcript = event.results[0][0].transcript.trim();
        if (transcript) {
          console.log('Speech recognized:', transcript);
          hasResult = true;
          onResult(transcript);
        }
      }
    };

    recognition.onend = () => {
      setIsRecording(false);
      if (!hasResult) {
        console.log('No speech detected during recording');
      }
    };

    recognition.onerror = (event: any) => {
      console.error('Speech recognition error:', event.error);
      setIsRecording(false);
      
      switch (event.error) {
        case 'no-speech':
          // Don't show alert for no-speech, just log it
          console.log('No speech detected - user may not have spoken');
          break;
        case 'not-allowed':
          alert('Microphone access is blocked. Please check your browser permissions and allow microphone access.');
          break;
        case 'network':
          console.log('Network error with speech service - this is common in development environments');
          break;
        case 'service-not-allowed':
          console.log('Speech service not available - this can happen in some hosting environments');
          break;
        default:
          console.log(`Speech recognition issue: ${event.error}`);
      }
    };

    recognitionRef.current = recognition;
    
    try {
      recognition.start();
    } catch (error) {
      console.error('Failed to start recognition:', error);
      setIsRecording(false);
      alert('Could not start voice recording. Please try typing your message instead.');
    }
  }, []);

  const stopRecording = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    setIsRecording(false);
  }, []);

  return {
    isVoiceEnabled,
    toggleVoice,
    isRecording,
    startRecording,
    stopRecording,
    speak,
  };
}
