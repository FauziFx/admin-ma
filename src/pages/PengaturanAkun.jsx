import React, { useEffect, useRef, useState } from "react";
import Breadcrumb from "../components/Breadcrumb";
import useDocumentTitle from "../utils/useDocumentTitle";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import Swal from "sweetalert2/dist/sweetalert2.js";
import "sweetalert2/src/sweetalert2.scss";

const PengaturanAkun = () => {
  const URL = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();
  const backBtn = useRef(null);
  const [error, setError] = useState(false);
  const [edit, setEdit] = useState(false);
  const [user, setUser] = useState({});

  const handleChange = async (e) => {
    setUser((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
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

  const submitEdit = async (e) => {
    e.preventDefault();

    try {
      let response;
      if (user.oldPassword == "") {
        response = await axios.put(
          URL + "api/users/" + user.id,
          {
            name: user.name,
            email: user.email,
            password: "",
            role: user.role,
          },
          {
            headers: {
              Authorization: localStorage.getItem("user-token"),
            },
          }
        );
      } else {
        if (user.newPassword == "") {
          return setError(!error);
        } else {
          response = await axios.put(
            URL + "api/change_password/" + user.id,
            {
              name: user.name,
              email: user.email,
              role: user.role,
              oldPassword: user.oldPassword,
              newPassword: user.newPassword,
            },
            {
              headers: {
                Authorization: localStorage.getItem("user-token"),
              },
            }
          );
        }
      }

      if (response.data.success === true) {
        Toast.fire({
          icon: "success",
          title: response.data.message,
        });
        backBtn.current.click();
        setTimeout(() => {
          setUser((prevState) => ({
            ...prevState,
            oldPassword: "",
            newPassword: "",
          }));
        }, 1000);
      } else {
        Toast.fire({
          icon: "error",
          title: response.data.message,
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const userToken = localStorage.getItem("user-token");
    if (!userToken) {
      return navigate("/login");
    } else {
      const decode = jwtDecode(userToken);
      setUser({
        id: decode.user.id,
        name: decode.user.name,
        email: decode.user.email,
        role: decode.user.role,
        oldPassword: "",
        newPassword: "",
      });
    }
  }, []);

  useDocumentTitle("Pengaturan Akun");
  return (
    <div className="content-wrapper">
      <Breadcrumb title="Pengaturan Akun" />
      {/* Main Content */}
      <div className="content">
        <div className="container-fluid">
          <div className="row">
            <div className="col-lg-5">
              <div className="card">
                <div className="card-header">
                  <div className="card-title">
                    {edit && "Edit "}Personal Detail
                  </div>
                  {!edit && (
                    <a
                      href="#"
                      className="float-right"
                      onClick={() => setEdit(!edit)}
                    >
                      Edit
                    </a>
                  )}
                </div>
                <div className="card-body">
                  {!edit && (
                    <>
                      <div className="float-sm-left text-muted">Nama </div>
                      <div className="float-sm-right">{user.name}</div>
                      <div className="clearfix"></div>
                      <hr className="mt-0" />
                      <div className="float-sm-left text-muted">Email </div>
                      <div className="float-sm-right">{user.email}</div>
                      <div className="clearfix"></div>
                      <hr className="mt-0" />
                    </>
                  )}
                  {edit && (
                    <>
                      <form action="" onSubmit={submitEdit}>
                        <div className="form-group">
                          <label htmlFor="">Nama</label>
                          <input
                            value={user.name}
                            onChange={(e) => handleChange(e)}
                            type="text"
                            name="name"
                            className="form-control"
                            placeholder="Nama"
                            required
                          />
                        </div>

                        <div className="form-group">
                          <label htmlFor="">Email</label>
                          <input
                            value={user.email}
                            onChange={(e) => handleChange(e)}
                            type="email"
                            name="email"
                            className="form-control"
                            placeholder="email@mail.com"
                            required
                          />
                        </div>

                        <div className="form-group">
                          <label htmlFor="">
                            Password Lama <i>(Optional)</i>
                          </label>
                          <input
                            value={user.oldPassword}
                            onChange={(e) => handleChange(e)}
                            type="password"
                            name="oldPassword"
                            className="form-control"
                            placeholder="Password"
                          />
                        </div>

                        <div className="form-group">
                          <label htmlFor="">
                            Password Baru <i>(Optional)</i>
                          </label>
                          <input
                            value={user.newPassword}
                            onChange={(e) => handleChange(e)}
                            type="password"
                            name="newPassword"
                            className="form-control"
                            placeholder="Password"
                          />
                          {error && (
                            <i className="text-danger">* Tidak boleh kosong</i>
                          )}
                        </div>

                        <button
                          type="button"
                          className="btn btn-default"
                          onClick={() => {
                            setEdit(!edit);
                            setError(false);
                          }}
                          ref={backBtn}
                        >
                          Back
                        </button>

                        <button
                          type="submit"
                          className="btn btn-primary float-right"
                        >
                          Simpan
                        </button>
                      </form>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PengaturanAkun;
