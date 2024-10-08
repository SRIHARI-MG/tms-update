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
import { Textarea } from "@/components/ui/textarea";
import { ChevronDown, Eye, Pencil, Plus, Trash2, Upload } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import api from "@/api/apiService";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import LoadingButton from "@/components/ui/loading-button";
import DynamicTable from "@/components/ui/custom-table";

const formSchema = z.object({
  certificateName: z.string().min(1, "Certificate name is required"),
  certificateNumber: z.string().min(1, "Certificate number is required"),
  credentialId: z.string(),
  certificateUrl: z.string(),
  description: z.string().min(1, "Description is required"),
  certificateFile: z
    .instanceof(File, {
      message: "Certificate file is required",
    })
    .optional(),
});

interface Certificate {
  certificateId: string;
  certificateName: string;
  certificatePdfUrl: string;
  credentialId?: string;
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
  const [editingCertificate, setEditingCertificate] =
    useState<Certificate | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [file, setFile] = useState<File | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [certificateToDelete, setCertificateToDelete] =
    useState<Certificate | null>(null);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      certificateName: "",
      certificateNumber: "",
      credentialId: "",
      certificateUrl: "",
      description: "",
    },
  });

  const itemsPerPage = 5;

  const columns = [
    {
      header: "Certificate Name",
      accessor: "certificateName",
      className: "w-[200px] font-medium",
    },
    {
      header: "Preview",
      accessor: (cert: Certificate) => (
        <PreviewDialog url={cert.certificatePdfUrl} />
      ),
      className: "hidden md:table-cell",
    },
    {
      header: "Credential ID",
      accessor: "credentialId",
      className: "hidden lg:table-cell",
    },
    {
      header: "Certificate Number",
      accessor: "certificateNumber",
      className: "hidden lg:table-cell",
    },
    {
      header: "Description",
      accessor: "description",
      className: "hidden xl:table-cell w-[300px] max-w-[300px] truncate",
    },
  ];

  const actions = (cert: Certificate) => (
    <>
      <Button
        variant="ghost"
        size="sm"
        className="hidden md:inline-flex"
        onClick={() => handleEdit(cert)}
      >
        <Pencil className="w-4 h-4" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        className="hidden md:inline-flex"
        onClick={() => handleDeleteClick(cert)}
      >
        <Trash2 className="w-4 h-4" />
      </Button>
    </>
  );

  const expandedContent = (cert: Certificate) => (
    <>
      <div className="w-full flex flex-wrap gap-2">
        <PreviewDialog url={cert.certificatePdfUrl} />
        <Button
          variant="default"
          size="sm"
          className="w-fit justify-start"
          onClick={() => handleEdit(cert)}
        >
          <Pencil className="w-4 h-4 mr-2" />
          Edit
        </Button>
        <Button
          variant="destructive"
          size="sm"
          className="w-fit justify-start"
          onClick={() => handleDeleteClick(cert)}
        >
          <Trash2 className="w-4 h-4 mr-2" />
          Delete
        </Button>
      </div>
      <div className="text-sm w-full flex flex-col items-start gap-2">
        <p>
          <strong>Credential ID:</strong> {cert.credentialId || "-"}
        </p>
        <p>
          <strong>Certificate Number:</strong> {cert.certificateNumber}
        </p>
        <p>
          <strong>Description:</strong> {cert.description}
        </p>
      </div>
    </>
  );

  useEffect(() => {
    fetchCertificates();
  }, []);

  useEffect(() => {
    if (editingCertificate) {
      form.reset({
        certificateName: editingCertificate.certificateName,
        certificateNumber: editingCertificate.certificateNumber,
        credentialId: editingCertificate.credentialId || "",
        certificateUrl: editingCertificate.certificatePdfUrl,
        description: editingCertificate.description,
      });
      setPreviewUrl(editingCertificate.certificatePdfUrl);
    }
  }, [editingCertificate]);

  const fetchCertificates = async (): Promise<void> => {
    try {
      const response = await api.get<{
        status: string;
        response: { data: Certificate[] };
      }>(`/api/v1/certificate/fetch-certificates-by-employeeId/${userId}`);
      if (response.data.status === "OK") {
        setCertificates(response.data.response.data?.reverse());
      }
    } catch (error) {
      console.error("Error fetching certificates:", error);
    }
  };

  const handleFileChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    field: any
  ): void => {
    const file = event.target.files?.[0];
    if (file) {
      field.onChange(file);
      setFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleCancel = (): void => {
    form.reset({
      certificateName: "",
      certificateNumber: "",
      credentialId: "",
      certificateUrl: "",
      description: "",
    });
    setEditingCertificate(null);
    setFile(null);
    setPreviewUrl("");
    setIsAddingCertificate(false);
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const formData = new FormData();
      if (values.certificateFile) {
        formData.append("certificateFile", values.certificateFile);
      }

      const requestedData = {
        certificateName: values.certificateName,
        certificateNumber: values.certificateNumber,
        credentialId: values.credentialId,
        certificateUrl: values.certificateUrl,
        description: values.description,
      };

      formData.append("requestedData", JSON.stringify(requestedData));

      if (editingCertificate) {
        formData.append("certificateId", editingCertificate.certificateId);
      }

      await api.put("/api/v1/certificate/update-request", formData);

      toast({
        title: `${editingCertificate ? "Update" : "Add"} Request Submitted`,
        description: `Your certificate has been submitted for ${
          editingCertificate ? "update" : "addition"
        } approval.`,
        variant: "default",
      });
      handleCancel();
      fetchCertificates();
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to submit certificate ${
          editingCertificate ? "update" : "add"
        } request.`,
        variant: "destructive",
      });
    }
  };

  const handleEdit = (cert: Certificate) => {
    setEditingCertificate(cert);
    setIsAddingCertificate(true);
  };
  const handleDeleteClick = (cert: Certificate) => {
    setCertificateToDelete(cert);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (certificateToDelete) {
      try {
        const response = await api.delete(
          `/api/v1/certificate/delete/${certificateToDelete.certificateNumber}`
        );
        if (response.data.status === "OK") {
          toast({
            title: "Certificate Deleted",
            description: response.data.message,
          });
          fetchCertificates(); // Refresh the list after deletion
        }
      } catch (error) {
        console.error("Error deleting certificate:", error);
        toast({
          title: "Error",
          description: "Failed to delete certificate. Please try again.",
          variant: "destructive",
        });
      }
    }
    setIsDeleteDialogOpen(false);
    setCertificateToDelete(null);
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = certificates.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(certificates.length / itemsPerPage);

  const FilePreview = ({ url }: { url: string }) => {
    return (
      <iframe
        src={`${url}#toolbar=0`}
        className="w-full h-full"
        title="PDF Preview"
      />
    );
  };

  if (isAddingCertificate) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">
            {editingCertificate ? "Edit Certificate" : "Add New Certificate"}
          </CardTitle>
        </CardHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="certificateName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Certificate Name<span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="certificateNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Certificate Number
                        <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          readOnly={!!editingCertificate}
                          className={`${
                            !!editingCertificate
                              ? "bg-primary/5 text-gray-700"
                              : ""
                          }`}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="credentialId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Credential ID</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="certificateUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Certificate URL</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Description<span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Textarea {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="certificateFile"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Certificate File</FormLabel>
                    <FormControl>
                      <div className="flex flex-col gap-3">
                        <div className="flex items-center gap-5">
                          <input
                            type="file"
                            onChange={(e) => handleFileChange(e, field)}
                            accept=".pdf"
                            className="hidden"
                            id="certificateFile"
                          />
                          <Button
                            type="button"
                            variant="default"
                            onClick={() =>
                              document
                                .getElementById("certificateFile")
                                ?.click()
                            }
                            className="w-fit"
                          >
                            <Upload className="mr-2 h-4 w-4" />
                            Upload File
                          </Button>
                          {previewUrl && (
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button variant="outline" className="w-fit">
                                  <Eye className="mr-2 h-4 w-4" />
                                  Preview
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="sm:max-w-[60vw] sm:max-h-[80vh] md:max-w-[40vw] md:max-h-[90vh] overflow-auto">
                                <DialogHeader>
                                  <DialogTitle>Certificate Preview</DialogTitle>
                                </DialogHeader>
                                <div className="mt-4 h-[60vh] md:h-[80vh]">
                                  <iframe
                                    src={`${previewUrl}#toolbar=0`}
                                    className="w-full h-full"
                                    title="PDF Preview"
                                  />
                                </div>
                              </DialogContent>
                            </Dialog>
                          )}
                        </div>
                        {file && (
                          <p className="text-sm text-gray-500">
                            Selected file: {file.name}
                          </p>
                        )}
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
            <CardFooter className="flex-col space-y-2 sm:flex-row sm:justify-end sm:space-x-2 sm:space-y-0">
              <Button
                type="button"
                variant="outline"
                onClick={handleCancel}
                className="w-full sm:w-auto"
              >
                Cancel
              </Button>
              <LoadingButton type="submit" className="w-full sm:w-auto">
                Request for Approval
              </LoadingButton>
            </CardFooter>
          </form>
        </Form>
      </Card>
    );
  }

  const PreviewDialog = ({ url }: { url: string }) => (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="default" size="sm">
          <Eye className="w-4 h-4 mr-2" />
          Preview
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[60vw] sm:max-h-[80vh] md:max-w-[40vw] md:max-h-[90vh] overflow-auto">
        <DialogHeader>
          <DialogTitle>Certificate Preview</DialogTitle>
        </DialogHeader>
        <div className="mt-4 h-[60vh] md:h-[80vh]">
          <FilePreview url={url} />
        </div>
      </DialogContent>
    </Dialog>
  );

  return (
    <div className="space-y-4">
      <div className="flex flex-col space-y-2 sm:flex-row sm:justify-end sm:items-center">
        <Button
          onClick={() => setIsAddingCertificate(true)}
          className="w-full sm:w-auto"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Certificate
        </Button>
      </div>
      <div>
        {certificates.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No certificates found. Click 'Add Certificate' to get started.
          </div>
        ) : (
          <>
            <DynamicTable
              data={currentItems}
              columns={columns}
              actions={actions}
              expandedContent={expandedContent}
              
            />
            {totalPages > 1 && (
              <div className="flex justify-start mt-4 space-x-2">
                <Button
                  variant="outline"
                  onClick={() => setCurrentPage(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  Previous
                </Button>
                <span className="py-2 px-3 bg-primary/10 rounded">
                  Page {currentPage} of {totalPages}
                </span>
                <Button
                  variant="outline"
                  onClick={() => setCurrentPage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  Next
                </Button>
              </div>
            )}
          </>
        )}
      </div>
      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
          </DialogHeader>
          <DialogDescription>
            Are you sure you want to delete the certificate "
            {certificateToDelete?.certificateName}"? This action cannot be
            undone.
          </DialogDescription>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteConfirm}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
