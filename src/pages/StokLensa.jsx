import React, { useEffect, useState } from "react";
import useDocumentTitle from "../utils/useDocumentTitle";
import Breadcrumb from "../components/Breadcrumb";
import DataTable from "react-data-table-component";
import axios from "axios";
import { Link, useNavigate, useParams } from "react-router-dom";

const StokLensa = ({ isAdmin }) => {
  const navigate = useNavigate();
  const URL = import.meta.env.VITE_API_URL;
  const { id } = useParams();
  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState([]);
  const [lensa, setLensa] = useState("");
  useDocumentTitle(
    "Stok Lensa " +
      lensa.charAt(0).toUpperCase() +
      lensa.slice(1).toLocaleLowerCase()
  );

  const [powerEdit, setPowerEdit] = useState({
    id: "",
    power_name: "",
    inStock: 0,
    stock: 0,
  });

  const columns = [
    {
      name: "Power",
      selector: (row) => row.power_name,
    },
    {
      name: "Stok",
      selector: (row) => row.stock,
      conditionalCellStyles: [
        {
          when: (row) => row.stock <= 0,
          style: {
            backgroundColor: "#dc3545",
            color: "white",
          },
        },
        {
          when: (row) => row.stock === 1,
          style: {
            backgroundColor: "#ffc107",
            color: "white",
          },
        },
      ],
    },
    {
      name: "Action",
      selector: (row) => (
        <button
          className="btn btn-xs btn-success"
          data-toggle="modal"
          data-target="#modal-edit"
          onClick={() =>
            setPowerEdit({
              id: row.id,
              power_name: row.power_name,
              inStock: row.stock,
              stock: row.stock,
            })
          }
        >
          Edit
        </button>
      ),
      width: "auto",
      omit: !isAdmin,
    },
  ];

  const getData = async () => {
    try {
      const response = await axios.get(URL + "api/product/" + id, {
        headers: {
          Authorization: localStorage.getItem("user-token"),
        },
      });
      if (response.data.success) {
        setData(response.data.data);
        setFilter(response.data.data);
        setLensa(response.data.product_name);
      } else {
        localStorage.clear();
        return navigate("/login");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const updateStock = async () => {
    try {
      const response = await axios.put(
        URL + "api/product/" + powerEdit.id,
        { stock: powerEdit.stock },
        {
          headers: {
            Authorization: localStorage.getItem("user-token"),
          },
        }
      );
      if (response.data.success) {
        getData();
        alert(response.data.message);
      } else {
        localStorage.clear();
        return navigate("/login");
      }
    } catch (error) {
      throw error.message;
    }
  };

  useEffect(() => {
    getData();
  }, []);

  useEffect(() => {
    const result = data.filter((item) => {
      return item.power_name.toLowerCase().includes(search.toLocaleLowerCase());
    });
    setFilter(result);
  }, [data, search]);

  return (
    <div className="content-wrapper">
      <Breadcrumb title={lensa} />
      {/* Main Content */}
      <div className="content">
        <div className="container-fluid">
          <div className="row">
            <div className="col-lg-12">
              <div className="card">
                <div className="card-header">
                  <Link
                    to="/data-lensa"
                    className="btn btn-primary btn-sm my-1"
                  >
                    <i className="fas fa-barcode"></i> Data Lensa
                  </Link>
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
                  <DataTable
                    columns={columns}
                    data={filter}
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

      {/* Modal edit */}
      {isAdmin && (
        <div
          className="modal fade"
          id="modal-edit"
          data-keyboard="false"
          data-backdrop="static"
          aria-hidden="true"
        >
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h4 className="modal-title">Edit {lensa}</h4>
                <button
                  type="button"
                  className="close"
                  data-dismiss="modal"
                  aria-label="Close"
                ></button>
              </div>
              <div className="modal-body">
                <label htmlFor="">{powerEdit.power_name}</label>
                <div className="row">
                  <div className="col p-0">
                    <label htmlFor="">In Stock</label>
                    <input
                      type="text"
                      className="form-control rounded-0"
                      value={powerEdit.inStock}
                      onChange={(e) =>
                        setPowerEdit((powerEdit) => ({
                          ...powerEdit,
                          inStock: e.target.value,
                        }))
                      }
                      disabled
                    />
                  </div>
                  <div className="col p-0">
                    <label htmlFor="">Actual Stock</label>
                    <input
                      type="text"
                      className="form-control rounded-0"
                      value={powerEdit.stock}
                      onChange={(e) =>
                        setPowerEdit((powerEdit) => ({
                          ...powerEdit,
                          stock: e.target.value,
                        }))
                      }
                      autoFocus
                      required
                    />
                  </div>
                </div>
              </div>
              <div className="modal-footer justify-content-between">
                <button
                  type="button"
                  className="btn btn-default"
                  data-dismiss="modal"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    updateStock();
                  }}
                  type="button"
                  className="btn btn-primary"
                  data-dismiss="modal"
                >
                  Simpan
                </button>
              </div>
            </div>
            {/* Modal Content */}
          </div>
          {/* Modal Dialog */}
        </div>
      )}
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
