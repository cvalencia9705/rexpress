import React, { useState, useEffect } from 'react'
import { Redirect } from 'react-router'
import axios from 'axios'
// Step 1 -  create context for Loads

export const LoadsContext = React.createContext()

// Step2 - create a provider function
// All components wrapped inside Loadsprovider will be able to access Loads data

export const LoadsProvider = ({ children }) => {
  const [LoadsData, setLoadsData] = useState([])

  useEffect(() => {
    if (localStorage.level === '2' || localStorage.level === '1') {
      axios
        .get('https://api.rexpresstrucks.com/cargas/', {
          withCredentials: true,
        })
        .then((res) => {
          //console.log(res)
          setLoadsData(res.data)
        })
        .catch((err) => console.log(err))
      return () => {
        setLoadsData([])
      }
    }
  }, [])

  if (!localStorage.username) {
    return <Redirect to="/login" />
  }
  return (
    <LoadsContext.Provider value={[LoadsData, setLoadsData]}>
      {children}
    </LoadsContext.Provider>
  )
}
