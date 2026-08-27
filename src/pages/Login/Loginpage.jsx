import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  TextField,
  Button,
  InputAdornment,
  IconButton,
} from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import SecurityRoundedIcon from "@mui/icons-material/SecurityRounded";
import ForumRoundedIcon from "@mui/icons-material/ForumRounded";
import ChatRoundedIcon from "@mui/icons-material/ChatRounded";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import LockRoundedIcon from "@mui/icons-material/LockRounded";
import AlternateEmailRoundedIcon from "@mui/icons-material/AlternateEmailRounded";
import AutoAwesomeRoundedIcon from "@mui/icons-material/AutoAwesomeRounded";
import DoneAllRoundedIcon from "@mui/icons-material/DoneAllRounded";
import { toast } from "react-toastify";
import { useLogin } from "../../hooks/useLogin";

/*
=========================================================
LOGIN INPUT STYLES
=========================================================
*/
const modernInputStyles = {
  "& .MuiOutlinedInput-root": {
    height: "54px",
    backgroundColor: "#faf9ff",
    borderRadius: "14px",
    color: "#27213a",
    transition: "all 0.2s ease",

    "& fieldset": {
      borderColor: "#ede9fe",
      borderWidth: "1.5px",
    },

    "&:hover fieldset": {
      borderColor: "#a78bfa",
    },

    "&.Mui-focused fieldset": {
      borderColor: "#7c3aed",
      borderWidth: "1.5px",
    },

    "&.Mui-disabled": {
      backgroundColor: "#f5f3ff",
      "& fieldset": {
        borderColor: "#ede9fe",
      },
    },
  },

  "& .MuiInputLabel-root": {
    color: "#7c738f",
  },

  "& .MuiInputLabel-root.Mui-focused": {
    color: "#7c3aed",
  },

  "& .MuiInputLabel-root.Mui-disabled": {
    color: "#a8a0b4",
  },

  "& .MuiInputBase-input": {
    color: "#27213a",
    fontSize: "14px",
  },

  "& .MuiInputBase-input::placeholder": {
    color: "#aaa3b5",
    opacity: 1,
  },
};

