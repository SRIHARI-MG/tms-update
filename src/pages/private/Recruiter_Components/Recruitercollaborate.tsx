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
import { SearchInput } from "@/components/ui/search-input";
import Loading from "@/components/ui/loading";

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
  primarySkills: string[];
  secondarySkills: string[];
  userProjects: string[];
  reportingManagerName: string;
}

const Recruitercollaborate = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [filters, setFilters] = useState({
    role: "all",
    designation: "all",
    primarySkill: "all",
    secondarySkill: "all",
    branch: "all",
    project: "all",
  });
  const [isfetchingData, setIsFetchingData] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const fetchEmployees = async () => {
    try {
      setIsFetchingData(true);
      const response = await api.get("/api/v1/admin/collaborate-employee-list");
      setEmployees(response.data.response.data);
    } catch (error) {
      console.error("Error fetching employees:", error);
    } finally {
      setIsFetchingData(false);
    }
  };
  useEffect(() => {
    fetchEmployees();
  }, []);

  const filterOptions = useMemo(() => {
    return {
      roles: [...new Set(employees.map((emp) => emp.role))],
      designations: [...new Set(employees.map((emp) => emp.designation))],
      primarySkills: [
        ...new Set(
          employees.flatMap((emp) => emp.primarySkills).filter(Boolean)
        ),
      ],
      secondarySkills: [
        ...new Set(
          employees.flatMap((emp) => emp.secondarySkills).filter(Boolean)
        ),
      ],
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
        (filters.primarySkill === "all" ||
          emp.primarySkills?.includes(filters.primarySkill)) &&
        (filters.secondarySkill === "all" ||
          emp.secondarySkills?.includes(filters.secondarySkill)) &&
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
      primarySkill: "all",
      secondarySkill: "all",
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
      header: "Primary Skills",
      accessor: (employee: Employee) => (
        <div className="flex flex-wrap gap-1">
          {employee?.primarySkills?.map((skill, index) => (
            <span
              key={index}
              className="bg-primary/20 text-primary text-xs px-2 py-1 rounded"
            >
              {skill}
            </span>
          ))}
        </div>
      ),
      filterable: true,
      width: "20%",
    },
    {
      header: "Secondary Skills",
      accessor: (employee: Employee) => (
        <div className="flex flex-wrap gap-1">
          {employee?.secondarySkills?.map((skill, index) => (
            <span
              key={index}
              className="bg-primary/20 text-primary text-xs px-2 py-1 rounded"
            >
              {skill}
            </span>
          ))}
        </div>
      ),
      filterable: true,
      width: "20%",
    },
    {
      header: "Contact",
      accessor: (item: Employee) => (
        <div className="flex space-x-2">
          <a href={`mailto:${item.email}`} title="Email">
            <img
              src={mailLogo}
              alt="Email Logo"
              className="w-6 h-6 text-gray-600 hover:text-primary"
              loading="lazy"
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
              className="w-6 h-6 text-gray-600 hover:text-primary"
              loading="lazy"
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
              className="w-6 h-6 text-gray-600 hover:text-primary"
              loading="lazy"
            />
          </a>
        </div>
      ),
      width: "5%",
    },
  ];

  if (isfetchingData) {
    return <Loading />;
  }

  return (
    <div className="pb-5">
      <h1 className="text-2xl font-semibold mb-5">Employee Collaboration</h1>
      <div className="flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4 mb-4">
        <Button onClick={clearFilter} className="w-fit">
          Clear All Filters
        </Button>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <Select
            onValueChange={(value) => handleFilterChange("role", value)}
            value={filters.role}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Filter by Role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Roles</SelectItem>
              {filterOptions.roles.map((role) => (
                <SelectItem key={role} value={role || "undefined"}>
                  {role || "Undefined"}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            onValueChange={(value) => handleFilterChange("designation", value)}
            value={filters.designation}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Filter by Designation" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Designations</SelectItem>
              {filterOptions.designations.map((designation) => (
                <SelectItem
                  key={designation}
                  value={designation || "undefined"}
                >
                  {designation || "Undefined"}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            onValueChange={(value) => handleFilterChange("primarySkill", value)}
            value={filters.primarySkill}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Filter by Primary Skill" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Primary Skills</SelectItem>
              {filterOptions.primarySkills.map((skill) => (
                <SelectItem key={skill} value={skill || "undefined"}>
                  {skill || "Undefined"}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            onValueChange={(value) =>
              handleFilterChange("secondarySkill", value)
            }
            value={filters.secondarySkill}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Filter by Secondary Skill" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Secondary Skills</SelectItem>
              {filterOptions.secondarySkills.map((skill) => (
                <SelectItem key={skill} value={skill || "undefined"}>
                  {skill || "Undefined"}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            onValueChange={(value) => handleFilterChange("branch", value)}
            value={filters.branch}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Filter by Branch" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Branches</SelectItem>
              {filterOptions.branches.map((branch) => (
                <SelectItem key={branch} value={branch || "undefined"}>
                  {branch || "Undefined"}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            onValueChange={(value) => handleFilterChange("project", value)}
            value={filters.project}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Filter by Project" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Projects</SelectItem>
              {filterOptions.projects.map((project) => (
                <SelectItem key={project} value={project || "undefined"}>
                  {project || "Undefined"}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="relative w-full sm:w-auto">
          <SearchInput
            type="text"
            placeholder="Search by name or ID"
            value={searchTerm}
            onChange={handleSearchChange}
            className=" w-full"
          />
        </div>
      </div>

      <div className="overflow-x-auto">
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
    </div>
  );
};

export default Recruitercollaborate;