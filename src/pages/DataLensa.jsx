import React, { useEffect, useState } from "react";
import useDocumentTitle from "../utils/useDocumentTitle";
import Breadcrumb from "../components/Breadcrumb";
import DataTable from "react-data-table-component";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import LoadingOverlay from "react-loading-overlay-ts";

const DataLensa = () => {
  useDocumentTitle("Data Lensa");
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const columns = [
    {
      name: "Nama Lensa",
      selector: (row) => row.product_name,
    },
  ];

  const handleRowClick = (row) => {
    navigate(`/data-lensa/${row.id}`);
  };

  useEffect(() => {
    setIsLoading(true);
    const getData = async () => {
      try {
        const URL = import.meta.env.VITE_API_URL;
        const response = await axios.get(URL + "api/products", {
          headers: {
            Authorization: localStorage.getItem("user-token"),
          },
        });
        if (response.data.success) {
          setData(response.data.data);
          setFilter(response.data.data);
        } else {
          localStorage.clear();
          return navigate("/login");
        }
      } catch (error) {
        console.log(error);
      }
    };

    getData();
    setIsLoading(false);
  }, [navigate]);

  useEffect(() => {
    setIsLoading(true);
    const result = data.filter((item) => {
      return item.product_name
        .toLowerCase()
        .includes(search.toLocaleLowerCase());
    });
    setFilter(result);
    setIsLoading(false);
  }, [data, search, isLoading]);

  return (
    <div className="content-wrapper">
      <Breadcrumb title="Data Lensa" />
      {/* Main Content */}
      <div className="content">
        <div className="container-fluid">
          <div className="row">
            <div className="col-lg-12">
              <div className="card">
                <div className="card-header">
                  <input
                    type="text"
                    className="form-control form-control"
                    placeholder="Cari Disini..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    autoFocus
                  />
                </div>
                <div className="card-body">
                  <LoadingOverlay
                    active={isLoading}
                    spinner
                    text="Loading your content..."
                  >
                    <DataTable
                      columns={columns}
                      data={filter}
                      pagination
                      customStyles={tableCustomStyles}
                      highlightOnHover
                      onRowClicked={(row) => handleRowClick(row)}
                    />
                  </LoadingOverlay>
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

export default DataLensa;
