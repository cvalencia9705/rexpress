import axios from 'axios'
import React, { useContext } from 'react'
import { Link, useHistory, Redirect } from 'react-router-dom'
import { CustomersContext } from './Customers'

function CustomersList() {
  const [CustomersData, setCustomersData] = useContext(CustomersContext)
  const history = useHistory()

  /* Deleting Customer */
  const deleteCustomer = (ID) => {
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
          .delete(`https://api.rexpresstrucks.com/clientes/${ID}/`, config)
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
          <h4 className="float-left text-info">Customers</h4>
          <Link className="btn btn-info float-right" to="/CreateCustomer">
            {' '}
            Create Customer{' '}
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
                  <th scope="col">Name</th>
                  <th scope="col">Address</th>
                  <th scope="col">Phone Number</th>
                  <th scope="col">Email</th>
                  <th scope="col">Terms</th>
                  <th scope="col">Actions</th>
                </tr>
              </thead>
              <tbody style={{ color: 'rgba(110, 71, 145, 0.966)' }}>
                {CustomersData.map((customer) => {
                  return (
                    <tr key={customer.id}>
                      <td>{customer.nombre}</td>
                      <td>{customer.direccion}</td>
                      <td>{customer.telefono}</td>
                      <td>{customer.email}</td>
                      <td>{customer.terms}</td>
                      <td style={{ cursor: 'pointer' }}>
                        <i
                          className="fas fa-user-edit text-primary"
                          onClick={() =>
                            history.push(`/editCustomer/${customer.id}`)
                          }
                        ></i>
                        <i
                          className="fas fa-trash pl-2 text-danger"
                          onClick={() => {
                            if (
                              window.confirm(
                                'Are you sure you want to delete this customer?'
                              )
                            ) {
                              deleteCustomer(customer.id)
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

export default CustomersList
