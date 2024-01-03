import React, { useEffect } from "react";
import { useState } from "react";
import useDocumentTitle from "../utils/useDocumentTitle";
import Breadcrumb from "../components/Breadcrumb";
import DataTable from "react-data-table-component";
import axios from "axios";

const StokLensa = () => {
  useDocumentTitle("Stok lensa");
  const [data, setData] = useState([]);
  const columns = [
    {
      name: "Nama Lensa",
      selector: (row) => row.product_name,
    },
  ];

  useEffect(() => {
    const getData = async () => {
      try {
        const URL = import.meta.env.VITE_API_URL;
        const response = await axios.get(URL + "api/products", {
          headers: {
            Authorization: localStorage.getItem("user-token"),
          },
        });
        setData(response.data.data);
      } catch (error) {
        console.log(error);
      }
    };

    getData();
  }, []);

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
                  <DataTable
                    columns={columns}
                    data={data}
                    pagination
                    customStyles={tableCustomStyles}
                    highlightOnHover
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const tableCustomStyles = {
  headCells: {
    style: {
      fontSize: "16px",
      fontWeight: "bold",
      padding: "0 18px",
      backgroundColor: "#ebebeb",
    },
  },
};

export default StokLensa;
