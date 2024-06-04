import React, { useEffect, useState, useRef } from "react";
import Breadcrumb from "../components/Breadcrumb";
import useDocumentTitle from "../utils/useDocumentTitle";
import moment from "moment-timezone";
import "moment/dist/locale/id";
import DataTable from "react-data-table-component";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import LoadingOverlay from "react-loading-overlay-ts";
import Swal from "sweetalert2/dist/sweetalert2.js";
import "sweetalert2/src/sweetalert2.scss";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";

const Pasien = () => {
  useDocumentTitle("Data Pasien");
  const list = [
    { name: "Hipertensi", check: false },
    { name: "Gula Darah", check: false },
    { name: "Kecelakaan", check: false },
    { name: "Operasi Mata", check: false },
    { name: "Katarak", check: false },
  ];
  const [checkItem, setCheckItem] = useState([
    ...list.map((x, id) => ({ id, ...x })),
  ]);
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingDetail, setIsLoadingDetail] = useState(false);
  const [isLoadingEdit, setIsLoadingEdit] = useState(false);
  const [isLoadingSubmit, setIsLoadingSubmit] = useState(false);
  const URL_API = import.meta.env.VITE_API_URL;
  const closeModalPasien = useRef(null);
  const closeModalAll = useRef(null);
  const closeModalEdit = useRef(null);
  const uploadFile = useRef(null);
  const [file, setFile] = useState("");
  const [preview, setPreview] = useState("");
  const [openPreview, setOpenPreview] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [dataOptik, setDataOptik] = useState([]);
  const [usia, setUsia] = useState("");
  const [pasienId, setPasienId] = useState(0);
  const [dataHapus, setDataHapus] = useState({ id: 0, nama: "" });
  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState([]);
  const [detail, setDetail] = useState({
    nama: "",
    alamat: "",
    ttl: "",
    usia: "",
    jenis_kelamin: "",
    pekerjaan: "",
    nohp: "",
    riwayat: "",
    tanggal: "",
    data_rekam: [],
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
    optik_id: "",
    keterangan: "",
  });

  const handleChangeUsiaPasien = async (e) => {
    const tahun_lahir = new Date().getFullYear() - e.target.value;
    setUsia(e.target.value);
    setPasien((prevState) => ({
      ...prevState,
      tanggal_lahir: tahun_lahir + "-01-01",
    }));
  };

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
    closeModalEdit.current.click();
    setCheckItem((prev) => [
      ...prev.map(({ check, ...rest }) => ({
        ...rest,
        check: false,
      })),
    ]);
    setUsia("");

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
      setOpenPreview(false);
      setFile("");
    }, 1500);
  };

  const columns = [
    // {
    //   name: "Tanggal",
    //   selector: (row) => moment.utc(row.tanggal).format("DD/MM/YYYY"),
    //   sortable: true,
    // },
    {
      name: "Nama",
      selector: (row) => row.nama.toUpperCase(),
      sortable: true,
    },
    {
      name: "TTL",
      selector: (row) => row.ttl,
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
            className="btn btn-xs btn-info mr-1"
            onClick={() => showDetail(row)}
            data-toggle="modal"
            data-target="#modal-detail"
          >
            Detail
          </button>
          <button
            className="btn btn-xs btn-success mr-1"
            data-toggle="modal"
            data-target="#modal-edit"
            onClick={() => {
              setIsLoadingEdit(true);
              setPasienId(row.id);
              let date = new Date(row.ttl.split(",")[1]);
              setPasien({
                nama: row.nama,
                alamat: row.alamat,
                tempat: row.ttl.split(",")[0],
                tanggal_lahir: moment(date).format("YYYY-MM-DD"),
                jenis_kelamin: row.jenis_kelamin,
                pekerjaan: row.pekerjaan,
                nohp: row.nohp,
                riwayat: row.riwayat,
              });
              const arr = row.riwayat.split(",");
              const result = checkItem.map((item) => {
                const found = arr.find((s) => s === item.name);
                if (found) {
                  return { ...item, check: true };
                }
                return { ...item };
              });
              setCheckItem(result);
              setIsLoadingEdit(false);
            }}
          >
            Edit
          </button>
          <button
            className="btn btn-xs btn-danger mr-1"
            data-toggle="modal"
            data-target="#modal-konfirmasi"
            onClick={() => setDataHapus({ id: row.id, nama: row.nama })}
          >
            Hapus
          </button>
        </>
      ),
      width: "auto",
    },
  ];

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

  const Toast = Swal.mixin({
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
  });

  const showDetail = async (row) => {
    setIsLoadingDetail(true);
    try {
      const response = await axios.get(URL_API + "api/rekam/" + row.id, {
        headers: {
          Authorization: localStorage.getItem("user-ma-token"),
        },
      });
      if (response.data.success) {
        const ttl = row.ttl;
        const year = ttl.substr(ttl.length - 5);
        const usia = Math.abs(year - new Date().getFullYear());
        setDetail({
          nama: row.nama,
          alamat: row.alamat,
          ttl: row.ttl,
          usia: usia,
          jenis_kelamin: row.jenis_kelamin,
          pekerjaan: row.pekerjaan,
          nohp: row.nohp,
          riwayat: row.riwayat,
          tanggal: row.tanggal,
          data_rekam: response.data.data,
        });
        setIsLoadingDetail(false);
      } else {
        localStorage.clear();
        return navigate("/login");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const submitEditPasien = async (e) => {
    e.preventDefault();
    setIsLoadingSubmit(true);
    const ttl =
      pasien.tempat +
      ", " +
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
      const response = await axios.put(
        URL_API + "api/pasien/" + pasienId,
        data,
        {
          headers: {
            Authorization: localStorage.getItem("user-ma-token"),
          },
        }
      );

      if (response.data.success === true) {
        setIsLoadingSubmit(false);
        getData();
        Toast.fire({
          icon: "success",
          title: response.data.message,
        });
      }
    } catch (error) {
      setIsLoadingSubmit(false);
      console.log(error);
    }
  };

  const simpanPasien = async (e) => {
    e.preventDefault();
    setCheckItem((prev) => [
      ...prev.map(({ check, ...rest }) => ({
        ...rest,
        check: false,
      })),
    ]);
    setIsLoadingSubmit(true);
    await submitPasien(e);
    await getData();
    setUsia("");
    setIsLoadingSubmit(false);
    Toast.fire({
      icon: "success",
      title: "Data berhasil Disimpan!",
    });
  };

  const submitPasien = async (e) => {
    e.preventDefault();
    moment.locale("id");
    const ttl =
      pasien.tempat +
      ", " +
      moment(pasien.tanggal_lahir).format("DD MMMM YYYY");
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
      const response = await axios.post(URL_API + "api/pasien", data, {
        headers: {
          Authorization: localStorage.getItem("user-ma-token"),
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
        URL_API + "api/rekam_lama",
        {
          od: od,
          os: os,
          pd_jauh: parseInt(ukuranLama.pd_jauh),
          pd_dekat: parseInt(ukuranLama.pd_dekat),
          pemeriksa: "",
          keterangan: ukuranLama.keterangan,
          ukuran_lama: "y",
          optik_id: null,
          pasien_id: pasien_id,
        },
        {
          headers: {
            Authorization: localStorage.getItem("user-ma-token"),
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
          pasien_id: pasien_id,
        })
      );

      const response = await axios.post(URL_API + "api/rekam", formData, {
        headers: {
          Authorization: localStorage.getItem("user-ma-token"),
        },
      });
    } catch (error) {
      console.log(error);
    }
  };

  const submitRekamMedis = async (e) => {
    e.preventDefault();
    setIsLoadingSubmit(true);
    const pasien_id = await submitPasien(e);

    if (ukuranLama.rsph.length !== 0) {
      await submitUkuranLama(pasien_id);
    }
    await submitUkuranbaru(pasien_id);
    await getData();
    setIsLoadingSubmit(false);
    Toast.fire({
      icon: "success",
      title: "Data berhasil Disimpan!",
    });
  };

  const getDataOptik = async () => {
    try {
      const response = await axios.get(URL_API + "api/optik");
      setDataOptik(response.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  const getData = async () => {
    try {
      const response = await axios.get(URL_API + "api/pasien", {
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

  const hapusPasien = async (id) => {
    try {
      const response = await axios.delete(URL_API + "api/pasien/" + id, {
        headers: {
          Authorization: localStorage.getItem("user-ma-token"),
        },
      });
      if (response.data.success) {
        Toast.fire({
          icon: "success",
          title: "Data berhasil Dihapus!",
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

  useEffect(() => {
    setIsLoading(true);
    getData();
    getDataOptik();
    setIsLoading(false);
  }, [isLoading]);

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
                      <i className="fas fa-plus"></i>&nbsp; Pendaftaran Pasien
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
                Hapus Semua Data Rekam Medis <b>{dataHapus.nama}</b> ?
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
                  onClick={() => hapusPasien(dataHapus.id)}
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
                <h4 className="modal-title">Edit Pasien</h4>
              </div>
              <form onSubmit={submitEditPasien} autoComplete="off">
                <div className="modal-body modal-body-scroll py-0">
                  <LoadingOverlay
                    active={isLoadingEdit}
                    spinner
                    text="Loading your content..."
                  >
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
                      <div className="px-3">
                        <div className="custom-control custom-radio custom-control-inline w-50">
                          <input
                            type="radio"
                            id="customRadioInline1"
                            name="jenis_kelamin"
                            className="custom-control-input"
                            value="Laki-laki"
                            checked={pasien.jenis_kelamin === "Laki-laki"}
                            onChange={(e) => handleChangePasien(e)}
                          />
                          <label
                            className="custom-control-label"
                            htmlFor="customRadioInline1"
                          >
                            Laki-laki
                          </label>
                        </div>
                        <div className="custom-control custom-radio custom-control-inline">
                          <input
                            type="radio"
                            id="customRadioInline2"
                            name="jenis_kelamin"
                            className="custom-control-input"
                            value="Perempuan"
                            checked={pasien.jenis_kelamin === "Perempuan"}
                            onChange={(e) => handleChangePasien(e)}
                          />
                          <label
                            className="custom-control-label"
                            htmlFor="customRadioInline2"
                          >
                            Perempuan
                          </label>
                        </div>
                      </div>
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
                      <div className="row px-3">
                        {checkItem.map((item, i) => {
                          return (
                            <div
                              className="custom-control custom-checkbox my-2 col-6"
                              key={i}
                            >
                              <input
                                className="custom-control-input"
                                type="checkbox"
                                value={item.name}
                                id={"defaultCheck" + item.id}
                                onChange={(e) => {
                                  const curr = checkItem;
                                  curr[item.id].check = !curr[item.id].check;
                                  setCheckItem([...curr]);
                                  const arr = curr
                                    .filter(function (item) {
                                      return item.check == true;
                                    })
                                    .map((items) => {
                                      return items.name;
                                    });
                                  setPasien((prevState) => ({
                                    ...prevState,
                                    riwayat: arr.toString(),
                                  }));
                                }}
                                checked={item.check}
                              />
                              <label
                                className="custom-control-label ml-2"
                                htmlFor={"defaultCheck" + item.id}
                              >
                                {item.name}
                              </label>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </LoadingOverlay>
                </div>
                <div className="modal-footer justify-content-between">
                  <button
                    type="button"
                    className="btn btn-default"
                    data-dismiss="modal"
                    ref={closeModalEdit}
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
                  </div>
                </div>
              </form>
            </div>
            {/* Modal Content */}
          </div>
          {/* Modal Dialog */}
        </div>

        {/* Modal Detail */}
        <div className="modal fade" id="modal-detail" aria-hidden="true">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h4 className="modal-title">Detail</h4>
              </div>
              <div className="modal-body modal-body-overflow">
                <LoadingOverlay
                  active={isLoadingDetail}
                  spinner
                  text="Loading your content..."
                >
                  <table id="table-detail" className=" table table-sm">
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
                        <td>{detail.nama.toUpperCase()}</td>
                      </tr>
                      <tr>
                        <td>Alamat</td>
                        <td>:</td>
                        <td>{detail.alamat}</td>
                      </tr>
                      <tr>
                        <td>Usia</td>
                        <td>:</td>
                        <td>{detail.usia} Tahun</td>
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
                        <td>
                          {detail.riwayat.split(",").map((item, index) => (
                            <ul key={index} className="pl-3 my-0">
                              <li>{item}</li>
                            </ul>
                          ))}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                  {detail.data_rekam.length !== 0 &&
                    detail.data_rekam.map((data) => (
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
                                # {moment(data.tanggal).format("DD MMMM YYYY")}
                                {data.ukuran_lama === "y" ? (
                                  <small className="text-dark">
                                    &nbsp;(Ukuran Lama)
                                  </small>
                                ) : (
                                  ""
                                )}
                              </button>
                            </h2>
                          </div>

                          <div
                            id={"collapse-" + data.id}
                            className="collapse"
                            aria-labelledby={"heading-" + data.id}
                            data-parent="#accordionExample"
                          >
                            <div className="card-body py-1">
                              <table className="mb-1">
                                <tbody>
                                  {data.optik_id !== null && (
                                    <tr>
                                      <td>
                                        <b>Optik</b>
                                      </td>
                                      <td>:</td>
                                      <td>{data.nama_optik}</td>
                                    </tr>
                                  )}
                                  <tr>
                                    <td>
                                      <b>Pemeriksa</b>
                                    </td>
                                    <td>:</td>
                                    <td>{data.pemeriksa}</td>
                                  </tr>
                                  <tr>
                                    <td>
                                      <b>Keterangan</b>
                                    </td>
                                    <td>:</td>
                                    <td style={{ whiteSpace: "pre-wrap" }}>
                                      {data.keterangan}
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                              <table className="table-small">
                                <thead>
                                  <tr>
                                    <th></th>
                                    <th>Sph</th>
                                    <th>Cyl</th>
                                    <th>Axis</th>
                                    <th>Add</th>
                                    <th>PD</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  <tr>
                                    <td>OD</td>
                                    <td>{data.od.split("/")[0]}</td>
                                    <td>{data.od.split("/")[1]}</td>
                                    <td>{data.od.split("/")[2]}</td>
                                    <td>{data.od.split("/")[3]}</td>
                                    <td rowSpan={2}>
                                      {data.pd_jauh !== null && data.pd_jauh}/
                                      {data.pd_dekat !== null && data.pd_dekat}
                                    </td>
                                  </tr>
                                  <tr>
                                    <td>OS</td>
                                    <td>{data.os.split("/")[0]}</td>
                                    <td>{data.os.split("/")[1]}</td>
                                    <td>{data.os.split("/")[2]}</td>
                                    <td>{data.os.split("/")[3]}</td>
                                  </tr>
                                </tbody>
                              </table>
                              {data.ukuran_lama === "n" && (
                                <div className="d-flex justify-content-center">
                                  <img
                                    src={data.url}
                                    alt=""
                                    className="img-fluid my-2 text-center mx-auto shadow-lg p-2 bg-white rounded"
                                  />
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                </LoadingOverlay>
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
                <button
                  type="button"
                  className="close"
                  data-dismiss="modal"
                  aria-label="Close"
                  onClick={() => handleClose()}
                >
                  <span aria-hidden="true">×</span>
                </button>
              </div>
              <form onSubmit={simpanPasien} autoComplete="off">
                <div className="modal-body modal-body-scroll py-0">
                  <div className="form-group mb-0">
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
                  <div className="form-group mb-0">
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
                  <div className="form-group mb-0">
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
                      Usia :
                    </label>
                    <div className="input-group">
                      <input
                        onChange={(e) => handleChangeUsiaPasien(e)}
                        value={usia}
                        type="number"
                        className="form-control"
                        name="usia"
                        placeholder="Usia"
                      />
                      <span className="input-group-text">Tahun</span>
                    </div>
                  </div>
                  <div className="form-group mb-0">
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
                  <div className="form-group mb-0 pb-2">
                    <label htmlFor="" className="mb-2">
                      Jenis Kelamin :
                    </label>
                    <div className="px-3">
                      <div className="custom-control custom-radio custom-control-inline w-50">
                        <input
                          type="radio"
                          id="customRadioInline1"
                          name="jenis_kelamin"
                          className="custom-control-input"
                          value="Laki-laki"
                          checked={pasien.jenis_kelamin === "Laki-laki"}
                          onChange={(e) => handleChangePasien(e)}
                        />
                        <label
                          className="custom-control-label"
                          htmlFor="customRadioInline1"
                        >
                          Laki-laki
                        </label>
                      </div>
                      <div className="custom-control custom-radio custom-control-inline">
                        <input
                          type="radio"
                          id="customRadioInline2"
                          name="jenis_kelamin"
                          className="custom-control-input"
                          value="Perempuan"
                          checked={pasien.jenis_kelamin === "Perempuan"}
                          onChange={(e) => handleChangePasien(e)}
                        />
                        <label
                          className="custom-control-label"
                          htmlFor="customRadioInline2"
                        >
                          Perempuan
                        </label>
                      </div>
                    </div>
                  </div>
                  <div className="form-group mb-0">
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
                  <div className="form-group mb-0">
                    <label htmlFor="" className="mb-0">
                      No Hp : <small>Isi &quot;0&quot; jika tidak ada</small>
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
                  <div className="form-group mb-2">
                    <label htmlFor="" className="mb-0 mt-2">
                      Riwayat Penyakit :
                    </label>
                    <div className="row px-3">
                      {checkItem.map((item, i) => {
                        return (
                          <div
                            className="custom-control custom-checkbox my-2 col-6"
                            key={i}
                          >
                            <input
                              className="custom-control-input"
                              type="checkbox"
                              value={item.name}
                              id={"defaultCheck" + item.id}
                              onChange={(e) => {
                                const curr = checkItem;
                                curr[item.id].check = !curr[item.id].check;
                                setCheckItem([...curr]);
                                const arr = curr
                                  .filter(function (item) {
                                    return item.check == true;
                                  })
                                  .map((items) => {
                                    return items.name;
                                  });
                                setPasien((prevState) => ({
                                  ...prevState,
                                  riwayat: arr.toString(),
                                }));
                              }}
                              checked={item.check}
                            />
                            <label
                              className="custom-control-label ml-2"
                              htmlFor={"defaultCheck" + item.id}
                            >
                              {item.name}
                            </label>
                          </div>
                        );
                      })}
                    </div>
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
          <div className="modal-dialog modal-dialog-scrollable">
            <div className="modal-content">
              <div className="modal-header">
                <h4 className="modal-title">Ukuran Kacamata Lama</h4>
              </div>
              <div className="modal-body">
                <form
                  id="formUkuranKacamataLama"
                  action="post"
                  autoComplete="off"
                >
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
                </form>
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
                  ref={closeModalAll}
                ></button>
              </div>
              <div className="modal-body">
                <form
                  id="formUkuranKacamataBaru"
                  action="post"
                  onSubmit={submitRekamMedis}
                  autoComplete="off"
                >
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
                      Lampiran :
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
                  data-target="#modal-ukuran-lama"
                >
                  Back
                </button>
                <div>
                  <button
                    type="submit"
                    form="formUkuranKacamataBaru"
                    className="btn btn-primary ml-1"
                    onClick={() => handleClose()}
                    disabled={
                      ukuranBaru.rsph.length === 0 ||
                      ukuranBaru.lsph.length === 0 ||
                      ukuranBaru.optik_id.length === 0 ||
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

export default Pasien;
