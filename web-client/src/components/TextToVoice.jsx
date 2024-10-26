import React, { useState, useEffect, useRef } from "react";
import {
  AiOutlinePlayCircle,
  AiOutlinePauseCircle,
  AiOutlineStop,
} from "react-icons/ai";

const TextToVoice = ({ text, onStop }) => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [voices, setVoices] = useState([]);
  const utteranceRef = useRef(null);

  useEffect(() => {
    const loadVoices = () => {
      const availableVoices = speechSynthesis.getVoices();
      // console.log("Available voices:", availableVoices); // Log available voices
      if (availableVoices.length > 0) {
        setVoices(availableVoices);
      }
    };

    if (speechSynthesis.onvoiceschanged !== undefined) {
      speechSynthesis.onvoiceschanged = loadVoices;
    }

    loadVoices();

    return () => {
      speechSynthesis.cancel();
    };
  }, []);

  const detectLanguage = (text) => {
    const hindiPattern = /[\u0900-\u097F]/;
    return hindiPattern.test(text) ? "hi-IN" : "en-US";
  };

  const getVoiceForLanguage = (language) => {
    return voices.find((voice) => voice.lang === language) || voices[0]; // Use the first available voice if none is found
  };

  const startSpeaking = () => {
    if (!text) {
      console.error("No text to speak");
      return;
    }

    if (voices.length === 0) {
      console.error("Voices are not loaded yet.");
      return;
    }

    // Avoid starting speech if already speaking or paused
    if (isSpeaking) {
      console.warn("Speech synthesis is already in progress.");
      return;
    }

    speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    const detectedLang = detectLanguage(text);
    const selectedVoice = getVoiceForLanguage(detectedLang);

    if (selectedVoice) {
      utterance.voice = selectedVoice;
      utterance.lang = selectedVoice.lang;
    } else {
      console.warn(
        `No voice found for language: ${detectedLang}, using first available voice.`
      );
    }

    utterance.rate = 0.7;

    utterance.onend = () => {
      setIsSpeaking(false);
      setIsPaused(false);
    };

    utterance.onerror = (event) => {
      // console.error("Error during speech synthesis:", event.error);
      setIsSpeaking(false);
      setIsPaused(false);
      if (onStop) onStop();
    };

    utteranceRef.current = utterance;
    speechSynthesis.speak(utterance);
    setIsSpeaking(true);
  };

  const handlePlay = () => {
    if (isSpeaking) {
      handleStop();
    } else {
      startSpeaking();
    }
  };

  const handlePause = () => {
    if (speechSynthesis.speaking && !isPaused) {
      speechSynthesis.pause();
      setIsPaused(true);
    }
  };

  const handleResume = () => {
    if (speechSynthesis.paused && isPaused) {
      speechSynthesis.resume();
      setIsPaused(false);
    }
  };

  const handleStop = () => {
    speechSynthesis.cancel();
    setIsSpeaking(false);
    setIsPaused(false);
    if (onStop) onStop();
  };

  return (
    <div className="fixed bottom-2 left-2 flex flex-col space-y-2 z-50">
      <div className="flex flex-col space-y-2">
        {!isSpeaking && (
          <AiOutlinePlayCircle
            onClick={handlePlay}
            size={40}
            className="p-1.5 rounded-xl text-white bg-primary shadow-lg hover:bg-pink-800 transition duration-300 cursor-pointer"
          />
        )}
        {isSpeaking && !isPaused && (
          <AiOutlinePauseCircle
            onClick={handlePause}
            size={40}
            className="p-1.5 rounded-xl text-white bg-primary shadow-lg hover:bg-pink-800 transition duration-300 cursor-pointer"
          />
        )}
        {isSpeaking && isPaused && (
          <AiOutlinePlayCircle
            onClick={handleResume}
            size={40}
            className="p-1.5 rounded-xl text-white bg-primary shadow-lg hover:bg-pink-800 transition duration-300 cursor-pointer"
          />
        )}
        {isSpeaking && (
          <AiOutlineStop
            onClick={handleStop}
            size={40}
            className="p-1.5 rounded-xl text-white bg-primary shadow-lg hover:bg-pink-800 transition duration-300 cursor-pointer"
          />
        )}
      </div>
    </div>
  );
};

export default TextToVoice;
