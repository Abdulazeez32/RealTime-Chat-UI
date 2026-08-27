import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  TextField,
  Button,
  InputAdornment,
  IconButton,
  CircularProgress,
  LinearProgress,
} from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import PersonRoundedIcon from "@mui/icons-material/PersonRounded";
import AlternateEmailRoundedIcon from "@mui/icons-material/AlternateEmailRounded";
import PhoneRoundedIcon from "@mui/icons-material/PhoneRounded";
import LockRoundedIcon from "@mui/icons-material/LockRounded";
import MarkEmailReadRoundedIcon from "@mui/icons-material/MarkEmailReadRounded";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import ShieldRoundedIcon from "@mui/icons-material/ShieldRounded";
import AutoAwesomeRoundedIcon from "@mui/icons-material/AutoAwesomeRounded";
import ForumRoundedIcon from "@mui/icons-material/ForumRounded";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import { toast } from "react-toastify";
import axios from "axios";
import { useRegister } from "../../hooks/useRegister";
import { URL } from "../../../config";

/*
=========================================================
MODERN REGISTER INPUT STYLES
=========================================================
*/
const registerInputStyles = {
  "& .MuiOutlinedInput-root": {
    height: "52px",
    backgroundColor: "#ffffff",
    borderRadius: "14px",
    color: "#27213a",
    transition: "all 0.2s ease",

    "& fieldset": {
      borderColor: "#e2e8f0",
      borderWidth: "1.5px",
    },

    "&:hover fieldset": {
      borderColor: "#a855f7",
    },

    "&.Mui-focused fieldset": {
      borderColor: "#7c3aed",
      borderWidth: "1.5px",
    },

    "&.Mui-disabled": {
      backgroundColor: "#f8fafc",
      "& fieldset": {
        borderColor: "#f1f5f9",
      },
    },
  },

  "& .MuiInputBase-input": {
    color: "#27213a",
    fontSize: "14px",
  },
};

