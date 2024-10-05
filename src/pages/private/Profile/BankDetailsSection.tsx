import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Edit, X, CheckCircle, Eye, Upload } from "lucide-react";
import api from "@/api/apiService";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";

type Props = {
  userId: string;
};

export default function BankDetailsSection({ userId }: Props) {
  const [isEditing, setIsEditing] = useState(false);
  const [bankDetails, setBankDetails] = useState({
    userId: "",
    accountHolderName: "",
    accountNumber: "",
    ifscCode: "",
    branchName: "",
    bankName: "",
    chequeProofUrl: "",
  });
  const [originalBankDetails, setOriginalBankDetails] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [tempFileUrl, setTempFileUrl] = useState<string | null>(null);
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchBankDetails();
  }, []);

  useEffect(() => {
    return () => {
      if (tempFileUrl) {
        URL.revokeObjectURL(tempFileUrl);
      }
    };
  }, [tempFileUrl]);

  const fetchBankDetails = async () => {
    try {
      setIsLoading(true);
      const response = await api.get(
        `/api/v1/bankDetails/fetch-bank-details-by-employeeId/${userId}`
      );
      if (response.data.status === "OK") {
        const { data } = response.data.response;
        const details = {
          userId: data.employeeId || "",
          accountHolderName: data.accountHolderName || "",
          accountNumber: data.accountNumber || "",
          ifscCode: data.ifscCode || "",
          branchName: data.branchName || "",
          bankName: data.bankName || "",
          chequeProofUrl: data.chequeProofUrl || "",
        };
        setBankDetails(details);
        setOriginalBankDetails(details);
      }
    } catch (err) {
      setError("Failed to fetch bank details");
      console.error("Error fetching bank details:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleEdit = () => {
    if (isEditing) {
      // Cancel changes
      setBankDetails(originalBankDetails);
      setFile(null);
      if (tempFileUrl) {
        URL.revokeObjectURL(tempFileUrl);
        setTempFileUrl(null);
      }
    }
    setIsEditing(!isEditing);
  };

  const handleInputChange = (key: string, value: string) => {
    setBankDetails((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const selectedFile = event.target.files[0];
      if (selectedFile.type !== "application/pdf") {
        alert("Please upload a PDF file");
        return;
      }
      setFile(selectedFile);

      if (tempFileUrl) {
        URL.revokeObjectURL(tempFileUrl);
      }

      const newTempUrl = URL.createObjectURL(selectedFile);
      setTempFileUrl(newTempUrl);
    }
  };

  const handleRequestApproval = async () => {
    try {
      const payload = {
        chequeLeaf: file,
        requestedData: {
          accountHolderName: bankDetails.accountHolderName,
          accountNumber: bankDetails.accountNumber,
          ifscCode: bankDetails.ifscCode,
          branchName: bankDetails.branchName,
          bankName: bankDetails.bankName,
        },
      };

      const formData = new FormData();
      formData.append("chequeLeaf", payload.chequeLeaf || null);
      formData.append("requestedData", JSON.stringify(payload.requestedData));

      const response = await api.put(
        "https://devapi-tms.mind-graph360.com/api/v1/bankDetails/update-request",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.data.status === "OK") {
        toast({
          title: "Success",
          description: "Bank details update request submitted successfully.",
        });
        setIsEditing(false);
        fetchBankDetails(); // Refresh the data
      } else {
        throw new Error("Failed to submit request");
      }
    } catch (err) {
      console.error("Error submitting bank details update request:", err);
      toast({
        title: "Error",
        description:
          "Failed to submit bank details update request. Please try again.",
        variant: "destructive",
      });
    }
  };

  const FilePreview = ({ url }: { url: string }) => {
    return (
      <iframe
        src={`${url}#toolbar=0`}
        className="w-full h-full"
        title="PDF Preview"
      />
    );
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-80">
        {[...Array(3)].map((_, i) => (
          <Skeleton
            key={i}
            className="w-8 h-8 sm:w-8 sm:h-8 rounded-full bg-primary/20"
          >
            <div className="w-full h-full rounded-full bg-primary animate-ping" />
          </Skeleton>
        ))}
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-end space-x-2">
        <Button
          onClick={toggleEdit}
          size="sm"
          variant={isEditing ? "outline" : "default"}
        >
          {isEditing ? (
            <>
              <X className="mr-2 h-4 w-4" />
              Cancel
            </>
          ) : (
            <>
              <Edit className="mr-2 h-4 w-4" />
              Edit
            </>
          )}
        </Button>
        {isEditing && (
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button size="sm">
                <CheckCircle className="mr-2 h-4 w-4" />
                Request to Approval
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Confirm Approval Request</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to submit this bank details update
                  request for approval?
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleRequestApproval}>
                  Confirm
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {Object.entries(bankDetails).map(([key, value]) => (
          <div key={key} className="space-y-2">
            <Label htmlFor={key} className="text-sm font-medium text-gray-500">
              {key === "userId"
                ? "Employee ID"
                : key === "chequeProofUrl"
                ? "Cheque Proof"
                : key
                    .replace(/([A-Z])/g, " $1")
                    .replace(/^./, (str) => str.toUpperCase())}
              <span className="text-red-500">*</span>
            </Label>
            {key === "chequeProofUrl" ? (
              isEditing ? (
                <div className="space-y-2">
                  <div className="flex items-center gap-5">
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileChange}
                      accept=".pdf"
                      className="hidden"
                      disabled={!isEditing}
                    />
                    <Button
                      type="button"
                      variant="default"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={!isEditing}
                      className="w-fit"
                    >
                      <Upload className="mr-2 h-4 w-4" />
                      Upload File
                    </Button>
                    {(file || tempFileUrl || value) && (
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" className="w-fit">
                            <Eye className="mr-2 h-4 w-4" />
                            Preview
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[60vw] sm:max-h-[80vh] md:max-w-[40vw] md:max-h-[90vh] overflow-auto">
                          <DialogHeader>
                            <DialogTitle>Cheque Proof Preview</DialogTitle>
                          </DialogHeader>
                          <div className="mt-4 h-[60vh] md:h-[80vh]">
                            <FilePreview
                              url={
                                tempFileUrl ||
                                (file && URL.createObjectURL(file)) ||
                                value
                              }
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
              ) : (
                <div className="flex items-center space-x-2">
                  {value && (
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline">
                          <Eye className="mr-2 h-4 w-4" />
                          Preview
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[60vw] sm:max-h-[80vh] md:max-w-[40vw] md:max-h-[90vh] overflow-auto">
                        <DialogHeader>
                          <DialogTitle>Cheque Proof Preview</DialogTitle>
                        </DialogHeader>
                        <div className="mt-4 h-[60vh] md:h-[80vh]">
                          <FilePreview
                            url={
                              tempFileUrl ||
                              (file && URL.createObjectURL(file)) ||
                              value
                            }
                          />
                        </div>
                      </DialogContent>
                    </Dialog>
                  )}
                </div>
              )
            ) : (
              <Input
                id={key}
                value={value}
                onChange={(e) => handleInputChange(key, e.target.value)}
                readOnly={!isEditing || key === "userId"}
                className={`${
                  !isEditing || key === "userId"
                    ? "bg-primary/10 text-gray-700"
                    : ""
                }`}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
