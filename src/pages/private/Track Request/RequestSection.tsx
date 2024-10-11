import React from "react";
import DynamicTable from "@/components/ui/custom-table";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Separator } from "@/components/ui/separator";

interface RequestSectionProps {
  title: string;
  data: any[];
  columns: any[];
}

const RequestSection: React.FC<RequestSectionProps> = ({
  title,
  data,
  columns,
}) => {
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
  const renderMobileView = () => (
    <div className="space-y-4">
      {data.map((row, rowIndex) => (
        <Card key={rowIndex}>
          <CardHeader>
            <CardTitle>{row.requestId || `Request ${rowIndex + 1}`}</CardTitle>
            <CardDescription>
              {row.requestedDate || "Date not available"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible>
              <AccordionItem value="details">
                <AccordionTrigger className="!no-underline">
                  View Details
                </AccordionTrigger>
                <Separator />
                <AccordionContent>
                  {columns.map((column, colIndex) => (
                    <div key={colIndex} className="my-2">
                      {column.header !== "Status" &&
                        column.header !== "View All Updates" && (
                          <div className="flex gap-3">
                            <strong>{column.header}: </strong>
                            {typeof column.accessor === "function"
                              ? column.accessor(row)
                              : row[column.accessor]}
                          </div>
                        )}
                    </div>
                  ))}
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </CardContent>
          <CardFooter className="justify-between">
            {getStatusBadge(row.requestStatus.toUpperCase())}
            {columns
              .find((col) => col.header === "View All Updates")
              ?.accessor(row)}
          </CardFooter>
        </Card>
      ))}
    </div>
  );

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">{title}</h2>
      <div className="hidden md:block">
        <DynamicTable data={data} columns={columns} />
      </div>
      <div className="md:hidden">{renderMobileView()}</div>
    </div>
  );
};

export default RequestSection;
