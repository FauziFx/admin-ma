import React, { useState, useEffect, useRef } from "react";
import Breadcrumb from "../components/Breadcrumb";
import useDocumentTitle from "../utils/useDocumentTitle";
import axios from "axios";
import moment from "moment-timezone";
import { useNavigate } from "react-router-dom";
import DataTable from "react-data-table-component";
import LoadingOverlay from "react-loading-overlay-ts";
import Swal from "sweetalert2/dist/sweetalert2.js";
import "sweetalert2/src/sweetalert2.scss";

const Garansi = () => {
  useDocumentTitle("Data Garansi");
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingSubmit, setIsLoadingSubmit] = useState(false);
  const URL = import.meta.env.VITE_API_URL;
  const closeModal = useRef(null);
  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState([]);
  const [detail, setDetail] = useState({
    nama: "",
    frame: "",
    lensa: "",
    r: [],
    l: [],
    garansi_lensa: "",
    garansi_frame: "",
    tanggal: "",
    data_klaim: [],
  });
  const [klaim, setKlaim] = useState({
    tanggal: "",
    garansi_id: 0,
    nama: "",
    frame: "",
    lensa: "",
    jenis_garansi: "",
    kerusakan: "",
    perbaikan: "",
  });

  const Toast = Swal.mixin({
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.onmouseenter = Swal.stopTimer;
      toast.onmouseleave = Swal.resumeTimer;
    },
  });

  const columns = [
    {
      name: "Tanggal",
      selector: (row) => moment.utc(row.tanggal).format("DD/MM/YYYY"),
      sortable: true,
    },
    {
      name: "Optik/Armada",
      selector: (row) => row.nama_optik, //sementara
      sortable: true,
    },
    {
      name: "Nama",
      selector: (row) => row.nama.toUpperCase(),
      sortable: true,
    },
    {
      name: "Lensa",
      selector: (row) => row.lensa.toUpperCase(),
      sortable: true,
    },
    {
      name: "Action",
      width: "auto",
      selector: (row) => (
        <>
          <button
            onClick={() =>
              setKlaim({
                tanggal: moment().locale("ID").format("YYYY-MM-DD"),
                garansi_id: row.id,
                nama: row.nama.toUpperCase(),
                frame: row.frame.toUpperCase(),
                lensa: row.lensa.toUpperCase(),
              })
            }
            className="btn btn-xs btn-success mr-1"
            data-toggle="modal"
            data-target="#modal-klaim"
          >
            Klaim
          </button>
          <button
            onClick={() => showDetail(row)}
            className="btn btn-xs btn-info mr-1"
            data-toggle="modal"
            data-target="#modal-detail"
          >
            Detail
          </button>
        </>
      ),
    },
  ];

  const getData = async () => {
    try {
      const response = await axios.get(URL + "api/garansi");
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

  const showDetail = async (row) => {
    let lensaIsGaransi = row.garansi_lensa !== "-" ? true : false;
    let frameIsGaransi = row.garansi_frame !== "-" ? true : false;
    let lensaIsExpired = await garansiIsExpired(moment(row.expired_lensa));
    let frameIsExpired = await garansiIsExpired(moment(row.expired_frame));
    let lensaIsClaimed = row.claimed_lensa === "0" ? true : false;
    let frameIsClaimed = row.claimed_frame === "0" ? true : false;

    const status_lensa = await garansiStatus(
      lensaIsGaransi,
      lensaIsExpired,
      lensaIsClaimed
    );

    const status_frame = await garansiStatus(
      frameIsGaransi,
      frameIsExpired,
      frameIsClaimed
    );

    try {
      const response = await axios.get(URL + "api/garansi_klaim/" + row.id, {
        headers: {
          Authorization: localStorage.getItem("user-token"),
        },
      });
      setDetail({
        nama: row.nama,
        frame: row.frame,
        lensa: row.lensa,
        r: row.r.split("/"),
        l: row.l.split("/"),
        garansi_lensa: row.garansi_lensa,
        garansi_frame: row.garansi_frame,
        expired_lensa: moment(row.expired_lensa).format("DD/MM/YYYY"),
        expired_frame: moment(row.expired_frame).format("DD/MM/YYYY"),
        status_lensa: status_lensa,
        status_frame: status_frame,
        tanggal: row.tanggal,
        nama_optik: row.nama_optik,
        data_klaim: response.data.data,
      });
    } catch (error) {
      console.log(error);
    }
  };

  const garansiStatus = async (isGaransi, garansiExpired, isClaimed) => {
    let status;
    if (!isGaransi) {
      status = "Non-Garansi";
    } else {
      if (garansiExpired) {
        status = "Expired";
      } else {
        if (isClaimed) {
          status = "Claimed";
        } else {
          status = "Active";
        }
      }
    }

    return status;
  };

  const garansiIsExpired = async (expiredDate) => {
    let a = moment(expiredDate);
    let b = moment().locale("ID");
    return b.isAfter(a); // True = expired, False = Active
  };

  const handleChange = async (e) => {
    setKlaim((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const submitKlaim = async (e) => {
    e.preventDefault();
    setIsLoadingSubmit(true);
    try {
      const response = await axios.post(
        URL + "api/garansi_klaim",
        {
          garansi_id: klaim.garansi_id,
          jenis_garansi: klaim.jenis_garansi,
          kerusakan: klaim.kerusakan,
          perbaikan: klaim.perbaikan,
          tanggal: klaim.tanggal,
        },
        {
          headers: {
            Authorization: localStorage.getItem("user-token"),
          },
        }
      );
      setIsLoadingSubmit(false);
      Toast.fire({
        icon: "success",
        title: response.data.message,
      });
      getData();
    } catch (error) {
      setIsLoadingSubmit(false);
      console.log(error);
    }
  };

  const handleClose = async () => {
    closeModal.current.click();

    setTimeout(() => {
      setKlaim({
        tanggal: "",
        garansi_id: 0,
        nama: "",
        frame: "",
        lensa: "",
        jenis_garansi: "",
        kerusakan: "",
        perbaikan: "",
      });
    }, 2000);
  };

  useEffect(() => {
    setIsLoading(true);
    getData();
    setIsLoading(false);
  }, []);

  useEffect(() => {
    setIsLoading(true);
    const result = data.filter((item) => {
      return item.nama.toLowerCase().includes(search.toLocaleLowerCase());
    });
    setFilter(result);
    setIsLoading(false);
  }, [data, search]);

  return (
    <LoadingOverlay
      active={isLoadingSubmit}
      spinner
      text="Loading your content..."
    >
      <div className="content-wrapper">
        <Breadcrumb title="Data Garansi" />
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
                    <LoadingOverlay
                      active={isLoading}
                      spinner
                      text="Loading your content..."
                    >
                      <DataTable
                        columns={columns}
                        data={filter}
                        pagination
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

        {/* Modal Detail */}
        <div className="modal fade" id="modal-detail" aria-hidden="true">
          <div className="modal-dialog modal-dialog-scrollable">
            <div className="modal-content">
              <div className="modal-header">
                <h4 className="modal-title">Detail</h4>
              </div>
              <div className="modal-body">
                <table id="table-detail" className="table table-sm">
                  <tbody>
                    <tr>
                      <td>Tanggal</td>
                      <td>:&nbsp;</td>
                      <td>{moment.utc(detail.tanggal).format("DD/MM/YYYY")}</td>
                    </tr>
                    <tr>
                      <td>Optik</td>
                      <td>:</td>
                      <td>{detail.nama_optik}</td>
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
                      <td>Garansi Lensa</td>
                      <td>:</td>
                      <td>
                        {detail.garansi_lensa}
                        {detail.garansi_lensa === "-"
                          ? ""
                          : detail.garansi_lensa === "6"
                          ? " Bulan "
                          : " Tahun "}
                        {detail.status_lensa === "Non-Garansi" ? (
                          <span className="badge badge-secondary">
                            Non-Garansi
                          </span>
                        ) : detail.status_lensa === "Expired" ? (
                          <span className="badge badge-danger">Expired</span>
                        ) : detail.status_lensa === "Claimed" ? (
                          <span className="badge badge-primary">Claimed</span>
                        ) : (
                          <span className="badge badge-success">Active</span>
                        )}
                      </td>
                    </tr>
                    <tr>
                      <td></td>
                      <td></td>
                      <td>{detail.expired_lensa}</td>
                    </tr>
                    <tr>
                      <td>Garansi Frame</td>
                      <td>:</td>
                      <td>
                        {detail.garansi_frame}
                        {detail.garansi_frame === "-"
                          ? ""
                          : detail.garansi_frame === "6"
                          ? " Bulan "
                          : " Tahun "}
                        {detail.status_frame === "Non-Garansi" ? (
                          <span className="badge badge-secondary">
                            Non-Garansi
                          </span>
                        ) : detail.status_frame === "Expired" ? (
                          <span className="badge badge-danger">Expired</span>
                        ) : detail.status_frame === "Claimed" ? (
                          <span className="badge badge-primary">Claimed</span>
                        ) : (
                          <span className="badge badge-success">Active</span>
                        )}
                      </td>
                    </tr>
                    <tr>
                      <td></td>
                      <td></td>
                      <td>{detail.expired_frame}</td>
                    </tr>
                  </tbody>
                </table>
                <table className="table table-sm mt-2 table-bordered">
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
                      <td>{detail.r[0]}</td>
                      <td>{detail.r[1]}</td>
                      <td>{detail.r[2]}</td>
                      <td>{detail.r[3]}</td>
                      <td>{detail.r[4]}</td>
                    </tr>
                    <tr>
                      <td>OS</td>
                      <td>{detail.l[0]}</td>
                      <td>{detail.l[1]}</td>
                      <td>{detail.l[2]}</td>
                      <td>{detail.l[3]}</td>
                      <td>{detail.l[4]}</td>
                    </tr>
                  </tbody>
                </table>
                <p>Data Klaim :</p>

                {detail.data_klaim.length !== 0 &&
                  detail.data_klaim.map((data) => (
                    <div
                      className="accordion"
                      id="accordionExample"
                      key={data.id}
                    >
                      <div className="card">
                        <div
                          className="card-header p-1"
                          id={"heading-" + data.id}
                        >
                          <h2 className="mb-0">
                            <button
                              className="btn btn-link btn-block text-left"
                              type="button"
                              data-toggle="collapse"
                              data-target={"#collapse-" + data.id}
                              aria-expanded="true"
                              aria-controls={"collapse-" + data.id}
                            >
                              #
                              {moment(data.tanggal).format("DD/MM/YYYY") +
                                " " +
                                data.jenis_garansi.toUpperCase()}
                            </button>
                          </h2>
                        </div>

                        <div
                          id={"collapse-" + data.id}
                          className="collapse"
                          aria-labelledby={"heading-" + data.id}
                          data-parent="#accordionExample"
                        >
                          <div className="card-body p-0">
                            <ul>
                              <li>Kerusakan: {data.kerusakan}</li>
                              <li>Perbaikan: {data.perbaikan}</li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
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

        {/* Moal Klaim */}
        <div
          className="modal fade"
          id="modal-klaim"
          data-keyboard="false"
          data-backdrop="static"
          aria-hidden="true"
        >
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h4 className="modal-title">Klaim Garansi</h4>
              </div>
              <form action="" onSubmit={submitKlaim}>
                <div className="modal-body">
                  <div className="form-group">
                    <label htmlFor="">Tanggal :</label>
                    <input
                      type="date"
                      className="form-control"
                      value={klaim.tanggal}
                      name="tanggal"
                      onChange={(e) => handleChange(e)}
                    />
                  </div>
                  <table className="table table-sm">
                    <tbody>
                      <tr>
                        <td>
                          <b>Nama</b>
                        </td>
                        <td>:</td>
                        <td>{klaim.nama}</td>
                      </tr>
                      <tr>
                        <td>
                          <b>Frame</b>
                        </td>
                        <td>:</td>
                        <td>{klaim.frame}</td>
                      </tr>
                      <tr>
                        <td>
                          <b>Lensa</b>
                        </td>
                        <td>:</td>
                        <td>{klaim.lensa}</td>
                      </tr>
                    </tbody>
                  </table>
                  <div className="form-group">
                    <label htmlFor="">Jenis Garansi :</label>
                    <select
                      name="jenis_garansi"
                      id=""
                      className="form-control"
                      onChange={(e) => handleChange(e)}
                      value={klaim.jenis_garansi}
                      required
                    >
                      <option value="">- Jenis Garansi</option>
                      <option value="lensa">Lensa</option>
                      <option value="frame">Frame</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label htmlFor="">Kerusakan :</label>
                    <textarea
                      name="kerusakan"
                      id=""
                      cols="30"
                      rows="2"
                      className="form-control"
                      placeholder="Rusaknya apa?"
                      onChange={(e) => handleChange(e)}
                      value={klaim.kerusakan}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="">Perbaikan :</label>
                    <textarea
                      name="perbaikan"
                      id=""
                      cols="30"
                      rows="2"
                      className="form-control"
                      placeholder="Solusinya gimana?/Frame apa?/Lensa apa?"
                      required
                      onChange={(e) => handleChange(e)}
                      value={klaim.perbaikan}
                    />
                  </div>
                  <div style={{ fontSize: "11px" }}>
                    Syarat dan Ketentuan Garansi:
                    <ul className="pl-3">
                      <li>
                        Garansi berlaku atas pengelupasan lapisan anti refleksi.
                      </li>
                      <li>
                        Garansi tidak berlaku atas kerusakan yang diakibatkan
                        oleh benturan/goresan benda keras, bahan kimia, atau
                        suhu panas.
                      </li>
                      <li>
                        Klaim atas garansi hanya berlaku dengan menunjukan kartu
                        garansi
                      </li>
                    </ul>
                  </div>
                </div>
                <div className="modal-footer justify-content-between">
                  <button
                    onClick={() => handleClose()}
                    ref={closeModal}
                    type="button"
                    className="btn btn-default"
                    data-dismiss="modal"
                  >
                    Close
                  </button>
                  <button
                    type="submit"
                    onClick={() => handleClose()}
                    className="btn btn-primary"
                  >
                    Klaim
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </LoadingOverlay>
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

export default Garansi;