export default function RegisterPage() {
  const navigate = useNavigate();

  /*
  ========================================================
  TANSTACK QUERY REGISTER MUTATION
  ========================================================
  */
  const { mutate: registerUser, isPending } = useRegister();

  /*
  ========================================================
  FORM STATE & OTP STATE
  ========================================================
  */
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [emailVerified, setEmailVerified] = useState(false);
  const [sendingOTP, setSendingOTP] = useState(false);
  const [verifyingOTP, setVerifyingOTP] = useState(false);

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
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
  SEND OTP
  ========================================================
  */
  const handleSendOTP = async () => {
    try {
      if (!formData.email.trim()) {
        return toast.error("Enter email first");
      }

      setSendingOTP(true);

      const response = await axios.post(`${URL}/user/sentotp`, {
        email: formData.email,
      });

      toast.success(response.data || "OTP sent successfully!");
      setOtpSent(true);
    } catch (error) {
      toast.error(error?.response?.data || "OTP sending failed");
    } finally {
      setSendingOTP(false);
    }
  };

  /*
  ========================================================
  VERIFY OTP
  ========================================================
  */
  const handleVerifyOTP = async () => {
    try {
      if (!otp.trim()) {
        return toast.error("Enter OTP");
      }

      setVerifyingOTP(true);

      const response = await axios.post(`${URL}/user/verifyotp`, {
        email: formData.email,
        otp,
      });

      if (
        typeof response.data === "string" &&
        response.data.toLowerCase().includes("verified")
      ) {
        toast.success("Email Verified Successfully");
        setEmailVerified(true);
      } else {
        setEmailVerified(false);
        toast.error("Invalid OTP");
      }
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

  /*
  ========================================================
  HANDLE REGISTER
  ========================================================
  */
  const handleRegister = (e) => {
    e.preventDefault();

    if (!formData.username.trim()) {
      toast.error("Please enter a username");
      return;
    }

    if (!formData.email.trim()) {
      toast.error("Please enter your email");
      return;
    }

    if (!emailVerified) {
      toast.error("Please verify your email first");
      return;
    }

    if (!formData.phone.trim()) {
      toast.error("Please enter your phone number");
      return;
    }

    if (!formData.password.trim()) {
      toast.error("Please enter a password");
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

    const payload = {
      username: formData.username,
      email: formData.email,
      phone: formData.phone,
      password: formData.password,
    };

    registerUser(payload, {
      onSuccess: (data) => {
        toast.success(
          typeof data === "string"
            ? data
            : data?.message || "Account created successfully!"
        );

        if (data?.token) {
          localStorage.setItem("token", data.token);
        }

        if (data?.user) {
          localStorage.setItem("chat_user", JSON.stringify(data.user));
        }

        setTimeout(() => {
          navigate("/login");
        }, 1200);
      },

      onError: (error) => {
        const message =
          error?.response?.data?.message ||
          error?.response?.data ||
          "Registration failed. Please try again.";

        toast.error(message);
      },
    });
  };

  // Setup completion progress calculate
  const getProgress = () => {
    let completed = 0;
    if (formData.username.trim()) completed += 20;
    if (formData.email.trim()) completed += 20;
    if (emailVerified) completed += 20;
    if (formData.phone.trim()) completed += 20;
    if (formData.password && formData.password === formData.confirmPassword)
      completed += 20;
    return completed;
  };

  return (
    <div className="min-h-screen bg-[#fcfaff] flex items-center justify-center p-4 sm:p-6 lg:p-8 font-sans relative overflow-hidden">
      {/* Background Ambient Decorators */}
      <div className="fixed -top-40 -left-40 w-96 h-96 bg-purple-200/40 rounded-full blur-[120px] pointer-events-none" />
      <div className="fixed -bottom-40 -right-40 w-96 h-96 bg-fuchsia-200/40 rounded-full blur-[120px] pointer-events-none" />

      {/* Main Split Grid Card */}
      <div className="relative z-10 w-full max-w-5xl bg-white rounded-[32px] border border-purple-100 shadow-[0_20px_70px_rgba(124,58,237,0.06)] grid grid-cols-1 md:grid-cols-12 overflow-hidden">
        
        {/* =================================================
            LEFT PANEL: COMMUNITY HUB SHOWCASE (5 Cols)
            ================================================= */}
        <div className="md:col-span-5 bg-gradient-to-br from-[#7c3aed] via-[#8b5cf6] to-[#9333ea] p-6 sm:p-8 text-white flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-white/20 border border-white/25 flex items-center justify-center text-white">
                  <ForumRoundedIcon fontSize="small" />
                </div>
                <span className="text-sm font-extrabold tracking-wide text-white">
                  PandaChat
                </span>
              </div>

              <span className="text-[10px] font-mono font-bold uppercase tracking-wider bg-white/15 px-2.5 py-1 rounded-full border border-white/20">
                Register
              </span>
            </div>

            <div className="pt-2">
              <h1 className="text-2xl font-black text-white leading-tight">
                Get started with your smart chat workspace.
              </h1>
              <p className="text-xs text-purple-100/90 mt-1.5 leading-relaxed">
                Connect seamlessly in encrypted channels, join voice lounges, and collaborate with your network.
              </p>
            </div>
          </div>

          {/* Verification & Setup Step Radar */}
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/15 space-y-3">
            <div className="flex justify-between items-center text-xs">
              <span className="font-bold text-white">Account Setup</span>
              <span className="font-mono text-purple-200">{getProgress()}%</span>
            </div>

            <LinearProgress
              variant="determinate"
              value={getProgress()}
              sx={{
                height: 6,
                borderRadius: 3,
                bgcolor: "rgba(255, 255, 255, 0.2)",
                "& .MuiLinearProgress-bar": { bgcolor: "#ffffff" },
              }}
            />

            <div className="space-y-2 pt-1">
              <div className="flex items-center gap-2 text-xs text-purple-100">
                <CheckCircleRoundedIcon
                  sx={{
                    fontSize: 16,
                    color: emailVerified ? "#a7f3d0" : "rgba(255,255,255,0.4)",
                  }}
                />
                <span>Email 2FA Verification</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-purple-100">
                <CheckCircleRoundedIcon
                  sx={{
                    fontSize: 16,
                    color:
                      formData.password &&
                      formData.password === formData.confirmPassword
                        ? "#a7f3d0"
                        : "rgba(255,255,255,0.4)",
                  }}
                />
                <span>Password Matched</span>
              </div>
            </div>
          </div>

          {/* Bottom Security Assurance */}
          <div className="pt-3 border-t border-white/15 flex items-center justify-between text-[11px] text-purple-200">
            <div className="flex items-center gap-1.5">
              <ShieldRoundedIcon sx={{ fontSize: 15 }} />
              <span>TLS Encrypted Identity</span>
            </div>
            <span className="font-mono">Nodes Active</span>
          </div>
        </div>

        {/* =================================================
            RIGHT PANEL: REGISTRATION FORM (7 Cols)
            ================================================= */}
        <div className="md:col-span-7 p-6 sm:p-10 flex flex-col justify-between space-y-6">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#7c3aed] flex items-center gap-1">
              <AutoAwesomeRoundedIcon sx={{ fontSize: 14 }} />
              Registration
            </span>
            <h2 className="text-2xl font-black text-[#27213a] mt-1">
              Create an Account
            </h2>
            <p className="text-xs text-[#7c738f] mt-0.5">
              Fill in your details below to set up your messaging profile.
            </p>
          </div>

          <form onSubmit={handleRegister} className="space-y-3.5">
            {/* Username */}
            <div className="space-y-1">
              <label className="text-xs font-bold uppercase tracking-wider text-[#27213a] block">
                Username
              </label>
              <TextField
                fullWidth
                placeholder="e.g. alex_dev"
                name="username"
                required
                value={formData.username}
                onChange={handleChange}
                disabled={isPending}
                sx={registerInputStyles}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <PersonRoundedIcon sx={{ color: "#7c3aed", fontSize: 18 }} />
                    </InputAdornment>
                  ),
                }}
              />
            </div>

            {/* Email Address with Send OTP inline button */}
            <div className="space-y-1">
              <label className="text-xs font-bold uppercase tracking-wider text-[#27213a] block">
                Email Address
              </label>
              <div className="flex gap-2 items-center">
                <TextField
                  fullWidth
                  placeholder="you@example.com"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  disabled={isPending || emailVerified}
                  sx={registerInputStyles}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <AlternateEmailRoundedIcon
                          sx={{ color: "#7c3aed", fontSize: 18 }}
                        />
                      </InputAdornment>
                    ),
                    endAdornment: emailVerified ? (
                      <InputAdornment position="end">
                        <MarkEmailReadRoundedIcon
                          sx={{ color: "#10b981", mr: 0.5 }}
                        />
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
                      minWidth: "105px",
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
                      "OTP Sent"
                    ) : (
                      "Send OTP"
                    )}
                  </Button>
                )}
              </div>
            </div>

            {/* OTP Verification Field */}
            {otpSent && !emailVerified && (
              <div className="flex gap-2 items-center">
                <TextField
                  fullWidth
                  placeholder="Enter 6-digit OTP"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  disabled={verifyingOTP || isPending}
                  sx={registerInputStyles}
                />

                <Button
                  type="button"
                  variant="contained"
                  onClick={handleVerifyOTP}
                  disabled={verifyingOTP || isPending || !otp.trim()}
                  sx={{
                    height: "52px",
                    minWidth: "95px",
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

            {/* Phone Number */}
            <div className="space-y-1">
              <label className="text-xs font-bold uppercase tracking-wider text-[#27213a] block">
                Phone Number
              </label>
              <TextField
                fullWidth
                placeholder="e.g. 9876543210"
                name="phone"
                type="tel"
                required
                value={formData.phone}
                onChange={handleChange}
                disabled={!emailVerified || isPending}
                sx={registerInputStyles}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <PhoneRoundedIcon sx={{ color: "#7c3aed", fontSize: 18 }} />
                    </InputAdornment>
                  ),
                }}
              />
            </div>

            {/* Password Fields in Compact Responsive Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-bold uppercase tracking-wider text-[#27213a] block">
                  Password
                </label>
                <TextField
                  fullWidth
                  placeholder="Create password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  value={formData.password}
                  onChange={handleChange}
                  disabled={!emailVerified || isPending}
                  sx={registerInputStyles}
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
                          sx={{ color: "#9ca3af" }}
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
                <label className="text-xs font-bold uppercase tracking-wider text-[#27213a] block">
                  Confirm
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
                  sx={registerInputStyles}
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
                          sx={{ color: "#9ca3af" }}
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

            {/* Submit Register Button */}
            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={isPending || !emailVerified}
              endIcon={!isPending ? <ArrowForwardRoundedIcon /> : null}
              sx={{
                height: "48px",
                fontWeight: 700,
                textTransform: "none",
                borderRadius: "14px",
                fontSize: "0.92rem",
                marginTop: "10px",
                background: "linear-gradient(135deg, #7c3aed, #9333ea)",
                boxShadow: "0 6px 20px rgba(124,58,237,0.25)",
                "&:hover": {
                  background: "linear-gradient(135deg, #6d28d9, #7e22ce)",
                },
                "&.Mui-disabled": {
                  background: "#ede9fe",
                  color: "#7c738f",
                },
              }}
            >
              {isPending ? "Creating Account..." : "Complete Registration"}
            </Button>
          </form>

          {/* Footer Back to Login Navigation */}
          <div className="pt-2 text-center text-xs text-[#7c738f]">
            <span>Already have an account? </span>
            <button
              type="button"
              onClick={() => navigate("/login")}
              className="font-bold text-[#7c3aed] hover:text-[#6d28d9] cursor-pointer transition-colors"
            >
              Sign In
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}