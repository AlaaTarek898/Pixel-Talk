import { useContext, useRef, useEffect, useState } from "react";
import { AuthContext } from "../../Context/AuthContext";
import axios from "axios";
import Loader from "../../Components/Loader/Loader";
import PostCard from "../../Components/PostCard/PostCard";
import AddEditePost from "../../Components/AddEditePost/AddEditePost";
import { useInfiniteQuery } from "@tanstack/react-query";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Button,
  Input,
} from "@heroui/react";

export const SearchIcon = ({
  size = 24,
  strokeWidth = 1.5,
  width,
  height,
  ...props
}) => {
  return (
    <svg
      aria-hidden="true"
      fill="none"
      focusable="false"
      height={height || size}
      role="presentation"
      viewBox="0 0 24 24"
      width={width || size}
      {...props}
    >
      <path
        d="M11.5 21C16.7467 21 21 16.7467 21 11.5C21 6.25329 16.7467 2 11.5 2C6.25329 2 2 6.25329 2 11.5C2 16.7467 6.25329 21 11.5 21Z"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={strokeWidth}
      />
      <path
        d="M22 22L20 20"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={strokeWidth}
      />
    </svg>
  );
};

export default function Posts() {
  const [sorted, setSorted] = useState("newest");
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredPosts, setFilteredPosts] = useState([]);

  const { userToken } = useContext(AuthContext);
//get posts
  function getPosts({ pageParam = 1 }) {
    return axios.get("https://linked-posts.routemisr.com/posts", {
      params: { limit: 40, page: pageParam },
      headers: { token: userToken },
    });
  }

  const {
    data,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ["posts"],
    queryFn: getPosts,
    getNextPageParam: (lastPage, allPages) => {
      if (lastPage.data.posts.length < 10) return undefined;
      return allPages.length + 1;
    },
  });

  const posts = data?.pages.flatMap((page) => page.data.posts) || [];

  const loaderRef = useRef(null);

  // infinite scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { threshold: 1 }
    );

    if (loaderRef.current) observer.observe(loaderRef.current);
    return () => observer.disconnect();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  // search filter
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredPosts(posts);
    } else {
      const res = posts.filter((post) =>
        String(post.body).toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredPosts(res);
    }
  }, [searchQuery, posts]);

  // sorting
  function getSortedPosts() {
    const basePosts = [...filteredPosts];
    if (sorted === "oldest") {
      return basePosts.sort(
        (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
      );
    } else {
      return basePosts.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );
    }
  }

  return (
    <div className="w-11/12  md:w-1/2 m-auto">
      <AddEditePost />
<div className="flex justify-between items-center">
      {/* Sort Dropdown */}
      <Dropdown >
        <DropdownTrigger>
          <Button className="mt-2 text-white" variant="bordered">Sort</Button>
        </DropdownTrigger>
        <DropdownMenu
          aria-label="Sort posts"
          onAction={(key) => {
            if (key === "oldest") {
              setSorted("oldest");
            }
            if (key === "newest") {
              setSorted("newest");
            }
          }}
        >
          <DropdownItem key="oldest">Oldest</DropdownItem>
          <DropdownItem key="newest">Latest</DropdownItem>
        </DropdownMenu>
      </Dropdown>

      {/* Search Input */}
      <Input
        classNames={{
          base: "max-w-full sm:max-w-[15rem] h-10 mt-3",
          mainWrapper: "h-full",
          input: "text-small",
          inputWrapper:
            "h-full font-normal text-default-500 bg-default-400/20 dark:bg-default-500/20",
        }}
        placeholder="Type to search..."
        size="sm"
        startContent={<SearchIcon size={18} />}
        type="search"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
</div>
      {/* Posts list */}
      {isLoading ? (
        <Loader />
      ) : getSortedPosts().length ? (
        getSortedPosts().map((post) => <PostCard key={post._id} post={post} />)
      ) : (
        <p className="mt-4 text-center">No posts found.</p>
      )}

      {/* infinite scroll loader */}
      <div ref={loaderRef} className="flex justify-center p-4">
        {isFetchingNextPage && <Loader />}
      </div>
    </div>
  );
}
