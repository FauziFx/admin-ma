import React, { useState, useEffect } from "react";
import Breadcrumb from "../components/Breadcrumb";
import useDocumentTitle from "../utils/useDocumentTitle";
import axios from "axios";
import moment from "moment-timezone";
import { Link } from "react-router-dom";
import DataTable from "react-data-table-component";

const KlaimGaransi = () => {
  useDocumentTitle("Data Klaim Garansi");
  const URL = import.meta.env.VITE_API_URL;
  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState([]);
  const [detail, setDetail] = useState({
    tanggal: "",
    nama: "",
    frame: "",
    lensa: "",
    jenis_garansi: "",
    kerusakan: "",
    perbaikan: "",
  });

  const columns = [
    {
      name: "Tanggal",
      selector: (row) => moment(row.tanggal).format("DD/MM/YYYY"),
    },
    {
      name: "Nama",
      selector: (row) => row.nama.toUpperCase(),
    },
    {
      name: "Garansi",
      selector: (row) => (row.jenis_garansi === "frame" ? "Frame" : "Lensa"),
    },
    {
      name: "Frame/Lensa",
      selector: (row) =>
        row.jenis_garansi === "frame"
          ? row.frame.toUpperCase()
          : row.lensa.toUpperCase(),
    },
    {
      name: "Action",
      selector: (row) => (
        <button
          onClick={() =>
            setDetail({
              tanggal: moment(row.tanggal).format("DD/MM/YYYY"),
              nama: row.nama,
              frame: row.frame,
              lensa: row.lensa,
              jenis_garansi: row.jenis_garansi,
              kerusakan: row.kerusakan,
              perbaikan: row.perbaikan,
            })
          }
          className="btn btn-xs btn-info mr-1"
          data-toggle="modal"
          data-target="#modal-detail"
        >
          Detail
        </button>
      ),
    },
  ];

  const getData = async () => {
    try {
      const response = await axios.get(URL + "api/garansi/klaim");
      setData(response.data.data);
      setFilter(response.data.data);
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
      <Breadcrumb title="Data Klaim Garansi" />
      {/* Main Content */}
      <div className="content">
        <div className="container-fluid">
          <div className="row">
            <div className="col-lg-12">
              <div className="card">
                <div className="card-header">
                  <Link to="/garansi" className="btn btn-sm bg-primary mb-1">
                    <i className="fas fa-certificate"></i>&nbsp; Klaim Garansi
                  </Link>
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
              <button
                type="button"
                className="close"
                data-dismiss="modal"
                aria-label="Close"
              >
                <span>x</span>
              </button>
            </div>
            <div className="modal-body">
              <table id="table-detail" className="table table-sm">
                <tbody>
                  <tr>
                    <td>Tanggal Klaim</td>
                    <td>:&nbsp;</td>
                    <td>{detail.tanggal}</td>
                  </tr>
                  <tr>
                    <td>Nama</td>
                    <td>:</td>
                    <td>{detail.nama.toUpperCase()}</td>
                  </tr>
                  <tr>
                    <td>Frame</td>
                    <td>:</td>
                    <td>{detail.frame.toUpperCase()}</td>
                  </tr>
                  <tr>
                    <td>Lensa</td>
                    <td>:</td>
                    <td>{detail.lensa.toUpperCase()}</td>
                  </tr>
                  <tr>
                    <td>Jenis Garansi</td>
                    <td>:</td>
                    <td>
                      <b>GARANSI {detail.jenis_garansi.toUpperCase()}</b>
                    </td>
                  </tr>
                </tbody>
              </table>
              <div className="card-body border border-danger mb-2 p-2 rounded">
                <b>Kerusakan :&nbsp;</b>
                {detail.kerusakan}
              </div>
              <div className="card-body border border-success p-2 rounded">
                <b>Perbaikan :&nbsp;</b>
                {detail.perbaikan}
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

export default KlaimGaransi;
