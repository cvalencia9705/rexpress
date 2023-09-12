import axios from 'axios'
import React, { useContext } from 'react'
import { Link, useHistory, Redirect } from 'react-router-dom'
import { TravelsContext } from './Travels'
import { LoadsContext } from '../Loads/Loads'
import { DriversContext } from '../Drivers/Drivers'
import { TrucksContext } from '../Trucks/Trucks'
import { TrailersContext } from '../Trailers/Trailers'

function TravelsList() {
  const [TravelsData, setTravelsData] = useContext(TravelsContext)
  const [DriversData, setDriversData] = useContext(DriversContext)
  const [LoadsData, setLoadsData] = useContext(LoadsContext)
  const [TrucksData, setTrucksData] = useContext(TrucksContext)
  const [TrailersData, setTrailersData] = useContext(TrailersContext)
  const history = useHistory()

  /* Deleting Travel */
  const deleteTravel = (ID) => {
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
          .delete(`https://api.rexpresstrucks.com/viajes/${ID}/`, config)
          .then((res) => {
            //console.log(res)
          })
          .catch((err) => {
            console.log(err)
            alert(`Error deleting.\n${err}`)
          })
          .finally(() => window.location.reload())
      })
      .catch((err) => {
        console.log(err)
        alert(`Error getting token.\n${err}`)
      })
  }

  if (localStorage.level !== '2' && localStorage.level !== '1') {
    return <Redirect to="/403" />
  }

  return (
    <div className="container-fluid mb-4">
      <div className="card shadow">
        <div className="card-header">
          <h4 className="float-left text-info">Travels</h4>
          <Link className="btn btn-info float-right" to="/CreateTravel">
            {' '}
            Create Travel{' '}
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
                  <th scope="col">Truck Number</th>
                  <th scope="col">Trailer Number</th>
                  <th scope="col">Driver 1</th>
                  <th scope="col">Driver 2</th>
                  <th scope="col">Departure Date</th>
                  <th scope="col">Loads</th>
                  <th scope="col">Notes</th>
                  <th scope="col">Actions</th>
                </tr>
              </thead>
              <tbody style={{ color: 'rgba(110, 71, 145, 0.966)' }}>
                {TravelsData.map((travel) => {
                  let driver1 = ''
                  let driver2 = ''
                  let truck = ''
                  let trailer = ''
                  let loads = 0

                  for (let i = 0; i < DriversData.length; i++) {
                    if (DriversData[i].id === travel.chofer1) {
                      driver1 = DriversData[i].nombre
                      continue
                    }
                    if (DriversData[i].id === travel.chofer2) {
                      driver2 = DriversData[i].nombre
                    }
                  }

                  for (let i = 0; i < TrucksData.length; i++) {
                    if (TrucksData[i].id === travel.camion) {
                      truck = TrucksData[i].numero
                      break
                    }
                  }

                  for (let i = 0; i < TrailersData.length; i++) {
                    if (TrailersData[i].id === travel.trailer) {
                      trailer = TrailersData[i].numero
                      break
                    }
                  }

                  for (let i = 0; i < LoadsData.length; i++) {
                    if (
                      LoadsData[i].id === travel.carga1 ||
                      LoadsData[i].id === travel.carga2 ||
                      LoadsData[i].id === travel.carga3
                    ) {
                      loads++
                    }
                  }

                  return (
                    <tr key={travel.id}>
                      <td>{truck}</td>
                      <td>{trailer}</td>
                      <td>{driver1}</td>
                      <td>{driver2}</td>
                      <td>
                        {new Date(travel.fecha_salida + 'EST').toDateString()}
                      </td>
                      <td className="text-primary">{loads}</td>
                      <td
                        className={
                          travel.notas ? 'text-success' : 'text-danger'
                        }
                      >
                        {travel.notas ? 'Yes' : 'No'}
                      </td>
                      <td style={{ cursor: 'pointer' }}>
                        <i
                          className="fas fa-user-edit text-primary"
                          onClick={() =>
                            history.push(`/editTravel/${travel.id}`)
                          }
                        ></i>
                        <i
                          className="fas fa-trash pl-2 text-danger"
                          onClick={() => {
                            if (
                              window.confirm(
                                'Are you sure you want to delete this travel?'
                              )
                            ) {
                              deleteTravel(travel.id)
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

export default TravelsList
