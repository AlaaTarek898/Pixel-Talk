//hooks
import useGet from "../../Hooks/useGet";
import React, { useContext, useState } from "react";
//contsxt
import { AuthContext } from "../../Context/AuthContext";
//axios
import axios from "axios";
//ui
import { Textarea } from "@heroui/react";
import { IoMdAttach } from "react-icons/io";
import toast from "react-hot-toast";

//emojy
import InputEmoji from "react-input-emoji";


export default function AddEditePost() {
  const [show, setShow] = useState(false);
  const [body, setBody] = useState("");
  const [img, setImg] = useState(null);
  const { userToken } = useContext(AuthContext);
  // get profile data
  const { data } = useGet(
    "get",
    "https://linked-posts.routemisr.com/users/profile-data",
    null,
    { token: userToken }
  );
  //add post
  function addPost() {
    const formData = new FormData();
    if (body) formData.append("body", body);
    if (img) formData.append("image", img);

    axios
      .post("https://linked-posts.routemisr.com/posts", formData, {
        headers: {
          token: userToken,
          "Content-Type": "multipart/form-data",
        },
      })
      .then((response) => {
     
        if (response.data.message === "success") {
          toast.success("post added successfully 🎉");
          setBody("");
          setImg(null);
          setShow(false);
        }
      })
      .catch((error) => {
        console.log(error);
        toast.error("Failed to add post ❌");
      });
  }

  function handleUploadImgp(e) {
    setImg(e.target.files[0]);
  }

  return (
    <div>
      <div className="rounded-xl  m-auto mt-2 bg-glass p-5 flex justify-around items-center">
        <div>
          <img
            className=" size-12 rounded-full"
            src={data?.user?.photo}
            alt={data?.user.name}
          />
          <button></button>
        </div>
        <div className="bg-gray-200 p-3 rounded-xl w-10/12  mt-2">
          {!show ? (
            <p onClick={() => setShow(true)}>
              {" "}
              What's in your mind {data?.user?.name?.split(" ")[0]}?
            </p>
          ) : (
            <>
              <InputEmoji
                className="col-span-12 md:col-span-6 mb-6 md:mb-0"
                labelPlacement="outside"
                placeholder={`What's in your mind ${
                  data?.user?.name?.split(" ")[0]
                }?`}
                variant="faded"
                value={body}
  onChange={(text) => setBody(text)} 
              />

              {img && (
                <img
                  src={URL.createObjectURL(img)}
                  className="h-40 w-full object-cover mt-2 rounded-lg"
                  alt="preview"
                />
              )}

              <div className="flex justify-between m-3 gap-3">
                <label
                  htmlFor="upload"
                  className="size-10 rounded-full bg-gray-500 flex justify-center items-center cursor-pointer hover:bg-gray-600 transition-colors"
                >
                  <IoMdAttach className="text-white text-xl" />
                </label>

                <input
                  id="upload"
                  type="file"
                  onChange={handleUploadImgp}
                  className="hidden"
                  accept="image/*"
                />

                <div>
                  <button
                    className="bg-blue-500 w-20 m-2 text-white p-2 rounded-xl"
                    onClick={addPost}
                  >
                    Post
                  </button>
                  <button
                    className="bg-red-500 w-20 m-2 text-white p-2 rounded-xl"
                    onClick={() => {
                      setShow(false);
                      setBody("");
                      setImg(null);
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
