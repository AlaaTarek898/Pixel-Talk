import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import React from 'react'

export default function MyPosts() {

  function getMyPosts() {
    return axios.get(
      "https://linked-posts.routemisr.com/users/664bcf3e33da217c4af21f00/posts",
      {
        params: { limit: 10 },
        headers: { token: userToken },
      }
    );
  }
  const {
    data: myPostsData,
    isLoading: myLoading,
    isError: myError,
  } = useQuery({ queryKey: ["myPosts"], queryFn: getMyPosts });

 
  return (
    <>
   <h2 className="text-xl font-bold my-4">My Posts</h2>
        {myPostsData.length ? (
          myPostsData.data.posts.map((post) => <PostCard key={post._id} post={post} />)

        ) : (
          <p>No posts yet.</p>
        )}
  </>
  )
  
}
