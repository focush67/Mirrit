import { db } from "@/utilities/database";
import { getSelf } from "./auth-service";

export const checkMembership = async (groupId: string) => {
  const self = await getSelf();
  if (!self) {
    console.log("Unauthorised request");
    return null;
  }

  const member = await db.groupMember.findFirst({
    where: {
      groupId,
      userId: self?.id,
    },
  });

  return !!member;
};
