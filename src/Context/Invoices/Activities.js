import React, { useState, useEffect } from 'react'
import { Redirect } from 'react-router'
import axios from 'axios'
// Step 1 -  create context for Activities

export const ActivitiesContext = React.createContext()

// Step2 - create a provider function
// All components wrapped inside Activitiesprovider will be able to access Activities data

export const ActivitiesProvider = ({ children }) => {
  const [ActivitiesData, setActivitiesData] = useState([])

  useEffect(() => {
    if (localStorage.level === '1') {
      axios
        .get('https://api.rexpresstrucks.com/actividades/', {
          withCredentials: true,
        })
        .then((res) => {
          //console.log(res)
          setActivitiesData(res.data)
        })
        .catch((err) => console.log(err))
      return () => {
        setActivitiesData([])
      }
    }
  }, [])

  if (!localStorage.username) {
    return <Redirect to="/login" />
  }
  return (
    <ActivitiesContext.Provider value={[ActivitiesData, setActivitiesData]}>
      {children}
    </ActivitiesContext.Provider>
  )
}
