import { useBlockedUsers } from "../../hooks/useBlockedUsers";
import { useUnblockUser } from "../../hooks/useUnblockUser";

function Blocked() {
  const {
    data = [],
    isLoading,
    isError,
  } = useBlockedUsers();

  const {
    mutate: unblockUser,
    isPending: isUnblocking,
  } = useUnblockUser();

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-blue-600" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex h-full items-center justify-center p-5">
        <p className="text-sm text-red-500">
          Failed to load blocked users.
        </p>
      </div>
    );
  }

  if (!data.length) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-center">
          <h3 className="font-semibold text-gray-700">
            No blocked users
          </h3>

          <p className="mt-1 text-sm text-gray-500">
            Users you block will appear here.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3 p-4">
      {data.map((blockedUser) => {
        const name =
          blockedUser?.user?.username ||
          blockedUser?.username ||
          "Unknown User";

        const email =
          blockedUser?.user?.email ||
          blockedUser?.email ||
          "";

        const profileId = blockedUser?._id;

        return (
          <div
            key={profileId}
            className="flex items-center gap-3 rounded-xl border border-gray-200 bg-white p-3 shadow-sm"
          >
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gray-200 text-lg font-bold text-gray-600">
              {name.charAt(0).toUpperCase()}
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

              <p className="mt-1 text-xs text-red-500">
                Blocked
              </p>
            </div>

            <button
              type="button"
              disabled={isUnblocking}
              onClick={() => unblockUser(profileId)}
              className="rounded-lg bg-blue-600 px-3 py-2 text-xs font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isUnblocking ? "Unblocking..." : "Unblock"}
            </button>
          </div>
        );
      })}
    </div>
  );
}

export default Blocked;