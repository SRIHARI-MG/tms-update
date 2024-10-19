import React, { useEffect, useState } from "react"
import { format } from "date-fns"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Pencil, Trash2 } from "lucide-react"
import api from "@/api/apiService"

interface ProjectMember {
  projectMemberId: string
  projectId: string
  subProject: string | null
  employeeId: string
  employeeName: string
  projectMemberEmail: string
  memberRoleOnProject: string
  projectPriority: string
  projectWorkingPercentage: number
  activeEmployee: boolean
  startDate: string
  endDate: string
  createdOn: string
  updatedOn: string
  primaryProject: boolean
  remarks: string
  movementReason: string | null
}

export default function ProjectMembers() {
  const [projectMembers, setProjectMembers] = useState<ProjectMember[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [editingMember, setEditingMember] = useState<ProjectMember | null>(null)

  const fetchProjectMembers = async () => {
    try {
      setIsLoading(true)
      const response = await api.get("/api/v1/project-member/getAllProjectMember/PROJ_3")
      setProjectMembers(response.data.response.data)
    } catch (error) {
      console.error("Error fetching project members:", error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchProjectMembers()
  }, [])

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this project member?")) {
      try {
        await api.delete(`/api/v1/project-members/${id}`)
        setProjectMembers(projectMembers.filter(member => member.projectMemberId !== id))
      } catch (error) {
        console.error("Error deleting project member:", error)
      }
    }
  }

  const handleEdit = (member: ProjectMember) => {
    setEditingMember(member)
  }

  const handleUpdate = async (updatedMember: ProjectMember) => {
    try {
      await api.put(`/api/v1/project-members/${updatedMember.projectMemberId}`, updatedMember)
      setProjectMembers(projectMembers.map(member => 
        member.projectMemberId === updatedMember.projectMemberId ? updatedMember : member
      ))
      setEditingMember(null)
    } catch (error) {
      console.error("Error updating project member:", error)
    }
  }

  if (isLoading) {
    return <div>Loading...</div>
  }

  return (
    <div className="container mx-auto max-w-screen-xl px-10 py-12">
      <h1 className="text-2xl font-semibold mb-6">Project Members</h1>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Employee Name</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Project Priority</TableHead>
            <TableHead>Working %</TableHead>
            <TableHead>Start Date</TableHead>
            <TableHead>End Date</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {projectMembers.map((member) => (
            <TableRow key={member.projectMemberId}>
              <TableCell>{member.employeeName}</TableCell>
              <TableCell>{member.memberRoleOnProject}</TableCell>
              <TableCell>{member.projectMemberEmail}</TableCell>
              <TableCell>{member.projectPriority}</TableCell>
              <TableCell>{member.projectWorkingPercentage}%</TableCell>
              <TableCell>{format(new Date(member.startDate), 'yyyy-MM-dd')}</TableCell>
              <TableCell>{format(new Date(member.endDate), 'yyyy-MM-dd')}</TableCell>
              <TableCell>
                <div className="flex space-x-2">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="icon" onClick={() => handleEdit(member)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[725px]">
                      <DialogHeader>
                        <DialogTitle>Edit Project Member</DialogTitle>
                      </DialogHeader>
                      <div className="grid gap-8 py-8">
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="name" className="text-right">
                            Name
                          </Label>
                          <Input
                            id="name"
                            value={editingMember?.employeeName}
                            onChange={(e) => setEditingMember({ ...editingMember!, employeeName: e.target.value })}
                            className="col-span-3"
                          />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="role" className="text-right">
                            Role
                          </Label>
                          <Input
                            id="role"
                            value={editingMember?.memberRoleOnProject}
                            onChange={(e) => setEditingMember({ ...editingMember!, memberRoleOnProject: e.target.value })}
                            className="w-full"
                          />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="email" className="text-right">
                            Email
                          </Label>
                          <Input
                            id="email"
                            value={editingMember?.projectMemberEmail}
                            onChange={(e) => setEditingMember({ ...editingMember!, projectMemberEmail: e.target.value })}
                            className="col-span-3"
                          />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="priority" className="text-right">
                            Priority
                          </Label>
                          <Select
                            onValueChange={(value) => setEditingMember({ ...editingMember!, projectPriority: value })}
                            defaultValue={editingMember?.projectPriority}
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
                          <Label htmlFor="percentage" className="text-right">
                            Working %
                          </Label>
                          <Input
                            id="percentage"
                            type="number"
                            value={editingMember?.projectWorkingPercentage}
                            onChange={(e) => setEditingMember({ ...editingMember!, projectWorkingPercentage: parseFloat(e.target.value) })}
                            className="col-span-3"
                          />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="startDate" className="text-right">
                            Start Date
                          </Label>
                          <Input
                            id="startDate"
                            type="date"
                            value={editingMember?.startDate}
                            onChange={(e) => setEditingMember({ ...editingMember!, startDate: e.target.value })}
                            className="col-span-3"
                          />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="endDate" className="text-right">
                            End Date
                          </Label>
                          <Input
                            id="endDate"
                            type="date"
                            value={editingMember?.endDate}
                            onChange={(e) => setEditingMember({ ...editingMember!, endDate: e.target.value })}
                            className="col-span-3"
                          />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="active" className="text-right">
                            Active
                          </Label>
                          <Checkbox
                            id="active"
                            checked={editingMember?.activeEmployee}
                            onCheckedChange={(checked) => setEditingMember({ ...editingMember!, activeEmployee: checked as boolean })}
                          />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="primary" className="text-right">
                            Primary Project
                          </Label>
                          <Checkbox
                            id="primary"
                            checked={editingMember?.primaryProject}
                            onCheckedChange={(checked) => setEditingMember({ ...editingMember!, primaryProject: checked as boolean })}
                          />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="remarks" className="text-right">
                            Remarks
                          </Label>
                          <Input
                            id="remarks"
                            value={editingMember?.remarks}
                            onChange={(e) => setEditingMember({ ...editingMember!, remarks: e.target.value })}
                            className="col-span-3"
                          />
                        </div>
                      </div>
                      <div className="flex justify-end">
                        <Button onClick={() => handleUpdate(editingMember!)}>Save changes</Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                  <Button variant="outline" size="icon" onClick={() => handleDelete(member.projectMemberId)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}