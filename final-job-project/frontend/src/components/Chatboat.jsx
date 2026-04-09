import { useState } from 'react';
import api from '../api/api';

function Chatboat() {
  const [message, setMessage] = useState('');
  const [chat, setChat] = useState([
    {
      sender: 'bot',
      text: 'Hello! I am your Groq AI assistant. Tell me what kind of job help you need.',
    },
  ]);
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!message.trim()) return;

    const userMessage = {
      sender: 'user',
      text: message,
    };

    setChat((prev) => [...prev, userMessage]);
    setLoading(true);

    try {
      const { data } = await api.post('/chat', { message });

      const botMessage = {
        sender: 'bot',
        text: data.reply,
      };

      setChat((prev) => [...prev, botMessage]);
    } catch (error) {
      setChat((prev) => [
        ...prev,
        {
          sender: 'bot',
          text: 'Sorry, something went wrong while getting a response.',
        },
      ]);
    } finally {
      setLoading(false);
      setMessage('');
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      sendMessage();
    }
  };

  return (
    <div className="mx-auto w-full max-w-3xl rounded-3xl border border-slate-800 bg-slate-900/95 shadow-2xl">
      <div className="border-b border-slate-800 px-6 py-5">
        <h2 className="text-2xl font-bold text-white">Enquire Boat</h2>
      </div>

      <div className="h-[420px] overflow-y-auto bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 px-5 py-5">
        <div className="space-y-4">
          {chat.map((item, index) => (
            <div
              key={index}
              className={`flex ${
                item.sender === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              <div
                className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-7 shadow-md ${
                  item.sender === 'user'
                    ? 'bg-blue-600 text-white'
                    : 'border border-slate-700 bg-slate-800 text-slate-100'
                }`}
              >
                {item.text}
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex justify-start">
              <div className="rounded-2xl border border-slate-700 bg-slate-800 px-4 py-3 text-sm text-slate-300 shadow-md">
                Bot is typing...
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="border-t border-slate-800 bg-slate-900 px-5 py-4">
        <div className="flex items-center gap-3">
          <input
            type="text"
            value={message}
            placeholder="Type your message..."
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1 rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white placeholder:text-slate-500 outline-none transition focus:border-blue-500"
          />

          <button
            onClick={sendMessage}
            disabled={loading}
            className="rounded-2xl bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}

export default Chatboat;