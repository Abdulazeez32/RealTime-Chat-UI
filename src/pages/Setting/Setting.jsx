import React, { useEffect, useState } from "react";

import {
  Avatar,
  Switch,
} from "@mui/material";

import {
  PersonRounded,
  LockRounded,
  NotificationsRounded,
  PrivacyTipRounded,
  CircleRounded,
  ChatRounded,
  SecurityRounded,
  LogoutRounded,
  ChevronRightRounded,
  CheckCircleRounded,
  VisibilityRounded,
  BlockRounded,
  DarkModeRounded,
  LanguageRounded,
  EditRounded,
  ShieldRounded,
  DeleteOutlineRounded,
  LightModeRounded,
} from "@mui/icons-material";

import {
  useActivity,
  useUpdateActivity,
} from "../../hooks/useActivity";

import { useDashboard } from "../../hooks/useDashboard";

import { useNavigate } from "react-router-dom";

function Settings() {
  const navigate = useNavigate();

  const [activeSection, setActiveSection] = useState("activity");

  const [onlineStatus, setOnlineStatus] = useState(true);
  const [readReceipts, setReadReceipts] = useState(true);
  const [notifications, setNotifications] = useState(true);
  const [messagePreview, setMessagePreview] = useState(true);

  // ============================================================
  // DARK MODE
  // ============================================================

  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("darkMode") === "true";
  });

  useEffect(() => {
    localStorage.setItem("darkMode", darkMode);
  }, [darkMode]);

  // ============================================================
  // ACTIVITY API
  // ============================================================

  const {
    data: activityData,
    isLoading: activityLoading,
    isError: activityError,
  } = useActivity();

  const updateActivityMutation = useUpdateActivity();

  // ============================================================
  // DASHBOARD API
  // ============================================================

  const {
    data: dashboardData,
    isLoading: dashboardLoading,
  } = useDashboard();

  // ============================================================
  // GET PROFILE DATA
  // ============================================================

  const profileData =
    dashboardData?.data ||
    dashboardData?.profile ||
    dashboardData ||
    {};

  const username =
    profileData?.username ||
    profileData?.user?.username ||
    "User";

  const bio = profileData?.bio || "";

  const profilePic =
    profileData?.profilepic ||
    profileData?.profilePic ||
    "";

  const avatarLetter = username
    ? username.charAt(0).toUpperCase()
    : "U";

  // ============================================================
  // LOAD ACTIVITY
  // ============================================================

  useEffect(() => {
    if (!activityData) return;

    const activity =
      activityData?.data ||
      activityData?.activity ||
      activityData;

    if (typeof activity?.onlineStatus === "boolean") {
      setOnlineStatus(activity.onlineStatus);
    }

    if (typeof activity?.isOnline === "boolean") {
      setOnlineStatus(activity.isOnline);
    }

    if (typeof activity?.readReceipts === "boolean") {
      setReadReceipts(activity.readReceipts);
    }

    if (typeof activity?.notifications === "boolean") {
      setNotifications(activity.notifications);
    }

    if (typeof activity?.messagePreview === "boolean") {
      setMessagePreview(activity.messagePreview);
    }
  }, [activityData]);

  // ============================================================
  // UPDATE ACTIVITY
  // ============================================================

  const updateActivity = (field, value) => {
    updateActivityMutation.mutate({
      [field]: value,
    });
  };

  // ============================================================
  // DARK MODE HANDLER
  // ============================================================

  const handleDarkMode = (value) => {
    setDarkMode(value);
  };

  // ============================================================
  // LOGOUT
  // ============================================================

  const handleLogout = () => {
    localStorage.removeItem("token");

    navigate("/login", {
      replace: true,
    });
  };

  // ============================================================
  // SIDEBAR ITEMS
  // ============================================================

  const settingsItems = [
    {
      id: "profile",
      label: "Profile",
      description: "Manage your profile",
      icon: PersonRounded,
    },
    {
      id: "notifications",
      label: "Notifications",
      description: "Manage notifications",
      icon: NotificationsRounded,
    },
    {
      id: "privacy",
      label: "Privacy",
      description: "Control your privacy",
      icon: PrivacyTipRounded,
    },
    {
      id: "security",
      label: "Security",
      description: "Password & security",
      icon: SecurityRounded,
    },
    {
      id: "chat",
      label: "Chat",
      description: "Chat preferences",
      icon: ChatRounded,
    },
  ];

  // ============================================================
  // SETTING ROW
  // ============================================================

  const SettingRow = ({
    icon: Icon,
    title,
    description,
    checked,
    onChange,
    danger = false,
    clickable = false,
    onClick,
  }) => {
    return (
      <div
        onClick={clickable ? onClick : undefined}
        className={`
          flex items-center justify-between gap-4
          p-4 sm:p-5
          rounded-2xl
          transition
          ${
            danger
              ? "hover:bg-red-50"
              : "hover:bg-violet-50/60"
          }
          ${clickable ? "cursor-pointer" : ""}
        `}
      >
        {/* LEFT */}

        <div className="flex items-center gap-4 min-w-0">
          <div
            className={`
              w-11 h-11
              rounded-xl
              flex items-center justify-center
              flex-shrink-0
              ${
                danger
                  ? "bg-red-50 text-red-500"
                  : "bg-violet-50 text-violet-600"
              }
            `}
          >
            <Icon fontSize="small" />
          </div>

          <div className="min-w-0">
            <h4
              className={`
                text-sm font-black
                ${
                  danger
                    ? "text-red-600"
                    : "text-[#292039]"
                }
              `}
            >
              {title}
            </h4>

            <p className="text-[11px] text-[#91879d] mt-1">
              {description}
            </p>
          </div>
        </div>

        {/* RIGHT */}

        {typeof checked === "boolean" && (
          <Switch
            checked={checked}
            onChange={(e) =>
              onChange(e.target.checked)
            }
            color="secondary"
            onClick={(e) => e.stopPropagation()}
          />
        )}

        {clickable && (
          <ChevronRightRounded className="text-[#aaa0b0]" />
        )}
      </div>
    );
  };

  // ============================================================
  // PROFILE AVATAR
  // ============================================================

  const ProfileAvatar = ({
    size = 50,
    className = "",
  }) => {
    return (
      <Avatar
        src={profilePic || undefined}
        sx={{
          width: size,
          height: size,
          fontWeight: 900,
          background:
            "linear-gradient(135deg,#7c3aed,#c026d3)",
        }}
        className={className}
      >
        {avatarLetter}
      </Avatar>
    );
  };

  // ============================================================
  // CONTENT
  // ============================================================

  const renderContent = () => {

    // ==========================================================
    // PROFILE
    // ==========================================================

    if (activeSection === "profile") {
      return (
        <div className="space-y-5">

          <div>
            <div className="flex items-center gap-3">

              <div className="w-11 h-11 rounded-2xl bg-violet-100 text-violet-600 flex items-center justify-center">
                <PersonRounded fontSize="small" />
              </div>

              <div>
                <h2 className="text-xl font-black text-[#292039]">
                  Profile
                </h2>

                <p className="text-xs text-[#91879d] mt-1">
                  Manage your personal information.
                </p>
              </div>

            </div>
          </div>

          {/* PROFILE CARD */}

          <div className="relative overflow-hidden bg-gradient-to-br from-violet-600 via-purple-600 to-fuchsia-600 rounded-3xl p-6 sm:p-8 text-white shadow-lg shadow-violet-200">

            <div className="absolute -right-10 -top-10 w-40 h-40 bg-white/10 rounded-full" />

            <div className="absolute -bottom-20 -left-10 w-48 h-48 bg-white/5 rounded-full" />

            <div className="relative flex flex-col sm:flex-row items-center gap-5">

              <div className="relative">

                <ProfileAvatar size={95} />

                <div className="absolute bottom-1 right-1 w-6 h-6 rounded-full bg-emerald-400 border-4 border-violet-600" />

              </div>

              <div className="text-center sm:text-left flex-1">

                <p className="text-[10px] uppercase tracking-[0.2em] text-white/60 font-bold">
                  My Profile
                </p>

                <h3 className="text-xl font-black mt-1">
                  {username}
                </h3>

                <p className="text-xs text-white/70 mt-2 max-w-md">
                  {bio ||
                    "Add a short bio to tell people about yourself."}
                </p>

                <button
                  onClick={() =>
                    navigate("/profile/edit")
                  }
                  className="mt-5 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white text-violet-700 text-xs font-black hover:bg-violet-50 transition shadow-sm"
                >
                  <EditRounded
                    sx={{ fontSize: 16 }}
                  />

                  Edit Profile
                </button>

              </div>

            </div>
          </div>

          {/* PROFILE INFORMATION */}

          <div className="bg-white border border-violet-100 rounded-3xl p-2 shadow-sm">

            <div className="px-4 sm:px-5 pt-4 pb-2">

              <h3 className="text-sm font-black text-[#292039]">
                Profile Information
              </h3>

              <p className="text-[10px] text-[#91879d] mt-1">
                Your profile information is visible according to your privacy settings.
              </p>

            </div>

            <SettingRow
              icon={PersonRounded}
              title="Username"
              description={username}
            />

            <SettingRow
              icon={EditRounded}
              title="Bio"
              description={
                bio || "No bio added yet"
              }
              clickable
              onClick={() =>
                navigate("/profile/edit")
              }
            />

          </div>
        </div>
      );
    }

  
      
    // ==========================================================
    // NOTIFICATIONS
    // ==========================================================

    if (activeSection === "notifications") {
      return (
        <div className="space-y-5">

          <div>

            <div className="flex items-center gap-3">

              <div className="w-11 h-11 rounded-2xl bg-violet-100 text-violet-600 flex items-center justify-center">
                <NotificationsRounded fontSize="small" />
              </div>

              <div>

                <h2 className="text-xl font-black text-[#292039]">
                  Notifications
                </h2>

                <p className="text-xs text-[#91879d] mt-1">
                  Choose what notifications you receive.
                </p>

              </div>

            </div>

          </div>

          <div className="bg-white border border-violet-100 rounded-3xl p-2 shadow-sm">

            <SettingRow
              icon={NotificationsRounded}
              title="Push notifications"
              description="Receive notifications for new activity."
              checked={notifications}
              onChange={(value) => {

                setNotifications(value);

                updateActivity(
                  "notifications",
                  value
                );

              }}
            />

            <SettingRow
              icon={ChatRounded}
              title="Message notifications"
              description="Notify me when I receive a message."
              checked={notifications}
              onChange={(value) => {

                setNotifications(value);

                updateActivity(
                  "notifications",
                  value
                );

              }}
            />

            <SettingRow
              icon={VisibilityRounded}
              title="Message preview"
              description="Show message content inside notifications."
              checked={messagePreview}
              onChange={(value) => {

                setMessagePreview(value);

                updateActivity(
                  "messagePreview",
                  value
                );

              }}
            />

          </div>

        </div>
      );
    }

    // ==========================================================
    // PRIVACY
    // ==========================================================

    if (activeSection === "privacy") {
      return (
        <div className="space-y-5">

          <div>

            <div className="flex items-center gap-3">

              <div className="w-11 h-11 rounded-2xl bg-violet-100 text-violet-600 flex items-center justify-center">
                <PrivacyTipRounded fontSize="small" />
              </div>

              <div>

                <h2 className="text-xl font-black text-[#292039]">
                  Privacy
                </h2>

                <p className="text-xs text-[#91879d] mt-1">
                  Control who can interact with you.
                </p>

              </div>

            </div>

          </div>

          <div className="bg-white border border-violet-100 rounded-3xl p-2 shadow-sm">

            <SettingRow
              icon={VisibilityRounded}
              title="Read receipts"
              description="Allow others to know when messages are read."
              checked={readReceipts}
              onChange={(value) => {

                setReadReceipts(value);

                updateActivity(
                  "readReceipts",
                  value
                );

              }}
            />

            <SettingRow
              icon={BlockRounded}
              title="Blocked users"
              description="Manage users you have blocked."
              clickable
              onClick={() =>
                navigate("/blockusers")
              }
            />

          </div>

        </div>
      );
    }

    // ==========================================================
    // SECURITY
    // ==========================================================

    if (activeSection === "security") {
      return (
        <div className="space-y-5">

          <div>

            <div className="flex items-center gap-3">

              <div className="w-11 h-11 rounded-2xl bg-violet-100 text-violet-600 flex items-center justify-center">
                <SecurityRounded fontSize="small" />
              </div>

              <div>

                <h2 className="text-xl font-black text-[#292039]">
                  Security
                </h2>

                <p className="text-xs text-[#91879d] mt-1">
                  Keep your account secure.
                </p>

              </div>

            </div>

          </div>

          <div className="bg-white border border-violet-100 rounded-3xl p-2 shadow-sm">

            <SettingRow
              icon={LockRounded}
              title="Change password"
              description="Update your account password."
              clickable
              onClick={() =>
                navigate("/change-password")
              }
            />

            <SettingRow
              icon={ShieldRounded}
              title="Account security"
              description="Keep your account protected."
            />

          </div>

          {/* DELETE ACCOUNT */}

          <div className="bg-red-50 border border-red-100 rounded-3xl p-5">

            <div className="flex items-center gap-3">

              <div className="w-10 h-10 rounded-xl bg-red-100 text-red-500 flex items-center justify-center">
                <DeleteOutlineRounded />
              </div>

              <div>

                <h3 className="text-sm font-black text-red-600">
                  Delete account
                </h3>

                <p className="text-[10px] text-red-400 mt-1">
                  Permanently delete your account and profile.
                </p>

              </div>

            </div>

          </div>

        </div>
      );
    }

    // ==========================================================
    // CHAT
    // ==========================================================

    return (
      <div className="space-y-5">

        <div>

          <div className="flex items-center gap-3">

            <div className="w-11 h-11 rounded-2xl bg-violet-100 text-violet-600 flex items-center justify-center">
              <ChatRounded fontSize="small" />
            </div>

            <div>

              <h2 className="text-xl font-black text-[#292039]">
                Chat Preferences
              </h2>

              <p className="text-xs text-[#91879d] mt-1">
                Customize your chat experience.
              </p>

            </div>

          </div>

        </div>

        <div className="bg-white border border-violet-100 rounded-3xl p-2 shadow-sm">

          {/* DARK MODE */}

          <SettingRow
            icon={
              darkMode
                ? DarkModeRounded
                : LightModeRounded
            }
            title="Dark mode"
            description={
              darkMode
                ? "Dark appearance is currently enabled."
                : "Use dark appearance for the application."
            }
            checked={darkMode}
            onChange={handleDarkMode}
          />

          {/* LANGUAGE */}

          <SettingRow
            icon={LanguageRounded}
            title="Language"
            description="Choose your preferred language."
            clickable
            onClick={() => {
              alert("Language settings coming soon");
            }}
          />

        </div>

        {/* DARK MODE STATUS CARD */}

        <div
          className={`
            rounded-3xl p-5 border transition-all
            ${
              darkMode
                ? "bg-gradient-to-br from-violet-950 to-fuchsia-950 border-violet-800"
                : "bg-gradient-to-br from-violet-50 to-fuchsia-50 border-violet-100"
            }
          `}
        >

          <div className="flex items-center gap-4">

            <div
              className={`
                w-11 h-11 rounded-2xl
                flex items-center justify-center
                ${
                  darkMode
                    ? "bg-white/10 text-violet-300"
                    : "bg-violet-100 text-violet-600"
                }
              `}
            >
              {darkMode ? (
                <DarkModeRounded />
              ) : (
                <LightModeRounded />
              )}
            </div>

            <div>

              <h3
                className={`
                  text-sm font-black
                  ${
                    darkMode
                      ? "text-white"
                      : "text-[#292039]"
                  }
                `}
              >
                {darkMode
                  ? "Dark mode enabled"
                  : "Light mode enabled"}
              </h3>

              <p
                className={`
                  text-[10px] mt-1
                  ${
                    darkMode
                      ? "text-white/60"
                      : "text-[#91879d]"
                  }
                `}
              >
                {darkMode
                  ? "Your application is using a darker appearance."
                  : "Switch on dark mode to reduce brightness."}
              </p>

            </div>

          </div>

        </div>

      </div>
    );
  };

  // ============================================================
  // MAIN UI
  // ============================================================

  return (
    <>
      {/* ========================================================
          DARK MODE OVERRIDES
      ======================================================== */}

      <style>{`

        .settings-dark {
          background: #0f0b18 !important;
          color: #f5f3ff;
        }

        .settings-dark .bg-white {
          background-color: #181322 !important;
        }

        .settings-dark .bg-\\[\\#fcfbff\\] {
          background-color: #130f1d !important;
        }

        .settings-dark .bg-\\[\\#f7f4ff\\] {
          background-color: #0f0b18 !important;
        }

        .settings-dark .text-\\[\\#292039\\],
        .settings-dark .text-\\[\\#241b35\\],
        .settings-dark .text-\\[\\#33283f\\] {
          color: #f3efff !important;
        }

        .settings-dark .text-\\[\\#70677d\\] {
          color: #c0b8ce !important;
        }

        .settings-dark .text-\\[\\#91879d\\] {
          color: #a69db5 !important;
        }

        .settings-dark .border-violet-100 {
          border-color: #302542 !important;
        }

        .settings-dark .border-red-100 {
          border-color: #55232b !important;
        }

        .settings-dark .bg-violet-50 {
          background-color: #251b35 !important;
        }

        .settings-dark .bg-violet-100 {
          background-color: #302044 !important;
        }

        .settings-dark .hover\\:bg-violet-50:hover {
          background-color: #281e38 !important;
        }

        .settings-dark .hover\\:bg-violet-50\\/60:hover {
          background-color: #241a32 !important;
        }

        .settings-dark .bg-red-50 {
          background-color: #2b171c !important;
        }

        .settings-dark .bg-red-100 {
          background-color: #401c23 !important;
        }

        .settings-dark .text-red-400 {
          color: #f18b97 !important;
        }

        .settings-dark .text-red-500 {
          color: #ff7d8a !important;
        }

        .settings-dark .shadow-sm {
          box-shadow:
            0 4px 15px rgba(0,0,0,0.25) !important;
        }

        .settings-dark input,
        .settings-dark textarea,
        .settings-dark select {
          background-color: #1c1727;
          color: #f5f3ff;
          border-color: #3b304d;
        }

        .settings-dark button:hover {
          transition: 0.2s ease;
        }

        .settings-dark .MuiSwitch-track {
          background-color: #514762;
        }

        .settings-dark .MuiSwitch-switchBase.Mui-checked
          + .MuiSwitch-track {
          background-color: #8b5cf6;
        }

      `}</style>

      {/* ========================================================
          PAGE
      ======================================================== */}

      <div
        className={`
          min-h-screen
          p-3 sm:p-5
          transition-colors duration-300
          ${
            darkMode
              ? "settings-dark"
              : "bg-[#f7f4ff]"
          }
        `}
      >

        <div className="max-w-6xl mx-auto">

          {/* PAGE HEADER */}

          <div className="mb-5 px-2">

            <p className="text-[10px] uppercase tracking-[0.2em] font-black text-violet-500">
              Account
            </p>

            <h1 className="text-2xl sm:text-3xl font-black text-[#241b35] mt-1">
              Settings
            </h1>

            <p className="text-xs sm:text-sm text-[#91879d] mt-1">
              Manage your account, privacy and chat preferences.
            </p>

          </div>

          {/* SETTINGS CONTAINER */}

          <div className="bg-white rounded-[30px] border border-violet-100 shadow-[0_20px_60px_rgba(76,29,149,0.08)] overflow-hidden">

            <div className="flex flex-col md:flex-row min-h-[650px]">

              {/* ==================================================
                  LEFT NAVIGATION
              ================================================== */}

              <aside className="w-full md:w-[280px] bg-[#fcfbff] border-b md:border-b-0 md:border-r border-violet-100 p-4">

                {/* PROFILE MINI CARD */}

                <div className="relative overflow-hidden p-4 rounded-2xl bg-gradient-to-br from-violet-600 to-fuchsia-600 text-white mb-4">

                  <div className="absolute -right-8 -top-8 w-24 h-24 rounded-full bg-white/10" />

                  <div className="relative flex items-center gap-3">

                    {dashboardLoading ? (
                      <div className="w-11 h-11 rounded-full bg-white/20 animate-pulse" />
                    ) : (
                      <ProfileAvatar size={44} />
                    )}

                    <div className="min-w-0">

                      <h3 className="text-sm font-black truncate">
                        {dashboardLoading
                          ? "Loading..."
                          : username}
                      </h3>

                      <p className="text-[10px] text-white/70 truncate">
                        Manage your settings
                      </p>

                    </div>

                  </div>

                </div>

                {/* NAVIGATION */}

                <div className="space-y-1">

                  {settingsItems.map((item) => {

                    const Icon = item.icon;

                    const selected =
                      activeSection === item.id;

                    return (
                      <button
                        key={item.id}
                        onClick={() =>
                          setActiveSection(item.id)
                        }
                        className={`
                          w-full
                          flex items-center gap-3
                          p-3
                          rounded-2xl
                          text-left
                          transition

                          ${
                            selected
                              ? "bg-violet-100 text-violet-700 shadow-sm"
                              : "text-[#70677d] hover:bg-violet-50"
                          }
                        `}
                      >

                        <div
                          className={`
                            w-9 h-9
                            rounded-xl
                            flex items-center justify-center

                            ${
                              selected
                                ? "bg-white shadow-sm"
                                : "bg-transparent"
                            }
                          `}
                        >

                          <Icon
                            sx={{
                              fontSize: 19,
                              color: selected
                                ? "#7c3aed"
                                : "#91879d",
                            }}
                          />

                        </div>

                        <div className="flex-1 min-w-0">

                          <p className="text-xs font-black">
                            {item.label}
                          </p>

                          <p className="text-[9px] opacity-70 mt-0.5 truncate">
                            {item.description}
                          </p>

                        </div>

                        {selected && (
                          <ChevronRightRounded
                            sx={{
                              fontSize: 17,
                              color: "#7c3aed",
                            }}
                          />
                        )}

                      </button>
                    );
                  })}

                </div>

                {/* LOGOUT */}

                <div className="mt-5 pt-4 border-t border-violet-100">

                  <button
                    className="w-full flex items-center gap-3 p-3 rounded-2xl text-red-500 hover:bg-red-50 transition"
                    onClick={handleLogout}
                  >

                    <div className="w-9 h-9 rounded-xl bg-red-50 flex items-center justify-center">

                      <LogoutRounded
                        sx={{ fontSize: 18 }}
                      />

                    </div>

                    <div className="text-left">

                      <p className="text-xs font-black">
                        Logout
                      </p>

                      <p className="text-[9px] text-red-400 mt-0.5">
                        Sign out of your account
                      </p>

                    </div>

                  </button>

                </div>

              </aside>

              {/* ==================================================
                  RIGHT CONTENT
              ================================================== */}

              <main className="flex-1 p-5 sm:p-7 lg:p-9 overflow-y-auto">

                {activeSection === "activity" &&
                activityLoading ? (

                  <div className="flex items-center justify-center h-64">

                    <div className="flex flex-col items-center gap-3">

                      <div className="w-9 h-9 rounded-full border-2 border-violet-200 border-t-violet-600 animate-spin" />

                      <p className="text-xs text-gray-400">
                        Loading activity settings...
                      </p>

                    </div>

                  </div>

                ) : activityError &&
                  activeSection === "activity" ? (

                  <div className="flex items-center justify-center h-64">

                    <div className="text-center">

                      <p className="text-sm font-bold text-red-500">
                        Unable to load activity settings
                      </p>

                      <p className="text-xs text-gray-400 mt-1">
                        Please try again later.
                      </p>

                    </div>

                  </div>

                ) : (
                  renderContent()
                )}

              </main>

            </div>

          </div>

        </div>

      </div>
    </>
  );
}

export default Settings;