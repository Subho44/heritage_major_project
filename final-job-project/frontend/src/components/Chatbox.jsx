import { useEffect, useState } from 'react';
import api from '../api/api';

const Chatbox = ({ selectedUser, socket, currentUser }) => {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');

  const fetchMessages = async () => {
    try {
      if (!selectedUser?._id) return;

      const token = localStorage.getItem('token');

      const { data } = await api.get(`/chat/${selectedUser._id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setMessages(Array.isArray(data) ? data : Array.isArray(data?.messages) ? data.messages : []);
    } catch (error) {
      console.error('Failed to fetch messages:', error);
      setMessages([]);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, [selectedUser]);

  useEffect(() => {
    const handleReceiveMessage = (newMessage) => {
      if (!selectedUser?._id || !currentUser?._id) return;

      const senderId =
        typeof newMessage.sender === 'object' ? newMessage.sender._id : newMessage.sender;

      const receiverId =
        typeof newMessage.receiver === 'object' ? newMessage.receiver._id : newMessage.receiver;

      const isCurrentChat =
        (senderId === selectedUser._id && receiverId === currentUser._id) ||
        (senderId === currentUser._id && receiverId === selectedUser._id);

      if (isCurrentChat) {
        setMessages((prev) => [...prev, newMessage]);
      }
    };

    socket.on('receiveMessage', handleReceiveMessage);

    return () => {
      socket.off('receiveMessage', handleReceiveMessage);
    };
  }, [socket, selectedUser, currentUser]);

  const sendMessage = async () => {
    try {
      if (!text.trim() || !selectedUser?._id || !currentUser?._id) return;

      const token = localStorage.getItem('token');

      const messageData = {
        receiver: selectedUser._id,
        text: text.trim(),
      };

      const { data } = await api.post('/chat', messageData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setMessages((prev) => [...prev, data]);

      socket.emit('sendMessage', {
        ...data,
        sender: currentUser._id,
        receiver: selectedUser._id,
        text: text.trim(),
      });

      setText('');
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };

  return (
    <div>
      <h3 className="mb-4 text-xl font-bold text-slate-900 dark:text-white">
        Chat with {selectedUser?.name}
      </h3>

      <div className="mb-4 h-[400px] overflow-y-auto rounded-lg border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-950">
        {messages.length === 0 ? (
          <p className="text-slate-500 dark:text-slate-300">No messages yet</p>
        ) : (
          messages.map((msg, index) => {
            const senderId = typeof msg.sender === 'object' ? msg.sender._id : msg.sender;
            const isMyMessage = senderId === currentUser?._id;

            return (
              <div
                key={msg._id || index}
                className={`mb-3 flex ${isMyMessage ? 'justify-end' : 'justify-start'}`}
              >
                <span
                  className={`max-w-[70%] rounded-2xl px-4 py-2 text-sm ${
                    isMyMessage
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-200 text-slate-900 dark:bg-slate-800 dark:text-white'
                  }`}
                >
                  {msg.text}
                </span>
              </div>
            );
          })
        )}
      </div>

      <div className="flex gap-3">
        <input
          type="text"
          placeholder="Type message"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              sendMessage();
            }
          }}
          className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-blue-500 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
        />

        <button
          onClick={sendMessage}
          className="rounded-lg bg-blue-600 px-5 py-3 font-medium text-white hover:bg-blue-700"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default Chatbox;