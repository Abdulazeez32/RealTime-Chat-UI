import { useState, useMemo, useEffect } from "react";
import { useConnections } from "../../hooks/useConnections";
import { useUnreadCount } from "../../hooks/useUnreadCount";
import { useBlockUser } from "../../hooks/useBlockUser";
import ConnectionCard from "../../component/ConnectionCard";
import { socket } from "../../../socket";
import { FaUserFriends, FaSearch, FaSpinner } from "react-icons/fa";

function MyConnections({ onOpenChat }) {
  const { data, isLoading } = useConnections();
  const { data: unreadData = [] } = useUnreadCount();
  const { mutate: blockUser, isPending: isBlocking } = useBlockUser();

  const [search, setSearch] = useState("");
  const [unreadMap, setUnreadMap] = useState({});

  useEffect(() => {
    if (!Array.isArray(unreadData)) return;

    const map = {};

    unreadData.forEach((item) => {
      map[item._id] = item.unreadCount;
    });

    setUnreadMap(map);
  }, [unreadData]);

  useEffect(() => {
    const profileId = localStorage.getItem("profileid");

    if (!profileId) return;

    if (!socket.connected) {
      socket.connect();
    }

    socket.emit("register", profileId);

    const handleUnreadUpdated = ({ sender, unreadCount }) => {
      setUnreadMap((prev) => ({
        ...prev,
        [sender]: unreadCount,
      }));
    };

    const handleMessagesRead = ({ senderId }) => {
      setUnreadMap((prev) => ({
        ...prev,
        [senderId]: 0,
      }));
    };

    socket.on("unreadUpdated", handleUnreadUpdated);
    socket.on("messagesRead", handleMessagesRead);

    return () => {
      socket.off("unreadUpdated", handleUnreadUpdated);
      socket.off("messagesRead", handleMessagesRead);
    };
  }, []);

  const friends = useMemo(() => {
    if (Array.isArray(data)) return data;
    if (Array.isArray(data?.connections)) return data.connections;
    if (Array.isArray(data?.data)) return data.data;
    return [];
  }, [data]);

  const uniqueFriends = useMemo(() => {
    return [
      ...new Map(
        friends.map((friend) => [friend._id, friend])
      ).values(),
    ];
  }, [friends]);

  const filteredFriends = useMemo(() => {
    return uniqueFriends.filter((friend) =>
      friend?.user?.username
        ?.toLowerCase()
        .includes(search.toLowerCase())
    );
  }, [uniqueFriends, search]);

  const sortedFriends = useMemo(() => {
    return [...filteredFriends].sort((a, b) => {
      const unreadA = unreadMap[a._id] || 0;
      const unreadB = unreadMap[b._id] || 0;

      if (unreadA > 0 && unreadB === 0) return -1;
      if (unreadA === 0 && unreadB > 0) return 1;

      return unreadB - unreadA;
    });
  }, [filteredFriends, unreadMap]);

  const handleOpenChat = (profileId) => {
    if (!profileId) {
      console.error("Profile ID not found");
      return;
    }

    if (onOpenChat) {
      onOpenChat(profileId);
    }
  };

  const handleBlock = (profileId) => {
    if (!profileId) {
      console.error("Profile ID not found");
      return;
    }

    console.log("Blocking profile:", profileId);

    blockUser(profileId);
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center gap-3 text-gray-500">
        <FaSpinner className="animate-spin text-2xl text-blue-500" />
        <span>Loading friends...</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-6">
      <div className="mx-auto max-w-4xl">
        <div className="mb-6 flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
            <FaUserFriends />
          </div>

          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              Friends List
            </h1>

            <p className="text-sm text-gray-500">
              Start a conversation with your friends
            </p>
          </div>
        </div>

        <div className="relative mb-5">
          <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />

          <input
            type="text"
            placeholder="Search friends..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-gray-200 bg-white py-3 pl-11 pr-4 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          />
        </div>

        {sortedFriends.length > 0 ? (
          <div className="flex flex-col gap-3">
            {sortedFriends.map((friend) => (
              <ConnectionCard
                key={friend._id}
                friend={friend}
                unreadCount={unreadMap[friend._id] || 0}
                onOpenChat={handleOpenChat}
                onBlock={handleBlock}
                isBlocking={isBlocking}
              />
            ))}
          </div>
        ) : (
          <div className="flex min-h-[300px] flex-col items-center justify-center rounded-xl border border-gray-200 bg-white text-center">
            <FaUserFriends className="mb-4 text-4xl text-gray-300" />

            <h2 className="text-lg font-semibold text-gray-700">
              No Friends Found
            </h2>

            <p className="mt-2 text-sm text-gray-500">
              {search
                ? "No friends match your search query."
                : "You don't have any connections added yet."}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default MyConnections;