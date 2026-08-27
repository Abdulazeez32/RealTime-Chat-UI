import { useState } from "react";
import { Search, UserPlus, Check, LoaderCircle } from "lucide-react";
import { useSearchUsers } from "../../hooks/useSearchUsers";
import { useSendRequest } from "../../hooks/useSendRequest";

function FindFriends() {
  const [search, setSearch] = useState("");
  const [sentRequests, setSentRequests] = useState([]);

  const {
    data,
    isLoading,
    isError,
    error,
  } = useSearchUsers(search);

  const {
    mutate: sendRequest,
    isPending,
  } = useSendRequest();

  const profileId = localStorage.getItem("profileid");

  const users = Array.isArray(data)
    ? data
    : Array.isArray(data?.users)
      ? data.users
      : Array.isArray(data?.data)
        ? data.data
        : [];

  const handleSendRequest = (userId) => {
    if (!userId) {
      console.error("Profile ID not found");
      return;
    }

    sendRequest(userId, {
      onSuccess: () => {
        setSentRequests((prev) => [...prev, userId]);
      },
      onError: (error) => {
        console.error(
          error?.response?.data || error.message
        );
      },
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-6">
      <div className="mx-auto max-w-4xl">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800">
            Find Friends
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Search for people and send them a connection request.
          </p>
        </div>

        <div className="relative mb-6">
          <Search
            size={19}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
          />

          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by username..."
            className="w-full rounded-xl border border-gray-200 bg-white py-3.5 pl-11 pr-4 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          />
        </div>

        {isLoading && search.trim() && (
          <div className="flex items-center justify-center gap-2 py-10 text-sm text-gray-500">
            <LoaderCircle
              size={20}
              className="animate-spin text-blue-600"
            />
            Searching users...
          </div>
        )}

        {isError && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-600">
            {error?.response?.data || "Failed to search users."}
          </div>
        )}

        {!search.trim() && (
          <div className="flex min-h-[300px] flex-col items-center justify-center rounded-xl border border-gray-200 bg-white text-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 text-blue-600">
              <Search size={28} />
            </div>

            <h2 className="text-lg font-semibold text-gray-700">
              Find your friends
            </h2>

            <p className="mt-2 text-sm text-gray-500">
              Enter a username to search for people.
            </p>
          </div>
        )}

        {search.trim() && !isLoading && users.length === 0 && (
          <div className="flex min-h-[250px] flex-col items-center justify-center rounded-xl border border-gray-200 bg-white text-center">
            <Search className="mb-3 text-gray-300" size={40} />

            <h2 className="text-lg font-semibold text-gray-700">
              No users found
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Try searching with another username.
            </p>
          </div>
        )}

        {users.length > 0 && (
          <div className="flex flex-col gap-3">
            {users.map((user) => {
              const userProfile = user?.user || user;

              const userId =
                user?._id ||
                user?.profileId ||
                user?.profile?._id;

              const username =
                userProfile?.username || "Unknown User";

              const email = userProfile?.email || "";

              const profilePic =
                user?.profilepic ||
                user?.profile?.profilepic;

              const isSelf =
                String(userId) === String(profileId);

              const requestSent = sentRequests.includes(userId);

              return (
                <div
                  key={userId}
                  className="flex items-center gap-3 rounded-xl border border-gray-200 bg-white p-3 shadow-sm transition hover:border-blue-200 hover:shadow-md"
                >
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-full bg-blue-100 text-lg font-bold text-blue-600">
                    {profilePic ? (
                      <img
                        src={profilePic}
                        alt={username}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      username
                        .charAt(0)
                        .toUpperCase()
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <h3 className="truncate text-sm font-semibold text-gray-800">
                      {username}
                    </h3>

                    {email && (
                      <p className="truncate text-xs text-gray-500">
                        {email}
                      </p>
                    )}
                  </div>

                  {!isSelf && (
                    <button
                      type="button"
                      disabled={
                        isPending || requestSent
                      }
                      onClick={() =>
                        handleSendRequest(userId)
                      }
                      className={`flex shrink-0 items-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold text-white transition ${
                        requestSent
                          ? "bg-green-600"
                          : "bg-blue-600 hover:bg-blue-700"
                      } disabled:cursor-not-allowed disabled:opacity-70`}
                    >
                      {requestSent ? (
                        <>
                          <Check size={15} />
                          Request Sent
                        </>
                      ) : isPending ? (
                        <>
                          <LoaderCircle
                            size={15}
                            className="animate-spin"
                          />
                          Sending...
                        </>
                      ) : (
                        <>
                          <UserPlus size={15} />
                          Add Friend
                        </>
                      )}
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default FindFriends;