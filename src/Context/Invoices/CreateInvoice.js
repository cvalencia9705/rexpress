import React, { useContext, useEffect, useState } from 'react'
import { Redirect, useHistory, useParams } from 'react-router'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import '../../css/upload-control.css'
import axios from 'axios'

import { InvoicesContext } from './Invoices'
import { ActivitiesContext } from './Activities'
import { CustomersContext } from '../Customers/Customers'
import { LoadsContext } from '../Loads/Loads'
import ItemRow from './InvoiceItem'
import InvoiceModal from './InvoiceModal'

function CreateInvoice() {
  const [InvoicesData, setInvoicesData] = useContext(InvoicesContext)
  const [CustomersData, setCustomersData] = useContext(CustomersContext)
  const [ActivitiesData, setActivitiesData] = useContext(ActivitiesContext)
  const [LoadsData, setLoadsData] = useContext(LoadsContext)

  const history = useHistory()

  // For edit Invoices and Activities
  let editinvoice = {
    id: 0,
    num_invoice: '',
    fecha_factura: '',
    fecha_servicio: '',
    cliente: '',
    carga: '',
    pagadas: '',
  }

  let alist = []
  let custom_data = {
    direccion: '',
    telefono: '',
    email: '',
  }
  let cterms = ''

  let editIId = useParams()

  if (history.location.pathname.includes('editInvoice')) {
    if (InvoicesData.length !== 0) {
      for (let i = 0; i < InvoicesData.length; i++) {
        if (InvoicesData[i].id === Number(editIId.iid)) {
          editinvoice.id = InvoicesData[i].id
          editinvoice.num_invoice = InvoicesData[i].num_invoice
          editinvoice.fecha_factura = InvoicesData[i].fecha_factura
          editinvoice.fecha_servicio = InvoicesData[i].fecha_servicio
          editinvoice.cliente = InvoicesData[i].cliente
          editinvoice.carga = InvoicesData[i].carga
          editinvoice.pagadas = InvoicesData[i].pagadas
        }
      }
      for (let i = 0; i < ActivitiesData.length; i++) {
        if (ActivitiesData[i].factura === editinvoice.id) {
          const act = {
            id: ActivitiesData[i],
            tipo_actividad: ActivitiesData[i].tipo_actividad,
            amount: ActivitiesData[i].amount,
            cantidad: ActivitiesData[i].cantidad,
            rate: ActivitiesData[i].rate,
            factura: ActivitiesData[i].factura,
          }
          alist.push(act)
        }
      }
      for (let i = 0; i < CustomersData.length; i++) {
        if (CustomersData[i].id === editinvoice.cliente) {
          cterms = CustomersData[i].terms
          editinvoice.cliente = CustomersData[i].nombre

          custom_data.direccion = CustomersData[i].direccion
          custom_data.telefono = CustomersData[i].telefono
          custom_data.email = CustomersData[i].email
        }
      }
      for (let i = 0; i < LoadsData.length; i++) {
        if (LoadsData[i].id === editinvoice.carga) {
          editinvoice.carga = LoadsData[i].num_carga
        }
      }
    }
  } else {
    editinvoice.fecha_servicio = new Date()
  }

  //Generate new invoice number
  const generateInvoiceNo = (current) => {
    if ((current + 1) / 1000 >= 1) return (current + 1).toString()
    if ((current + 1) / 100 >= 1) return '0' + (current + 1).toString()
    if ((current + 1) / 10 >= 1) return '00' + (current + 1).toString()
    return '000' + (current + 1).toString()
  }

  /* Assigning initial values based on -EDIT or CREATE */
  const [terms, setTerms] = useState(cterms)
  const [no, setNo] = useState(
    editinvoice.num_invoice || generateInvoiceNo(InvoicesData.length)
  )
  const [services, setServices] = useState(alist)
  const [inDate, setInDate] = useState(editinvoice.fecha_servicio)
  const [custom, setCustom] = useState(editinvoice.cliente)
  const [isOpen, setIsOpen] = useState(false)
  const [total, setTotal] = useState(0)
  //const [info, setInfo] = useState(custom_data)

  //Calculate total cost of services to pass it to the modal
  const calculateTotal = () => {
    let tmp = []
    let tmp2 = 0
    if (services.length === 0) {
      tmp = [...alist]
    } else {
      tmp = [...services]
    }
    for (let i = 0; i < tmp.length; i++) {
      tmp2 += tmp[i].amount
    }
    setTotal(tmp2)
  }

  //Open the modal view
  const openModal = () => {
    calculateTotal()
    setIsOpen(true)
  }

  //Close the modal view
  const closeModal = () => {
    setIsOpen(false)
  }

  //Get the customer terms and show it
  const getTerms = (target) => {
    let tmp = ''
    if (!target) return ''
    for (let i = 0; i < CustomersData.length; i++) {
      if (CustomersData[i].nombre === target) {
        tmp = CustomersData[i].terms
      }
    }
    return tmp
  }

  //to format Date
  const formatDate = (date) => {
    let d = new Date(date + 'EST')
    let month = '' + (d.getMonth() + 1)
    let day = '' + d.getDate()
    let year = d.getFullYear()

    if (month.length < 2) month = '0' + month
    if (day.length < 2) day = '0' + day

    return [year, month, day].join('-')
  }

  /* Handling Form Submittion */
  const handleSubmit = (e) => {
    e.preventDefault()

    /* If services is empty throw an error */
    if (services.length === 0) {
      alert('Add at least one service to the invoice')
      return
    }

    let custom_id = 0
    let load_id = 0

    for (let i = 0; i < CustomersData.length; i++) {
      if (CustomersData[i].nombre === custom) {
        custom_id = CustomersData[i].id
      }
    }

    //console.log(LoadsData)
    for (let i = 0; i < LoadsData.length; i++) {
      if (services[0].tipo_actividad.includes(LoadsData[i].num_carga)) {
        load_id = LoadsData[i].id
        break
      }
    }
    if (load_id === 0) {
      alert('Error: Load not found.\nUse the first service for LOAD')
      return
    }

    const tmpInvoice = {
      num_invoice: no,
      fecha_factura: formatDate(new Date()),
      fecha_servicio: formatDate(inDate),
      cliente: custom_id,
      carga: load_id,
    }

    //console.log(tmpInvoice)

    if (history.location.pathname.includes('CreateInvoice')) {
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
              'https://api.rexpresstrucks.com/facturas/',
              tmpInvoice,
              config
            )
            .then((res) => {
              //console.log('Axios - post', res.data)
              for (let i = 0; i < services.length; i++) {
                const tmpAct = services[i]
                tmpAct.factura = res.data.id
                tmpAct.rate = Number(tmpAct.rate)
                tmpAct.cantidad = Number(tmpAct.cantidad)
                tmpAct.amount = Number(tmpAct.rate) * Number(tmpAct.cantidad)

                axios
                  .post(
                    'https://api.rexpresstrucks.com/actividades/',
                    tmpAct,
                    config
                  )
                  .then((res) => console.log(res.data))
                  .catch((err) => {
                    console.log(err)
                    alert(`Error sending to server #2.\n${err}`)
                  })
                  .finally(() => {
                    if (i === services.length - 1) {
                      history.push('/invoices')
                      window.location.reload()
                    }
                  })
              }
            })
            .catch((err) => {
              alert(`Error sending to server.\n${err}`)
              console.log(err)
            })
        })
        .catch((err) => {
          console.log(err)
          alert(`Error getting token.\n${err}`)
        })
    } else {
      history.push('/invoices')
    }
  }

  const onAdd = () => {
    const newItem = {
      tipo_actividad: '',
      amount: '',
      cantidad: '',
      rate: '',
      factura: '',
    }
    let tmp = [...services]
    tmp.push(newItem)
    setServices(tmp)
  }
  const onDelete = (index) => {
    setServices(
      services.filter((item, i) => {
        return i !== index
      })
    )
  }
  const onChange = (index, field, value) => {
    const tmp = services
    tmp[index][field] = value
    //console.log(tmp)
    setServices(tmp)
  }

  const setPaid = () => {
    let custom_id = 0
    let load_id = 0

    for (let i = 0; i < CustomersData.length; i++) {
      if (CustomersData[i].nombre === custom) {
        custom_id = CustomersData[i].id
        break
      }
    }

    for (let i = 0; i < LoadsData.length; i++) {
      if (services[0].tipo_actividad.includes(LoadsData[i].num_carga)) {
        load_id = LoadsData[i].id
        break
      }
    }
    const tmpInvoice = {
      num_invoice: no,
      fecha_factura: formatDate(new Date()),
      fecha_servicio: formatDate(inDate),
      cliente: custom_id,
      carga: load_id,
      pagadas: true,
    }
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
            `https://api.rexpresstrucks.com/facturas/${editIId.iid}/`,
            tmpInvoice,
            config
          )
          .then((res) => {
            //console.log(res)
          })
          .catch((err) => {
            console.log(err)
            alert(`Error updating paid.\n${err}`)
          })
          .finally(() => {
            history.push('/invoices')
          })
      })
      .catch((err) => {
        console.log(err)
        alert(`Error getting token.\n${err}`)
      })
  }

  useEffect(() => {
    if (history.location.pathname.includes('CreateInvoice')) {
      onAdd()
    }
  }, [])

  if (localStorage.level !== '1') {
    return <Redirect to="/403" />
  }

  return (
    <div className="container-fluid">
      {!history.location.pathname.includes('CreateInvoice') ? (
        <div className="text-primary mb-3">
          Note : The fields with data, can not be deleted, only edited
        </div>
      ) : (
        <div className="text-primary mb-3">
          Note: The first service must be LOAD
        </div>
      )}
      <div className="card shadow">
        <div className="card-header">
          <h4 className="float-left text-info">
            {history.location.pathname.includes('CreateInvoice')
              ? 'Create Invoice'
              : 'Preview Invoice'}
          </h4>
        </div>
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="num" className="form-label">
                Number
              </label>
              <input
                type="text"
                className="form-control"
                value={no || editinvoice.num_invoice}
                disabled={true}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="customer" className="form-label">
                Customer
              </label>
              <select
                className="form-control"
                value={custom || editinvoice.cliente}
                onChange={(e) => {
                  setCustom(e.target.value)
                  setTerms(
                    getTerms(e.target.options[e.target.selectedIndex].value)
                  )
                }}
                disabled={history.location.pathname.includes('editInvoice')}
                required
              >
                <option value=""></option>
                {CustomersData.map((c) => {
                  return (
                    <option key={c.id} value={c.nombre}>
                      {c.nombre}
                    </option>
                  )
                })}
              </select>
            </div>
            <div className="mb-3">
              <label htmlFor="in-date" className="form-label">
                Service Date
              </label>
              <DatePicker
                selected={
                  inDate !== ''
                    ? new Date(inDate + 'EST')
                    : new Date(
                        (editinvoice.fecha_servicio || '2022-01-01') + 'EST'
                      )
                }
                onChange={(date) => setInDate(date)}
                className="form-control"
                disabled={history.location.pathname.includes('editInvoice')}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="anual-date" className="form-label">
                Creation Date
              </label>
              <DatePicker
                selected={
                  editinvoice.fecha_factura !== ''
                    ? new Date(editinvoice.fecha_factura + 'EST')
                    : new Date()
                }
                disabled={true}
                className="form-control"
              />
            </div>
            <div className="mb-3">
              <label htmlFor="terms" className="form-label">
                Terms
              </label>
              <input
                type="text"
                className="form-control"
                value={terms || cterms}
                disabled={true}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="items" className="form-label">
                Services
              </label>
              {services.length === 0 ? <br /> : null}
              {services.length !== 0
                ? services.map((item, i) => {
                    return (
                      <ItemRow
                        key={i}
                        onDelete={onDelete}
                        item={item}
                        index={i}
                        onChange={onChange}
                      />
                    )
                  })
                : alist.map((item, i) => {
                    return (
                      <ItemRow
                        key={i}
                        onDelete={onDelete}
                        item={item}
                        index={i}
                        onChange={onChange}
                      />
                    )
                  })}
              {history.location.pathname.includes('CreateInvoice') ? (
                <button
                  type="button"
                  className="btn btn-success"
                  onClick={onAdd}
                  style={{
                    marginTop: '10px',
                    fontSize: '0.82rem',
                    marginBottom: '20px',
                  }}
                >
                  + Service
                </button>
              ) : (
                <button
                  type="button"
                  className="btn btn-success"
                  onClick={openModal}
                  style={{
                    marginTop: '10px',
                    fontSize: '0.82rem',
                    marginBottom: '20px',
                  }}
                >
                  Generate Invoice
                </button>
              )}
              <InvoiceModal
                showModal={isOpen}
                closeModal={closeModal}
                num_invoice={no || editinvoice.num_invoice}
                customName={custom || editinvoice.cliente}
                custom={custom_data}
                fecha_servicio={inDate || editinvoice.fecha_servicio}
                fecha_factura={editinvoice.fecha_factura}
                items={alist}
                total={total}
                id_invoice={editinvoice.id}
              />
            </div>
            <button type="submit" className="btn btn-primary">
              {history.location.pathname.includes('CreateInvoice')
                ? 'Create'
                : 'Go Back'}
            </button>
            {history.location.pathname.includes('editInvoice') &&
            !editinvoice.pagadas ? (
              <button
                type="button"
                className="ml-3 btn btn-success"
                onClick={setPaid}
              >
                Set Paid
              </button>
            ) : null}
          </form>
        </div>
      </div>
    </div>
  )
}

export default CreateInvoice
