import { db } from "@/utilities/database";
import { getSelf } from "./auth-service";
import { Group } from "@prisma/client";

export const getJoinedGroups = async () => {
  const self = await getSelf();
  if (!self) {
    console.log("Unauthorised request");
    return null;
  }

  const joinedGroups = await db.group.findMany({
    where: {
      members: {
        some: {
          userId: self?.id,
        },
      },
    },
  });

  return joinedGroups;
};
