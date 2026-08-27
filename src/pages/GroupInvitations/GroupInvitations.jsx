import {
  FaCheck,
  FaInbox,
  FaSpinner,
  FaTimes,
} from "react-icons/fa";
import {
  useAcceptGroupInvite,
  useGroupInvites,
  useRejectGroupInvite,
} from "../../hooks/group/useGroups";

function GroupInvitations() {
  const {
    data,
    isLoading,
    isError,
  } = useGroupInvites();

  const acceptMutation = useAcceptGroupInvite();
  const rejectMutation = useRejectGroupInvite();

  const invites = Array.isArray(data)
    ? data
    : data?.invites || data?.data || [];

  const handleAccept = (inviteId) => {
    if (!inviteId) return;

    acceptMutation.mutate(inviteId);
  };

  const handleReject = (inviteId) => {
    if (!inviteId) return;

    rejectMutation.mutate(inviteId);
  };

  if (isLoading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center gap-3 text-gray-500">
        <FaSpinner className="animate-spin text-xl text-blue-600" />
        Loading invitations...
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <p className="text-sm text-red-500">
          Unable to load group invitations.
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-6">
      <div className="mx-auto max-w-4xl">
        <div className="mb-6 flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
            <FaInbox />
          </div>

          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              Group Invitations
            </h1>

            <p className="text-sm text-gray-500">
              Groups that invited you.
            </p>
          </div>
        </div>

        {invites.length === 0 ? (
          <div className="flex min-h-[300px] flex-col items-center justify-center rounded-2xl border border-gray-200 bg-white text-center">
            <FaInbox className="mb-4 text-4xl text-gray-300" />

            <h2 className="text-lg font-semibold text-gray-700">
              No Invitations
            </h2>

            <p className="mt-2 text-sm text-gray-500">
              You don't have any pending group invitations.
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {invites.map((invite) => {
              const group =
                invite?.group ||
                invite?.groupid ||
                {};

              const groupName =
                group?.groupname ||
                group?.name ||
                "Group";

              const groupImage =
                group?.groupimage ||
                group?.profilepic ||
                null;

              const inviteId =
                invite?._id;

              const isThisAccepting =
                acceptMutation.isPending &&
                acceptMutation.variables === inviteId;

              const isThisRejecting =
                rejectMutation.isPending &&
                rejectMutation.variables === inviteId;

              const isProcessing =
                acceptMutation.isPending ||
                rejectMutation.isPending;

              return (
                <div
                  key={inviteId}
                  className="flex items-center gap-4 rounded-xl border border-gray-200 bg-white p-4 shadow-sm"
                >
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-full bg-blue-100 font-bold text-blue-600">
                    {groupImage ? (
                      <img
                        src={groupImage}
                        alt={groupName}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      groupName
                        .charAt(0)
                        .toUpperCase()
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <h3 className="truncate text-sm font-bold text-gray-800">
                      {groupName}
                    </h3>

                    <p className="mt-1 text-xs text-gray-500">
                      You have been invited to join this group.
                    </p>
                  </div>

                  <div className="flex shrink-0 gap-2">
                    <button
                      type="button"
                      disabled={isProcessing}
                      onClick={() =>
                        handleAccept(inviteId)
                      }
                      className="flex h-9 items-center gap-1.5 rounded-lg bg-green-600 px-3 text-xs font-semibold text-white hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {isThisAccepting ? (
                        <>
                          <FaSpinner className="animate-spin" />
                          Accepting...
                        </>
                      ) : (
                        <>
                          <FaCheck />
                          Accept
                        </>
                      )}
                    </button>

                    <button
                      type="button"
                      disabled={isProcessing}
                      onClick={() =>
                        handleReject(inviteId)
                      }
                      className="flex h-9 items-center gap-1.5 rounded-lg border border-red-200 bg-white px-3 text-xs font-semibold text-red-600 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {isThisRejecting ? (
                        <>
                          <FaSpinner className="animate-spin" />
                          Rejecting...
                        </>
                      ) : (
                        <>
                          <FaTimes />
                          Reject
                        </>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default GroupInvitations;