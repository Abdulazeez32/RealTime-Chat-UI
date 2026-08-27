import { usePendingRequests } from "../../hooks/usePendingRequests";
import RequestCard from "../../component/RequestCard/RequestCard";
import { Users, UserPlus, Inbox } from "lucide-react";
import {
  Box,
  CircularProgress,
  Typography,
} from "@mui/material";

function PendingRequests() {
  const {
    data,
    isLoading,
    isError,
    error,
  } = usePendingRequests();

  const requests = Array.isArray(data)
    ? data
    : Array.isArray(data?.requests)
    ? data.requests
    : Array.isArray(data?.data)
    ? data.data
    : [];

  if (isLoading) {
    return (
      <Box className="flex h-full min-h-[500px] flex-col items-center justify-center gap-3 bg-slate-50">
        <CircularProgress
          size={38}
          thickness={4}
        />

        <Typography
          variant="body2"
          className="font-medium text-slate-500"
        >
          Loading connection requests...
        </Typography>
      </Box>
    );
  }

  if (isError) {
    return (
      <Box className="flex h-full min-h-[500px] flex-col items-center justify-center bg-slate-50 px-5 text-center">
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-50 text-red-500">
          <Inbox size={28} />
        </div>

        <Typography
          variant="h6"
          className="mb-2 font-bold text-slate-800"
        >
          Unable to load requests
        </Typography>

        <Typography
          variant="body2"
          className="max-w-[400px] text-slate-500"
        >
          {error?.response?.data?.message ||
            error?.message ||
            "Something went wrong while loading connection requests."}
        </Typography>
      </Box>
    );
  }

  return (
    <div className="h-full min-h-0 overflow-y-auto bg-slate-50 px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-[800px]">
        {/* Header */}
        <div className="mb-7 flex flex-col items-center text-center">
          <div className="mb-4 flex h-[68px] w-[68px] items-center justify-center rounded-full bg-blue-600 text-white shadow-[0_12px_30px_rgba(37,99,235,0.20)]">
            <Users size={30} />
          </div>

          <h1 className="m-0 text-[28px] font-extrabold tracking-tight text-slate-900 sm:text-[32px]">
            Connection Requests
          </h1>

          <p className="mt-2 text-sm text-slate-500 sm:text-[15px]">
            Accept invitations and grow your network
          </p>
        </div>

        {requests.length > 0 ? (
          <div className="rounded-[22px] border border-blue-100 bg-white p-4 shadow-[0_12px_35px_rgba(37,99,235,0.08)] sm:p-6">
            {/* Request count */}
            <div className="mb-5 flex items-center justify-between gap-3">
              <div className="inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-600">
                <UserPlus size={16} />

                <span>
                  {requests.length} New Invitation
                  {requests.length > 1 ? "s" : ""}
                </span>
              </div>

              <span className="text-xs font-medium text-slate-400">
                Pending
              </span>
            </div>

            {/* Request list */}
            <div className="flex max-h-[calc(100vh-310px)] min-h-[150px] flex-col gap-3 overflow-y-auto pr-1 [&::-webkit-scrollbar]:w-[6px] [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-blue-300 [&::-webkit-scrollbar-track]:bg-transparent">
              {requests.map((request) => (
                <RequestCard
                  key={request._id}
                  request={request}
                />
              ))}
            </div>
          </div>
        ) : (
          <div className="mx-auto flex max-w-[500px] flex-col items-center rounded-[22px] border border-blue-100 bg-white px-6 py-12 text-center shadow-[0_12px_35px_rgba(37,99,235,0.08)]">
            <div className="mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-blue-50 text-blue-500">
              <Inbox size={38} />
            </div>

            <h2 className="m-0 text-xl font-bold text-slate-900">
              No Connection Requests
            </h2>

            <p className="mt-2 max-w-[380px] text-sm leading-6 text-slate-500">
              When someone sends you a connection request,
              it will appear here.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default PendingRequests;