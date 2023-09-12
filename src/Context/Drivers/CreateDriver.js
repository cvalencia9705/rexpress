import React, { useContext, useState, useEffect } from 'react'
import { Redirect, useHistory, useParams } from 'react-router'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import '../../css/upload-control.css'
import axios from 'axios'
import FormData from 'form-data'
import { BiCloudDownload } from 'react-icons/bi'

import { DriversContext } from './Drivers'

function CreateDriver() {
  const [DriversData, setDriversData] = useContext(DriversContext)
  const history = useHistory()

  // For edit Drivers
  let editdriver = {
    id: 0,
    nombre: '',
    licencia: '',
    estado_licencia: '',
    id_social_sec: '',
    direccion: '',
    exp_licencia: '',
    exp_tarjeta_med: '',
    fecha_app: '',
    app: null,
    licencia_img: null,
    tarjmed: null,
    drug: null,
    lab: null,
    clereance: null,
    police: null,
  }
  let editDId = useParams()

  if (history.location.pathname.includes('editDriver')) {
    if (DriversData.length !== 0) {
      for (let i = 0; i < DriversData.length; i++) {
        if (DriversData[i].id === Number(editDId.did)) {
          editdriver.id = DriversData[i].id
          editdriver.nombre = DriversData[i].nombre
          editdriver.licencia = DriversData[i].licencia
          editdriver.estado_licencia = DriversData[i].estado_licencia
          editdriver.id_social_sec = DriversData[i].id_social_sec
          editdriver.direccion = DriversData[i].direccion
          editdriver.exp_licencia = DriversData[i].exp_licencia
          editdriver.exp_tarjeta_med = DriversData[i].exp_tarjeta_med
          editdriver.fecha_app = DriversData[i].fecha_app

          editdriver.app = DriversData[i].app
          editdriver.licencia_img = DriversData[i].licencia_img
          editdriver.tarjmed = DriversData[i].tarjmed
          editdriver.drug = DriversData[i].drug
          editdriver.lab = DriversData[i].lab
          editdriver.clereance = DriversData[i].clereance
          editdriver.police = DriversData[i].police
        }
      }
    }
  } else {
    editdriver.exp_licencia = new Date()
    editdriver.exp_tarjeta_med = new Date()
    editdriver.fecha_app = new Date()
  }

  /* Assigning initial values based on -EDIT or CREATE */

  const [name, setName] = useState(editdriver.nombre)
  const [lic, setLic] = useState(editdriver.licencia)
  const [licState, setLicState] = useState(editdriver.estado_licencia)
  const [social, setSocial] = useState(editdriver.id_social_sec)
  const [address, setAddress] = useState(editdriver.direccion)
  const [licDate, setLicDate] = useState(editdriver.exp_licencia)
  const [medDate, setMedDate] = useState(editdriver.exp_tarjeta_med)
  const [appDate, setAppDate] = useState(editdriver.fecha_app)
  const [inspect, setInspect] = useState(null)
  const [inspectSend, setInspectSend] = useState(null)
  const [app, setApp] = useState(editdriver.app)
  const [licImg, setLicImg] = useState(editdriver.licencia_img)
  const [tmed, setTmed] = useState(editdriver.tarjmed)
  const [drug, setDrug] = useState(editdriver.drug)
  const [lab, setLab] = useState(editdriver.lab)
  const [clereance, setClereance] = useState(editdriver.clereance)
  const [police, setPolice] = useState(editdriver.police)

  //Effect to get inspects
  useEffect(() => {
    if (history.location.pathname.includes('editDriver')) {
      axios
        .get(
          `https://api.rexpresstrucks.com/inspeccionesfilter/?chofer=${editDId.did}`,
          { withCredentials: true }
        )
        .then((res) => {
          //console.log(res.data)
          if (res.data.length === 0) {
            setInspect(null)
          } else {
            setInspect(res.data)
          }
        })
        .catch((err) => {
          console.log(err)
          alert(`Error getting inspections.\n${err}`)
        })
    }
  }, [])

  //Deleting inspects
  const deleteIns = (id) => {
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
          .delete(`https://api.rexpresstrucks.com/inspecciones/${id}/`, config)
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

    if (history.location.pathname.includes('CreateDriver')) {
      method = 'POST'
      error = 'Error sending to server.'
    } else {
      method = 'PUT'
      str = `${editDId.did}/`
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
        uploadData.append('nombre', name || editdriver.nombre)
        uploadData.append('licencia', lic || editdriver.licencia)
        uploadData.append(
          'estado_licencia',
          licState || editdriver.estado_licencia
        )
        uploadData.append(
          'exp_tarjeta_med',
          medDate !== ''
            ? formatDate(medDate)
            : formatDate(editdriver.exp_tarjeta_med)
        )
        uploadData.append(
          'fecha_app',
          appDate !== ''
            ? formatDate(appDate)
            : formatDate(editdriver.fecha_app)
        )
        uploadData.append('direccion', address || editdriver.direccion)
        uploadData.append('id_social_sec', social || editdriver.id_social_sec)
        uploadData.append(
          'exp_licencia',
          licDate !== ''
            ? formatDate(licDate)
            : formatDate(editdriver.exp_licencia)
        )
        if (app !== null && app.type === 'application/pdf') {
          uploadData.append('app', app)
        }
        if (licImg !== null && licImg.type === 'application/pdf') {
          uploadData.append('licencia_img', licImg)
        }
        if (tmed !== null && tmed.type === 'application/pdf') {
          uploadData.append('tarjmed', tmed)
        }
        if (drug !== null && drug.type === 'application/pdf') {
          uploadData.append('drug', drug)
        }
        if (lab !== null && lab.type === 'application/pdf') {
          uploadData.append('lab', lab)
        }
        if (clereance !== null && clereance.type === 'application/pdf') {
          uploadData.append('clereance', clereance)
        }
        if (police !== null && police.type === 'application/pdf') {
          uploadData.append('police', police)
        }

        fetch(`https://api.rexpresstrucks.com/choferes/${str}`, {
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
            if (inspectSend !== null) {
              flag = true
              for (let i = 0; i < inspectSend.length; i++) {
                const uploadData2 = new FormData()
                uploadData2.append('inspeccion', inspectSend[i])
                if (history.location.pathname.includes('CreateDriver')) {
                  uploadData2.append('chofer', response.id)
                } else {
                  uploadData2.append('chofer', editDId.did)
                }
                fetch(`https://api.rexpresstrucks.com/inspecciones/`, {
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
                    if (i === inspectSend.length - 1) {
                      history.push('/drivers')
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
              history.push('/drivers')
              window.location.reload()
            }
          })
      })
      .catch((err) => {
        console.log(err)
        alert(`Error getting token.\n${err}`)
      })
  }

  //reference var to bound upload-btn with the hidden input file
  let ref1, ref2, ref3, ref4, ref5, ref6, ref7
  //reference var to bound upload-depen-btn with the hidden multi input file
  let ref

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

  /* Handling Multiples Uploads */
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
      {!history.location.pathname.includes('CreateDriver') ? (
        <div className="text-primary mb-3">
          Note : The fields with data, can not be deleted, only edited
        </div>
      ) : (
        ''
      )}
      <div className="card shadow">
        <div className="card-header">
          <h4 className="float-left text-info">
            {history.location.pathname.includes('CreateDriver')
              ? 'Create Driver'
              : 'Update/Review Driver'}
          </h4>
        </div>
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="driver-name" className="form-label">
                Full Name
              </label>
              <input
                type="text"
                className="form-control"
                value={name || editdriver.nombre}
                onChange={(e) => {
                  setName(e.target.value)
                }}
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="lic" className="form-label">
                License Id
              </label>
              <input
                type="text"
                className="form-control"
                value={lic || editdriver.licencia}
                onChange={(e) => {
                  setLic(e.target.value)
                }}
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="lic-state" className="form-label">
                Driver License State
              </label>
              <input
                type="text"
                className="form-control"
                value={licState || editdriver.estado_licencia}
                onChange={(e) => {
                  setLicState(e.target.value)
                }}
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="lic-date" className="form-label">
                Driver License Exp Date
              </label>
              <DatePicker
                selected={
                  licDate !== ''
                    ? new Date(licDate + 'EST')
                    : new Date(
                        (editdriver.exp_licencia || '2022-01-01') + 'EST'
                      )
                }
                onChange={(date) => setLicDate(date)}
                className="form-control"
              />
            </div>
            <div className="mb-3">
              <label htmlFor="med-date" className="form-label">
                Med Card Exp Date
              </label>
              <DatePicker
                selected={
                  medDate !== ''
                    ? new Date(medDate + 'EST')
                    : new Date(
                        (editdriver.exp_tarjeta_med || '2022-01-01') + 'EST'
                      )
                }
                onChange={(date) => {
                  setMedDate(date)
                }}
                className="form-control"
              />
            </div>
            <div className="mb-3">
              <label htmlFor="app-date" className="form-label">
                Application Date
              </label>
              <DatePicker
                selected={
                  appDate !== ''
                    ? new Date(appDate + 'EST')
                    : new Date((editdriver.fecha_app || '2022-01-01') + 'EST')
                }
                onChange={(date) => {
                  setAppDate(date)
                }}
                className="form-control"
              />
            </div>
            <div className="mb-3">
              <label htmlFor="social" className="form-label">
                Social Security
              </label>
              <input
                type="text"
                className="form-control"
                value={social || editdriver.id_social_sec}
                onChange={(e) => {
                  setSocial(e.target.value)
                }}
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="address" className="form-label">
                Address
              </label>
              <input
                type="text"
                className="form-control"
                value={address || editdriver.direccion}
                onChange={(e) => {
                  setAddress(e.target.value)
                }}
                required
              />
            </div>
            <div className="mb-3">
              <label className="form-label upload-control">Application</label>
              <input
                type="file"
                style={{ display: 'none' }}
                ref={(fileInput) => (ref1 = fileInput)}
                onChange={(e) => {
                  //console.log(e.target.files[0].type)
                  const f = handleUpload(e, 'u-app')
                  if (f === 0) {
                    setApp(e.target.files[0])
                  } else {
                    setApp(null)
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
              <label id="u-app" className="m-2 form-label text-danger">
                No file selected
              </label>
              {history.location.pathname.includes('editDriver') ? (
                <a href={editdriver.app}>
                  <button
                    type="button"
                    className="ml-5 btn btn-info"
                    onClick={() => {
                      if (editdriver.app === null) alert('Document is missing')
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
              <label className="form-label upload-control">License</label>
              <input
                type="file"
                style={{ display: 'none' }}
                ref={(fileInput) => (ref2 = fileInput)}
                onChange={(e) => {
                  const f = handleUpload(e, 'u-lic')
                  if (f === 0) {
                    setLicImg(e.target.files[0])
                  } else {
                    setLicImg(null)
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
              <label id="u-lic" className="m-2 form-label text-danger">
                No file selected
              </label>
              {history.location.pathname.includes('editDriver') ? (
                <a href={editdriver.licencia_img}>
                  <button
                    type="button"
                    className="ml-5 btn btn-info"
                    onClick={() => {
                      if (editdriver.licencia_img === null)
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
              <label className="form-label upload-control">Med Card</label>
              <input
                type="file"
                style={{ display: 'none' }}
                ref={(fileInput) => (ref3 = fileInput)}
                onChange={(e) => {
                  const f = handleUpload(e, 'u-med')
                  if (f === 0) {
                    setTmed(e.target.files[0])
                  } else {
                    setTmed(null)
                  }
                }}
              />
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => ref3.click()}
              >
                Select File
              </button>
              <label id="u-med" className="m-2 form-label text-danger">
                No file selected
              </label>
              {history.location.pathname.includes('editDriver') ? (
                <a href={editdriver.tarjmed}>
                  <button
                    type="button"
                    className="ml-5 btn btn-info"
                    onClick={() => {
                      if (editdriver.tarjmed === null)
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
              <label className="form-label upload-control">Drug Test</label>
              <input
                type="file"
                style={{ display: 'none' }}
                ref={(fileInput) => (ref4 = fileInput)}
                onChange={(e) => {
                  const f = handleUpload(e, 'u-drug')
                  if (f === 0) {
                    setDrug(e.target.files[0])
                  } else {
                    setDrug(null)
                  }
                }}
              />
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => ref4.click()}
              >
                Select File
              </button>
              <label id="u-drug" className="m-2 form-label text-danger">
                No file selected
              </label>
              {history.location.pathname.includes('editDriver') ? (
                <a href={editdriver.drug}>
                  <button
                    type="button"
                    className="ml-5 btn btn-info"
                    onClick={() => {
                      if (editdriver.drug === null) alert('Document is missing')
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
              <label className="form-label upload-control">Lab</label>
              <input
                type="file"
                style={{ display: 'none' }}
                ref={(fileInput) => (ref5 = fileInput)}
                onChange={(e) => {
                  const f = handleUpload(e, 'u-lab')
                  if (f === 0) {
                    setLab(e.target.files[0])
                  } else {
                    setLab(null)
                  }
                }}
              />
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => ref5.click()}
              >
                Select File
              </button>
              <label id="u-lab" className="m-2 form-label text-danger">
                No file selected
              </label>
              {history.location.pathname.includes('editDriver') ? (
                <a href={editdriver.lab}>
                  <button
                    type="button"
                    className="ml-5 btn btn-info"
                    onClick={() => {
                      if (editdriver.lab === null) alert('Document is missing')
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
              <label className="form-label upload-control">Clereance</label>
              <input
                type="file"
                style={{ display: 'none' }}
                ref={(fileInput) => (ref6 = fileInput)}
                onChange={(e) => {
                  const f = handleUpload(e, 'u-clereance')
                  if (f === 0) {
                    setClereance(e.target.files[0])
                  } else {
                    setClereance(null)
                  }
                }}
              />
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => ref6.click()}
              >
                Select File
              </button>
              <label id="u-clereance" className="m-2 form-label text-danger">
                No file selected
              </label>
              {history.location.pathname.includes('editDriver') ? (
                <a href={editdriver.clereance}>
                  <button
                    type="button"
                    className="ml-5 btn btn-info"
                    onClick={() => {
                      if (editdriver.clereance === null)
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
              <label className="form-label upload-control">Policy</label>
              <input
                type="file"
                style={{ display: 'none' }}
                ref={(fileInput) => (ref7 = fileInput)}
                onChange={(e) => {
                  const f = handleUpload(e, 'u-policy')
                  if (f === 0) {
                    setPolice(e.target.files[0])
                  } else {
                    setPolice(null)
                  }
                }}
              />
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => ref7.click()}
              >
                Select File
              </button>
              <label id="u-app" className="m-2 form-label text-danger">
                No file selected
              </label>
              {history.location.pathname.includes('editDriver') ? (
                <a href={editdriver.police}>
                  <button
                    type="button"
                    className="ml-5 btn btn-info"
                    onClick={() => {
                      if (editdriver.police === null)
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
                Attached Inspections
              </label>
              <input
                type="file"
                multiple
                style={{ display: 'none' }}
                ref={(fileInput) => (ref = fileInput)}
                onChange={(e) => {
                  const f = handleUpload2(e, 'inspects')
                  if (f === 0) {
                    setInspectSend(e.target.files)
                  } else {
                    setInspectSend(null)
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
              <label id="inspects" className="m-2 form-label text-danger">
                No file selected
              </label>
            </div>
            {history.location.pathname.includes('editDriver') &&
            inspect !== null ? (
              <div className="mb-3">
                <label className="form-label">Inspection List</label>
                <ul className="list-group">
                  {inspect.map((ins, index) => {
                    return (
                      <li
                        key={index}
                        className="list-group-item list-group-item-action list-group-item-info d-flex justify-content-between align-items-center w-25"
                      >
                        {ins.inspeccion.slice(50)}
                        <span>
                          <a href={ins.inspeccion}>
                            <i
                              className="mr-3 fas fa-download text-primary"
                              style={{ cursor: 'pointer' }}
                            ></i>
                          </a>
                          <i
                            className="fas fa-trash text-danger"
                            style={{ cursor: 'pointer' }}
                            onClick={() => deleteIns(ins.id)}
                          ></i>
                        </span>
                      </li>
                    )
                  })}
                </ul>
              </div>
            ) : null}
            <button type="submit" className="mt-2 btn btn-primary">
              {history.location.pathname.includes('CreateDriver')
                ? 'Create'
                : 'Update'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default CreateDriver
