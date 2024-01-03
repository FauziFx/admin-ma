import React from "react";
import Breadcrumb from "../components/Breadcrumb";
import useDocumentTitle from "../utils/useDocumentTitle";

const Page2 = () => {
  useDocumentTitle("Page 2");
  return (
    <div>
      <div className="content-wrapper">
        <Breadcrumb title="Page2" />
      </div>
    </div>
  );
};

export default Page2;
