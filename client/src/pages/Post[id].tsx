import { useParams } from "react-router-dom";
import { useGetPostQuery } from "../features/posts/postSlice";
import PostCard from "../features/posts/PostCard";
import { SpinnerCircle } from "../ui/SpinnerCircle";
import CreateComment from "../features/comments/createComment";
import CommentList from "../features/comments/commentList";
import { useAppSelector } from "../app/hook";
import { useGetCommentsQuery } from "../features/comments/commentSlice";
import { getErrorMessage } from "../utils/getErrorMessage";
// import { IUser } from "../types/type";

const PostPreview = () => {
  const { id } = useParams<{ id: string }>();
  const { data: postData, isLoading, error } = useGetPostQuery(id as string);
  const { currentUser } = useAppSelector((state) => state.auth);
  const { id: postId } = useParams();
  const {
    data: commentsData,
    isLoading: commentLoading,
    isSuccess: commentSuccess,
    error: commentError,
  } = useGetCommentsQuery(postId);

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

  if (!postData?.data?.post) {
    return (
      <div className="text-center py-12 text-gray-500">
        No posts available at the moment
      </div>
    );
  }
  console.log({ currentUser, commentsData });

  return (
    <>
      <PostCard post={postData?.data?.post} />
      <div>
        <CreateComment currentUser={currentUser} postId={postId as string} />
      </div>
      <CommentList
        commentsData={commentsData?.data?.comments}
        isLoading={commentLoading}
        isSuccess={commentSuccess}
        isError={commentError}
        error={error}
        postId={postId}
        currentUser={currentUser}
      />
    </>
  );
};

export default PostPreview;
