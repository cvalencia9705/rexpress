import React, { useState, useEffect } from 'react'
import { BiCloudUpload, BiCloudDownload } from 'react-icons/bi'
import axios from 'axios'

const CompanyDocuments = () => {
  const [auth, setAuth] = useState(null)
  const [ifta, setIfta] = useState(null)
  const [newMex, setNewMex] = useState(null)
  const [sec, setSec] = useState(null)
  const [kent, setKent] = useState(null)
  const [documents, setDocuments] = useState({
    auth: null,
    ifta: null,
    newMexico: null,
    seguro: null,
    kentuky: null,
  })

  let ref1 //ref variables to the input files
  let ref2 //ref variables to the input files
  let ref3 //ref variables to the input files
  let ref4 //ref variables to the input files
  let ref5 //ref variables to the input files

  /* Handling submittion */
  const handleSubmit = (doc) => {
    //API call
    axios
      .get('https://api.rexpresstrucks.com/auth/csrf/', {
        withCredentials: true,
      })
      .then((res) => {
        const _csrfToken = res.data.csrfToken

        const uploadData = new FormData()
        switch (doc) {
          case 1:
            if (auth !== null) {
              uploadData.append('auth', auth)
            } else {
              throw new Error('No file selected')
            }
            break
          case 2:
            if (ifta !== null) {
              uploadData.append('ifta', ifta)
            } else {
              throw new Error('No file selected')
            }
            break
          case 3:
            if (newMex !== null) {
              uploadData.append('newMexico', newMex)
            } else {
              throw new Error('No file selected')
            }
            break
          case 4:
            if (kent !== null) {
              uploadData.append('kentuky', kent)
            } else {
              throw new Error('No file selected')
            }
            break
          case 5:
            if (sec !== null) {
              uploadData.append('seguro', sec)
            } else {
              throw new Error('No file selected')
            }
            break
          default:
            throw new Error('No file selected')
        }

        fetch(`https://api.rexpresstrucks.com/empresa/1/`, {
          method: 'PUT',
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
            alert('Document uploaded successfully')
          })
          .catch((err) => {
            console.log(err)
            alert(`Error loading document\n${err}`)
          })
          .finally(() => {
            window.location.reload()
          })
      })
      .catch((err) => {
        console.log(err)
        alert(`Error getting token or empty file.\n${err}`)
      })
  }

  /* Checking State before submit */
  const Check = () => {
    let ch = 0

    if (auth === null) ch++
    if (ifta === null) ch++
    if (newMex === null) ch++
    if (sec === null) ch++
    if (kent === null) ch++

    return ch
  }

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

  useEffect(() => {
    axios
      .get('https://api.rexpresstrucks.com/empresa/', { withCredentials: true })
      .then((res) => {
        //console.log(res.data)
        if (res.data.length > 0) {
          setDocuments(res.data[0])
        }
      })
      .catch((err) => console.log(err))
  }, [])

  return (
    <div className="container-fluid">
      <div className="d-sm-flex align-items-center justify-content-between mb-4">
        <h1 className="h3 mb-0 text-gray-800">Company Documents</h1>
      </div>
      <div className="row">
        <div className="col-lg-6 mb-4">
          <div className="card shadow mb-4">
            <div className="card-header py-3">
              <h6 className="m-0 font-weight-bold text-primary">Authority</h6>
            </div>
            <div className="card-body">
              <div className="mb-3">
                <h6>
                  Click the <span className="font-weight-bold">Download</span>{' '}
                  button to save a copy of the aviable document or select a file
                  and then press{' '}
                  <span className="font-weight-bold">Upload</span> to update the
                  existing document
                </h6>
              </div>

              <div className="mb-3">
                <input
                  type="file"
                  style={{ display: 'none' }}
                  ref={(fileInput) => (ref1 = fileInput)}
                  onChange={(e) => {
                    const f = handleUpload(e, 'auth')
                    if (f === 0) {
                      setAuth(e.target.files[0])
                    } else {
                      setAuth(null)
                    }
                  }}
                />
                <button
                  className="btn btn-secondary"
                  onClick={() => ref1.click()}
                >
                  Select File
                </button>{' '}
                <label className="m-2 form-label text-danger" id="auth">
                  No file selected
                </label>
                <button
                  className="float-right btn btn-info"
                  onClick={() => handleSubmit(1)}
                >
                  <BiCloudUpload
                    style={{
                      width: '24px',
                      height: '24px',
                      marginTop: '-3px',
                    }}
                    className="me-2"
                  />{' '}
                  Upload
                </button>
                <a href={documents.auth}>
                  <button
                    className="mr-2 float-right btn btn-primary"
                    onClick={() => {
                      if (documents.auth === null) alert('Document is missing')
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
                    Download
                  </button>
                </a>
              </div>
            </div>
          </div>
        </div>
        <div className="col-lg-6 mb-4">
          <div className="card shadow mb-4">
            <div className="card-header py-3">
              <h6 className="m-0 font-weight-bold text-primary">Info</h6>
            </div>
            <div className="card-body">
              <h5>
                Number of files selected:{' '}
                <span className={Check() === 5 ? 'text-danger' : 'text-info'}>
                  {5 - Check()}
                </span>
              </h5>
              <label className="float-right">
                Note: if you see the{' '}
                <span className="text-warning">Wrong Format</span> notice please
                select an appropriate file again
              </label>
              <h5>
                Supported formats: <span className="text-danger">PDF</span>
              </h5>
            </div>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-lg-6 mb-4">
          <div className="card shadow mb-4">
            <div className="card-header py-3">
              <h6 className="m-0 font-weight-bold text-primary">Ifta</h6>
            </div>
            <div className="card-body">
              <div className="mb-3">
                <input
                  type="file"
                  style={{ display: 'none' }}
                  ref={(fileInput) => (ref2 = fileInput)}
                  onChange={(e) => {
                    const f = handleUpload(e, 'ifta')
                    if (f === 0) {
                      setIfta(e.target.files[0])
                    } else {
                      setIfta(null)
                    }
                  }}
                />
                <button
                  className="btn btn-secondary"
                  onClick={() => ref2.click()}
                >
                  Select File
                </button>{' '}
                <label className="m-2 form-label text-danger" id="ifta">
                  No file selected
                </label>
                <button
                  className="float-right btn btn-info"
                  onClick={() => handleSubmit(2)}
                >
                  <BiCloudUpload
                    style={{
                      width: '24px',
                      height: '24px',
                      marginTop: '-3px',
                    }}
                    className="me-2"
                  />{' '}
                  Upload
                </button>
                <a href={documents.ifta}>
                  <button
                    className="mr-2 float-right btn btn-primary"
                    onClick={() => {
                      if (documents.ifta === null) alert('Document is missing')
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
                    Download
                  </button>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="row">
        <div className="col-lg-6 mb-4">
          <div className="card shadow mb-4">
            <div className="card-header py-3">
              <h6 className="m-0 font-weight-bold text-primary">New Mexico</h6>
            </div>
            <div className="card-body">
              <div className="mb-3">
                <input
                  type="file"
                  style={{ display: 'none' }}
                  ref={(fileInput) => (ref3 = fileInput)}
                  onChange={(e) => {
                    const f = handleUpload(e, 'nmex')
                    if (f === 0) {
                      setNewMex(e.target.files[0])
                    } else {
                      setNewMex(null)
                    }
                  }}
                />
                <button
                  className="btn btn-secondary"
                  onClick={() => ref3.click()}
                >
                  Select File
                </button>{' '}
                <label className="m-2 form-label text-danger" id="nmex">
                  No file selected
                </label>
                <button
                  className="float-right btn btn-info"
                  onClick={() => handleSubmit(3)}
                >
                  <BiCloudUpload
                    style={{
                      width: '24px',
                      height: '24px',
                      marginTop: '-3px',
                    }}
                    className="me-2"
                  />{' '}
                  Upload
                </button>
                <a href={documents.newMexico}>
                  <button
                    className="mr-2 float-right btn btn-primary"
                    onClick={() => {
                      if (documents.newMexico === null)
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
                    Download
                  </button>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="row">
        <div className="col-lg-6 mb-4">
          <div className="card shadow mb-4">
            <div className="card-header py-3">
              <h6 className="m-0 font-weight-bold text-primary">Kentucky</h6>
            </div>
            <div className="card-body">
              <div className="mb-3">
                <input
                  type="file"
                  style={{ display: 'none' }}
                  ref={(fileInput) => (ref4 = fileInput)}
                  onChange={(e) => {
                    const f = handleUpload(e, 'kent')
                    if (f === 0) {
                      setKent(e.target.files[0])
                    } else {
                      setKent(null)
                    }
                  }}
                />
                <button
                  className="btn btn-secondary"
                  onClick={() => ref4.click()}
                >
                  Select File
                </button>{' '}
                <label className="m-2 form-label text-danger" id="kent">
                  No file selected
                </label>
                <button
                  className="float-right btn btn-info"
                  onClick={() => handleSubmit(4)}
                >
                  <BiCloudUpload
                    style={{
                      width: '24px',
                      height: '24px',
                      marginTop: '-3px',
                    }}
                    className="me-2"
                  />{' '}
                  Upload
                </button>
                <a href={documents.kentuky}>
                  <button
                    className="mr-2 float-right btn btn-primary"
                    onClick={() => {
                      if (documents.kentuky === null)
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
                    Download
                  </button>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="row">
        <div className="col-lg-6 mb-4">
          <div className="card shadow mb-4">
            <div className="card-header py-3">
              <h6 className="m-0 font-weight-bold text-primary">Insurance</h6>
            </div>
            <div className="card-body">
              <div className="mb-3">
                <input
                  type="file"
                  style={{ display: 'none' }}
                  ref={(fileInput) => (ref5 = fileInput)}
                  onChange={(e) => {
                    const f = handleUpload(e, 'insu')
                    if (f === 0) {
                      setSec(e.target.files[0])
                    } else {
                      setSec(null)
                    }
                  }}
                />
                <button
                  className="btn btn-secondary"
                  onClick={() => ref5.click()}
                >
                  Select File
                </button>{' '}
                <label className="m-2 form-label text-danger" id="insu">
                  No file selected
                </label>
                <button
                  className="float-right btn btn-info"
                  onClick={() => handleSubmit(5)}
                >
                  <BiCloudUpload
                    style={{
                      width: '24px',
                      height: '24px',
                      marginTop: '-3px',
                    }}
                    className="me-2"
                  />{' '}
                  Upload
                </button>
                <a href={documents.seguro}>
                  <button
                    className="mr-2 float-right btn btn-primary"
                    onClick={() => {
                      if (documents.seguro === null)
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
                    Download
                  </button>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CompanyDocuments
