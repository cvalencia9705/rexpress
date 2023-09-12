import React, { useEffect, useState } from 'react'
import { useHistory } from 'react-router'
import axios from 'axios'
import Notification from './Notification'

function DashboardNavbar() {
  const [clicks, setClicks] = useState(0)
  const [notifications, setNotifications] = useState([])
  const [nCount, setNCount] = useState(0)
  const history = useHistory()

  const handleClick = () => {
    if (nCount === 0) return
    document.getElementById('bell').classList.add('d-md-none')

    axios
      .get('https://api.rexpresstrucks.com/auth/csrf/', {
        withCredentials: true,
      })
      .then((res) => {
        const _csrfToken = res.data.csrfToken
        const config = {
          headers: {
            'X-CSRFToken': _csrfToken,
            'Content-Type': 'application/json',
          },
          withCredentials: true,
        }
        for (let i = 0; i < notifications.length; i++) {
          const uploadData = new FormData()
          uploadData.append('leido', true)
          uploadData.append(
            'fecha_vencimiento',
            notifications[i].fecha_vencimiento
          )
          uploadData.append('modelo', notifications[i].modelo)
          uploadData.append('campo', notifications[i].campo)
          uploadData.append('identifier', notifications[i].identifier)
          uploadData.append('created_at', notifications[i].created_at)

          axios
            .put(
              `https://api.rexpresstrucks.com/notificaciones/${notifications[i].id}/`,
              uploadData,
              config
            )
            .then((res) => {
              //console.log('Axios - put', res.data)
            })
            .catch((err) => {
              alert(`Error al enviar al servidor.\n${err}`)
              console.log(err)
            })
        }
      })
      .catch((err) => {
        console.log(err)
      })
  }

  const handleLogout = () => {
    axios
      .get('https://api.rexpresstrucks.com/auth/csrf/', {
        withCredentials: true,
      })
      .then((res) => {
        const _csrfToken = res.data.csrfToken

        fetch(`https://api.rexpresstrucks.com/auth/logout/`, {
          method: 'POST',
          credentials: 'include',
          headers: { 'X-CSRFToken': _csrfToken },
        })
          .then((res) => {
            //console.log(res)
            localStorage.clear()
          })
          .then(() => {
            history.push('/login')
          })
      })
      .catch((err) => {
        console.log(err)
      })
  }

  useEffect(() => {
    if (localStorage.username) {
      axios
        .get('https://api.rexpresstrucks.com/notificaciones/', {
          withCredentials: true,
        })
        .then((res) => {
          //console.log(res.data)
          let adminCount = 0
          let count = 0
          let array = []
          for (let i = 0; i < res.data.length; i++) {
            if (
              localStorage.level !== '1' &&
              res.data[i].modelo === 'Facturas'
            ) {
              if (!res.data[i].leido) adminCount++
              continue
            }
            if (!res.data[i].leido && count < 3) {
              array.push(res.data[i])
              count++
            }
          }
          setNotifications(array)
          axios
            .get('https://api.rexpresstrucks.com/reportes/sin_leer/', {
              withCredentials: true,
            })
            .then((res) => {
              //console.log(res.data)
              if (localStorage.level !== '1') {
                setNCount(res.data - adminCount)
              } else {
                setNCount(res.data)
              }
            })
            .catch((err) => console.log(err))
        })
        .catch((err) => console.log(err))
    }
    return () => {
      setNotifications([])
      setNCount(0)
    }
  }, [])

  //console.log(clicks)

  return (
    <nav className="navbar navbar-expand navbar-light bg-white topbar mb-4 static-top shadow">
      {/* <!-- Sidebar Toggle (Topbar) --> */}
      {/* <button
        id="sidebarToggleTop"
        className="btn btn-link d-md-none rounded-circle mr-3"
      >
        <i className="fa fa-bars"></i>
      </button> */}

      {/* <!-- Topbar Search --> */}
      {/* <form className="d-none d-sm-inline-block form-inline mr-auto ml-md-3 my-2 my-md-0 mw-100 navbar-search">
        <div className="input-group">
          <input
            type="text"
            className="form-control bg-light border-0 small"
            placeholder="Search for..."
            aria-label="Search"
            aria-describedby="basic-addon2"
          />
          <div className="input-group-append">
            <button className="btn btn-primary" type="button">
              <i className="fas fa-search fa-sm"></i>
            </button>
          </div>
        </div>
      </form> */}

      {/* <!-- Topbar Navbar --> */}
      <ul className="navbar-nav ml-auto">
        {/* <!-- Nav Item - Search Dropdown (Visible Only XS) --> */}
        {/* <li className="nav-item dropdown no-arrow d-sm-none">
          <a
            className="nav-link dropdown-toggle"
            href="/"
            id="searchDropdown"
            role="button"
            data-toggle="dropdown"
            aria-haspopup="true"
            aria-expanded="false"
          >
            <i className="fas fa-search fa-fw"></i>
          </a> */}
        {/* <!-- Dropdown - Messages --> */}
        {/* <div
            className="dropdown-menu dropdown-menu-right p-3 shadow animated--grow-in"
            aria-labelledby="searchDropdown"
          >
            <form className="form-inline mr-auto w-100 navbar-search">
              <div className="input-group">
                <input
                  type="text"
                  className="form-control bg-light border-0 small"
                  placeholder="Search for..."
                  aria-label="Search"
                  aria-describedby="basic-addon2"
                />
                <div className="input-group-append">
                  <button className="btn btn-primary" type="button">
                    <i className="fas fa-search fa-sm"></i>
                  </button>
                </div>
              </div>
            </form>
          </div>
        </li> */}

        {/* <!-- Nav Item - Alerts --> */}
        <li className="nav-item dropdown no-arrow mx-1">
          <a
            className="nav-link dropdown-toggle"
            href="/"
            onClick={() => {
              handleClick()
            }}
            onBlur={() => setClicks(2)}
            id="alertsDropdown"
            role="button"
            data-toggle="dropdown"
            aria-haspopup="true"
            aria-expanded="false"
          >
            <i className="fas fa-bell fa-fw"></i>
            {/* <!-- Counter - Alerts --> */}
            {nCount > 0 ? (
              <span id="bell" className="badge badge-danger badge-counter">
                {nCount > 3 ? '3+' : nCount.toString()}
              </span>
            ) : null}
          </a>
          {/* <!-- Dropdown - Alerts --> */}
          <div
            className="dropdown-list dropdown-menu dropdown-menu-right shadow animated--grow-in"
            aria-labelledby="alertsDropdown"
          >
            <h6 className="dropdown-header" style={{ cursor: 'default' }}>
              Notifications
            </h6>
            {nCount > 0 ? (
              notifications.map((not, index) => {
                return (
                  <Notification
                    key={index}
                    clicks={clicks}
                    notification={not}
                  />
                )
              })
            ) : (
              <Notification clicks={-1} />
            )}
            {/* <a className="dropdown-item d-flex align-items-center" href="/">
              <div className="mr-3">
                <div className="icon-circle bg-warning">
                  <i className="fas fa-id-card text-white"></i>
                </div>
              </div>
              <div>
                <div className="small text-gray-500">December 12, 2019</div>
                <span className="font-weight-bold">
                  La licencia de Pedro Andres Cepeda esta por vencer!
                </span>
              </div>
            </a>
            <a className="dropdown-item d-flex align-items-center" href="/">
              <div className="mr-3">
                <div className="icon-circle bg-success">
                  <i className="fas fa-donate text-white"></i>
                </div>
              </div>
              <div>
                <div className="small text-gray-500">December 7, 2019</div>
                $290.29 has been deposited into your account!
              </div>
            </a>
            <a className="dropdown-item d-flex align-items-center" href="/">
              <div className="mr-3">
                <div className="icon-circle bg-warning">
                  <i className="fas fa-exclamation-triangle text-white"></i>
                </div>
              </div>
              <div>
                <div className="small text-gray-500">December 2, 2019</div>
                Spending Alert: We've noticed unusually high spending for your
                account.
              </div>
            </a> */}
            <a
              className="dropdown-item text-center small text-gray-500"
              href="/notifications"
            >
              View All
            </a>
          </div>
        </li>

        {/* <!-- Nav Item - User Information --> */}
        <li className="nav-item dropdown no-arrow">
          <a
            className="nav-link dropdown-toggle"
            href="/"
            id="userDropdown"
            role="button"
            data-toggle="dropdown"
            aria-haspopup="true"
            aria-expanded="false"
          >
            <span className="mr-2 d-none d-lg-inline text-gray-600 small">
              {localStorage.getItem('username')}
            </span>
            <img
              className="img-profile rounded-circle"
              alt=""
              src="https://cdn2.iconfinder.com/data/icons/avatars-99/62/avatar-370-456322-512.png"
            />
          </a>

          {/* <!-- Dropdown - User Information --> */}
          <div
            className="dropdown-menu dropdown-menu-right shadow animated--grow-in"
            aria-labelledby="userDropdown"
          >
            {/* <a className="dropdown-item" href="/">
              <i className="fas fa-user fa-sm fa-fw mr-2 text-gray-400"></i>
              Profile
            </a>
            <a className="dropdown-item" href="/">
              <i className="fas fa-cogs fa-sm fa-fw mr-2 text-gray-400"></i>
              Settings
            </a>
            <a className="dropdown-item" href="/">
              <i className="fas fa-list fa-sm fa-fw mr-2 text-gray-400"></i>
              Activity Log
            </a> */}
            {/*  <div className="dropdown-divider"></div> */}
            <a
              onClick={handleLogout}
              className="dropdown-item"
              href="/"
              data-toggle="modal"
              data-target="#logoutModal"
            >
              <i className="fas fa-sign-out-alt fa-sm fa-fw mr-2 text-gray-400"></i>
              Logout
            </a>
          </div>
        </li>
      </ul>
    </nav>
  )
}

export default DashboardNavbar
