"use client";

import axios from "axios";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import React, { useState } from "react";
import Link from "next/link";

export default function UserProfile({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = React.use(params);
  
  const router = useRouter();
  return (
    <div className="flex flex-col gap-8 p-10 min-h-screen items-center justify-center">
      <h1 className="text-3xl font-bold">
        Profile
        <span className="bg-amber-700 text-black-700 p-2 ml-2 rounded">
          {id}
        </span>
      </h1>

      
    </div>
  );
}
