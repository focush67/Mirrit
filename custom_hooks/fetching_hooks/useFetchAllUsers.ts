"use client";

import { UserProfile } from "@/types/profile";
import { useState, useEffect } from "react";
import axios from "axios";

export default function useFetchAllUsers() {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [error, setError] = useState("");
  useEffect(() => {
    const fetchAllUsers = async () => {
      try {
        const response = await axios.get("/api/user");
        setUsers(response.data.users);
      } catch (error: any) {
        console.log(error);
        setError(error.message);
      }
    };

    fetchAllUsers();
  }, []);

  return { users, error };
}
