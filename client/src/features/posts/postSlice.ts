import { ICREATEPOST } from "../../types/type";
import { apiSlice } from "../api/apiSlice";

export const postsSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getPosts: builder.query({
      query: () => "posts",
      keepUnusedDataFor: 5,
      providesTags: (result, _error, _arg) =>
        result
          ? [
              ...result.data.posts.map(({ id }: { id: string }) => ({
                type: "posts" as const,
                id,
              })),
              "posts",
            ]
          : ["posts"],
    }),

    getPost: builder.query({
      query: (postId: string) => `posts/${postId}`,
    }),

    createPost: builder.mutation({
      query: (postData: Partial<ICREATEPOST | any>) => ({
        url: "posts",
        method: "POST",
        body: postData,
      }),
      invalidatesTags: (_result: any, _error: any, arg: any) => [
        { type: "posts", id: arg.id },
      ],
    }),

    updatePost: builder.mutation({
      query: ({
        postId,
        postData,
      }: {
        postId: string;
        postData: Partial<ICREATEPOST>;
      }) => ({
        url: `posts/${postId}`,
        method: "PATCH",
        body: postData,
      }),

      invalidatesTags: (_result: any, _error: any, arg: any) => [
        { type: "posts", id: arg.id },
      ],
    }),

    deletePost: builder.mutation({
      query: (postId: string) => ({
        url: `posts/${postId}`,
        method: "DELETE",
      }),

      invalidatesTags: (_result: any, _error: any, arg: any) => [
        { type: "posts", id: arg.id },
      ],
    }),
  }),
});

export const {
  useGetPostsQuery,
  useGetPostQuery,
  useCreatePostMutation,
  useUpdatePostMutation,
  useDeletePostMutation,
} = postsSlice;
