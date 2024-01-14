import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

const ClusterA = {
  apiKey: process.env.NEXT_PUBLIC_CLUSTERA_APIKEY,
  authDomain: process.env.NEXT_PUBLIC_CLUSTERA_AUTHDOMAIN,
  projectId: process.env.NEXT_PUBLIC_CLUSTERA_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_CLUSTERA_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_CLUSTERA_MESSAGINGSENDERID,
  appId: process.env.NEXT_PUBLIC_CLUSTERA_APPID,
};

const initialized_posts_cluster = initializeApp(ClusterA, "Posts");

export const PostsCluster = getStorage(initialized_posts_cluster);
