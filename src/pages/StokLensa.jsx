import React from "react";
import useDocumentTitle from "../utils/useDocumentTitle";
import Breadcrumb from "../components/Breadcrumb";

const StokLensa = () => {
  useDocumentTitle("Stok lensa");
  return (
    <div className="content-wrapper">
      <Breadcrumb title="Stok Lensa" />
      {/* Main Content */}
      <div className="content">
        <div className="container-fluid">
          <div className="row">
            <div className="col-lg-12">
              <div className="card">
                <div className="card-body"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StokLensa;
