import React, { useState, useEffect } from 'react'
import { Redirect } from 'react-router'
import axios from 'axios'
// Step 1 -  create context for Travels

export const TravelsContext = React.createContext()

// Step2 - create a provider function
// All components wrapped inside Travelsprovider will be able to access Travels data

export const TravelsProvider = ({ children }) => {
  const [TravelsData, setTravelsData] = useState([])

  useEffect(() => {
    if (localStorage.level === '2' || localStorage.level === '1') {
      axios
        .get('https://api.rexpresstrucks.com/viajes/', {
          withCredentials: true,
        })
        .then((res) => {
          //console.log(res)
          setTravelsData(res.data)
        })
        .catch((err) => console.log(err))
      return () => {
        setTravelsData([])
      }
    }
  }, [])

  if (!localStorage.username) {
    return <Redirect to="/login" />
  }
  return (
    <TravelsContext.Provider value={[TravelsData, setTravelsData]}>
      {children}
    </TravelsContext.Provider>
  )
}
