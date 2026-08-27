import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  TextField,
  Button,
  InputAdornment,
  IconButton,
  CircularProgress,
} from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import LockResetRoundedIcon from "@mui/icons-material/LockResetRounded";
import LockRoundedIcon from "@mui/icons-material/LockRounded";
import AlternateEmailRoundedIcon from "@mui/icons-material/AlternateEmailRounded";
import MarkEmailReadRoundedIcon from "@mui/icons-material/MarkEmailReadRounded";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import ShieldRoundedIcon from "@mui/icons-material/ShieldRounded";
import ForumRoundedIcon from "@mui/icons-material/ForumRounded";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import KeyRoundedIcon from "@mui/icons-material/KeyRounded";
import MarkChatReadRoundedIcon from "@mui/icons-material/MarkChatReadRounded";
import HpnRoundedIcon from "@mui/icons-material/VpnKeyRounded";
import { toast } from "react-toastify";
import axios from "axios";
import { useForgotPassword } from "../../hooks/useForgotPassword";
import { URL } from "../../../config";

/*
=========================================================
HIGH-CONTRAST VISIBLE INPUT STYLES (FIXED INVISIBLE TEXT)
=========================================================
*/
const highContrastInputStyles = {
  "& .MuiOutlinedInput-root": {
    height: "52px",
    backgroundColor: "#ffffff !important",
    borderRadius: "14px",
    transition: "all 0.2s ease",

    "& fieldset": {
      borderColor: "#cbd5e1",
      borderWidth: "1.5px",
    },

    "&:hover fieldset": {
      borderColor: "#7c3aed",
    },

    "&.Mui-focused fieldset": {
      borderColor: "#7c3aed",
      borderWidth: "2px",
    },

    "&.Mui-disabled": {
      backgroundColor: "#f8fafc !important",
      "& fieldset": {
        borderColor: "#e2e8f0",
      },
    },
  },

  // Ensures typed text is sharp, dark, and 100% visible
  "& .MuiInputBase-input": {
    color: "#0f172a !important",
    WebkitTextFillColor: "#0f172a !important",
    fontSize: "14px !important",
    fontWeight: "600 !important",
    fontFamily: "inherit !important",
  },

  // Crisp placeholder color
  "& .MuiInputBase-input::placeholder": {
    color: "#64748b !important",
    opacity: "1 !important",
    fontWeight: "400 !important",
  },
};

