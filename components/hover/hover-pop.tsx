import React, { ReactNode } from "react";
import { Tooltip, Button } from "@nextui-org/react";

export default function Hover({
  children,
  text,
}: {
  children: ReactNode;
  text: string;
}) {
  return (
    <Tooltip content={text} className="w-2">
      <Button>{children}</Button>
    </Tooltip>
  );
}
