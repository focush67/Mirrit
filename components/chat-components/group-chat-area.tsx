"use client";

import { pusherClient } from "@/utilities/pusher";
import { cn } from "@nextui-org/react";
import { GroupMessage, User } from "@prisma/client";
import { format } from "date-fns";
import React, { useEffect, useRef, useState } from "react";

interface ChatAreaProps {
  initialMessages: GroupMessage[];
  groupChannel: string;
  sessionId: string;
}

interface GroupResponse {
  sender: User;
  groupMessage: GroupMessage;
}

const GroupChatArea = ({
  initialMessages,
  groupChannel,
  sessionId,
}: ChatAreaProps) => {
  const scrollDownRef = useRef<HTMLDivElement | null>(null);
  const [messages, setMessages] = useState<GroupMessage[]>(initialMessages);

  useEffect(() => {
    pusherClient.subscribe(groupChannel);
    const messageHandler = (groupMessage: GroupResponse) => {
      console.log("New Messages have been received ", groupMessage);
      setMessages((prev: GroupMessage[]) => [
        groupMessage.groupMessage,
        ...prev,
      ]);
    };

    pusherClient.bind(`new-group-message`, messageHandler);

    return () => {
      pusherClient.unbind("new-group-message");
      pusherClient.unsubscribe(groupChannel);
    };
  }, [groupChannel]);

  const formatTimeStamp = (time: Date) => {
    return format(time, "HH:mm");
  };

  return (
    <div
      id="messages"
      className="flex flex-1 flex-col-reverse gap-4 p-3 overflow-y-auto scrollbar-thumb-blue scroll-bar-thumb-rounded scrollbar-track-blue-lighter scrollbar-w-2 scrolling-touch h-[62vh]"
    >
      <div ref={scrollDownRef} />
      {messages?.map((message, index) => {
        const isCurrentUser = message.senderId === sessionId;

        const hasNextMessageFromSameUser =
          messages[index - 1]?.senderId === messages[index].senderId;
        return (
          <div key={index} className="chat-message">
            <div
              className={cn("flex,items-end", {
                "justify-end": isCurrentUser,
              })}
            >
              <div
                className={cn(
                  "flex flex-col space-y-2 max-w-xs text-base mx-2",
                  {
                    "order-1 items-end ml-auto": isCurrentUser,
                    "order-2 items-start": !isCurrentUser,
                  }
                )}
              >
                <span
                  className={cn("px-4 py-2 rounded-lg inline-block", {
                    "bg-blue-600 text-white": isCurrentUser,
                    "bg-white text-black": !isCurrentUser,
                    "rounded-br-none":
                      !hasNextMessageFromSameUser && isCurrentUser,
                    "rounded-bl-none":
                      !hasNextMessageFromSameUser && !isCurrentUser,
                  })}
                >
                  {message.groupMessageContent}{" "}
                  <span className="ml-2 text-xs text-gray-400">
                    {formatTimeStamp(new Date(message?.createdAt))}
                  </span>
                </span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default GroupChatArea;
