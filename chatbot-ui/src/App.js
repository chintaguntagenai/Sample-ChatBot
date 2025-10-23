import React, { useState } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [prompt, setPrompt] = useState("");
  const [chat, setChat] = useState([]);

  const sendMessage = async () => {
    if (!prompt.trim()) return;

    setChat([...chat, { sender: "user", text: prompt }]);
    setPrompt("");

    try {
      const res = await axios.post("http://localhost:5000/chat", { prompt });
      setChat([...chat, { sender: "user", text: prompt }, { sender: "ai", text: res.data.response }]);
    } catch (err) {
      setChat([...chat, { sender: "ai", text: "Error: Could not get response." }]);
    }
  };

  return (
    <div className="App">
      <h2>🤖 AI Chatbot</h2>
      <div className="chat-window">
        {chat.map((msg, i) => (
          <div key={i} className={msg.sender === "user" ? "user-msg" : "ai-msg"}>
            <strong>{msg.sender === "user" ? "You" : "AI"}:</strong> {msg.text}
          </div>
        ))}
      </div>
      <div className="input-area">
        <input
          type="text"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          placeholder="Type your message..."
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
}

export default App;