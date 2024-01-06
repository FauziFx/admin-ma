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
    // closeModalAll.current.click();

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
