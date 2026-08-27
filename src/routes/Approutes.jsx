import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import MainLayout from "../pages/layouts/MainLayout";
import LoginPage from "../pages/Login/Loginpage";
import RegisterPage from "../pages/Register/RegisterPage";
import ForgotPassword from "../pages/ForgotPassword/ForgotPassword";
import HomePage from "../pages/Home/Home";
import Dashboard from "../pages/Dashboard/Dashboard";
import Profile from "../pages/profile/Profile";
import Chat from "../pages/Chat/Chat";
import Setting from "../pages/Setting/Setting";

import GroupChat from "../pages/GroupChat/GroupChat";
import MyGroups from "../pages/MyGroups/MyGroups";
import CreateGroup from "../pages/CreateGroup/CreateGroup";
import GroupInvitations from "../pages/GroupInvitations/GroupInvitations";
import FindFriends from "../pages/FindFriends/FindFriends";

import Feed from "../pages/Feed/Feed"
import NewPost from "../pages/NewPost/NewPost";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/" element={<HomePage />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />

      <Route element={<MainLayout />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="/chat/:id" element={<Chat />} />
        <Route path="/setting" element={<Setting />} />
        <Route path="/find-friend" element={<FindFriends />} />

        <Route path="/groups" element={<MyGroups />} />
        <Route path="/groups/create" element={<CreateGroup />} />
        <Route path="/group-chat/:groupid" element={<GroupChat />} />
        <Route path="/group-requests" element={<GroupInvitations />} />
        
        
        <Route path="/feed" element={<Feed />} />
        <Route path="/new-post" element={<NewPost />} />
      
      </Route>

      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}