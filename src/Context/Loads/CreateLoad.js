import React, { useContext, useState } from 'react'
import { Redirect, useHistory, useParams } from 'react-router'
import '../../css/upload-control.css'
import axios from 'axios'
import { BiCloudDownload } from 'react-icons/bi'

import { LoadsContext } from './Loads'

function CreateLoad() {
  const [LoadsData, setLoadsData] = useContext(LoadsContext)
  const history = useHistory()

  // For edit Loads
  let editload = {
    id: 0,
    num_carga: '',
    precio: '',
    nombre_broker: '',
    confirmacion: null,
    bol: null,
  }
  let editLId = useParams()

  if (history.location.pathname.includes('editLoad')) {
    if (LoadsData.length !== 0) {
      for (let i = 0; i < LoadsData.length; i++) {
        if (LoadsData[i].id === Number(editLId.lid)) {
          editload.id = LoadsData[i].id
          editload.num_carga = LoadsData[i].num_carga
          editload.precio = LoadsData[i].precio
          editload.nombre_broker = LoadsData[i].nombre_broker
          editload.confirmacion = LoadsData[i].confirmacion
          editload.bol = LoadsData[i].bol
        }
      }
    }
  }

  /* Assigning initial values based on -EDIT or CREATE */
  const [loadNo, setLoadNo] = useState(editload.num_carga)
  const [price, setPrice] = useState(editload.precio)
  const [broker, setBroker] = useState(editload.nombre_broker)
  const [conf, setConf] = useState(editload.confirmacion)
  const [bol, setBol] = useState(editload.bol)

  /* Handling Form Submittion */
  const handleSubmit = (e) => {
    e.preventDefault()

    let method = ''
    let str = ''
    let error = ''

    if (history.location.pathname.includes('CreateLoad')) {
      method = 'POST'
      error = 'Error sending to server.'
    } else {
      method = 'PUT'
      str = `${editLId.lid}/`
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
        uploadData.append('num_carga', loadNo || editload.num_carga)
        uploadData.append('precio', price || editload.precio)
        uploadData.append('nombre_broker', broker || editload.nombre_broker)

        if (conf !== null && conf.type === 'application/pdf') {
          uploadData.append('confirmacion', conf)
        }
        if (bol !== null && bol.type === 'application/pdf') {
          uploadData.append('bol', bol)
        }

        /* for (const [key, value] of uploadData) {
          console.log(`${key}: ${value}`)
        } */

        fetch(`https://api.rexpresstrucks.com/cargas/${str}`, {
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
            history.push('/loads')
            window.location.reload()
          })
      })
      .catch((err) => {
        console.log(err)
        alert(`Error getting token.\n${err}`)
      })
  }

  if (localStorage.level !== '2' && localStorage.level !== '1') {
    return <Redirect to="/403" />
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
      {!history.location.pathname.includes('CreateLoad') ? (
        <div className="text-primary mb-3">
          Note : The fields with data, can not be deleted, only edited
        </div>
      ) : (
        ''
      )}
      <div className="card shadow">
        <div className="card-header">
          <h4 className="float-left text-info">
            {history.location.pathname.includes('CreateLoad')
              ? 'Create Load'
              : 'Update/Preview Load'}
          </h4>
        </div>
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="load-no" className="form-label">
                Load Number
              </label>
              <input
                type="text"
                className="form-control"
                value={loadNo || editload.num_carga}
                onChange={(e) => {
                  setLoadNo(e.target.value)
                }}
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="broker" className="form-label">
                Broker Name
              </label>
              <input
                type="text"
                className="form-control"
                value={broker || editload.nombre_broker}
                onChange={(e) => {
                  setBroker(e.target.value)
                }}
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="price" className="form-label">
                Price
              </label>
              <input
                type="number"
                className="form-control"
                value={price || editload.precio}
                onChange={(e) => {
                  setPrice(e.target.value)
                }}
                required
              />
            </div>
            <div className="mb-3">
              <label className="form-label upload-control">Confirmation</label>
              <input
                type="file"
                style={{ display: 'none' }}
                ref={(fileInput) => (ref = fileInput)}
                onChange={(e) => {
                  const f = handleUpload(e, 'conf')
                  if (f === 0) {
                    setConf(e.target.files[0])
                  } else {
                    setConf(null)
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
              <label id="conf" className="m-2 form-label text-danger">
                No file selected
              </label>
              {history.location.pathname.includes('editLoad') ? (
                <a href={editload.confirmacion}>
                  <button
                    type="button"
                    className="ml-5 btn btn-info"
                    onClick={() => {
                      if (editload.confirmacion === null)
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
              <label className="form-label upload-control">BOL</label>
              <input
                type="file"
                style={{ display: 'none' }}
                ref={(fileInput) => (ref1 = fileInput)}
                onChange={(e) => {
                  const f = handleUpload(e, 'bol')
                  if (f === 0) {
                    setBol(e.target.files[0])
                  } else {
                    setBol(null)
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
              <label id="bol" className="m-2 form-label text-danger">
                No file selected
              </label>
              {history.location.pathname.includes('editLoad') ? (
                <a href={editload.bol}>
                  <button
                    type="button"
                    className="ml-5 btn btn-info"
                    onClick={() => {
                      if (editload.bol === null) alert('Document is missing')
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
              {history.location.pathname.includes('CreateLoad')
                ? 'Create'
                : 'Update'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default CreateLoad
