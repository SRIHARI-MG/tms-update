import React, { useEffect, useState } from "react";
import { format } from "date-fns";
import DynamicTable from "@/components/ui/custom-table";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Pencil, Trash2, Plus, ChevronsUpDown, Check } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { cn } from "@/lib/utils";
import api from "@/api/apiService";

interface ProjectMember {
  projectMemberId: string;
  projectId: string;
  subproject: string | null;
  employeeId: string;
  employeeName: string;
  projectMemberEmail: string;
  memberRoleOnProject: string;
  projectPriority: string;
  projectWorkingPercentage: number;
  activeEmployee: boolean;
  startDate: string;
  endDate: string;
  createdOn: string;
  updatedOn: string;
  primaryProject: boolean;
  remarks: string;
  movementReason: string | null;
}

interface Employee {
  value: string;
  label: string;
}

export default function ProjectMembers() {
  const [projectMembers, setProjectMembers] = useState<ProjectMember[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [editingMember, setEditingMember] = useState<ProjectMember | null>(
    null
  );
  const [isAddingMember, setIsAddingMember] = useState(false);
  const [newMember, setNewMember] = useState<Partial<ProjectMember>>({});
  const [emailValue, setEmailValue] = useState("");
  const [employees, setEmployees] = useState<Employee[]>([]);

  const fetchProjectMembers = async () => {
    try {
      setIsLoading(true);
      const response = await api.get(
        "/api/v1/project-member/getAllProjectMember/PROJ_3"
      );
      setProjectMembers(response.data.response.data);
    } catch (error) {
      console.error("Error fetching project members:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProjectMembers();
    // This is a placeholder. Replace with actual API call.
    setEmployees([
      { value: "employee1@example.com", label: "Employee 1" },
      { value: "employee2@example.com", label: "Employee 2" },
    ]);
  }, []);

  const handleDelete = async (id: string) => {
    if (
      window.confirm("Are you sure you want to delete this project member?")
    ) {
      try {
        await api.delete(`/api/v1/project-members/${id}`);
        setProjectMembers(
          projectMembers.filter((member) => member.projectMemberId !== id)
        );
      } catch (error) {
        console.error("Error deleting project member:", error);
      }
    }
  };

  const handleEdit = (member: ProjectMember) => {
    setEditingMember(member);
  };

  const handleUpdate = async (updatedMember: ProjectMember) => {
    try {
      await api.put(
        `/api/v1/project-members/${updatedMember.projectMemberId}`,
        updatedMember
      );
      setProjectMembers(
        projectMembers.map((member) =>
          member.projectMemberId === updatedMember.projectMemberId
            ? updatedMember
            : member
        )
      );
      setEditingMember(null);
    } catch (error) {
      console.error("Error updating project member:", error);
    }
  };

  const handleAddMember = async () => {
    try {
      const response = await api.post("/api/v1/project-members", newMember);
      setProjectMembers([...projectMembers, response.data]);
      setIsAddingMember(false);
      setNewMember({});
      setEmailValue("");
    } catch (error) {
      console.error("Error adding new project member:", error);
    }
  };

  const columns = [
    {
      header: "Employee Name",
      accessor: "employeeName",
      sortable: true,
      filterable: true,
      width: "15%",
    },
    {
      header: "Role",
      accessor: "memberRoleOnProject",
      sortable: true,
      filterable: true,
      width: "10%",
    },
    {
      header: "Email",
      accessor: "projectMemberEmail",
      sortable: true,
      filterable: true,
      width: "20%",
    },
    {
      header: "Sub Project",
      accessor: "subproject",
      sortable: true,
      filterable: true,
      width: "10%",
    },
    {
      header: "Priority",
      accessor: "projectPriority",
      sortable: true,
      filterable: true,
      width: "10%",
    },
    {
      header: "Working %",
      accessor: "projectWorkingPercentage",
      sortable: true,
      filterable: true,
      width: "10%",
    },
    {
      header: "Start Date",
      accessor: (item: ProjectMember) =>
        format(new Date(item.startDate), "yyyy-MM-dd"),
      sortable: true,
      filterable: true,
      width: "10%",
    },
    {
      header: "End Date",
      accessor: (item: ProjectMember) =>
        format(new Date(item.endDate), "yyyy-MM-dd"),
      sortable: true,
      filterable: true,
      width: "10%",
    },
  ];

  const actions = (item: ProjectMember) => (
    <div className="flex space-x-2">
      <Button variant="outline" size="icon" onClick={() => handleEdit(item)}>
        <Pencil className="h-4 w-4" />
      </Button>
      <Button
        variant="outline"
        size="icon"
        onClick={() => handleDelete(item.projectMemberId)}
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  );

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="">
      <div className="flex justify-between items-center mb-6">
        <Dialog open={isAddingMember} onOpenChange={setIsAddingMember}>
          <DialogTrigger asChild>
            <Button onClick={() => setIsAddingMember(true)}>
              <Plus className="mr-2 h-4 w-4" /> Add Member
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[725px]">
            <DialogHeader>
              <DialogTitle>Add New Project Member</DialogTitle>
            </DialogHeader>
            <div className="grid gap-6 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="newName" className="text-right">
                  Name
                </Label>
                <Input
                  id="newName"
                  value={newMember.employeeName || ""}
                  onChange={(e) =>
                    setNewMember({ ...newMember, employeeName: e.target.value })
                  }
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="newRole" className="text-right">
                  Role
                </Label>
                <Input
                  id="newRole"
                  value={newMember.memberRoleOnProject || ""}
                  onChange={(e) =>
                    setNewMember({
                      ...newMember,
                      memberRoleOnProject: e.target.value,
                    })
                  }
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="newEmail" className="text-right">
                  Email
                </Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      className="col-span-3 justify-between"
                    >
                      {emailValue
                        ? employees.find(
                            (employee) => employee.value === emailValue
                          )?.label
                        : "Select Email"}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-[300px] p-0">
                    <Command>
                      <CommandInput placeholder="Search Project Owner" />
                      <CommandEmpty>Email Not Found.</CommandEmpty>
                      <CommandGroup>
                        {employees.map((employee) => (
                          <CommandItem
                            key={employee.value}
                            value={employee.value}
                            onSelect={(currentValue) => {
                              setEmailValue(
                                currentValue === emailValue ? "" : currentValue
                              );
                              setNewMember({
                                ...newMember,
                                projectMemberEmail: currentValue,
                              });
                            }}
                          >
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4",
                                emailValue === employee.value
                                  ? "opacity-100"
                                  : "opacity-0"
                              )}
                            />
                            {employee.label}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </Command>
                  </PopoverContent>
                </Popover>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="newSubproject" className="text-right">
                  Sub Project
                </Label>
                <Input
                  id="newSubproject"
                  value={newMember.subproject || ""}
                  onChange={(e) =>
                    setNewMember({ ...newMember, subproject: e.target.value })
                  }
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="newPriority" className="text-right">
                  Priority
                </Label>
                <Select
                  onValueChange={(value) =>
                    setNewMember({ ...newMember, projectPriority: value })
                  }
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="LOW">Low</SelectItem>
                    <SelectItem value="MEDIUM">Medium</SelectItem>
                    <SelectItem value="HIGH">High</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="newPercentage" className="text-right">
                  Working %
                </Label>
                <Input
                  id="newPercentage"
                  type="number"
                  value={newMember.projectWorkingPercentage || ""}
                  onChange={(e) =>
                    setNewMember({
                      ...newMember,
                      projectWorkingPercentage: parseFloat(e.target.value),
                    })
                  }
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="newStartDate" className="text-right">
                  Start Date
                </Label>
                <Input
                  id="newStartDate"
                  type="date"
                  value={newMember.startDate || ""}
                  onChange={(e) =>
                    setNewMember({ ...newMember, startDate: e.target.value })
                  }
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="newEndDate" className="text-right">
                  End Date
                </Label>
                <Input
                  id="newEndDate"
                  type="date"
                  value={newMember.endDate || ""}
                  onChange={(e) =>
                    setNewMember({ ...newMember, endDate: e.target.value })
                  }
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="newRemarks" className="text-right">
                  Remarks
                </Label>
                <Input
                  id="newRemarks"
                  value={newMember.remarks || ""}
                  onChange={(e) =>
                    setNewMember({ ...newMember, remarks: e.target.value })
                  }
                  className="col-span-3"
                />
              </div>
            </div>
            <div className="flex justify-end">
              <Button onClick={handleAddMember}>Add Member</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
      <DynamicTable
        data={projectMembers}
        columns={columns}
        actions={actions}
        itemsPerPage={10}
      />
    </div>
  );
}
