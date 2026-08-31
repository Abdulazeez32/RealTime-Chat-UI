import React, { useState, useMemo } from "react";
import {
  Avatar,
  Badge,
  IconButton,
  Tooltip,
} from "@mui/material";

// ============================================================
// MUI ICONS
// ============================================================
import GroupsRounded from "@mui/icons-material/GroupsRounded";
import PeopleAltRounded from "@mui/icons-material/PeopleAltRounded";
import MarkChatUnreadRounded from "@mui/icons-material/MarkChatUnreadRounded";
import NotificationsRounded from "@mui/icons-material/NotificationsRounded";
import NotificationsActiveRounded from "@mui/icons-material/NotificationsActiveRounded";
import NotificationsNoneRounded from "@mui/icons-material/NotificationsNoneRounded";
import ChatBubbleRounded from "@mui/icons-material/ChatBubbleRounded";
import SearchRounded from "@mui/icons-material/SearchRounded";
import SendRounded from "@mui/icons-material/SendRounded";
import PhoneRounded from "@mui/icons-material/PhoneRounded";
import VideocamRounded from "@mui/icons-material/VideocamRounded";
import MoreHorizRounded from "@mui/icons-material/MoreHorizRounded";
import AttachFileRounded from "@mui/icons-material/AttachFileRounded";
import SentimentSatisfiedAltRounded from "@mui/icons-material/SentimentSatisfiedAltRounded";
import ImageRounded from "@mui/icons-material/ImageRounded";
import InsertDriveFileRounded from "@mui/icons-material/InsertDriveFileRounded";
import DoneAllRounded from "@mui/icons-material/DoneAllRounded";
import PushPinRounded from "@mui/icons-material/PushPinRounded";
import ArrowForwardRounded from "@mui/icons-material/ArrowForwardRounded";
import ArrowBackRounded from "@mui/icons-material/ArrowBackRounded";
import InfoOutlined from "@mui/icons-material/InfoOutlined";
import CloseRounded from "@mui/icons-material/CloseRounded";

// ============================================================
// EXISTING HOOKS
// ============================================================
import { useConnections } from "../../hooks/useConnections";
import { useMyGroups } from "../../hooks/group/useGroups";
import { useUnreadCount } from "../../hooks/useUnreadCount";
import { useSendMessage } from "../../hooks/useSendMessage";

// ============================================================
// NOTIFICATION HOOKS
// ============================================================
import { useNotifications } from "../../hooks/useNotifications";
import { useMarkNotificationAsRead } from "../../hooks/useMarkNotificationAsRead";

