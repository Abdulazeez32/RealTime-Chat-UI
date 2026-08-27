import { useState } from "react";
import { Check, X } from "lucide-react";
import { useAcceptRequest } from "../../hooks/useAcceptRequest";
import { useRejectRequest } from "../../hooks/useRejectRequest";

function RequestCard({ request }) {
  const [imgError, setImgError] = useState(false);

  const {
    mutate: acceptRequest,
    isPending: isAccepting,
  } = useAcceptRequest();

  const {
    mutate: rejectRequest,
    isPending: isRejecting,
  } = useRejectRequest();

  const user = request?.user || request?.sender || request?.from;

  const name = user?.username || "Unknown User";
  const email = user?.email || "";
  const profilePic = request?.profilepic || user?.profilepic;

  const requestId = request?._id;

  const isLoading = isAccepting || isRejecting;

  const handleAccept = () => {
  console.log("Accept clicked");
  console.log("Request:", request);
  console.log("Request ID:", requestId);

  if (!requestId) {
    console.error("Request ID not found");
    return;
  }

  acceptRequest(requestId);
};

const handleReject = () => {
  console.log("Reject clicked");
  console.log("Request:", request);
  console.log("Request ID:", requestId);

  if (!requestId) {
    console.error("Request ID not found");
    return;
  }

  rejectRequest(requestId);
};

  return (
    <div className="flex items-center gap-3 rounded-xl border border-gray-200 bg-white p-3 shadow-sm transition hover:border-blue-200 hover:shadow-md">
      <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-full bg-blue-100 text-lg font-bold text-blue-600">
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

      <div className="min-w-0 flex-1">
        <h3 className="truncate text-sm font-semibold text-gray-800">
          {name}
        </h3>

        {email && (
          <p className="truncate text-xs text-gray-500">
            {email}
          </p>
        )}

        <p className="mt-1 text-xs text-gray-400">
          Sent you a connection request
        </p>
      </div>

      <div className="flex shrink-0 items-center gap-2">
        <button
          type="button"
          disabled={isLoading}
          onClick={handleAccept}
          className="flex h-9 items-center gap-1.5 rounded-lg bg-green-600 px-3 text-xs font-semibold text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isAccepting ? (
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-green-200 border-t-white" />
          ) : (
            <Check size={15} />
          )}

          <span>
            {isAccepting ? "Accepting..." : "Accept"}
          </span>
        </button>

        <button
          type="button"
          disabled={isLoading}
          onClick={handleReject}
          className="flex h-9 items-center gap-1.5 rounded-lg border border-red-200 bg-white px-3 text-xs font-semibold text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isRejecting ? (
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-red-200 border-t-red-600" />
          ) : (
            <X size={15} />
          )}

          <span>
            {isRejecting ? "Rejecting..." : "Reject"}
          </span>
        </button>
      </div>
    </div>
  );
}

export default RequestCard;