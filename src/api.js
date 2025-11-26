export const sendMessageToBot = async (text) => {
  const res = await fetch(`https://nandini-ai-voicebot.onrender.com/ask`, { // match backend route
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text }),
  });

  if (!res.ok) throw new Error("Backend API error");

  const data = await res.json();
  return data; // return full object with type and text/file
};
