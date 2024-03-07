"use client";
import { Button } from "@nextui-org/react";
import React from "react";
import { useRouter } from "next/navigation";

const Error = () => {
  const router = useRouter();
  return (
    <div className="flex flex-col items-center justify-center space-y-4 mt-[10%]">
      <div className="m-auto space-y-5 text-center">
        <p className="text-5xl text-red-800 font-semibold">500</p>
        <p className="text-4xl font-semibold">
          Some Error Occured at Requests.
        </p>
        <p>Check Server Logs or Refresh</p>
      </div>
      <div>
        <Button
          variant="shadow"
          color="primary"
          size="lg"
          onClick={() => router.push("/")}
        >
          Go to Home
        </Button>
      </div>
    </div>
  );
};

export default Error;
