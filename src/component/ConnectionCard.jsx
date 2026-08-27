import { useState } from "react";
import { FaCommentDots, FaBan } from "react-icons/fa";

function ConnectionCard({
  friend,
  unreadCount = 0,
  onOpenChat,
  onBlock,
}) {
  const [imgError, setImgError] = useState(false);

  const name = friend?.user?.username || "Unknown User";
  const email = friend?.user?.email || "";
  const profilePic = friend?.profilepic;
  const profileId = friend?._id;

  const handleOpenChat = () => {
    if (!profileId) {
      console.error("Profile ID not found:", friend);
      return;
    }

    onOpenChat(profileId);
  };

  const handleBlock = () => {
    if (!profileId) {
      console.error("Profile ID not found:", friend);
      return;
    }

    onBlock(profileId);
  };

  return (
    <div className="flex items-center gap-3 rounded-xl border border-gray-200 bg-white p-3 shadow-sm transition hover:border-blue-200 hover:shadow-md">
      <div className="relative shrink-0">
        <div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-full bg-blue-100 text-lg font-bold text-blue-600">
          {profilePic && !imgError ? (
            <img
              src={profilePic}
              alt={name}
              onError={() => setImgError(true)}
              className="h-full w-full object-cover"
            />
          ) : (
            name.charAt(0).toUpperCase()
          )}
        </div>

        <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white bg-green-500" />
      </div>

      <div className="min-w-0 flex-1">
        <h3 className="truncate text-sm font-semibold text-gray-800">
          {name}
        </h3>

        {email && (
          <p className="truncate text-xs text-gray-500">
            {email}
          </p>
        )}
      </div>

      <div className="flex shrink-0 items-center gap-2">
        {unreadCount > 0 && (
          <span className="flex h-6 min-w-6 items-center justify-center rounded-full bg-red-500 px-1.5 text-xs font-bold text-white">
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}

        <button
          type="button"
          onClick={handleOpenChat}
          className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white transition hover:bg-blue-700"
          title={`Chat with ${name}`}
        >
          <FaCommentDots size={16} />
        </button>

        <button
          type="button"
          onClick={handleBlock}
          className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-500 text-white transition hover:bg-red-600"
          title={`Block ${name}`}
        >
          <FaBan size={15} />
        </button>
      </div>
    </div>
  );
}

export default ConnectionCard;