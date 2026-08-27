import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  TextField,
  Button,
  Avatar,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Fade,
  Chip,
} from "@mui/material";
import PhotoCameraRoundedIcon from "@mui/icons-material/PhotoCameraRounded";
import PersonRoundedIcon from "@mui/icons-material/PersonRounded";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import AlternateEmailRoundedIcon from "@mui/icons-material/AlternateEmailRounded";
import CloudUploadRoundedIcon from "@mui/icons-material/CloudUploadRounded";
import AutoAwesomeRoundedIcon from "@mui/icons-material/AutoAwesomeRounded";
import TagRoundedIcon from "@mui/icons-material/TagRounded";
import DoneAllRoundedIcon from "@mui/icons-material/DoneAllRounded";
import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";
import { toast } from "react-toastify";
import { useCreateProfile } from "../../hooks/useProfile";

/*
=========================================================
MINIMALIST INPUT STYLES
=========================================================
*/
const cleanInputStyles = {
  "& .MuiOutlinedInput-root": {
    backgroundColor: "#faf9ff",
    borderRadius: "14px",
    color: "#27213a",
    transition: "all 0.2s ease",

    "& fieldset": {
      borderColor: "#e9d5ff",
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
      backgroundColor: "#f5f3ff",
      "& fieldset": {
        borderColor: "#ede9fe",
      },
    },
  },

  "& .MuiInputLabel-root": {
    color: "#7c738f",
    fontSize: "13px",
  },

  "& .MuiInputLabel-root.Mui-focused": {
    color: "#7c3aed",
  },

  "& .MuiInputBase-input": {
    color: "#27213a",
    fontSize: "14px",
  },
};

