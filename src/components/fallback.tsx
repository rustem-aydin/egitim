"use client";
import { useRouter } from "next/navigation";
import React from "react";
import { Button } from "./ui/button";
import { ArrowLeft } from "lucide-react";

const Fallback = () => {
  const router = useRouter();

  return (
    <Button
      className="mb-2 hover:cursor-pointer"
      variant={"ghost"}
      onClick={() => router.back()}
    >
      <ArrowLeft />
      Geri Gön
    </Button>
  );
};

export default Fallback;
