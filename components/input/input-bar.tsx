"use client";

import React from "react";
import { Input, Textarea } from "@nextui-org/react";

interface InputBarProps {
  presentComment: string;
  setPresentComment: (e: any) => void;
}

export default function InputBar({
  presentComment,
  setPresentComment,
}: InputBarProps) {
  return (
    <div className="w-full flex flex-col gap-4">
      <div className="flex w-full flex-wrap md:flex-nowrap mb-6 md:mb-0 gap-4 items-center">
        <Input
          type={"text"}
          label={"Add a comment"}
          value={presentComment}
          onChange={(e) => setPresentComment(e.target.value)}
        />
      </div>
    </div>
  );
}
