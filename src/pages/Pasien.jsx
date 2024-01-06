import React, { useEffect, useState } from "react";
import Breadcrumb from "../components/Breadcrumb";
import useDocumentTitle from "../utils/useDocumentTitle";
import moment from "moment-timezone";
import DataTable from "react-data-table-component";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Pasien = () => {
  useDocumentTitle("Data Pasien");
  const navigate = useNavigate();
  const URL = import.meta.env.VITE_API_URL;
  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState([]);
  const [detail, setDetail] = useState({
    nama: "",
    alamat: "",
    ttl: "",
    jenis_kelamin: "",
    pekerjaan: "",
    nohp: "",
    riwayat: "",
    tanggal: "",
  });

  const columns = [
    {
      name: "Tanggal",
      selector: (row) => moment.utc(row.tanggal).format("DD/MM/YYYY"),
    },
    {
      name: "Nama",
      selector: (row) => row.nama.toUpperCase(),
    },
    {
      name: "Alamat",
      selector: (row) => row.alamat.toUpperCase(),
    },
    {
      name: "Action",
      selector: (row) => (
        <>
          <button
            className="btn-xs btn-info"
            onClick={() => showDetail(row)}
            data-toggle="modal"
            data-target="#modal-detail"
          >
            Detail
          </button>
        </>
      ),
    },
  ];

  const showDetail = (row) => {
    const data = {
      nama: row.nama,
      alamat: row.alamat,
      ttl: row.ttl,
      jenis_kelamin: row.jenis_kelamin,
      pekerjaan: row.pekerjaan,
      nohp: row.nohp,
      riwayat: row.riwayat,
      tanggal: row.tanggal,
    };

    setDetail(data);
  };

  const getData = async () => {
    try {
      const response = await axios.get(URL + "api/pasien", {
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

  useEffect(() => {
    getData();
  }, []);

  useEffect(() => {
    const result = data.filter((item) => {
      return item.nama.toLowerCase().includes(search.toLocaleLowerCase());
    });
    setFilter(result);
  }, [data, search]);

  return (
    <div className="content-wrapper">
      <Breadcrumb title="Data Pasien" />
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
                    <i className="fas fa-plus"></i>&nbsp; Tambah Pasien
                  </button>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Cari Namanya Disini..."
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
                    highlightOnHover
                    customStyles={tableCustomStyles}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal Detail */}
      <div
        className="modal fade"
        id="modal-detail"
        data-keyboard="false"
        data-backdrop="static"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h4 className="modal-title">Detail</h4>
            </div>
            <div className="modal-body">
              <table id="table-detail" className=" table table-sm">
                <tbody>
                  <tr>
                    <td>Tanggal</td>
                    <td>:&nbsp;</td>
                    <td>{moment.utc(detail.tanggal).format("DD/MMM/YYYY")}</td>
                  </tr>
                  <tr>
                    <td>Nama</td>
                    <td>:</td>
                    <td>{detail.nama.toUpperCase()}</td>
                  </tr>
                  <tr>
                    <td>Alamat</td>
                    <td>:</td>
                    <td>{detail.alamat}</td>
                  </tr>
                  <tr>
                    <td>TTL</td>
                    <td>:</td>
                    <td>{detail.ttl}</td>
                  </tr>
                  <tr>
                    <td>Jenis Kelamin</td>
                    <td>:</td>
                    <td>{detail.jenis_kelamin}</td>
                  </tr>
                  <tr>
                    <td>Pekerjaan</td>
                    <td>:</td>
                    <td>{detail.pekerjaan}</td>
                  </tr>
                  <tr>
                    <td>No Hp</td>
                    <td>:</td>
                    <td>{detail.nohp}</td>
                  </tr>
                  <tr>
                    <td>Riwayat</td>
                    <td>:</td>
                    <td>{detail.riwayat}</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="modal-footer justify-content-between">
              <button
                type="button"
                className="btn btn-default"
                data-dismiss="modal"
              >
                Close
              </button>
            </div>
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

export default Pasien;
