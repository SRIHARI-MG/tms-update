import React, { useState, useEffect } from "react";
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
  const [previews, setPreviews] = useState<Previews>({
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

        // For now, using placeholder values
        const placeholderValues: FormValues = {
          aadhar: {
            number: "XXXX XXXX XXXX",
            name: "Enter Aadhar Name",
            mobileNumber: "+91XXXXXXXXXX",
            file: null,
          },
          pan: { number: "ABCDE1234F", name: "Enter PAN Name", file: null },
          passport: {
            number: "A1234567",
            name: "Enter Passport Name",
            file: null,
          },
        };

        form.reset(placeholderValues);
      } catch (error) {
        console.error("Error fetching documents:", error);
      }
    };

    fetchDocuments();
  }, [userId, form]);

  const handleFileChange = (docType: keyof FormValues, file: File) => {
    form.setValue(`${docType}.file` as any, file);

    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviews((prev) => ({ ...prev, [docType]: reader.result as string }));
    };
    reader.readAsDataURL(file);
  };
  const handleCancel = () => {
    form.reset();
    setPreviews({
      aadhar: null,
      pan: null,
      passport: null,
    });
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
      });
      onSave();
    } catch (error) {
      console.error("Error updating documents:", error);
      toast({
        title: "Error",
        description: error?.response?.data?.response?.action,
        variant: "destructive",
      });
    }
  };

  const renderFileUpload = (docType: keyof FormValues, label: string) => (
    <div className="space-y-2">
      <Label>{label}</Label>
      <div className="flex items-center space-x-2">
        <Input
          type="file"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleFileChange(docType, file);
          }}
          className="hidden"
          id={`${docType}-file`}
        />
        <Button
          onClick={() => document.getElementById(`${docType}-file`)?.click()}
          variant="outline"
          type="button"
          disabled={!isEditing}
        >
          <Upload className="mr-2 h-4 w-4" />
          Upload File
        </Button>
        {previews[docType] && (
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" type="button">
                <Eye className="mr-2 h-4 w-4" />
                Preview
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[80vw] sm:max-h-[80vh] overflow-auto">
              <DialogHeader>
                <DialogTitle>{`${label} Preview`}</DialogTitle>
              </DialogHeader>
              <div className="mt-4">
                <img
                  src={previews[docType] || undefined}
                  alt={`${docType} preview`}
                  className="max-w-full"
                />
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </div>
  );

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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

        <Card>
          <CardContent className="space-y-4">
            <h3 className="text-lg font-semibold">Aadhar Card Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="aadhar.number"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Aadhar Number</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        readOnly={!isEditing}
                        className={
                          !isEditing ? "bg-primary/10 text-gray-700" : ""
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="aadhar.name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name in Aadhar</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        readOnly={!isEditing}
                        className={
                          !isEditing ? "bg-primary/10 text-gray-700" : ""
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
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

        <Card>
          <CardContent className="space-y-4">
            <h3 className="text-lg font-semibold">PAN Card Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="pan.number"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>PAN Number</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        readOnly={!isEditing}
                        className={
                          !isEditing ? "bg-primary/10 text-gray-700" : ""
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="pan.name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name in PAN</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        readOnly={!isEditing}
                        className={
                          !isEditing ? "bg-primary/10 text-gray-700" : ""
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            {renderFileUpload("pan", "PAN Card")}
          </CardContent>
        </Card>

        <Card>
          <CardContent className="space-y-4">
            <h3 className="text-lg font-semibold">Passport Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="passport.number"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Passport Number</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        readOnly={!isEditing}
                        className={
                          !isEditing ? "bg-primary/10 text-gray-700" : ""
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="passport.name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name in Passport</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        readOnly={!isEditing}
                        className={
                          !isEditing ? "bg-primary/10 text-gray-700" : ""
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
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
