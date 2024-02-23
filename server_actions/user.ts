"use server";

import { getSelf } from "@/services/auth-service";
import { db } from "@/utilities/database";
import { User } from "@prisma/client";
import { revalidatePath } from "next/cache";

export const getAllUsers = async () => {
  const users = await db.user.findMany({});
  return users;
};

export const updateUser = async (values: Partial<User>) => {
  const self = await getSelf();
  if (!self) {
    console.log("You need to be logged in to update");
    throw new Error("Unauthorized request");
  }

  const validData = {
    bio: values.bio,
  };

  const user = await db.user.update({
    where: {
      id: self.id,
    },
    data: {
      ...validData,
    },
  });

  revalidatePath(`/dashboard`);
  return user;
};
