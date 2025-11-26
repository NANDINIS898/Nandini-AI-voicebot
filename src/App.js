import React from "react";
import VoiceBot from "./component/voicebot";
import "./styles.css";

// --- Voice Answer Logic (Global) ---
import playAudio from "./utils/playAudio";  // ✅ default import


export const handleFixedVoiceAnswers = (question) => {
  const q = question.toLowerCase();

  if (q.includes("life story") || q.includes("about your life")) {
    playAudio("/audio/life-story.mp3");
    return true;
  }

  if (q.includes("superpower")) {
    playAudio("/audio/superpower.mp3");
    return true;
  }

  if (q.includes("grow") || q.includes("growth areas")) {
    playAudio("/audio/growth-areas.mp3");
    return true;
  }

  if (q.includes("misconception") || q.includes("coworkers")) {
    playAudio("/audio/misconception.mp3");
    return true;
  }

  if (q.includes("push your boundaries") || q.includes("limits")) {
    playAudio("/audio/boundaries.mp3");
    return true;
  }

  return false; // no fixed answer → fallback to AI
};

function App() {
  return <VoiceBot />;
}

export default App;

