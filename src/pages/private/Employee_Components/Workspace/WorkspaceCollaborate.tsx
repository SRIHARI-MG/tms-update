import React, { useEffect, useState, useMemo } from "react";
import DynamicTable from "@/components/ui/custom-table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import mailLogo from "@/assets/Mail.svg";
import teamsLogo from "@/assets/teams.svg";
import whatsappLogo from "@/assets/whatsapp.svg";
import api from "@/api/apiService";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import EmployeeCard from "@/components/ui/employee-card";
import { Search } from "lucide-react";

interface Employee {
  profileUrl: string;
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  mobileNumber: string;
  role: string;
  designation: string;
  branch: string;
  skills: string[];
  userProjects: string[];
  reportingManagerName: string;
}

const WorkspaceCollaborate = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [filters, setFilters] = useState({
    role: "all",
    designation: "all",
    skill: "all",
    branch: "all",
    project: "all",
  });
  const [isfetchingData, setIsFetchingData] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        setIsFetchingData(true);
        const response = await api.get(
          "/api/v1/admin/collaborate-employee-list"
        );
        setEmployees(response.data.response.data);
      } catch (error) {
        console.error("Error fetching employees:", error);
      } finally {
        setIsFetchingData(false);
      }
    };

    fetchEmployees();
  }, []);

  const filterOptions = useMemo(() => {
    return {
      roles: [...new Set(employees.map((emp) => emp.role))],
      designations: [...new Set(employees.map((emp) => emp.designation))],
      skills: [...new Set(employees.flatMap((emp) => emp.skills))],
      branches: [...new Set(employees.map((emp) => emp.branch))],
      projects: [...new Set(employees.flatMap((emp) => emp.userProjects))],
    };
  }, [employees]);

  const filteredEmployees = useMemo(() => {
    return employees.filter((emp) => {
      const searchMatch =
        searchTerm === "" ||
        emp.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.userId.toLowerCase().includes(searchTerm.toLowerCase());

      return (
        searchMatch &&
        (filters.role === "all" || emp.role === filters.role) &&
        (filters.designation === "all" ||
          emp.designation === filters.designation) &&
        (filters.skill === "all" || emp.skills.includes(filters.skill)) &&
        (filters.branch === "all" || emp.branch === filters.branch) &&
        (filters.project === "all" ||
          emp.userProjects.includes(filters.project))
      );
    });
  }, [employees, filters, searchTerm]);

  const clearFilter = () => {
    setFilters({
      role: "all",
      designation: "all",
      skill: "all",
      branch: "all",
      project: "all",
    });
    setSearchTerm("");
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleFilterChange = (
    filterType: keyof typeof filters,
    value: string
  ) => {
    setFilters((prev) => ({ ...prev, [filterType]: value }));
  };

  const columns = [
    {
      header: "Name",
      accessor: "firstName",
      sortable: true,
      filterable: true,
      width: "10%",
    },
    {
      header: "Role",
      accessor: "role",
      sortable: true,
      filterable: true,
      width: "10%",
    },
    {
      header: "Designation",
      accessor: "designation",
      sortable: true,
      filterable: true,
      width: "10%",
    },
    {
      header: "Skills",
      filterable: true,
      accessor: (item: Employee) => (
        <div className="flex flex-wrap gap-1">
          {item.skills.map((skill, index) => (
            <span
              key={index}
              className="bg-primary/20 text-primary text-xs px-2 py-1 rounded"
            >
              {skill}
            </span>
          ))}
        </div>
      ),
      width: "35%",
    },
    {
      header: "Contact",
      accessor: (item: Employee) => (
        <div className="flex space-x-2">
          <a href={`mailto:${item.email}`} title="Email">
            <img
              src={mailLogo}
              alt="Email Logo"
              className="w-5 h-5 text-gray-600 hover:text-primary"
            />
          </a>
          <a
            href={`https://teams.microsoft.com/l/chat/0/0?users=${item.email}`}
            target="_blank"
            rel="noopener noreferrer"
            title="Microsoft Teams"
          >
            <img
              src={teamsLogo}
              className="w-5 h-5 text-gray-600 hover:text-primary"
            />
          </a>
          <a
            href={`https://wa.me/${item.mobileNumber}`}
            target="_blank"
            rel="noopener noreferrer"
            title="WhatsApp"
          >
            <img
              src={whatsappLogo}
              className="w-5 h-5 text-gray-600 hover:text-primary"
            />
          </a>
        </div>
      ),
      width: "5%",
    },
  ];

  if (isfetchingData) {
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
    <div className="mx-auto">
      <h1 className="text-2xl font-bold mb-5">Employee Collaboration</h1>
      <div className="flex space-x-4 w-full mb-4 ">
        <div className="flex w-3/4 space-x-4">
          <Button onClick={clearFilter}>Clear All Filters</Button>
          <Select
            onValueChange={(value) => handleFilterChange("role", value)}
            value={filters.role}
          >
            <SelectTrigger>
              <SelectValue placeholder="Filter by Role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Roles</SelectItem>
              {filterOptions.roles.map((role) => (
                <SelectItem key={role} value={role}>
                  {role}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select
            onValueChange={(value) => handleFilterChange("designation", value)}
            value={filters.designation}
          >
            <SelectTrigger>
              <SelectValue placeholder="Filter by Designation" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Designations</SelectItem>
              {filterOptions.designations.map((designation) => (
                <SelectItem key={designation} value={designation}>
                  {designation}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select
            onValueChange={(value) => handleFilterChange("skill", value)}
            value={filters.skill}
          >
            <SelectTrigger>
              <SelectValue placeholder="Filter by Skill" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Skills</SelectItem>
              {filterOptions.skills.map((skill) => (
                <SelectItem key={skill} value={skill}>
                  {skill}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select
            onValueChange={(value) => handleFilterChange("branch", value)}
            value={filters.branch}
          >
            <SelectTrigger>
              <SelectValue placeholder="Filter by Branch" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Branches</SelectItem>
              {filterOptions.branches.map((branch) => (
                <SelectItem key={branch} value={branch}>
                  {branch}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select
            onValueChange={(value) => handleFilterChange("project", value)}
            value={filters.project}
          >
            <SelectTrigger>
              <SelectValue placeholder="Filter by Project" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Projects</SelectItem>
              {filterOptions.projects.map((project) => (
                <SelectItem key={project} value={project}>
                  {project}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="md:flex-grow">
          <div className="relative">
            <Input
              type="text"
              placeholder="Search by name or ID"
              value={searchTerm}
              onChange={handleSearchChange}
              className="pl-10"
            />
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={20}
            />
          </div>
        </div>
      </div>

      <DynamicTable
        data={filteredEmployees}
        columns={columns}
        itemsPerPage={10}
        onClickView={(employee) => (
          <EmployeeCard
            avatar={employee.profileUrl}
            employeeId={employee.userId}
            firstName={employee.firstName}
            lastName={employee.lastName}
            email={employee.email}
            role={employee.role}
            designation={employee.designation}
            branch={employee.branch}
          />
        )}
      />
    </div>
  );
};

export default WorkspaceCollaborate;
