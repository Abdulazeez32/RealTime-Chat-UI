import React, { useState } from "react";
import {
  FaLock,
  FaCheck,
  FaTimes,
  FaEye,
  FaEyeSlash,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useChangePassword } from "../../hooks/useChangePassword";

/* =========================================================
   Password Input Component
   Keep this OUTSIDE ChangePassword
========================================================= */

const PasswordInput = ({
  label,
  value,
  onChange,
  show,
  setShow,
  placeholder,
}) => {
  return (
    <div>
      <label className="mb-2 block text-sm font-semibold text-gray-700">
        {label}
      </label>

      <div className="relative">
        <input
          type={show ? "text" : "password"}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          autoComplete="off"
          className="
            w-full
            rounded-xl
            border border-gray-200
            bg-gray-50
            px-4 py-3
            pr-12
            text-sm text-gray-800
            outline-none
            transition
            placeholder:text-gray-400
            focus:border-violet-500
            focus:bg-white
            focus:ring-2
            focus:ring-violet-100
          "
        />

        <button
          type="button"
          onClick={() => setShow((prev) => !prev)}
          className="
            absolute
            right-3
            top-1/2
            -translate-y-1/2
            text-gray-400
            transition
            hover:text-violet-600
          "
        >
          {show ? <FaEyeSlash /> : <FaEye />}
        </button>
      </div>
    </div>
  );
};

/* =========================================================
   Change Password
========================================================= */

function ChangePassword() {
  const navigate = useNavigate();

  const { mutate: changePassword, isPending } = useChangePassword();

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    /* =========================
       Required fields
    ========================= */

    if (!currentPassword || !newPassword || !confirmPassword) {
      setError("All fields are required");
      return;
    }

    /* =========================
       Minimum password length
    ========================= */

    if (newPassword.length < 8) {
      setError("Password must be at least 8 characters long");
      return;
    }

    /* =========================
       Strong password validation
    ========================= */

    const strongPassword =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    if (!strongPassword.test(newPassword)) {
      setError(
        "Password must contain uppercase, lowercase, number and special character."
      );
      return;
    }

    /* =========================
       Confirm password
    ========================= */

    if (newPassword !== confirmPassword) {
      setError("New password and confirm password do not match");
      return;
    }

    /* =========================
       API
    ========================= */

    changePassword(
      {
        currentpassword: currentPassword,
        newpassword: newPassword,
        confirmpassword: confirmPassword,
      },
      {
        onSuccess: (data) => {
          setSuccess(
            data?.message || "Password updated successfully"
          );

          setCurrentPassword("");
          setNewPassword("");
          setConfirmPassword("");

          setTimeout(() => {
            navigate("/settings");
          }, 1500);
        },

        onError: (error) => {
          const message =
            error?.response?.data?.message ||
            error?.response?.data ||
            "Unable to change password";

          setError(message);
        },
      }
    );
  };

  return (
    <div className="min-h-screen bg-[#f7f4ff] px-4 py-8">
      <div className="mx-auto w-full max-w-xl">

        {/* =========================
            Header
        ========================= */}

        <div className="mb-5">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-violet-500">
            Security
          </p>

          <h1 className="mt-1 text-2xl font-black text-[#241b35]">
            Change Password
          </h1>

          <p className="mt-1 text-sm text-[#91879d]">
            Update your password to keep your account secure.
          </p>
        </div>

        {/* =========================
            Card
        ========================= */}

        <div className="overflow-hidden rounded-3xl border border-violet-100 bg-white shadow-[0_20px_60px_rgba(76,29,149,0.08)]">

          {/* =========================
              Card Header
          ========================= */}

          <div className="bg-gradient-to-br from-violet-600 to-fuchsia-600 px-6 py-7 text-white">

            <div className="flex items-center gap-4">

              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/20">
                <FaLock size={20} />
              </div>

              <div>
                <h2 className="text-lg font-black">
                  Update Password
                </h2>

                <p className="mt-1 text-xs text-white/70">
                  Enter your current password and create a new one.
                </p>
              </div>

            </div>

          </div>

          {/* =========================
              Form
          ========================= */}

          <form onSubmit={handleSubmit}>

            <div className="space-y-5 px-6 py-7">

              {/* Current Password */}

              <PasswordInput
                label="Current Password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                show={showCurrent}
                setShow={setShowCurrent}
                placeholder="Enter your current password"
              />

              {/* New Password */}

              <PasswordInput
                label="New Password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                show={showNew}
                setShow={setShowNew}
                placeholder="Enter your new password"
              />

              {/* Confirm Password */}

              <PasswordInput
                label="Confirm New Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                show={showConfirm}
                setShow={setShowConfirm}
                placeholder="Re-enter your new password"
              />

              {/* =========================
                  Password Rules
              ========================= */}

              <div className="rounded-2xl border border-violet-100 bg-violet-50/60 p-4">

                <p className="mb-2 text-xs font-black text-violet-700">
                  Password requirements
                </p>

                <ul className="space-y-1 text-[11px] text-gray-500">
                  <li>• Minimum 8 characters</li>
                  <li>• At least one uppercase letter</li>
                  <li>• At least one lowercase letter</li>
                  <li>• At least one number</li>
                  <li>• At least one special character</li>
                </ul>

              </div>

              {/* =========================
                  Error
              ========================= */}

              {error && (
                <div className="rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
                  {error}
                </div>
              )}

              {/* =========================
                  Success
              ========================= */}

              {success && (
                <div className="rounded-xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-600">
                  {success}
                </div>
              )}

            </div>

            {/* =========================
                Footer
            ========================= */}

            <div className="flex justify-end gap-3 border-t border-gray-100 bg-gray-50 px-6 py-4">

              <button
                type="button"
                onClick={() => navigate("/settings")}
                disabled={isPending}
                className="
                  flex items-center gap-2
                  rounded-xl
                  border border-gray-200
                  bg-white
                  px-5 py-2.5
                  text-sm font-semibold
                  text-gray-600
                  transition
                  hover:bg-gray-100
                  disabled:cursor-not-allowed
                  disabled:opacity-50
                "
              >
                <FaTimes />
                Cancel
              </button>

              <button
                type="submit"
                disabled={isPending}
                className="
                  flex items-center gap-2
                  rounded-xl
                  bg-violet-600
                  px-6 py-2.5
                  text-sm font-semibold
                  text-white
                  shadow-sm
                  transition
                  hover:bg-violet-700
                  disabled:cursor-not-allowed
                  disabled:opacity-60
                "
              >
                {isPending ? (
                  <>
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    Updating...
                  </>
                ) : (
                  <>
                    <FaCheck />
                    Change Password
                  </>
                )}
              </button>

            </div>

          </form>
        </div>
      </div>
    </div>
  );
}

export default ChangePassword;