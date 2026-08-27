import { useRef, useState } from "react";
import {
  Image as ImageIcon,
  Video,
  X,
  Send,
  LoaderCircle,
  Sparkles,
  UserRound,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useCreatePost } from "../../hooks/Feed/useCreatePost";

function NewPost() {
  const navigate = useNavigate();
  const fileRef = useRef(null);

  const [caption, setCaption] = useState("");
  const [media, setMedia] = useState(null);
  const [preview, setPreview] = useState(null);

  const {
    mutate: createPost,
    isPending,
  } = useCreatePost();

  const handleMediaChange = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    const allowedTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/webp",
      "image/gif",
      "video/mp4",
      "video/webm",
      "video/mov",
    ];

    if (!allowedTypes.includes(file.type)) {
      toast.error(
        "Please select a valid image or video."
      );

      e.target.value = "";
      return;
    }

    setMedia(file);

    const objectUrl = URL.createObjectURL(file);
    setPreview(objectUrl);
  };

  const removeMedia = () => {
    if (preview) {
      URL.revokeObjectURL(preview);
    }

    setMedia(null);
    setPreview(null);

    if (fileRef.current) {
      fileRef.current.value = "";
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!caption.trim() && !media) {
      toast.error(
        "Please add some text or select a media file."
      );
      return;
    }

    const formData = new FormData();

    formData.append(
      "caption",
      caption.trim()
    );

    if (media) {
      formData.append("media", media);
    }

    createPost(formData, {
      onSuccess: () => {
        toast.success(
          "Post created successfully!"
        );

        setCaption("");
        removeMedia();

        navigate("/feed");
      },
      onError: (error) => {
        console.error(
          "Create post error:",
          error?.response?.data || error
        );

        toast.error(
          error?.response?.data?.message ||
            "Failed to create post."
        );
      },
    });
  };

  return (
    <div className="min-h-screen bg-[#f6f8fb] px-3 py-6 sm:px-4">
      <div className="mx-auto w-full max-w-[650px]">

        {/* HEADER */}
        <div className="mb-5 flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-sm">
            <Sparkles size={17} />
          </div>

          <div>
            <h1 className="text-lg font-bold text-slate-800">
              Create Post
            </h1>

            <p className="text-[10px] text-slate-400">
              Share something with your community
            </p>
          </div>
        </div>

        {/* MAIN CARD */}
        <form
          onSubmit={handleSubmit}
          className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
        >

          {/* USER HEADER */}
          <div className="flex items-center gap-3 border-b border-slate-100 px-4 py-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-100 text-indigo-600">
              <UserRound size={17} />
            </div>

            <div>
              <p className="text-xs font-bold text-slate-700">
                Create a new post
              </p>

              <p className="text-[9px] text-slate-400">
                Your post will appear in the community feed
              </p>
            </div>
          </div>

          {/* CAPTION */}
          <div className="px-4 py-4">
            <textarea
              value={caption}
              onChange={(e) =>
                setCaption(e.target.value)
              }
              placeholder="What's on your mind?"
              rows={5}
              maxLength={1000}
              className="w-full resize-none rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm leading-5 text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-indigo-400 focus:bg-white"
            />

            <div className="mt-1 flex justify-end">
              <span className="text-[9px] text-slate-400">
                {caption.length}/1000
              </span>
            </div>
          </div>

          {/* MEDIA PREVIEW */}
          {preview && media && (
            <div className="px-4 pb-4">
              <div className="relative overflow-hidden rounded-xl border border-slate-200 bg-slate-100">

                {media.type.startsWith("image/") ? (
                  <img
                    src={preview}
                    alt="Preview"
                    className="max-h-[420px] w-full object-cover"
                  />
                ) : (
                  <video
                    src={preview}
                    controls
                    className="max-h-[420px] w-full"
                  />
                )}

                <button
                  type="button"
                  onClick={removeMedia}
                  className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-black/60 text-white transition hover:bg-red-500"
                >
                  <X size={14} />
                </button>
              </div>

              <div className="mt-2 flex items-center justify-between">
                <p className="max-w-[80%] truncate text-[10px] text-slate-400">
                  {media.name}
                </p>

                <p className="text-[9px] text-slate-400">
                  {(media.size / 1024 / 1024).toFixed(
                    2
                  )}{" "}
                  MB
                </p>
              </div>
            </div>
          )}

          {/* MEDIA BUTTONS */}
          <div className="border-t border-slate-100 px-4 py-3">
            <div className="flex items-center justify-between">

              <div className="flex items-center gap-2">

                {/* IMAGE */}
                <button
                  type="button"
                  onClick={() =>
                    fileRef.current?.click()
                  }
                  className="flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-[10px] font-semibold text-slate-500 transition hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-600"
                >
                  <ImageIcon size={14} />
                  Photo / Video
                </button>

                <input
                  ref={fileRef}
                  type="file"
                  accept="image/*,video/*"
                  onChange={handleMediaChange}
                  className="hidden"
                />

                {media && (
                  <button
                    type="button"
                    onClick={removeMedia}
                    className="flex items-center gap-1.5 rounded-lg px-2 py-2 text-[10px] font-medium text-red-400 transition hover:bg-red-50 hover:text-red-500"
                  >
                    <X size={12} />
                    Remove
                  </button>
                )}
              </div>

              {/* POST BUTTON */}
              <button
                type="submit"
                disabled={
                  isPending ||
                  (!caption.trim() && !media)
                }
                className="flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-[10px] font-bold text-white shadow-sm transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-40"
              >
                {isPending ? (
                  <>
                    <LoaderCircle
                      size={13}
                      className="animate-spin"
                    />
                    Posting...
                  </>
                ) : (
                  <>
                    <Send size={13} />
                    Post
                  </>
                )}
              </button>
            </div>
          </div>

          {/* BOTTOM INFO */}
          <div className="flex items-center gap-2 border-t border-slate-100 bg-slate-50 px-4 py-2.5">
            <Video
              size={12}
              className="text-indigo-500"
            />

            <p className="text-[9px] text-slate-400">
              You can share images or videos with your post.
            </p>
          </div>
        </form>

        {/* CANCEL */}
        <div className="mt-3 text-center">
          <button
            type="button"
            onClick={() => navigate("/feed")}
            className="text-[10px] font-medium text-slate-400 transition hover:text-indigo-600"
          >
            Cancel and return to feed
          </button>
        </div>
      </div>
    </div>
  );
}

export default NewPost;