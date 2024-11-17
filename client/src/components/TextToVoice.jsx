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

  const sanitizeText = (html) => {
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = html;
    return (tempDiv.textContent || tempDiv.innerText || "")
      .replace(/</g, " ")
      .replace(/>/g, " ")
      .replace(/&/g, "and")
      .trim();
  };

  const detectLanguage = (cleanedText) => {
    const hindiPattern = /[\u0900-\u097F]/;
    return hindiPattern.test(cleanedText) ? "hi-IN" : "en-US";
  };

  const getVoiceForLanguage = (language) => {
    const voice = voices.find((voice) => voice.lang === language);
    if (!voice) {
      console.warn(
        `No voice found for ${language}, defaulting to system voice.`
      );
    }
    return voice || null;
  };

  const startSpeaking = () => {
    const cleanedText = sanitizeText(text);
    if (!cleanedText) {
      console.error("No text to speak after sanitization.");
      return;
    }

    if (voices.length === 0) {
      console.error("No voices available.");
      return;
    }

    speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(cleanedText);
    const detectedLang = detectLanguage(cleanedText);
    const selectedVoice = getVoiceForLanguage(detectedLang);

    if (selectedVoice) {
      utterance.voice = selectedVoice;
    }
    utterance.lang = selectedVoice ? selectedVoice.lang : detectedLang;

    utterance.rate = 0.8;
    utterance.onend = () => {
      setIsSpeaking(false);
      setIsPaused(false);
    };
    utterance.onerror = (event) => {
      console.error("Speech synthesis error:", event.error);
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

  useEffect(() => {
    return () => {
      // Cleanup to stop playback when the page reloads or changes
      speechSynthesis.cancel();
      setIsSpeaking(false);
      setIsPaused(false);
    };
  }, []);

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
