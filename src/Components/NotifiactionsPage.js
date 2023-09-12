import React, { useState, useEffect } from 'react'
import axios from 'axios'

function NotificationPage() {
  const [notifications, setNotifications] = useState([])

  useEffect(() => {
    axios
      .get('https://api.rexpresstrucks.com/notificaciones/', {
        withCredentials: true,
      })
      .then((res) => {
        //console.log(res.data)
        if (localStorage.level !== '1') {
          setNotifications(
            res.data.filter((not) => {
              return not.modelo !== 'Facturas'
            })
          )
        } else {
          setNotifications(res.data)
        }
      })
      .catch((err) => console.log(err))
  }, [])

  return (
    <div className="container-fluid mb-4">
      <div className="card shadow">
        <div className="card-header">
          <h4 className="float-left text-info">Notifications</h4>
        </div>
        <div className="card-body">
          <div className="table-responsive">
            <table
              className="table table-info table-striped"
              style={{ borderRadius: '10px' }}
            >
              <thead style={{ color: 'rgb(105, 54, 156)' }}>
                <tr>
                  <th scope="col">Notification Number</th>
                  <th scope="col">Notification Date</th>
                  <th scope="col">Document Type</th>
                  <th scope="col">Owner Identifier</th>
                  <th scope="col">Checked</th>
                </tr>
              </thead>
              <tbody style={{ color: 'rgba(110, 71, 145, 0.966)' }}>
                {notifications.map((notification, index) => {
                  let tDoc = ''
                  switch (notification.campo) {
                    case 'exp_licencia':
                      tDoc = 'Driver License'
                      break
                    case 'exp_tarjeta_med':
                      tDoc = 'Med Card'
                      break
                    case 'exp_registracion':
                      if (notification.modelo === 'Camiones') {
                        tDoc = 'Truck Registration'
                      } else {
                        tDoc = 'Trailer Registration'
                      }
                      break
                    case 'exp_inspeccion_anual':
                      if (notification.modelo === 'Trailers') {
                        tDoc = 'Annual Inspection Truck'
                      } else {
                        tDoc = 'Annual Inspection Trailer'
                      }
                      break
                    case '5':
                      tDoc = 'Invoice'
                      break
                    case '0':
                      tDoc = 'Invoice'
                      break
                    default:
                      tDoc = 'Unknow Document'
                  }
                  return (
                    <tr key={index}>
                      <th scope="row">{notification.id}</th>
                      <td>
                        {new Date(
                          notification.created_at + 'EST'
                        ).toDateString()}
                      </td>
                      <td>{tDoc}</td>
                      <td>{notification.identifier}</td>
                      <td
                        style={{
                          color: notification.leido ? '#1cc88a' : '#e74a3b',
                        }}
                      >
                        {notification.leido ? 'Yes' : 'No'}
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

export default NotificationPage
