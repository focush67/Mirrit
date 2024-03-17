"use client";

import React, { useRef, useState, useTransition } from "react";
import { Button } from "@nextui-org/react";
import ReactTextareaAutosize from "react-textarea-autosize";
import { onSendGroupMessage } from "@/server_actions/group";
import toast from "react-hot-toast";
interface GroupChatInputProps {
  groupId: string;
}
const GroupChatInput = ({ groupId }: GroupChatInputProps) => {
  const [input, setInput] = useState("");
  const [isPending, startTransition] = useTransition();
  const textAreaRef = useRef<HTMLTextAreaElement | null>(null);
  const sendMessage = () => {
    startTransition(() => {
      onSendGroupMessage({ content: input, groupId: groupId })
        .then((data) => {
          toast.success("Message sent to group");
          console.log(data);
        })
        .catch((error: any) => {
          toast.error("Error sending message to group");
          console.log(error.message);
        })
        .finally(() => {
          setInput("");
        });
    });
  };
  return (
    <div className="px-4 pt-4 mb-2 sm:mb-0">
      <div className="relative flex-1 overflow-hidden rounded-lg shadow-sm ring-inset ring-1 ">
        <ReactTextareaAutosize
          ref={textAreaRef}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              sendMessage();
            }
          }}
          rows={1}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={`Message`}
          className="block w-full resize-none border-0 bg-transparent  placeholder:text-gray-400 p-2 sm:py-1.5 sm:text-sm sm:leading-6"
        />

        <div
          className="py-2"
          aria-hidden="true"
          onClick={() => textAreaRef?.current?.focus()}
        >
          <div className="py-px">
            <div className="h-9" />
          </div>
        </div>

        <div className="absolute right-0 bottom-0 flex justify-between py-2 pl-3 pr-2">
          <div className="flex-shrink-0">
            <Button
              onClick={sendMessage}
              type="submit"
              isLoading={isPending}
              variant={isPending ? "ghost" : "shadow"}
              color={isPending ? "default" : "primary"}
            >
              Post
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GroupChatInput;
