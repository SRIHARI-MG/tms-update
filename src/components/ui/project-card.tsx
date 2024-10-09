import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Calendar,
  Code,
  FileText,
  PercentSquare,
  User2,
  Users,
} from "lucide-react";

interface ProjectCardProps {
  projectCode: string;
  projectName: string;
  projectDescription: string;
  startDate: string;
  estimatedEndDate: string;
  projectType: string;
  utilizationPercentage: number;
  projectStatus: string;
  projectOwner: string;
  projectOwnerProfile: string;
  projectManager: string;
  projectManagerProfile: string;
}

export default function ProjectCard({
  projectCode = "PROJ001",
  projectName = "Sample Project",
  projectDescription = "This is a sample project description.",
  startDate = "2024-01-01",
  estimatedEndDate = "2024-12-31",
  projectType = "Internal",
  utilizationPercentage = 75,
  projectStatus = "In Progress",
  projectOwner = "John Doe",
  projectOwnerProfile = "/placeholder.svg",
  projectManager = "Jane Smith",
  projectManagerProfile = "/placeholder.svg",
}: ProjectCardProps) {
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "inprogress":
        return "bg-blue-100 text-blue-800";
      case "completed":
        return "bg-green-100 text-green-800";
      case "onhold":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <Card className="w-full bg-background border-none max-w-2xl">
      <CardHeader className="flex flex-row items-start justify-between">
        <div>
          <CardTitle>{projectName}</CardTitle>
          <p className="text-sm text-muted-foreground">{projectCode}</p>
        </div>
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
            projectStatus
          )}`}
        >
          {projectStatus}
        </span>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div className="grid grid-cols-[20px_1fr] items-start gap-2">
          <FileText className="h-5 w-5 " />
          <p className="text-sm">{projectDescription}</p>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="grid grid-cols-[20px_1fr] items-center gap-2">
            <Calendar className="h-5 w-5" />
            <span className="text-sm">Start: {startDate}</span>
          </div>
          <div className="grid grid-cols-[20px_1fr] items-center gap-2">
            <Calendar className="h-5 w-5" />
            <span className="text-sm">End: {estimatedEndDate}</span>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="grid grid-cols-[20px_1fr] items-center gap-2">
            <Code className="h-5 w-5" />
            <span className="text-sm">{projectType}</span>
          </div>
          <div className="grid grid-cols-[20px_1fr] items-center gap-2">
            <PercentSquare className="h-5 w-5" />
            <span className="text-sm">
              Utilization: {utilizationPercentage}%
            </span>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center gap-2">
            <Avatar className="h-8 w-8">
              <AvatarImage src={projectOwnerProfile} alt={projectOwner} />
              <AvatarFallback>{projectOwner[0]}</AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-medium">Project Owner</p>
              <p className="text-xs text-muted-foreground">{projectOwner}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Avatar className="h-8 w-8">
              <AvatarImage src={projectManagerProfile} alt={projectManager} />
              <AvatarFallback>{projectManager[0]}</AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-medium">Project Manager</p>
              <p className="text-xs text-muted-foreground">{projectManager}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
