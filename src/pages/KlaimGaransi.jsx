import React, { useState, useEffect } from "react";
import Breadcrumb from "../components/Breadcrumb";
import useDocumentTitle from "../utils/useDocumentTitle";
import axios from "axios";
import moment from "moment-timezone";
import { Link } from "react-router-dom";
import DataTable from "react-data-table-component";
import ReactPaginate from "react-paginate";
import Swal from "sweetalert2/dist/sweetalert2.js";
import "sweetalert2/src/sweetalert2.scss";
import { useNavigate } from "react-router-dom";

const KlaimGaransi = ({ isAdmin }) => {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [pages, setPages] = useState(0);
  const [rows, setRows] = useState(0);
  const [keyword, setKeyword] = useState("");

  useDocumentTitle("Data Klaim Garansi");
  const navigate = useNavigate();
  const URL = import.meta.env.VITE_API_URL;
  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");
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
        <>
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
          {isAdmin && (
            <button
              onClick={() => hapusKlaimGaransi(row.id)}
              className="btn btn-xs btn-danger mr-1"
            >
              Hapus
            </button>
          )}
        </>
      ),
    },
  ];

  const hapusKlaimGaransi = async (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "Data yang sudah dihapus tidak dapat dikembalikan!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, Hapus!",
    }).then((result) => {
      if (result.isConfirmed) {
        deleteData(id);
      }
    });
  };

  const deleteData = async (id) => {
    try {
      const response = await axios.delete(URL + "api/garansi_klaim/" + id, {
        headers: {
          Authorization: localStorage.getItem("user-ma-token"),
        },
      });

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

  const getData = async () => {
    try {
      const response = await axios.get(URL + "api/garansi_klaim_page", {
        params: {
          page: page,
          limit: limit,
          search_query: keyword,
        },
        headers: {
          Authorization: localStorage.getItem("user-ma-token"),
        },
      });
      setData(response.data.data);
      setPage(response.data.page);
      setPages(response.data.totalPage);
      setRows(response.data.totalRows);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getData();
  }, [page, keyword]);

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
                    value={keyword}
                    onChange={(e) => {
                      setPage(1);
                      setKeyword(e.target.value);
                    }}
                    autoFocus
                  />
                </div>
                <div className="card-body">
                  <DataTable
                    columns={columns}
                    data={data}
                    highlightOnHover
                    customStyles={tableCustomStyles}
                  />
                  <div className="d-flex justify-content-between">
                    <p className="text-muted">
                      Total Rows: {rows} Page: {rows ? page : 0} of {pages}
                    </p>
                    <div>
                      <nav aria-label="Page navigation example">
                        <ReactPaginate
                          previousLabel={
                            <i className="fas fa-angle-double-left"></i>
                          }
                          nextLabel={
                            <i className="fas fa-angle-double-right"></i>
                          }
                          previousClassName="page-item"
                          nextClassName="page-item"
                          previousLinkClassName="page-link"
                          nextLinkClassName="page-link"
                          pageCount={pages}
                          pageRangeDisplayed={5}
                          marginPagesDisplayed={2}
                          // onPageChange={changePage}
                          containerClassName="pagination"
                          pageClassName="page-item"
                          pageLinkClassName="page-link"
                          activeClassName="page-item active"
                        />
                      </nav>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal Detail */}
      <div className="modal fade" id="modal-detail" aria-hidden="true">
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
