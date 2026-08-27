import { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDirectMessages } from "../../hooks/useDirectMessages";
import { useSendMessage } from "../../hooks/useSendMessage";
import { useMarkRead } from "../../hooks/useMarkRead";
import { socket } from "../../../socket";
import { FaArrowLeft, FaPaperPlane } from "react-icons/fa";
import {
  MessageSquare,
  Users,
  UserPlus,
  ShieldBan,
} from "lucide-react";
import MyConnections from "../MyConnections/MyConnections";
import PendingRequests from "../PendingRequests/PendingRequests";
import FindFriends from "../FindFriends/FindFriends";
import Blocked from "../Blocked/Blocked";

function Avatar({ src, name, className = "" }) {
  const [imgError, setImgError] = useState(false);

  return (
    <div
      className={`flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-blue-700 font-bold text-white ${className}`}
    >
      {src && !imgError ? (
        <img
          src={src}
          alt={name}
          onError={() => setImgError(true)}
          className="h-full w-full object-cover"
        />
      ) : (
        <span>
          {(name || "U").charAt(0).toUpperCase()}
        </span>
      )}
    </div>
  );
}

function Chat() {
  const { id } = useParams();
  const navigate = useNavigate();
  const profileId = localStorage.getItem("profileid");

  const [activeTab, setActiveTab] = useState(0);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [chatUser, setChatUser] = useState(null);

  const messageEndRef = useRef(null);

  const { data, isLoading } = useDirectMessages(id);
  const sendMutation = useSendMessage();
  const markReadMutation = useMarkRead();

  useEffect(() => {
    if (id) {
      setActiveTab(0);
    }
  }, [id]);

  useEffect(() => {
    if (!data) return;

    setChatUser(data.chatUser);
    setMessages(data.messages || []);
  }, [data]);

  useEffect(() => {
    if (!id || !profileId) return;

    markReadMutation.mutate(id, {
      onSuccess: () => {
        socket.emit("messagesRead", {
          senderId: id,
          receiverId: profileId,
        });
      },
    });
  }, [id]);

  useEffect(() => {
    if (!profileId) return;

    if (!socket.connected) {
      socket.connect();
    }

    socket.emit("register", profileId);

    const receiveMessage = (newMessage) => {
      const senderId = String(
        newMessage.sender?._id || newMessage.sender
      );

      const receiverId = String(
        newMessage.receiver?._id || newMessage.receiver
      );

      const isCurrentChat =
        (senderId === String(id) &&
          receiverId === String(profileId)) ||
        (senderId === String(profileId) &&
          receiverId === String(id));

      if (!isCurrentChat) return;

      if (senderId === String(id)) {
        markReadMutation.mutate(id, {
          onSuccess: () => {
            socket.emit("messagesRead", {
              senderId: id,
              receiverId: profileId,
            });
          },
        });
      }

      setMessages((prev) => {
        const exists = prev.some(
          (msg) => msg._id === newMessage._id
        );

        if (exists) return prev;

        return [...prev, newMessage];
      });
    };

    socket.on(
      "receiveDirectMessage",
      receiveMessage
    );

    return () => {
      socket.off(
        "receiveDirectMessage",
        receiveMessage
      );
    };
  }, [id, profileId]);

  useEffect(() => {
    messageEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages]);

  const sendMessage = () => {
    if (!message.trim() || !id) return;

    sendMutation.mutate(
      {
        receiverid: id,
        text: message.trim(),
      },
      {
        onSuccess: (savedMessage) => {
          setMessages((prev) => {
            const exists = prev.some(
              (msg) => msg._id === savedMessage._id
            );

            if (exists) return prev;

            return [...prev, savedMessage];
          });

          setMessage("");
        },
      }
    );
  };

  const handleOpenChat = (profileId) => {
    navigate(`/chat/${profileId}`);
    setActiveTab(0);
  };

  const otherPersonName =
    chatUser?.user?.username || "User";

  const otherPersonPic =
    chatUser?.profilepic;

  const tabs = [
    {
      label: "Messages",
      icon: MessageSquare,
    },
    {
      label: "Connections",
      icon: Users,
    },
    {
      label: "Requests",
      icon: UserPlus,
    },
    {
      label: "Find Friends",
      icon: UserPlus,
    },
    {
      label: "Blocked",
      icon: ShieldBan,
    },
  ];

  if (isLoading && id) {
    return (
      <div className="flex h-[80vh] flex-col items-center justify-center gap-3">
        <div className="h-9 w-9 animate-spin rounded-full border-4 border-gray-200 border-t-blue-700" />

        <p className="text-sm text-gray-500">
          Loading conversation...
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto my-5 flex h-[calc(100vh-90px)] w-full max-w-[1100px] flex-col overflow-hidden rounded-[18px] bg-[#f5f7fb] shadow-lg max-md:my-0 max-md:h-[calc(100vh-70px)] max-md:max-w-full max-md:rounded-none">
      <div className="shrink-0 border-b border-gray-200 bg-white">
        <div className="flex items-center gap-3 px-5 py-3">
          {activeTab === 0 && id && (
            <button
              type="button"
              onClick={() => navigate("/friends")}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-50 text-blue-700 transition hover:bg-blue-700 hover:text-white"
            >
              <FaArrowLeft size={15} />
            </button>
          )}

          {activeTab === 0 && id ? (
            <>
              <Avatar
                src={otherPersonPic}
                name={otherPersonName}
                className="h-11 w-11 text-base"
              />

              <div className="min-w-0">
                <h3 className="truncate text-lg font-bold text-gray-800">
                  {otherPersonName}
                </h3>

                <p className="text-xs text-gray-500">
                  Conversation
                </p>
              </div>
            </>
          ) : (
            <div>
              <h2 className="text-xl font-bold text-gray-800">
                Chat
              </h2>

              <p className="text-xs text-gray-500">
                Messages and connections
              </p>
            </div>
          )}
        </div>

        <div className="flex overflow-x-auto border-t border-gray-100">
          {tabs.map((tab, index) => {
            const Icon = tab.icon;
            const isActive = activeTab === index;

            return (
              <button
                key={tab.label}
                type="button"
                onClick={() => setActiveTab(index)}
                className={`relative flex min-h-[52px] min-w-[125px] shrink-0 items-center justify-center gap-2 px-4 text-sm font-semibold transition ${
                  isActive
                    ? "text-blue-600"
                    : "text-slate-500 hover:bg-slate-50 hover:text-slate-700"
                }`}
              >
                <Icon size={17} />

                <span>{tab.label}</span>

                {isActive && (
                  <span className="absolute bottom-0 left-3 right-3 h-[3px] rounded-t-full bg-blue-600" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      <div className="min-h-0 flex-1 overflow-hidden">
        {activeTab === 0 && (
          <div className="flex h-full flex-col bg-[#eef2f8]">
            {!id ? (
              <div className="flex flex-1 items-center justify-center p-5">
                <div className="text-center">
                  <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 text-blue-700">
                    <MessageSquare size={28} />
                  </div>

                  <h3 className="mb-2 text-lg font-semibold text-gray-800">
                    Select a conversation
                  </h3>

                  <p className="mb-5 text-sm text-gray-500">
                    Select a connection to start chatting.
                  </p>

                  <button
                    type="button"
                    onClick={() => setActiveTab(1)}
                    className="rounded-lg bg-blue-700 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-800"
                  >
                    View Connections
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div className="flex-1 overflow-y-auto p-5 max-md:p-3">
                  {messages.length === 0 ? (
                    <div className="flex h-full items-center justify-center text-center">
                      <div>
                        <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-white text-blue-700 shadow-sm">
                          <MessageSquare size={24} />
                        </div>

                        <h3 className="mb-2 font-semibold text-gray-800">
                          No messages yet
                        </h3>

                        <p className="text-sm text-gray-500">
                          Start a conversation.
                        </p>
                      </div>
                    </div>
                  ) : (
                    messages.map((msg, index) => {
                      const isMine =
                        String(
                          msg.sender?._id ||
                            msg.sender
                        ) === String(profileId);

                      const senderName =
                        msg.sender?.user?.username ||
                        "User";

                      const senderPic =
                        msg.sender?.profilepic;

                      return (
                        <div
                          key={msg._id || index}
                          className={`mb-3 flex max-w-[80%] items-end gap-2 ${
                            isMine
                              ? "ml-auto flex-row-reverse"
                              : "mr-auto"
                          }`}
                        >
                          {!isMine && (
                            <Avatar
                              src={senderPic}
                              name={senderName}
                              className="h-8 w-8 text-xs"
                            />
                          )}

                          <div
                            className={`rounded-[18px] px-4 py-3 shadow-sm ${
                              isMine
                                ? "rounded-br-[5px] bg-blue-700 text-white"
                                : "rounded-bl-[5px] bg-white text-gray-800"
                            }`}
                          >
                            {!isMine && (
                              <div className="mb-1 text-xs font-bold text-blue-700">
                                {senderName}
                              </div>
                            )}

                            <p className="whitespace-pre-wrap text-sm">
                              {msg.text}
                            </p>

                            {msg.createdAt && (
                              <span
                                className={`mt-2 block text-right text-[10px] ${
                                  isMine
                                    ? "text-blue-100"
                                    : "text-gray-400"
                                }`}
                              >
                                {new Date(
                                  msg.createdAt
                                ).toLocaleTimeString(
                                  [],
                                  {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  }
                                )}
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    })
                  )}

                  <div ref={messageEndRef} />
                </div>

                <div className="flex items-center gap-3 border-t border-gray-200 bg-white p-3">
                  <input
                    type="text"
                    placeholder="Type your message..."
                    value={message}
                    onChange={(e) =>
                      setMessage(e.target.value)
                    }
                    onKeyDown={(e) => {
                      if (
                        e.key === "Enter" &&
                        !e.shiftKey
                      ) {
                        e.preventDefault();
                        sendMessage();
                      }
                    }}
                    className="h-11 min-w-0 flex-1 rounded-xl border-2 border-gray-200 px-4 text-sm outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                  />

                  <button
                    type="button"
                    onClick={sendMessage}
                    disabled={
                      sendMutation.isPending ||
                      !message.trim()
                    }
                    className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-700 text-white transition hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {sendMutation.isPending ? (
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-blue-200 border-t-white" />
                    ) : (
                      <FaPaperPlane size={16} />
                    )}
                  </button>
                </div>
              </>
            )}
          </div>
        )}

        {activeTab === 1 && (
          <div className="h-full overflow-y-auto bg-[#f5f7fb]">
            <MyConnections
              onOpenChat={handleOpenChat}
            />
          </div>
        )}

        {activeTab === 2 && (
          <div className="h-full overflow-y-auto bg-[#f5f7fb]">
            <PendingRequests />
          </div>
        )}

        {activeTab === 3 && (
          <div className="h-full overflow-y-auto bg-[#f5f7fb]">
            <FindFriends />
          </div>
        )}

        {activeTab === 4 && (
          <div className="h-full overflow-y-auto bg-[#f5f7fb]">
            <Blocked />
          </div>
        )}
      </div>
    </div>
  );
}

export default Chat;