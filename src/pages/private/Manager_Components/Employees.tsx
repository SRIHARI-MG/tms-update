import React, { useEffect, useState, useMemo } from "react";
import DynamicTable from "@/components/ui/custom-table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
// import mailLogo from "@/assets/Mail.svg";
// import teamsLogo from "@/assets/teams.svg";
// import whatsappLogo from "@/assets/whatsapp.svg";
import api from "@/api/apiService";
import { Button } from "@/components/ui/button";
import EmployeeCard from "@/components/ui/employee-card";
import { SearchInput } from "@/components/ui/search-input";
import Loading from "@/components/ui/loading";
import * as XLSX from "xlsx";
import { useNavigate } from "react-router-dom";

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

interface UserDetails {
  profileUrl?: string;
  userId: string;
  firstName: string;
  lastName: string;
  personalEmail: string;
  email: string;
  countryCode: string;
  mobileNumber: string;
  gender: string;
  bloodGroup: string;
  dateOfBirth: string;
  alternateMobileNumber: string;
  alternateMobileNumberCountryCode: string;
  emergencyContactPersonName: string;
  emergencyContactMobileNumber: string;
  emergencyContactMobileNumberCountryCode: string;
  department: string;
  role: string;
  designation: string;
  employmentType: string;
  internshipDuration?: string;
  internshipEndDate?: string;
  shiftTiming: string;
  branch: string;
  dateOfJoining: string;
  dateOfLeaving: string | null;
  lastLogin: string;
  offboardingReason: string | null;
  finalInteractionPdfName: string | null;
  finalInteractionPdfUrl: string | null;
  revokeReason: string | null;
  reportingManagerId: string;
  reportingMangerName: string;
  reportingManagerEmail: string;
  skills: string[];
  userRole: string | null;
  currentAddressLine1: string;
  currentAddressLine2: string;
  currentAddressLandmark: string;
  currentAddressNationality: string;
  currentAddressZipcode: string;
  currentAddressState: string;
  currentAddressDistrict: string;
  permanentAddressLine1: string;
  permanentAddressLine2: string;
  permanentAddressLandmark: string;
  permanentAddressNationality: string;
  permanentAddressZipcode: string;
  permanentAddressState: string;
  permanentAddressDistrict: string;
  userProjects: any[]; // You might want to define a more specific type for projects
  bankDetail: BankDetail;
  active: boolean;
  willingToTravel: boolean;
  superAdmin: boolean;
  reportingManager: boolean;
}

const Employees = () => {
  const navigate = useNavigate();
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

  //export
  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(
      filteredEmployees.map((emp) => ({
        "First Name": emp.firstName,
        Role: emp.role,
        Designation: emp.designation,
        Skills: emp.skills.join(", "),
        Branch: emp.branch,
      }))
    );

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Employees");

    XLSX.writeFile(workbook, "employees.xlsx");
  };

  // Update handleExport to only call exportToExcel
  const handleExport = () => {
    exportToExcel();
  };

  const columns = [
    {
      header: "Employee",
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
          {item.skills?.map((skill, index) => (
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
      header: "Branch",
      accessor: "branch",
      sortable: true,
      filterable: true,
      width: "10%",
    },
    // {
    //   header: "Contact",
    //   accessor: (item: Employee) => (
    //     <div className="flex space-x-2">
    //       <a href={`mailto:${item.email}`} title="Email">
    //         <img
    //           src={mailLogo}
    //           alt="Email Logo"
    //           className="w-5 h-5 text-gray-600 hover:text-primary"
    //           loading="lazy"
    //         />
    //       </a>
    //       <a
    //         href={`https://teams.microsoft.com/l/chat/0/0?users=${item.email}`}
    //         target="_blank"
    //         rel="noopener noreferrer"
    //         title="Microsoft Teams"
    //       >
    //         <img
    //           src={teamsLogo}
    //           className="w-5 h-5 text-gray-600 hover:text-primary"
    //           loading="lazy"
    //         />
    //       </a>
    //       <a
    //         href={`https://wa.me/${item.mobileNumber}`}
    //         target="_blank"
    //         rel="noopener noreferrer"
    //         title="WhatsApp"
    //       >
    //         <img
    //           src={whatsappLogo}
    //           className="w-5 h-5 text-gray-600 hover:text-primary"
    //           loading="lazy"
    //         />
    //       </a>
    //     </div>
    //   ),
    //   width: "5%",
    // },
  ];

  if (isfetchingData) {
    return <Loading />;
  }

  const handleViewEmployee = (employee: Employee) => {
    console.log("Viewing employee:", employee);
    navigate(`/manager/Employees/${employee.userId}`, {
      state: { employeeDetails: employee },
    });
  };

  return (
    <div className="pb-5">
      <h1 className="text-2xl font-semibold mb-5">Employee List</h1>
      <div className="flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4 mb-4">
        <Button onClick={clearFilter} className="w-fit">
          Clear All Filters
        </Button>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
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
            <SelectTrigger className="w-full">
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
            <SelectTrigger className="w-full">
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
            <SelectTrigger className="w-full">
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
            <SelectTrigger className="w-full">
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

        <div className="relative w-full sm:w-auto">
          <SearchInput
            type="text"
            placeholder="Search by name or ID"
            value={searchTerm}
            onChange={handleSearchChange}
            className=" w-full"
          />
        </div>
        <Button onClick={handleExport} className="mr-2">
          Export
        </Button>
      </div>

      <div className="overflow-x-auto">
        <DynamicTable
          data={filteredEmployees}
          columns={columns}
          itemsPerPage={10}
          onClickNavigate={handleViewEmployee}
        />
      </div>
    </div>
  );
};

export default Employees;
