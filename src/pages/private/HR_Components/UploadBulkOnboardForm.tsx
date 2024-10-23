import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { UploadCloud } from "lucide-react";
import * as XLSX from "xlsx";
import api from "@/api/apiService";
import { useToast } from "@/hooks/use-toast";

export default function UploadBulkOnboardForm() {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
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
      const data = await readExcelFile(file);
      const response = await api.post(
        "/api/v1/admin/bulk-onboard-employees",
        data
      );

      toast({
        title: "Success",
        description:
          response.data.message || "Employees onboarded successfully",
      });
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
      setFile(null);
    }
  };

  const readExcelFile = (file: File): Promise<any[]> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: "array" });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { raw: false });
        resolve(jsonData);
      };
      reader.onerror = (error) => reject(error);
      reader.readAsArrayBuffer(file);
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-4">
        <Input
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
        <p className="text-sm text-gray-500">Selected file: {file.name}</p>
      )}
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