export default function ForgotPassword() {
  const navigate = useNavigate();

  const { mutate: updatePasswordMutate, isPending } = useForgotPassword();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [emailVerified, setEmailVerified] = useState(false);
  const [sendingOTP, setSendingOTP] = useState(false);
  const [verifyingOTP, setVerifyingOTP] = useState(false);

  const [formData, setFormData] = useState({
    login: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSendOTP = async () => {
    try {
      if (!formData.login.trim()) {
        return toast.error("Enter email or phone first");
      }

      setSendingOTP(true);

      const response = await axios.post(`${URL}/user/sendforgototp`, {
        login: formData.login,
      });

      toast.success(response.data || "OTP sent successfully!");
      setOtpSent(true);
    } catch (error) {
      toast.error(error?.response?.data || "OTP sending failed");
    } finally {
      setSendingOTP(false);
    }
  };

  const handleVerifyOTP = async () => {
    try {
      if (!otp.trim()) {
        return toast.error("Enter OTP");
      }

      setVerifyingOTP(true);

      const response = await axios.post(`${URL}/user/verifyforgototp`, {
        login: formData.login,
        otp,
      });

      setEmailVerified(true);
      toast.success(
        response.data?.message || response.data || "OTP Verified Successfully 🎉"
      );
    } catch (error) {
      setEmailVerified(false);
      toast.error(
        error?.response?.data?.message ||
          error?.response?.data ||
          "Invalid OTP"
      );
    } finally {
      setVerifyingOTP(false);
    }
  };

  const handleResetPassword = (e) => {
    e.preventDefault();

    if (!formData.login.trim()) {
      toast.error("Please enter your email or phone");
      return;
    }

    if (!emailVerified) {
      toast.error("Please verify OTP first");
      return;
    }

    if (!formData.password.trim()) {
      toast.error("Please enter a new password");
      return;
    }

    if (formData.password.length < 6) {
      toast.error("Password must contain at least 6 characters");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    updatePasswordMutate(
      {
        login: formData.login,
        password: formData.password,
        confirmPassword: formData.confirmPassword,
      },
      {
        onSuccess: (data) => {
          toast.success(
            typeof data === "string" ? data : "Password Updated Successfully 🎉"
          );
          setTimeout(() => {
            navigate("/login");
          }, 1000);
        },
        onError: (error) => {
          const message =
            error?.response?.data?.message ||
            error?.response?.data ||
            "Password update failed. Please try again.";
          toast.error(message);
        },
      }
    );
  };

  return (
    <div className="min-h-screen bg-[#f1f0f9] flex items-center justify-center p-4 sm:p-6 lg:p-8 font-sans relative overflow-hidden">
      
      {/* Background Decorative Glows */}
      <div className="fixed -top-40 -left-40 w-96 h-96 bg-purple-300/30 rounded-full blur-[130px] pointer-events-none" />
      <div className="fixed -bottom-40 -right-40 w-96 h-96 bg-fuchsia-300/30 rounded-full blur-[130px] pointer-events-none" />

      {/* Main Dual-Column Canvas */}
      <div className="relative z-10 w-full max-w-5xl bg-white rounded-[32px] border border-slate-200 shadow-[0_20px_70px_rgba(15,23,42,0.08)] grid grid-cols-1 md:grid-cols-12 overflow-hidden">
        
        {/* =================================================
            LEFT PANEL: INTERACTIVE SECURITY MATRIX & LIVE HINTS
            ================================================= */}
        <div className="md:col-span-5 bg-gradient-to-br from-[#1e1035] via-[#2d124d] to-[#4c1d95] p-6 sm:p-8 text-white flex flex-col justify-between space-y-6 relative">
          
          <div className="space-y-4">
            {/* Top Brand Identity */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#7c3aed] to-[#c026d3] flex items-center justify-center text-white shadow-md">
                  <ForumRoundedIcon fontSize="small" />
                </div>
                <span className="text-sm font-extrabold tracking-wide text-white">
                  PulseChat
                </span>
              </div>

              <span className="text-[10px] font-mono font-bold tracking-wider uppercase bg-white/10 px-2.5 py-1 rounded-full border border-white/15 text-violet-200">
                Security Node
              </span>
            </div>

            <div className="pt-2">
              <h1 className="text-2xl font-black text-white leading-tight">
                Secure Account Key Reset
              </h1>
              <p className="text-xs text-violet-200/90 mt-1 leading-relaxed">
                Follow the 3-step verification matrix below to safely recover your account access.
              </p>
            </div>
          </div>

          {/* Dynamic 3-Step Live Security Checklist */}
          <div className="space-y-3 bg-[#130924]/80 backdrop-blur-md p-4 rounded-2xl border border-violet-700/30 shadow-inner">
            
            {/* Step 1 Hint */}
            <div className={`flex items-start gap-3 p-2.5 rounded-xl transition-all ${formData.login.trim() ? "bg-emerald-950/40 border border-emerald-500/30" : "bg-white/5"}`}>
              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${formData.login.trim() ? "bg-emerald-500 text-slate-900" : "bg-violet-900/60 text-violet-200"}`}>
                1
              </div>
              <div className="leading-tight">
                <span className="text-xs font-bold text-white block">Identifier Match</span>
                <span className="text-[11px] text-violet-300">
                  {formData.login.trim() ? formData.login : "Enter your registered email or phone"}
                </span>
              </div>
            </div>

            {/* Step 2 Hint */}
            <div className={`flex items-start gap-3 p-2.5 rounded-xl transition-all ${emailVerified ? "bg-emerald-950/40 border border-emerald-500/30" : "bg-white/5"}`}>
              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${emailVerified ? "bg-emerald-500 text-slate-900" : "bg-violet-900/60 text-violet-200"}`}>
                2
              </div>
              <div className="leading-tight">
                <span className="text-xs font-bold text-white block">2FA OTP Handshake</span>
                <span className="text-[11px] text-violet-300">
                  {emailVerified ? "OTP Confirmed & Verified" : "Verify temporary token"}
                </span>
              </div>
            </div>

            {/* Step 3 Hint */}
            <div className={`flex items-start gap-3 p-2.5 rounded-xl transition-all ${formData.password && formData.password === formData.confirmPassword ? "bg-emerald-950/40 border border-emerald-500/30" : "bg-white/5"}`}>
              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${formData.password && formData.password === formData.confirmPassword ? "bg-emerald-500 text-slate-900" : "bg-violet-900/60 text-violet-200"}`}>
                3
              </div>
              <div className="leading-tight">
                <span className="text-xs font-bold text-white block">Key Synchronization</span>
                <span className="text-[11px] text-violet-300">
                  {formData.password && formData.password === formData.confirmPassword ? "New keys matched" : "Set replacement password"}
                </span>
              </div>
            </div>

          </div>

          {/* Bottom Security Footer */}
          <div className="pt-3 border-t border-violet-900/40 flex items-center justify-between text-[11px] text-violet-300 font-mono">
            <div className="flex items-center gap-1.5">
              <ShieldRoundedIcon sx={{ fontSize: 16, color: "#a855f7" }} />
              <span>TLS v1.3 Verified</span>
            </div>
            <span className="text-emerald-400">Node Online</span>
          </div>

        </div>

        {/* =================================================
            RIGHT PANEL: HIGH-CONTRAST FORM
            ================================================= */}
        <div className="md:col-span-7 p-6 sm:p-10 flex flex-col justify-between space-y-6">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#7c3aed] flex items-center gap-1">
              <HpnRoundedIcon sx={{ fontSize: 15 }} />
              Credential Recovery
            </span>
            <h2 className="text-2xl font-black text-[#0f172a] mt-1">
              Forgot Password
            </h2>
            <p className="text-xs text-[#64748b] mt-0.5">
              Verify your identity to configure a new replacement password.
            </p>
          </div>

          <form onSubmit={handleResetPassword} className="space-y-4">
            
            {/* Email/Phone Input with Send OTP */}
            <div className="space-y-1">
              <label className="text-xs font-bold uppercase tracking-wider text-[#334155] block">
                Registered Email or Phone
              </label>
              <div className="flex gap-2 items-center">
                <TextField
                  fullWidth
                  placeholder="Enter email or phone"
                  name="login"
                  required
                  value={formData.login}
                  onChange={handleChange}
                  disabled={isPending || emailVerified}
                  sx={highContrastInputStyles}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <AlternateEmailRoundedIcon sx={{ color: "#7c3aed", fontSize: 18 }} />
                      </InputAdornment>
                    ),
                    endAdornment: emailVerified ? (
                      <InputAdornment position="end">
                        <MarkEmailReadRoundedIcon sx={{ color: "#10b981", mr: 0.5 }} />
                      </InputAdornment>
                    ) : null,
                  }}
                />

                {!emailVerified && (
                  <Button
                    type="button"
                    variant="contained"
                    onClick={handleSendOTP}
                    disabled={otpSent || sendingOTP || isPending}
                    sx={{
                      height: "52px",
                      minWidth: "110px",
                      borderRadius: "14px",
                      textTransform: "none",
                      fontWeight: 700,
                      fontSize: "0.82rem",
                      background: "linear-gradient(135deg, #7c3aed, #9333ea)",
                      boxShadow: "none",
                      "&:hover": {
                        background: "linear-gradient(135deg, #6d28d9, #7e22ce)",
                        boxShadow: "none",
                      },
                      "&.Mui-disabled": {
                        background: "#ede9fe",
                        color: "#7c738f",
                      },
                    }}
                  >
                    {sendingOTP ? (
                      <CircularProgress size={18} sx={{ color: "#fff" }} />
                    ) : otpSent ? (
                      "Sent"
                    ) : (
                      "Send OTP"
                    )}
                  </Button>
                )}
              </div>
            </div>

            {/* OTP Verification Input Row */}
            {otpSent && !emailVerified && (
              <div className="flex gap-2 items-center">
                <TextField
                  fullWidth
                  placeholder="Enter 6-digit OTP code"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  disabled={verifyingOTP || isPending}
                  sx={highContrastInputStyles}
                />

                <Button
                  type="button"
                  variant="contained"
                  onClick={handleVerifyOTP}
                  disabled={verifyingOTP || isPending || !otp.trim()}
                  sx={{
                    height: "52px",
                    minWidth: "100px",
                    borderRadius: "14px",
                    textTransform: "none",
                    fontWeight: 700,
                    fontSize: "0.82rem",
                    background: "linear-gradient(135deg, #10b981, #059669)",
                    boxShadow: "none",
                    "&:hover": {
                      background: "linear-gradient(135deg, #059669, #047857)",
                      boxShadow: "none",
                    },
                    "&.Mui-disabled": {
                      background: "#a7f3d0",
                      color: "#065f46",
                    },
                  }}
                >
                  {verifyingOTP ? (
                    <CircularProgress size={18} sx={{ color: "#fff" }} />
                  ) : (
                    "Verify"
                  )}
                </Button>
              </div>
            )}

            {/* New Password & Confirmation in Crisp High-Contrast Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-bold uppercase tracking-wider text-[#334155] block">
                  New Password
                </label>
                <TextField
                  fullWidth
                  placeholder="New password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  value={formData.password}
                  onChange={handleChange}
                  disabled={!emailVerified || isPending}
                  sx={highContrastInputStyles}
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
                          disabled={!emailVerified || isPending}
                          sx={{ color: "#64748b" }}
                        >
                          {showPassword ? (
                            <VisibilityOff fontSize="small" />
                          ) : (
                            <Visibility fontSize="small" />
                          )}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold uppercase tracking-wider text-[#334155] block">
                  Confirm Password
                </label>
                <TextField
                  fullWidth
                  placeholder="Repeat password"
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  required
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  disabled={!emailVerified || isPending}
                  sx={highContrastInputStyles}
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
                          onClick={() => setShowConfirmPassword((prev) => !prev)}
                          edge="end"
                          disabled={!emailVerified || isPending}
                          sx={{ color: "#64748b" }}
                        >
                          {showConfirmPassword ? (
                            <VisibilityOff fontSize="small" />
                          ) : (
                            <Visibility fontSize="small" />
                          )}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </div>
            </div>

            {/* Save Action */}
            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={isPending || !emailVerified}
              endIcon={!isPending ? <ArrowForwardRoundedIcon /> : null}
              sx={{
                height: "50px",
                fontWeight: 700,
                textTransform: "none",
                borderRadius: "14px",
                fontSize: "0.92rem",
                marginTop: "10px",
                background: "linear-gradient(135deg, #7c3aed, #9333ea)",
                boxShadow: "0 8px 25px rgba(124,58,237,0.25)",
                "&:hover": {
                  background: "linear-gradient(135deg, #6d28d9, #7e22ce)",
                },
                "&.Mui-disabled": {
                  background: "#ede9fe",
                  color: "#7c738f",
                },
              }}
            >
              {isPending ? "Updating Password..." : "Save New Password"}
            </Button>
          </form>

          {/* Footer Back Link */}
          <div className="pt-2 text-center text-xs text-[#64748b]">
            <Link
              to="/login"
              className="inline-flex items-center gap-1 font-bold text-[#7c3aed] hover:text-[#6d28d9] transition-colors"
            >
              <ArrowBackRoundedIcon sx={{ fontSize: 14 }} />
              <span>Back to Login</span>
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}