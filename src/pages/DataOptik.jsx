import React, { useEffect, useState, useRef } from "react";
import Breadcrumb from "../components/Breadcrumb";
import useDocumentTitle from "../utils/useDocumentTitle";
import DataTable from "react-data-table-component";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import LoadingOverlay from "react-loading-overlay-ts";

const DataOptik = () => {
  useDocumentTitle("Data Pasien");
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const URL = import.meta.env.VITE_API_URL;
  const closeModal = useRef(null);
  const closeModalEdit = useRef(null);
  const [optikId, setOptikId] = useState(0);
  const [dataHapus, setDataHapus] = useState({ id: 0, nama: "" });
  const [data, setData] = useState([]);
  const [optik, setOptik] = useState("");

  const handleClose = async () => {
    closeModal.current.click();
    closeModalEdit.current.click();

    setTimeout(() => {
      setOptik("");
    }, 1000);
  };

  const columns = [
    {
      name: "#",
      selector: (row) => row.id,
      sortable: true,
      width: "fit-content",
    },
    {
      name: "Nama Optik/Armada",
      selector: (row) => row.nama_optik.toUpperCase(),
      sortable: true,
    },
    {
      name: "Action",
      selector: (row) => (
        <>
          <button
            className="btn btn-xs btn-success mr-1"
            data-toggle="modal"
            data-target="#modal-edit"
            onClick={() => {
              setOptikId(row.id);
              setOptik(row.nama_optik);
            }}
          >
            Edit
          </button>
          <button
            className="btn btn-xs btn-danger mr-1"
            data-toggle="modal"
            data-target="#modal-konfirmasi"
            onClick={() => setDataHapus({ id: row.id, nama: row.nama_optik })}
          >
            Hapus
          </button>
        </>
      ),
      width: "auto",
    },
  ];

  const submitEditOptik = async (e) => {
    e.preventDefault();
    const data = {
      nama_optik: optik,
    };

    try {
      const response = await axios.put(URL + "api/optik/" + optikId, data, {
        headers: {
          Authorization: localStorage.getItem("user-token"),
        },
      });

      if (response.data.success === true) {
        alert(response.data.message);
        getData();
      }
    } catch (error) {
      console.log(error);
    }
  };

  const submitOptik = async (e) => {
    e.preventDefault();
    const data = {
      nama_optik: optik,
    };

    try {
      const response = await axios.post(URL + "api/optik", data, {
        headers: {
          Authorization: localStorage.getItem("user-token"),
        },
      });
      if (response.data.success === true) {
        alert(response.data.message);
        getData();
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getData = async () => {
    try {
      const response = await axios.get(URL + "api/optik", {
        headers: {
          Authorization: localStorage.getItem("user-token"),
        },
      });
      if (response.data.success) {
        setData(response.data.data);
      } else {
        localStorage.clear();
        return navigate("/login");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const hapusOptik = async (id) => {
    try {
      const response = await axios.delete(URL + "api/optik/" + id, {
        headers: {
          Authorization: localStorage.getItem("user-token"),
        },
      });
      if (response.data.success) {
        alert(response.data.message);
        getData();
      } else {
        localStorage.clear();
        return navigate("/login");
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    setIsLoading(true);
    getData();
    setIsLoading(false);
  }, [isLoading]);

  return (
    <div className="content-wrapper">
      <Breadcrumb title="Data Optik" />
      {/* Main Content */}
      <div className="content">
        <div className="container-fluid">
          <div className="row">
            <div className="col-lg-12">
              <div className="card">
                <div className="card-header">
                  <button
                    className="btn btn-sm btn-primary mb-1"
                    data-toggle="modal"
                    data-target="#modal-tambah"
                  >
                    <i className="fas fa-plus"></i>&nbsp; Tambah Optik
                  </button>
                </div>
                <div className="card-body overflow-y-scroll">
                  <LoadingOverlay
                    active={isLoading}
                    spinner
                    text="Loading your content..."
                  >
                    <DataTable
                      columns={columns}
                      data={data}
                      pagination
                      paginationPerPage={50}
                      highlightOnHover
                      customStyles={tableCustomStyles}
                    />
                  </LoadingOverlay>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal Konfimasi */}
      <div
        className="modal fade"
        id="modal-konfirmasi"
        data-keyboard="false"
        data-backdrop="static"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-body">
              <h3>Konfirmasi Hapus</h3>
              Hapus Optik/armada <b>{dataHapus.nama}</b> ?
            </div>
            <div className="modal-footer justify-content-between">
              <button
                type="button"
                className="btn btn-default"
                data-dismiss="modal"
              >
                Batal
              </button>
              <button
                type="button"
                className="btn btn-danger"
                data-dismiss="modal"
                onClick={() => hapusOptik(dataHapus.id)}
              >
                Hapus
              </button>
            </div>
          </div>
          {/* Modal Content */}
        </div>
        {/* Modal Dialog */}
      </div>

      {/* Modal Edit */}
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
              <h4 className="modal-title">Edit Optik/Armada</h4>
            </div>
            <form onSubmit={submitEditOptik}>
              <div className="modal-body py-0">
                <div className="form-group mb-1">
                  <label htmlFor="" className="mb-0">
                    Nama Optik/Armada :
                  </label>
                  <input
                    onChange={(e) => setOptik(e.target.value)}
                    value={optik}
                    type="text"
                    name="nama_optik"
                    className="form-control"
                    placeholder="Nama Optik/Armada"
                    required
                  />
                </div>
              </div>
              <div className="modal-footer justify-content-between">
                <button
                  type="button"
                  className="btn btn-default"
                  data-dismiss="modal"
                  ref={closeModalEdit}
                  onClick={() => handleClose()}
                >
                  Batal
                </button>
                <div>
                  <button
                    type="submit"
                    className="btn btn-success"
                    disabled={optik.length <= 4}
                    onClick={() => handleClose()}
                  >
                    Simpan
                  </button>
                </div>
              </div>
            </form>
          </div>
          {/* Modal Content */}
        </div>
        {/* Modal Dialog */}
      </div>
      {/* Modal Tambah */}
      <div
        className="modal fade"
        id="modal-tambah"
        data-keyboard="false"
        data-backdrop="static"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h4 className="modal-title">Tambah Optik/Armada</h4>
            </div>
            <form onSubmit={submitOptik}>
              <div className="modal-body py-0">
                <div className="form-group mb-1">
                  <label htmlFor="" className="mb-0">
                    Nama Optik/Armada :
                  </label>
                  <input
                    onChange={(e) => setOptik(e.target.value)}
                    value={optik}
                    type="text"
                    name="nama_optik"
                    className="form-control"
                    placeholder="Nama Optik/Armada"
                    required
                  />
                </div>
              </div>
              <div className="modal-footer justify-content-between">
                <button
                  type="button"
                  className="btn btn-default"
                  data-dismiss="modal"
                  ref={closeModal}
                  onClick={() => handleClose()}
                >
                  Batal
                </button>
                <div>
                  <button
                    type="submit"
                    className="btn btn-success"
                    disabled={optik.length <= 4}
                    onClick={() => handleClose()}
                  >
                    Simpan
                  </button>
                </div>
              </div>
            </form>
          </div>
          {/* Modal Content */}
        </div>
        {/* Modal Dialog */}
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

export default DataOptik;
