import React from "react";
import Breadcrumb from "../components/Breadcrumb";
import useDocumentTitle from "../utils/useDocumentTitle";

const PengaturanAkun = () => {
  useDocumentTitle("Pengaturan Akun");
  return (
    <div className="content-wrapper">
      <Breadcrumb title="Pengaturan Akun" />
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

export default PengaturanAkun;
