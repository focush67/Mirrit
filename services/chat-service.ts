import { db } from "@/utilities/database";
import { getSelf } from "./auth-service";
import { Group } from "@prisma/client";

export const isAlreadyRequested = async (group: Group) => {
  const self = await getSelf();
  if (!self) {
    console.log("Unauthorised request");
    return false;
  }

  const requests = await db.user.findUnique({
    where: {
      id: self?.id,
    },
    select: {
      joinRequests: true,
    },
  });

  const status = requests?.joinRequests.some(
    (req) => req.targetGroupId === group?.id
  );

  return status;
};

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

export const getAllGroups = async () => {
  const self = await getSelf();
  if (!self) {
    console.log("Unauthorised request");
    return null;
  }

  const allGroups = await db.group.findMany({});
  return allGroups;
};

export const getJoinRequests = async () => {
  const self = await getSelf();
  if (!self) {
    console.log("Unauthorised request");
    return null;
  }

  const adminGroups = await db.group.findMany({
    where: {
      groupAdminId: self?.id,
    },
    select: {
      id: true,
    },
  });

  const groupIds = adminGroups.map((group) => group.id);

  const joinRequests = await db.groupJoinRequest.findMany({
    where: {
      targetGroupId: {
        in: groupIds,
      },
    },
    include: {
      targetGroup: true,
      requestSender: true,
    },
  });

  return joinRequests;
};

export const getProfilesInGroup = async (groupId: string) => {
  const groupWithMembers = await db.group.findUnique({
    where: {
      id: groupId,
    },
    include: {
      members: {
        include: {
          user: true,
        },
      },
    },
  });

  const usersInGroup = groupWithMembers?.members.map((member) => member.user);
  return usersInGroup;
};

export const getUnjoinedGroups = async () => {
  const self = await getSelf();
  if (!self) {
    console.log("Unauthorised request");
    return [];
  }

  const unjoinedGroups = await db.group.findMany({
    where: {
      NOT: {
        members: {
          some: {
            userId: self?.id,
          },
        },
      },
    },
  });
  const requestedGroups = await getRequestedGroups();
  const requestedGroupIds = requestedGroups.map((requested) => requested.id);

  const filteredGroups = unjoinedGroups.filter(
    (group) => !requestedGroupIds.includes(group.id)
  );
  return filteredGroups;
};

export const getRequestedGroups = async () => {
  const self = await getSelf();
  if (!self) {
    console.log("Unauthorised request");
    return [];
  }

  const requestedGroups = await db.group.findMany({
    where: {
      joinRequests: {
        some: {
          requestSenderId: self?.id,
        },
      },
    },
  });

  return requestedGroups;
};
