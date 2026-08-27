import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaUsers,
  FaPlus,
  FaSearch,
  FaSpinner,
  FaLayerGroup,
  FaUserPlus,
  FaEnvelope,
  FaTimes,
  FaCheck,
  FaUserFriends,
} from "react-icons/fa";
import GroupCard from "../../component/GroupCard";
import { useMyGroups } from "../../hooks/group/useMyGroups";
import { useGroupRequests } from "../../hooks/group/useGroupRequests";
import { useSearchConnectedUsers } from "../../hooks/group/useSearchConnectedUsers";
import { useAddGroupMember } from "../../hooks/group/useAddGroupMember";
import { useGroupExit } from "../../hooks/group/useGroupExit";

function MyGroups() {
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [showInvite, setShowInvite] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [searchUser, setSearchUser] = useState("");
  const [selectedUsers, setSelectedUsers] = useState([]);

  const {
    data,
    isLoading,
    isError,
  } = useMyGroups();

  const groups = Array.isArray(data)
    ? data
    : data?.groups || data?.data || [];

  const filteredGroups = useMemo(() => {
    return groups.filter((group) => {
      const name =
        group?.groupname ||
        group?.groupName ||
        group?.name ||
        "";

      return name
        .toLowerCase()
        .includes(search.toLowerCase());
    });
  }, [groups, search]);

  const {
    data: requestsData,
    isLoading: requestsLoading,
  } = useGroupRequests();

  const requests = Array.isArray(requestsData)
    ? requestsData
    : requestsData?.data || [];

  const {
    data: connectedUsersData,
    isLoading: connectedUsersLoading,
  } = useSearchConnectedUsers(
    selectedGroup?._id,
    searchUser
  );

  const connectedUsers = Array.isArray(connectedUsersData)
    ? connectedUsersData
    : connectedUsersData?.data || [];

  const {
    mutate: addGroupMember,
    isPending: addingMember,
  } = useAddGroupMember();

  const {
    mutate: exitGroup,
    isPending: exitingGroup,
  } = useGroupExit();

  const handleOpenChat = (groupid) => {
    if (!groupid) return;

    navigate(`/group-chat/${groupid}`);
  };

  const handleCreateGroup = () => {
    navigate("/groups/create");
  };

  const handleOpenInvite = (group) => {
    setSelectedGroup(group);
    setSearchUser("");
    setSelectedUsers([]);
    setShowInvite(true);
  };

  const handleCloseInvite = () => {
    setShowInvite(false);
    setSelectedGroup(null);
    setSearchUser("");
    setSelectedUsers([]);
  };

  const getUserId = (user) => {
    return (
      user?._id ||
      user?.id ||
      user?.user?._id ||
      null
    );
  };

  const getUsername = (user) => {
    return (
      user?.user?.username ||
      user?.username ||
      user?.name ||
      "User"
    );
  };

  const getProfileImage = (user) => {
    return (
      user?.profilepic ||
      user?.profileimage ||
      user?.profileImage ||
      user?.image ||
      user?.user?.profilepic ||
      null
    );
  };

  const isUserSelected = (user) => {
    const userId = getUserId(user);

    return selectedUsers.some(
      (selectedUser) =>
        String(getUserId(selectedUser)) === String(userId)
    );
  };

  const handleSelectUser = (user) => {
    const userId = getUserId(user);

    if (!userId) return;

    setSelectedUsers((prev) => {
      const alreadySelected = prev.some(
        (selectedUser) =>
          String(getUserId(selectedUser)) === String(userId)
      );

      if (alreadySelected) {
        return prev.filter(
          (selectedUser) =>
            String(getUserId(selectedUser)) !== String(userId)
        );
      }

      return [...prev, user];
    });
  };

  const handleRemoveSelectedUser = (userId) => {
    setSelectedUsers((prev) =>
      prev.filter(
        (user) =>
          String(getUserId(user)) !== String(userId)
      )
    );
  };

  const handleSendInvite = () => {
    if (!selectedGroup?._id) return;

    if (selectedUsers.length === 0) return;

    const usersToInvite = selectedUsers.filter(
      (user) => getUserId(user)
    );

    if (usersToInvite.length === 0) return;

    let completed = 0;
    let failed = false;

    usersToInvite.forEach((user) => {
      addGroupMember(
        {
          groupId: selectedGroup._id,
          receiverId: getUserId(user),
        },
        {
          onSuccess: () => {
            completed += 1;

            if (
              completed === usersToInvite.length &&
              !failed
            ) {
              setSelectedUsers([]);
              setSearchUser("");
              handleCloseInvite();
                
            }
          },
          onError: () => {
            failed = true;
          },
        }
      );
    });
     handleCloseInvite();
  };

  const handleExitGroup = (group) => {
    if (!group?._id) return;

    const confirmExit = window.confirm(
      `Are you sure you want to leave "${group.groupname}"?`
    );

    if (!confirmExit) return;

    exitGroup(
      {
        groupId: group._id,
      },
      {
        onSuccess: () => {
          window.location.reload();
        },
      }
    );
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 px-4 py-8">
        <div className="mx-auto max-w-5xl">
          <div className="mb-6 h-28 animate-pulse rounded-2xl bg-white shadow-sm" />

          <div className="grid gap-4 sm:grid-cols-2">
            {[1, 2, 3, 4].map((item) => (
              <div
                key={item}
                className="h-28 animate-pulse rounded-2xl bg-white shadow-sm"
              />
            ))}
          </div>

          <div className="flex items-center justify-center gap-2 py-10 text-sm text-gray-500">
            <FaSpinner className="animate-spin text-blue-600" />
            Loading your groups...
          </div>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen bg-slate-50 px-4 py-8">
        <div className="mx-auto flex min-h-[400px] max-w-5xl items-center justify-center">
          <div className="rounded-2xl border border-red-100 bg-white p-8 text-center shadow-sm">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-red-50 text-red-500">
              <FaLayerGroup size={22} />
            </div>

            <h2 className="text-lg font-bold text-gray-800">
              Unable to load groups
            </h2>

            <p className="mt-2 text-sm text-gray-500">
              Something went wrong while loading your groups.
            </p>

            <button
              type="button"
              onClick={() => window.location.reload()}
              className="mt-5 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        {/* HEADER */}
        <div className="mb-6 overflow-hidden rounded-2xl bg-gradient-to-r from-blue-700 to-indigo-600 p-6 text-white shadow-md">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white/15">
                <FaUsers size={25} />
              </div>

              <div>
                <h1 className="text-2xl font-bold">
                  My Groups
                </h1>

                <p className="mt-1 text-sm text-blue-100">
                  Chat and connect with your groups
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleCreateGroup}
              className="flex items-center justify-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-blue-700 shadow-sm transition hover:bg-blue-50"
            >
              <FaPlus size={13} />
              Create Group
            </button>
          </div>
        </div>

        {/* STATISTICS */}
        <div className="mb-5 grid grid-cols-2 gap-3 sm:grid-cols-3">
          <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                <FaUsers />
              </div>

              <div>
                <p className="text-xs text-gray-500">
                  Total Groups
                </p>

                <p className="text-xl font-bold text-gray-800">
                  {groups.length}
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
                <FaLayerGroup />
              </div>

              <div>
                <p className="text-xs text-gray-500">
                  Available
                </p>

                <p className="text-xl font-bold text-gray-800">
                  {filteredGroups.length}
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-50 text-amber-600">
                <FaEnvelope />
              </div>

              <div>
                <p className="text-xs text-gray-500">
                  Group Requests
                </p>

                <p className="text-xl font-bold text-gray-800">
                  {requests.length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* GROUP REQUESTS */}
        {requests.length > 0 && (
          <div className="mb-5 rounded-2xl border border-amber-200 bg-amber-50 p-4">
            <div className="mb-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-amber-100 text-amber-600">
                  <FaEnvelope size={15} />
                </div>

                <div>
                  <h2 className="text-sm font-bold text-gray-800">
                    Group Invitations
                  </h2>

                  <p className="text-xs text-gray-500">
                    You have pending group invitations
                  </p>
                </div>
              </div>

              <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-700">
                {requests.length}
              </span>
            </div>

            <div className="space-y-2">
              {requests.slice(0, 3).map((request) => {
                const requestGroup =
                  request?.group || {};

                const sender =
                  request?.sender || {};

                const senderName =
                  sender?.user?.username ||
                  sender?.username ||
                  "User";

                const groupName =
                  requestGroup?.groupname ||
                  "Group";

                return (
                  <div
                    key={request._id}
                    className="flex items-center justify-between rounded-xl border border-amber-100 bg-white p-3"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full bg-indigo-100">
                        {requestGroup?.groupimage ? (
                          <img
                            src={requestGroup.groupimage}
                            alt={groupName}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <FaUsers className="text-indigo-500" />
                        )}
                      </div>

                      <div>
                        <p className="text-sm font-semibold text-gray-800">
                          {groupName}
                        </p>

                        <p className="text-xs text-gray-500">
                          Invited by {senderName}
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() =>
                        navigate("/group-requests")
                      }
                      className="rounded-lg bg-amber-500 px-3 py-2 text-xs font-semibold text-white hover:bg-amber-600"
                    >
                      View
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* SEARCH GROUP */}
        {groups.length > 0 && (
          <div className="mb-5">
            <div className="relative">
              <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />

              <input
                type="text"
                value={search}
                onChange={(e) =>
                  setSearch(e.target.value)
                }
                placeholder="Search your groups..."
                className="w-full rounded-xl border border-gray-200 bg-white py-3 pl-11 pr-4 text-sm text-gray-700 outline-none transition placeholder:text-gray-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-50"
              />
            </div>
          </div>
        )}

        {/* GROUP TITLE */}
        {groups.length > 0 && (
          <div className="mb-3 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-gray-800">
                Your Groups
              </h2>

              <p className="text-xs text-gray-500">
                Select a group to start chatting
              </p>
            </div>

            <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-600">
              {filteredGroups.length} Groups
            </span>
          </div>
        )}

        {/* GROUP LIST */}
        {filteredGroups.length > 0 ? (
          <div className="grid gap-3 sm:grid-cols-2">
            {filteredGroups.map((group) => (
              <div
                key={group._id}
                className="relative"
              >
                <GroupCard
                  group={group}
                  onOpenChat={handleOpenChat}
                />

                <div className="mt-2 flex gap-2">
                  <button
                    type="button"
                    onClick={() =>
                      handleOpenInvite(group)
                    }
                    className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-blue-200 bg-blue-50 px-3 py-2 text-xs font-semibold text-blue-600 transition hover:bg-blue-100"
                  >
                    <FaUserPlus size={12} />
                    Invite Member
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      handleExitGroup(group)
                    }
                    disabled={exitingGroup}
                    className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs font-semibold text-red-600 transition hover:bg-red-100 disabled:opacity-50"
                  >
                    Leave
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : groups.length > 0 ? (
          <div className="rounded-2xl border border-gray-200 bg-white px-6 py-12 text-center shadow-sm">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-gray-100 text-gray-400">
              <FaSearch size={20} />
            </div>

            <h2 className="text-lg font-semibold text-gray-700">
              No groups found
            </h2>

            <p className="mt-2 text-sm text-gray-500">
              No group matches "{search}".
            </p>

            <button
              type="button"
              onClick={() => setSearch("")}
              className="mt-4 text-sm font-semibold text-blue-600 hover:text-blue-700"
            >
              Clear Search
            </button>
          </div>
        ) : (
          <div className="rounded-2xl border border-gray-200 bg-white px-6 py-14 text-center shadow-sm">
            <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-blue-50 text-blue-600">
              <FaUsers size={30} />
            </div>

            <h2 className="text-xl font-bold text-gray-800">
              No Groups Yet
            </h2>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-gray-500">
              You haven't joined or created any groups yet.
              Create a group and start chatting with your friends.
            </p>

            <button
              type="button"
              onClick={handleCreateGroup}
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
            >
              <FaPlus size={13} />
              Create Your First Group
            </button>
          </div>
        )}
      </div>

      {/* INVITE MEMBER MODAL */}
      {showInvite && selectedGroup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="flex h-[90vh] max-h-[750px] w-full max-w-md flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">
            {/* MODAL HEADER */}
            <div className="flex shrink-0 items-center justify-between border-b border-gray-200 px-5 py-4">
              <div>
                <h2 className="text-base font-bold text-gray-800">
                  Invite Members
                </h2>

                <p className="mt-1 text-xs text-gray-500">
                  Select members to invite to{" "}
                  <span className="font-semibold text-blue-600">
                    {selectedGroup.groupname}
                  </span>
                </p>
              </div>

              <button
                type="button"
                onClick={handleCloseInvite}
                className="rounded-full p-2 text-gray-500 transition hover:bg-gray-100"
              >
                <FaTimes />
              </button>
            </div>

            {/* SEARCH SECTION */}
            <div className="shrink-0 border-b border-gray-100 p-4">
              <div className="relative">
                <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />

                <input
                  type="text"
                  value={searchUser}
                  onChange={(e) =>
                    setSearchUser(e.target.value)
                  }
                  placeholder="Search connected users..."
                  autoFocus
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 py-3 pl-10 pr-4 text-sm outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-50"
                />
              </div>

              <div className="mt-3 flex items-center gap-2 rounded-lg bg-blue-50 px-3 py-2">
                <FaUserFriends className="shrink-0 text-blue-500" />

                <p className="text-xs text-blue-600">
                  Select multiple connected users to invite.
                </p>
              </div>
            </div>

            {/* SCROLLABLE USER LIST */}
            <div className="min-h-0 flex-1 overflow-y-auto px-4 py-3">
              {connectedUsersLoading ? (
                <div className="flex flex-col items-center justify-center py-10">
                  <FaSpinner className="animate-spin text-blue-600" />

                  <p className="mt-2 text-xs text-gray-400">
                    Searching users...
                  </p>
                </div>
              ) : connectedUsers.length === 0 ? (
                <div className="py-10 text-center">
                  <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 text-gray-400">
                    <FaUsers />
                  </div>

                  <p className="text-sm font-medium text-gray-600">
                    No users found
                  </p>

                  <p className="mt-1 text-xs text-gray-400">
                    Try another username
                  </p>
                </div>
              ) : (
                <div className="space-y-1">
                  {connectedUsers.map((user) => {
                    const userId = getUserId(user);
                    const username = getUsername(user);
                    const image = getProfileImage(user);
                    const isSelected =
                      isUserSelected(user);

                    return (
                      <button
                        key={userId}
                        type="button"
                        onClick={() =>
                          handleSelectUser(user)
                        }
                        className={`flex w-full items-center gap-3 rounded-xl p-3 text-left transition ${
                          isSelected
                            ? "bg-blue-50 ring-1 ring-blue-200"
                            : "hover:bg-gray-50"
                        }`}
                      >
                        {/* USER IMAGE */}
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-gray-100">
                          {image ? (
                            <img
                              src={image}
                              alt={username}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <span className="font-semibold text-gray-500">
                              {username
                                .charAt(0)
                                .toUpperCase()}
                            </span>
                          )}
                        </div>

                        {/* USER DETAILS */}
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-semibold text-gray-700">
                            {username}
                          </p>

                          {user?.user?.email && (
                            <p className="truncate text-xs text-gray-400">
                              {user.user.email}
                            </p>
                          )}
                        </div>

                        {/* CHECK */}
                        <div
                          className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border ${
                            isSelected
                              ? "border-blue-600 bg-blue-600 text-white"
                              : "border-gray-300 bg-white"
                          }`}
                        >
                          {isSelected && (
                            <FaCheck size={11} />
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* SELECTED USERS */}
            {selectedUsers.length > 0 && (
              <div className="max-h-28 shrink-0 overflow-y-auto border-t border-gray-100 bg-slate-50 px-4 py-2">
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-xs font-semibold text-gray-600">
                    Selected Members
                  </span>

                  <span className="rounded-full bg-blue-100 px-2 py-0.5 text-[10px] font-semibold text-blue-600">
                    {selectedUsers.length}
                  </span>
                </div>

                <div className="flex flex-wrap gap-2">
                  {selectedUsers.map((user) => {
                    const userId = getUserId(user);
                    const username = getUsername(user);

                    return (
                      <div
                        key={userId}
                        className="flex items-center gap-1.5 rounded-full border border-blue-100 bg-white px-2 py-1"
                      >
                        <span className="max-w-[100px] truncate text-xs font-medium text-gray-700">
                          {username}
                        </span>

                        <button
                          type="button"
                          onClick={() =>
                            handleRemoveSelectedUser(
                              userId
                            )
                          }
                          className="text-gray-400 hover:text-red-500"
                        >
                          <FaTimes size={10} />
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* ACTIONS */}
            <div className="shrink-0 border-t border-gray-200 bg-white p-4">
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={handleCloseInvite}
                  className="flex-1 rounded-xl border border-gray-200 px-4 py-3 text-sm font-semibold text-gray-600 transition hover:bg-gray-50"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={handleSendInvite}
                  disabled={
                    selectedUsers.length === 0 ||
                    addingMember
                  }
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {addingMember ? (
                    <>
                      <FaSpinner className="animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <FaUserPlus />
                      Send{" "}
                      {selectedUsers.length > 0
                        ? `(${selectedUsers.length})`
                        : "Invites"}
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default MyGroups;