import React, { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Download, UploadCloud, X } from "lucide-react";
import * as XLSX from "xlsx";
import api from "@/api/apiService";
import { useToast } from "@/hooks/use-toast";
import { BULK_ONBOARD_TEMPLATE_FILENAME } from "@/lib/constants";

export default function UploadBulkOnboardForm() {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  const handleDeleteFile = () => {
    setFile(null);
    // Reset the file input
    // Reset the file input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleDownloadTemplate = () => {
    const templateUrl = `${
      import.meta.env.VITE_PUBLIC_URL
    }/${BULK_ONBOARD_TEMPLATE_FILENAME}`;
    console.log(templateUrl);
    const link = document.createElement("a");
    link.href = templateUrl;
    link.download = BULK_ONBOARD_TEMPLATE_FILENAME;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleUpload = async () => {
    if (!file) {
      toast({
        title: "Error",
        description: "Please select a file to upload",
        variant: "destructive",
      });
      return;
    }

    setUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await api.post(
        "/api/v1/admin/onboard-employees",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      toast({
        title: "Success",
        description:
          response.data.message || "Employees onboarded successfully",
      });
      handleDeleteFile();
    } catch (error: any) {
      toast({
        title: "Error",
        description:
          error.response?.data?.message ||
          "An error occurred during bulk onboarding",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-4">
        <Input
          ref={fileInputRef}
          type="file"
          accept=".xlsx, .xls"
          onChange={handleFileChange}
          className="flex-grow"
        />
        <Button onClick={handleUpload} disabled={!file || uploading}>
          {uploading ? (
            "Uploading..."
          ) : (
            <>
              <UploadCloud className="mr-2 h-4 w-4" /> Upload
            </>
          )}
        </Button>
      </div>
      {file && (
        <div className="flex items-center justify-between text-sm text-gray-500">
          <p>Selected file: {file.name}</p>
          <Button
            variant="outline"
            size="sm"
            onClick={handleDeleteFile}
            className="text-red-500 hover:text-red-700"
          >
            <X className="h-4 w-4 mr-2" /> Remove
          </Button>
        </div>
      )}
      <Button
        onClick={handleDownloadTemplate}
        className="flex items-center space-x-2"
      >
        <Download /> <p>Download Template</p>
      </Button>
      <div className="mt-4">
        <h3 className="text-lg font-semibold mb-2">Instructions:</h3>

        <ol className="list-decimal list-inside space-y-2">
          <li>Download the template XLSX file with the required columns.</li>

          <li>Fill in the employee details in the template.</li>
          <li>Upload the completed XLSX file using the button above.</li>
          <li>Ensure all required fields are filled correctly.</li>
          <li>
            The system will process the file and onboard the employees in bulk.
          </li>
        </ol>
      </div>
    </div>
  );
}
