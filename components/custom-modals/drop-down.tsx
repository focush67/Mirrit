"use client";
import React from "react";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Button,
} from "@nextui-org/react";
import { LucideMenu } from "lucide-react";
import DeleteModal from "./delete-post-modal";
import EditModal from "./edit-post-modal";
import { Post, User } from "@prisma/client";

interface DropDownProps {
  post: Post & { owner: User };
}

export default function DropDown({ post }: DropDownProps) {
  return (
    <Dropdown>
      <DropdownTrigger>
        <Button variant="bordered" size="sm" className="rounded-full">
          <LucideMenu />
        </Button>
      </DropdownTrigger>
      <DropdownMenu
        aria-label="Action event example"
        onClick={(e) => e.stopPropagation()}
      >
        <DropdownItem key="delete">
          <DeleteModal post={post} />
        </DropdownItem>
        <DropdownItem key="edit">
          <EditModal post={post} />
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
}
