import React from 'react'

//Transform Date
const transform = (date) => {
  return date
}

const Notification = ({ notification, clicks }) => {
  let icon = ''
  let text = ''
  let newDate = undefined
  if (clicks !== -1) {
    newDate = transform(notification.created_at)
    switch (notification.campo) {
      case 'exp_licencia':
        icon = 'fas fa-id-card text-white'
        text = `License of ${notification.identifier} is about to expire!`
        break
      case 'exp_tarjeta_med':
        icon = 'fas fa-briefcase-medical text-white'
        text = `Med card of ${notification.identifier} is about to expire!`
        break
      case 'exp_registracion':
        if (notification.modelo === 'Camiones') {
          icon = 'fas fa-clipboard text-white'
          text = `Registration of truck number ${notification.identifier} is about to expire!`
        } else {
          icon = 'fas fa-clipboard text-white'
          text = `Registration of trailer number ${notification.identifier} is about to expire!`
        }
        break
      case 'exp_inspeccion_anual':
        if (notification.modelo === 'Camiones') {
          icon = 'fas fa-file-alt text-white'
          text = `Annual inspection of truck number ${notification.identifier} is about to expire!`
        } else {
          icon = 'fas fa-file-alt text-white'
          text = `Annual inspection of trailer number ${notification.identifier} is about to expire!`
        }
        break
      case '5':
        icon = 'fas fa-clock text-white'
        text = `5 days left for the due date of the invoice ${notification.identifier}!`
        break
      case '6':
        icon = 'fas fa-exclamation-triangle text-white'
        text = `Invoice number ${notification.identifier} has expired!`
        break
      default:
        icon = 'fas fa-question text-white'
    }
  }

  return (
    <a className="dropdown-item d-flex align-items-center">
      <div className="mr-3">
        <div
          className={
            clicks === -1 ? 'icon-circle bg-success' : 'icon-circle bg-warning'
          }
        >
          <i
            className={
              clicks === -1 ? 'fas fa-clipboard-check text-white' : icon
            }
          ></i>
        </div>
      </div>
      <div>
        <div className="small text-gray-500">
          {clicks === -1 ? 'now' : newDate}
        </div>
        <span className={clicks >= 2 ? '' : 'font-weight-bold'}>
          {clicks === -1 ? 'No pending notifications' : text}
        </span>
      </div>
    </a>
  )
}

export default Notification
