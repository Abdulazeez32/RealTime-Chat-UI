import { useEffect, useRef, useState } from "react";

import {
  FaCamera,
  FaCheck,
  FaTimes,
  FaUserEdit,
  FaRegEdit,
} from "react-icons/fa";

import {
  PersonRounded,
  ImageRounded,
  DescriptionRounded,
  ArrowBackRounded,
} from "@mui/icons-material";

import { useNavigate } from "react-router-dom";

import { useDashboard } from "../../hooks/useDashboard";
import { useEditProfile } from "../../hooks/useEditProfile";

function EditProfile({ onClose }) {
  const fileRef = useRef(null);
  const navigate = useNavigate();

  // ============================================================
  // DASHBOARD
  // ============================================================

  const {
    data: profileData,
    isLoading,
    isError,
  } = useDashboard();

  const profile =
    profileData?.data ||
    profileData?.profile ||
    profileData ||
    {};

  // ============================================================
  // EDIT PROFILE
  // ============================================================

  const {
    mutate: editProfile,
    isPending,
  } = useEditProfile();

  // ============================================================
  // STATE
  // ============================================================

  const [bio, setBio] = useState("");
  const [profilePic, setProfilePic] = useState(null);
  const [preview, setPreview] = useState("");

  // ============================================================
  // LOAD PROFILE
  // ============================================================

  useEffect(() => {
    if (!profile) return;

    setBio(profile?.bio || "");
    setPreview(
      profile?.profilepic ||
      profile?.profilePic ||
      ""
    );
  }, [
    profile?.bio,
    profile?.profilepic,
    profile?.profilePic,
  ]);

  // ============================================================
  // PROFILE VALUES
  // ============================================================

  const username =
    profile?.username ||
    profile?.user?.username ||
    "User";

  const avatarLetter =
    username?.charAt(0)?.toUpperCase() || "U";

  // ============================================================
  // IMAGE CHANGE
  // ============================================================

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Please select a valid image file.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert("Image size should be less than 5MB.");
      return;
    }

    setProfilePic(file);

    const imageUrl = URL.createObjectURL(file);
    setPreview(imageUrl);
  };

  // ============================================================
  // SUBMIT
  // ============================================================

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!bio.trim()) {
      alert("Bio is required.");
      return;
    }

    editProfile(
      {
        bio: bio.trim(),
        profilepic: profilePic,
      },
      {
        onSuccess: () => {
          if (onClose) {
            onClose();
          } else {
            navigate("/dashboard");
          }
        },
      }
    );
  };

  // ============================================================
  // CANCEL
  // ============================================================

  const handleCancel = () => {
    if (onClose) {
      onClose();
    } else {
      navigate("/setting");
    }
  };

  // ============================================================
  // LOADING
  // ============================================================

  if (isLoading) {
    return (
      <div className="min-h-[500px] flex items-center justify-center bg-[#f7f4ff]">
        <div className="flex flex-col items-center gap-4">

          <div className="relative">
            <div className="h-12 w-12 rounded-full border-4 border-violet-100 border-t-violet-600 animate-spin" />

            <div className="absolute inset-0 flex items-center justify-center">
              <FaUserEdit className="text-violet-500 text-sm" />
            </div>
          </div>

          <p className="text-sm font-semibold text-[#91879d]">
            Loading your profile...
          </p>

        </div>
      </div>
    );
  }

  // ============================================================
  // ERROR
  // ============================================================

  if (isError) {
    return (
      <div className="min-h-[500px] flex items-center justify-center bg-[#f7f4ff] p-5">

        <div className="max-w-md w-full bg-white rounded-3xl border border-red-100 p-8 text-center shadow-sm">

          <div className="mx-auto mb-4 w-14 h-14 rounded-2xl bg-red-50 text-red-500 flex items-center justify-center">
            <FaTimes size={20} />
          </div>

          <h2 className="text-lg font-black text-[#292039]">
            Unable to load profile
          </h2>

          <p className="text-xs text-[#91879d] mt-2">
            Something went wrong while loading your profile.
            Please try again later.
          </p>

          <button
            onClick={() => navigate("/settings")}
            className="mt-5 px-5 py-2.5 rounded-xl bg-violet-600 text-white text-xs font-black hover:bg-violet-700 transition"
          >
            Back to Settings
          </button>

        </div>

      </div>
    );
  }

  // ============================================================
  // MAIN UI
  // ============================================================

  return (
    <div className="min-h-screen bg-[#f7f4ff] p-3 sm:p-5">

      <div className="max-w-3xl mx-auto">

        {/* ======================================================
            TOP NAV
        ====================================================== */}

        <div className="flex items-center justify-between mb-5">

          <button
            type="button"
            onClick={handleCancel}
            className="group flex items-center gap-2 text-xs font-bold text-[#70677d] hover:text-violet-600 transition"
          >
            <div className="w-9 h-9 rounded-xl bg-white border border-violet-100 flex items-center justify-center group-hover:bg-violet-50 transition">
              <ArrowBackRounded
                sx={{ fontSize: 18 }}
              />
            </div>

            <span className="hidden sm:block">
              Back to Settings
            </span>
          </button>

          <div className="text-right">

            <p className="text-[9px] uppercase tracking-[0.2em] font-black text-violet-500">
              Account
            </p>

            <p className="text-xs text-[#91879d]">
              Profile Settings
            </p>

          </div>

        </div>

        {/* ======================================================
            MAIN CARD
        ====================================================== */}

        <div className="bg-white rounded-[30px] border border-violet-100 shadow-[0_20px_60px_rgba(76,29,149,0.08)] overflow-hidden">

          {/* ====================================================
              HEADER
          ==================================================== */}

          <div className="relative overflow-hidden bg-gradient-to-br from-violet-600 via-purple-600 to-fuchsia-600 px-6 py-7 sm:px-8">

            {/* Decorative circles */}

            <div className="absolute -right-16 -top-16 w-48 h-48 rounded-full bg-white/10" />

            <div className="absolute -left-12 -bottom-24 w-52 h-52 rounded-full bg-white/5" />

            <div className="absolute right-24 bottom-[-40px] w-24 h-24 rounded-full bg-white/5" />

            <div className="relative flex items-center gap-4">

              <div className="w-12 h-12 rounded-2xl bg-white/15 border border-white/20 flex items-center justify-center text-white">

                <FaUserEdit size={20} />

              </div>

              <div>

                <p className="text-[9px] uppercase tracking-[0.2em] font-bold text-white/60">
                  Account
                </p>

                <h1 className="text-xl sm:text-2xl font-black text-white mt-1">
                  Edit Profile
                </h1>

                <p className="text-[11px] text-white/70 mt-1">
                  Update your photo and personal information
                </p>

              </div>

            </div>

          </div>

          {/* ====================================================
              FORM
          ==================================================== */}

          <form onSubmit={handleSubmit}>

            <div className="p-5 sm:p-8 space-y-7">

              {/* =================================================
                  PROFILE PREVIEW
              ================================================= */}

              <div className="relative">

                <div className="rounded-3xl bg-gradient-to-br from-[#faf8ff] to-[#f5f0ff] border border-violet-100 p-5 sm:p-6">

                  <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5">

                    {/* AVATAR */}

                    <div className="relative group">

                      <div className="absolute -inset-1 rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 opacity-30 blur-sm" />

                      <div className="relative">

                        {preview ? (
                          <img
                            src={preview}
                            alt="Profile preview"
                            className="w-28 h-28 sm:w-32 sm:h-32 rounded-full object-cover border-4 border-white shadow-xl"
                          />
                        ) : (
                          <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-full bg-gradient-to-br from-violet-600 to-fuchsia-600 border-4 border-white shadow-xl flex items-center justify-center text-4xl font-black text-white">
                            {avatarLetter}
                          </div>
                        )}

                        {/* CAMERA BUTTON */}

                        <button
                          type="button"
                          onClick={() =>
                            fileRef.current?.click()
                          }
                          className="absolute bottom-1 right-1 w-10 h-10 rounded-full bg-violet-600 text-white border-4 border-white shadow-lg flex items-center justify-center hover:bg-violet-700 hover:scale-105 transition"
                        >
                          <FaCamera size={14} />
                        </button>

                        <input
                          ref={fileRef}
                          type="file"
                          accept="image/*"
                          onChange={handleImageChange}
                          className="hidden"
                        />

                      </div>

                    </div>

                    {/* USER DETAILS */}

                    <div className="flex-1 text-center sm:text-left">

                      <div className="flex items-center justify-center sm:justify-start gap-2">

                        <h2 className="text-lg font-black text-[#292039]">
                          {username}
                        </h2>

                        <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-600 text-[8px] font-black uppercase">
                          Active
                        </span>

                      </div>

                      <p className="text-xs text-[#91879d] mt-1">
                        Make your profile look the way you want.
                      </p>

                      <button
                        type="button"
                        onClick={() =>
                          fileRef.current?.click()
                        }
                        className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-violet-100 text-violet-600 text-[10px] font-black hover:bg-violet-50 transition"
                      >
                        <FaCamera />
                        Change Photo
                      </button>

                      <p className="text-[9px] text-[#aaa0b0] mt-2">
                        JPG, PNG or WEBP • Maximum 5MB
                      </p>

                    </div>

                  </div>

                </div>

              </div>

              {/* =================================================
                  BIO SECTION
              ================================================= */}

              <div>

                <div className="flex items-center justify-between mb-3">

                  <div className="flex items-center gap-3">

                    <div className="w-10 h-10 rounded-xl bg-violet-50 text-violet-600 flex items-center justify-center">
                      <DescriptionRounded
                        sx={{ fontSize: 19 }}
                      />
                    </div>

                    <div>

                      <h3 className="text-sm font-black text-[#292039]">
                        About You
                      </h3>

                      <p className="text-[10px] text-[#91879d] mt-0.5">
                        Tell people something about yourself
                      </p>

                    </div>

                  </div>

                  <span
                    className={`text-[10px] font-bold ${
                      bio.length >= 230
                        ? "text-orange-500"
                        : "text-[#aaa0b0]"
                    }`}
                  >
                    {bio.length}/250
                  </span>

                </div>

                {/* TEXTAREA */}

                <div className="relative">

                  <textarea
                    value={bio}
                    onChange={(e) =>
                      setBio(e.target.value)
                    }
                    placeholder="Tell something interesting about yourself..."
                    rows={5}
                    maxLength={250}
                    className="w-full resize-none rounded-2xl border border-violet-100 bg-[#fcfbff] px-4 py-4 pr-5 text-sm text-[#292039] outline-none transition placeholder:text-[#aaa0b0] focus:border-violet-400 focus:bg-white focus:ring-4 focus:ring-violet-100"
                  />

                </div>

                <div className="mt-2 flex items-center justify-between">

                  <p className="text-[9px] text-[#aaa0b0]">
                    Keep it short, friendly and personal.
                  </p>

                  {bio.length >= 230 && (
                    <p className="text-[9px] text-orange-500 font-semibold">
                      Character limit almost reached
                    </p>
                  )}

                </div>

              </div>

              {/* =================================================
                  PROFILE PREVIEW INFO
              ================================================= */}

              <div className="rounded-2xl border border-violet-100 bg-violet-50/40 p-4">

                <div className="flex items-start gap-3">

                  <div className="w-9 h-9 rounded-xl bg-white text-violet-600 flex items-center justify-center flex-shrink-0 shadow-sm">
                    <PersonRounded
                      sx={{ fontSize: 18 }}
                    />
                  </div>

                  <div>

                    <h4 className="text-xs font-black text-[#33283f]">
                      Profile preview
                    </h4>

                    <p className="text-[10px] text-[#91879d] mt-1 leading-relaxed">
                      Your profile photo and bio will be
                      updated across your profile, posts,
                      connections and chat.
                    </p>

                  </div>

                </div>

              </div>

            </div>

            {/* ==================================================
                FOOTER
            ================================================== */}

            <div className="border-t border-violet-100 bg-[#fcfbff] px-5 sm:px-8 py-4">

              <div className="flex flex-col-reverse sm:flex-row sm:items-center justify-between gap-3">

                {/* CANCEL */}

                <button
                  type="button"
                  onClick={handleCancel}
                  disabled={isPending}
                  className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl border border-gray-200 bg-white text-[#70677d] text-xs font-bold hover:bg-gray-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <FaTimes size={12} />
                  Cancel
                </button>

                {/* SAVE */}

                <button
                  type="submit"
                  disabled={isPending}
                  className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white text-xs font-black shadow-lg shadow-violet-200 hover:from-violet-700 hover:to-fuchsia-700 hover:-translate-y-0.5 transition disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none"
                >

                  {isPending ? (
                    <>
                      <span className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                      Saving Changes...
                    </>
                  ) : (
                    <>
                      <FaCheck size={12} />
                      Save Changes
                    </>
                  )}

                </button>

              </div>

            </div>

          </form>

        </div>

        {/* ======================================================
            BOTTOM NOTE
        ====================================================== */}

        <div className="mt-4 flex items-center justify-center gap-2">

          <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />

          <p className="text-[9px] text-[#aaa0b0]">
            Your profile information is securely stored
          </p>

        </div>

      </div>

    </div>
  );
}

export default EditProfile;