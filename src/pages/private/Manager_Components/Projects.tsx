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
import Loading from "@/components/ui/loading";
import * as XLSX from "xlsx";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import DatePicker from "@/components/ui/date-picker";

interface Project {
  projectId: string;
  projectCode: string;
  projectName: string;
  projectDescription: string;
  estimatedEndDate: string;
  projectType: string;
  startDate: string;
  utilizationPercentage: number;
  projectStatus: string;
  projectOwner: string;
  projectOwnerProfile: string;
  projectManager: string;
  projectManagerProfile: string;
}

const ProjectOnboarding = ({ onProjectAdded }: { onProjectAdded: () => void }) => {
  const [formData, setFormData] = useState({
    projectCode: '',
    projectName: '',
    subProject: [],
    projectType: '',
    startDate: null,
    estimatedEndDate: null,
  });
  const [open, setOpen] = useState(false);

  const handleInputChange = (name: string, value: string | string[] | Date | null) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await api.post('/api/v1/project/create', formData);
      if (response.data.success) {
        setOpen(false);
        onProjectAdded();
        // Reset form
        setFormData({
          projectCode: '',
          projectName: '',
          subProject: [],
          projectType: '',
          startDate: null,
          estimatedEndDate: null,
        });
      } else {
        console.error('Failed to create project:', response.data.message);
      }
    } catch (error) {
      console.error('Error creating project:', error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Add New Project</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Project</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="projectCode">Project Code</Label>
            <Input
              id="projectCode"
              value={formData.projectCode}
              onChange={(e) => handleInputChange('projectCode', e.target.value)}
              placeholder="Enter project code"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="projectName">Project Name</Label>
            <Input
              id="projectName"
              value={formData.projectName}
              onChange={(e) => handleInputChange('projectName', e.target.value)}
              placeholder="Enter project name"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="subProject">Sub Project</Label>
            <Select
              onValueChange={(value) => handleInputChange('subProject', value.split(','))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select sub projects" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="sub1,sub2,sub3">Sub 1, Sub 2, Sub 3</SelectItem>
                <SelectItem value="sub4,sub5">Sub 4, Sub 5</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="projectType">Project Type</Label>
            <Select onValueChange={(value) => handleInputChange('projectType', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select project type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Client">Client</SelectItem>
                <SelectItem value="Internal">Internal</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="startDate">Start Date</Label>
            <DatePicker
              id="startDate"
              selected={formData.startDate}
              onSelect={(date) => handleInputChange('startDate', date)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="estimatedEndDate">Estimated End Date</Label>
            <DatePicker
              id="estimatedEndDate"
              selected={formData.estimatedEndDate}
              onSelect={(date) => handleInputChange('estimatedEndDate', date)}
            />
          </div>
          <Button type="submit">Submit</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

const Projects = () => {
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
      const response = await api.get("/api/v1/project/get-all-projects-of-manager/MG180328");
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

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(filteredProjects.map(proj => ({
      "Project Code": proj.projectCode,
      "Project Name": proj.projectName,
      "Project Description": proj.projectDescription,
      "Start Date": proj.startDate,
      "Estimated End Date": proj.estimatedEndDate,
      "Project Type": proj.projectType,
      "Utilization Percentage": proj.utilizationPercentage,
      "Project Status": proj.projectStatus,
      "Project Owner": proj.projectOwner,
      "Project Manager": proj.projectManager,
    })));

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Projects");
    XLSX.writeFile(workbook, "projects.xlsx");
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
      header: "Sub Projects",
      accessor: "projectName",
      sortable: true,
      width: "25%",
    },
    {
      header: "Project Type",
      accessor: "projectType",
      sortable: true,
      width: "15%",
    },
    {
      header: "Project Manager",
      accessor: "projectName",
      sortable: true,
      width: "25%",
    },
    {
      header: "Project Owner",
      accessor: "projectName",
      sortable: true,
      width: "25%",
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
    return <Loading />;
  }

  return (
    <div className="">
      <h1 className="text-2xl font-semibold mb-5">Projects</h1>
      <div className="flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4 mb-4">
        <ProjectOnboarding onProjectAdded={fetchProjects} />
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
        <Button onClick={exportToExcel} className="w-fit sm:w-auto">
          Export
        </Button>
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

export default Projects;