import axios from 'axios'
import React, { useContext } from 'react'
import { Link, useHistory } from 'react-router-dom'
import { TrailersContext } from './Trailers'

function TrailersList() {
  const [TrailersData, setTrailersData] = useContext(TrailersContext)
  const history = useHistory()

  /* Deleting Trailer */
  const deleteTrailer = (ID) => {
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
          .delete(`https://api.rexpresstrucks.com/trailers/${ID}/`, config)
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
          <h4 className="float-left text-info">Trailers</h4>
          <Link className="btn btn-info float-right" to="/CreateTrailer">
            {' '}
            Create Trailer{' '}
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
                {TrailersData.map((trailer) => {
                  return (
                    <tr key={trailer.id}>
                      <td>{trailer.numero}</td>
                      <td>
                        {new Date(
                          trailer.exp_registracion + 'EST'
                        ).toDateString()}
                      </td>
                      <td>
                        {new Date(
                          trailer.exp_inspeccion_anual + 'EST'
                        ).toDateString()}
                      </td>
                      <td style={{ cursor: 'pointer' }}>
                        <i
                          className="fas fa-user-edit text-primary"
                          onClick={() =>
                            history.push(`/editTrailer/${trailer.id}`)
                          }
                        ></i>
                        <i
                          className="fas fa-trash pl-2 text-danger"
                          onClick={() => {
                            if (
                              window.confirm(
                                'Are you sure you want to delete this trailer?'
                              )
                            ) {
                              deleteTrailer(trailer.id)
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

export default TrailersList
