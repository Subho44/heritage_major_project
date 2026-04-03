import { useEffect, useState } from 'react';
import api from '../api/api';
import { io } from 'socket.io-client';
import Chatbox from '../components/Chatbox';
import { useAuth } from '../context/AuthContext';

const socket = io('http://localhost:5000', {
  transports: ['websocket', 'polling'],
});

const Chatpage = () => {
  const { user, loading } = useAuth();
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    if (loading) return;
    if (!user?._id) return;

    socket.emit('join', user._id);

    const fetchUsers = async () => {
      try {
        const { data } = await api.get('/users');
        const allUsers = Array.isArray(data) ? data : [];
        setUsers(allUsers);
      } catch (error) {
        console.error('Fetch users error:', error?.response?.data || error.message);
        setUsers([]);
      }
    };

    fetchUsers();
  }, [user, loading]);

  if (loading) {
    return <div className="p-5 text-white">Loading...</div>;
  }

  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-5 p-5 md:flex-row">
      <div className="w-full rounded-xl border border-slate-700 bg-slate-900 p-4 md:w-1/3">
        <h3 className="mb-4 text-2xl font-bold text-white">Users</h3>

        {users.length > 0 ? (
          users.map((item) => (
            <div
              key={item._id}
              onClick={() => setSelectedUser(item)}
              className={`mb-3 cursor-pointer rounded-lg border p-3 ${
                selectedUser?._id === item._id
                  ? 'border-blue-500 bg-slate-800'
                  : 'border-slate-700 hover:bg-slate-800'
              }`}
            >
              <p className="font-semibold text-white">{item.name}</p>
              <p className="text-sm text-slate-300">{item.email}</p>
              <p className="text-xs text-slate-400">{item.role}</p>
            </div>
          ))
        ) : (
          <p className="text-slate-300">No users found</p>
        )}
      </div>

      <div className="w-full rounded-xl border border-slate-700 bg-slate-900 p-4 md:w-2/3">
        {selectedUser ? (
          <Chatbox selectedUser={selectedUser} socket={socket} currentUser={user} />
        ) : (
          <h3 className="text-2xl font-bold text-white">Select a user to chat</h3>
        )}
      </div>
    </div>
  );
};

export default Chatpage;