"use client";

import { SparkleIcon } from "lucide-react";
import Link from "next/link";
import { Button } from "./ui/button";
import { useUserRole } from "@/hooks/useUserRole";

function DashboardBtn() {

  const {isCandidate, isLoading} = useUserRole();

  if (isLoading || isCandidate) return null;

  return (
    <Link href={"/dashboard"}>
        <Button className="gap-2 font-medium" size={"sm"}>
            <SparkleIcon className="size-4" />
            Dashboard
        </Button>
    </Link>
  )
}

export default DashboardBtn;