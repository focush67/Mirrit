"use client";
import { timeStamps } from "@/utilities/date-format";
import { pusherClient } from "@/utilities/pusher";
import { cn } from "@nextui-org/react";
import { Message, User } from "@prisma/client";
import { format } from "date-fns";
import React, { useEffect, useRef, useState } from "react";

interface ChatAreaProps {
  initialMessages: Message[];
  chatChannel: string;
  sessionId: string;
}

const ChatArea = ({
  initialMessages,
  chatChannel,
  sessionId,
}: ChatAreaProps) => {
  const scrollDownRef = useRef<HTMLDivElement | null>(null);
  const [messages, setMessages] = useState<Message[]>(initialMessages);

  useEffect(() => {
    pusherClient.subscribe(chatChannel);
    const messageHandler = (message: Message) => {
      console.log("New Messages have been received ", message);
      setMessages((prev: Message[]) => [message, ...prev]);
    };

    pusherClient.bind(`new-message`, messageHandler);

    return () => {
      pusherClient.unbind("new-message");
      pusherClient.unsubscribe(chatChannel);
    };
  }, [chatChannel]);

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
        const isCurrentUser = message.messageSenderId === sessionId;

        const hasNextMessageFromSameUser =
          messages[index - 1]?.messageSenderId ===
          messages[index].messageSenderId;
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
                  className={cn("px-4 text-sm py-2 rounded-lg inline-block", {
                    "bg-blue-600 ": isCurrentUser,
                    "bg-white text-black": !isCurrentUser,
                    "rounded-br-none":
                      !hasNextMessageFromSameUser && isCurrentUser,
                    "rounded-bl-none":
                      !hasNextMessageFromSameUser && !isCurrentUser,
                  })}
                >
                  {message.messageContent}{" "}
                  <span className="ml-2 text-xs">
                    <p className="text-green-950 font-bold">
                      {formatTimeStamp(new Date(message?.createdAt))}
                    </p>
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

export default ChatArea;
