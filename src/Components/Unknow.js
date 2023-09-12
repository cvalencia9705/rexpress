import '../css/error.css'
import { useHistory } from 'react-router-dom'
const Unknow = () => {
  const history = useHistory()
  return (
    <div className="error-content">
      <div className="container">
        <div className="row">
          <div className="col-md-12 ">
            <div className="error-text">
              <h1 className="error">404 Error</h1>
              <div className="im-sheep">
                <div className="top">
                  <div className="body"></div>
                  <div className="head">
                    <div className="im-eye one"></div>
                    <div className="im-eye two"></div>
                    <div className="im-ear one"></div>
                    <div className="im-ear two"></div>
                  </div>
                </div>
                <div className="im-legs">
                  <div className="im-leg"></div>
                  <div className="im-leg"></div>
                  <div className="im-leg"></div>
                  <div className="im-leg"></div>
                </div>
              </div>
              <h4 className="unk-subt">Oops! This page Could Not Be Found!</h4>
              <p className="unk-p">
                Sorry but the page you are looking for does not exist, have been
                removed or name changed.
              </p>
              <i
                onClick={() => history.goBack()}
                className="btn btn-primary btn-round unk-btn unk-btn-1 unk-btn-2"
              >
                Go Back
              </i>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Unknow
