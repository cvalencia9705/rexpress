import React, { useContext, useState } from 'react'
import { Redirect, useHistory, useParams } from 'react-router'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import '../../css/upload-control.css'
import axios from 'axios'
import { BiCloudDownload } from 'react-icons/bi'

import { TrucksContext } from './Trucks'

function CreateTruck() {
  const [TrucksData, setTrucksData] = useContext(TrucksContext)
  const history = useHistory()

  // For edit Trucks
  let edittruck = {
    id: 0,
    numero: '',
    exp_registracion: '',
    exp_inspeccion_anual: '',
    registracion: null,
    inspeccion_anual: null,
  }
  let editTId = useParams()

  if (history.location.pathname.includes('editTruck')) {
    if (TrucksData.length !== 0) {
      for (let i = 0; i < TrucksData.length; i++) {
        if (TrucksData[i].id === Number(editTId.tid)) {
          edittruck.id = TrucksData[i].id
          edittruck.numero = TrucksData[i].numero
          edittruck.exp_registracion = TrucksData[i].exp_registracion
          edittruck.exp_inspeccion_anual = TrucksData[i].exp_inspeccion_anual

          edittruck.registracion = TrucksData[i].registracion
          edittruck.inspeccion_anual = TrucksData[i].inspeccion_anual
        }
      }
    }
  } else {
    edittruck.exp_registracion = new Date()
    edittruck.exp_inspeccion_anual = new Date()
  }

  /* Assigning initial values based on -EDIT or CREATE */
  const [no, setNo] = useState(edittruck.numero)
  const [regDate, setRegDate] = useState(edittruck.exp_registracion)
  const [reg, setReg] = useState(edittruck.registracion)
  const [anualDate, setAnualDate] = useState(edittruck.exp_inspeccion_anual)
  const [anual, setAnual] = useState(edittruck.inspeccion_anual)

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

    if (history.location.pathname.includes('CreateTruck')) {
      method = 'POST'
      error = 'Error sending to server.'
    } else {
      method = 'PUT'
      str = `${editTId.tid}/`
      error = 'Error updating.'
    }

    //API call
    axios
      .get('https://api.rexpresstrucks.com/auth/csrf/', {
        withCredentials: true,
      })
      .then((res) => {
        const _csrfToken = res.data.csrfToken

        const uploadData = new FormData()
        uploadData.append('numero', Number(no) || edittruck.numero)
        uploadData.append(
          'exp_registracion',
          regDate !== ''
            ? formatDate(regDate)
            : formatDate(edittruck.exp_registracion)
        )
        uploadData.append(
          'exp_inspeccion_anual',
          anualDate !== ''
            ? formatDate(anualDate)
            : formatDate(edittruck.exp_inspeccion_anual)
        )

        if (reg !== null && reg.type === 'application/pdf') {
          uploadData.append('registracion', reg)
        }
        if (anual !== null && anual.type === 'application/pdf') {
          uploadData.append('inspeccion_anual', anual)
        }

        fetch(`https://api.rexpresstrucks.com/camiones/${str}`, {
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
          })
          .catch((err) => {
            console.log(err)
            alert(`${error}\n${err}`)
          })
          .finally(() => {
            history.push('/trucks')
            window.location.reload()
          })
      })
      .catch((err) => {
        console.log(err)
        alert(`Error getting token.\n${err}`)
      })
  }

  let ref, ref1 //reference var to bound upload-btn with the hidden input file

  /* Handling Singles Uploads */
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

  return (
    <div className="container-fluid">
      {!history.location.pathname.includes('CreateTruck') ? (
        <div className="text-primary mb-3">
          Note : The fields with data, can not be deleted, only edited
        </div>
      ) : (
        ''
      )}
      <div className="card shadow">
        <div className="card-header">
          <h4 className="float-left text-info">
            {history.location.pathname.includes('CreateTruck')
              ? 'Add Truck'
              : 'Update/Preview Truck'}
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
                value={no || edittruck.numero}
                onChange={(e) => {
                  setNo(e.target.value)
                }}
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="reg-date" className="form-label">
                Registration Exp
              </label>
              <DatePicker
                selected={
                  regDate !== ''
                    ? new Date(regDate + 'EST')
                    : new Date(
                        (edittruck.exp_registracion || '2022-01-01') + 'EST'
                      )
                }
                onChange={(date) => setRegDate(date)}
                className="form-control"
              />
            </div>
            <div className="mb-3">
              <label htmlFor="anual-date" className="form-label">
                Annual Inspection Exp
              </label>
              <DatePicker
                selected={
                  anualDate !== ''
                    ? new Date(anualDate + 'EST')
                    : new Date(
                        (edittruck.exp_inspeccion_anual || '2022-01-01') + 'EST'
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
                ref={(fileInput) => (ref = fileInput)}
                onChange={(e) => {
                  const f = handleUpload(e, 't-reg')
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
                onClick={() => ref.click()}
              >
                Select File
              </button>
              <label id="t-reg" className="m-2 form-label text-danger">
                No file selected
              </label>
              {history.location.pathname.includes('editTruck') ? (
                <a href={edittruck.registracion}>
                  <button
                    type="button"
                    className="ml-5 btn btn-info"
                    onClick={() => {
                      if (edittruck.registracion === null)
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
                ref={(fileInput) => (ref1 = fileInput)}
                onChange={(e) => {
                  const f = handleUpload(e, 't-anual')
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
                onClick={() => ref1.click()}
              >
                Select File
              </button>
              <label id="t-anual" className="m-2 form-label text-danger">
                No file selected
              </label>
              {history.location.pathname.includes('editTruck') ? (
                <a href={edittruck.inspeccion_anual}>
                  <button
                    type="button"
                    className="ml-5 btn btn-info"
                    onClick={() => {
                      if (edittruck.inspeccion_anual === null)
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
            <button type="submit" className="mt-2 btn btn-primary">
              {history.location.pathname.includes('CreateTruck')
                ? 'Add'
                : 'Update'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default CreateTruck
