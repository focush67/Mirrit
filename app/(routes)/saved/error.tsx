"use client";
import { Button } from "@nextui-org/react";
import { Bug } from "lucide-react";
import React from "react";
import { useRouter } from "next/navigation";

const ErrorAtSaved = () => {
  const router = useRouter();
  return (
    <div className="flex flex-col items-center justify-center space-y-4 mt-[10%]">
      <div className="m-auto space-y-5 text-center">
        <div className="text-5xl text-red-800 font-semibold flex items-center justify-center">
          <Bug className="h-10 w-10" />
        </div>
        <p className="text-4xl font-semibold">Some Error Occured at Saved</p>
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

export default ErrorAtSaved;
