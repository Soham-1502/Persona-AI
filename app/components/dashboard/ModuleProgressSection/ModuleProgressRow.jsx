"use client";

import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import {
  Mic,
  Users,
  GraduationCap,
  Brain
} from "lucide-react";

const moduleIcons = {
  "Confidence Coach": Mic,
  "Social Mentor": Users,
  "Micro-Learning": GraduationCap,
  "InQuizzo": Brain,
};

export default function ModuleProgressRow({ submodule, parentModule }) {
  const Icon = moduleIcons[parentModule.name];

  const isPending = submodule.progress === 0;
  const isCompleted = submodule.progress === 100;

  const status = isCompleted
    ? "Completed"
    : isPending
      ? "Pending"
      : "In Progress";

  const actionText = isCompleted
    ? "Review"
    : isPending
      ? "Start"
      : "Continue";

  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between border-2 border-muted rounded-lg px-4 py-3 gap-2 md:gap-0 md:py-4 hover:bg-muted/40 hover:shadow-md hover:shadow-black/20 transition-all duration-200 hover:border-ring cursor-pointer">

      {/* LEFT AREA: ICON + TITLES */}
      <div className="flex items-center gap-3 md:flex-col md:items-start md:gap-1 md:w-[220px]">
        <div className="flex items-center gap-3">
          <Icon className="w-6 h-6 text-muted-foreground shrink-0" />
          <p className="font-medium text-sm">{submodule.name}</p>
        </div>
        <span className="text-xs text-muted-foreground md:pl-9 hidden md:block">
          {parentModule.name}
        </span>
        {/* parent module name shown inline on mobile */}
        <span className="text-xs text-muted-foreground md:hidden">
          {parentModule.name}
        </span>
      </div>

      {/* CENTER: PROGRESS + % */}
      <div className="flex flex-row items-center gap-2 md:w-[200px]">
        <Progress value={submodule.progress} className="h-2 rounded-full flex-1" />
        <span className="text-xs text-muted-foreground shrink-0">{submodule.progress}%</span>
      </div>

      {/* BOTTOM on mobile / right on desktop: BADGE + BUTTON */}
      <div className="flex items-center justify-between md:contents">
        <Badge
          variant={isCompleted ? "default" : isPending ? "outline" : "secondary"}
          className="w-fit"
        >
          {status}
        </Badge>
        <Button
          variant={isCompleted ? "outline" : "default"}
          className="md:ml-4"
        >
          {actionText}
        </Button>
      </div>
    </div>
  );
}
