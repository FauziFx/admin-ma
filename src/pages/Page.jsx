import React from "react";
import Breadcrumb from "../components/Breadcrumb";
import useDocumentTitle from "../utils/useDocumentTitle";

const Page = () => {
  useDocumentTitle("Page Example");
  return (
    <div className="content-wrapper">
      <Breadcrumb title="Page" />
    </div>
  );
};

export default Page;
