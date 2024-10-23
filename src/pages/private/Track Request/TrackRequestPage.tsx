import React, { useCallback, useEffect, useState } from "react";
import RequestSection from "./RequestSection";
import api from "@/api/apiService";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import TagInput from "@/components/ui/tag-input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import Loading from "@/components/ui/loading";
import { Textarea } from "@/components/ui/textarea";

const TrackRequestPage = () => {
  const userRole = localStorage.getItem("role");
  const isHR = userRole === "ROLE_HR";

  const requestSections = [
    {
      title: "Profile Request",
      apiUrl: isHR
        ? "/api/v1/admin/update-request-list"
        : "/api/v1/employee/my-update-requests",
    },
    {
      title: "Bank Details Request",
      apiUrl: isHR
        ? "/api/v1/bankDetails/update-request-list"
        : "/api/v1/bankDetails/my-bank-details-update-requests",
    },
    {
      title: "Documents Request",
      apiUrl: isHR
        ? "/api/v1/document/update-request-list"
        : "/api/v1/document/my-document-update-requests",
    },
  ];

  if (!isHR) {
    requestSections.push({
      title: "Certificate Request",
      apiUrl: "/api/v1/certificate/my-certificate-update-requests",
    });
  }
  const [activePage, setActivePage] = useState<string>(
    requestSections[0].title
  );
  const [activeApiUrl, setActiveApiUrl] = useState<string>(
    requestSections[0].apiUrl
  );
  const [requestedData, setRequestedData] = useState<any[]>([]);
  const [selectedData, setSelectedData] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState<any>({});
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [filteredData, setFilteredData] = useState<any[]>([]);
  const [isFetchingData, setIsFetchingData] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");

  // Status options
  const statusOptions = ["PENDING", "APPROVED", "REJECTED", "INPROGRESS"];

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsFetchingData(true);
        const response = await api.get(activeApiUrl);
        setRequestedData(response.data.response.data);
      } catch (error) {
        toast({
          title: "Error",
          description: error?.response?.data.response.action,
          variant: "destructive",
        });
      } finally {
        setIsFetchingData(false);
      }
    };
    fetchData();
  }, [activeApiUrl]);

  useEffect(() => {
    if (selectedData) {
      setFormData(selectedData.requestedData);
      setIsModalOpen(true);
    }
  }, [selectedData]);

  useEffect(() => {
    if (statusFilter) {
      const filtered = requestedData.filter(
        (item) => item.requestStatus.toUpperCase() === statusFilter
      );
      setFilteredData(filtered);
    } else {
      setFilteredData(requestedData);
    }
  }, [requestedData, statusFilter]);

  // Clear filter handler
  const handleClearFilter = () => {
    setStatusFilter("");
  };

  const getAvatarFallback = (firstName: string) => {
    return firstName?.substring(0, 2).toUpperCase();
  };

  const handleViewUpdates = useCallback((data: any) => {
    setSelectedData(data);
    setFormData(data.requestedData);
    setIsModalOpen(true);
  }, []);

  const handleApprove = async (requestId: string) => {
    try {
      let endpoint = "";
      let payload = {};

      switch (activePage) {
        case "Profile Request":
          endpoint = "/api/v1/admin/request-approval";
          payload = {
            requestId: parseInt(requestId),
            approvalStatus: "Approved",
            employeeId: selectedData.employeeId,
          };
          break;
        case "Bank Details Request":
          endpoint = "/api/v1/bankDetails/request-approval";
          payload = {
            requestId: parseInt(requestId),
            approvalStatus: "Accepted",
          };
          break;
        case "Documents Request":
          endpoint = "/api/v1/document/request-approval";
          payload = {
            requestId: parseInt(requestId),
            approvalStatus: "Approved",
          };
          break;
        default:
          throw new Error("Invalid request type");
      }

      await api.post(endpoint, payload);
      toast({
        title: "Success",
        description: "Request approved successfully",
        variant: "default",
      });
      setIsModalOpen(false);
      // Refresh the data
      const response = await api.get(activeApiUrl);
      setRequestedData(response.data.response.data);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to approve request",
        variant: "destructive",
      });
    }
  };

  const handleReject = async (requestId: string) => {
    if (!rejectionReason) {
      toast({
        title: "Error",
        description: "Please provide a reason for rejection",
        variant: "destructive",
      });
      return;
    }
    try {
      let endpoint = "";
      let payload = {};

      switch (activePage) {
        case "Profile Request":
          endpoint = "/api/v1/admin/request-approval";
          payload = {
            requestId: parseInt(requestId),
            approvalStatus: "Rejected",
            employeeId: selectedData.employeeId,
            description: rejectionReason,
          };
          break;
        case "Bank Details Request":
          endpoint = "/api/v1/bankDetails/request-approval";
          payload = {
            requestId: parseInt(requestId),
            approvalStatus: "Rejected",
            description: rejectionReason,
          };
          break;
        case "Documents Request":
          endpoint = "/api/v1/document/request-approval";
          payload = {
            requestId: parseInt(requestId),
            approvalStatus: "Rejected",
            description: rejectionReason,
          };
          break;
        default:
          throw new Error("Invalid request type");
      }

      await api.post(endpoint, payload);
      toast({
        title: "Success",
        description: "Request rejected successfully",
        variant: "default",
      });
      setIsModalOpen(false);
      // Refresh the data
      const response = await api.get(activeApiUrl);
      setRequestedData(response.data.response.data);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to reject request",
        variant: "destructive",
      });
    }
  };

  const getStatusBadge = (status: string) => {
    const statusColors: { [key: string]: string } = {
      PENDING: "bg-yellow-500",
      APPROVED: "bg-green-500",
      REJECTED: "bg-red-500",
      INPROGRESS: "bg-blue-500",
    };

    return (
      <Badge
        className={`${statusColors[status]} hover:${statusColors[status]} text-white`}
      >
        {status}
      </Badge>
    );
  };

  const profileColumn = [
    {
      header: "Request ID",
      accessor: "requestId",
      sortable: true,
      width: "10%",
    },
    {
      header: "Profile",
      accessor: (data: any) => (
        <Avatar className="h-12 w-12">
          <AvatarImage
            loading="lazy"
            className="object-cover"
            src={
              data.requestedData.profileUrl ||
              data.previousData.profileUrl ||
              undefined
            }
          />
          <AvatarFallback>
            {getAvatarFallback(data.requestedData.firstName)}
          </AvatarFallback>
        </Avatar>
      ),
      width: "5%",
    },
    {
      header: "Name",
      accessor: (data: any) => (
        <div className="flex items-center space-x-2">
          <p>{data.previousData.firstName}</p>
          <p>{data.previousData.lastName}</p>
        </div>
      ),
      width: "20%",
    },
    {
      header: "Requested Date",
      accessor: "requestedDate",
      sortable: true,
      width: "25%",
    },
    {
      header: "Status",
      accessor: (data: any) =>
        getStatusBadge(data.requestStatus?.toUpperCase()),
      sortable: true,
      width: "20%",
    },
    {
      header: "View All Updates",
      accessor: (data: any) => (
        <Button
          className="md:w-full w-fit"
          onClick={() => setSelectedData(data)}
        >
          View Updates
        </Button>
      ),
      width: "5%",
      className: "py-2",
    },
  ];

  const generateColumns = useCallback(
    (sectionTitle: string) => {
      if (sectionTitle === "Profile Request") {
        return profileColumn;
      }

      const commonColumns = [
        {
          header: "Request ID",
          accessor: "requestId",
          sortable: true,
          width: "10%",
        },
        {
          header: "Requested Date",
          accessor: "requestedDate",
          sortable: true,
          width: "25%",
        },
        {
          header: "Status",
          accessor: (data: any) =>
            getStatusBadge(data.requestStatus?.toUpperCase()),
          sortable: true,
          width: "20%",
        },
        {
          header: "View All Updates",
          accessor: (data: any) => (
            <Button
              className="md:w-full w-fit"
              onClick={() => handleViewUpdates(data)}
            >
              View Updates
            </Button>
          ),
          width: "5%",
          className: "py-2",
        },
      ];

      const specificColumns: { [key: string]: any[] } = {
        "Bank Details Request": [
          {
            header: "Account Holder Name",
            accessor: (data: any) => (
              <div className="flex items-center space-x-2">
                <p>{data.previousData.accountHolderName}</p>
              </div>
            ),
            width: "20%",
          },
          {
            header: "Bank Name",
            accessor: (data: any) => (
              <div className="flex items-center space-x-2">
                <p>{data.previousData.bankName}</p>
              </div>
            ),
            width: "20%",
          },
        ],
        "Certificate Request": [
          {
            header: "Certificate Name",
            accessor: (data: any) => data.requestedData.certificateName,
            width: "20%",
          },
        ],
        "Documents Request": [],
      };

      return [...specificColumns[sectionTitle], ...commonColumns];
    },
    [handleViewUpdates]
  );

  const ReadOnlyField = ({
    label,
    value,
    previousValue,
    isTagInput = false,
    isUrl = false,
  }: {
    label: string;
    value: string | string[];
    previousValue: string | string[];
    isTagInput?: boolean;
    isUrl?: boolean;
  }) => {
    console.log(value, previousValue);
    const hasChanged = JSON.stringify(value) !== JSON.stringify(previousValue);

    if (isUrl) {
      const isPdf =
        typeof value === "string" && value.toLowerCase().includes(".pdf");
      return (
        <div className="space-y-1">
          <Label>{label}</Label>
          {isPdf ? (
            <iframe src={value as string} className="w-full h-64" />
          ) : (
            <Avatar
              className={`h-24 w-24 ${
                hasChanged && value !== null ? "border-2 border-red-500" : ""
              }`}
            >
              <AvatarImage
                loading="lazy"
                className="object-cover"
                src={value as string}
              />
              <AvatarFallback>
                {label.substring(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
          )}
        </div>
      );
    }

    return (
      <div className="space-y-1">
        <Label>{label}</Label>
        {isTagInput ? (
          <TagInput
            initialTags={value as string[]}
            className={
              hasChanged && value !== null ? "border-2 border-red-500" : ""
            }
          />
        ) : (
          <Input
            value={
              typeof value === "boolean"
                ? value
                  ? "Yes"
                  : "No"
                : (value as string) || ""
            }
            readOnly
            className={`bg-background/80 focus-visible:ring-0 focus-visible:ring-offset-0 ${
              hasChanged && value !== null ? "border-2 border-red-500" : ""
            }`}
          />
        )}
      </div>
    );
  };

  const AddressFields = ({
    address,
    previousAddress,
    type,
  }: {
    address: any;
    previousAddress: any;
    type: string;
  }) => (
    <>
      <h3 className="font-semibold text-lg">{type} Address</h3>
      <div className="grid grid-cols-2 gap-4">
        <ReadOnlyField
          label="Address Line 1"
          value={address.addressLine1}
          previousValue={previousAddress.addressLine1}
        />
        <ReadOnlyField
          label="Address Line 2"
          value={address.addressLine2}
          previousValue={previousAddress.addressLine2}
        />
        <ReadOnlyField
          label="Landmark"
          value={address.landmark}
          previousValue={previousAddress.landmark}
        />
        <ReadOnlyField
          label="District"
          value={address.district}
          previousValue={previousAddress.district}
        />
        <ReadOnlyField
          label="Zipcode"
          value={address.zipcode}
          previousValue={previousAddress.zipcode}
        />
        <ReadOnlyField
          label="State"
          value={address.state}
          previousValue={previousAddress.state}
        />
        <ReadOnlyField
          label="Nationality"
          value={address.nationality}
          previousValue={previousAddress.nationality}
        />
      </div>
    </>
  );

  const renderDialogContent = () => {
    const renderActionButtons = () => {
      if (!isHR || selectedData?.requestStatus?.toUpperCase() !== "PENDING") {
        return null;
      }

      return (
        <div className="flex flex-col gap-5 mt-4 mx-2">
          <div className="space-y-2">
            <Label htmlFor="rejectionReason">Rejection Reason</Label>
            <Textarea
              id="rejectionReason"
              placeholder="Enter reason for rejection (required for rejecting requests)"
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              className="bg-background/80 focus-visible:ring-0 focus-visible:ring-offset-0"
            />
          </div>
          <div className="flex gap-2 justify-end">
            <Button
              onClick={() => handleApprove(selectedData.requestId.toString())}
            >
              Approve
            </Button>
            <Button
              variant="destructive"
              onClick={() => handleReject(selectedData.requestId.toString())}
            >
              Reject
            </Button>
          </div>
        </div>
      );
    };

    if (activePage === "Profile Request") {
      return (
        <div className="grid gap-4 py-4 max-h-[70vh] overflow-y-auto ">
          <div className="flex justify-center mb-4 mx-2">
            <Avatar
              className={`${
                selectedData?.requestedData.profileUrl
                  ? "border-red-500 border-2"
                  : ""
              } w-24 h-24`}
            >
              <AvatarImage
                loading="lazy"
                className="object-cover"
                src={formData.profileUrl || undefined}
              />
              <AvatarFallback>
                {getAvatarFallback(formData.firstName)}
              </AvatarFallback>
            </Avatar>
          </div>
          <div className="grid grid-cols-2 gap-4 mx-2">
            <ReadOnlyField
              label="First Name"
              value={formData.firstName}
              previousValue={selectedData?.previousData?.firstName || ""}
            />
            <ReadOnlyField
              label="Last Name"
              value={formData.lastName}
              previousValue={selectedData?.previousData.lastName || ""}
            />
            <ReadOnlyField
              label="Personal Email"
              value={formData.personalEmail}
              previousValue={selectedData?.previousData.personalEmail || ""}
            />
            <ReadOnlyField
              label="Date of Birth"
              value={formData.dateOfBirth}
              previousValue={selectedData?.previousData.dateOfBirth || ""}
            />
            <ReadOnlyField
              label="Gender"
              value={formData.gender}
              previousValue={selectedData?.previousData.gender || ""}
            />
            <ReadOnlyField
              label="Blood Group"
              value={formData.bloodGroup}
              previousValue={selectedData?.previousData.bloodGroup || ""}
            />
            <ReadOnlyField
              label="Mobile Number"
              value={formData.mobileNumber}
              previousValue={selectedData?.previousData.mobileNumber || ""}
            />
            <ReadOnlyField
              label="Alternate Mobile Number"
              value={formData.alternateMobileNumber}
              previousValue={
                selectedData?.previousData.alternateMobileNumber || ""
              }
            />
            <ReadOnlyField
              label="Emergency Contact Mobile Number"
              value={formData.emergencyContactMobileNumber}
              previousValue={
                selectedData?.previousData.emergencyContactMobileNumber || ""
              }
            />
            <ReadOnlyField
              label="Emergency Contact Person Name"
              value={formData.emergencyContactPersonName}
              previousValue={
                selectedData?.previousData.emergencyContactPersonName || ""
              }
            />
            <ReadOnlyField
              label="Willing to Travel"
              value={formData.willingToTravel}
              previousValue={
                selectedData?.previousData.willingToTravel ? "Yes" : "No"
              }
            />
            <ReadOnlyField
              label="Employment Type"
              value={formData.employmentType}
              previousValue={selectedData?.previousData.employmentType || ""}
            />
            <ReadOnlyField
              label="Shift Timing"
              value={formData.shiftTiming}
              previousValue={selectedData?.previousData.shiftTiming || ""}
            />
            <ReadOnlyField
              label="Skills"
              value={
                Array.isArray(formData.skills)
                  ? formData.skills
                  : formData.skills?.split(", ") || []
              }
              previousValue={selectedData?.previousData.skills || ""}
              isTagInput={true}
            />
          </div>
          <div className="space-y-4 mx-2">
            <AddressFields
              address={formData.currentAddress}
              previousAddress={selectedData?.previousData.currentAddress}
              type="Current"
            />
            <AddressFields
              address={formData.permanentAddress}
              previousAddress={selectedData?.previousData.permanentAddress}
              type="Permanent"
            />
          </div>
          {renderActionButtons()}
        </div>
      );
    } else if (activePage === "Bank Details Request") {
      return (
        <div className="grid gap-4 py-4 max-h-[70vh] overflow-y-auto">
          <div className="grid grid-cols-2 gap-4 mx-2">
            <ReadOnlyField
              label="Account Holder Name"
              value={formData.accountHolderName}
              previousValue={selectedData?.previousData.accountHolderName || ""}
            />
            <ReadOnlyField
              label="Account Number"
              value={formData.accountNumber}
              previousValue={selectedData?.previousData.accountNumber || ""}
            />
            <ReadOnlyField
              label="IFSC Code"
              value={formData.ifscCode}
              previousValue={selectedData?.previousData.ifscCode || ""}
            />
            <ReadOnlyField
              label="Bank Name"
              value={formData.bankName}
              previousValue={selectedData?.previousData.bankName || ""}
            />
            <ReadOnlyField
              label="Branch Name"
              value={formData.branchName}
              previousValue={selectedData?.previousData.branchName || ""}
            />
            <ReadOnlyField
              label="Cancelled Cheque"
              value={formData.chequeProofUrl}
              previousValue={selectedData?.previousData.chequeProofUrl || ""}
              isUrl={true}
            />

            {renderActionButtons()}
          </div>
        </div>
      );
    } else if (activePage === "Certificate Request" && !isHR) {
      return (
        <div className="grid gap-4 py-4 max-h-[70vh] overflow-y-auto">
          <div className="grid grid-cols-2 gap-4 mx-2">
            <ReadOnlyField
              label="Certificate Name"
              value={formData.certificateName}
              previousValue={selectedData?.previousData.certificateName || ""}
            />
            <ReadOnlyField
              label="Credential ID"
              value={formData.credentialId}
              previousValue={selectedData?.previousData.credentialId || ""}
            />
            <ReadOnlyField
              label="Certificate Number"
              value={formData.certificateNumber}
              previousValue={selectedData?.previousData.certificateNumber || ""}
            />
            <ReadOnlyField
              label="Description"
              value={formData.description}
              previousValue={selectedData?.previousData.description || ""}
            />
            <ReadOnlyField
              label="Certificate URL"
              value={formData.certificatePdfUrl || formData.certificateUrl}
              previousValue={
                selectedData?.previousData.certificatePdfUrl ||
                selectedData?.previousData.certificateUrl ||
                ""
              }
              isUrl={true}
            />
          </div>
        </div>
      );
    } else if (activePage === "Documents Request") {
      return (
        <div className="grid gap-4 py-4 max-h-[70vh] overflow-y-auto">
          <div className="space-y-4">
            <div className="space-y-4">
              <p className="text-md font-semibold">Aadhar Details</p>
              <div className="grid grid-cols-2 gap-4 mx-2">
                <ReadOnlyField
                  label="Aadhar Number"
                  value={formData.aadharNumber}
                  previousValue={selectedData?.previousData.aadharNumber || ""}
                />
                <ReadOnlyField
                  label="Name as in Aadhar"
                  value={formData.aadharAsInAadhar}
                  previousValue={
                    selectedData?.previousData.aadharAsInAadhar || ""
                  }
                />
                <ReadOnlyField
                  label="Linked Mobile Number"
                  value={formData.mobileNumberInAadhar}
                  previousValue={
                    selectedData?.previousData.mobileNumberInAadhar || ""
                  }
                />

                {formData.aadharUrl && (
                  <ReadOnlyField
                    label="Aadhar Preview"
                    value={formData.aadharUrl}
                    previousValue={selectedData?.previousData.aadharUrl || ""}
                  />
                )}
              </div>
            </div>

            <div className="space-y-4">
              <p className="text-md font-semibold">PAN Details</p>
              <div className="grid grid-cols-2 gap-4 mx-2">
                <ReadOnlyField
                  label="PAN Number"
                  value={formData.panCardNumber}
                  previousValue={selectedData?.previousData.panCardNumber || ""}
                />
                <ReadOnlyField
                  label="Name as in PAN Card"
                  value={formData.nameAsInPanCard}
                  previousValue={
                    selectedData?.previousData.nameAsInPanCard || ""
                  }
                />

                {formData.panCardUrl && (
                  <ReadOnlyField
                    label="PAN Preview"
                    value={formData.panCardUrl}
                    previousValue={selectedData?.previousData.panCardUrl || ""}
                  />
                )}
              </div>
            </div>

            <div className="space-y-4">
              <p className="text-md font-semibold">Passport Details</p>
              <div className="grid grid-cols-2 gap-4 mx-2">
                <ReadOnlyField
                  label="PAN Number"
                  value={formData.panCardNumber}
                  previousValue={selectedData?.previousData.panCardNumber || ""}
                />
                <ReadOnlyField
                  label="Name as in Passport Card"
                  value={formData.nameAsInPassport}
                  previousValue={
                    selectedData?.previousData.nameAsInPassport || ""
                  }
                />

                {formData.passportUrl && (
                  <ReadOnlyField
                    label="Passport Preview"
                    value={formData.passportUrl}
                    previousValue={selectedData?.previousData.passportUrl || ""}
                  />
                )}
              </div>
            </div>

            {renderActionButtons()}
          </div>
        </div>
      );
    }
  };

  const handlePageChange = (title: string) => {
    const selectedSection = requestSections.find(
      (section) => section.title === title
    );
    if (selectedSection) {
      setActivePage(selectedSection.title);
      setActiveApiUrl(selectedSection.apiUrl);
    }
  };

  return (
    <div className="pb-5">
      <h1 className="text-2xl font-semibold mb-4">
        {isHR ? "Approval Requests" : "Track Requests"}
      </h1>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-4 mb-4">
        {/* Mobile Dropdown Navigation */}
        <div className="w-full sm:hidden">
          <Select onValueChange={handlePageChange} value={activePage}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select Request Type" />
            </SelectTrigger>
            <SelectContent>
              {requestSections.map((section) => (
                <SelectItem key={section.title} value={section.title}>
                  {section.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden sm:block">
          <ul className="flex items-center border-b border-gray-200">
            {requestSections.map((page) => (
              <li key={page.title}>
                <button
                  onClick={() => handlePageChange(page.title)}
                  className={`py-2 px-4 text-sm font-medium text-gray-500 hover:text-gray-700 focus:outline-none
                    ${
                      activePage === page.title &&
                      `text-primary border-b-2 border-primary`
                    }`}
                >
                  {page.title}
                </button>
              </li>
            ))}
          </ul>
        </nav>

        {/* Status Filter */}
        <div className="flex items-center space-x-2">
          <Select
            value={statusFilter}
            onValueChange={(value) => setStatusFilter(value)}
          >
            <SelectTrigger className="w-[140px] sm:w-[180px]">
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
          <Button variant="default" size="sm" onClick={handleClearFilter}>
            Clear Filter
          </Button>
        </div>
      </div>
      {isFetchingData ? (
        <div className="flex justify-center items-center h-[calc(100vh-300px)]">
          <Loading />
        </div>
      ) : (
        <RequestSection
          title={activePage}
          data={filteredData}
          columns={generateColumns(activePage)}
        />
      )}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>{activePage} Details</DialogTitle>
            <DialogDescription>
              View the details of the selected {activePage.toLowerCase()}.
            </DialogDescription>
          </DialogHeader>
          {renderDialogContent()}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TrackRequestPage;
