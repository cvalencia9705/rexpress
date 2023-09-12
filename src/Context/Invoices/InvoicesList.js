import axios from 'axios'
import React, { useContext } from 'react'
import { Link, useHistory, Redirect } from 'react-router-dom'
import { InvoicesContext } from './Invoices'
import { ActivitiesContext } from './Activities'
import { CustomersContext } from '../Customers/Customers'

function InvoicesList() {
  const [InvoicesData, setInvoicesData] = useContext(InvoicesContext)
  const [ActivitiesData, setActivitiesData] = useContext(ActivitiesContext)
  const [CustomersData, setCustomersData] = useContext(CustomersContext)

  const history = useHistory()

  /* Deleting Invoice and all asociated Activities */
  const deleteInvoice = (ID) => {
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
          .delete(`https://api.rexpresstrucks.com/facturas/${ID}/`, config)
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

  if (localStorage.level !== '1') {
    return <Redirect to="/403" />
  }

  return (
    <div className="container-fluid mb-4">
      <div className="card shadow">
        <div className="card-header">
          <h4 className="float-left text-info">Invoices</h4>
          <Link className="btn btn-info float-right" to="/CreateInvoice">
            {' '}
            Create Invoice{' '}
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
                  <th scope="col">Creation Date</th>
                  <th scope="col">Customer</th>
                  <th scope="col">Number of Services</th>
                  <th scope="col">Paid</th>
                  <th scope="col">Actions</th>
                </tr>
              </thead>
              <tbody style={{ color: 'rgba(110, 71, 145, 0.966)' }}>
                {InvoicesData.map((invoice) => {
                  let custom = ''
                  let services = 0

                  for (let i = 0; i < CustomersData.length; i++) {
                    if (CustomersData[i].id === invoice.cliente) {
                      custom = CustomersData[i].nombre
                    }
                  }

                  for (let i = 0; i < ActivitiesData.length; i++) {
                    if (ActivitiesData[i].factura === invoice.id) {
                      services++
                    }
                  }

                  return (
                    <tr key={invoice.id}>
                      <td>{invoice.num_invoice}</td>
                      <td>
                        {new Date(invoice.fecha_factura + 'EST').toDateString()}
                      </td>
                      <td>{custom}</td>
                      <td>{services}</td>
                      <td
                        className={
                          invoice.pagadas ? 'text-success' : 'text-danger'
                        }
                      >
                        {invoice.pagadas ? 'Yes' : 'No'}
                      </td>
                      <td style={{ cursor: 'pointer' }}>
                        <i
                          className="fas fa-user-edit text-primary"
                          onClick={() =>
                            history.push(`/editInvoice/${invoice.id}`)
                          }
                        ></i>
                        <i
                          className="fas fa-trash pl-2 text-danger"
                          onClick={() => {
                            if (
                              window.confirm(
                                'Are you sure you want to delete this invoice?'
                              )
                            ) {
                              deleteInvoice(invoice.id)
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

export default InvoicesList
