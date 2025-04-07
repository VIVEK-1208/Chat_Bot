import React, { useState, useRef, useEffect } from 'react';
import { fetchChatResponseFromGemini } from './geminiChatbotApi';
import './chat.css';
import ReactMarkdown from 'react-markdown';

const Chat: React.FC = () => {
  const [messages, setMessages] = useState<{ role: string; content: string }[]>([]);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = { role: 'user', content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');

    const botResponse = await fetchChatResponseFromGemini(input);
    const text = await botResponse.response.text();

    // Format bullets for ReactMarkdown
    const formattedText = text
      .replace(/\n\s*\u2022/g, '\n-')      // convert bullet symbol to markdown list
      .replace(/^\s*\u2022/gm, '-')         // handle beginning bullets
      .replace(/\n(?=\w)/g, '\n\n');       // add spacing for better line separation

    setMessages((prev) => [...prev, { role: 'assistant', content: formattedText }]);
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="chat-container">
      <div className="chat-messages">
        {messages.length === 0 ? (
          <div className="initial-message-container">
            <div className="initial-message">🤖 How can I help you?</div>
          </div>
        ) : (
          messages.map((msg, index) => (
            <div key={index} className={`chat-bubble ${msg.role}`}>
              <div className="avatar">{msg.role === 'user' ? '🧑' : '🤖'}</div>
              <div className="bubble-content">
                <ReactMarkdown>{msg.content}</ReactMarkdown>
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="chat-input-area">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask anything..."
          className="chat-input"
          rows={2}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSend();
            }
          }}
        />
        <button onClick={handleSend} className="send-btn">Send</button>
      </div>
    </div>
  );
};

export default Chat;
