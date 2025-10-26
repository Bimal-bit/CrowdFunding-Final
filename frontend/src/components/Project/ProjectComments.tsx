import React, { useState } from "react";
import { Heart, MessageCircle, Reply } from "lucide-react";

interface ReplyType {
  id: number;
  user: {
    name: string;
    avatar: string;
  };
  date: string;
  content: string;
}

interface Comment {
  id: number;
  user: {
    name: string;
    avatar: string;
  };
  date: string;
  content: string;
  likes: number;
  likedByUser?: boolean;
  replies: ReplyType[];
}

const ProjectComments: React.FC = () => {
  const [newComment, setNewComment] = useState("");
  const [replyingTo, setReplyingTo] = useState<number | null>(null);
  const [newReply, setNewReply] = useState("");
  const [openReplies, setOpenReplies] = useState<number | null>(null); // ✅ track which comment's replies are visible

  const [comments, setComments] = useState<Comment[]>([
    {
      id: 1,
      user: {
        name: "Alex Johnson",
        avatar:
          "https://images.pexels.com/photos/3778876/pexels-photo-3778876.jpeg?auto=compress&cs=tinysrgb&w=100",
      },
      date: "2025-01-16",
      content:
        "This is exactly what we need in rural communities! Can't wait to see this in action.",
      likes: 12,
      likedByUser: false,
      replies: [
        {
          id: 1,
          user: {
            name: "Sarah Lee",
            avatar:
              "https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=100",
          },
          date: "2025-01-17",
          content: "Totally agree! This will be life-changing.",
        },
      ],
    },
    {
      id: 2,
      user: {
        name: "Maria Santos",
        avatar:
          "https://images.pexels.com/photos/3763188/pexels-photo-3763188.jpeg?auto=compress&cs=tinysrgb&w=100",
      },
      date: "2025-01-15",
      content:
        "The AI optimization feature sounds incredible. How does it adapt to different water sources?",
      likes: 8,
      likedByUser: false,
      replies: [
        {
          id: 1,
          user: {
            name: "Project Creator",
            avatar: "https://cdn-icons-png.flaticon.com/512/149/149071.png",
          },
          date: "2025-01-15",
          content:
            "Great question! The AI uses sensor data to adapt automatically.",
        },
      ],
    },
  ]);

  // ✅ Add a new comment
  const handleSubmitComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (newComment.trim()) {
      const newCommentObj: Comment = {
        id: comments.length + 1,
        user: {
          name: "You",
          avatar: "https://cdn-icons-png.flaticon.com/512/149/149071.png",
        },
        date: new Date().toISOString().split("T")[0],
        content: newComment,
        likes: 0,
        likedByUser: false,
        replies: [],
      };

      setComments([newCommentObj, ...comments]);
      setNewComment("");
    }
  };

  // ✅ Toggle like
  const handleLike = (id: number) => {
    setComments((prev) =>
      prev.map((comment) =>
        comment.id === id
          ? {
              ...comment,
              likes: comment.likedByUser
                ? comment.likes - 1
                : comment.likes + 1,
              likedByUser: !comment.likedByUser,
            }
          : comment
      )
    );
  };

  // ✅ Add reply
  const handleReplySubmit = (e: React.FormEvent, commentId: number) => {
    e.preventDefault();
    if (newReply.trim()) {
      const replyObj: ReplyType = {
        id: Date.now(),
        user: {
          name: "You",
          avatar: "https://cdn-icons-png.flaticon.com/512/149/149071.png",
        },
        date: new Date().toISOString().split("T")[0],
        content: newReply,
      };

      setComments((prev) =>
        prev.map((comment) =>
          comment.id === commentId
            ? { ...comment, replies: [...comment.replies, replyObj] }
            : comment
        )
      );

      setNewReply("");
      setReplyingTo(null);
      setOpenReplies(commentId); // ✅ auto-show replies after adding
    }
  };

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-bold text-gray-900">
        Comments ({comments.length})
      </h3>

      {/* Add Comment Form */}
      <form onSubmit={handleSubmitComment} className="bg-gray-50 rounded-lg p-4">
        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Share your thoughts or ask a question..."
          rows={3}
          className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
        />
        <div className="mt-3 flex justify-end">
          <button
            type="submit"
            disabled={!newComment.trim()}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Post Comment
          </button>
        </div>
      </form>

      {/* Comments List */}
      <div className="space-y-4">
        {comments.map((comment) => (
          <div
            key={comment.id}
            className="bg-white border border-gray-200 rounded-lg p-4"
          >
            <div className="flex items-start space-x-3">
              <img
                src={comment.user.avatar}
                alt={comment.user.name}
                className="w-10 h-10 rounded-full object-cover"
              />
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-1">
                  <h4 className="font-semibold text-gray-900">
                    {comment.user.name}
                  </h4>
                  <span className="text-sm text-gray-500">{comment.date}</span>
                </div>
                <p className="text-gray-700 mb-3">{comment.content}</p>

                {/* Action buttons */}
                <div className="flex items-center space-x-4 text-sm text-gray-500 mb-2">
                  <button
                    onClick={() => handleLike(comment.id)}
                    className={`flex items-center space-x-1 transition-colors ${
                      comment.likedByUser ? "text-red-500" : "hover:text-red-500"
                    }`}
                  >
                    <Heart
                      className={`h-4 w-4 ${
                        comment.likedByUser ? "fill-red-500" : ""
                      }`}
                    />
                    <span>{comment.likes}</span>
                  </button>

                  <button
                    onClick={() => {
                      setReplyingTo(
                        replyingTo === comment.id ? null : comment.id
                      );
                      setOpenReplies(
                        openReplies === comment.id ? null : comment.id
                      );
                    }}
                    className="flex items-center space-x-1 hover:text-blue-500 transition-colors"
                  >
                    <Reply className="h-4 w-4" />
                    <span>Reply</span>
                  </button>

                  {comment.replies.length > 0 && (
                    <button
                      onClick={() =>
                        setOpenReplies(
                          openReplies === comment.id ? null : comment.id
                        )
                      }
                      className="flex items-center space-x-1 hover:text-blue-500 transition-colors"
                    >
                      <MessageCircle className="h-4 w-4" />
                      <span>{comment.replies.length} replies</span>
                    </button>
                  )}
                </div>

                {/* Reply form */}
                {replyingTo === comment.id && (
                  <form
                    onSubmit={(e) => handleReplySubmit(e, comment.id)}
                    className="mt-2 space-y-2"
                  >
                    <textarea
                      value={newReply}
                      onChange={(e) => setNewReply(e.target.value)}
                      placeholder="Write a reply..."
                      rows={2}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    />
                    <div className="flex justify-end">
                      <button
                        type="submit"
                        disabled={!newReply.trim()}
                        className="bg-green-600 text-white px-4 py-1 rounded-lg font-medium hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Post Reply
                      </button>
                    </div>
                  </form>
                )}

                {/* Replies list (toggle) */}
                {openReplies === comment.id && comment.replies.length > 0 && (
                  <div className="mt-3 space-y-2 pl-10">
                    {comment.replies.map((reply) => (
                      <div
                        key={reply.id}
                        className="bg-gray-50 border border-gray-200 rounded-lg p-2 flex space-x-2"
                      >
                        <img
                          src={reply.user.avatar}
                          alt={reply.user.name}
                          className="w-8 h-8 rounded-full object-cover"
                        />
                        <div>
                          <div className="flex items-center space-x-2">
                            <h5 className="text-sm font-semibold text-gray-900">
                              {reply.user.name}
                            </h5>
                            <span className="text-xs text-gray-500">
                              {reply.date}
                            </span>
                          </div>
                          <p className="text-sm text-gray-700">
                            {reply.content}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProjectComments;
export { ProjectComments };
