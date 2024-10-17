import React from "react";
import { useLocation, useParams } from "react-router-dom";

const EmployeeProfilePage = () => {
  const { userId } = useParams();
  //   const location = useLocation();
  //   const state = location.state;

  return <div>EmployeeProfilePage {userId}</div>;
};

export default EmployeeProfilePage;
