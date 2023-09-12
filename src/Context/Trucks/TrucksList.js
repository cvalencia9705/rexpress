import axios from 'axios'
import React, { useContext } from 'react'
import { Link, useHistory } from 'react-router-dom'
import { TrucksContext } from './Trucks'

function TrucksList() {
  const [TrucksData, setTrucksData] = useContext(TrucksContext)
  const history = useHistory()

  /* Deleting Truck */
  const deleteTruck = (ID) => {
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
          .delete(`https://api.rexpresstrucks.com/camiones/${ID}/`, config)
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
          <h4 className="float-left text-info">Trucks</h4>
          <Link className="btn btn-info float-right" to="/CreateTruck">
            {' '}
            Create Truck{' '}
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
                  <th scope="col">Number</th>
                  <th scope="col">Registration Exp</th>
                  <th scope="col">Annual Inspection Exp</th>
                  <th scope="col">Actions</th>
                </tr>
              </thead>
              <tbody style={{ color: 'rgba(110, 71, 145, 0.966)' }}>
                {TrucksData.map((truck) => {
                  return (
                    <tr key={truck.id}>
                      <td>{truck.numero}</td>
                      <td>
                        {new Date(
                          truck.exp_registracion + 'EST'
                        ).toDateString()}
                      </td>
                      <td>
                        {new Date(
                          truck.exp_inspeccion_anual + 'EST'
                        ).toDateString()}
                      </td>
                      <td style={{ cursor: 'pointer' }}>
                        <i
                          className="fas fa-user-edit text-primary"
                          onClick={() => history.push(`/editTruck/${truck.id}`)}
                        ></i>
                        <i
                          className="fas fa-trash pl-2 text-danger"
                          onClick={() => {
                            if (
                              window.confirm(
                                'Are you sure you want to delete this truck?'
                              )
                            ) {
                              deleteTruck(truck.id)
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

export default TrucksList
