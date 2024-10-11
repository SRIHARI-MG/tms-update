import MindgraphNetwork from "@/components/ui/mindgraph-network-animation";
import React from "react";

const EmployeeDashboard = () => {
  return (
    <div className="flex flex-col items-center">
      <MindgraphNetwork width={450} height={250} nodeScale={1} />
      <p className="text-3xl text-primary/30 font-semibold">Comming ... soon</p>
    </div>
  );
};

export default EmployeeDashboard;
