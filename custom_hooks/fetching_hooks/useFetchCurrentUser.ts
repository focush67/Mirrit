import { UserProfile } from "@/types/profile";
import axios from "axios";
import { useEffect, useState } from "react";

interface useFetchCurrentUserProps {
  email: string;
}
export default function useFetchCurrentUser({
  email,
}: useFetchCurrentUserProps) {
  const [user, setUser] = useState<UserProfile | null>();
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const response = await axios.get(`/api/user/?email=${email}`);
        setUser(response.data.user);
      } catch (error: any) {
        console.log(error.message);
        setError(error.message);
      }
    };

    fetchCurrentUser().then(() => {
      console.log("Fetch Users was called");
    });
  }, [email]);

  return { user, error };
}
