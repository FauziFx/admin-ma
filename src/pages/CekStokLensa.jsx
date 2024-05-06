import React, { useEffect, useState } from "react";
import useDocumentTitle from "../utils/useDocumentTitle";
import Breadcrumb from "../components/Breadcrumb";
import DataTable from "react-data-table-component";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import LoadingOverlay from "react-loading-overlay-ts";

const CekStokLensa = () => {
  useDocumentTitle("Cek Stok Lensa 1");
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const getData = async () => {
    try {
      const URL = import.meta.env.VITE_API_URL;
      const response = await axios.post(
        URL + "api/stok",
        {
          power: search,
        },
        {
          headers: {
            Authorization: localStorage.getItem("user-ma-token"),
          },
        }
      );
      if (response.data.success) {
        setData(response.data.data);
        setIsLoading(false);
      } else {
        localStorage.clear();
        return navigate("/login");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    getData();
  };

  useEffect(() => {
    if (search == "") {
      setData([]);
    }
  }, [search]);

  return (
    <div className="content-wrapper">
      <Breadcrumb title="Cek Stok Lensa 1" />
      {/* Main Content */}
      <div className="content">
        <div className="container-fluid">
          <div className="row">
            <div className="col-lg-12">
              <div className="card">
                <div className="card-header">
                  <form onSubmit={handleSubmit}>
                    <div className="input-group">
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Cari ukuran lensa..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                      />
                      <button type="submit" className="btn btn-primary">
                        <i className="fas fa-search"></i> Cari
                      </button>
                    </div>
                  </form>
                </div>
                <div className="card-body">
                  <LoadingOverlay
                    active={isLoading}
                    spinner
                    text="Loading your content..."
                  >
                    {search == "" ? (
                      <>
                        <h5>Petunjuk mencari stok lensa</h5>
                        <ul className="text-secondary">
                          <li>
                            Lensa Singlevision{" "}
                            <pre className="d-inline p-0">
                              &quot;SV -025&quot;
                            </pre>{" "}
                            atau{" "}
                            <pre className="d-inline p-0">&quot;-025&quot;</pre>
                          </li>
                          <li>
                            Lensa Cylinder{" "}
                            <pre className="d-inline p-0">
                              &quot;CYL -025-025&quot;
                            </pre>{" "}
                            atau{" "}
                            <pre className="d-inline p-0">
                              &quot;-025-025&quot;
                            </pre>
                          </li>
                          <li>
                            Lensa Kriptok{" "}
                            <pre className="d-inline p-0">
                              &quot;KT -025/+200&quot;
                            </pre>{" "}
                            atau{" "}
                            <pre className="d-inline p-0">
                              &quot;-025/+200&quot;
                            </pre>
                          </li>
                          <li>
                            Lensa Progresive{" "}
                            <pre className="d-inline p-0">
                              &quot;-025/+200&quot;
                            </pre>
                          </li>
                        </ul>
                      </>
                    ) : (
                      <div className="table-responsive">
                        <table className="table table-hover">
                          <thead>
                            <tr>
                              <th>Nama lensa</th>
                              <th>Stok</th>
                            </tr>
                          </thead>
                          <tbody>
                            {data.map((item, index) => (
                              <tr key={index} style={{ fontSize: "14px" }}>
                                <td>
                                  {item.nama}{" "}
                                  <span className="text-muted">
                                    {item.nama_varian}
                                  </span>
                                </td>
                                <td
                                  className={
                                    item.stok == 1
                                      ? "bg-warning"
                                      : item.stok < 1
                                      ? "bg-danger"
                                      : ""
                                  }
                                >
                                  {item.stok}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </LoadingOverlay>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CekStokLensa;
