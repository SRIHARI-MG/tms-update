import React, { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import PhoneInput from "@/components/ui/phone-input";
import { Edit, X, CheckCircle, Eye, Upload } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import api from "@/api/apiService";

// Validation schema
const formSchema = z.object({
  aadhar: z.object({
    number: z
      .string()
      .regex(/^\d{4}\s?\d{4}\s?\d{4}$/, {
        message: "Aadhar number must be 12 digits",
      })
      .optional(),
    name: z.string().min(1, { message: "Name is required" }).optional(),
    mobileNumber: z
      .string()

      .optional(),
    file: z.any().optional(),
  }),
  pan: z.object({
    number: z
      .string()
      .regex(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, {
        message: "Invalid PAN number",
      })
      .optional(),
    name: z.string().min(1, { message: "Name is required" }).optional(),
    file: z.any().optional(),
  }),
  passport: z.object({
    number: z
      .string()
      .regex(/^[A-Z]{1}[0-9]{7}$/, {
        message: "Invalid passport number",
      })
      .optional(),
    name: z.string().min(1, { message: "Name is required" }).optional(),
    file: z.any().optional(),
  }),
});

type FormValues = z.infer<typeof formSchema>;

interface Previews {
  aadhar: string | null;
  pan: string | null;
  passport: string | null;
}

interface DocumentsSectionProps {
  userId: string;
  isEditing: boolean;
  onEdit: () => void;
  onSave: () => void;
  onCancel: () => void;
}

const defaultValues: FormValues = {
  aadhar: { number: "", name: "", mobileNumber: "", file: null },
  pan: { number: "", name: "", file: null },
  passport: { number: "", name: "", file: null },
};

const DocumentsSection: React.FC<DocumentsSectionProps> = ({
  userId,
  isEditing,
  onEdit,
  onSave,
  onCancel,
}) => {
  const [showAlert, setShowAlert] = useState(false);
  const [originalValues, setOriginalValues] =
    useState<FormValues>(defaultValues);
  const [files, setFiles] = useState<{ [key: string]: File | null }>({
    aadhar: null,
    pan: null,
    passport: null,
  });
  const fileInputRefs = {
    aadhar: useRef<HTMLInputElement>(null),
    pan: useRef<HTMLInputElement>(null),
    passport: useRef<HTMLInputElement>(null),
  };
  const [placeholders] = useState({
    aadhar: {
      number: "XXXX XXXX XXXX",
      name: "Enter Aadhar Name",
      mobileNumber: "+91XXXXXXXXXX",
    },
    pan: {
      number: "ABCDE1234F",
      name: "Enter PAN Name",
    },
    passport: {
      number: "A1234567",
      name: "Enter Passport Name",
    },
  });
  const [tempFileUrls, setTempFileUrls] = useState<{
    [key: string]: string | null;
  }>({
    aadhar: null,
    pan: null,
    passport: null,
  });
  const countryCodes = ["+91", "+65", "+60", "+1", "+63"];
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        // Simulating API call
        // const response = await api.get(`/api/documents/${userId}`);
        // const fetchedDocuments = response.data;

        // For now, using empty values as if no data exists
        const emptyValues: FormValues = {
          aadhar: { number: "", name: "", mobileNumber: "", file: null },
          pan: { number: "", name: "", file: null },
          passport: { number: "", name: "", file: null },
        };

        setOriginalValues(emptyValues);
        form.reset(emptyValues);
      } catch (error) {
        console.error("Error fetching documents:", error);
      }
    };

    fetchDocuments();
  }, [userId, form]);

  useEffect(() => {
    return () => {
      Object.values(tempFileUrls).forEach((url) => {
        if (url) URL.revokeObjectURL(url);
      });
    };
  }, [tempFileUrls]);

  const handleFileChange = (docType: keyof FormValues, file: File) => {
    setFiles((prev) => ({ ...prev, [docType]: file }));

    if (tempFileUrls[docType]) {
      URL.revokeObjectURL(tempFileUrls[docType]!);
    }

    const newTempUrl = URL.createObjectURL(file);
    setTempFileUrls((prev) => ({ ...prev, [docType]: newTempUrl }));
  };

  const handleCancel = () => {
    // Reset form to original values
    form.reset(originalValues);

    // Clear all uploaded files
    setFiles({
      aadhar: null,
      pan: null,
      passport: null,
    });

    // Revoke all temporary file URLs
    Object.values(tempFileUrls).forEach((url) => {
      if (url) URL.revokeObjectURL(url);
    });

    // Reset temporary file URLs
    setTempFileUrls({
      aadhar: null,
      pan: null,
      passport: null,
    });

    // Call the onCancel prop
    onCancel();
  };

  const prepareRequestData = (data: FormValues) => {
    return {
      aadharNumber: data.aadhar.number,
      nameAsInAadhar: data.aadhar.name,
      mobileNumberInAadhar: data.aadhar.mobileNumber,
      panCardNumber: data.pan.number,
      nameAsInPanCard: data.pan.name,
      passportNumber: data.passport.number,
      nameAsInPassport: data.passport.name,
    };
  };

  const onSubmit = async (data: FormValues) => {
    setShowAlert(true);
  };

  const handleConfirmSubmit = async () => {
    const data = form.getValues();
    const requestedData = prepareRequestData(data);

    const hasFiles = data.aadhar.file || data.pan.file || data.passport.file;

    try {
      // if (hasFiles) {
      const formData = new FormData();
      if (data.aadhar.file) formData.append("aadharPdf", data.aadhar.file);
      if (data.pan.file) formData.append("panCardPdf", data.pan.file);
      if (data.passport.file)
        formData.append("passPortPdf", data.passport.file);
      formData.append("requestedData", JSON.stringify(requestedData));

      await api.put("/api/v1/document/update-document-request", formData);

      toast({
        title: "Success",
        description: "Documents updated successfully.",
        variant: "default",
        className: "fixed bottom-4 right-4  max-w-sm",
      });
      onSave();
    } catch (error) {
      console.error("Error updating documents:", error);
      toast({
        title: "Error",
        description: error?.response?.data?.response?.action,
        variant: "destructive",
        className: "fixed bottom-4 right-4  max-w-sm",
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

  const renderFileUpload = (docType: keyof FormValues, label: string) => (
    <div className="space-y-2">
      <Label>{label}</Label>
      <div className="flex items-center gap-5">
        <input
          type="file"
          ref={fileInputRefs[docType]}
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleFileChange(docType, file);
          }}
          accept=".pdf"
          className="hidden"
          disabled={!isEditing}
        />
        <Button
          type="button"
          variant="default"
          onClick={() => fileInputRefs[docType].current?.click()}
          disabled={!isEditing}
          className="w-fit"
        >
          <Upload className="mr-2 h-4 w-4" />
          Upload File
        </Button>
        {(files[docType] || tempFileUrls[docType]) && (
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" className="w-fit">
                <Eye className="mr-2 h-4 w-4" />
                Preview
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[60vw] sm:max-h-[80vh] md:max-w-[40vw] md:max-h-[90vh] overflow-auto">
              <DialogHeader>
                <DialogTitle>{`${label} Preview`}</DialogTitle>
              </DialogHeader>
              <div className="mt-4 h-[60vh] md:h-[80vh]">
                <FilePreview
                  url={
                    tempFileUrls[docType] ||
                    URL.createObjectURL(files[docType]!)
                  }
                />
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>
      {files[docType] && (
        <p className="text-sm text-gray-500">
          Selected file: {files[docType]?.name}
        </p>
      )}
    </div>
  );

  // Render functions for form fields
  const renderInputField = (
    docType: keyof FormValues,
    fieldName: string,
    label: string
  ) => (
    <FormField
      control={form.control}
      name={`${docType}.${fieldName}`}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <Input
              {...field}
              placeholder={!isEditing ? placeholders[docType][fieldName] : ""}
              value={isEditing ? field.value : field.value || ""}
              readOnly={!isEditing}
              className={!isEditing ? "bg-primary/5 text-gray-700" : ""}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mt-5">
        <div className="flex justify-end space-x-2">
          {!isEditing ? (
            <Button onClick={onEdit} size="sm" type="button">
              <Edit className="mr-2 h-4 w-4" />
              Edit
            </Button>
          ) : (
            <>
              <Button
                onClick={handleCancel}
                size="sm"
                variant="outline"
                type="button"
              >
                <X className="mr-2 h-4 w-4" />
                Cancel
              </Button>
              <Button size="sm" type="submit">
                <CheckCircle className="mr-2 h-4 w-4" />
                Request To Approval
              </Button>
            </>
          )}
        </div>

        <Card className="pt-5">
          <CardContent className="space-y-4">
            <h3 className="text-lg font-semibold">Aadhar Card Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {renderInputField("aadhar", "number", "Aadhar Number")}
              {renderInputField("aadhar", "name", "Name in Aadhar")}
              <FormField
                control={form.control}
                name="aadhar.mobileNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mobile Number Linked with Aadhar</FormLabel>
                    <FormControl>
                      <PhoneInput
                        value={field.value}
                        onChange={field.onChange}
                        readOnly={!isEditing}
                        placeholder={
                          !isEditing ? placeholders.aadhar.mobileNumber : ""
                        }
                        countryCodes={countryCodes}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            {renderFileUpload("aadhar", "Aadhar Card")}
          </CardContent>
        </Card>

        <Card className="pt-5">
          <CardContent className="space-y-4">
            <h3 className="text-lg font-semibold">PAN Card Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {renderInputField("pan", "number", "PAN Number")}
              {renderInputField("pan", "name", "Name in PAN")}
            </div>
            {renderFileUpload("pan", "PAN Card")}
          </CardContent>
        </Card>

        <Card className="pt-5">
          <CardContent className="space-y-4">
            <h3 className="text-lg font-semibold">Passport Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {renderInputField("passport", "number", "Passport Number")}
              {renderInputField("passport", "name", "Name in Passport")}
            </div>
            {renderFileUpload("passport", "Passport")}
          </CardContent>
        </Card>
        <AlertDialog open={showAlert} onOpenChange={setShowAlert}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Confirm Document Update</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to submit these document updates for
                approval?
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleConfirmSubmit}>
                Confirm
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </form>
    </Form>
  );
};

export default DocumentsSection;
