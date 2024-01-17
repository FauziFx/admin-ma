import React, { useState, useEffect, useRef } from "react";
import Breadcrumb from "../components/Breadcrumb";
import DataTable from "react-data-table-component";
import useDocumentTitle from "../utils/useDocumentTitle";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const DaftarAkun = () => {
  useDocumentTitle("Daftar Akun");
  const navigate = useNavigate();
  const closeModalTambah = useRef(null);
  const closeModalEdit = useRef(null);
  const URL = import.meta.env.VITE_API_URL;
  const [dataHapus, setDataHapus] = useState({ id: 0, nama: "" });
  const [user, setUser] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [userEdit, setUserEdit] = useState({
    id: 0,
    name: "",
    email: "",
    password: "",
    role: "",
  });
  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState([]);

  const columns = [
    { name: "#", selector: (row, index) => index + 1, width: "5%" },
    { name: "Nama", selector: (row) => row.name.toUpperCase() },
    { name: "Email", selector: (row) => row.email },
    {
      name: "Role",
      selector: (row) => (
        <span
          className={
            row.role == "user" ? "badge bg-secondary" : "badge bg-primary"
          }
        >
          {row.role.toUpperCase()}
        </span>
      ),
    },
    {
      name: "Action",
      selector: (row) => (
        <>
          <button
            className="btn btn-xs btn-success mr-1"
            data-toggle="modal"
            data-target="#modal-edit"
            onClick={() =>
              setUserEdit({
                id: row.id,
                name: row.name,
                email: row.email,
                password: "",
                role: row.role,
              })
            }
          >
            Edit
          </button>
          <button
            className="btn btn-xs btn-danger"
            data-toggle="modal"
            data-target="#modal-konfirmasi"
            onClick={() => setDataHapus({ id: row.id, nama: row.name })}
          >
            Hapus
          </button>
        </>
      ),
    },
  ];

  const handleChangeUser = async (e) => {
    setUser((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const handleChangeUserEdit = async (e) => {
    setUserEdit((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const handleClose = async () => {
    closeModalTambah.current.click();
    closeModalEdit.current.click();

    setTimeout(() => {
      setUser({ name: "", email: "", password: "" });
      setUserEdit({ name: "", email: "", password: "", role: "" });
    }, 1500);
  };

  const submitUser = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(URL + "api/users", user, {
        headers: {
          Authorization: localStorage.getItem("user-token"),
        },
      });
      if (response.data.success === true) {
        alert(response.data.message);
        getData();
        handleClose();
      }
    } catch (error) {
      console.log(error);
    }
  };

  const submitUserEdit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(
        URL + "api/users/" + userEdit.id,
        {
          name: userEdit.name,
          email: userEdit.email,
          password: userEdit.password,
          role: userEdit.role,
        },
        {
          headers: {
            Authorization: localStorage.getItem("user-token"),
          },
        }
      );
      if (response.data.success === true) {
        alert(response.data.message);
        getData();
        handleClose();
      }
    } catch (error) {
      console.log(error);
    }
  };

  const hapusUser = async (id) => {
    try {
      const response = await axios.delete(URL + "api/users/" + id, {
        headers: {
          Authorization: localStorage.getItem("user-token"),
        },
      });
      if (response.data.success) {
        alert(response.data.message);
        getData();
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getData = async () => {
    try {
      const response = await axios.get(URL + "api/users", {
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
      return item.name.toLowerCase().includes(search.toLocaleLowerCase());
    });
    setFilter(result);
  }, [data, search]);

  return (
    <div className="content-wrapper">
      <Breadcrumb title="Daftar Akun" />
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
                    <i className="fas fa-plus"></i>&nbsp; Tambah User
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
                    customStyles={tableCustomStyles}
                    highlightOnHover
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
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
              <h4 className="modal-title">Tambah User</h4>
            </div>
            <form onSubmit={submitUser}>
              <div className="modal-body py-0">
                <div className="form-group mb-1">
                  <label htmlFor="" className="mb-0">
                    Nama :
                  </label>
                  <input
                    onChange={(e) => handleChangeUser(e)}
                    value={user.name}
                    type="text"
                    name="name"
                    className="form-control"
                    placeholder="Nama User"
                    required
                  />
                </div>
                <div className="form-group mb-1">
                  <label htmlFor="" className="mb-0">
                    Email :
                  </label>
                  <input
                    onChange={(e) => handleChangeUser(e)}
                    value={user.email}
                    type="email"
                    name="email"
                    className="form-control"
                    placeholder="email@mail.com"
                    required
                  />
                </div>
                <div className="form-group mb-1">
                  <label htmlFor="" className="mb-0">
                    Password :
                  </label>
                  <input
                    onChange={(e) => handleChangeUser(e)}
                    value={user.password}
                    type="password"
                    name="password"
                    className="form-control"
                    placeholder="******"
                    required
                  />
                </div>
              </div>
              <div className="modal-footer justify-content-between">
                <button
                  type="button"
                  className="btn btn-default"
                  data-dismiss="modal"
                  ref={closeModalTambah}
                  onClick={() => handleClose()}
                >
                  Close
                </button>
                <div>
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={
                      user.name.length === 0 ||
                      user.email.length === 0 ||
                      user.password.length === 0
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
              Hapus User <b>{dataHapus.nama}</b> ?
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
                onClick={() => hapusUser(dataHapus.id)}
              >
                Hapus
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
        id="modal-edit"
        data-keyboard="false"
        data-backdrop="static"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h4 className="modal-title">Tambah User</h4>
            </div>
            <form onSubmit={submitUserEdit}>
              <div className="modal-body py-0">
                <div className="form-group mb-1">
                  <label htmlFor="" className="mb-0">
                    Nama :
                  </label>
                  <input
                    onChange={(e) => handleChangeUserEdit(e)}
                    value={userEdit.name}
                    type="text"
                    name="name"
                    className="form-control"
                    placeholder="Nama User"
                    required
                  />
                </div>
                <div className="form-group mb-1">
                  <label htmlFor="" className="mb-0">
                    Email :
                  </label>
                  <input
                    onChange={(e) => handleChangeUserEdit(e)}
                    value={userEdit.email}
                    type="email"
                    name="email"
                    className="form-control"
                    placeholder="email@mail.com"
                    required
                  />
                </div>
                <div className="form-group mb-1">
                  <label htmlFor="" className="mb-0">
                    Password <i>(Optional)</i> :
                  </label>
                  <input
                    onChange={(e) => handleChangeUserEdit(e)}
                    value={userEdit.password}
                    type="password"
                    name="password"
                    className="form-control"
                    placeholder="******"
                  />
                </div>
                <div className="form-group mb-1">
                  <label htmlFor="" className="mb-0">
                    Role
                  </label>
                  <select
                    name="role"
                    id=""
                    className="form-control"
                    value={userEdit.role}
                    onChange={(e) => handleChangeUserEdit(e)}
                  >
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                  </select>
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
                  Close
                </button>
                <div>
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={
                      userEdit.name.length === 0 || userEdit.email.length === 0
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

export default DaftarAkun;
