import { useState, useEffect, useRef, useCallback } from 'react';
import axios from 'axios';
import { io } from 'socket.io-client';
import { URL } from '../../config';

export const useChat = (currentUserId) => {
  const [conversations, setConversations] = useState([]);
  const [activeChat, setActiveChat] = useState(null); // Selected user or room
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const socketRef = useRef(null);

  const getHeaders = () => ({
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
  });

  // 1. Initialize Socket.io connection
  useEffect(() => {
    const socket = io(URL, {
      auth: { token: localStorage.getItem('token') },
      transports: ['websocket']
    });

    socketRef.current = socket;

    socket.on('connect', () => {
      if (currentUserId) {
        socket.emit('join', currentUserId);
      }
    });

    // Real-time listener for incoming direct messages
    socket.on('receive_message', (newMessage) => {
      // Check if message belongs to current open chat
      setActiveChat((active) => {
        if (
          active &&
          (newMessage.sender === active._id || newMessage.receiver === active._id || newMessage.chatId === active._id)
        ) {
          setMessages((prev) => [...prev, newMessage]);
        }
        return active;
      });

      // Update sidebar preview
      setConversations((prev) =>
        prev.map((conv) => {
          const convId = conv._id || conv.user?._id;
          if (convId === newMessage.sender || convId === newMessage.receiver) {
            return { ...conv, lastMessage: newMessage.text || newMessage.content, updatedAt: new Date() };
          }
          return conv;
        })
      );
    });

    return () => {
      socket.disconnect();
    };
  }, [currentUserId]);

  // 2. Fetch all conversation lists (matches app.use("/mainlist", ...))
  const fetchConversations = useCallback(async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${URL}/mainlist`, getHeaders());
      setConversations(res.data.data || res.data || []);
    } catch (err) {
      console.error('Error fetching conversations:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // 3. Fetch message history for selected user (matches app.use("/dmessage", ...))
  const fetchMessages = useCallback(async (partnerId) => {
    try {
      setLoading(true);
      const res = await axios.get(`${URL}/dmessage/${partnerId}`, getHeaders());
      setMessages(res.data.data || res.data || []);
    } catch (err) {
      console.error('Error fetching messages:', err);
      setMessages([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // 4. Send a new message (REST + Socket fallback)
  const sendMessage = async (receiverId, text) => {
    if (!text.trim()) return;

    const payload = { receiverId, text, content: text };

    try {
      // Persist to backend DB
      const res = await axios.post(`${URL}/dmessage/send/${receiverId}`, payload, getHeaders());
      const savedMessage = res.data.data || res.data || {
        _id: Date.now().toString(),
        sender: currentUserId,
        receiver: receiverId,
        text,
        createdAt: new Date().toISOString()
      };

      // Optimistic / DB update to UI
      setMessages((prev) => [...prev, savedMessage]);

      // Emit real-time event
      if (socketRef.current) {
        socketRef.current.emit('send_message', savedMessage);
      }
    } catch (err) {
      console.error('Failed to send message:', err);
    }
  };

  return {
    conversations,
    activeChat,
    setActiveChat,
    messages,
    loading,
    fetchConversations,
    fetchMessages,
    sendMessage
  };
};