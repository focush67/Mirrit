// import { Post } from "@/types/post";
// import axios from "axios";
// import { useEffect, useState } from "react";

// interface PostProps {
//   _id: string;
// }

// export default function useFetchParticularPost({ _id }: PostProps) {
//   const [singlePost, setSinglePost] = useState<Post | null>(null);

//   useEffect(() => {
//     const fetchPost = async () => {
//       const response = await axios.get(`/api/utility/?id=${_id}`);
//       console.log(response.data);

//       setSinglePost(response.data.post);
//     };

//     fetchPost();
//   }, [_id]);

//   return {
//     singlePost,
//   };
// }
