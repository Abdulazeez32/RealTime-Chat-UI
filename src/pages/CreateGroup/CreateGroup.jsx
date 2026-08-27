import { useRef, useState } from "react";
import {
  FaCamera,
  FaUsers,
  FaArrowLeft,
  FaCheck,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useCreateGroup } from "../../hooks/group/useGroups";

function CreateGroup() {
  const navigate = useNavigate();
  const fileRef = useRef(null);

  const [groupName, setGroupName] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState("");

  const createMutation = useCreateGroup();

  const handleImage = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const removeImage = () => {
    setImage(null);
    setPreview("");

    if (fileRef.current) {
      fileRef.current.value = "";
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!groupName.trim()) return;

    const formData = new FormData();

    formData.append("groupname", groupName.trim());
    formData.append("description", description.trim());

    if (image) {
      formData.append("groupimage", image);
    }

    createMutation.mutate(formData, {
      onSuccess: () => {
        setGroupName("");
        setDescription("");
        setImage(null);
        setPreview("");
        navigate("/groups");
      },
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl">

        {/* Back Button */}
        <button
          type="button"
          onClick={() => navigate("/groups")}
          className="mb-5 flex items-center gap-2 text-sm font-semibold text-gray-500 transition hover:text-blue-600"
        >
          <FaArrowLeft size={13} />
          Back to Groups
        </button>

        {/* Header */}
        <div className="mb-6 overflow-hidden rounded-2xl bg-gradient-to-r from-blue-700 to-indigo-600 p-6 text-white shadow-md">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white/15">
              <FaUsers size={26} />
            </div>

            <div>
              <h1 className="text-2xl font-bold">
                Create a New Group
              </h1>

              <p className="mt-1 text-sm text-blue-100">
                Bring your friends together and start a conversation.
              </p>
            </div>
          </div>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm"
        >

          {/* Profile Image Section */}
          <div className="border-b border-gray-100 px-6 py-7 sm:px-8">
            <div className="flex flex-col items-center">
              <div className="relative">

                <button
                  type="button"
                  onClick={() => fileRef.current?.click()}
                  className="group relative flex h-32 w-32 items-center justify-center overflow-hidden rounded-full border-4 border-white bg-gradient-to-br from-blue-100 to-indigo-100 text-blue-600 shadow-lg ring-1 ring-gray-200 transition hover:scale-[1.02]"
                >
                  {preview ? (
                    <>
                      <img
                        src={preview}
                        alt="Group preview"
                        className="h-full w-full object-cover"
                      />

                      <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition group-hover:opacity-100">
                        <FaCamera
                          size={25}
                          className="text-white"
                        />
                      </div>
                    </>
                  ) : (
                    <div className="flex flex-col items-center gap-2">
                      <FaCamera size={28} />
                      <span className="text-xs font-semibold">
                        Add Photo
                      </span>
                    </div>
                  )}
                </button>

                {preview && (
                  <button
                    type="button"
                    onClick={removeImage}
                    className="absolute bottom-1 right-1 flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-red-500 text-sm text-white shadow-md transition hover:bg-red-600"
                    title="Remove image"
                  >
                    ×
                  </button>
                )}
              </div>

              <h2 className="mt-4 text-base font-bold text-gray-800">
                Group Photo
              </h2>

              <p className="mt-1 text-xs text-gray-500">
                Choose an image that represents your group
              </p>

              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                onChange={handleImage}
                className="hidden"
              />
            </div>
          </div>

          {/* Form Fields */}
          <div className="space-y-5 px-6 py-7 sm:px-8">

            {/* Group Name */}
            <div>
              <div className="mb-2 flex items-center justify-between">
                <label className="text-sm font-semibold text-gray-700">
                  Group Name
                </label>

                <span className="text-xs text-gray-400">
                  {groupName.length}/50
                </span>
              </div>

              <input
                type="text"
                maxLength={50}
                value={groupName}
                onChange={(e) =>
                  setGroupName(e.target.value)
                }
                placeholder="e.g. Weekend Friends"
                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3.5 text-sm text-gray-800 outline-none transition placeholder:text-gray-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-50"
              />

              <p className="mt-1.5 text-xs text-gray-400">
                Give your group a short and recognizable name.
              </p>
            </div>

            {/* Description */}
            <div>
              <div className="mb-2 flex items-center justify-between">
                <label className="text-sm font-semibold text-gray-700">
                  Description
                </label>

                <span className="text-xs text-gray-400">
                  {description.length}/200
                </span>
              </div>

              <textarea
                value={description}
                maxLength={200}
                onChange={(e) =>
                  setDescription(e.target.value)
                }
                placeholder="What is this group about?"
                rows={5}
                className="w-full resize-none rounded-xl border border-gray-200 bg-gray-50 px-4 py-3.5 text-sm text-gray-800 outline-none transition placeholder:text-gray-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-50"
              />

              <p className="mt-1.5 text-xs text-gray-400">
                Add a short description to help members understand the
                purpose of this group.
              </p>
            </div>

            {/* Error */}
            {createMutation.isError && (
              <div className="rounded-xl border border-red-100 bg-red-50 px-4 py-3">
                <p className="text-sm font-medium text-red-600">
                  Failed to create group. Please try again.
                </p>
              </div>
            )}

            {/* Buttons */}
            <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row">
              <button
                type="button"
                onClick={() => navigate("/groups")}
                className="flex-1 rounded-xl border border-gray-200 bg-white px-5 py-3.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={
                  createMutation.isPending ||
                  !groupName.trim()
                }
                className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {createMutation.isPending ? (
                  <>
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-blue-200 border-t-white" />
                    Creating Group...
                  </>
                ) : (
                  <>
                    <FaCheck size={13} />
                    Create Group
                  </>
                )}
              </button>
            </div>
          </div>
        </form>

        {/* Bottom Info */}
        <div className="mt-4 flex items-center justify-center gap-2 text-xs text-gray-400">
          <FaUsers size={12} />
          You can invite your connections after creating the group.
        </div>
      </div>
    </div>
  );
}

export default CreateGroup;