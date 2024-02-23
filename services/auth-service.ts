import { currentUser } from "@clerk/nextjs";
import { db } from "@/utilities/database";

export const getSelf = async () => {
  const self = await currentUser();
  if (!self || !self.username) {
    console.log("No user found at getSelf service");
    return null;
  }
  const user = await db.user.findUnique({
    where: {
      externalUserId: self.id,
    },
    include: {
      followedBy: true,
      following: true,
    },
  });
  if (!user) {
    throw new Error("No user found at auth service");
  }
  return user;
};

export const getUserByUsername = async (username: string) => {
  const self = await currentUser();
  if (!self || !self.username) {
    throw new Error("Unauthorized Request at auth-service");
  }
  const user = await db.user.findUnique({
    where: {
      username: username,
    },
  });

  if (!user) {
    console.log(
      "No specific user with the given username was found at service"
    );
    return null;
  }
  return user;
};
