import { useGetPostsQuery } from "./postSlice";
import PostCard from "./PostCard";
import Avatar from "../users/Avater";
import { SpinnerCircle } from "../../ui/SpinnerCircle";
import { IPost } from "../../types/type";
import { getErrorMessage } from "../../utils/getErrorMessage";

const PostList = () => {
  const { data: postsData, isLoading, error } = useGetPostsQuery({});

  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <SpinnerCircle />
      </div>
    );
  }

  if (error) {
    const errorMessage = getErrorMessage(error);
    return (
      <div className="text-red-500 p-4 bg-red-50 rounded-md">
        {errorMessage}
      </div>
    );
  }

  if (!postsData?.data?.posts?.length) {
    return (
      <div className="text-center py-12 text-gray-500">
        No posts available at the moment
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {postsData.data.posts.map((post: IPost) => (
        <div
          className="w-full relative break-inside-avoid flex divide-x-2 divide-blue-800 gap-x-4"
          key={post._id}
        >
          <Avatar src={post.userId?.photo} />
          <PostCard post={post} />
        </div>
      ))}
    </div>
  );
};

export default PostList;
