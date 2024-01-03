import React, { useEffect, useState } from "react";
import useDocumentTitle from "../utils/useDocumentTitle";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const Login = () => {
  useDocumentTitle("Login");
  const API = import.meta.env.VITE_API_URL;
  const [msg, setMsg] = useState("");
  const navigate = useNavigate();
  const [dataLogin, setDataLogin] = useState({
    email: "",
    password: "",
  });

  const handleChange = async (e) => {
    setDataLogin((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(API + "api/login", {
        email: dataLogin.email,
        password: dataLogin.password,
      });
      if (response.data.succes) {
        const token = response.data.token;
        localStorage.clear();
        localStorage.setItem("user-token", token);

        setTimeout(() => {
          window.location.replace("/");
        }, 500);
      } else {
        setMsg(response.data.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const userToken = localStorage.getItem("user-token");
    if (userToken) {
      return navigate("/");
    }
  }, [navigate]);

  return (
    <div className="login-page">
      <div className="login-box">
        <div className="login-logo">
          <a href="#">
            <b>Admin</b> Murti Aji
          </a>
        </div>
        {/* /.login-logo */}
        <div className="card">
          <div className="card-body login-card-body">
            {msg && (
              <div className="alert alert-danger alert-dismissible p-2">
                <button
                  onClick={() => setMsg("")}
                  type="button"
                  className="close py-2"
                  data-dismiss="alert"
                  aria-hidden="true"
                >
                  ×
                </button>
                <i className="icon fas fa-ban"></i>
                {msg}
              </div>
            )}
            <p className="login-box-msg">Sign in to start your session</p>
            <form method="post" onSubmit={handleSubmit}>
              <div className="input-group mb-3">
                <input
                  type="email"
                  className="form-control"
                  placeholder="Email"
                  name="email"
                  value={dataLogin.email}
                  onChange={(e) => handleChange(e)}
                  required
                />
                <div className="input-group-append">
                  <div className="input-group-text">
                    <span className="fas fa-envelope" />
                  </div>
                </div>
              </div>
              <div className="input-group mb-3">
                <input
                  type="password"
                  className="form-control"
                  placeholder="Password"
                  name="password"
                  onChange={(e) => handleChange(e)}
                  required
                />
                <div className="input-group-append">
                  <div className="input-group-text">
                    <span className="fas fa-lock" />
                  </div>
                </div>
              </div>
              <div className="row">
                <button
                  type="submit"
                  className="btn btn-primary btn-block mx-2"
                >
                  Sign In
                </button>
              </div>
            </form>
          </div>
          {/* /.login-card-body */}
        </div>
      </div>
    </div>
  );
};

export default Login;
