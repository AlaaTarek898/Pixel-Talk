import axios from "axios";
import React from "react";
import toast from "react-hot-toast";
import placeholder from "../../Assets/user.png";

export default function GetComment({ post, userToken, data, visibleComment }) {
  function deleteComment(commentId) {
    axios
      .delete(`https://linked-posts.routemisr.com/comments/${commentId}`, {
        headers: {
          token: userToken,
        },
      })
      .then((response) => {
        console.log(response);
        if (response.data.message === "success") {
          toast.success("Comment deleted successfully 🎉");
        }
      })
      .catch((error) => {
        console.log(error);
        toast.error("Failed to delete comment ❌");
      });
  }
  return (
    <div>
      {post.comments.length
        ? post.comments.slice(0, visibleComment).map((comment) => (
            <div
              key={comment._id}
              className="flex  items-start justify-between gap-1.5 w-11/12 m-auto mt-2.5  p-2"
            >
              <div className="flex items-center">
                <img
                  onError={(e) => {
                    e.target.src = placeholder;
                  }}
                  src={comment.commentCreator?.photo}
                  className="w-10 h-10 rounded-full"
                  alt={comment.commentCreator.name}
                />
              </div>
              <div className="w-11/12 m-auto flex justify-between items-end bg-zinc-200 rounded-2xl p-2">
                <div>
                  <h2 className="font-bold ml-2">
                    {comment.commentCreator.name}
                  </h2>
                  <p className="text-lg text-left mb-2 ml-2">
                    {comment.content}
                  </p>
                </div>
                <div>
                  {comment.commentCreator._id === data?.user?._id ? (
                    <button
                      onClick={() => deleteComment(comment._id)}
                      className="text-right text-red-700 m-3 text-sm text-gray- hover:cursor-pointer"
                    >
                      delete
                    </button>
                  ) : null}
                </div>
              </div>
            </div>
          ))
        : null}
    </div>
  );
}
