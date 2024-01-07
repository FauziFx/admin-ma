import React, { useEffect, useState } from "react";
import Breadcrumb from "../components/Breadcrumb";
import useDocumentTitle from "../utils/useDocumentTitle";
import DataTable from "react-data-table-component";
import moment from "moment-timezone";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const RekamMedis = () => {
  useDocumentTitle("Data Rekam Medis");
  const URL = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();
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
    id: 0,
    od: "",
    os: "",
    pd_jauh: "",
    pd_dekat: "",
    tanggal_periksa: "",
    pemeriksa: "",
    keterangan: "",
    ukuran_lama: "",
    tanggal: "",
  });

  const columns = [
    {
      name: "Tanggal Periksa",
      selector: (row) =>
        row.tanggal_periksa
          ? moment(row.tanggal_periksa).format("DD/MM/YYYY")
          : moment(row.tanggal).format("DD/MM/YYYY"),
      sortable: true,
    },
    {
      name: "Nama",
      selector: (row) => row.nama.toUpperCase(),
      sortable: true,
    },
    {
      name: "Pemeriksa",
      selector: (row) =>
        row.ukuran_lama === "n" ? (
          row.pemeriksa
        ) : (
          <h6>
            <span className="badge badge-secondary">Ukuran Lama</span>
          </h6>
        ),
      sortable: true,
    },
    {
      name: "Keterangan",
      selector: (row) => row.keterangan,
    },
    {
      name: "Action",
      selector: (row) => (
        <button
          onClick={() => showDetail(row)}
          className="btn btn-xs btn-info mr-1"
          data-toggle="modal"
          data-target="#modal-detail"
        >
          Detail
        </button>
      ),
    },
  ];

  const showDetail = async (row) => {
    setDetail({
      nama: row.nama.toUpperCase(),
      alamat: row.alamat,
      ttl: row.ttl,
      jenis_kelamin: row.jenis_kelamin,
      pekerjaan: row.pekerjaan,
      nohp: row.nohp,
      riwayat: row.riwayat,
      id: row.id,
      od: row.od.split("/"),
      os: row.os.split("/"),
      pd_jauh: row.pd_jauh,
      pd_dekat: row.pd_dekat,
      tanggal_periksa: row.tanggal_periksa,
      pemeriksa: row.pemeriksa,
      keterangan: row.keterangan,
      ukuran_lama: row.ukuran_lama,
      tanggal: row.tanggal,
    });
  };

  const getData = async () => {
    try {
      const response = await axios.get(URL + "api/rekam", {
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
      <Breadcrumb title="Data Rekam Medis" />
      {/* Main Content */}
      <div className="content">
        <div className="container-fluid">
          <div className="row">
            <div className="col-lg-12">
              <div className="card">
                <div className="card-header">
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
                    <td>Tanggal</td>
                    <td>:&nbsp;</td>
                    <td>{moment.utc(detail.tanggal).format("DD/MMM/YYYY")}</td>
                  </tr>
                  <tr>
                    <td>Nama</td>
                    <td>:</td>
                    <td>{detail.nama}</td>
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
              <p>Ukuran Kacamata:</p>
              <table className="table table-sm table-bordered">
                <thead>
                  <tr>
                    <th></th>
                    <th>Sph</th>
                    <th>Cyl</th>
                    <th>Axis</th>
                    <th>Add</th>
                    <th>Mpd</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>OD</td>
                    <td>{detail.od[0]}</td>
                    <td>{detail.od[1]}</td>
                    <td>{detail.od[2]}</td>
                    <td>{detail.od[3]}</td>
                    <td rowSpan={2} className="align-middle">
                      {detail.pd_jauh !== null && detail.pd_jauh}/
                      {detail.pd_dekat !== null && detail.pd_dekat}
                    </td>
                  </tr>
                  <tr>
                    <td>OS</td>
                    <td>{detail.os[0]}</td>
                    <td>{detail.os[1]}</td>
                    <td>{detail.os[2]}</td>
                    <td>{detail.os[3]}</td>
                  </tr>
                </tbody>
              </table>
              <table className="table table-sm">
                <tbody>
                  {detail.ukuran_lama === "n" ? (
                    <>
                      <tr>
                        <td>Tanggal Periksa</td>
                        <td>:</td>
                        <td>
                          {moment(detail.tanggal_periksa)
                            .utc()
                            .format("DD/MMM/YYYY")}
                        </td>
                      </tr>
                      <tr>
                        <td>Pemeriksa</td>
                        <td>:</td>
                        <td>{detail.pemeriksa}</td>
                      </tr>
                      <tr>
                        <td>Keterangan</td>
                        <td>:</td>
                        <td>{detail.keterangan}</td>
                      </tr>
                    </>
                  ) : (
                    <tr>
                      <td>Keluhan</td>
                      <td>:</td>
                      <td>{detail.keterangan}</td>
                    </tr>
                  )}
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

export default RekamMedis;
