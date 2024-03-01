"use client";

import React from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  Button,
  useDisclosure,
  Avatar,
  Card,
  CardBody,
} from "@nextui-org/react";
import { Group, User } from "@prisma/client";
import { format } from "date-fns";
import { CrownIcon, Menu } from "lucide-react";
import Link from "next/link";

interface GroupInfoProps {
  members: User[];
  group: Group;
  admin: User;
}

export default function GroupInfo({ members, group, admin }: GroupInfoProps) {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      <Button onPress={onOpen} size="sm" variant="ghost">
        <Menu />
      </Button>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalContent>
          <ModalHeader className="flex flex-col gap-1 justify-between">
            <div className="flex items-center gap-x-2">
              <Avatar src={group.groupCover} />
              <div>
                <h3>{group.name}</h3>
                <div className="text-xs flex items-center justify-between">
                  <div className="text-green-500">
                    Created by {admin.username}
                  </div>
                  <div className="ml-5 text-blue-700">
                    {format(new Date(group.createdAt), "dd-MM-yyyy HH:mm")}
                  </div>
                </div>
              </div>
            </div>
          </ModalHeader>
          <ModalBody>
            <p>{group.description}</p>
            <div className="overflow-y-auto max-h-48">
              <h4 className="text-center">Members</h4>
              <ul>
                {members.map((member, index) => (
                  <Link href={`/${member.username}`} key={index}>
                    <MemberCard key={index} member={member} admin={admin} />
                  </Link>
                ))}
              </ul>
            </div>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}

export const MemberCard = ({
  member,
  admin,
}: {
  member: User;
  admin: User;
}) => {
  return (
    <Card className="mt-2 mb-2">
      <CardBody className="flex flex-row items-center gap-x-2">
        <Avatar src={member?.imageUrl!} size="sm" />
        <div className="text-xs">{member.username}</div>
        {admin.username === member.username && (
          <CrownIcon className="h-5 w-5 ml-5" />
        )}
      </CardBody>
    </Card>
  );
};
