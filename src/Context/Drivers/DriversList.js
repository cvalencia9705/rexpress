import axios from 'axios'
import React, { useContext } from 'react'
import { Link, useHistory } from 'react-router-dom'
import { DriversContext } from './Drivers'

function DriversList() {
  const [DriversData, setDriversData] = useContext(DriversContext)
  const history = useHistory()

  /* Deleting Driver */
  const deleteDriver = (ID) => {
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
        axios
          .delete(`https://api.rexpresstrucks.com/choferes/${ID}/`, config)
          .then((res) => {
            //console.log(res)
          })
          .catch((err) => {
            alert(`Error deleting.\n${err}`)
            console.log(err)
          })
          .finally(() => window.location.reload())
      })
      .catch((err) => {
        alert(`Error getting token.\n${err}`)
        console.log(err)
      })
  }

  return (
    <div className="container-fluid mb-4">
      <div className="card shadow">
        <div className="card-header">
          <h4 className="float-left text-info">Drivers</h4>
          <Link className="btn btn-info float-right" to="/CreateDriver">
            {' '}
            Create Driver{' '}
          </Link>
        </div>
        <div className="card-body">
          <div className="table-responsive">
            <table
              className="table table-info table-striped"
              style={{ borderRadius: '10px' }}
            >
              <thead style={{ color: 'rgb(105, 54, 156)' }}>
                <tr>
                  <th scope="col">Full Name</th>
                  <th scope="col">License</th>
                  <th scope="col">Lic. State</th>
                  <th scope="col">Lic. Exp</th>
                  <th scope="col">Med Exp</th>
                  <th scope="col">App Date</th>
                  <th scope="col">Social Security</th>
                  <th scope="col">Address</th>
                  <th scope="col">Actions</th>
                </tr>
              </thead>
              <tbody style={{ color: 'rgba(110, 71, 145, 0.966)' }}>
                {DriversData.map((driver) => {
                  return (
                    <tr key={driver.id}>
                      <td>{driver.nombre}</td>
                      <td>{driver.licencia}</td>
                      <td>{driver.estado_licencia}</td>
                      <td>
                        {new Date(driver.exp_licencia + 'EST').toDateString()}
                      </td>
                      <td>
                        {new Date(
                          driver.exp_tarjeta_med + 'EST'
                        ).toDateString()}
                      </td>
                      <td>
                        {new Date(driver.fecha_app + 'EST').toDateString()}
                      </td>
                      <td>{driver.id_social_sec}</td>
                      <td>{driver.direccion}</td>
                      <td style={{ cursor: 'pointer' }}>
                        <i
                          className="fas fa-user-edit text-primary"
                          onClick={() =>
                            history.push(`/editDriver/${driver.id}`)
                          }
                        ></i>
                        <i
                          className="fas fa-trash pl-2 text-danger"
                          onClick={() => {
                            if (
                              window.confirm(
                                'Are you sure you want to delete this driver?'
                              )
                            ) {
                              deleteDriver(driver.id)
                            }
                          }}
                        ></i>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DriversList
