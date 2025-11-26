// utils/voiceanswers.js

const PREDEFINED_ANSWERS = {
  "life story": "/audio/life-story.mp3",
  "about your life": "/audio/life-story.mp3",
  "super power": "/audio/superpower.mp3",
  "superpower": "/audio/superpower.mp3",
  "growth areas": "/audio/growth-areas.mp3",
  "grow": "/audio/growth-areas.mp3",
  "areas": "/audio/growth-areas.mp3",
  "misconception": "/audio/misunderstanding.mp3",
  "coworkers": "/audio/misunderstanding.mp3",
  "boundaries": "/audio/boundaries.mp3",
  "limits": "/audio/boundaries.mp3",
};

export const handleFixedVoiceAnswers = (question, playAudioFile) => {
  const q = question.toLowerCase();
  for (let key in PREDEFINED_ANSWERS) {
    if (q.includes(key)) {
      playAudioFile(PREDEFINED_ANSWERS[key]);
      return true;
    }
  }
  return false;
};
