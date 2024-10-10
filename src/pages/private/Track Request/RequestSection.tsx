import DynamicTable from "@/components/ui/custom-table";

interface RequestSectionProps {
  title: string;
  data: any[];
  columns: any;
}

const RequestSection = ({ title, data, columns }: RequestSectionProps) => {
  return (
    <div>
      <DynamicTable columns={columns} data={data} />
    </div>
  );
};

export default RequestSection;
