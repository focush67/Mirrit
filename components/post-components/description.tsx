import React from "react";

const Description = ({ text, size }: { text: string; size: string }) => {
  return (
    <div
      className={
        size === "small"
          ? "text-xs flex flex-col text-white mt-2"
          : "text-sm mt-2"
      }
    >
      {text}
    </div>
  );
};

export default Description;
