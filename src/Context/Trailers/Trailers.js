import React, { useState, useEffect } from 'react'
import { Redirect } from 'react-router'
import axios from 'axios'
// Step 1 -  create context for Trailers

export const TrailersContext = React.createContext()

// Step2 - create a provider function
// All components wrapped inside Trailersprovider will be able to access Trailers data

export const TrailersProvider = ({ children }) => {
  const [TrailersData, setTrailersData] = useState([])

  useEffect(() => {
    axios
      .get('https://api.rexpresstrucks.com/trailers/', {
        withCredentials: true,
      })
      .then((res) => {
        //console.log(res)
        setTrailersData(res.data)
      })
      .catch((err) => console.log(err))
    return () => {
      setTrailersData([])
    }
  }, [])

  if (!localStorage.username) {
    return <Redirect to="/login" />
  }
  return (
    <TrailersContext.Provider value={[TrailersData, setTrailersData]}>
      {children}
    </TrailersContext.Provider>
  )
}
