//hooks
import { useState } from "react";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import useGet from "../../Hooks/useGet";

//contsxt

import { AuthContext } from "../../Context/AuthContext";
//axios
import axios from "axios";

//ui
import { FaCommentAlt, FaShare } from "react-icons/fa";
import toast from "react-hot-toast";
//compnent
import PostComment from "../PostComment/PostComment";
import GetComment from "../GetComment/GetComment";

export default function PostCard({ post, from }) {
  
  const [visibleComment, setVisibleComment] = useState(2);
  const navigate = useNavigate();

  const { userToken } = useContext(AuthContext);
  const { data } = useGet(
    "get",
    "https://linked-posts.routemisr.com/users/profile-data",
    null,
    { token: userToken }
  );

  function deletePost(postId) {
    console.log("Deleting post ID:", postId);
    axios
      .delete(`https://linked-posts.routemisr.com/posts/${postId}`, {
        headers: {
          token: userToken,
        },
      })
      .then((response) => {
        console.log(response);
        if (response.data.message === "success") {
          toast.success("post deleted successfully 🎉");
        }
      })
      .catch((error) => {
        console.log(error);
        toast.error("Failed to delete post❌");
      });
  }
  async function handleShare(post) {
    try {
      const formData = new FormData();

      formData.append("body", post.body);

      if (post.image) {
        const response = await fetch(post.image);
        const blob = await response.blob();
        const file = new File([blob], "shared-image.jpg", { type: blob.type });

        formData.append("image", file);
      }

      const res = await axios.post(
        "https://linked-posts.routemisr.com/posts",
        formData,
        {
          headers: {
            token: userToken,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (res.data.message === "success") {
        toast.success("post shared successfully 🎉");
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to share post ❌");
    }
  }

  return (
    <div
      key={post._id}
      className=" p-4 rounded-md  m-auto my-3 shadow-xl/20 bg-glass"
    >
      {/* user info */}

      <div className="flex items-center justify-between gap-3 ">
        <div className="flex items-center gap-3 w-10/12">
          <img
            src={post.user?.photo}
            className="w-10 h-10 rounded-full"
            alt={post.user?.name}
          />
          <div className="w-1/3 flex flex-col  ">
            <h2 className="font-600 text-md text-white">{post.user?.name}</h2>
            <p className="text-sm text-neutral-200">
              {new Date(post.createdAt).toLocaleString("en-GB", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
              })}
            </p>
          </div>
        </div>
        {post.user._id === data?.user?._id ? (
          <button
            className="bg-red-400 text-white  w-7 h-7 flex justify-around  rounded-full hover:cursor-pointer"
            onClick={() => deletePost(post._id)}
          >
            <p>x</p>
          </button>
        ) : (
          ""
        )}
      </div>

      {/* post body */}
      <div className="w-11/12 m-auto mt-2.5 text-white ">
        <p className=" text-left mb-2 wrap-break-word">{post.body}</p>
        {post.image && (
          <img
            className="w-full h-60 object-cover"
            src={post.image}
            alt="post_body"
          />
        )}
      </div>

      {/* post details */}
      <div className="flex items-center justify-between w-11/12 m-auto  bg-glass rounded-t-none p-2">
        <div className="flex items-center">
          <FaCommentAlt />

          <p className="ml-1">{post.comments.length}</p>
          {from === "details" ? (
            <p
              className="font-bold "
              onClick={() => {
                setVisibleComment(visibleComment + 2);
              }}
            >
              'see more'
            </p>
          ) : (
            <p
              onClick={() => {
                navigate("/postDetails/" + post._id);
              }}
              className="   text-sky-400 underline  mx-2 hover:cursor-pointer
              hover:text-black
              hover:bg-blue-200"
            >
              Show Comment
            </p>
          )}
        </div>
        <div>
          <button
            className="hover:cursor-pointer"
            onClick={() => {
              handleShare(post);
            }}
          >
            <FaShare />
          </button>
        </div>
      </div>

      {/* comments */}
      <GetComment
        post={post}
        userToken={userToken}
        data={data}
        visibleComment={visibleComment}
      />
      {/* AddComment */}
      <PostComment post={post} userToken={userToken} data={data} />
    </div>
  );
}
