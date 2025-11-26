// default export version
const playAudio = (filePath) => {
  const audio = new Audio(filePath);
  audio.play().catch((err) => console.error("Audio play error:", err));
};

export default playAudio;
