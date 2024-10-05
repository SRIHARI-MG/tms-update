import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ChevronDown, Eye, Pencil, Plus, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import api from "@/api/apiService";

interface Certificate {
  certificateId: string;
  certificateName: string;
  certificatePdfUrl: string;
  credentialId?: string;
  certificateNumber: string;
  description: string;
}

interface NewCertificate {
  certificateName: string;
  certificateUrl: string;
  credentialId: string;
  certificateNumber: string;
  description: string;
}

interface CertificatesSectionProps {
  userId: string;
}

export default function CertificatesSection({
  userId,
}: CertificatesSectionProps) {
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [isAddingCertificate, setIsAddingCertificate] =
    useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const { toast } = useToast();

  const [newCertificate, setNewCertificate] = useState<NewCertificate>({
    certificateName: "",
    certificateUrl: "",
    credentialId: "",
    certificateNumber: "",
    description: "",
  });

  const itemsPerPage = 5;

  useEffect(() => {
    fetchCertificates();
  }, []);

  const fetchCertificates = async (): Promise<void> => {
    try {
      const response = await api.get<{
        status: string;
        response: { data: Certificate[] };
      }>(`/api/v1/certificate/fetch-certificates-by-employeeId/${userId}`);
      if (response.data.status === "OK") {
        setCertificates(response.data.response.data);
      }
    } catch (error) {
      console.error("Error fetching certificates:", error);
    }
  };

  const handleFileChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ): void => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ): void => {
    const { name, value } = e.target;
    setNewCertificate((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCancel = (): void => {
    setIsAddingCertificate(false);
    setNewCertificate({
      certificateName: "",
      certificateUrl: "",
      credentialId: "",
      certificateNumber: "",
      description: "",
    });
    setSelectedFile(null);
    setPreviewUrl("");
  };

  const handleSubmit = async (): Promise<void> => {
    // Add your API call here
    toast({
      title: "Request Submitted",
      description: "Your certificate has been submitted for approval.",
    });
    handleCancel();
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = certificates.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(certificates.length / itemsPerPage);

  if (isAddingCertificate) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Add New Certificate</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="certificateFile">Certificate File*</Label>
            <Input
              id="certificateFile"
              type="file"
              onChange={handleFileChange}
              required
            />
            {previewUrl && (
              <div className="mt-2">
                <Button
                  variant="outline"
                  onClick={() => window.open(previewUrl)}
                >
                  Preview File
                </Button>
              </div>
            )}
          </div>

          <div>
            <Label htmlFor="certificateName">Certificate Name*</Label>
            <Input
              id="certificateName"
              name="certificateName"
              value={newCertificate.certificateName}
              onChange={handleInputChange}
              required
            />
          </div>

          <div>
            <Label htmlFor="certificateUrl">Certificate URL</Label>
            <Input
              id="certificateUrl"
              name="certificateUrl"
              value={newCertificate.certificateUrl}
              onChange={handleInputChange}
            />
          </div>

          <div>
            <Label htmlFor="credentialId">Credential ID</Label>
            <Input
              id="credentialId"
              name="credentialId"
              value={newCertificate.credentialId}
              onChange={handleInputChange}
            />
          </div>

          <div>
            <Label htmlFor="certificateNumber">Certificate Number*</Label>
            <Input
              id="certificateNumber"
              name="certificateNumber"
              value={newCertificate.certificateNumber}
              onChange={handleInputChange}
              required
            />
          </div>

          <div>
            <Label htmlFor="description">Description*</Label>
            <Textarea
              id="description"
              name="description"
              value={newCertificate.description}
              onChange={handleInputChange}
              required
            />
          </div>
        </CardContent>
        <CardFooter className="flex-col space-y-2 sm:flex-row sm:justify-end sm:space-x-2 sm:space-y-0">
          <Button
            variant="outline"
            onClick={handleCancel}
            className="w-full sm:w-auto"
          >
            Cancel
          </Button>
          <Button onClick={handleSubmit} className="w-full sm:w-auto">
            Request for Approval
          </Button>
        </CardFooter>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col space-y-2 sm:flex-row sm:justify-between sm:items-center">
          <CardTitle>Certificates</CardTitle>
          <Button
            onClick={() => setIsAddingCertificate(true)}
            className="w-full sm:w-auto"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Certificate
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[200px]">Certificate Name</TableHead>
                <TableHead className="hidden md:table-cell">Preview</TableHead>
                <TableHead className="hidden lg:table-cell">
                  Credential ID
                </TableHead>
                <TableHead className="hidden lg:table-cell">
                  Certificate Number
                </TableHead>
                <TableHead className="hidden xl:table-cell w-[300px]">
                  Description
                </TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentItems.map((cert) => (
                <TableRow
                  key={cert.certificateId}
                  className="hover:bg-primary/15"
                >
                  <TableCell className="font-medium">
                    {cert.certificateName}
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => window.open(cert.certificatePdfUrl)}
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      Preview
                    </Button>
                  </TableCell>
                  <TableCell className="hidden lg:table-cell">
                    {cert.credentialId || "-"}
                  </TableCell>
                  <TableCell className="hidden lg:table-cell">
                    {cert.certificateNumber}
                  </TableCell>
                  <TableCell
                    className="hidden xl:table-cell max-w-[300px] truncate"
                    title={cert.description}
                  >
                    {cert.description}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="hidden md:inline-flex"
                      >
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="hidden md:inline-flex"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                      <Collapsible className="md:hidden">
                        <CollapsibleTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <ChevronDown className="w-4 h-4" />
                          </Button>
                        </CollapsibleTrigger>
                        <CollapsibleContent className="space-y-2 mt-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="w-full justify-start"
                            onClick={() => window.open(cert.certificatePdfUrl)}
                          >
                            <Eye className="w-4 h-4 mr-2" />
                            Preview
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="w-full justify-start"
                          >
                            <Pencil className="w-4 h-4 mr-2" />
                            Edit
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="w-full justify-start"
                          >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Delete
                          </Button>
                          <div className="text-sm">
                            <p>
                              <strong>Credential ID:</strong>{" "}
                              {cert.credentialId || "-"}
                            </p>
                            <p>
                              <strong>Certificate Number:</strong>{" "}
                              {cert.certificateNumber}
                            </p>
                            <p>
                              <strong>Description:</strong> {cert.description}
                            </p>
                          </div>
                        </CollapsibleContent>
                      </Collapsible>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        {certificates.length > itemsPerPage && (
          <div className="flex flex-col sm:flex-row justify-center items-center space-y-2 sm:space-y-0 sm:space-x-2 mt-4">
            <Button
              variant="outline"
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="w-full sm:w-auto"
            >
              Previous
            </Button>
            <span className="py-2">
              Page {currentPage} of {totalPages}
            </span>
            <Button
              variant="outline"
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages}
              className="w-full sm:w-auto"
            >
              Next
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
