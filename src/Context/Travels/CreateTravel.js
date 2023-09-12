import React, { useContext, useState } from 'react'
import { Redirect, useHistory, useParams } from 'react-router'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import '../../css/upload-control.css'
import axios from 'axios'
import { BiCloudDownload } from 'react-icons/bi'

import { TravelsContext } from './Travels'
import { TrucksContext } from '../Trucks/Trucks'
import { DriversContext } from '../Drivers/Drivers'
import { TrailersContext } from '../Trailers/Trailers'
import { LoadsContext } from '../Loads/Loads'

function CreateTravel() {
  const [TravelsData, setTravelsData] = useContext(TravelsContext)
  const [TrucksData, setTrucksData] = useContext(TrucksContext)
  const [DriversData, setDriversData] = useContext(DriversContext)
  const [TrailersData, setTrailersData] = useContext(TrailersContext)
  const [LoadsData, setLoadsData] = useContext(LoadsContext)
  const history = useHistory()

  // For edit Travel
  let edittravel = {
    id: 0,
    fecha_salida: '',
    notas: '',
    camion: '',
    trailer: '',
    chofer1: '',
    chofer2: '',
    carga1: '',
    carga2: '',
    carga3: '',
    log_chofer_1: null,
    log_chofer_2: null,
    diesel: null,
  }
  let editTId = useParams()

  if (history.location.pathname.includes('editTravel')) {
    if (TravelsData.length !== 0) {
      for (let i = 0; i < TravelsData.length; i++) {
        if (TravelsData[i].id === Number(editTId.tid)) {
          edittravel.id = TravelsData[i].id
          edittravel.fecha_salida = TravelsData[i].fecha_salida
          edittravel.notas = TravelsData[i].notas
          edittravel.camion = TravelsData[i].camion
          edittravel.trailer = TravelsData[i].trailer
          edittravel.chofer1 = TravelsData[i].chofer1
          edittravel.chofer2 = TravelsData[i].chofer2
          edittravel.carga1 = TravelsData[i].carga1
          edittravel.carga2 = TravelsData[i].carga2
          edittravel.carga3 = TravelsData[i].carga3
          edittravel.log_chofer_1 = TravelsData[i].log_chofer1
          edittravel.log_chofer_2 = TravelsData[i].log_chofer2
          edittravel.diesel = TravelsData[i].diesel
        }
      }
      for (let i = 0; i < DriversData.length; i++) {
        if (DriversData[i].id === edittravel.chofer1) {
          edittravel.chofer1 = DriversData[i].nombre
          continue
        }
        if (DriversData[i].id === edittravel.chofer2) {
          edittravel.chofer2 = DriversData[i].nombre
        }
      }
      for (let i = 0; i < LoadsData.length; i++) {
        if (LoadsData[i].id === edittravel.carga1) {
          edittravel.carga1 = LoadsData[i].num_carga
          continue
        }
        if (LoadsData[i].id === edittravel.carga2) {
          edittravel.carga2 = LoadsData[i].num_carga
        }
      }
      for (let i = 0; i < TrucksData.length; i++) {
        if (TrucksData[i].id === edittravel.camion) {
          edittravel.camion = TrucksData[i].numero
        }
      }
      for (let i = 0; i < TrailersData.length; i++) {
        if (TrailersData[i].id === edittravel.trailer) {
          edittravel.trailer = TrailersData[i].numero
        }
      }
    }
  } else {
    edittravel.fecha_salida = new Date()
  }

  /* Assigning initial values based on -EDIT or CREATE */
  const [loadNo, setLoadNo] = useState(edittravel.num_carga)
  const [goDate, setGoDate] = useState(edittravel.fecha_salida)
  const [notes, setNotes] = useState(edittravel.notas)
  const [truck, setTruck] = useState(edittravel.camion)
  const [trailer, setTrailer] = useState(edittravel.trailer)
  const [driver1, setDriver1] = useState(edittravel.chofer1)
  const [driver2, setDriver2] = useState(edittravel.chofer2)
  const [load1, setLoad1] = useState(edittravel.carga1)
  const [load2, setLoad2] = useState(edittravel.carga2)
  const [load3, setLoad3] = useState(edittravel.carga3)
  const [log1, setLog1] = useState(edittravel.log_chofer_1)
  const [log2, setLog2] = useState(edittravel.log_chofer_2)
  const [diesel, setDiesel] = useState(edittravel.diesel)

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

    let driver_id_1 = 0
    let driver_id_2 = 0
    let load_id_1 = 0
    let load_id_2 = 0
    let load_id_3 = 0
    let truck_id = 0
    let trailer_id = 0
    let method = ''
    let str = ''
    let error = ''

    for (let i = 0; i < TrucksData.length; i++) {
      if (TrucksData[i].numero === (Number(truck) || edittravel.camion)) {
        truck_id = TrucksData[i].id
      }
    }

    for (let i = 0; i < TrailersData.length; i++) {
      if (TrailersData[i].numero === (Number(trailer) || edittravel.trailer)) {
        trailer_id = TrailersData[i].id
      }
    }

    for (let i = 0; i < DriversData.length; i++) {
      if (DriversData[i].nombre === (driver1 || edittravel.chofer1)) {
        driver_id_1 = DriversData[i].id
      }
      if (DriversData[i].nombre === (driver2 || edittravel.chofer2)) {
        driver_id_2 = DriversData[i].id
      }
    }

    for (let i = 0; i < LoadsData.length; i++) {
      if (LoadsData[i].num_carga === (load1 || edittravel.carga1)) {
        load_id_1 = LoadsData[i].id
      }
      if (LoadsData[i].num_carga === (load2 || edittravel.carga2)) {
        load_id_2 = LoadsData[i].id
      }
      if (load3 !== null || edittravel.carga3 !== null) {
        if (LoadsData[i].num_carga === (load3 || edittravel.carga3)) {
          load_id_3 = LoadsData[i].id
        }
      }
    }

    if (driver_id_1 === driver_id_2) {
      alert('Error: Duplicate Driver')
      return
    }

    if (
      load_id_1 === load_id_2 ||
      load_id_1 === load_id_3 ||
      load_id_2 === load_id_3
    ) {
      alert('Error: Duplicate Load')
      return
    }

    if (history.location.pathname.includes('CreateTravel')) {
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
        uploadData.append(
          'fecha_salida',
          goDate !== ''
            ? formatDate(goDate)
            : formatDate(edittravel.fecha_salida)
        )
        uploadData.append('carga1', load_id_1)
        uploadData.append('carga2', load_id_2)
        if (load_id_3 !== 0) {
          uploadData.append('carga3', load_id_3)
        }
        uploadData.append('notas', notes || edittravel.notas)
        uploadData.append('camion', truck_id)
        uploadData.append('trailer', trailer_id)
        uploadData.append('chofer1', driver_id_1)
        uploadData.append('chofer2', driver_id_2)
        if (log1 !== null && log1.type === 'application/pdf') {
          uploadData.append('log_chofer_1', log1)
        }
        if (log2 !== null && log2.type === 'application/pdf') {
          uploadData.append('log_chofer_2', log2)
        }
        if (diesel !== null && diesel.type === 'application/pdf') {
          uploadData.append('diesel', diesel)
        }

        /* for (const [key, value] of uploadData) {
          console.log(`${key}: ${value}`)
        } */

        fetch(`https://api.rexpresstrucks.com/viajes/${str}`, {
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
            history.push('/travels')
            window.location.reload()
          })
      })
      .catch((err) => {
        console.log(err)
        alert(`Error getting token token.\n${err}`)
      })
  }

  if (localStorage.level !== '2' && localStorage.level !== '1') {
    return <Redirect to="/403" />
  }

  //reference var to bound upload-btn with the hidden input file
  let ref1, ref2, ref3

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
      {!history.location.pathname.includes('CreateTravel') ? (
        <div className="text-primary mb-3">
          Note : The fields with data, can not be deleted, only edited
        </div>
      ) : (
        ''
      )}
      <div className="card shadow">
        <div className="card-header">
          <h4 className="float-left text-info">
            {history.location.pathname.includes('CreateTravel')
              ? 'Create Travel'
              : 'Update/Preview Travel'}
          </h4>
        </div>
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="truck-load" className="form-label">
                Truck Number
              </label>
              <select
                className="form-control"
                value={truck || edittravel.camion}
                onChange={(e) => {
                  setTruck(e.target.value)
                }}
                required
              >
                <option value=""></option>
                {TrucksData.map((truck) => {
                  return (
                    <option key={truck.id} value={truck.numero}>
                      {truck.numero}
                    </option>
                  )
                })}
              </select>
            </div>
            <div className="mb-3">
              <label htmlFor="trailer-load" className="form-label">
                Trailer Number
              </label>
              <select
                className="form-control"
                value={trailer || edittravel.trailer}
                onChange={(e) => {
                  setTrailer(e.target.value)
                }}
                required
              >
                <option value=""></option>
                {TrailersData.map((trailer) => {
                  return (
                    <option key={trailer.id} value={trailer.numero}>
                      {trailer.numero}
                    </option>
                  )
                })}
              </select>
            </div>
            <div className="mb-3">
              <label htmlFor="driver1-load" className="form-label">
                Driver 1
              </label>
              <select
                className="form-control"
                value={driver1 || edittravel.chofer1}
                onChange={(e) => {
                  setDriver1(e.target.value)
                }}
                required
              >
                <option value=""></option>
                {DriversData.map((driver) => {
                  return (
                    <option key={driver.id} value={driver.nombre}>
                      {driver.nombre}
                    </option>
                  )
                })}
              </select>
            </div>
            <div className="mb-3">
              <label htmlFor="driver2-load" className="form-label">
                Driver 2
              </label>
              <select
                className="form-control"
                value={driver2 || edittravel.chofer2}
                onChange={(e) => {
                  setDriver2(e.target.value)
                }}
                required
              >
                <option value=""></option>
                {DriversData.map((driver) => {
                  return (
                    <option key={driver.id} value={driver.nombre}>
                      {driver.nombre}
                    </option>
                  )
                })}
              </select>
            </div>
            <div className="mb-3">
              <label htmlFor="go-date" className="form-label">
                Departure Date
              </label>
              <DatePicker
                selected={
                  goDate !== ''
                    ? new Date(goDate + 'EST')
                    : new Date(
                        (edittravel.fecha_salida || '2022-01-01') + 'EST'
                      )
                }
                onChange={(date) => setGoDate(date)}
                className="form-control"
              />
            </div>
            <div className="mb-3">
              <label htmlFor="load1" className="form-label">
                Upload Load
              </label>
              <select
                className="form-control"
                value={load1 || edittravel.carga1}
                onChange={(e) => {
                  setLoad1(e.target.value)
                }}
                required
              >
                <option value=""></option>
                {LoadsData.map((load) => {
                  return (
                    <option key={load.id} value={load.num_carga}>
                      {load.num_carga}
                    </option>
                  )
                })}
              </select>
            </div>
            <div className="mb-3">
              <label htmlFor="load1" className="form-label">
                Down Load
              </label>
              <select
                className="form-control"
                value={load2 || edittravel.carga2}
                onChange={(e) => {
                  setLoad2(e.target.value)
                }}
                required
              >
                <option value=""></option>
                {LoadsData.map((load) => {
                  return (
                    <option key={load.id} value={load.num_carga}>
                      {load.num_carga}
                    </option>
                  )
                })}
              </select>
            </div>
            {(history.location.pathname.includes('editTravel') &&
              edittravel.carga3 !== null) ||
            history.location.pathname.includes('CreateTravel') ? (
              <div className="mb-3">
                <label htmlFor="load1" className="form-label">
                  Additional Load
                </label>
                <select
                  className="form-control"
                  value={load3 || edittravel.carga3}
                  onChange={(e) => {
                    setLoad3(e.target.value)
                  }}
                >
                  <option value=""></option>
                  {LoadsData.map((load) => {
                    return (
                      <option key={load.id} value={load.num_carga}>
                        {load.num_carga}
                      </option>
                    )
                  })}
                </select>
              </div>
            ) : null}
            <div className="mb-3">
              <label htmlFor="notes" className="form-label">
                Notas
              </label>
              <textarea
                className="form-control"
                value={notes || edittravel.notas}
                onChange={(e) => {
                  setNotes(e.target.value)
                }}
              />
            </div>
            <div className="mb-3">
              <label className="form-label upload-control">
                Log Book Driver 1
              </label>
              <input
                type="file"
                style={{ display: 'none' }}
                ref={(fileInput) => (ref1 = fileInput)}
                onChange={(e) => {
                  const f = handleUpload(e, 'u-log1')
                  if (f === 0) {
                    setLog1(e.target.files[0])
                  } else {
                    setLog1(null)
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
              <label id="u-log1" className="m-2 form-label text-danger">
                No file selected
              </label>
              {history.location.pathname.includes('editTravel') ? (
                <a href={edittravel.log_chofer_1}>
                  <button
                    type="button"
                    className="ml-5 btn btn-info"
                    onClick={() => {
                      if (edittravel.log_chofer_1 === null)
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
                Log Book Driver 2
              </label>
              <input
                type="file"
                style={{ display: 'none' }}
                ref={(fileInput) => (ref2 = fileInput)}
                onChange={(e) => {
                  const f = handleUpload(e, 'u-log2')
                  if (f === 0) {
                    setLog2(e.target.files[0])
                  } else {
                    setLog2(null)
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
              <label id="u-log2" className="m-2 form-label text-danger">
                No file selected
              </label>
              {history.location.pathname.includes('editTravel') ? (
                <a href={edittravel.log_chofer_2}>
                  <button
                    type="button"
                    className="ml-5 btn btn-info"
                    onClick={() => {
                      if (edittravel.log_chofer_2 === null)
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
              <label className="form-label upload-control">Diesel</label>
              <input
                type="file"
                style={{ display: 'none' }}
                ref={(fileInput) => (ref3 = fileInput)}
                onChange={(e) => {
                  const f = handleUpload(e, 'u-diesel')
                  if (f === 0) {
                    setDiesel(e.target.files[0])
                  } else {
                    setDiesel(null)
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
              <label id="u-diesel" className="m-2 form-label text-danger">
                No file selected
              </label>
              {history.location.pathname.includes('editTravel') ? (
                <a href={edittravel.diesel}>
                  <button
                    type="button"
                    className="ml-5 btn btn-info"
                    onClick={() => {
                      if (edittravel.diesel === null)
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
              {history.location.pathname.includes('CreateTravel')
                ? 'Create'
                : 'Update'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default CreateTravel
