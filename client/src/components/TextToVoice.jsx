import React, { useState, useEffect, useRef } from "react";
import {
  AiOutlinePlayCircle,
  AiOutlinePauseCircle,
  AiOutlineStop,
} from "react-icons/ai";

const TextToVoice = ({ text, onStop }) => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [currentChunk, setCurrentChunk] = useState(0);
  const [voices, setVoices] = useState([]);
  const utteranceRef = useRef(null);
  const textChunksRef = useRef([]);

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
    return (tempDiv.textContent || tempDiv.innerText || "").trim();
  };

  const splitText = (cleanedText, maxLength = 200) => {
    const sentences = cleanedText.split(/(?<=[.?!])\s+/);
    const chunks = [];
    let chunk = "";

    sentences.forEach((sentence) => {
      if (chunk.length + sentence.length <= maxLength) {
        chunk += `${sentence} `;
      } else {
        chunks.push(chunk.trim());
        chunk = `${sentence} `;
      }
    });

    if (chunk) {
      chunks.push(chunk.trim());
    }

    // console.log("Text Chunks:", chunks); // Debug log
    return chunks;
  };

  const speakChunk = (chunkIndex) => {
    if (chunkIndex >= textChunksRef.current.length) {
      // console.log("Finished speaking all chunks.");
      setIsSpeaking(false);
      setCurrentChunk(0);
      if (onStop) onStop();
      return;
    }

    // console.log("Speaking chunk:", textChunksRef.current[chunkIndex]);
    const utterance = new SpeechSynthesisUtterance(
      textChunksRef.current[chunkIndex]
    );
    utterance.rate = 0.8;

    utterance.onend = () => {
      // console.log("Chunk finished:", chunkIndex);
      setCurrentChunk(chunkIndex + 1);
      speakChunk(chunkIndex + 1);
    };

    utterance.onerror = (event) => {
      // console.error("Speech synthesis error:", event.error);
      setIsSpeaking(false);
      setCurrentChunk(0);
      if (onStop) onStop();
    };

    utteranceRef.current = utterance;
    speechSynthesis.speak(utterance);
  };

  const handlePlay = () => {
    const cleanedText = sanitizeText(text);
    if (!cleanedText) {
      // console.error("No text to speak after sanitization.");
      return;
    }

    speechSynthesis.cancel(); // Clear any ongoing speech
    textChunksRef.current = splitText(cleanedText);
    setIsSpeaking(true);
    setCurrentChunk(0);
    speakChunk(0);
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
    if (speechSynthesis.speaking || speechSynthesis.paused) {
      speechSynthesis.cancel(); // Stop the speech if it's speaking or paused
      setIsSpeaking(false); // Update state to reflect stop
      setIsPaused(false); // Reset paused state
      setCurrentChunk(0); // Reset chunk index

      if (onStop) onStop(); // Call the onStop callback
    }
  };

  useEffect(() => {
    return () => {
      speechSynthesis.cancel();
    };
  }, []);

  return (
    <div className="fixed bottom-14 left-2 flex flex-col space-y-2 z-50">
      <div className="flex flex-col space-y-2">
        {!isSpeaking && (
          <AiOutlinePlayCircle
            onClick={handlePlay}
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
        {isSpeaking && !isPaused && (
          <AiOutlinePauseCircle
            onClick={handlePause}
            size={40}
            className="p-1.5 rounded-xl hidden md:block text-white bg-primary shadow-lg hover:bg-pink-800 transition duration-300 cursor-pointer"
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
