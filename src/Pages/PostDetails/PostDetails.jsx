
import React, { useContext, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { AuthContext } from '../../Context/AuthContext'
import axios from 'axios'
import PostCard from '../../Components/PostCard/PostCard'
import Loader from '../../Components/Loader/Loader'

export default function PostDetails() {
  const [postDetails, setPostDetails] = useState(null);
  const {postid}=useParams()
  const {userToken}=useContext(AuthContext)
  console.log(postid)
function getSinglePost() {
  axios
    .get("https://linked-posts.routemisr.com/posts/" + postid, {
      headers: {
        token: userToken,
      },
    })
    .then((response) => {
      if (response.data.message === "success") {
        setPostDetails(response.data.post); 
      }
    })
    .catch((error) => {
      console.log(error);
    });
}

    
  useEffect(()=>{
    getSinglePost()
  },[])


  return (
    <div>{postDetails?<PostCard post={postDetails} from='details'/>:<Loader/>}
    </div>
  )
}
