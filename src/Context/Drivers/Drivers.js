import React, { useState, useEffect } from 'react'
import { Redirect } from 'react-router'
import axios from 'axios'
// Step 1 -  create context for Drivers

export const DriversContext = React.createContext()

// Step2 - create a provider function
// All components wrapped inside Driverprovider will be able to access Drivers data

export const DriversProvider = ({ children }) => {
  const [DriversData, setDriversData] = useState([])

  useEffect(() => {
    if (localStorage.username) {
      axios
        .get('https://api.rexpresstrucks.com/choferes/', {
          withCredentials: true,
        })
        .then((res) => {
          //console.log(res)
          setDriversData(res.data)
        })
        .catch((err) => console.log(err))
      return () => {
        setDriversData([])
      }
    }
  }, [])

  if (!localStorage.username) {
    return <Redirect to="/login" />
  }
  return (
    <DriversContext.Provider value={[DriversData, setDriversData]}>
      {children}
    </DriversContext.Provider>
  )
}
