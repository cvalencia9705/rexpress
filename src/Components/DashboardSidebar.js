import React from 'react'
import { Link } from 'react-router-dom'
function DashboardSidebar() {
  return (
    <ul
      className="navbar-nav bg-gradient-primary sidebar sidebar-dark accordion"
      id="accordionSidebar"
    >
      {/* Sidebar - Brand */}
      <Link
        className="sidebar-brand d-flex align-items-center justify-content-center"
        to="/documents"
      >
        <div className="sidebar-brand-icon rotate-n-15">
          <i className="fas fa-truck"></i>
        </div>
        <div className="sidebar-brand-text mx-3">TruckAdmin</div>
      </Link>

      {/* <!-- Divider --> */}
      <hr className="sidebar-divider my-0" />

      {/* <!-- Nav Dpt - Home --> */}
      {localStorage.level === '1' ? (
        <li className="nav-item">
          <Link className="nav-link" to="/dashboard">
            <i className="fas fa-fw fa-chart-line"></i>
            <span>Dashboard</span>
          </Link>
        </li>
      ) : null}

      {/* <!-- Divider --> */}
      {localStorage.level === '1' ? <hr className="sidebar-divider" /> : null}

      {/* <!-- Nav Dpt - Safety --> */}
      <li className="nav-item">
        <Link className="nav-link" to="/drivers">
          <i className="fas fa-id-card"></i>
          <span>Drivers</span>
        </Link>
      </li>
      <li className="nav-item">
        <Link className="nav-link" to="/trucks">
          <i className="fas fa-truck"></i>
          <span>Trucks</span>
        </Link>
      </li>
      <li className="nav-item">
        <Link className="nav-link" to="/trailers">
          <i className="fas fa-truck-loading"></i>
          <span>Trailers</span>
        </Link>
      </li>

      {/* <!-- Divider --> */}
      <hr className="sidebar-divider my-0" />

      {/* <!-- Nav Dpt - Dispatch --> */}

      {localStorage.level === '3' ? null : (
        <li className="nav-item">
          <Link className="nav-link" to="/loads">
            <i className="fas fa-cubes"></i>
            <span>Loads</span>
          </Link>
        </li>
      )}

      {localStorage.level === '3' ? null : (
        <li className="nav-item">
          <Link className="nav-link" to="/travels">
            <i className="fas fa-road"></i>
            <span>Travels</span>
          </Link>
        </li>
      )}

      {/* <!-- Divider --> */}
      {localStorage.level === '3' ? null : (
        <hr className="sidebar-divider my-0" />
      )}

      {/* <!-- Nav Dpt - Invoices --> */}
      {localStorage.level === '3' ? null : (
        <li className="nav-item">
          <Link className="nav-link" to="/customers">
            <i className="fas fa-address-book"></i>
            <span>Customers</span>
          </Link>
        </li>
      )}
      {localStorage.level === '1' ? (
        <li className="nav-item">
          <Link className="nav-link" to="/invoices">
            <i className="fas fa-scroll"></i>
            <span>Invoices</span>
          </Link>
        </li>
      ) : null}

      {/* <!-- Divider --> */}
      {localStorage.level === '3' ? null : (
        <hr className="sidebar-divider my-0" />
      )}

      <li className="nav-item">
        <Link className="nav-link" to="/documents">
          <i className="fas fa-file-alt"></i>
          <span>Documents</span>
        </Link>
      </li>

      <hr className="sidebar-divider d-none d-md-block"></hr>
    </ul>
  )
}

export default DashboardSidebar
