import axios from 'axios'
import React, { useContext } from 'react'
import { Link, useHistory, Redirect } from 'react-router-dom'
import { LoadsContext } from './Loads'

function LoadsList() {
  const [LoadsData, setLoadsData] = useContext(LoadsContext)
  const history = useHistory()

  /* Deleting Load */
  const deleteLoad = (ID) => {
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
          .delete(`https://api.rexpresstrucks.com/cargas/${ID}/`, config)
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

  if (localStorage.level !== '2' && localStorage.level !== '1') {
    return <Redirect to="/403" />
  }

  return (
    <div className="container-fluid mb-4">
      <div className="card shadow">
        <div className="card-header">
          <h4 className="float-left text-info">Loads</h4>
          <Link className="btn btn-info float-right" to="/CreateLoad">
            {' '}
            Create Load{' '}
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
                  <th scope="col">Load Number</th>
                  <th scope="col">Price</th>
                  <th scope="col">Broker Name</th>
                  <th scope="col">BOL</th>
                  <th scope="col">Confirmation</th>
                  <th scope="col">Actions</th>
                </tr>
              </thead>
              <tbody style={{ color: 'rgba(110, 71, 145, 0.966)' }}>
                {LoadsData.map((load) => {
                  return (
                    <tr key={load.id}>
                      <td>{load.num_carga}</td>
                      <td>{load.precio}</td>
                      <td>{load.nombre_broker}</td>
                      <td
                        className={
                          load.bol !== null ? 'text-success' : 'text-danger'
                        }
                      >
                        {load.bol !== null ? 'Yes' : 'No'}
                      </td>
                      <td
                        className={
                          load.confirmacion !== null
                            ? 'text-success'
                            : 'text-danger'
                        }
                      >
                        {load.confirmacion !== null ? 'Yes' : 'No'}
                      </td>
                      <td style={{ cursor: 'pointer' }}>
                        <i
                          className="fas fa-user-edit text-primary"
                          onClick={() => history.push(`/editLoad/${load.id}`)}
                        ></i>
                        <i
                          className="fas fa-trash pl-2 text-danger"
                          onClick={() => {
                            if (
                              window.confirm(
                                'Are you sure you want to delete this load?'
                              )
                            ) {
                              deleteLoad(load.id)
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

export default LoadsList
