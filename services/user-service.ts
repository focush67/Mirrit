import { db } from "@/utilities/database";

export const getUserById = async (userId: string) => {
  const user = await db.user.findUnique({
    where: {
      id: userId,
    },
  });
  return user;
};

export const getUserByExternalId = async (id: string) => {
  const user = await db.user.findUnique({
    where: {
      externalUserId: id,
    },
  });

  return user;
};
