import React, { useState, useEffect, useMemo } from "react";
import DynamicTable from "@/components/ui/custom-table";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { SearchInput } from "@/components/ui/search-input";
import api from "@/api/apiService";
import Loading from "@/components/ui/loading";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";

interface UserDetails {
  profileUrl?: string;
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  skills: string[];
  dateOfLeaving: string;
}

const OffboardEmployees = () => {
  const [employees, setEmployees] = useState<UserDetails[]>([]);
  const [filters, setFilters] = useState({
    role: "all",
    skill: "all",
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [isFetchingData, setIsFetchingData] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        setIsFetchingData(true);
        const response = await api(
          "/api/v1/admin/employee-list?isActive=false"
        );
        setEmployees(response.data.response.data);
        console.log("Offboarded Employees:", response.data.response.data);
      } catch (error) {
        console.error("Error fetching offboarded employee data:", error);
      } finally {
        setIsFetchingData(false);
      }
    };

    fetchEmployees();
  }, []);

  const filterOptions = useMemo(() => {
    return {
      roles: [...new Set(employees.map((emp) => emp.role).filter(Boolean))],
      skills: [
        ...new Set(employees.flatMap((emp) => emp.skills).filter(Boolean)),
      ],
    };
  }, [employees]);

  const filteredEmployees = useMemo(() => {
    return employees.filter((emp) => {
      const searchMatch =
        searchTerm === "" ||
        emp.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.userId.toLowerCase().includes(searchTerm.toLowerCase());

      return (
        searchMatch &&
        (filters.role === "all" || emp.role === filters.role) &&
        (filters.skill === "all" || emp.skills?.includes(filters.skill))
      );
    });
  }, [employees, filters, searchTerm]);

  const clearFilter = () => {
    setFilters({
      role: "all",
      skill: "all",
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
      header: "Employee",
      accessor: (employee: UserDetails) => (
        <div className="flex items-center space-x-3">
          <Avatar>
            <AvatarImage
              className="object-cover"
              src={employee.profileUrl}
              alt={`${employee.firstName} ${employee.lastName}`}
            />
            <AvatarFallback>
              {employee.firstName.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div>
            <div className="font-medium">{`${employee.firstName} ${employee.lastName}`}</div>
            <div className="text-sm text-gray-500">{employee.userId}</div>
          </div>
        </div>
      ),
      sortAccessor: (employee: UserDetails) =>
        `${employee.firstName} ${employee.lastName}`,
      sortable: true,
      filterable: true,
      width: "30%",
    },
    {
      header: "Role",
      accessor: "role",
      sortable: true,
      filterable: true,
      width: "20%",
    },
    {
      header: "Skills",
      accessor: (employee: UserDetails) => (
        <div className="flex flex-wrap gap-1">
          {employee?.skills?.map((skill, index) => (
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
      width: "30%",
    },
    {
      header: "Date of Leaving",
      accessor: (employee: UserDetails) => employee.dateOfLeaving,
      sortAccessor: (employee: UserDetails) => employee?.dateOfLeaving,
      sortable: true,
      width: "20%",
    },
  ];

  const handleViewEmployee = (employee: UserDetails) => {
    console.log("Viewing offboarded employee:", employee);
    navigate(`/hr/employee-hub/offboarded-employees/${employee.userId}`, {
      state: { employeeDetails: employee },
    });
  };

  if (isFetchingData) {
    return <Loading />;
  }

  return (
    <div className="pb-5">
      <h1 className="text-2xl font-semibold mb-4">Offboarded Employee List</h1>

      <div className="flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4 mb-4">
        <Button onClick={clearFilter} className="w-fit">
          Clear All Filters
        </Button>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                <SelectItem key={role} value={role as string}>
                  {role}
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
                <SelectItem key={skill} value={skill as string}>
                  {skill}
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
            className="w-full"
          />
        </div>
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

export default OffboardEmployees;
