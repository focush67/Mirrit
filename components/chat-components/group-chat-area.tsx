"use client";

import { pusherClient } from "@/utilities/pusher";
import { Avatar, cn } from "@nextui-org/react";
import { GroupMessage, User } from "@prisma/client";
import { format } from "date-fns";
import React, { useEffect, useRef, useState } from "react";

type GroupChatMessage = GroupMessage & { sender: User };

interface ChatAreaProps {
  initialMessages: GroupChatMessage[];
  groupChannel: string;
  sessionId: string;
}
const GroupChatArea = ({
  initialMessages,
  groupChannel,
  sessionId,
}: ChatAreaProps) => {
  const scrollDownRef = useRef<HTMLDivElement | null>(null);
  const [messages, setMessages] = useState<GroupChatMessage[]>(initialMessages);

  useEffect(() => {
    console.log("subscribing to channel for gp chat ", groupChannel);
    pusherClient.subscribe(groupChannel);
    const messageHandler = (groupMessage: GroupChatMessage) => {
      console.log("New Messages have been received ", groupMessage);
      setMessages((prev: GroupChatMessage[]) => [groupMessage, ...prev]);
    };

    pusherClient.bind(`new-group-message`, messageHandler);

    return () => {
      console.log("Messages before unmounting: ", messages);
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
        const isCurrentUser = message?.senderId === sessionId;

        const hasNextMessageFromSameUser =
          messages[index - 1]?.senderId === messages[index]?.senderId;
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
                  <div className="flex gap-x-3 items-center">
                    <Avatar src={message?.sender?.imageUrl!} size="sm" />
                    {message?.groupMessageContent}{" "}
                  </div>

                  <span className="flex justify-end text-xs text-gray-400">
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
