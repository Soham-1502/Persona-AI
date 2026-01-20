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
    <div
      className="
      flex items-center justify-between 
      border-2 border-muted rounded-lg px-4 py-4 
      hover:bg-muted/40 hover:shadow-md hover:shadow-black/20 transition-all duration-200 hover:border-ring hover:border-2
      cursor-pointer
      
    "
    >
      {/* LEFT AREA: ICON + TITLES */}
      <div className="flex flex-col gap-1 w-[220px]">
        <div className="flex items-center gap-3">
          <Icon className="w-6 h-6 text-muted-foreground" />
          <p className="font-medium text-sm">{submodule.name}</p>
        </div>
        <span className="text-xs text-muted-foreground pl-9">
          {parentModule.name}
        </span>
      </div>

      {/* CENTER: PROGRESS + % */}
      <div className="flex flex-row items-center w-[200px] gap-2">
        <Progress value={submodule.progress} className="h-2 rounded-full" />
        <span className="text-xs text-muted-foreground">{submodule.progress}%</span>
      </div>

      {/* STATUS BADGE */}
      <Badge
        variant={isCompleted ? "default" : isPending ? "outline" : "secondary"}
        className="w-fit"
      >
        {status}
      </Badge>

      {/* ACTION BUTTON */}
      <Button
        variant={isCompleted ? "outline" : "default"}
        className="ml-4"
      >
        {actionText}
      </Button>
    </div>
  );
}
