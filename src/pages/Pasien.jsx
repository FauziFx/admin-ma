import React, { useEffect, useState, useRef } from "react";
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
  const closeModalPasien = useRef(null);
  const closeModalAll = useRef(null);
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
  const [pasien, setPasien] = useState({
    nama: "",
    alamat: "",
    tempat: "",
    tanggal_lahir: "",
    jenis_kelamin: "",
    pekerjaan: "",
    nohp: "",
    riwayat: "",
  });
  const [ukuranLama, setUkuranLama] = useState({
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
    ukuran_lama: "y",
    keterangan: "",
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
    tanggal_periksa: "",
    pemeriksa: "",
    keterangan: "",
  });

  const handleChangePasien = async (e) => {
    setPasien((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const handleChangeUkuranLama = async (e) => {
    setUkuranLama((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const handleChangeUkuranBaru = async (e) => {
    setUkuranBaru((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const handleClose = async () => {
    closeModalPasien.current.click();
    closeModalAll.current.click();

    setTimeout(() => {
      setPasien({
        nama: "",
        alamat: "",
        tempat: "",
        tanggal_lahir: "",
        jenis_kelamin: "",
        pekerjaan: "",
        nohp: "",
        riwayat: "",
      });
      setUkuranLama({
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
        ukuran_lama: "y",
        keterangan: "",
      });
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
        tanggal_periksa: "",
        pemeriksa: "",
        keterangan: "",
      });
    }, 2000);
  };

  const columns = [
    {
      name: "Tanggal",
      selector: (row) => moment.utc(row.tanggal).format("DD/MM/YYYY"),
      sortable: true,
    },
    {
      name: "Nama",
      selector: (row) => row.nama.toUpperCase(),
      sortable: true,
    },
    {
      name: "Alamat",
      selector: (row) => row.alamat.toUpperCase(),
      sortable: true,
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

  const simpanPasien = async (e) => {
    e.preventDefault();
    await submitPasien(e);
    await getData();
  };

  const submitPasien = async (e) => {
    e.preventDefault();
    const ttl =
      pasien.tempat +
      " " +
      moment(pasien.tanggal_lahir).locale("id").format("DD MMMM YYYY");
    const data = {
      nama: pasien.nama,
      alamat: pasien.alamat,
      ttl: ttl,
      jenis_kelamin: pasien.jenis_kelamin,
      pekerjaan: pasien.pekerjaan,
      nohp: pasien.nohp,
      riwayat: pasien.riwayat,
    };

    try {
      const response = await axios.post(URL + "api/pasien", data, {
        headers: {
          Authorization: localStorage.getItem("user-token"),
        },
      });
      if (response.data.success === true) {
        return response.data.id;
      }
    } catch (error) {
      console.log(error);
    }
  };

  const submitUkuranLama = async (pasien_id) => {
    try {
      const od = [
        ukuranLama.rsph,
        ukuranLama.rcyl,
        ukuranLama.raxis,
        ukuranLama.radd,
      ].join("/");
      const os = [
        ukuranLama.lsph,
        ukuranLama.lcyl,
        ukuranLama.laxis,
        ukuranLama.ladd,
      ].join("/");
      const response = await axios.post(
        URL + "api/rekam",
        {
          od: od,
          os: os,
          pd_jauh: parseInt(ukuranLama.pd_jauh),
          pd_dekat: parseInt(ukuranLama.pd_dekat),
          keterangan: ukuranLama.keterangan,
          ukuran_lama: "y",
          pasien_id: pasien_id,
        },
        {
          headers: {
            Authorization: localStorage.getItem("user-token"),
          },
        }
      );
    } catch (error) {
      console.log(error);
    }
  };

  const submitUkuranbaru = async (pasien_id) => {
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

      const response = await axios.post(
        URL + "api/rekam",
        {
          od: od,
          os: os,
          pd_jauh: parseInt(ukuranBaru.pd_jauh),
          pd_dekat: parseInt(ukuranBaru.pd_dekat),
          tanggal_periksa: ukuranBaru.tanggal_periksa,
          pemeriksa: ukuranBaru.pemeriksa,
          keterangan: ukuranBaru.keterangan,
          pasien_id: pasien_id,
        },
        {
          headers: {
            Authorization: localStorage.getItem("user-token"),
          },
        }
      );
    } catch (error) {
      console.log(error);
    }
  };

  const submitRekamMedis = async (e) => {
    e.preventDefault();
    const pasien_id = await submitPasien(e);

    await submitUkuranbaru(pasien_id);
    if (ukuranLama.rsph.length !== 0) {
      await submitUkuranLama(pasien_id);
    }
    alert("Data Berhasil Disimpan...!");
    await getData();
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
              <h4 className="modal-title">Tambah Pasien</h4>
            </div>
            <form onSubmit={simpanPasien}>
              <div className="modal-body py-0">
                <div className="form-group mb-1">
                  <label htmlFor="" className="mb-0">
                    Nama :
                  </label>
                  <input
                    onChange={(e) => handleChangePasien(e)}
                    value={pasien.nama}
                    type="text"
                    name="nama"
                    className="form-control"
                    placeholder="Nama pasien"
                    required
                  />
                </div>
                <div className="form-group mb-1">
                  <label htmlFor="" className="mb-0">
                    Alamat :
                  </label>
                  <textarea
                    onChange={(e) => handleChangePasien(e)}
                    value={pasien.alamat}
                    name="alamat"
                    id=""
                    cols="30"
                    rows="2"
                    className="form-control"
                    placeholder="Alamat"
                    required
                  ></textarea>
                </div>
                <div className="form-group mb-1">
                  <label htmlFor="" className="mb-0">
                    Tempat Lahir :
                  </label>
                  <input
                    onChange={(e) => handleChangePasien(e)}
                    value={pasien.tempat}
                    type="text"
                    className="form-control"
                    name="tempat"
                    placeholder="Tempat Lahir"
                    required
                  />
                </div>
                <div className="form-group mb-1">
                  <label htmlFor="" className="mb-0">
                    Tanggal Lahir :
                  </label>
                  <input
                    onChange={(e) => handleChangePasien(e)}
                    value={pasien.tanggal_lahir}
                    type="date"
                    className="form-control"
                    name="tanggal_lahir"
                    required
                  />
                </div>
                <div className="form-group mb-1">
                  <label htmlFor="" className="mb-0">
                    Jenis Kelamin :
                  </label>
                  <select
                    onChange={(e) => handleChangePasien(e)}
                    value={pasien.jenis_kelamin}
                    name="jenis_kelamin"
                    id=""
                    className="form-control"
                    required
                  >
                    <option value="">-Jenis Kelamin-</option>
                    <option value="Laki-laki">Laki-laki</option>
                    <option value="Perempuan">Perempuan</option>
                  </select>
                </div>
                <div className="form-group mb-1">
                  <label htmlFor="" className="mb-0">
                    Pekerjaan :
                  </label>
                  <input
                    onChange={(e) => handleChangePasien(e)}
                    value={pasien.pekerjaan}
                    type="text"
                    name="pekerjaan"
                    className="form-control"
                    placeholder="Pekerjaan"
                    required
                  />
                </div>
                <div className="form-group mb-1">
                  <label htmlFor="" className="mb-0">
                    No Hp :
                  </label>
                  <input
                    onChange={(e) => handleChangePasien(e)}
                    value={pasien.nohp}
                    type="number"
                    name="nohp"
                    className="form-control"
                    placeholder="08xxxx"
                    required
                  />
                </div>
                <div className="form-group mb-1">
                  <label htmlFor="" className="mb-0">
                    Riwayat Penyakit :
                  </label>
                  <select
                    onChange={(e) => handleChangePasien(e)}
                    value={pasien.riwayat}
                    name="riwayat"
                    id=""
                    className="form-control"
                    required
                  >
                    <option value="-">Tidak ada</option>
                    <option value="Hipertensi">Hipertensi</option>
                    <option value="Gula Darah">Gula Darah</option>
                    <option value="Kecelakaan">Kecelakaan</option>
                    <option value="Operasi Mata">Operasi Mata</option>
                    <option value="Katarak">Katarak </option>
                  </select>
                </div>
              </div>
              <div className="modal-footer justify-content-between">
                <button
                  type="button"
                  className="btn btn-default"
                  data-dismiss="modal"
                  ref={closeModalPasien}
                  onClick={() => handleClose()}
                >
                  Close
                </button>
                <div>
                  <button
                    type="submit"
                    className="btn btn-success"
                    onClick={() => handleClose()}
                    disabled={
                      pasien.nama.length === 0 ||
                      pasien.alamat.length === 0 ||
                      pasien.tempat.length === 0 ||
                      pasien.tanggal_lahir.length === 0 ||
                      pasien.jenis_kelamin.length === 0 ||
                      pasien.pekerjaan.length === 0 ||
                      pasien.nohp.length === 0
                    }
                  >
                    Simpan
                  </button>
                  <button
                    className="btn btn-primary ml-1"
                    data-dismiss="modal"
                    data-toggle="modal"
                    data-target="#modal-ukuran-lama"
                    disabled={
                      pasien.nama.length === 0 ||
                      pasien.alamat.length === 0 ||
                      pasien.tempat.length === 0 ||
                      pasien.tanggal_lahir.length === 0 ||
                      pasien.jenis_kelamin.length === 0 ||
                      pasien.pekerjaan.length === 0 ||
                      pasien.nohp.length === 0
                    }
                  >
                    Next <i className="fas fa-chevron-right fa-xs"></i>
                  </button>
                </div>
              </div>
            </form>
          </div>
          {/* Modal Content */}
        </div>
        {/* Modal Dialog */}
      </div>

      {/* Modal Ukuran Lama */}
      <div
        className="modal fade"
        id="modal-ukuran-lama"
        data-keyboard="false"
        data-backdrop="static"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h4 className="modal-title">Ukuran Kacamata Lama</h4>
            </div>
            <form action="post">
              <div className="modal-body">
                <div className="row">
                  <div className="col-1 pt-1 text-bold">OD</div>
                  <div className="col p-0">
                    <input
                      onChange={(e) => handleChangeUkuranLama(e)}
                      value={ukuranLama.rsph}
                      type="text"
                      className="form-control"
                      placeholder="SPH"
                      name="rsph"
                    />
                  </div>
                  <div className="col p-0">
                    <input
                      onChange={(e) => handleChangeUkuranLama(e)}
                      value={ukuranLama.rcyl}
                      type="text"
                      className="form-control"
                      placeholder="CYL"
                      name="rcyl"
                    />
                  </div>
                  <div className="col p-0">
                    <input
                      onChange={(e) => handleChangeUkuranLama(e)}
                      value={ukuranLama.raxis}
                      type="text"
                      className="form-control"
                      placeholder="AXIS"
                      name="raxis"
                    />
                  </div>
                  <div className="col p-0">
                    <input
                      onChange={(e) => handleChangeUkuranLama(e)}
                      value={ukuranLama.radd}
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
                      onChange={(e) => handleChangeUkuranLama(e)}
                      value={ukuranLama.lsph}
                      type="text"
                      className="form-control"
                      placeholder="SPH"
                      name="lsph"
                    />
                  </div>
                  <div className="col p-0">
                    <input
                      onChange={(e) => handleChangeUkuranLama(e)}
                      value={ukuranLama.lcyl}
                      type="text"
                      className="form-control"
                      placeholder="CYL"
                      name="lcyl"
                    />
                  </div>
                  <div className="col p-0">
                    <input
                      onChange={(e) => handleChangeUkuranLama(e)}
                      value={ukuranLama.laxis}
                      type="text"
                      className="form-control"
                      placeholder="AXIS"
                      name="laxis"
                    />
                  </div>
                  <div className="col p-0">
                    <input
                      onChange={(e) => handleChangeUkuranLama(e)}
                      value={ukuranLama.ladd}
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
                          onChange={(e) => handleChangeUkuranLama(e)}
                          value={ukuranLama.pd_jauh}
                          type="text"
                          className="form-control"
                          placeholder="PD Jauh"
                          name="pd_jauh"
                        />
                      </div>
                    </div>
                    <div className="col">
                      <div className="form-group">
                        <input
                          onChange={(e) => handleChangeUkuranLama(e)}
                          value={ukuranLama.pd_dekat}
                          type="text"
                          className="form-control"
                          placeholder="PD Dekat"
                          name="pd_dekat"
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="form-group">
                  <label htmlFor="">Keluhan :</label>
                  <textarea
                    onChange={(e) => handleChangeUkuranLama(e)}
                    value={ukuranLama.keterangan}
                    name="keterangan"
                    className="form-control"
                    id=""
                    cols="30"
                    rows="2"
                    placeholder="Keluhan / Keterangan lain"
                  ></textarea>
                </div>
              </div>
              <div className="modal-footer justify-content-between">
                <button
                  type="button"
                  className="btn btn-default"
                  data-dismiss="modal"
                  data-toggle="modal"
                  data-target="#modal-tambah"
                >
                  Back
                </button>
                <div>
                  <button
                    type="button"
                    className="btn btn-secondary ml-1"
                    data-dismiss="modal"
                    data-toggle="modal"
                    data-target="#modal-ukuran-baru"
                    onClick={() => {
                      setUkuranLama({
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
                        keterangan: "",
                      });
                      setUkuranBaru((ukuranBaru) => ({
                        ...ukuranBaru,
                        ...{
                          tanggal_periksa: moment()
                            .locale("id")
                            .format("YYYY-MM-DD"),
                        },
                      }));
                    }}
                    disabled={
                      ukuranLama.rsph.length !== 0 &&
                      ukuranLama.lsph.length !== 0
                    }
                  >
                    Skip
                  </button>
                  <button
                    className="btn btn-primary ml-1"
                    data-dismiss="modal"
                    data-toggle="modal"
                    data-target="#modal-ukuran-baru"
                    disabled={
                      ukuranLama.rsph.length === 0 ||
                      ukuranLama.lsph.length === 0
                    }
                    onClick={() =>
                      setUkuranBaru((ukuranBaru) => ({
                        ...ukuranBaru,
                        ...{
                          tanggal_periksa: moment()
                            .locale("id")
                            .format("YYYY-MM-DD"),
                        },
                      }))
                    }
                  >
                    Next <i className="fas fa-chevron-right fa-xs"></i>
                  </button>
                </div>
              </div>
            </form>
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
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h4 className="modal-title">Ukuran Kacamata Baru</h4>
              <button
                type="button"
                className="close"
                data-dismiss="modal"
                aria-label="Close"
                ref={closeModalAll}
              ></button>
            </div>
            <form action="post" onSubmit={submitRekamMedis}>
              <div className="modal-body">
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
                    rows="2"
                    placeholder="Keluhan / Keterangan lain"
                  ></textarea>
                </div>
              </div>
              <div className="modal-footer justify-content-between">
                <button
                  type="button"
                  className="btn btn-default"
                  data-dismiss="modal"
                  data-toggle="modal"
                  data-target="#modal-ukuran-lama"
                >
                  Back
                </button>
                <div>
                  <button
                    type="submit"
                    className="btn btn-primary ml-1"
                    onClick={() => handleClose()}
                    disabled={
                      ukuranBaru.rsph.length === 0 ||
                      ukuranBaru.lsph.length === 0 ||
                      ukuranBaru.pemeriksa.length === 0
                    }
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

export default Pasien;
