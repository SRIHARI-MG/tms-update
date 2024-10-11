import React, { useEffect, useState, useMemo } from "react";
import DynamicTable from "@/components/ui/custom-table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import api from "@/api/apiService";
import { Button } from "@/components/ui/button";
import { useUser } from "@/layout/Header";
import ProjectCard from "@/components/ui/project-card";

interface Project {
  projectId: string;
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

const WorkspaceMyProjects = () => {
  const { userDetails } = useUser();
  const [projects, setProjects] = useState<Project[]>([]);
  const [filters, setFilters] = useState({
    projectType: "all",
    projectStatus: "all",
  });
  const [isFetchingData, setIsFetchingData] = useState(false);

  const fetchProjects = async () => {
    try {
      setIsFetchingData(true);
      const response = await api.get(
        `/api/v1/project/get-project-of-user/${userDetails?.userId}`
      );
      setProjects(response.data.response.data);
    } catch (error) {
      console.error("Error fetching projects:", error);
    } finally {
      setIsFetchingData(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, [userDetails?.userId]);

  const filterOptions = useMemo(() => {
    return {
      projectTypes: [...new Set(projects.map((proj) => proj.projectType))],
      projectStatuses: [...new Set(projects.map((proj) => proj.projectStatus))],
    };
  }, [projects]);

  const filteredProjects = useMemo(() => {
    return projects.filter((proj) => {
      return (
        (filters.projectType === "all" ||
          proj.projectType === filters.projectType) &&
        (filters.projectStatus === "all" ||
          proj.projectStatus === filters.projectStatus)
      );
    });
  }, [projects, filters]);

  const clearFilter = () => {
    setFilters({
      projectType: "all",
      projectStatus: "all",
    });
  };

  const handleFilterChange = (
    filterType: keyof typeof filters,
    value: string
  ) => {
    setFilters((prev) => ({ ...prev, [filterType]: value }));
  };

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

  const columns = [
    {
      header: "Project Code",
      accessor: "projectCode",
      sortable: true,
      width: "15%",
    },
    {
      header: "Project Name",
      accessor: "projectName",
      sortable: true,
      width: "25%",
    },
    {
      header: "Start Date",
      accessor: "startDate",
      sortable: true,
      width: "15%",
    },
    {
      header: "Project Type",
      accessor: "projectType",
      sortable: true,
      width: "15%",
    },
    {
      header: "Utilization %",
      accessor: "utilizationPercentage",
      sortable: true,
      width: "15%",
    },
    {
      header: "Status",
      accessor: (item: Project) => (
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
            item.projectStatus
          )}`}
        >
          {item.projectStatus}
        </span>
      ),
      sortable: true,
      width: "15%",
    },
  ];

  if (isFetchingData) {
    return (
      <div className="flex h-full justify-center items-center space-x-4">
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="w-8 h-8 sm:w-8 sm:h-8 rounded-full bg-primary/20"
          >
            <div className="w-full h-full rounded-full bg-primary animate-ping" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="">
      <h1 className="text-2xl font-semibold mb-5">My Projects</h1>
      <div className="flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4 mb-4">
        <Button onClick={clearFilter} className="w-fit sm:w-auto">
          Clear All Filters
        </Button>
        <Select
          onValueChange={(value) => handleFilterChange("projectType", value)}
          value={filters.projectType}
        >
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="Filter by Project Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            {filterOptions.projectTypes.map((type) => (
              <SelectItem key={type} value={type}>
                {type}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select
          onValueChange={(value) => handleFilterChange("projectStatus", value)}
          value={filters.projectStatus}
        >
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="Filter by Project Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            {filterOptions.projectStatuses.map((status) => (
              <SelectItem key={status} value={status}>
                {status}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="overflow-x-auto">
        <DynamicTable
          data={filteredProjects}
          columns={columns}
          itemsPerPage={10}
          onClickView={(project) => (
            <ProjectCard
              projectCode={project.projectCode}
              projectName={project.projectName}
              projectDescription={project.projectDescription}
              startDate={project.startDate}
              estimatedEndDate={project.estimatedEndDate}
              projectType={project.projectType}
              utilizationPercentage={project.utilizationPercentage}
              projectStatus={project.projectStatus}
              projectOwner={project.projectOwner}
              projectOwnerProfile={project.projectOwnerProfile}
              projectManager={project.projectManager}
              projectManagerProfile={project.projectManagerProfile}
            />
          )}
        />
      </div>
    </div>
  );
};

export default WorkspaceMyProjects;
