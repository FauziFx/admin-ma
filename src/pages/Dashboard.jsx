import React from "react";
import Breadcrumb from "../components/Breadcrumb";
import useDocumentTitle from "../utils/useDocumentTitle";
import { Link } from "react-router-dom";

const Dashboard = () => {
  useDocumentTitle("Dashboard");
  return (
    <div className="content-wrapper">
      <Breadcrumb title="Dashboard" />
      {/* Main Content */}
      <div className="content">
        <div className="container-fluid">
          <div className="row">
            <div className="col-lg-12">
              <div className="card">
                <div className="card-body">
                  <div className="jumbotron">
                    <h1 className="display-4">Coming Soon!!</h1>
                    <p className="lead">This page is under construction</p>
                    <hr className="my-4" />
                    <p>
                      Lorem ipsum dolor sit amet consectetur adipisicing elit.
                      Odit asperiores perferendis deserunt, magnam voluptates
                      temporibus repellendus iure provident, ad, neque alias
                      officia. Ratione facere temporibus officiis veritatis
                      minima voluptas optio.
                    </p>
                    <p className="lead">
                      <Link
                        className="btn btn-primary btn-lg"
                        to="/data-lensa"
                        role="button"
                      >
                        Stok Lensa
                      </Link>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
