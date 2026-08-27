import React, { useState } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import {
  Avatar,
  IconButton,
  Tooltip,
  Badge,
} from "@mui/material";
import DashboardRoundedIcon from "@mui/icons-material/DashboardRounded";
import ChatRoundedIcon from "@mui/icons-material/ChatRounded";
import GroupsRoundedIcon from "@mui/icons-material/GroupsRounded";
import AccountCircleRoundedIcon from "@mui/icons-material/AccountCircleRounded";
import SettingsRoundedIcon from "@mui/icons-material/SettingsRounded";
import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";
import {FaNewspaper} from  "react-icons/fa";
import ForumRoundedIcon from "@mui/icons-material/ForumRounded";
import { Network } from "lucide-react";

export default function MainLayout() {
  const navigate = useNavigate();
  const location = useLocation();

  const user = JSON.parse(localStorage.getItem("chat_user")) || {
    username: localStorage.getItem("username") || "User",
  };

  const navItems = [
    { label: "Dashboard", path: "/dashboard", icon: <DashboardRoundedIcon fontSize="small" /> },
    { label: "Chats", path: "/chat", icon: <ChatRoundedIcon fontSize="small" /> },
    
    { label: "Groups", path: "/groups", icon: <GroupsRoundedIcon fontSize="small" /> },
    { label: "New Post", path: "/new-post", icon: <GroupsRoundedIcon fontSize="small" /> },
    { label: "Feed", path: "/feed", icon: <FaNewspaper fontSize="small" /> },
    { label: "Settings", path: "/setting", icon: <SettingsRoundedIcon fontSize="small" /> },
  ];
  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <div className="flex h-screen bg-[#f5f3ff] overflow-hidden font-sans">
      {/* =================================================
          SIDEBAR
          ================================================= */}
      <aside className="w-64 bg-white border-r border-violet-100 flex flex-col justify-between shadow-[4px_0_24px_rgba(124,58,237,0.04)] z-20">
        <div>
          {/* Brand Header */}
          <div className="p-5 border-b border-violet-100 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#6d28d9] to-[#9333ea] flex items-center justify-center text-white shadow-md shadow-violet-500/20">
              <ForumRoundedIcon fontSize="small" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-[#27213a] leading-none">
                Pulse<span className="text-[#7c3aed]">Chat</span>
              </h1>
              <p className="text-[11px] text-[#7c738f] mt-1">Real-time Workspace</p>
            </div>
          </div>

          {/* Navigation Section */}
          <div className="p-3">
            <p className="text-[11px] font-bold text-[#a8a0b4] px-3 uppercase tracking-wider mb-2">
              Menu
            </p>
            <nav className="space-y-1">
              {navItems.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <button
                    key={item.path}
                    onClick={() => navigate(item.path)}
                    className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all cursor-pointer ${
                      isActive
                        ? "bg-gradient-to-r from-[#7c3aed] to-[#9333ea] text-white shadow-md shadow-violet-500/20"
                        : "text-[#7c738f] hover:bg-[#faf9ff] hover:text-[#7c3aed]"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      {item.icon}
                      <span>{item.label}</span>
                    </div>

                    {/* Unread Badge */}
                    {item.badge && (
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                          isActive
                            ? "bg-white text-[#7c3aed]"
                            : "bg-violet-100 text-[#7c3aed]"
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* User Footer Profile */}
        <div className="p-3 border-t border-violet-100 bg-[#faf9ff]/80 flex items-center justify-between">
          <div className="flex items-center gap-2.5 overflow-hidden">
            <Badge
              variant="dot"
              overlap="circular"
              anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
              sx={{ "& .MuiBadge-badge": { bgcolor: "#10b981" } }}
            >
              <Avatar
                sx={{
                  width: 38,
                  height: 38,
                  bgcolor: "#7c3aed",
                  fontWeight: 700,
                  fontSize: "0.9rem",
                }}
              >
                {user.username?.[0]?.toUpperCase() || "U"}
              </Avatar>
            </Badge>

            <div className="truncate text-left leading-tight">
              <p className="text-sm font-bold text-[#27213a] truncate">
                {user.username}
              </p>
              <p className="text-[11px] text-emerald-600 font-medium">Online</p>
            </div>
          </div>

          <Tooltip title="Sign Out">
            <IconButton
              onClick={handleLogout}
              size="small"
              sx={{
                color: "#7c738f",
                "&:hover": { color: "#ef4444", bgcolor: "#fee2e2" },
              }}
            >
              <LogoutRoundedIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </div>
      </aside>

      {/* =================================================
          OUTLET PAGE CONTAINER
          ================================================= */}
      <main className="flex-1 flex flex-col overflow-y-auto bg-[#f5f3ff] relative">
        <Outlet />
      </main>
    </div>
  );
}