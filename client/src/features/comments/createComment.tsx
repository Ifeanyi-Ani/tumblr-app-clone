import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useCreateCommentMutation } from "./commentSlice";
import { toast } from "react-hot-toast";
import { IUser } from "../../types/type";

interface CreateCommentProps {
  currentUser?: IUser | null;
  postId: string;
}

const CreateComment = ({ postId }: CreateCommentProps) => {
  const [createComment, { isLoading, isError, error, isSuccess }] =
    useCreateCommentMutation();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const [isTextareaFocused, setIsTextareaFocused] = useState(false);

  // Handle success state
  useEffect(() => {
    if (isSuccess) {
      toast.success("Comment posted successfully!");
      reset();
      setIsTextareaFocused(false);
    }
  }, [isSuccess, reset]);

  // Handle error state
  useEffect(() => {
    if (isError) {
      const errorMessage =
        error && "data" in error
          ? error.data?.message || "Failed to post comment"
          : "An unexpected error occurred";

      toast.error(errorMessage);
    }
  }, [isError, error]);

  const handleCreateComment = async (data: { text?: string }) => {
    if (!data?.text?.trim()) {
      toast.error("Comment cannot be empty");
      return;
    }

    try {
      await createComment({ formData: data, postId }).unwrap();
    } catch (err) {
      // Error is handled by the useEffect above
      console.error("Failed to create comment:", err);
    }
  };

  return (
    <form className="mt-2" onSubmit={handleSubmit(handleCreateComment)}>
      <fieldset
        className={`relative bg-blue-600 p-2 rounded-md ${
          isTextareaFocused ? "h-40" : "h-auto"
        }`}
      >
        <textarea
          placeholder="Post your reply..."
          className={`no-focus text-stone-200 outline-none w-full bg-[unset] transition-all duration-200 ease-in-out ${
            isTextareaFocused ? "h-24 pb-10" : "h-8"
          } ${errors.text ? "border border-red-500" : ""}`}
          {...register("text", { required: "Comment text is required" })}
          onFocus={() => setIsTextareaFocused(true)}
          disabled={isLoading}
        />

        {errors.text && (
          <p className="text-red-300 text-sm mt-1">
            {errors.text.message?.toString()}
          </p>
        )}

        {isTextareaFocused && (
          <div className="absolute bottom-2 right-2 flex gap-4 transition-all duration-200 ease-in-out">
            <button
              type="button"
              className="rounded-lg bg-blue-500 px-5 py-1.5 text-white hover:bg-blue-400 transition-colors"
              onClick={() => {
                setIsTextareaFocused(false);
                reset();
              }}
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className={`rounded-lg px-5 py-1.5 text-white transition-colors ${
                isLoading
                  ? "bg-blue-400 cursor-not-allowed"
                  : "bg-blue-700 hover:bg-blue-800"
              }`}
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="flex items-center">
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Commenting...
                </span>
              ) : (
                "Comment"
              )}
            </button>
          </div>
        )}
      </fieldset>
    </form>
  );
};

export default CreateComment;
