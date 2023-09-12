import React, { useState, useEffect } from 'react'
import { Redirect } from 'react-router'
import axios from 'axios'
// Step 1 -  create context for Trucks

export const TrucksContext = React.createContext()

// Step2 - create a provider function
// All components wrapped inside Trucksprovider will be able to access Trucks data

export const TrucksProvider = ({ children }) => {
  const [TrucksData, setTrucksData] = useState([])

  useEffect(() => {
    axios
      .get('https://api.rexpresstrucks.com/camiones/', {
        withCredentials: true,
      })
      .then((res) => {
        //console.log(res)
        setTrucksData(res.data)
      })
      .catch((err) => console.log(err))
    return () => {
      setTrucksData([])
    }
  }, [])

  if (!localStorage.username) {
    return <Redirect to="/login" />
  }
  return (
    <TrucksContext.Provider value={[TrucksData, setTrucksData]}>
      {children}
    </TrucksContext.Provider>
  )
}
