import { Container } from "react-bootstrap";

import { useGetPostsQuery } from "../features/posts/postSlice";
import { useAppSelector } from "../app/hook";
import { IPost } from "../types/type";
import { useEffect, useState } from "react";
import { SpinnerCircle } from "../ui/SpinnerCircle";
import Avater from "../features/users/Avater";
import PostCard from "../features/posts/PostCard";
import { getErrorMessage } from "../utils/getErrorMessage";

const Preview = () => {
  const { currentUser } = useAppSelector((state) => state.auth);
  const { data: postsData, isLoading, error, isSuccess } = useGetPostsQuery({});
  const [data, setData] = useState<IPost[] | null>(null);

  const getPostsById = (id: string, Posts: IPost[]) => {
    const filterPost = Posts.filter((post: IPost) => post.userId.id === id);
    return filterPost;
  };

  useEffect(() => {
    if (isSuccess) {
      setData(getPostsById(currentUser?.id as string, postsData?.data?.posts));
    }
  }, [isSuccess]);

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

  if (!data) {
    return (
      <div className="text-center py-12 text-gray-500">
        No posts available at the moment
      </div>
    );
  }

  return (
    <section className="w-full">
      <Container className="mansoryLayout listView">
        {data.map((post) => {
          return (
            <div className="gridItem" key={post._id}>
              <Avater src={post?.userId?.photo} />
              <PostCard post={post} />
            </div>
          );
        })}
      </Container>
    </section>
  );
};
export default Preview;
