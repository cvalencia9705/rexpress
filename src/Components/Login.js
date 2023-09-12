import { useHistory } from 'react-router'
import { useState } from 'react'
import '../css/login.scss'
import axios from 'axios'

const FluidInput = ({ type, label, style, id, errLogin, onChange, value }) => {
  const [focused, setFocused] = useState(false)

  const handleFocus = () => {
    setFocused(!focused)
  }

  let inputClass = 'fluid-input'
  if (focused) {
    inputClass += ' fluid-input--focus'
  } else if (value !== '') {
    inputClass += ' fluid-input--open'
  }

  let inputLabelClass = 'fluid-input-label'
  if (errLogin) {
    inputClass += ' input-err'
    inputLabelClass += ' input-input-err'
  }

  return (
    <div className={inputClass} style={style}>
      <div className="fluid-input-holder">
        <input
          className="fluid-input-input"
          id={id}
          type={type}
          onFocus={handleFocus}
          onBlur={handleFocus}
          onChange={onChange}
          autoComplete="off"
        />
        <label className={inputLabelClass} htmlFor={id}>
          {label}
        </label>
      </div>
    </div>
  )
}

const Button = ({ buttonClass, onClick, buttonText }) => {
  return (
    <div className={`button ${buttonClass}`} onClick={onClick}>
      {buttonText}
    </div>
  )
}

const Login = () => {
  const style = {
    margin: '15px 0',
  }

  const [errLogin, setErrLogin] = useState(false)
  const [user, setUser] = useState('')
  const [pass, setPass] = useState('')
  const history = useHistory()
  const url = 'https://api.rexpresstrucks.com/auth'

  const onClick = () => {
    const login = {
      username: user,
      password: pass,
    }

    axios
      .post(`${url}/login/`, login, { withCredentials: true })
      .then((res) => {
        //console.log(res.data)
        localStorage.clear()
        localStorage.setItem('username', res.data.username)
        localStorage.setItem('level', res.data.groups[0])
        if (res.data.groups[0] === 1) {
          history.push('/dashboard')
        } else {
          history.push('/documents')
        }
      })
      .catch((err) => {
        console.log(err)
        setErrLogin(true)
      })
  }

  const onChange = (e) => {
    setErrLogin(false)
    switch (e.target.id) {
      case 'name':
        setUser(e.target.value)
        return
      case 'password':
        setPass(e.target.value)
        return
      default:
        return
    }
  }

  const body = document.getElementById('bdy')
  body.style.background = '#36b9cc'
  body.style.background = 'linear-gradient(135deg, #4e73df 0%, #36b9cc 100%)'
  body.style.margin = 0
  body.style.padding = 0

  return (
    <div className="login-container">
      <div className="title">Login</div>
      <FluidInput
        type="text"
        label="user"
        id="name"
        style={style}
        errLogin={errLogin}
        onChange={onChange}
        value={user}
      />
      <FluidInput
        type="password"
        label="password"
        id="password"
        style={style}
        errLogin={errLogin}
        onChange={onChange}
        value={pass}
      />
      <Button
        buttonText="log in"
        buttonClass="login-button"
        onClick={onClick}
      />
      <p className="input-input-err">
        {errLogin ? '* Login information is incorrect' : null}
      </p>
    </div>
  )
}

export default Login
