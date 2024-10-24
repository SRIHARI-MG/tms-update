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
import EmployeeCard from "@/components/ui/employee-card";
import { SearchInput } from "@/components/ui/search-input";
import Loading from "@/components/ui/loading";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { UserIcon } from "lucide-react";
import LoadingButton from "@/components/ui/loading-button";

interface Certificate {
  requestedData: any;
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
  requestStatus: string;
}

const Certificate = () => {
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [filteredData, setFilteredData] = useState<Certificate[]>([]);
  const [isFetchingData, setIsFetchingData] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRecord, setSelectedRecord] = useState<Certificate | null>(
    null
  );
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isPreviewModalVisible, setIsPreviewModalVisible] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [attachmentUrl, setAttachmentUrl] = useState<string | null>(null);

  // Status options
  const statusOptions = ["PENDING", "APPROVED", "REJECTED", "INPROGRESS"];

  const fetchEmployees = async () => {
    try {
      setIsFetchingData(true);
      const response = await api.get("/api/v1/certificate/update-request-list");
      // /api/v1/certificate/update-request-list
      setCertificates(response.data.response.data);
    } catch (error) {
      console.error("Error fetching certificates:", error);
    } finally {
      setIsFetchingData(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  useEffect(() => {
    if (statusFilter) {
      const filtered = certificates.filter(
        (item) => item.requestStatus?.toUpperCase() === statusFilter
      );
      setFilteredData(filtered);
    } else {
      setFilteredData(certificates);
    }
  }, [certificates, statusFilter]);

  // Clear filter handler
  const handleClearFilter = () => {
    setStatusFilter("");
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const approveRequest = async (userId: string) => {
    try {
      await api.post(`/api/v1/admin/approve-certificate-request/${userId}`);
      fetchEmployees();
    } catch (error) {
      console.error("Error approving request:", error);
    }
  };

  const disapproveRequest = async (userId: string) => {
    try {
      await api.post(`/api/v1/admin/disapprove-certificate-request/${userId}`);
      fetchEmployees();
    } catch (error) {
      console.error("Error disapproving request:", error);
    }
  };

  //certificate popup
  const handleViewModalOpen = (record: Certificate) => {
    console.log("Opening modal for record:", record);
    setSelectedRecord(record);
    setIsModalVisible(true);
  };

  const handleViewModalClose = () => {
    setSelectedRecord(null);
    setAttachmentUrl(null);
    setPreviewUrl(null);
    setIsModalVisible(false);
  };
  const handlePreview = (url: string) => {
    setPreviewUrl(url);
    setIsPreviewModalVisible(true);
  };

  const columns = [
    {
      header: "Employee",
      accessor: "employeeName",
      sortable: true,
      width: "25%",
    },
    {
      header: "Role",
      accessor: "role",
      sortable: true,
      filterable: true,
      width: "15%",
    },
    {
      header: "Status",
      accessor: "requestStatus",
      sortable: true,
      filterable: true,
      width: "15%",
    },
    {
      header: "Actions",
      accessor: (item: Certificate) => (
        <div className="flex space-x-2">
          <Button
            onClick={() => handleViewModalOpen(item)}
            className="bg-blue-500 text-white"
          >
            View Details
          </Button>
        </div>
      ),
      width: "20%",
    },
  ];

  if (isFetchingData) {
    return <Loading />;
  }

  return (
    <div className="pb-5">
      <h1 className="text-2xl font-semibold mb-5">Employee Certificate List</h1>
      <div className="flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4 mb-4">
        <Button variant="default" size="sm" onClick={handleClearFilter}>
          Clear Filter
        </Button>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          <Select
            value={statusFilter}
            onValueChange={(value) => setStatusFilter(value)}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              {statusOptions.map((status) => (
                <SelectItem key={status} value={status}>
                  {status}
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
          data={filteredData}
          columns={columns}
          itemsPerPage={10}
          onClickRow={(employee: Certificate) => handleViewModalOpen(employee)}
        />
      </div>
      <Dialog open={isModalVisible} onOpenChange={handleViewModalClose}>
        <DialogContent>
          <DialogHeader>
            <h2>Employee Certificate Details</h2>
          </DialogHeader>
          {selectedRecord && (
            <div className="modal-content">
              <div className="flex gap-4">
                <Avatar>
                  {selectedRecord.profileUrl ? (
                    <AvatarImage
                      src={selectedRecord.profileUrl}
                      alt="Employee profile"
                    />
                  ) : (
                    <AvatarFallback>
                      <UserIcon />
                    </AvatarFallback>
                  )}
                </Avatar>
              </div>

              <div className="mt-4">
                <div className="mt-4">
                  <label
                    htmlFor="certificateName"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Certificate Name
                  </label>
                  <Input id="certificateName" value={"/"} disabled />
                </div>
                <div className="mt-4">
                  <label
                    htmlFor="certificateUrl"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Certificate URL
                  </label>
                  <Input id="certificateUrl" value={"/"} disabled />
                </div>
                <div className="mt-4">
                  <label
                    htmlFor="credentialId"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Credential ID
                  </label>
                  <Input id="credentialId" value={"/"} disabled />
                </div>
                <div className="mt-4">
                  <label
                    htmlFor="certificateNumber"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Certificate Number
                  </label>
                  <Input id="certificateNumber" value={"/"} disabled />
                </div>
                <div className="mt-4">
                  <label
                    htmlFor="description"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Description
                  </label>
                  <Textarea id="description" value={"/"} disabled />
                </div>
              </div>

              {attachmentUrl ? (
                <Button
                  variant="outline"
                  className="mt-4"
                  onClick={() => handlePreview(attachmentUrl)}
                >
                  View Certificate
                </Button>
              ) : (
                <p className="mt-4 text-sm text-red-500">
                  No certificate attachment available.
                </p>
              )}
              <Button className="bg-green-500 text-white">Approve</Button>
              <Button className="bg-red-500 text-white">Disapprove</Button>
            </div>
          )}
          <DialogFooter>
            <Button onClick={handleViewModalClose}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Preview Modal */}
      {/* <Dialog open={isPreviewModalVisible} onOpenChange={setIsPreviewModalVisible}>
        <DialogContent>
          {previewUrl && (
            <embed
              src={previewUrl}
              type="application/pdf"
              width="100%"
              height="600px"
              style={{ padding: "10px" }}
            />
          )}
          <DialogFooter>
            <Button onClick={() => setIsPreviewModalVisible(false)}>Close Preview</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog> */}
    </div>
  );
};

export default Certificate;
