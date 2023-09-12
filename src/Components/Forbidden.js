import React from 'react'
import { useHistory } from 'react-router'

const Forbidden = () => {
  const history = useHistory()

  const body = document.getElementById('bdy')
  body.style.background = '#5a5c69'

  return (
    <div className="container py-5 bg-dark text-white">
      <div className="row">
        <div className="col-md-2 text-center">
          <p>
            <i className="fa fa-exclamation-triangle fa-5x"></i>
            <br />
            Status Code: 403
          </p>
        </div>
        <div className="col-md-10">
          <h3>OPPSSS!!!! Sorry...</h3>
          <p>
            Sorry, your access is refused due to security reasons of our server
            and also our sensitive data.
            <br />
            Please go back to the previous page to continue browsing.
          </p>
          <i className="btn btn-danger" onClick={() => history.goBack()}>
            Go Back
          </i>
        </div>
      </div>
    </div>
  )
}

export default Forbidden
