import React from "react";
import Breadcrumb from "../components/Breadcrumb";
import useDocumentTitle from "../utils/useDocumentTitle";

const Page1 = () => {
  useDocumentTitle("Page 1");
  return (
    <div>
      <div className="content-wrapper">
        <Breadcrumb title="Page1" />
      </div>
    </div>
  );
};

export default Page1;