export default function Profile() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [bio, setBio] = useState("");
  const [profileImage, setProfileImage] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [showPopup, setShowPopup] = useState(false);

  const { mutate, isPending } = useCreateProfile();

  const chips = [
    "🚀 Frontend Dev",
    "🎨 UI Designer",
    "⚡ Realtime Geek",
    "☕ Coffee Lover",
    "🎮 Gamer",
  ];

  useEffect(() => {
    const storedUsername =
      localStorage.getItem("username") ||
      localStorage.getItem("userName") ||
      localStorage.getItem("name");

    const userData =
      localStorage.getItem("userData") || localStorage.getItem("chat_user");
    let userName = storedUsername;

    if (userData) {
      try {
        const parsedUser = JSON.parse(userData);
        userName =
          parsedUser.username ||
          parsedUser.userName ||
          parsedUser.name ||
          userName;
      } catch (e) {
        // Fallback
      }
    }

    if (userName) {
      setUsername(userName);
    } else {
      setUsername("User");
    }
  }, []);

  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setProfileImage(file);
    setPreviewImage(window.URL.createObjectURL(file));
    setShowPopup(true);
  };

  const handleUpload = () => {
    setShowPopup(false);
  };

  const handleCancel = () => {
    setProfileImage(null);
    setPreviewImage(null);
    setShowPopup(false);
  };

  const handleRemove = () => {
    setProfileImage(null);
    setPreviewImage(null);
  };

  const saveProfile = (e) => {
    e.preventDefault();

    const userid =
      localStorage.getItem("userid") || localStorage.getItem("userId");

    if (!userid) {
      toast.error("User ID not found. Please login again.");
      navigate("/login");
      return;
    }

    const formData = new FormData();
    formData.append("userid", userid);
    formData.append("bio", bio);
    formData.append("username", username);

    if (profileImage) {
      formData.append("profilepic", profileImage);
    }

    mutate(formData, {
      onSuccess: (data) => {
        if (data?.profileid) {
          localStorage.setItem("profileid", data.profileid);
        }

        toast.success("Profile Created Successfully 🎉");
        navigate("/dashboard");
      },
      onError: (error) => {
        toast.error(
          error?.response?.data?.message ||
            error?.response?.data ||
            "Profile creation failed"
        );
      },
    });
  };

  return (
    <div className="min-h-screen bg-[#f3e8ff]/40 flex items-center justify-center p-4 sm:p-6 lg:p-8 font-sans">
      
      {/* Centered Profile Card */}
      <div className="w-full max-w-4xl bg-white rounded-[32px] border border-violet-100 shadow-[0_20px_60px_rgba(124,58,237,0.06)] grid grid-cols-1 md:grid-cols-12 overflow-hidden">
        
        {/* ================= LEFT: PROFILE BADGE / PREVIEW (5 Cols) ================= */}
        <div className="md:col-span-5 bg-gradient-to-br from-[#7c3aed] to-[#9333ea] p-8 text-white flex flex-col justify-between items-center text-center">
          <div className="w-full flex items-center justify-between">
            <span className="text-[10px] font-mono uppercase tracking-widest bg-white/15 px-2.5 py-1 rounded-full border border-white/20">
              Identity Badge
            </span>
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
          </div>

          <div className="my-6 flex flex-col items-center space-y-3">
            <div className="relative">
              <Avatar
                src={previewImage}
                sx={{
                  width: 100,
                  height: 100,
                  bgcolor: "rgba(255, 255, 255, 0.2)",
                  border: "4px solid rgba(255, 255, 255, 0.4)",
                  boxShadow: "0 8px 30px rgba(0,0,0,0.15)",
                }}
              >
                {!previewImage && (
                  <PersonRoundedIcon sx={{ fontSize: 60, color: "#ffffff" }} />
                )}
              </Avatar>

              <label htmlFor="avatar-file-chip">
                <input
                  id="avatar-file-chip"
                  type="file"
                  accept="image/*"
                  hidden
                  onChange={handleImageSelect}
                />
                <IconButton
                  component="span"
                  size="small"
                  sx={{
                    position: "absolute",
                    bottom: 0,
                    right: 0,
                    bgcolor: "#ffffff",
                    color: "#7c3aed",
                    "&:hover": { bgcolor: "#f5f3ff" },
                    boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
                  }}
                >
                  <PhotoCameraRoundedIcon sx={{ fontSize: 16 }} />
                </IconButton>
              </label>
            </div>

            <div>
              <h2 className="text-lg font-bold">{username || "Your Name"}</h2>
              <p className="text-xs text-violet-200 font-mono">
                @{username ? username.toLowerCase().replace(/\s+/g, "") : "user"}
              </p>
            </div>

            <div className="w-full bg-white/10 rounded-2xl p-3 border border-white/15 min-h-[64px] flex items-center justify-center">
              <p className="text-xs text-violet-100 italic leading-relaxed">
                {bio.trim()
                  ? `"${bio}"`
                  : "Write your bio to preview it live..."}
              </p>
            </div>
          </div>

          <div className="text-[11px] text-violet-200 flex items-center gap-1.5">
            <DoneAllRoundedIcon sx={{ fontSize: 16 }} />
            <span>Ready for real-time messaging</span>
          </div>
        </div>

        {/* ================= RIGHT: CONFIGURATION FORM (7 Cols) ================= */}
        <div className="md:col-span-7 p-6 sm:p-8 flex flex-col justify-between space-y-6">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#7c3aed] flex items-center gap-1">
              <AutoAwesomeRoundedIcon sx={{ fontSize: 14 }} />
              Quick Setup
            </span>
            <h1 className="text-2xl font-black text-[#27213a] mt-1">Complete Profile</h1>
            <p className="text-xs text-[#7c738f] mt-0.5">
              Select your public photo and introduce yourself.
            </p>
          </div>

          <form onSubmit={saveProfile} className="space-y-4">
            
            {/* Custom Photo Upload Row */}
            <div className="flex items-center justify-between p-3 bg-[#faf9ff] border border-violet-100 rounded-2xl">
              <div className="flex items-center gap-3">
                <Avatar
                  src={previewImage}
                  sx={{ width: 44, height: 44, bgcolor: "#ede9fe", color: "#7c3aed" }}
                >
                  {!previewImage && <PersonRoundedIcon />}
                </Avatar>
                <div className="leading-tight">
                  <p className="text-xs font-bold text-[#27213a]">Avatar Picture</p>
                  <p className="text-[11px] text-[#7c738f]">PNG or JPG up to 5MB</p>
                </div>
              </div>

              <div className="flex items-center gap-1.5">
                <label htmlFor="avatar-file-chip">
                  <Button
                    component="span"
                    size="small"
                    variant="outlined"
                    startIcon={<CloudUploadRoundedIcon />}
                    sx={{
                      borderRadius: "10px",
                      textTransform: "none",
                      fontWeight: 700,
                      fontSize: "0.78rem",
                      borderColor: "#ddd6fe",
                      color: "#6d28d9",
                      "&:hover": { borderColor: "#a855f7", bgcolor: "#ffffff" },
                    }}
                  >
                    Upload
                  </Button>
                </label>

                {previewImage && (
                  <IconButton
                    size="small"
                    onClick={handleRemove}
                    sx={{ color: "#ef4444", bgcolor: "#fee2e2", "&:hover": { bgcolor: "#fecaca" } }}
                  >
                    <DeleteOutlineRoundedIcon fontSize="small" />
                  </IconButton>
                )}
              </div>
            </div>

            {/* Username Field */}
            <div className="space-y-1">
              <label className="text-xs font-bold uppercase tracking-wider text-[#27213a] block">
                Confirmed Handle
              </label>
              <TextField
                fullWidth
                value={username}
                disabled
                sx={cleanInputStyles}
                InputProps={{
                  startAdornment: (
                    <AlternateEmailRoundedIcon sx={{ color: "#7c3aed", fontSize: 18, mr: 1 }} />
                  ),
                }}
              />
            </div>

            {/* Bio Field & Quick Chips */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold uppercase tracking-wider text-[#27213a]">
                  Bio Summary
                </label>
                <span className="text-[11px] font-mono text-[#a8a0b4]">{bio.length}/500</span>
              </div>

              <TextField
                fullWidth
                multiline
                rows={3}
                placeholder="Share your interests, stack, or status..."
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                disabled={isPending}
                inputProps={{ maxLength: 500 }}
                sx={cleanInputStyles}
              />

              <div className="flex flex-wrap gap-1 pt-1">
                {chips.map((chip, idx) => (
                  <Chip
                    key={idx}
                    label={chip}
                    size="small"
                    onClick={() => setBio((prev) => (prev ? `${prev} ${chip}` : chip))}
                    sx={{
                      fontSize: "11px",
                      bgcolor: "#faf9ff",
                      color: "#6d28d9",
                      border: "1px solid #ede9fe",
                      cursor: "pointer",
                      "&:hover": { bgcolor: "#ede9fe" },
                    }}
                  />
                ))}
              </div>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={isPending}
              endIcon={!isPending ? <ArrowForwardRoundedIcon /> : null}
              sx={{
                height: "48px",
                fontWeight: 700,
                textTransform: "none",
                borderRadius: "14px",
                fontSize: "0.92rem",
                marginTop: "12px",
                background: "linear-gradient(135deg, #7c3aed, #9333ea)",
                boxShadow: "0 8px 22px rgba(124,58,237,0.25)",
                "&:hover": { background: "linear-gradient(135deg, #6d28d9, #7e22ce)" },
                "&.Mui-disabled": { background: "#ddd6fe", color: "#7c738f" },
              }}
            >
              {isPending ? "Setting Up..." : "Save Profile & Continue"}
            </Button>
          </form>
        </div>

      </div>

      {/* ================= PHOTO CONFIRMATION MODAL ================= */}
      <Dialog
        open={showPopup}
        onClose={handleCancel}
        maxWidth="xs"
        fullWidth
        TransitionComponent={Fade}
        transitionDuration={250}
        PaperProps={{ sx: { borderRadius: "24px", p: 2, border: "1px solid #ede9fe" } }}
      >
        <DialogTitle className="text-center font-bold text-[#27213a] text-base">
          Preview Selected Photo
        </DialogTitle>

        <DialogContent className="flex flex-col items-center gap-3 py-2">
          <Avatar
            src={previewImage}
            sx={{
              width: 110,
              height: 110,
              bgcolor: "#f5f3ff",
              border: "3px solid #7c3aed",
              boxShadow: "0 6px 20px rgba(124,58,237,0.2)",
            }}
          >
            {!previewImage && <PersonRoundedIcon sx={{ fontSize: 60 }} />}
          </Avatar>
          <p className="text-xs text-[#7c738f] text-center mt-1">
            Apply this picture as your main public avatar?
          </p>
        </DialogContent>

        <DialogActions sx={{ justifyContent: "center", gap: 1.5, pb: 1 }}>
          <Button
            variant="contained"
            startIcon={<CheckCircleRoundedIcon />}
            onClick={handleUpload}
            sx={{
              bgcolor: "#7c3aed",
              borderRadius: "12px",
              textTransform: "none",
              fontWeight: 700,
              px: 3,
              "&:hover": { bgcolor: "#6d28d9" },
            }}
          >
            Confirm
          </Button>

          <Button
            variant="outlined"
            startIcon={<CloseRoundedIcon />}
            onClick={handleCancel}
            sx={{
              borderColor: "#ddd6fe",
              color: "#7c738f",
              borderRadius: "12px",
              textTransform: "none",
              fontWeight: 600,
              "&:hover": { borderColor: "#a78bfa", bgcolor: "#faf9ff" },
            }}
          >
            Cancel
          </Button>
        </DialogActions>
      </Dialog>

    </div>
  );
}