export default function LoginPage() {
  const navigate = useNavigate();

  /*
  ========================================================
  TANSTACK QUERY LOGIN MUTATION
  ========================================================
  */
  const { mutate: loginUser, isPending } = useLogin();

  /*
  ========================================================
  FORM STATE
  ========================================================
  */
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    login: "",
    password: "",
  });

  /*
  ========================================================
  HANDLE INPUT CHANGE
  ========================================================
  */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  /*
  ========================================================
  HANDLE LOGIN & ROUTE DECISION
  ========================================================
  */
  const handleLogin = (e) => {
    e.preventDefault();

    if (!formData.login.trim()) {
      toast.error("Please enter your email or phone number");
      return;
    }

    if (!formData.password.trim()) {
      toast.error("Please enter your password");
      return;
    }

    loginUser(
      {
        login: formData.login,
        password: formData.password,
      },
      {
        onSuccess: (data) => {
          if (data?.token) {
            localStorage.setItem("token", data.token);
          }
          if (data?.userid) {
            localStorage.setItem("userid", data.userid);
          }
          if (data?.username) {
            localStorage.setItem("username", data.username);
          }

          toast.success("Logged-in Successfully");

          // Route decision: Profile vs Dashboard
          if (data?.profileexists) {
            localStorage.setItem("profileid", data.profileid);
            navigate("/dashboard");
          } else {
            localStorage.removeItem("profileid");
            navigate("/Profile");
          }
        },
        onError: (error) => {
          toast.error(error?.response?.data?.message || "Login failed");
        },
      }
    );
  };

  return (
    <div className="min-h-screen bg-[#f5f3ff] flex items-center justify-center px-4 py-8 relative overflow-hidden font-sans">
      {/* Background Decoration */}
      <div className="absolute -top-40 -left-40 w-[500px] h-[500px] rounded-full bg-violet-300/25 blur-[120px] pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-[500px] h-[500px] rounded-full bg-fuchsia-200/30 blur-[120px] pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] rounded-full bg-purple-200/20 blur-[100px] pointer-events-none" />

      {/* Main Container */}
      <div className="relative z-10 w-full max-w-5xl bg-white rounded-[28px] border border-violet-100 shadow-[0_25px_80px_rgba(76,29,149,0.12)] overflow-hidden flex flex-col md:flex-row">
        
        {/* =================================================
            LEFT: LIVE REAL-TIME CHAT PANEL (46%)
            ================================================= */}
        <div className="md:w-[46%] bg-gradient-to-br from-[#6d28d9] via-[#7c3aed] to-[#9333ea] p-8 md:p-10 text-white relative overflow-hidden flex flex-col justify-between">
          <div className="absolute -top-28 -right-24 w-72 h-72 rounded-full bg-white/10 pointer-events-none" />
          <div className="absolute -bottom-32 -left-24 w-80 h-80 rounded-full bg-black/5 pointer-events-none" />

          <div className="relative z-10 space-y-8">
            {/* Brand Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-white/15 border border-white/20 flex items-center justify-center">
                  <ChatRoundedIcon sx={{ fontSize: 24, color: "#ffffff" }} />
                </div>
                <div>
                  <h1 className="text-lg font-bold">PulseChat</h1>
                  <p className="text-violet-200 text-xs">Real-time messaging companion</p>
                </div>
              </div>

              <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 border border-white/20 text-[10px] font-mono text-emerald-300">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Live Node
              </span>
            </div>

            {/* Left Heading */}
            <div>
              <h2 className="text-2xl md:text-3xl font-bold leading-tight">
                Your conversations <span className="block text-violet-200">are waiting.</span>
              </h2>
              <p className="text-violet-100 text-xs sm:text-sm leading-relaxed mt-2">
                Sign in to join active discussions, voice lounges, and collaborative rooms with zero latency.
              </p>
            </div>

            {/* Live Message Preview Feed */}
            <div className="space-y-3">
              <div className="bg-white/10 border border-white/10 rounded-2xl p-3.5 space-y-1 backdrop-blur-md">
                <div className="flex justify-between items-center text-[10px] text-violet-200">
                  <span className="font-bold text-white flex items-center gap-1">
                    <ForumRoundedIcon sx={{ fontSize: 13 }} /> #general-chat
                  </span>
                  <span>10:45 AM</span>
                </div>
                <p className="text-xs text-violet-100 leading-relaxed">
                  Realtime connection is active. All rooms are synchronized ⚡
                </p>
              </div>
            </div>
          </div>

          {/* Bottom Security Assurance */}
          <div className="relative z-10 pt-6 mt-6 border-t border-white/10 flex items-center justify-between text-xs text-violet-200">
            <div className="flex items-center gap-1.5">
              <CheckCircleRoundedIcon sx={{ fontSize: 16 }} />
              <span>TLS End-to-End Encrypted</span>
            </div>
            <div className="flex items-center gap-1 text-[11px] font-mono text-emerald-300">
              <DoneAllRoundedIcon sx={{ fontSize: 14 }} />
              <span>Synced</span>
            </div>
          </div>
        </div>

        {/* =================================================
            RIGHT: LOGIN FORM PANEL (54%)
            ================================================= */}
        <div className="md:w-[54%] p-7 md:p-10 flex items-center justify-center">
          <div className="w-full max-w-md">
            
            {/* Form Header */}
            <div className="mb-6">
              <span className="text-xs font-bold uppercase tracking-wider text-[#7c3aed] flex items-center gap-1 mb-1">
                <AutoAwesomeRoundedIcon sx={{ fontSize: 14 }} />
                Secure Portal
              </span>
              <h2 className="text-2xl font-bold text-[#29213d]">Welcome Back</h2>
              <p className="text-[#7c738f] text-sm mt-1">
                Fill in your details below to start chatting with your friends.
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleLogin} className="flex flex-col gap-4">
              {/* Login Field (Email / Phone) */}
              <div className="space-y-1">
                <label className="text-xs font-bold uppercase tracking-wider text-[#27213a] block">
                  Email or Phone
                </label>
                <TextField
                  fullWidth
                  placeholder="Enter email or phone number"
                  name="login"
                  required
                  value={formData.login}
                  onChange={handleChange}
                  disabled={isPending}
                  sx={modernInputStyles}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <AlternateEmailRoundedIcon sx={{ color: "#7c3aed", fontSize: 18 }} />
                      </InputAdornment>
                    ),
                  }}
                />
              </div>

              {/* Password Field */}
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold uppercase tracking-wider text-[#27213a]">
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={() => navigate("/forgot-password")}
                    className="text-xs text-[#7c3aed] hover:text-[#6d28d9] font-bold cursor-pointer transition-colors"
                  >
                    Forgot?
                  </button>
                </div>

                <TextField
                  fullWidth
                  placeholder="Enter your password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  value={formData.password}
                  onChange={handleChange}
                  disabled={isPending}
                  sx={modernInputStyles}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <LockRoundedIcon sx={{ color: "#7c3aed", fontSize: 18 }} />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          type="button"
                          onClick={() => setShowPassword((prev) => !prev)}
                          edge="end"
                          disabled={isPending}
                          sx={{ color: "#9ca3af" }}
                        >
                          {showPassword ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </div>

              {/* Login Button */}
              <Button
                type="submit"
                fullWidth
                variant="contained"
                disabled={isPending}
                endIcon={!isPending ? <ArrowForwardRoundedIcon /> : null}
                sx={{
                  height: "50px",
                  fontWeight: 700,
                  textTransform: "none",
                  borderRadius: "14px",
                  fontSize: "0.92rem",
                  marginTop: "6px",
                  background: "linear-gradient(135deg, #7c3aed, #9333ea)",
                  boxShadow: "0 8px 22px rgba(124,58,237,0.2)",
                  "&:hover": {
                    background: "linear-gradient(135deg, #6d28d9, #7e22ce)",
                    boxShadow: "0 10px 28px rgba(124,58,237,0.28)",
                  },
                  "&.Mui-disabled": {
                    background: "#ddd6fe",
                    color: "#7c738f",
                  },
                }}
              >
                {isPending ? "Signing in..." : "Sign in to PulseChat"}
              </Button>
            </form>

            {/* Divider */}
            <div className="flex items-center gap-3 my-5">
              <div className="h-px bg-violet-100 flex-1" />
              <span className="text-[10px] font-bold tracking-wider text-[#a8a0b4] uppercase">
                NEW TO PULSECHAT?
              </span>
              <div className="h-px bg-violet-100 flex-1" />
            </div>

            {/* Register Navigation Button */}
            <Button
              fullWidth
              variant="outlined"
              onClick={() => navigate("/register")}
              sx={{
                height: "46px",
                borderRadius: "14px",
                borderColor: "#ddd6fe",
                color: "#6d28d9",
                fontWeight: 700,
                textTransform: "none",
                fontSize: "0.85rem",
                "&:hover": {
                  borderColor: "#a78bfa",
                  backgroundColor: "#faf9ff",
                },
              }}
            >
              Create a new account
            </Button>

            {/* Security Footnote */}
            <div className="mt-4 flex items-center justify-center gap-1.5 text-xs text-[#a8a0b4]">
              <SecurityRoundedIcon sx={{ fontSize: 14 }} />
              <span>Encrypted Node &bull; Real-time Verified</span>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}


