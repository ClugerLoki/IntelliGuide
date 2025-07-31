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
  
  // Check if speech recognition is supported
  const isSpeechSupported = 'webkitSpeechRecognition' in window || 'SpeechRecognition' in window;

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
    console.log('Starting voice recording...');
    console.log('Speech recognition supported:', isSpeechSupported);
    
    // Check for permissions first
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      console.log('Requesting microphone permission...');
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
      console.log('getUserMedia not available, trying speech recognition directly');
      initializeSpeechRecognition(onResult);
    }
  }, []);

  const initializeSpeechRecognition = useCallback((onResult: (transcript: string) => void) => {
    if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      console.log('Web Speech API not supported, falling back to alternative input');
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
      console.log('Recognition settings:', {
        continuous: recognition.continuous,
        interimResults: recognition.interimResults,
        lang: recognition.lang,
        maxAlternatives: recognition.maxAlternatives
      });
      
      // Add a timeout in case speech recognition doesn't work
      setTimeout(() => {
        if (isRecording && !hasResult) {
          console.log('Speech recognition timeout - stopping recording');
          recognition.stop();
        }
      }, 10000); // 10 second timeout
    };

    recognition.onresult = (event: any) => {
      console.log('Speech recognition result event:', event);
      console.log('Results length:', event.results.length);
      
      if (event.results.length > 0) {
        const result = event.results[0];
        console.log('First result:', result);
        
        if (result.length > 0) {
          const transcript = result[0].transcript.trim();
          console.log('Raw transcript:', transcript);
          
          if (transcript) {
            console.log('Speech recognized:', transcript);
            hasResult = true;
            onResult(transcript);
            // Stop recording after getting a result
            recognition.stop();
          } else {
            console.log('Empty transcript received');
          }
        } else {
          console.log('No transcript in result');
        }
      } else {
        console.log('No results in speech recognition event');
      }
    };

    recognition.onend = () => {
      console.log('Speech recognition ended');
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
        case 'aborted':
          console.log('Speech recognition was aborted');
          break;
        case 'audio-capture':
          console.log('Audio capture error - check microphone permissions');
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
      console.log('Falling back to alternative voice input method');
      // Don't show alert, let the alternative method handle it
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
    isSpeechSupported,
  };
}
