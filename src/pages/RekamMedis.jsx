import React, { useEffect, useState } from "react";
import Breadcrumb from "../components/Breadcrumb";
import useDocumentTitle from "../utils/useDocumentTitle";
import DataTable from "react-data-table-component";
import moment from "moment-timezone";
import "moment/dist/locale/id";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useRef } from "react";
import LoadingOverlay from "react-loading-overlay-ts";
import Swal from "sweetalert2/dist/sweetalert2.js";
import "sweetalert2/src/sweetalert2.scss";

const RekamMedis = () => {
  useDocumentTitle("Data Kunjungan Pasien");
  const URL_API = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();
  const closeModal = useRef(null);
  const uploadFile = useRef(null);
  const [file, setFile] = useState("");
  const [preview, setPreview] = useState("");
  const [openPreview, setOpenPreview] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingSubmit, setIsLoadingSubmit] = useState(false);
  // Rekam medis
  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState([]);
  const [dataHapus, setDataHapus] = useState({ id: 0, nama: "", image: "" });
  const [dataOptik, setDataOptik] = useState([]);
  // Data Pasien
  const [dataPasien, setDataPasien] = useState([]);
  const [searchPasien, setSearchPasien] = useState("");
  const [filterPasien, setFilterPasien] = useState([]);
  const [pasienId, setPasienId] = useState(0);

  const [dataUkuranBaru, setDataUkuranBaru] = useState({
    nama: "",
    alamat: "",
    ttl: "",
  });

  const [ukuranBaru, setUkuranBaru] = useState({
    rsph: "",
    rcyl: "",
    raxis: "",
    radd: "",
    lsph: "",
    lcyl: "",
    laxis: "",
    ladd: "",
    pd_jauh: "",
    pd_dekat: "",
    tanggal_periksa: moment().locale("id").format("YYYY-MM-DD"),
    pemeriksa: "",
    optik_id: "",
    keterangan: "",
  });

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
    nama_optik: "",
    pemeriksa: "",
    keterangan: "",
    ukuran_lama: "",
    tanggal: "",
  });

  const Toast = Swal.mixin({
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
  });

  const loadImage = (e) => {
    const files = e.target.files[0];
    if (files.type == "image/png" || files.type == "image/jpeg") {
      if (files.size > 3145728) {
        Toast.fire({
          icon: "error",
          title: "Waduh kegedean filenya",
        });
        setOpenPreview(false);
        setFile("");
      } else {
        setFile(files);
        setPreview(URL.createObjectURL(e.target.files[0]));
        setOpenPreview(true);
      }
    } else {
      Toast.fire({
        icon: "error",
        title: "Waduh gambarnya harus png, jpg atau jpeg",
      });
      setOpenPreview(false);
      setFile("");
    }
  };

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
        <>
          <button
            onClick={() => showDetail(row)}
            className="btn btn-xs btn-info mr-1"
            data-toggle="modal"
            data-target="#modal-detail"
          >
            Detail
          </button>
          <button
            className="btn btn-xs btn-danger"
            data-toggle="modal"
            data-target="#modal-konfirmasi"
            onClick={() =>
              setDataHapus({ id: row.id, nama: row.nama, image: row.image })
            }
          >
            Hapus
          </button>
        </>
      ),
      width: "auto",
    },
  ];

  const columnsPasien = [
    {
      name: "Nama",
      selector: (row) => row.nama.toUpperCase(),
    },
    {
      name: "TTL",
      selector: (row) => row.ttl,
    },
    {
      name: "Action",
      selector: (row) => (
        <button
          className="btn btn-xs btn-primary mr-1"
          data-dismiss="modal"
          aria-label="Close"
          data-toggle="modal"
          data-target="#modal-ukuran-baru"
          onClick={() => {
            setPasienId(row.id);
            setDataUkuranBaru({
              nama: row.nama,
              alamat: row.alamat,
              ttl: row.ttl,
            });
          }}
        >
          Pilih
        </button>
      ),
      width: "fit-content",
    },
  ];

  const handleChangeUkuranBaru = async (e) => {
    setUkuranBaru((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const handleClose = async () => {
    closeModal.current.click();

    setTimeout(() => {
      setUkuranBaru({
        rsph: "",
        rcyl: "",
        raxis: "",
        radd: "",
        lsph: "",
        lcyl: "",
        laxis: "",
        ladd: "",
        pd_jauh: "",
        pd_dekat: "",
        tanggal_periksa: moment().locale("id").format("YYYY-MM-DD"),
        pemeriksa: "",
        optik_id: "",
        keterangan: "",
      });
      setOpenPreview(false);
      setFile("");
    }, 2000);
  };

  const hapusRekamMedis = async (id, image) => {
    try {
      const img = image || "image";
      const response = await axios.delete(
        URL_API + "api/rekam/" + id + "/" + img,
        {
          headers: {
            Authorization: localStorage.getItem("user-ma-token"),
          },
        }
      );
      if (response.data.success) {
        Toast.fire({
          icon: "success",
          title: response.data.message,
        });
        getData();
      } else {
        localStorage.clear();
        return navigate("/login");
      }
    } catch (error) {
      console.log(error);
    }
  };

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
      nama_optik: row.nama_optik,
      pemeriksa: row.pemeriksa,
      keterangan: row.keterangan,
      ukuran_lama: row.ukuran_lama,
      tanggal: row.tanggal,
      url: row.url,
    });
  };

  const submitUkuranbaru = async (e) => {
    e.preventDefault();
    setIsLoadingSubmit(true);
    try {
      const od = [
        ukuranBaru.rsph,
        ukuranBaru.rcyl,
        ukuranBaru.raxis,
        ukuranBaru.radd,
      ].join("/");
      const os = [
        ukuranBaru.lsph,
        ukuranBaru.lcyl,
        ukuranBaru.laxis,
        ukuranBaru.ladd,
      ].join("/");

      const data = {
        od: od,
        os: os,
        pd_jauh: parseInt(ukuranBaru.pd_jauh),
        pd_dekat: parseInt(ukuranBaru.pd_dekat),
        tanggal_periksa: ukuranBaru.tanggal_periksa,
        pemeriksa: ukuranBaru.pemeriksa,
        keterangan: ukuranBaru.keterangan,
        pasien_id: pasienId,
      };

      const formData = new FormData();
      formData.append("image", file);
      formData.append(
        "data",
        JSON.stringify({
          od: od,
          os: os,
          pd_jauh: parseInt(ukuranBaru.pd_jauh),
          pd_dekat: parseInt(ukuranBaru.pd_dekat),
          tanggal_periksa: ukuranBaru.tanggal_periksa,
          pemeriksa: ukuranBaru.pemeriksa,
          keterangan: ukuranBaru.keterangan,
          ukuran_lama: "n",
          optik_id: ukuranBaru.optik_id,
          pasien_id: pasienId,
        })
      );
      const response = await axios.post(URL_API + "api/rekam", formData, {
        headers: {
          Authorization: localStorage.getItem("user-ma-token"),
        },
      });
      setIsLoadingSubmit(false);
      Toast.fire({
        icon: "success",
        title: response.data.message,
      });
      await getData();
    } catch (error) {
      console.log(error.response);
    }
  };

  const getData = async () => {
    try {
      const response = await axios.get(URL_API + "api/rekam", {
        headers: {
          Authorization: localStorage.getItem("user-ma-token"),
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

  const getDataPasien = async () => {
    try {
      const response = await axios.get(URL_API + "api/pasien", {
        headers: {
          Authorization: localStorage.getItem("user-ma-token"),
        },
      });

      if (response.data.success) {
        setDataPasien(response.data.data);
        setFilterPasien(response.data.data);
      } else {
        localStorage.clear();
        return navigate("/login");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getDataOptik = async () => {
    try {
      const response = await axios.get(URL_API + "api/optik");
      setDataOptik(response.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    setIsLoading(true);
    getData();
    getDataPasien();
    getDataOptik();
    setIsLoading(false);
  }, [isLoading]);

  // Rekam Medis
  useEffect(() => {
    const result = data.filter((item) => {
      return item.nama.toLowerCase().includes(search.toLocaleLowerCase());
    });
    setFilter(result);
  }, [data, search]);

  // Data Pasien
  useEffect(() => {
    const result = dataPasien.filter((item) => {
      return item.nama.toLowerCase().includes(searchPasien.toLocaleLowerCase());
    });
    setFilterPasien(result);
  }, [dataPasien, searchPasien]);

  return (
    <LoadingOverlay
      active={isLoadingSubmit}
      spinner
      text="Loading your content..."
    >
      <div className="content-wrapper">
        <Breadcrumb title="Data Kunjungan Pasien" />
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
                      data-target="#modal-pilih-pasien"
                    >
                      <i className="fas fa-plus"></i> Tambah Kunjungan Pasien
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

        {/* Modal Konfimasi */}
        <div className="modal fade" id="modal-konfirmasi" aria-hidden="true">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-body">
                <h3>Konfirmasi Hapus</h3>
                Hapus Data Rekam Medis <b>{dataHapus.nama}</b> ?
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
                  onClick={() => hapusRekamMedis(dataHapus.id, dataHapus.image)}
                >
                  Hapus
                </button>
              </div>
            </div>
            {/* Modal Content */}
          </div>
          {/* Modal Dialog */}
        </div>

        {/* Modal Detail */}
        <div className="modal fade" id="modal-detail" aria-hidden="true">
          <div className="modal-dialog modal-dialog-scrollable">
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
                      <td>
                        {moment.utc(detail.tanggal).format("DD/MMM/YYYY")}
                      </td>
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
                          <td>Optik</td>
                          <td>:</td>
                          <td>{detail.nama_optik}</td>
                        </tr>
                        <tr>
                          <td>Pemeriksa</td>
                          <td>:</td>
                          <td>{detail.pemeriksa}</td>
                        </tr>
                        <tr>
                          <td>Keterangan</td>
                          <td>:</td>
                          <td style={{ whiteSpace: "pre-wrap" }}>
                            {detail.keterangan}
                          </td>
                        </tr>
                        <tr>
                          <td colSpan={3} className="text-center">
                            Lampiran &nbsp;
                            <i className="text-secondary">
                              (foto resep komputer)
                            </i>
                          </td>
                        </tr>
                        <tr>
                          <td colSpan={3}>
                            <div className="d-flex justify-content-center">
                              <img
                                src={detail.url}
                                className="img-fluid mx-auto shadow-lg p-3 mb-5 bg-white rounded"
                                alt=""
                              />
                            </div>
                          </td>
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

        {/* Modal Pilih Pasien */}
        <div
          className="modal fade"
          id="modal-pilih-pasien"
          data-keyboard="false"
          data-backdrop="static"
          aria-hidden="true"
        >
          <div className="modal-dialog modal-dialog-scrollable">
            <div className="modal-content">
              <div className="modal-header">
                <h4 className="modal-title">Pilih Pasien</h4>
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
                <input
                  type="text"
                  className="form-control form-control"
                  placeholder="Cari Namanya Disini..."
                  value={searchPasien}
                  onChange={(e) => setSearchPasien(e.target.value)}
                  autoFocus
                />
                <DataTable
                  columns={columnsPasien}
                  data={filterPasien}
                  pagination
                  highlightOnHover
                  customStyles={tableCustomStyles}
                />
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

        {/* Modal Ukuran Baru */}
        <div
          className="modal fade"
          id="modal-ukuran-baru"
          data-keyboard="false"
          data-backdrop="static"
          aria-hidden="true"
        >
          <div className="modal-dialog modal-dialog-scrollable">
            <div className="modal-content">
              <div className="modal-header">
                <h4 className="modal-title">Ukuran Kacamata Baru</h4>
                <button
                  type="button"
                  className="close"
                  data-dismiss="modal"
                  aria-label="Close"
                  ref={closeModal}
                ></button>
              </div>
              <div className="modal-body">
                <form
                  id="formSubmitRekam"
                  onSubmit={submitUkuranbaru}
                  autoComplete="off"
                >
                  <table className="table table-sm">
                    <tbody>
                      <tr>
                        <td>Nama</td>
                        <td>:</td>
                        <td>{dataUkuranBaru.nama}</td>
                      </tr>
                      <tr>
                        <td>Alamat</td>
                        <td>:</td>
                        <td>{dataUkuranBaru.alamat}</td>
                      </tr>
                      <tr>
                        <td>TTL</td>
                        <td>:</td>
                        <td>{dataUkuranBaru.ttl}</td>
                      </tr>
                    </tbody>
                  </table>
                  <div className="row">
                    <div className="col-1 pt-1 text-bold">OD</div>
                    <div className="col p-0">
                      <input
                        onChange={(e) => handleChangeUkuranBaru(e)}
                        value={ukuranBaru.rsph}
                        type="text"
                        className="form-control"
                        placeholder="SPH"
                        name="rsph"
                      />
                    </div>
                    <div className="col p-0">
                      <input
                        onChange={(e) => handleChangeUkuranBaru(e)}
                        value={ukuranBaru.rcyl}
                        type="text"
                        className="form-control"
                        placeholder="CYL"
                        name="rcyl"
                      />
                    </div>
                    <div className="col p-0">
                      <input
                        onChange={(e) => handleChangeUkuranBaru(e)}
                        value={ukuranBaru.raxis}
                        type="text"
                        className="form-control"
                        placeholder="AXIS"
                        name="raxis"
                      />
                    </div>
                    <div className="col p-0">
                      <input
                        onChange={(e) => handleChangeUkuranBaru(e)}
                        value={ukuranBaru.radd}
                        type="text"
                        className="form-control"
                        placeholder="ADD"
                        name="radd"
                      />
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-1 pt-1 text-bold">OS</div>
                    <div className="col p-0">
                      <input
                        onChange={(e) => handleChangeUkuranBaru(e)}
                        value={ukuranBaru.lsph}
                        type="text"
                        className="form-control"
                        placeholder="SPH"
                        name="lsph"
                      />
                    </div>
                    <div className="col p-0">
                      <input
                        onChange={(e) => handleChangeUkuranBaru(e)}
                        value={ukuranBaru.lcyl}
                        type="text"
                        className="form-control"
                        placeholder="CYL"
                        name="lcyl"
                      />
                    </div>
                    <div className="col p-0">
                      <input
                        onChange={(e) => handleChangeUkuranBaru(e)}
                        value={ukuranBaru.laxis}
                        type="text"
                        className="form-control"
                        placeholder="AXIS"
                        name="laxis"
                      />
                    </div>
                    <div className="col p-0">
                      <input
                        onChange={(e) => handleChangeUkuranBaru(e)}
                        value={ukuranBaru.ladd}
                        type="text"
                        className="form-control"
                        placeholder="ADD"
                        name="ladd"
                      />
                    </div>
                  </div>
                  <div className="form-group mb-1">
                    <label htmlFor="" className="mb-0">
                      PD :
                    </label>
                    <div className="row">
                      <div className="col">
                        <div className="form-group">
                          <input
                            onChange={(e) => handleChangeUkuranBaru(e)}
                            value={ukuranBaru.pd_jauh}
                            type="text"
                            className="form-control"
                            placeholder="PD Jauh"
                            name="pd_jauh"
                            required
                          />
                        </div>
                      </div>
                      <div className="col">
                        <div className="form-group">
                          <input
                            onChange={(e) => handleChangeUkuranBaru(e)}
                            value={ukuranBaru.pd_dekat}
                            type="text"
                            className="form-control"
                            placeholder="PD Dekat"
                            name="pd_dekat"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="form-group mb-1">
                    <label htmlFor="" className=" mb-0">
                      Tanggal Periksa :
                    </label>
                    <input
                      onChange={(e) => handleChangeUkuranBaru(e)}
                      value={ukuranBaru.tanggal_periksa}
                      type="date"
                      name="tanggal_periksa"
                      id=""
                      className="form-control"
                    />
                  </div>
                  <div className="form-group mb-1">
                    <label htmlFor="" className="mb-0">
                      Optik :
                    </label>
                    <select
                      name="optik_id"
                      id=""
                      className="form-control"
                      value={ukuranBaru.optik_id}
                      onChange={(e) => handleChangeUkuranBaru(e)}
                    >
                      <option value="" hidden>
                        --Nama Optik--
                      </option>
                      {dataOptik.map((optik, index) => (
                        <option key={index} value={optik.id}>
                          {optik.nama_optik}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group mb-1">
                    <label htmlFor="" className="mb-0">
                      Pemeriksa :
                    </label>
                    <input
                      onChange={(e) => handleChangeUkuranBaru(e)}
                      value={ukuranBaru.pemeriksa}
                      type="text"
                      name="pemeriksa"
                      id=""
                      className="form-control"
                      placeholder="Pemeriksa"
                      required
                    />
                  </div>
                  <div className="form-group mb-0">
                    <label htmlFor="" className=" mb-0">
                      Keterangan :
                    </label>
                    <textarea
                      onChange={(e) => handleChangeUkuranBaru(e)}
                      value={ukuranBaru.keterangan}
                      name="keterangan"
                      className="form-control"
                      id=""
                      cols="30"
                      rows="4"
                      placeholder={
                        "Nama Frame\nJenis Lensa\nHarga\nKeterangan Lain"
                      }
                    ></textarea>
                  </div>
                  <div className="form-group mb-0">
                    <label htmlFor="" className=" mb-0">
                      Lampiran : &nbsp;
                      <i className="text-secondary">(foto resep komputer)</i>
                    </label>
                    <input
                      type="file"
                      hidden
                      accept=".jpg,.jpeg,.png"
                      ref={uploadFile}
                      onChange={(e) => loadImage(e)}
                    />
                    <div
                      className="card"
                      onClick={() => uploadFile.current.click()}
                    >
                      {openPreview == true ? (
                        <img
                          src={preview}
                          alt=""
                          className="p-3"
                          style={{
                            borderStyle: "dashed",
                            borderColor: "grey",
                            cursor: "pointer",
                          }}
                        />
                      ) : (
                        <div
                          className="card-body bg-light d-flex justify-content-center"
                          style={{
                            borderStyle: "dashed",
                            borderColor: "grey",
                            cursor: "pointer",
                          }}
                        >
                          <div className="text-center">
                            <i className="fas fa-file-image fa-lg"></i> <br />
                            <div className="text-secondary">
                              <i>
                                Upload File *.jpg, *.jpeg, *.png Max file 3MB
                              </i>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </form>
              </div>
              <div className="modal-footer justify-content-between">
                <button
                  type="button"
                  className="btn btn-default"
                  data-dismiss="modal"
                  data-toggle="modal"
                  data-target="#modal-pilih-pasien"
                  onClick={() => handleClose()}
                >
                  Back
                </button>
                <div>
                  <button
                    type="submit"
                    form="formSubmitRekam"
                    className="btn btn-primary ml-1"
                    onClick={() => handleClose()}
                    disabled={
                      ukuranBaru.rsph.length === 0 ||
                      ukuranBaru.lsph.length === 0 ||
                      ukuranBaru.optik_id.length === 0 ||
                      file.length === 0 ||
                      ukuranBaru.pemeriksa.length === 0
                    }
                  >
                    Simpan
                  </button>
                </div>
              </div>
            </div>
            {/* Modal Content */}
          </div>
          {/* Modal Dialog */}
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

export default RekamMedis;
