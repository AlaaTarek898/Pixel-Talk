import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../Context/AuthContext";
import useGet from "../../Hooks/useGet";
//icons
import { CiMail } from "react-icons/ci";
import { FaBirthdayCake } from "react-icons/fa";
import { BiFemale, BiMale } from "react-icons/bi";
import { IoIosImages } from "react-icons/io";

//COMPONENTS
import Loader from "../../Components/Loader/Loader";

import AddEditePost from "../../Components/AddEditePost/AddEditePost";
import PostCard from "../../Components/PostCard/PostCard";
//axios
import axios from "axios";
//toast
import toast from "react-hot-toast";

import { useQuery } from "@tanstack/react-query";

export default function Profile() {
  const { userToken } = useContext(AuthContext);
  const [photo, setPhoto] = useState(null);
  const [profilePhoto, setProfilePhoto] = useState(null);

  const { data, error, loader } = useGet(
    "get",
    "https://linked-posts.routemisr.com/users/profile-data",
    null,
    { token: userToken }
  );
  useEffect(() => {
    if (data?.user?.photo) {
      setProfilePhoto(data.user.photo);
    }
  }, [data]);
  function getMyPosts() {
    return axios.get(
      "https://linked-posts.routemisr.com/users/664bcf3e33da217c4af21f00/posts",
      {
        params: { limit: 10 },
        headers: { token: userToken },
      }
    );
  }
//get my posts
  const {
    data: myPostsData,
    isLoading: myLoading,
    isError: myError,
  } = useQuery({ queryKey: ["myPosts"], queryFn: getMyPosts });

  // Loading
  if (loader || myLoading) {
    return <Loader />;
  }

  // Error
  if (error || myError) {
    return <p className="text-red-500">Something went wrong 😥</p>;
  }

  //upload image
  function handleUploadImg(e) {
    const file = e.target.files[0];
    setPhoto(file);
    uploadImage(file);
  }

  async function uploadImage(file) {
    const formData = new FormData();
    formData.append("photo", file);

    try {
      const response = await axios.put(
        "https://linked-posts.routemisr.com/users/upload-photo",
        formData,
        {
          headers: {
            token: userToken,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.data.message === "success") {
        toast.success("Profile photo updated 🎉");
        setProfilePhoto(response.data.user.photo);
        setPhoto(null);
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to update photo ❌");
    }
  }

  return (
    <div className="flex flex-wrap w-full  md:w-11/12 m-auto">
      {/* side */}
      <div className="w-11/12 m-auto h-fit md:w-3/12 bg-glass p-3 flex flex-col items-center shadow-xl/30 md:h-dvh md:m-0">

        <div className="bg-img w-45 h-45 rounded-full flex justify-center items-center">
          <img
  src={profilePhoto || data?.user?.photo}
            alt={data?.user?.name}
            className="w-40 h-40 rounded-full "
          />
        </div>
        <div className="flex justify-between m-3 gap-3">
          <label
              htmlFor="uploadProfile"
            className="size-10 rounded-full bg-gray-500 flex justify-center items-center cursor-pointer hover:bg-gray-600 transition-colors"
          >
            <IoIosImages className="text-white text-xl" />
          </label>

          <input
            id="uploadProfile"
            type="file"
            onChange={handleUploadImg}
            className="hidden"
            accept="image/*"
          />
        </div>
        <h3 className="text-2xl font-bold text-orange">{data?.user?.name}</h3>
        <div className="text-left">
          <p className="flex items-center text-white font-500 my-5">
            <span className="text-2xl me-2">
              <span className="text-violet-200 font-bold">< CiMail /></span>
            </span>
            {data?.user?.email}
          </p>
          <p className="flex items-center text-white font-500 my-5">
            <span className="text-2xl me-2">
               <span className="text-violet-200 font-bold"><FaBirthdayCake /></span>
            </span>
            {data?.user?.dateOfBirth?.split("T")[0]}
          </p>
          <p className="flex items-center text-white font-500 my-5">
            <span className="text-2xl me-2">
                <span className="text-violet-200 font-bold">
              {data?.user?.gender === "male" ? <BiMale /> : <BiFemale />}</span>
            </span>
            {data?.user?.gender}
          </p>
        </div>
      </div>

      {/* posts */}
      <div className="w-11/12 md:w-7/12 m-auto">
        <AddEditePost />

        {myPostsData?.data?.posts?.length > 0 ? (
          myPostsData.data.posts.map((post) => (
            <PostCard key={post._id} post={post} />
          ))
        ) : (
          <p className="text-gray-500 mt-5">No posts found.</p>
        )}
      </div>
    </div>
  );
}
