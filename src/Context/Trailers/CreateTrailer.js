import React, { useContext, useState, useEffect } from 'react'
import { Redirect, useHistory, useParams } from 'react-router'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import '../../css/upload-control.css'
import axios from 'axios'
import { BiCloudDownload } from 'react-icons/bi'

import { TrailersContext } from './Trailers'

function CreateTrailer() {
  const [TrailersData, setTrailersData] = useContext(TrailersContext)
  const history = useHistory()

  // For edit Trailers
  let edittrailer = {
    id: 0,
    numero: '',
    exp_registracion: '',
    exp_inspeccion_anual: '',
    registracion: null,
    inspeccion_anual: null,
  }
  let editTId = useParams()

  if (history.location.pathname.includes('editTrailer')) {
    if (TrailersData.length !== 0) {
      for (let i = 0; i < TrailersData.length; i++) {
        if (TrailersData[i].id == editTId.tid) {
          edittrailer.id = TrailersData[i].id
          edittrailer.numero = TrailersData[i].numero
          edittrailer.exp_registracion = TrailersData[i].exp_registracion
          edittrailer.exp_inspeccion_anual =
            TrailersData[i].exp_inspeccion_anual
          edittrailer.registracion = TrailersData[i].registracion
          edittrailer.inspeccion_anual = TrailersData[i].inspeccion_anual
        }
      }
    }
  } else {
    edittrailer.exp_registracion = new Date()
    edittrailer.exp_inspeccion_anual = new Date()
  }

  /* Assigning initial values based on -EDIT or CREATE */

  const [no, setNo] = useState(edittrailer.numero)
  const [reg, setReg] = useState(edittrailer.registracion)
  const [regDate, setRegDate] = useState(edittrailer.exp_registracion)
  const [anualDate, setAnualDate] = useState(edittrailer.exp_inspeccion_anual)
  const [anual, setAnual] = useState(edittrailer.inspeccion_anual)
  const [mant, setMant] = useState(null)
  const [mantSend, setMantSend] = useState(null)

  //Effect to get mantenimientos
  useEffect(() => {
    if (history.location.pathname.includes('editTrailer')) {
      axios
        .get(
          `https://api.rexpresstrucks.com/mantenimientosfilter/?trailer=${editTId.tid}`,
          { withCredentials: true }
        )
        .then((res) => {
          //console.log(res.data)
          if (res.data.length === 0) {
            setMant(null)
          } else {
            setMant(res.data)
          }
        })
        .catch((err) => {
          console.log(err)
          alert(`Error getting maintenance.\n${err}`)
        })
    }
  }, [])

  //Deleting mantenimientos
  const deleteMant = (id) => {
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
          .delete(
            `https://api.rexpresstrucks.com/mantenimientos/${id}/`,
            config
          )
          .then((res) => {
            console.log(res)
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

    let method = ''
    let str = ''
    let error = ''

    if (history.location.pathname.includes('CreateTrailer')) {
      method = 'POST'
      error = 'Error sending to server.'
    } else {
      method = 'PUT'
      str = `${editTId.tid}/`
      error = 'Error updating.'
    }

    //API call
    let flag = false
    axios
      .get('https://api.rexpresstrucks.com/auth/csrf/', {
        withCredentials: true,
      })
      .then((res) => {
        const _csrfToken = res.data.csrfToken

        const uploadData = new FormData()
        uploadData.append('numero', Number(no) || edittrailer.numero)
        uploadData.append(
          'exp_registracion',
          regDate !== ''
            ? formatDate(regDate)
            : formatDate(edittrailer.exp_registracion)
        )
        uploadData.append(
          'exp_inspeccion_anual',
          anualDate !== ''
            ? formatDate(anualDate)
            : formatDate(edittrailer.exp_inspeccion_anual)
        )

        if (reg !== null && reg.type === 'application/pdf') {
          uploadData.append('registracion', reg)
        }
        if (anual !== null && anual.type === 'application/pdf') {
          uploadData.append('inspeccion_anual', anual)
        }

        fetch(`https://api.rexpresstrucks.com/trailers/${str}`, {
          method: method,
          body: uploadData,
          credentials: 'include',
          headers: { 'X-CSRFToken': _csrfToken },
        })
          .then((res) => {
            if (res.status >= 200 && res.status <= 299) {
              return res.json()
            } else {
              throw Error(res.statusText)
            }
          })
          .then((response) => {
            //console.log(response)
            if (mantSend !== null) {
              flag = true
              for (let i = 0; i < mantSend.length; i++) {
                const uploadData2 = new FormData()
                uploadData2.append('mantenimiento', mantSend[i])
                if (history.location.pathname.includes('CreateTrailer')) {
                  uploadData2.append('trailer', response.id)
                } else {
                  uploadData2.append('trailer', editTId.tid)
                }
                fetch(`https://api.rexpresstrucks.com/mantenimientos/`, {
                  method: 'POST',
                  body: uploadData2,
                  credentials: 'include',
                  headers: { 'X-CSRFToken': _csrfToken },
                })
                  .then((res) => console.log(res))
                  .catch((err) => {
                    console.log(err)
                    alert(`Error updating #2.\n${err}`)
                  })
                  .finally(() => {
                    if (i === mantSend.length - 1) {
                      history.push('/trailers')
                      window.location.reload()
                    }
                  })
              }
            }
          })
          .catch((err) => {
            console.log(err)
            alert(`${error}\n${err}`)
          })
          .finally(() => {
            if (!flag) {
              history.push('/trailers')
              window.location.reload()
            }
          })
      })
      .catch((err) => {
        console.log(err)
        alert(`Error getting token.\n${err}`)
      })
  }

  let ref1, ref2 //reference var to bound upload-btn with the hidden input file
  let ref //reference var to bound upload-depen-btn with the hidden multi input file

  /* Handling singles uploads */
  const handleUpload = (e, id) => {
    if (!e.target.files[0]) {
      document.getElementById(`${id}`).className = 'm-2 form-label text-danger'
      document.getElementById(`${id}`).innerHTML = 'No file selected'
      return -1
    }
    if (e.target.files[0].type !== 'application/pdf') {
      document.getElementById(`${id}`).className = 'm-2 form-label text-warning'
      document.getElementById(`${id}`).innerHTML = 'Wrong format'
      return 1
    } else {
      document.getElementById(`${id}`).className = 'm-2 form-label text-success'
      document.getElementById(`${id}`).innerHTML = e.target.files[0].name
      return 0
    }
  }

  /* Handling multiples uploads */
  const handleUpload2 = (e, id) => {
    if (!e.target.files[0]) {
      document.getElementById(`${id}`).className = 'm-2 form-label text-danger'
      document.getElementById(`${id}`).innerHTML = 'No file selected'
      return -1
    }

    for (let i = 0; i < e.target.files.length; i++) {
      if (e.target.files[i].type !== 'application/pdf') {
        document.getElementById(`${id}`).className =
          'm-2 form-label text-warning'
        document.getElementById(`${id}`).innerHTML = 'Wrong format'
        return 1
      }
    }
    document.getElementById(`${id}`).className = 'm-2 form-label text-success'
    document.getElementById(
      `${id}`
    ).innerHTML = `${e.target.files.length} archivo(s) seleccionados`
    return 0
  }

  return (
    <div className="container-fluid">
      {!history.location.pathname.includes('CreateTrailer') ? (
        <div className="text-primary mb-3">
          Note : The fields with data, can not be deleted, only edited
        </div>
      ) : (
        ''
      )}
      <div className="card shadow">
        <div className="card-header">
          <h4 className="float-left text-info">
            {history.location.pathname.includes('CreateTrailer')
              ? 'Create Trailer'
              : 'Update/Preview Trailer'}
          </h4>
        </div>
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="truck-no" className="form-label">
                Number
              </label>
              <input
                type="number"
                className="form-control"
                value={no || edittrailer.numero}
                onChange={(e) => {
                  setNo(e.target.value)
                }}
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="reg-date-t" className="form-label">
                Registration Exp
              </label>
              <DatePicker
                selected={
                  regDate !== ''
                    ? new Date(regDate + 'EST')
                    : new Date(
                        (edittrailer.exp_registracion || '2022-01-01') + 'EST'
                      )
                }
                onChange={(date) => setRegDate(date)}
                className="form-control"
              />
            </div>
            <div className="mb-3">
              <label htmlFor="anual-date-t" className="form-label">
                Annual Inspection Exp
              </label>
              <DatePicker
                selected={
                  anualDate !== ''
                    ? new Date(anualDate + 'EST')
                    : new Date(
                        (edittrailer.exp_inspeccion_anual || '2022-01-01') +
                          'EST'
                      )
                }
                onChange={(date) => setAnualDate(date)}
                className="form-control"
              />
            </div>
            <div className="mb-3">
              <label className="form-label upload-control">Registration</label>
              <input
                type="file"
                style={{ display: 'none' }}
                ref={(fileInput) => (ref1 = fileInput)}
                onChange={(e) => {
                  const f = handleUpload(e, 'tr-reg')
                  if (f === 0) {
                    setReg(e.target.files[0])
                  } else {
                    setReg(null)
                  }
                }}
              />
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => ref1.click()}
              >
                Select File
              </button>
              <label id="tr-reg" className="m-2 form-label text-danger">
                No file selected
              </label>
              {history.location.pathname.includes('editTrailer') ? (
                <a href={edittrailer.registracion}>
                  <button
                    type="button"
                    className="ml-5 btn btn-info"
                    onClick={() => {
                      if (edittrailer.registracion === null)
                        alert('Document is missing')
                    }}
                  >
                    <BiCloudDownload
                      style={{
                        width: '24px',
                        height: '24px',
                        marginTop: '-3px',
                      }}
                      className="me-2"
                    />{' '}
                    Download Copy
                  </button>
                </a>
              ) : null}
            </div>
            <div className="mb-3">
              <label className="form-label upload-control">
                Annual Inspection
              </label>
              <input
                type="file"
                style={{ display: 'none' }}
                ref={(fileInput) => (ref2 = fileInput)}
                onChange={(e) => {
                  const f = handleUpload(e, 'tr-anual')
                  if (f === 0) {
                    setAnual(e.target.files[0])
                  } else {
                    setAnual(null)
                  }
                }}
              />
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => ref2.click()}
              >
                Select File
              </button>
              <label id="tr-anual" className="m-2 form-label text-danger">
                No file selected
              </label>
              {history.location.pathname.includes('editTrailer') ? (
                <a href={edittrailer.inspeccion_anual}>
                  <button
                    type="button"
                    className="ml-5 btn btn-info"
                    onClick={() => {
                      if (edittrailer.inspeccion_anual === null)
                        alert('Document is missing')
                    }}
                  >
                    <BiCloudDownload
                      style={{
                        width: '24px',
                        height: '24px',
                        marginTop: '-3px',
                      }}
                      className="me-2"
                    />{' '}
                    Download Copy
                  </button>
                </a>
              ) : null}
            </div>
            <div className="mb-3">
              <label className="form-label upload-control">Maintenance</label>
              <input
                type="file"
                multiple
                style={{ display: 'none' }}
                ref={(fileInput) => (ref = fileInput)}
                onChange={(e) => {
                  const f = handleUpload2(e, 'mant')
                  if (f === 0) {
                    setMantSend(e.target.files)
                  } else {
                    setMantSend(null)
                  }
                }}
              />
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => ref.click()}
              >
                Select File
              </button>
              <label id="mant" className="m-2 form-label text-danger">
                No file selected
              </label>
            </div>
            {history.location.pathname.includes('editTrailer') &&
            mant !== null ? (
              <div className="mb-3">
                <label className="form-label">Maintenance List</label>
                <ul className="list-group">
                  {mant.map((mant, index) => {
                    return (
                      <li
                        key={index}
                        className="list-group-item list-group-item-action list-group-item-info d-flex justify-content-between align-items-center w-25"
                      >
                        {mant.mantenimiento.slice(52)}
                        <span>
                          <a href={mant.mantenimiento}>
                            <i
                              className="mr-3 fas fa-download text-primary"
                              style={{ cursor: 'pointer' }}
                            ></i>
                          </a>
                          <i
                            className="fas fa-trash text-danger"
                            style={{ cursor: 'pointer' }}
                            onClick={() => deleteMant(mant.id)}
                          ></i>
                        </span>
                      </li>
                    )
                  })}
                </ul>
              </div>
            ) : null}
            <button type="submit" className="mt-2 btn btn-primary">
              {history.location.pathname.includes('CreateTrailer')
                ? 'Create'
                : 'Update'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default CreateTrailer