// ============================================================
// COMPONENT
// ============================================================
export default function RealtimeChatWithStats() {
  // STATES
  const [activeTab, setActiveTab] = useState("all");
  const [search, setSearch] = useState("");
  const [messageText, setMessageText] = useState("");
  const [showDetails, setShowDetails] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [activeConversation, setActiveConversation] = useState(null);

  // DATA HOOKS
  const { data: connectionsData, isLoading: connectionsLoading } = useConnections();
  const { data: groupsData, isLoading: groupsLoading } = useMyGroups();
  const { data: unreadData } = useUnreadCount();
  const { data: notificationData, isLoading: notificationsLoading } = useNotifications();
  const sendMessageMutation = useSendMessage();
  const markNotificationAsRead = useMarkNotificationAsRead();

  // NORMALIZE CONNECTION DATA
  const connections = useMemo(() => {
    if (!connectionsData) return [];
    if (Array.isArray(connectionsData)) return connectionsData;
    if (Array.isArray(connectionsData?.data)) return connectionsData.data;
    if (Array.isArray(connectionsData?.connections)) return connectionsData.connections;
    return [];
  }, [connectionsData]);

  // NORMALIZE GROUP DATA
  const groups = useMemo(() => {
    if (!groupsData) return [];
    if (Array.isArray(groupsData)) return groupsData;
    if (Array.isArray(groupsData?.data)) return groupsData.data;
    if (Array.isArray(groupsData?.groups)) return groupsData.groups;
    return [];
  }, [groupsData]);

  // NORMALIZE NOTIFICATION DATA
  const notifications = useMemo(() => {
    if (!notificationData) return [];
    if (Array.isArray(notificationData)) return notificationData;
    if (Array.isArray(notificationData?.data)) return notificationData.data;
    if (Array.isArray(notificationData?.notifications)) return notificationData.notifications;
    return [];
  }, [notificationData]);

  // UNREAD MESSAGE COUNT
  const unreadMessageCount = useMemo(() => {
    if (!unreadData) return 0;
    if (typeof unreadData === "number") return unreadData;
    if (typeof unreadData?.count === "number") return unreadData.count;
    if (typeof unreadData?.data === "number") return unreadData.data;
    if (Array.isArray(unreadData?.data)) return unreadData.data.length;
    if (Array.isArray(unreadData)) return unreadData.length;
    return 0;
  }, [unreadData]);

  // UNREAD NOTIFICATIONS
  const unreadNotifications = useMemo(() => {
    return notifications.filter((notification) => {
      return (
        notification?.isRead === false ||
        notification?.read === false ||
        notification?.status === "unread"
      );
    }).length;
  }, [notifications]);

  // FRIEND CONVERSATIONS
  const friendChats = useMemo(() => {
    return connections.map((connection, index) => {
      const user =
        connection?.user ||
        connection?.profile?.user ||
        connection?.sender ||
        connection?.receiver ||
        connection;
      return {
        id:
          user?._id ||
          user?.id ||
          connection?._id ||
          connection?.id ||
          `friend-${index}`,
        name:
          user?.username ||
          user?.name ||
          user?.fullName ||
          "Unknown User",
        username: user?.username ? `@${user.username}` : "",
        avatar:
          user?.profileImage ||
          user?.avatar ||
          user?.image ||
          user?.profile?.profileImage ||
          "",
        online: user?.online ?? false,
        isGroup: false,
        lastMessage:
          connection?.lastMessage?.message ||
          connection?.lastMessage ||
          "Start a conversation",
        unread: connection?.unreadCount || 0,
        pinned: connection?.pinned || false,
      };
    });
  }, [connections]);

  // GROUP CONVERSATIONS
  const groupChats = useMemo(() => {
    return groups.map((group, index) => {
      return {
        id:
          group?._id ||
          group?.id ||
          `group-${index}`,
        name:
          group?.groupName ||
          group?.name ||
          group?.groupname ||
          "Unnamed Group",
        username:
          group?.description ||
          "Group conversation",
        avatar:
          group?.groupImage ||
          group?.image ||
          group?.avatar ||
          "",
        online: true,
        isGroup: true,
        lastMessage:
          group?.lastMessage?.message ||
          group?.lastMessage ||
          "No messages yet",
        unread: group?.unreadCount || 0,
        pinned: group?.pinned || false,
      };
    });
  }, [groups]);

  // ALL CONVERSATIONS
  const conversations = useMemo(() => {
    return [...friendChats, ...groupChats];
  }, [friendChats, groupChats]);

  // FILTER CONVERSATIONS
  const filteredChats = useMemo(() => {
    let result = conversations;
    if (activeTab === "friends") {
      result = result.filter((chat) => !chat.isGroup);
    }
    if (activeTab === "groups") {
      result = result.filter((chat) => chat.isGroup);
    }
    if (activeTab === "unread") {
      result = result.filter((chat) => chat.unread > 0);
    }
    if (search.trim()) {
      const value = search.toLowerCase();
      result = result.filter((chat) =>
        chat.name?.toLowerCase().includes(value)
      );
    }
    return result;
  }, [conversations, activeTab, search]);

  // SELECT CONVERSATION
  const selectConversation = (chat) => {
    setActiveConversation(chat);
    setShowDetails(false);
  };

  // SEND MESSAGE
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!messageText.trim() || !activeConversation) return;

    if (activeConversation.isGroup) {
      console.log("Send group message:", {
        groupId: activeConversation.id,
        message: messageText,
      });
      setMessageText("");
      return;
    }

    try {
      await sendMessageMutation.mutateAsync({
        receiverid: activeConversation.id,
        message: messageText,
      });
      setMessageText("");
    } catch (error) {
      console.error("Send message error:", error);
    }
  };

  // MARK ONE NOTIFICATION AS READ
  const handleNotificationClick = (notification) => {
    const notificationId = notification?._id || notification?.id;
    if (!notificationId) return;

    const isRead =
      notification?.isRead === true ||
      notification?.read === true ||
      notification?.status === "read";

    if (!isRead) {
      markNotificationAsRead.mutate(notificationId);
    }
  };

  // MARK ALL NOTIFICATIONS AS READ
  const handleMarkAllAsRead = () => {
    notifications.forEach((notification) => {
      const id = notification?._id || notification?.id;
      const isRead =
        notification?.isRead === true ||
        notification?.read === true ||
        notification?.status === "read";

      if (id && !isRead) {
        markNotificationAsRead.mutate(id);
      }
    });
  };

  return (
    <div className="relative h-screen bg-[#f6f3ff] p-3 overflow-hidden">
      <div className="h-full bg-white rounded-[28px] border border-violet-100 shadow-[0_20px_60px_rgba(76,29,149,0.08)] overflow-hidden flex flex-col">
        {/* TOP SUMMARY CARDS */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 p-3 sm:p-4 bg-[#fcfbff]">
          {/* TOTAL GROUPS */}
          <div
            onClick={() => setActiveTab("groups")}
            className="bg-white rounded-2xl p-3.5 border border-violet-100 shadow-[0_4px_20px_rgba(124,58,237,0.03)] flex items-center justify-between cursor-pointer hover:border-[#7c3aed] transition-all group"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-violet-50 text-[#7c3aed] flex items-center justify-center group-hover:scale-105 transition-transform">
                <GroupsRounded fontSize="small" />
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#7c738f] block">
                  Total Groups
                </span>
                <span className="text-xl font-black text-[#27213a] leading-tight block">
                  {groupsLoading ? "..." : groups.length}
                </span>
              </div>
            </div>
            <span className="text-[#aaa0b0] group-hover:text-[#7c3aed] transition">
              →
            </span>
          </div>

          {/* TOTAL FRIENDS */}
          <div
            onClick={() => setActiveTab("friends")}
            className="bg-white rounded-2xl p-3.5 border border-violet-100 shadow-[0_4px_20px_rgba(124,58,237,0.03)] flex items-center justify-between cursor-pointer hover:border-[#9333ea] transition-all group"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-purple-50 text-[#9333ea] flex items-center justify-center group-hover:scale-105 transition-transform">
                <PeopleAltRounded fontSize="small" />
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#7c738f] block">
                  Total Friends
                </span>
                <span className="text-xl font-black text-[#27213a] leading-tight block">
                  {connectionsLoading ? "..." : connections.length}
                </span>
              </div>
            </div>
            <span className="text-[#aaa0b0] group-hover:text-[#9333ea] transition">
              →
            </span>
          </div>

          {/* UNREAD MESSAGES */}
          <div
            onClick={() => setActiveTab("unread")}
            className="bg-white rounded-2xl p-3.5 border border-violet-100 shadow-[0_4px_20px_rgba(124,58,237,0.03)] flex items-center justify-between cursor-pointer hover:border-[#c026d3] transition-all group"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-fuchsia-50 text-[#c026d3] flex items-center justify-center group-hover:scale-105 transition-transform">
                <MarkChatUnreadRounded fontSize="small" />
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#7c738f] block">
                  Unread Messages
                </span>
                <span className="text-xl font-black text-[#27213a] leading-tight block">
                  {unreadMessageCount}
                </span>
              </div>
            </div>
            <span className="text-[10px] font-bold text-[#c026d3] bg-fuchsia-50 px-2 py-0.5 rounded-full border border-fuchsia-100">
              Unread
            </span>
          </div>

          {/* NOTIFICATIONS */}
          <div
            onClick={() => setShowNotifications(!showNotifications)}
            className={`relative bg-white rounded-2xl p-3.5 border shadow-[0_4px_20px_rgba(124,58,237,0.03)] flex items-center justify-between cursor-pointer transition-all group ${
              showNotifications
                ? "border-amber-400"
                : "border-violet-100 hover:border-amber-400"
            }`}
          >
            <div className="flex items-center gap-3">
              <div className="relative w-10 h-10 rounded-xl bg-amber-50 text-amber-500 flex items-center justify-center group-hover:scale-105 transition-transform">
                {unreadNotifications > 0 ? (
                  <NotificationsActiveRounded fontSize="small" />
                ) : (
                  <NotificationsRounded fontSize="small" />
                )}
                {unreadNotifications > 0 && (
                  <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-red-500 text-white text-[9px] font-black flex items-center justify-center border-2 border-white">
                    {unreadNotifications > 99 ? "99+" : unreadNotifications}
                  </span>
                )}
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#7c738f] block">
                  Notifications
                </span>
                <span className="text-xl font-black text-[#27213a] leading-tight block">
                  {notificationsLoading ? "..." : notifications.length}
                </span>
              </div>
            </div>
            <span
              className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                unreadNotifications > 0
                  ? "text-amber-600 bg-amber-50 border-amber-100"
                  : "text-emerald-600 bg-emerald-50 border-emerald-100"
              }`}
            >
              {unreadNotifications > 0 ? `${unreadNotifications} New` : "All Read"}
            </span>
          </div>
        </div>

        {/* NOTIFICATION POPUP */}
        {showNotifications && (
          <div className="absolute top-[110px] right-4 sm:right-6 z-50 w-[390px] max-w-[calc(100vw-2rem)]">
            <div className="bg-white rounded-3xl border border-violet-100 shadow-[0_20px_60px_rgba(76,29,149,0.18)] overflow-hidden">
              {/* HEADER */}
              <div className="p-4 border-b border-violet-100 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-500 flex items-center justify-center">
                    <NotificationsActiveRounded fontSize="small" />
                  </div>
                  <div>
                    <h3 className="text-sm font-black text-[#27213a]">Notifications</h3>
                    <p className="text-[10px] text-[#91879d] mt-0.5">
                      {unreadNotifications > 0
                        ? `${unreadNotifications} unread notifications`
                        : "You're all caught up"}
                    </p>
                  </div>
                </div>
                <IconButton size="small" onClick={() => setShowNotifications(false)}>
                  <CloseRounded fontSize="small" />
                </IconButton>
              </div>

              {/* NOTIFICATION LIST */}
              <div className="max-h-[390px] overflow-y-auto">
                {notificationsLoading ? (
                  <div className="p-8 text-center">
                    <div className="w-8 h-8 border-2 border-violet-200 border-t-violet-600 rounded-full animate-spin mx-auto" />
                    <p className="text-xs text-[#91879d] mt-3">Loading notifications...</p>
                  </div>
                ) : notifications.length === 0 ? (
                  <div className="p-10 text-center">
                    <div className="w-16 h-16 mx-auto rounded-2xl bg-violet-50 text-violet-400 flex items-center justify-center">
                      <NotificationsNoneRounded sx={{ fontSize: 30 }} />
                    </div>
                    <h4 className="text-sm font-black text-[#33283f] mt-4">No notifications</h4>
                    <p className="text-[11px] text-[#91879d] mt-1">You're all caught up!</p>
                  </div>
                ) : (
                  notifications.map((notification, index) => {
                    const notificationId = notification?._id || notification?.id;
                    const isRead =
                      notification?.isRead === true ||
                      notification?.read === true ||
                      notification?.status === "read";

                    return (
                      <div
                        key={notificationId || index}
                        onClick={() => handleNotificationClick(notification)}
                        className={`p-4 border-b border-violet-50 flex gap-3 cursor-pointer transition hover:bg-violet-50/60 ${
                          !isRead ? "bg-amber-50/50" : "bg-white"
                        }`}
                      >
                        <div
                          className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                            !isRead
                              ? "bg-amber-100 text-amber-600"
                              : "bg-violet-100 text-violet-500"
                          }`}
                        >
                          <NotificationsNoneRounded fontSize="small" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <p
                              className={`text-xs ${
                                !isRead
                                  ? "font-black text-[#292039]"
                                  : "font-semibold text-[#51475e]"
                              }`}
                            >
                              {notification?.title ||
                                notification?.message ||
                                notification?.text ||
                                "New notification"}
                            </p>
                            {!isRead && (
                              <span className="w-2 h-2 rounded-full bg-amber-500 flex-shrink-0 mt-1" />
                            )}
                          </div>
                          {notification?.message && notification?.title && (
                            <p className="text-[10px] text-[#91879d] mt-1 line-clamp-2">
                              {notification.message}
                            </p>
                          )}
                          {notification?.createdAt && (
                            <p className="text-[9px] text-[#aaa0b0] mt-2">
                              {new Date(notification.createdAt).toLocaleString()}
                            </p>
                          )}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              {/* FOOTER */}
              {notifications.length > 0 && (
                <div className="p-3 bg-[#fcfbff] border-t border-violet-100">
                  <button
                    onClick={handleMarkAllAsRead}
                    disabled={unreadNotifications === 0}
                    className="w-full py-2.5 rounded-xl bg-violet-50 text-violet-600 text-[10px] font-black hover:bg-violet-100 disabled:opacity-40 disabled:cursor-not-allowed transition"
                  >
                    Mark all as read
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* MAIN CHAT PLATFORM */}
        <div className="flex-1 min-h-0 flex overflow-hidden">
          {/* LEFT CHAT SIDEBAR */}
          <aside
            className={`w-full md:w-[330px] border-r border-violet-100 flex flex-col bg-[#fcfbff] ${
              activeConversation ? "hidden md:flex" : "flex"
            }`}
          >
            {/* SIDEBAR HEADER */}
            <div className="px-5 pt-5 pb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-violet-600 to-fuchsia-600 flex items-center justify-center text-white shadow-lg shadow-violet-200">
                    <ChatBubbleRounded fontSize="small" />
                  </div>
                  <div>
                    <h1 className="text-lg font-black text-[#241b35]">Messages</h1>
                    <p className="text-[11px] text-[#8c839b]">Stay connected</p>
                  </div>
                </div>
                <IconButton size="small">
                  <MoreHorizRounded fontSize="small" />
                </IconButton>
              </div>
            </div>

            {/* SEARCH */}
            <div className="px-4 pb-4">
              <div className="flex items-center gap-2 bg-[#f5f2ff] rounded-2xl px-4 py-3 border border-transparent focus-within:border-violet-300 transition">
                <SearchRounded sx={{ fontSize: 20, color: "#9b91aa" }} />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search conversations..."
                  className="bg-transparent outline-none text-xs w-full text-[#332a43] placeholder-[#a59cae]"
                />
              </div>
            </div>

            {/* FILTER TABS */}
            <div className="px-4 pb-4">
              <div className="flex gap-2 overflow-x-auto">
                {[
                  ["all", "All"],
                  ["friends", "Friends"],
                  ["groups", "Groups"],
                  ["unread", "Unread"],
                ].map(([value, label]) => (
                  <button
                    key={value}
                    onClick={() => setActiveTab(value)}
                    className={`px-4 py-2 rounded-xl text-[11px] font-bold whitespace-nowrap transition ${
                      activeTab === value
                        ? "bg-[#7c3aed] text-white shadow-md shadow-violet-200"
                        : "bg-[#f5f2ff] text-[#756b83]"
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {/* CHAT LIST */}
            <div className="flex-1 overflow-y-auto px-2 pb-3">
              {connectionsLoading || groupsLoading ? (
                <div className="space-y-2 px-2">
                  {[1, 2, 3, 4, 5].map((item) => (
                    <div key={item} className="flex gap-3 p-3">
                      <div className="w-12 h-12 rounded-full bg-violet-100 animate-pulse" />
                      <div className="flex-1 space-y-2">
                        <div className="h-3 w-24 bg-violet-100 rounded animate-pulse" />
                        <div className="h-2 w-40 bg-violet-50 rounded animate-pulse" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : filteredChats.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center px-6">
                  <div className="w-16 h-16 rounded-3xl bg-violet-100 text-violet-500 flex items-center justify-center">
                    <ChatBubbleRounded sx={{ fontSize: 30 }} />
                  </div>
                  <h3 className="mt-4 text-sm font-black text-[#2b2238]">No conversations</h3>
                  <p className="text-xs text-[#92889e] mt-1">
                    Your friends and groups will appear here.
                  </p>
                </div>
              ) : (
                <div className="space-y-1">
                  {filteredChats.map((chat) => {
                    const selected = activeConversation?.id === chat.id;
                    return (
                      <div
                        key={chat.id}
                        onClick={() => selectConversation(chat)}
                        className={`p-3 rounded-2xl flex items-center gap-3 cursor-pointer transition-all ${
                          selected ? "bg-violet-100/70" : "hover:bg-violet-50"
                        }`}
                      >
                        <Badge
                          overlap="circular"
                          variant="dot"
                          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                          sx={{
                            "& .MuiBadge-badge": {
                              backgroundColor: chat.online ? "#10b981" : "#c4bdcc",
                              border: "2px solid white",
                            },
                          }}
                        >
                          <Avatar src={chat.avatar} sx={{ width: 48, height: 48 }}>
                            {chat.name?.charAt(0)?.toUpperCase()}
                          </Avatar>
                        </Badge>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2">
                            <div className="flex items-center gap-1 min-w-0">
                              <h3 className="text-xs font-black text-[#2d2438] truncate">
                                {chat.name}
                              </h3>
                              {chat.pinned && (
                                <PushPinRounded sx={{ fontSize: 13, color: "#7c3aed" }} />
                              )}
                            </div>
                            {chat.unread > 0 && (
                              <span className="min-w-[19px] h-[19px] rounded-full bg-[#7c3aed] text-white flex items-center justify-center text-[9px] font-black">
                                {chat.unread}
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-1 mt-1">
                            {chat.isGroup && (
                              <GroupsRounded sx={{ fontSize: 13, color: "#8b7da0" }} />
                            )}
                            <p className="text-[11px] text-[#8d8499] truncate">
                              {chat.lastMessage}
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* SIDEBAR STATS */}
            <div className="border-t border-violet-100 p-4">
              <div className="grid grid-cols-3 gap-2">
                <div className="bg-violet-50 rounded-xl p-2 text-center">
                  <PeopleAltRounded sx={{ fontSize: 17, color: "#7c3aed" }} />
                  <p className="text-sm font-black text-[#2d2438]">{connections.length}</p>
                  <span className="text-[9px] text-[#8d8499]">Friends</span>
                </div>
                <div className="bg-fuchsia-50 rounded-xl p-2 text-center">
                  <GroupsRounded sx={{ fontSize: 17, color: "#c026d3" }} />
                  <p className="text-sm font-black text-[#2d2438]">{groups.length}</p>
                  <span className="text-[9px] text-[#8d8499]">Groups</span>
                </div>
                <div className="bg-amber-50 rounded-xl p-2 text-center">
                  <NotificationsNoneRounded sx={{ fontSize: 17, color: "#f59e0b" }} />
                  <p className="text-sm font-black text-[#2d2438]">{unreadNotifications}</p>
                  <span className="text-[9px] text-[#8d8499]">Alerts</span>
                </div>
              </div>
            </div>
          </aside>

          {/* CHAT AREA */}
          <main
            className={`flex-1 flex flex-col min-w-0 ${
              !activeConversation ? "hidden md:flex" : "flex"
            }`}
          >
            {!activeConversation ? (
              /* EMPTY CHAT */
              <div className="flex-1 flex items-center justify-center bg-[#fdfcff]">
                <div className="text-center max-w-sm">
                  <div className="relative mx-auto w-24 h-24">
                    <div className="absolute inset-0 rounded-[30px] bg-violet-100 rotate-6" />
                    <div className="absolute inset-0 rounded-[30px] bg-gradient-to-br from-violet-600 to-fuchsia-600 text-white flex items-center justify-center shadow-xl">
                      <ChatBubbleRounded sx={{ fontSize: 42 }} />
                    </div>
                  </div>
                  <h2 className="text-2xl font-black text-[#292039] mt-7">Your conversations</h2>
                  <p className="text-sm text-[#91879d] mt-2 leading-relaxed">
                    Select a friend or group from the left to start a real-time conversation.
                  </p>
                  <div className="flex justify-center gap-2 mt-5">
                    <span className="px-3 py-1.5 rounded-full bg-violet-50 text-violet-600 text-[10px] font-bold">
                      {connections.length} Friends
                    </span>
                    <span className="px-3 py-1.5 rounded-full bg-fuchsia-50 text-fuchsia-600 text-[10px] font-bold">
                      {groups.length} Groups
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              /* ACTIVE CHAT */
              <>
                {/* CHAT HEADER */}
                <header className="h-[76px] px-4 sm:px-6 border-b border-violet-100 flex items-center justify-between bg-white">
                  <div className="flex items-center gap-3">
                    <IconButton
                      size="small"
                      className="md:hidden"
                      onClick={() => setActiveConversation(null)}
                    >
                      <ArrowBackRounded />
                    </IconButton>
                    <Badge
                      overlap="circular"
                      variant="dot"
                      anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                      sx={{
                        "& .MuiBadge-badge": {
                          backgroundColor: activeConversation.online ? "#10b981" : "#c4bdcc",
                          border: "2px solid white",
                        },
                      }}
                    >
                      <Avatar src={activeConversation.avatar} sx={{ width: 44, height: 44 }}>
                        {activeConversation.name?.charAt(0)?.toUpperCase()}
                      </Avatar>
                    </Badge>
                    <div>
                      <div className="flex items-center gap-2">
                        <h2 className="text-sm font-black text-[#292039]">
                          {activeConversation.name}
                        </h2>
                        {activeConversation.isGroup && (
                          <span className="px-2 py-0.5 rounded-full bg-violet-50 text-violet-600 text-[9px] font-bold">
                            GROUP
                          </span>
                        )}
                      </div>
                      <p className="text-[10px] text-emerald-600 font-semibold mt-1">
                        {activeConversation.isGroup
                          ? "Group conversation"
                          : activeConversation.online
                          ? "Online now"
                          : "Offline"}
                      </p>
                    </div>
                  </div>

                  {/* HEADER ACTIONS */}
                  <div className="flex items-center gap-1">
                    {!activeConversation.isGroup && (
                      <>
                        <Tooltip title="Voice call">
                          <IconButton size="small">
                            <PhoneRounded fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Video call">
                          <IconButton size="small">
                            <VideocamRounded fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </>
                    )}
                    <Tooltip title="Conversation info">
                      <IconButton
                        size="small"
                        onClick={() => setShowDetails(!showDetails)}
                      >
                        <InfoOutlined fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <IconButton size="small">
                      <MoreHorizRounded fontSize="small" />
                    </IconButton>
                  </div>
                </header>

                {/* MESSAGE AREA */}
                <div className="flex-1 overflow-y-auto bg-[#faf9ff] px-4 sm:px-8 py-6">
                  {/* DATE */}
                  <div className="flex justify-center mb-6">
                    <span className="px-3 py-1 bg-white border border-violet-100 rounded-full text-[9px] font-bold text-[#91879d]">
                      TODAY
                    </span>
                  </div>

                  {/* RECEIVED MESSAGE */}
                  <div className="flex items-start gap-2 mb-5">
                    <Avatar
                      src={activeConversation.avatar}
                      sx={{ width: 30, height: 30 }}
                    >
                      {activeConversation.name?.charAt(0)?.toUpperCase()}
                    </Avatar>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[10px] font-black text-[#51475e]">
                          {activeConversation.name}
                        </span>
                        <span className="text-[9px] text-[#aaa1b2]">10:42 AM</span>
                      </div>
                      <div className="max-w-md bg-white border border-violet-100 rounded-2xl rounded-tl-md px-4 py-3 shadow-sm">
                        <p className="text-xs text-[#413749] leading-relaxed">
                          Hey! 👋 Welcome to the conversation. Send a message to get started.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* SENT MESSAGE */}
                  <div className="flex justify-end mb-5">
                    <div className="max-w-md">
                      <div className="bg-gradient-to-br from-violet-600 to-fuchsia-600 text-white rounded-2xl rounded-tr-md px-4 py-3 shadow-md shadow-violet-100">
                        <p className="text-xs leading-relaxed">
                          Great! The real-time chat interface looks clean now.
                        </p>
                      </div>
                      <div className="flex justify-end items-center gap-1 mt-1">
                        <span className="text-[9px] text-[#aaa1b2]">10:43 AM</span>
                        <DoneAllRounded sx={{ fontSize: 13, color: "#7c3aed" }} />
                      </div>
                    </div>
                  </div>
                </div>

                {/* MESSAGE INPUT */}
                <div className="p-4 sm:px-6 border-t border-violet-100 bg-white">
                  <form onSubmit={handleSendMessage} className="flex items-end gap-2">
                    <Tooltip title="Attach">
                      <IconButton size="small">
                        <AttachFileRounded fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <div className="flex-1 bg-[#f7f4ff] border border-violet-100 rounded-2xl px-3 py-2 focus-within:border-violet-400 transition">
                      <input
                        value={messageText}
                        onChange={(e) => setMessageText(e.target.value)}
                        placeholder="Write a message..."
                        className="w-full bg-transparent outline-none text-xs text-[#32283d] placeholder-[#aaa0b0]"
                      />
                      <div className="flex items-center justify-between mt-1">
                        <div className="flex items-center gap-1">
                          <IconButton size="small">
                            <SentimentSatisfiedAltRounded
                              sx={{ fontSize: 18, color: "#8f849b" }}
                            />
                          </IconButton>
                          <IconButton size="small">
                            <ImageRounded
                              sx={{ fontSize: 18, color: "#8f849b" }}
                            />
                          </IconButton>
                          <IconButton size="small">
                            <InsertDriveFileRounded
                              sx={{ fontSize: 18, color: "#8f849b" }}
                            />
                          </IconButton>
                        </div>
                        <span className="text-[9px] text-[#aaa0b0]">Enter to send</span>
                      </div>
                    </div>
                    <IconButton
                      type="submit"
                      disabled={
                        !messageText.trim() || sendMessageMutation.isPending
                      }
                      sx={{
                        width: 44,
                        height: 44,
                        background: "#7c3aed",
                        color: "white",
                        borderRadius: "15px",
                        "&:hover": { background: "#6d28d9" },
                        "&.Mui-disabled": {
                          background: "#ede9fe",
                          color: "#aaa0b0",
                        },
                      }}
                    >
                      <SendRounded fontSize="small" />
                    </IconButton>
                  </form>
                </div>
              </>
            )}
          </main>

          {/* DETAILS PANEL */}
          {showDetails && activeConversation && (
            <aside className="w-[300px] border-l border-violet-100 bg-[#fcfbff] hidden xl:flex flex-col">
              {/* HEADER */}
              <div className="h-[76px] px-5 border-b border-violet-100 flex items-center justify-between">
                <h3 className="text-sm font-black text-[#292039]">Details</h3>
                <IconButton size="small" onClick={() => setShowDetails(false)}>
                  <CloseRounded fontSize="small" />
                </IconButton>
              </div>

              {/* PROFILE */}
              <div className="p-6 text-center border-b border-violet-100">
                <div className="relative inline-block">
                  <Avatar
                    src={activeConversation.avatar}
                    sx={{
                      width: 86,
                      height: 86,
                      border: "4px solid #ede9fe",
                    }}
                  >
                    {activeConversation.name?.charAt(0)?.toUpperCase()}
                  </Avatar>
                  <span
                    className={`absolute bottom-1 right-1 w-5 h-5 rounded-full border-4 border-white ${
                      activeConversation.online ? "bg-emerald-500" : "bg-slate-400"
                    }`}
                  />
                </div>
                <h3 className="text-sm font-black text-[#292039] mt-3">
                  {activeConversation.name}
                </h3>
                <p className="text-xs text-[#91879d] mt-1">
                  {activeConversation.username}
                </p>
                <span
                  className={`inline-flex items-center gap-1 mt-3 px-3 py-1 rounded-full text-[9px] font-bold ${
                    activeConversation.online
                      ? "bg-emerald-50 text-emerald-600"
                      : "bg-slate-100 text-slate-500"
                  }`}
                >
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${
                      activeConversation.online ? "bg-emerald-500" : "bg-slate-400"
                    }`}
                  />
                  {activeConversation.online ? "Online" : "Offline"}
                </span>
              </div>

              {/* QUICK ACTIONS */}
              <div className="p-5 border-b border-violet-100">
                <div className="grid grid-cols-3 gap-2">
                  <button className="p-3 rounded-xl bg-violet-50 text-violet-600 flex flex-col items-center gap-1">
                    <PhoneRounded sx={{ fontSize: 18 }} />
                    <span className="text-[9px] font-bold">Call</span>
                  </button>
                  <button className="p-3 rounded-xl bg-violet-50 text-violet-600 flex flex-col items-center gap-1">
                    <VideocamRounded sx={{ fontSize: 18 }} />
                    <span className="text-[9px] font-bold">Video</span>
                  </button>
                  <button className="p-3 rounded-xl bg-violet-50 text-violet-600 flex flex-col items-center gap-1">
                    <SearchRounded sx={{ fontSize: 18 }} />
                    <span className="text-[9px] font-bold">Search</span>
                  </button>
                </div>
              </div>

              {/* SHARED MEDIA */}
              <div className="p-5">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-xs font-black text-[#33283f]">Shared media</h4>
                  <span className="text-[10px] text-violet-600 font-bold">View all</span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <div className="h-20 rounded-xl bg-violet-100 flex items-center justify-center text-violet-500">
                    <ImageRounded />
                  </div>
                  <div className="h-20 rounded-xl bg-fuchsia-100 flex items-center justify-center text-fuchsia-500">
                    <ImageRounded />
                  </div>
                  <div className="h-20 rounded-xl bg-purple-100 flex items-center justify-center text-purple-500">
                    <ImageRounded />
                  </div>
                </div>
              </div>
            </aside>
          )}
        </div>
      </div>
    </div>
  );
}