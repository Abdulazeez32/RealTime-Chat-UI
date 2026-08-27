import {
  FaUsers,
  FaComments,
  FaArrowRight,
} from "react-icons/fa";

function GroupCard({ group, onOpenChat }) {
  const groupName =
    group?.groupname ||
    group?.name ||
    "Unnamed Group";

  const members = Array.isArray(group?.members)
    ? group.members
    : [];

  return (
    <div className="group rounded-2xl border border-gray-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <div className="flex items-center gap-4">
        <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white">
          {group?.image ? (
            <img
              src={group.image}
              alt={groupName}
              className="h-full w-full object-cover"
            />
          ) : (
            <FaUsers size={22} />
          )}
        </div>

        <div className="min-w-0 flex-1">
          <h3 className="truncate text-base font-bold text-gray-800">
            {groupName}
          </h3>

          <div className="mt-1 flex items-center gap-1 text-xs text-gray-500">
            <FaUsers size={11} />
            <span>
              {members.length} members
            </span>
          </div>
        </div>
      </div>

      <button
        type="button"
        onClick={() => onOpenChat(group?._id)}
        className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-blue-50 px-4 py-2.5 text-sm font-semibold text-blue-600 transition hover:bg-blue-600 hover:text-white"
      >
        <FaComments size={14} />
        Open Chat
        <FaArrowRight
          size={12}
          className="transition-transform group-hover:translate-x-1"
        />
      </button>
    </div>
  );
}

export default GroupCard;