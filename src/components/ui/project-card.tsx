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
    <Card className="w-full max-w-md bg-background border-none overflow-hidden">
      <CardHeader className="p-6 pb-3">
        <div className="flex justify-between gap-3 items-start">
          <div>
            <CardTitle className="text-lg font-semibold">
              {projectName}
            </CardTitle>
            <p className="text-sm text-muted-foreground mt-1">{projectCode}</p>
          </div>
          <span
            className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
              projectStatus
            )}`}
          >
            {projectStatus}
          </span>
        </div>
      </CardHeader>
      <CardContent className="p-6 pt-3 max-h-[70vh] overflow-y-auto">
        <div className="space-y-5">
          <div className="flex gap-3 items-start">
            <FileText className="h-5 w-5 mt-1 flex-shrink-0" />
            <p className="text-sm">{projectDescription}</p>
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              <span>Start: {startDate}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              <span>End: {estimatedEndDate}</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="flex items-center gap-2">
              <Code className="h-5 w-5" />
              <span>{projectType}</span>
            </div>
            <div className="flex items-center gap-2">
              <PercentSquare className="h-5 w-5" />
              <span>{utilizationPercentage}% Utilized</span>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Avatar className="h-8 w-8">
                <AvatarImage
                  className="object-cover"
                  src={projectOwnerProfile}
                  alt={projectOwner}
                />
                <AvatarFallback>{projectOwner[0]}</AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-medium">Project Owner</p>
                <p className="text-sm text-muted-foreground">{projectOwner}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Avatar className="h-8 w-8">
                <AvatarImage
                  className="object-cover"
                  src={projectManagerProfile}
                  alt={projectManager}
                />
                <AvatarFallback>{projectManager[0]}</AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-medium">Project Manager</p>
                <p className="text-sm text-muted-foreground">
                  {projectManager}
                </p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
