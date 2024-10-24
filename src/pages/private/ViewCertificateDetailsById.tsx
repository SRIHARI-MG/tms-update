import React, { useEffect, useState } from "react";
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
import Loading from "@/components/ui/loading";

interface CertificateData {
  certificateName: string;
  certificateUrl: string;
  credentialId: string;
  certificateNumber: string;
  description: string;
  certificatePdfName: string;
  certificatePdfUrl: string;
  employeeId: string;
  certificateId: string;
}

const ViewCertificateDetailsById = ({ userId }: { userId?: string }) => {
  const [certificates, setCertificates] = useState<CertificateData[]>([]);
  const [filters, setFilters] = useState({
    certificateType: "all",
  });
  const [isFetchingData, setIsFetchingData] = useState(false);

  const fetchCertificates = async () => {
    try {
      setIsFetchingData(true);
      const response = await api.get(
        `/api/v1/certificate/fetch-certificates-by-employeeId/${userId}`
      );
      setCertificates(response.data.response.data);
    } catch (error) {
      console.error("Error fetching certificates:", error);
    } finally {
      setIsFetchingData(false);
    }
  };

  useEffect(() => {
    fetchCertificates();
  }, [userId]);

  const certificateTypes = [
    ...new Set(certificates.map((cert) => cert.certificateName)),
  ];

  const filteredCertificates = certificates.filter((cert) => {
    return (
      filters.certificateType === "all" ||
      cert.certificateName === filters.certificateType
    );
  });

  const clearFilter = () => {
    setFilters({
      certificateType: "all",
    });
  };

  const handleFilterChange = (value: string) => {
    setFilters((prev) => ({ ...prev, certificateType: value }));
  };

  const columns = [
    {
      header: "Certificate Name",
      accessor: "certificateName",
      sortable: true,
      width: "25%",
    },
    {
      header: "Credential ID",
      accessor: "credentialId",
      sortable: true,
      width: "20%",
    },
    {
      header: "Certificate Number",
      accessor: "certificateNumber",
      sortable: true,
      width: "20%",
    },
    {
      header: "Description",
      accessor: "description",
      sortable: true,
      width: "35%",
    },
  ];

  if (isFetchingData) {
    return <Loading />;
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4 mb-4">
        <Button onClick={clearFilter} className="w-fit sm:w-auto">
          Clear All Filters
        </Button>
        <Select
          onValueChange={handleFilterChange}
          value={filters.certificateType}
        >
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="Filter by Certificate Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            {certificateTypes.map((type) => (
              <SelectItem key={type} value={type}>
                {type}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="overflow-x-auto">
        <DynamicTable
          data={filteredCertificates}
          columns={columns}
          itemsPerPage={10}
          onClickView={(certificate) => (
            <div className="p-4 bg-white rounded-lg shadow">
              <h2 className="text-xl font-semibold mb-2">
                {certificate.certificateName}
              </h2>
              <p>
                <strong>Credential ID:</strong> {certificate.credentialId}
              </p>
              <p>
                <strong>Certificate Number:</strong>{" "}
                {certificate.certificateNumber}
              </p>
              <p>
                <strong>Description:</strong> {certificate.description}
              </p>
              {certificate.certificatePdfUrl && (
                <a
                  href={certificate.certificatePdfUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline mt-2 inline-block"
                >
                  View Certificate PDF
                </a>
              )}
            </div>
          )}
        />
      </div>
    </div>
  );
};

export default ViewCertificateDetailsById;
