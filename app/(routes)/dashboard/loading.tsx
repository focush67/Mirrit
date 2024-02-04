"use client";

import React from "react";
import { Skeleton } from "@nextui-org/react";

export default function DashboardLoading() {
  return (
    <div className="max-w-[300px] w-full flex flex-col items-center gap-3 justify-center">
      <div className="flex items-center justify-center">
        <Skeleton className="flex rounded-full w-12 h-12" />
      </div>
      <div className="w-full flex flex-col gap-2">
        <Skeleton className="h-3 w-3/5 rounded-lg" />
        <Skeleton className="h-3 w-4/5 rounded-lg" />
      </div>
    </div>
  );
}
