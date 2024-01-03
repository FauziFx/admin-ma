import React from "react";
import useDocumentTitle from "../utils/useDocumentTitle";
import Breadcrumb from "../components/Breadcrumb";
import DataTable from "react-data-table-component";

const StokLensa = () => {
  useDocumentTitle("Stok lensa");
  const columns = [
    {
      name: "Nama Lensa",
    },
  ];
  return (
    <div className="content-wrapper">
      <Breadcrumb title="Stok Lensa" />
      {/* Main Content */}
      <div className="content">
        <div className="container-fluid">
          <div className="row">
            <div className="col-lg-12">
              <div className="card">
                <div className="card-body">
                  <DataTable columns={columns} pagination highlightOnHover />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StokLensa;
