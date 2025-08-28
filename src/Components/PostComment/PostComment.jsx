import React, { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

//emojy
import InputEmoji from "react-input-emoji";
import { IoSend } from "react-icons/io5";
export default function PostComment({ post, userToken, data }) {
  const [content, setContent] = useState("");

  function addComment() {
    axios
      .post(
        "https://linked-posts.routemisr.com/comments",
        {
          content: content,
          post: post._id,
        },
        {
          headers: {
            token: userToken,
          },
        }
      )
      .then((response) => {
        console.log(response);
        if (response.data.message === "success") {
          toast.success("Comment added successfully 🎉");
          setContent("");
        }
      })
      .catch((error) => {
        if (error) {
          toast.error("Failed to add comment ❌");
        }
      });
  }

  return (
    <div className=" flex justify-center">
      <div className="rounded-xl w-11/12  mt-2 p-2 gap-3 flex justify-around items-center">
        <div>
          <img
            className=" w-10 h-10  rounded-full"
            src={data?.user?.photo}
            alt={data?.user?.name}
          />
        </div>

        <InputEmoji
          className=" w-12/12  "
          labelPlacement="outside"
          placeholder={`Add Comment...`}
          variant="faded"
          value={content}
          onChange={(text) => setContent(text)}
        />
        <button
          className="text-blue-500 hover:cursor-pointer"
          onClick={addComment}
        >
          <IoSend />
        </button>
      </div>
    </div>
  );
}
