import { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { FaArrowLeft, FaPaperPlane } from "react-icons/fa";
import { useGroupDetails } from "../../hooks/group/useGroupDetails";
import { useGroupMessages } from "../../hooks/group/useGroupMessages";
import { useSendGroupMessage } from "../../hooks/group/useSendGroupMessage";
import { socket } from "../../../socket";

function Avatar({ src, name, className = "" }) {
  const [imgError, setImgError] = useState(false);

  return (
    <div
      className={`flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-slate-200 ${className}`}
    >
      {src && !imgError ? (
        <img
          src={src}
          alt={name || "User"}
          onError={() => setImgError(true)}
          className="h-full w-full object-cover"
        />
      ) : (
        <span className="text-sm font-semibold text-slate-500">
          {(name || "G").charAt(0).toUpperCase()}
        </span>
      )}
    </div>
  );
}

export default function GroupChat() {
  const { groupid } = useParams();
  const navigate = useNavigate();

  const profileid = localStorage.getItem("profileid");

  const [text, setText] = useState("");
  const [messages, setMessages] = useState([]);

  const messageEndRef = useRef(null);
  const inputRef = useRef(null);

  const {
    data: groupData,
    isLoading: isGroupLoading,
    isError: isGroupError,
  } = useGroupDetails(groupid);

  const {
    data: groupMessagesData,
    isLoading: isMessagesLoading,
    isError: isMessagesError,
  } = useGroupMessages(groupid);

  const { mutate: sendGroupMessage, isPending: sendingMessage } =
    useSendGroupMessage();

  const group = groupData || {};

  const groupMessages = Array.isArray(groupMessagesData)
    ? groupMessagesData
    : groupMessagesData?.data || [];

  useEffect(() => {
    if (!Array.isArray(groupMessages)) {
      return;
    }

    setMessages(groupMessages);
  }, [groupMessages]);

  useEffect(() => {
    if (!groupid) {
      return;
    }

    console.log("Joining group:", groupid);

    if (!socket.connected) {
      socket.connect();
    }

    socket.emit("joingroup", groupid);

    const receiveMessage = (newMessage) => {
      console.log("Received group message:", newMessage);

      if (!newMessage) {
        return;
      }

      setMessages((previousMessages) => {
        const newId = newMessage?._id || newMessage?.id;

        const exists = previousMessages.some((msg) => {
          const existingId = msg?._id || msg?.id;

          return (
            newId &&
            existingId &&
            String(existingId) === String(newId)
          );
        });

        if (exists) {
          return previousMessages;
        }

        return [...previousMessages, newMessage];
      });
    };

    socket.on("receivemessage", receiveMessage);

    return () => {
      socket.off("receivemessage", receiveMessage);
    };
  }, [groupid]);

  useEffect(() => {
    if (!messageEndRef.current) {
      return;
    }

    messageEndRef.current.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages]);

  const handleBack = () => {
    console.log("Back button clicked");

    navigate(-1);
  };

  const handleSend = (event) => {
    if (event) {
      event.preventDefault();
    }

    console.log("Send button clicked");

    const trimmedText = text.trim();

    console.log("Message:", trimmedText);
    console.log("Group ID:", groupid);

    if (!trimmedText) {
      console.log("Message is empty");
      return;
    }

    if (!groupid) {
      console.log("Group ID is missing");
      toast.error("Group ID is missing");
      return;
    }

    if (sendingMessage) {
      console.log("Message is already being sent");
      return;
    }

    console.log("Calling sendGroupMessage...");

    sendGroupMessage(
      {
        groupid: groupid,
        text: trimmedText,
      },
      {
        onSuccess: (savedMessage) => {
          console.log("Message successfully sent:", savedMessage);

          if (!savedMessage) {
            setText("");
            return;
          }

          setMessages((previousMessages) => {
            const savedId =
              savedMessage?._id || savedMessage?.id;

            const exists = previousMessages.some((msg) => {
              const existingId = msg?._id || msg?.id;

              return (
                savedId &&
                existingId &&
                String(existingId) === String(savedId)
              );
            });

            if (exists) {
              return previousMessages;
            }

            return [...previousMessages, savedMessage];
          });

          setText("");

          setTimeout(() => {
            messageEndRef.current?.scrollIntoView({
              behavior: "smooth",
            });
          }, 100);
        },

        onError: (error) => {
          console.error("Send message error:", error);

          toast.error(
            error?.response?.data?.message ||
              error?.response?.data?.error ||
              error?.response?.data ||
              error?.message ||
              "Unable to send message"
          );
        },
      }
    );
  };

  const getSenderId = (message) => {
    return (
      message?.sender?._id ||
      message?.sender?.id ||
      message?.sender
    );
  };

  const getSenderName = (message) => {
    return (
      message?.sender?.user?.username ||
      message?.sender?.fullname ||
      message?.sender?.username ||
      "Unknown"
    );
  };

  const getSenderImage = (message) => {
    return (
      message?.sender?.profilepic ||
      message?.sender?.profileImage ||
      null
    );
  };

  const isMyMessage = (message) => {
    const senderId = getSenderId(message);

    if (!senderId || !profileid) {
      return false;
    }

    return String(senderId) === String(profileid);
  };

  if (isGroupLoading || isMessagesLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-100">
        <div className="text-center">
          <div className="mx-auto mb-3 h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-indigo-600" />

          <p className="text-sm text-slate-500">
            Loading Group Chat...
          </p>
        </div>
      </div>
    );
  }

  if (isGroupError || !group) {
    return (
      <div className="flex h-screen flex-col items-center justify-center bg-slate-100">
        <p className="mb-4 text-sm text-red-500">
          Unable to load group.
        </p>

        <button
          type="button"
          onClick={handleBack}
          className="rounded-lg bg-indigo-600 px-5 py-2 text-sm font-medium text-white"
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-slate-100">
      {/* HEADER */}
      <header className="relative z-50 flex h-[70px] shrink-0 items-center border-b border-slate-200 bg-white px-4 shadow-sm">
        <div className="flex min-w-0 items-center gap-3">
          <button
            type="button"
            onClick={handleBack}
            className="relative z-50 flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-full p-2 text-slate-600 transition hover:bg-slate-100 active:bg-slate-200"
            aria-label="Go back"
          >
            <FaArrowLeft size={18} />
          </button>

          <Avatar
            src={group.groupimage}
            name={group.groupname}
            className="h-11 w-11 bg-indigo-100"
          />

          <div className="min-w-0">
            <h3 className="truncate text-base font-semibold text-slate-800">
              {group.groupname || "Group Chat"}
            </h3>

            <span className="text-xs text-slate-500">
              {group.members?.length || 0} Members
            </span>
          </div>
        </div>
      </header>

      {/* MESSAGES */}
      <main className="relative z-0 flex-1 overflow-y-auto bg-slate-50 px-4 py-5">
        <div className="mx-auto flex min-h-full max-w-4xl flex-col space-y-4">
          {isMessagesError ? (
            <div className="flex flex-1 items-center justify-center text-center">
              <div>
                <p className="text-sm font-medium text-red-500">
                  Unable to load messages
                </p>

                <p className="mt-1 text-xs text-slate-400">
                  Please try again later.
                </p>
              </div>
            </div>
          ) : messages.length === 0 ? (
            <div className="flex flex-1 flex-col items-center justify-center py-20 text-center">
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-indigo-100">
                <FaPaperPlane
                  size={20}
                  className="text-indigo-600"
                />
              </div>

              <h3 className="text-base font-semibold text-slate-700">
                No Messages Yet
              </h3>

              <p className="mt-1 text-sm text-slate-400">
                Start the conversation with your group.
              </p>
            </div>
          ) : (
            messages.map((msg, index) => {
              const mine = isMyMessage(msg);

              const senderName = getSenderName(msg);
              const senderImage = getSenderImage(msg);

              return (
                <div
                  key={msg?._id || msg?.id || index}
                  className={`flex w-full items-end gap-2 ${
                    mine
                      ? "justify-end"
                      : "justify-start"
                  }`}
                >
                  {/* RECEIVER AVATAR */}
                  {!mine && (
                    <Avatar
                      src={senderImage}
                      name={senderName}
                      className="h-9 w-9"
                    />
                  )}

                  <div
                    className={`flex max-w-[75%] flex-col ${
                      mine
                        ? "items-end"
                        : "items-start"
                    }`}
                  >
                    {/* RECEIVER NAME */}
                    {!mine && (
                      <span className="mb-1 px-1 text-[11px] font-semibold text-indigo-600">
                        {senderName}
                      </span>
                    )}

                    {/* MESSAGE */}
                    <div
                      className={`rounded-2xl px-4 py-2.5 text-sm shadow-sm ${
                        mine
                          ? "rounded-br-md bg-indigo-600 text-white"
                          : "rounded-bl-md bg-white text-slate-700"
                      }`}
                    >
                      <p className="break-words whitespace-pre-wrap">
                        {msg?.text || ""}
                      </p>

                      <div
                        className={`mt-1 text-[10px] ${
                          mine
                            ? "text-right text-indigo-200"
                            : "text-left text-slate-400"
                        }`}
                      >
                        {msg?.createdAt
                          ? new Date(
                              msg.createdAt
                            ).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })
                          : ""}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}

          <div ref={messageEndRef} />
        </div>
      </main>

      {/* INPUT */}
      <footer className="relative z-50 border-t border-slate-200 bg-white p-3">
        <form
          onSubmit={handleSend}
          className="mx-auto flex max-w-4xl items-center gap-2"
        >
          <input
            ref={inputRef}
            type="text"
            placeholder="Type your message..."
            value={text}
            onChange={(event) => {
              setText(event.target.value);
            }}
            disabled={sendingMessage}
            className="flex-1 rounded-full border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-indigo-400 focus:bg-white disabled:cursor-not-allowed disabled:opacity-60"
          />

          <button
            type="submit"
            disabled={
              sendingMessage ||
              !text.trim()
            }
            className="relative z-50 flex h-11 w-11 shrink-0 cursor-pointer items-center justify-center rounded-full bg-indigo-600 text-white transition hover:bg-indigo-700 active:bg-indigo-800 disabled:cursor-not-allowed disabled:opacity-50"
            aria-label="Send message"
          >
            {sendingMessage ? (
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/40 border-t-white" />
            ) : (
              <FaPaperPlane size={16} />
            )}
          </button>
        </form>
      </footer>
    </div>
  );
}