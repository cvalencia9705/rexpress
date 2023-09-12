import React, { useContext, useState } from 'react'
import { Redirect, useHistory, useParams } from 'react-router'
import '../../css/upload-control.css'
import axios from 'axios'

import { CustomersContext } from './Customers'

function CreateCustomer() {
  const [CustomersData, setCustomersData] = useContext(CustomersContext)
  const history = useHistory()

  // For edit Customers
  let editcustomer = {
    id: 0,
    nombre: '',
    direccion: '',
    telefono: '',
    email: '',
    terms: '',
  }
  let editCId = useParams()

  if (history.location.pathname.includes('editCustomer')) {
    if (CustomersData.length !== 0) {
      for (let i = 0; i < CustomersData.length; i++) {
        if (CustomersData[i].id === Number(editCId.cid)) {
          editcustomer.id = CustomersData[i].id
          editcustomer.nombre = CustomersData[i].nombre
          editcustomer.direccion = CustomersData[i].direccion
          editcustomer.telefono = CustomersData[i].telefono
          editcustomer.email = CustomersData[i].email
          editcustomer.terms = CustomersData[i].terms
        }
      }
    }
  }

  /* Assigning initial values based on -EDIT or CREATE */

  const [name, setName] = useState(editcustomer.nombre)
  const [address, setAddress] = useState(editcustomer.direccion)
  const [phone, setPhone] = useState(editcustomer.telefono)
  const [mail, setMail] = useState(editcustomer.email)
  const [terms, setTerms] = useState(editcustomer.terms)

  /* Handling Form Submittion */
  const handleSubmit = (e) => {
    e.preventDefault()

    /* If no change is happen after reload the page, don't call
       axios and push the history */
    if (name === '') {
      history.push('/customers')
      return
    }

    const tmpCustomer = {
      nombre: name,
      direccion: address,
      telefono: phone,
      email: mail,
      terms: terms,
      term_date: '2022-01-01',
    }

    if (history.location.pathname.includes('CreateCustomer')) {
      //API call
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
            .post(
              'https://api.rexpresstrucks.com/clientes/',
              tmpCustomer,
              config
            )
            .then((res) => {
              //console.log('Axios - post', res.data)
            })
            .catch((err) => {
              alert(`Error sending to server.\n${err}`)
              console.log(err)
            })
            .finally(() => {
              history.push('/customers')
              window.location.reload()
            })
        })
        .catch((err) => {
          console.log(err)
          alert(`Error getting token.\n${err}`)
        })
    } else {
      //API call
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
            .put(
              `https://api.rexpresstrucks.com/clientes/${editCId.cid}/`,
              tmpCustomer,
              config
            )
            .then((res) => {
              //console.log('Axios - put', res.data)
            })
            .catch((err) => {
              alert(`Error updating.\n${err}`)
              console.log(err)
            })
            .finally(() => {
              history.push('/customers')
              window.location.reload()
            })
        })
        .catch((err) => {
          console.log(err)
          alert(`Error getting token.\n${err}`)
        })
    }
  }

  if (localStorage.level !== '2' && localStorage.level !== '1') {
    return <Redirect to="/403" />
  }

  return (
    <div className="container-fluid">
      {!history.location.pathname.includes('CreateCustomer') ? (
        <div className="text-primary mb-3">
          Note : The fields with data, can not be deleted, only edited
        </div>
      ) : (
        ''
      )}
      <div className="card shadow">
        <div className="card-header">
          <h4 className="float-left text-info">
            {history.location.pathname.includes('CreateCustomer')
              ? 'Create Customer'
              : 'Update/Preview Customer'}
          </h4>
        </div>
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="name-c" className="form-label">
                Name
              </label>
              <input
                type="text"
                className="form-control"
                value={name || editcustomer.nombre}
                onChange={(e) => {
                  setName(e.target.value)
                }}
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="address-c" className="form-label">
                Address
              </label>
              <input
                type="text"
                className="form-control"
                value={address || editcustomer.direccion}
                onChange={(e) => {
                  setAddress(e.target.value)
                }}
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="phone-c" className="form-label">
                Phone Number
              </label>
              <input
                type="text"
                className="form-control"
                value={phone || editcustomer.telefono}
                onChange={(e) => {
                  setPhone(e.target.value)
                }}
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="mail-c" className="form-label">
                Email
              </label>
              <input
                type="email"
                className="form-control"
                value={mail || editcustomer.email}
                onChange={(e) => {
                  setMail(e.target.value)
                }}
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="terms" className="form-label">
                Terms
              </label>
              <select
                className="form-control"
                value={terms || editcustomer.terms}
                onChange={(e) => {
                  setTerms(e.target.value)
                }}
                required
              >
                <option value=""></option>
                <option value="Net15">Net15</option>
                <option value="Net30">Net30</option>
                <option value="Net45">Net45</option>
              </select>
            </div>
            <button type="submit" className="btn btn-primary">
              {history.location.pathname.includes('CreateCustomer')
                ? 'Create'
                : 'Update'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default CreateCustomer
