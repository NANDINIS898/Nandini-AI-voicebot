import React, { useState, useRef, useEffect } from "react";
import { sendMessageToBot } from "../api";
import { handleFixedVoiceAnswers } from "../utils/voiceanswers";
import { speakText } from "../utils/speakText";
import girlSleeping from "./girl_sleeping.gif";
import girlSayHi from "./girl_sayhi.gif";
import girlReply from "./girl_gif.gif"; // or rename appropriately


const VoiceBot = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [currentAudio, setCurrentAudio] = useState(null);
  const [gifState, setGifState] = useState("sleeping"); // sleeping, sayhi, reply
  const audioRef = useRef(null);

  const playAudioFile = (file) => {
    if (audioRef.current) audioRef.current.pause();
    const audio = new Audio(file);
    audioRef.current = audio;
    setCurrentAudio(audio);
    audio.play().catch((err) => console.error("Audio play error:", err));
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg = { sender: "user", text: input };
    setMessages((prev) => [...prev, userMsg]);

    const question = input;
    setInput("");

    // Check if greeting
    const greetingWords = ["hi", "hello", "hey"];
    if (greetingWords.some((word) => question.toLowerCase().includes(word))) {
      setGifState("sayhi");
    } else {
      setGifState("reply");
    }

    // Step 1: pre-recorded answer
    const fixedAnswered = handleFixedVoiceAnswers(question, playAudioFile);
    if (fixedAnswered) {
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: "🔊 lets hear it in my voice..." },
      ]);
      return;
    }

    // Step 2: call AI backend
    try {
      const res = await sendMessageToBot(question);

      if (res.type === "audio") {
        playAudioFile("/audio/" + res.file);
        setMessages((prev) => [
          ...prev,
          { sender: "bot", text: "🔊 lets hear it in my voice..." },
        ]);
      } else if (res.type === "text") {
        setMessages((prev) => [...prev, { sender: "bot", text: res.text }]);
        speakText(res.text);
      } else {
        setMessages((prev) => [
          ...prev,
          { sender: "bot", text: "Sorry, couldn't generate a response." },
        ]);
      }
    } catch (err) {
      console.error("API error:", err);
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: "Sorry, couldn't generate a response." },
      ]);
    }
  };

  const handlePauseResume = () => {
    if (!audioRef.current) return;
    if (audioRef.current.paused) audioRef.current.play();
    else audioRef.current.pause();
  };

  // Reset GIF to sleeping after bot finishes speaking
  useEffect(() => {
    if (!currentAudio) return;

    const handleEnded = () => setGifState("sleeping");
    currentAudio.addEventListener("ended", handleEnded);
    return () => currentAudio.removeEventListener("ended", handleEnded);
  }, [currentAudio]);

  // Choose GIF based on state
  const getCurrentGif = () => {
    switch (gifState) {
      case "sayhi":
        return girlSayHi;
      case "reply":
        return girlReply;
      default:
        return girlSleeping;
    }
  };

  return (
    <div className="container">
      <h2>🎤 Nandini's AI Voice Bot (MP3 + AI Voice)</h2>

      <div className="chat-box">
        {messages.map((m, i) => (
          <div key={i} className={`message ${m.sender}`}>
            <b>{m.sender === "user" ? "You" : "Bot"}: </b> {m.text}
          </div>
        ))}
      </div>

      <input
        type="text"
        value={input}
        placeholder="Ask anything…"
        onChange={(e) => setInput(e.target.value)}
        style={{ padding: "10px", width: "80%", borderRadius: "6px" }}
      />
      <button className="button" onClick={handleSend}>
        Send
      </button>
      {currentAudio && (
        <button
          className="button"
          onClick={handlePauseResume}
          style={{ marginLeft: 10 }}
        >
          ⏯ Pause/Resume Audio
        </button>
      )}

      {/* Bottom-left AI avatar */}
      <div className="bot-avatar-wrapper">
        <img
          src={getCurrentGif()}
          alt="Girl AI"
          className="bot-avatar"
        />
      </div>
    </div>
  );
};

export default VoiceBot;
