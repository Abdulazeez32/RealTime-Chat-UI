import { useState } from "react";
import {
  Heart,
  MessageCircle,
  Send,
  Trash2,
  LoaderCircle,
  MoreHorizontal,
  RefreshCw,
  Sparkles,
  Image as ImageIcon,
  X,
  Clock3,
  Globe2,
  UserRound,
  LayoutGrid,
  Trash,
} from "lucide-react";
import axios from "axios";
import { useFeed } from "../../hooks/Feed/useFeed";
import { useMyPosts } from "../../hooks/Feed/useMyPosts";

const URL = import.meta.env.VITE_API_URL;

function Feed() {
  const [activeView, setActiveView] = useState("feed");
  const [comments, setComments] = useState({});
  const [commentInputs, setCommentInputs] = useState({});
  const [commentsLoading, setCommentsLoading] = useState({});
  const [commentSending, setCommentSending] = useState({});
  const [showComments, setShowComments] = useState({});
  const [deletingComment, setDeletingComment] = useState({});
  const [activeMenu, setActiveMenu] = useState(null);
  const [deletingPost, setDeletingPost] = useState({});

  const profileId = localStorage.getItem("profileid");
  const token = localStorage.getItem("token");

  const {
    data: feedResponse,
    isLoading: feedLoading,
    isError: feedIsError,
    error: feedError,
    refetch: refetchFeed,
  } = useFeed();

  const {
    data: myPostsResponse,
    isLoading: myPostsLoading,
    isError: myPostsIsError,
    error: myPostsError,
    refetch: refetchMyPosts,
  } = useMyPosts();

  const getPostsArray = (response) => {
    if (Array.isArray(response)) {
      return response;
    }

    return (
      response?.posts ||
      response?.data ||
      response?.result ||
      []
    );
  };

  const posts =
    activeView === "feed"
      ? getPostsArray(feedResponse)
      : getPostsArray(myPostsResponse);

  const loading =
    activeView === "feed"
      ? feedLoading
      : myPostsLoading;

  const isError =
    activeView === "feed"
      ? feedIsError
      : myPostsIsError;

  const error =
    activeView === "feed"
      ? feedError
      : myPostsError;

  const authConfig = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const getPostId = (post) => {
    return post?._id || post?.postid;
  };

  const getUsername = (user) => {
    return (
      user?.user?.username ||
      user?.username ||
      user?.name ||
      user?.fullname ||
      user?.fullName ||
      "Unknown User"
    );
  };

  const getProfilePic = (user) => {
    return (
      user?.profilepic ||
      user?.profileImage ||
      user?.profileimage ||
      user?.image ||
      user?.avatar ||
      user?.user?.profilepic ||
      user?.user?.profileImage ||
      user?.user?.image ||
      null
    );
  };

  const getPostOwner = (post) => {
    return (
      post?.user ||
      post?.owner ||
      post?.author ||
      post?.createdBy ||
      post?.profile ||
      {}
    );
  };

  const getPostText = (post) => {
    return (
      post?.caption ||
      post?.description ||
      post?.content ||
      ""
    );
  };

  const getPostImage = (post) => {
    return (
      post?.media ||
      post?.image ||
      post?.mediaUrl ||
      post?.imageUrl ||
      post?.photo ||
      null
    );
  };

  const getInitial = (name) => {
    return name?.charAt(0)?.toUpperCase() || "U";
  };

  const formatDate = (date) => {
    if (!date) return "";

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return "";
    }

    return parsedDate.toLocaleString([], {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  };

  const isLiked = (post) => {
    const likes = post?.likes || [];

    return likes.some(
      (like) =>
        String(like?._id || like) ===
        String(profileId)
    );
  };

  const handleLike = async (post) => {
    const postId = getPostId(post);

    if (!postId) return;

    try {
      await axios.put(
        `${URL}/post/likes/${postId}`,
        {},
        authConfig
      );

      if (activeView === "feed") {
        refetchFeed();
      } else {
        refetchMyPosts();
      }
    } catch (err) {
      console.error(
        "Like error:",
        err?.response?.data || err
      );
    }
  };

  const handleUnlike = async (post) => {
    const postId = getPostId(post);

    if (!postId) return;

    try {
      await axios.put(
        `${URL}/post/unlike/${postId}`,
        {},
        authConfig
      );

      if (activeView === "feed") {
        refetchFeed();
      } else {
        refetchMyPosts();
      }
    } catch (err) {
      console.error(
        "Unlike error:",
        err?.response?.data || err
      );
    }
  };

  const handleToggleLike = (post) => {
    if (isLiked(post)) {
      handleUnlike(post);
    } else {
      handleLike(post);
    }
  };

  const loadComments = async (postId) => {
    if (!postId) return;

    try {
      setCommentsLoading((prev) => ({
        ...prev,
        [postId]: true,
      }));

      const response = await axios.get(
        `${URL}/post/getcomments/${postId}`,
        authConfig
      );

      const commentData =
        response.data?.comments ||
        response.data?.data ||
        response.data ||
        [];

      setComments((prev) => ({
        ...prev,
        [postId]: Array.isArray(commentData)
          ? commentData
          : [],
      }));
    } catch (err) {
      console.error(
        "Get comments error:",
        err?.response?.data || err
      );

      setComments((prev) => ({
        ...prev,
        [postId]: [],
      }));
    } finally {
      setCommentsLoading((prev) => ({
        ...prev,
        [postId]: false,
      }));
    }
  };

  const handleToggleComments = async (postId) => {
    const visible = showComments[postId];

    setShowComments((prev) => ({
      ...prev,
      [postId]: !visible,
    }));

    if (!visible && !comments[postId]) {
      await loadComments(postId);
    }
  };

  const handleCommentChange = (postId, value) => {
    setCommentInputs((prev) => ({
      ...prev,
      [postId]: value,
    }));
  };

  const handleAddComment = async (postId) => {
    const text = commentInputs[postId]?.trim();

    if (!text) return;

    try {
      setCommentSending((prev) => ({
        ...prev,
        [postId]: true,
      }));

      const response = await axios.post(
        `${URL}/post/comment/${postId}`,
        {
          comment: text,
          text,
        },
        authConfig
      );

      const newComment =
        response.data?.comment ||
        response.data?.data;

      setCommentInputs((prev) => ({
        ...prev,
        [postId]: "",
      }));

      if (newComment) {
        setComments((prev) => ({
          ...prev,
          [postId]: [
            ...(prev[postId] || []),
            newComment,
          ],
        }));
      } else {
        await loadComments(postId);
      }
    } catch (err) {
      console.error(
        "Add comment error:",
        err?.response?.data || err
      );
    } finally {
      setCommentSending((prev) => ({
        ...prev,
        [postId]: false,
      }));
    }
  };

  const handleDeleteComment = async (
    postId,
    commentId
  ) => {
    if (!commentId) return;

    try {
      setDeletingComment((prev) => ({
        ...prev,
        [commentId]: true,
      }));

      await axios.delete(
        `${URL}/post/deletecomment/${commentId}`,
        authConfig
      );

      setComments((prev) => ({
        ...prev,
        [postId]: (prev[postId] || []).filter(
          (comment) =>
            String(comment?._id) !==
            String(commentId)
        ),
      }));
    } catch (err) {
      console.error(
        "Delete comment error:",
        err?.response?.data || err
      );
    } finally {
      setDeletingComment((prev) => ({
        ...prev,
        [commentId]: false,
      }));
    }
  };

  const handleDeletePost = async (postId) => {
    if (!postId) return;

    const confirmed = window.confirm(
      "Are you sure you want to delete this post?"
    );

    if (!confirmed) return;

    try {
      setDeletingPost((prev) => ({
        ...prev,
        [postId]: true,
      }));

      await axios.delete(
        `${URL}/post/deletepost/${postId}`,
        authConfig
      );

      setActiveMenu(null);

      await refetchMyPosts();

      if (activeView === "feed") {
        await refetchFeed();
      }
    } catch (err) {
      console.error(
        "Delete post error:",
        err?.response?.data || err
      );

      alert(
        err?.response?.data?.message ||
          "Failed to delete post."
      );
    } finally {
      setDeletingPost((prev) => ({
        ...prev,
        [postId]: false,
      }));
    }
  };

  const getCommentUser = (comment) => {
    return (
      comment?.user ||
      comment?.sender ||
      comment?.profile ||
      comment?.createdBy ||
      comment?.author ||
      {}
    );
  };

  const getCommentText = (comment) => {
    return (
      comment?.comment ||
      comment?.text ||
      comment?.content ||
      ""
    );
  };

  const getCommentOwnerId = (user) => {
    return (
      user?._id ||
      user?.id ||
      user?.profileid ||
      user?.user?._id ||
      user?.user?.id ||
      null
    );
  };

  const handleRefresh = () => {
    if (activeView === "feed") {
      refetchFeed();
    } else {
      refetchMyPosts();
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[300px] items-center justify-center bg-[#f6f8fb]">
        <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-500 shadow-sm">
          <LoaderCircle
            size={18}
            className="animate-spin text-indigo-600"
          />
          Loading{" "}
          {activeView === "feed"
            ? "feed"
            : "your posts"}
          ...
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-[300px] bg-[#f6f8fb] px-4 py-8">
        <div className="mx-auto max-w-xl rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-sm">
          <p className="text-sm font-medium text-red-500">
            {error?.response?.data?.message ||
              error?.message ||
              "Failed to load posts."}
          </p>

          <button
            type="button"
            onClick={handleRefresh}
            className="mt-4 inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-xs font-semibold text-white transition hover:bg-indigo-700"
          >
            <RefreshCw size={14} />
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f6f8fb]">
      <div className="mx-auto w-full max-w-[720px] px-3 py-5 sm:px-4">

        {/* HEADER */}
        <div className="mb-5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 text-white shadow-sm">
              {activeView === "feed" ? (
                <Sparkles size={15} />
              ) : (
                <UserRound size={15} />
              )}
            </div>

            <div>
              <h1 className="text-lg font-bold text-slate-800">
                {activeView === "feed"
                  ? "Community"
                  : "My Posts"}
              </h1>

              <p className="text-[10px] text-slate-400">
                {activeView === "feed"
                  ? "Stay connected with your people"
                  : "Manage everything you posted"}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleRefresh}
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-400 shadow-sm transition hover:bg-indigo-50 hover:text-indigo-600"
          >
            <RefreshCw size={14} />
          </button>
        </div>

        {/* FEED / MY POSTS */}
        <div className="mb-5 rounded-xl border border-slate-200 bg-white p-1.5 shadow-sm">
          <div className="grid grid-cols-2 gap-1">
            <button
              type="button"
              onClick={() => {
                setActiveView("feed");
                setActiveMenu(null);
              }}
              className={`flex items-center justify-center gap-2 rounded-lg py-2 text-xs font-semibold transition ${
                activeView === "feed"
                  ? "bg-indigo-600 text-white shadow-sm"
                  : "text-slate-500 hover:bg-slate-50"
              }`}
            >
              <LayoutGrid size={14} />
              Community Feed
            </button>

            <button
              type="button"
              onClick={() => {
                setActiveView("myposts");
                setActiveMenu(null);
              }}
              className={`flex items-center justify-center gap-2 rounded-lg py-2 text-xs font-semibold transition ${
                activeView === "myposts"
                  ? "bg-indigo-600 text-white shadow-sm"
                  : "text-slate-500 hover:bg-slate-50"
              }`}
            >
              <UserRound size={14} />
              My Posts
            </button>
          </div>
        </div>

        {/* EMPTY */}
        {posts.length === 0 ? (
          <div className="rounded-2xl border border-slate-200 bg-white px-5 py-14 text-center shadow-sm">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50 text-indigo-500">
              {activeView === "feed" ? (
                <Sparkles size={22} />
              ) : (
                <ImageIcon size={22} />
              )}
            </div>

            <h2 className="mt-3 text-base font-bold text-slate-700">
              {activeView === "feed"
                ? "Nothing here yet"
                : "You haven't posted yet"}
            </h2>

            <p className="mx-auto mt-1 max-w-xs text-xs leading-5 text-slate-400">
              {activeView === "feed"
                ? "Posts from your connections will appear here."
                : "Create your first post and it will appear here."}
            </p>
          </div>
        ) : (
          <div className="relative">
            {/* TIMELINE */}
            <div className="absolute bottom-5 left-[19px] top-5 hidden w-px bg-slate-200 sm:block" />

            <div className="space-y-5">
              {posts.map((post, index) => {
                const postId = getPostId(post);
                const owner = getPostOwner(post);
                const username = getUsername(owner);
                const profilePic =
                  getProfilePic(owner);

                const liked = isLiked(post);
                const likes = post?.likes || [];
                const postComments =
                  comments[postId] || [];

                const postText =
                  getPostText(post);

                const postImage =
                  getPostImage(post);

                const commentsVisible =
                  showComments[postId];

                return (
                  <div
                    key={postId || index}
                    className="relative sm:pl-10"
                  >
                    {/* TIMELINE DOT */}
                    <div className="absolute left-[12px] top-5 z-10 hidden h-4 w-4 items-center justify-center rounded-full border-4 border-[#f6f8fb] bg-indigo-500 sm:flex" />

                    <article className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:shadow-md">

                      {/* HEADER */}
                      <div className="flex items-center px-4 py-3">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-gradient-to-br from-indigo-500 to-blue-500 text-xs font-bold text-white">
                          {profilePic ? (
                            <img
                              src={profilePic}
                              alt={username}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            getInitial(username)
                          )}
                        </div>

                        <div className="ml-2.5 min-w-0 flex-1">
                          <div className="flex items-center gap-1.5">
                            <h3 className="max-w-[180px] truncate text-[13px] font-bold text-slate-800">
                              {username}
                            </h3>

                            <span className="text-[10px] text-slate-300">
                              •
                            </span>

                            <span className="flex items-center gap-1 text-[10px] text-slate-400">
                              <Clock3 size={10} />
                              {formatDate(
                                post?.createdAt
                              )}
                            </span>
                          </div>

                          <div className="mt-0.5 flex items-center gap-1 text-[9px] text-slate-400">
                            <Globe2 size={9} />

                            {activeView === "myposts"
                              ? "Your post"
                              : "Community post"}
                          </div>
                        </div>

                        {/* MENU */}
                        <div className="relative">
                          <button
                            type="button"
                            onClick={() =>
                              setActiveMenu(
                                activeMenu === postId
                                  ? null
                                  : postId
                              )
                            }
                            className="flex h-7 w-7 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100"
                          >
                            <MoreHorizontal size={16} />
                          </button>

                          {activeMenu === postId && (
                            <div className="absolute right-0 top-8 z-30 w-32 rounded-lg border border-slate-200 bg-white p-1 shadow-lg">
                              {activeView ===
                                "myposts" && (
                                <button
                                  type="button"
                                  disabled={
                                    deletingPost[
                                      postId
                                    ]
                                  }
                                  onClick={() =>
                                    handleDeletePost(
                                      postId
                                    )
                                  }
                                  className="flex w-full items-center gap-2 rounded-md px-2.5 py-2 text-[10px] font-medium text-red-500 hover:bg-red-50"
                                >
                                  {deletingPost[
                                    postId
                                  ] ? (
                                    <LoaderCircle
                                      size={12}
                                      className="animate-spin"
                                    />
                                  ) : (
                                    <Trash size={12} />
                                  )}

                                  Delete Post
                                </button>
                              )}

                              <button
                                type="button"
                                onClick={() =>
                                  setActiveMenu(null)
                                }
                                className="flex w-full items-center gap-2 rounded-md px-2.5 py-2 text-[10px] text-slate-500 hover:bg-slate-50"
                              >
                                <X size={12} />
                                Close
                              </button>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* TEXT */}
                      {postText && (
                        <div className="px-4 pb-3">
                          <p className="whitespace-pre-wrap text-[13px] leading-5 text-slate-600">
                            {postText}
                          </p>
                        </div>
                      )}

                      {/* IMAGE */}
                      {postImage && (
                        <div className="px-3 pb-3">
                          <div className="overflow-hidden rounded-xl bg-slate-100">
                            <img
                              src={postImage}
                              alt="Post"
                              className="max-h-[440px] w-full object-cover"
                            />
                          </div>
                        </div>
                      )}

                      {/* STATS */}
                      <div className="flex items-center justify-between border-t border-slate-100 px-4 py-2">
                        <div className="flex items-center gap-1.5">
                          {likes.length > 0 && (
                            <>
                              <div className="flex h-5 w-5 items-center justify-center rounded-full bg-red-50">
                                <Heart
                                  size={10}
                                  fill="currentColor"
                                  className="text-red-500"
                                />
                              </div>

                              <span className="text-[10px] font-medium text-slate-400">
                                {likes.length}{" "}
                                {likes.length === 1
                                  ? "like"
                                  : "likes"}
                              </span>
                            </>
                          )}
                        </div>

                        <button
                          type="button"
                          onClick={() =>
                            handleToggleComments(
                              postId
                            )
                          }
                          className="text-[10px] font-medium text-slate-400 hover:text-indigo-600"
                        >
                          {postComments.length > 0
                            ? `${postComments.length} ${
                                postComments.length ===
                                1
                                  ? "comment"
                                  : "comments"
                              }`
                            : "Comments"}
                        </button>
                      </div>

                      {/* ACTIONS */}
                      <div className="border-t border-slate-100 px-3 py-1.5">
                        <div className="flex gap-1">
                          <button
                            type="button"
                            onClick={() =>
                              handleToggleLike(post)
                            }
                            className={`flex flex-1 items-center justify-center gap-1.5 rounded-lg py-2 text-xs font-semibold transition ${
                              liked
                                ? "bg-red-50 text-red-500"
                                : "text-slate-500 hover:bg-slate-50 hover:text-red-500"
                            }`}
                          >
                            <Heart
                              size={15}
                              fill={
                                liked
                                  ? "currentColor"
                                  : "none"
                              }
                            />
                            {liked ? "Liked" : "Like"}
                          </button>

                          <button
                            type="button"
                            onClick={() =>
                              handleToggleComments(
                                postId
                              )
                            }
                            className={`flex flex-1 items-center justify-center gap-1.5 rounded-lg py-2 text-xs font-semibold transition ${
                              commentsVisible
                                ? "bg-indigo-50 text-indigo-600"
                                : "text-slate-500 hover:bg-slate-50 hover:text-indigo-600"
                            }`}
                          >
                            <MessageCircle size={15} />
                            Comment
                          </button>
                        </div>
                      </div>

                      {/* COMMENTS */}
                      {commentsVisible && (
                        <div className="border-t border-slate-100 bg-slate-50">

                          {/* INPUT */}
                          <div className="bg-white px-3 py-3">
                            <div className="flex items-center gap-2">
                              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-[9px] font-bold text-indigo-600">
                                U
                              </div>

                              <div className="relative flex-1">
                                <input
                                  type="text"
                                  value={
                                    commentInputs[
                                      postId
                                    ] || ""
                                  }
                                  onChange={(e) =>
                                    handleCommentChange(
                                      postId,
                                      e.target.value
                                    )
                                  }
                                  onKeyDown={(e) => {
                                    if (
                                      e.key === "Enter" &&
                                      !e.shiftKey
                                    ) {
                                      e.preventDefault();

                                      handleAddComment(
                                        postId
                                      );
                                    }
                                  }}
                                  placeholder="Write a comment..."
                                  className="h-8 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 pr-9 text-[11px] outline-none placeholder:text-slate-400 focus:border-indigo-400 focus:bg-white"
                                />

                                <button
                                  type="button"
                                  onClick={() =>
                                    handleAddComment(
                                      postId
                                    )
                                  }
                                  disabled={
                                    !commentInputs[
                                      postId
                                    ]?.trim() ||
                                    commentSending[
                                      postId
                                    ]
                                  }
                                  className="absolute right-1 top-1/2 flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded-md bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-40"
                                >
                                  {commentSending[
                                    postId
                                  ] ? (
                                    <LoaderCircle
                                      size={11}
                                      className="animate-spin"
                                    />
                                  ) : (
                                    <Send size={11} />
                                  )}
                                </button>
                              </div>
                            </div>
                          </div>

                          {/* COMMENT LIST */}
                          <div className="max-h-[280px] overflow-y-auto px-3 py-3">
                            {commentsLoading[
                              postId
                            ] ? (
                              <div className="flex items-center justify-center gap-2 py-6 text-[11px] text-slate-400">
                                <LoaderCircle
                                  size={15}
                                  className="animate-spin text-indigo-600"
                                />
                                Loading comments...
                              </div>
                            ) : postComments.length ===
                              0 ? (
                              <div className="py-6 text-center">
                                <MessageCircle
                                  size={20}
                                  className="mx-auto text-slate-300"
                                />

                                <p className="mt-2 text-[11px] font-medium text-slate-500">
                                  No comments yet
                                </p>

                                <p className="mt-0.5 text-[9px] text-slate-400">
                                  Start the conversation.
                                </p>
                              </div>
                            ) : (
                              <div className="space-y-3">
                                {postComments.map(
                                  (
                                    comment,
                                    commentIndex
                                  ) => {
                                    const commentUser =
                                      getCommentUser(
                                        comment
                                      );

                                    const commentUsername =
                                      getUsername(
                                        commentUser
                                      );

                                    const commentPic =
                                      getProfilePic(
                                        commentUser
                                      );

                                    const commentText =
                                      getCommentText(
                                        comment
                                      );

                                    const commentOwnerId =
                                      getCommentOwnerId(
                                        commentUser
                                      );

                                    const isOwnComment =
                                      String(
                                        commentOwnerId
                                      ) ===
                                      String(profileId);

                                    return (
                                      <div
                                        key={
                                          comment?._id ||
                                          commentIndex
                                        }
                                        className="flex gap-2"
                                      >
                                        <div className="flex h-7 w-7 shrink-0 items-center justify-center overflow-hidden rounded-full bg-indigo-100 text-[9px] font-bold text-indigo-600">
                                          {commentPic ? (
                                            <img
                                              src={
                                                commentPic
                                              }
                                              alt={
                                                commentUsername
                                              }
                                              className="h-full w-full object-cover"
                                            />
                                          ) : (
                                            getInitial(
                                              commentUsername
                                            )
                                          )}
                                        </div>

                                        <div className="min-w-0 flex-1">
                                          <div className="rounded-xl rounded-tl-sm bg-white px-3 py-2 shadow-sm">
                                            <div className="flex items-center justify-between gap-2">
                                              <p className="truncate text-[10px] font-bold text-slate-700">
                                                {
                                                  commentUsername
                                                }
                                              </p>

                                              {isOwnComment && (
                                                <button
                                                  type="button"
                                                  disabled={
                                                    deletingComment[
                                                      comment?._id
                                                    ]
                                                  }
                                                  onClick={() =>
                                                    handleDeleteComment(
                                                      postId,
                                                      comment?._id
                                                    )
                                                  }
                                                  className="flex h-5 w-5 items-center justify-center rounded text-slate-300 hover:bg-red-50 hover:text-red-500"
                                                >
                                                  {deletingComment[
                                                    comment?._id
                                                  ] ? (
                                                    <LoaderCircle
                                                      size={
                                                        10
                                                      }
                                                      className="animate-spin"
                                                    />
                                                  ) : (
                                                    <Trash2
                                                      size={
                                                        11
                                                      }
                                                    />
                                                  )}
                                                </button>
                                              )}
                                            </div>

                                            <p className="mt-1 whitespace-pre-wrap break-words text-[11px] leading-4 text-slate-600">
                                              {
                                                commentText
                                              }
                                            </p>
                                          </div>

                                          {comment?.createdAt && (
                                            <p className="mt-0.5 px-1 text-[8px] text-slate-400">
                                              {formatDate(
                                                comment.createdAt
                                              )}
                                            </p>
                                          )}
                                        </div>
                                      </div>
                                    );
                                  }
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </article>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* FOOTER */}
        {posts.length > 0 && (
          <div className="py-6 text-center">
            <div className="mx-auto mb-1 h-1 w-6 rounded-full bg-slate-200" />

            <p className="text-[9px] text-slate-400">
              {activeView === "feed"
                ? "You're all caught up"
                : "End of your posts"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Feed;