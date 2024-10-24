import React, { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { CalendarIcon, PencilIcon } from "lucide-react"
import Projectmembers from "./Projectmembers"

interface Project {
  projectId: string
  projectCode: string
  projectName: string
  subproject: string
  projectDescription: string
  startDate: string
  estimatedEndDate: string
  createdOn: string
  projectType: string
  projectStatus: string
  active: boolean
  projectOwner: string
  projectManager: string
  projectOwnerProfile: string
  projectOwnerUserId: string
  projectOwnerName: string | null
  projectManagerProfile: string
  projectManagerUserId: string
  projectManagerName: string | null
}

const dummyProject: Project = {
  projectId: "PROJ_3",
  projectCode: "MG-HRMS-001",
  subproject: "sub",
  projectName: "Talent Management System",
  projectDescription: "A comprehensive system for managing talent within the organization",
  startDate: "2024-01-13",
  estimatedEndDate: "2024-03-31",
  createdOn: "2024-01-14",
  projectType: "Client",
  projectStatus: "INPROGRESS",
  active: true,
  projectOwner: "sreenivasan.m@mind-graph.com",
  projectManager: "jayaraman.r@mind-graph.com",
  projectOwnerProfile: "https://mginterns.blob.core.windows.net/talent-mgmt-be/User40?sp=r&st=2024-06-11T11:14:28Z&se=2030-06-11T19:14:28Z&spr=https&sv=2022-11-02&sr=c&sig=Ckq%2FnHUeWFvdftxecO6saqUf7HJ4MzCCn39mrh%2BunRY%3D",
  projectOwnerUserId: "MG180328",
  projectOwnerName: "Sreenivasan M",
  projectManagerProfile: "https://mginterns.blob.core.windows.net/talent-mgmt-be/User180330?sp=r&st=2024-06-11T11:14:28Z&se=2030-06-11T19:14:28Z&spr=https&sv=2022-11-02&sr=c&sig=Ckq%2FnHUeWFvdftxecO6saqUf7HJ4MzCCn39mrh%2BunRY%3D",
  projectManagerUserId: "MG180330",
  projectManagerName: "Jayaraman R",
}

export default function Project_details() {
  const [project, setProject] = useState<Project>(dummyProject)
  const [isEditing, setIsEditing] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' } | null>(null)

  useEffect(() => {
    fetchProjectDetails()
  }, [])

  const fetchProjectDetails = async () => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/projects/PROJ_3')
      if (!response.ok) {
        throw new Error('Failed to fetch project details')
      }
      const data = await response.json()
      setProject(data)
    } catch (error) {
      console.error('Error fetching project details:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setProject(prev => ({ ...prev, [name]: value }))
  }

  const handleSwitchChange = async (checked: boolean) => {
    try {
      const response = await fetch(`/api/projects/${project.projectId}/toggle-active`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ active: checked }),
      })

      if (!response.ok) {
        throw new Error('Failed to update project status')
      }

      setProject(prev => ({ ...prev, active: checked }))
      setNotification({ message: `Project ${checked ? 'activated' : 'deactivated'} successfully.`, type: 'success' })
    } catch (error) {
      console.error('Error updating project status:', error)
      setNotification({ message: "Failed to update project status. Please try again.", type: 'error' })
    }
  }

  const handleSave = async () => {
    try {
      const response = await fetch(`/api/projects/${project.projectId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(project),
      })

      if (!response.ok) {
        throw new Error('Failed to update project')
      }

      const updatedProject = await response.json()
      setProject(updatedProject)
      setIsEditing(false)
      setNotification({ message: "Project updated successfully.", type: 'success' })
    } catch (error) {
      console.error('Error updating project:', error)
      setNotification({ message: "Failed to update project. Please try again.", type: 'error' })
    }
  }

  if (isLoading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>
  }

  return (
    <div className="container mx-auto p-4">
      {notification && (
        <div className={`mb-4 p-4 rounded ${notification.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
          {notification.message}
        </div>
      )}
      <Card className="w-full max-w-6xl mx-auto">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-2xl font-bold">{project.projectName}</CardTitle>
        </CardHeader>
        <CardContent>
       
          <Tabs defaultValue="project" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="project">Project Details</TabsTrigger>
              <TabsTrigger value="members">Project Members</TabsTrigger>
            </TabsList>
            <TabsContent value="project">
            <Button onClick={() => setIsEditing(!isEditing)} variant="outline" size="icon">
            <PencilIcon className="h-4 w-4" />
          </Button>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="projectId">Project ID</Label>
                    <Input
                      id="projectId"
                      name="projectId"
                      value={project.projectId}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="projectCode">Project Code</Label>
                    <Input
                      id="projectCode"
                      name="projectCode"
                      value={project.projectCode}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="projectType">Sub Project</Label>
                    <Input
                      id="subproject"
                      name="subproject"
                      value={project.subproject}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="projectType">Project Type</Label>
                    <Input
                      id="projectType"
                      name="projectType"
                      value={project.projectType}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="projectStatus">Project Status</Label>
                    <Input
                      id="projectStatus"
                      name="projectStatus"
                      value={project.projectStatus}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="projectDescription">Project Description</Label>
                  <Input
                    id="projectDescription"
                    name="projectDescription"
                    value={project.projectDescription}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="startDate">Start Date</Label>
                    <div className="flex">
                      <Input
                        id="startDate"
                        name="startDate"
                        type="date"
                        value={project.startDate}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                      />
                      <CalendarIcon className="ml-2 h-4 w-4 opacity-50" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="estimatedEndDate">Estimated End Date</Label>
                    <div className="flex">
                      <Input
                        id="estimatedEndDate"
                        name="estimatedEndDate"
                        type="date"
                        value={project.estimatedEndDate}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                      />
                      <CalendarIcon className="ml-2 h-4 w-4 opacity-50" />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="projectOwner">Project Owner</Label>
                    <div className="flex items-center space-x-2">
                      <Avatar>
                        <AvatarImage src={project.projectOwnerProfile} alt={project.projectOwnerName || "Project Owner"} />
                        <AvatarFallback>{project.projectOwnerName?.[0] || "PO"}</AvatarFallback>
                      </Avatar>
                      <Input
                        id="projectOwner"
                        name="projectOwner"
                        value={project.projectOwner}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="projectManager">Project Manager</Label>
                    <div className="flex items-center space-x-2">
                      <Avatar>
                        <AvatarImage src={project.projectManagerProfile} alt={project.projectManagerName || "Project Manager"} />
                        <AvatarFallback>{project.projectManagerName?.[0] || "PM"}</AvatarFallback>
                      </Avatar>
                      <Input
                        id="projectManager"
                        name="projectManager"
                        value={project.projectManager}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="createdOn">Created On</Label>
                  <Input
                    id="createdOn"
                    name="createdOn"
                    type="date"
                    value={project.createdOn}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="active"
                    checked={project.active}
                    onCheckedChange={handleSwitchChange}
                    disabled={!isEditing}
                  />
                  <Label htmlFor="active">Active</Label>
                </div>

                {isEditing && (
                  <Button onClick={handleSave} className="w-full">
                    Save Changes
                  </Button>
                )}
              </div>
            </TabsContent>
            <TabsContent value="members">
              <Projectmembers />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}