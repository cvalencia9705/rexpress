import React, { useState, useEffect } from 'react'
import { Redirect } from 'react-router'
import axios from 'axios'
// Step 1 -  create context for Customers

export const CustomersContext = React.createContext()

// Step2 - create a provider function
// All components wrapped inside Customersprovider will be able to access Customers data

export const CustomersProvider = ({ children }) => {
  const [CustomersData, setCustomersData] = useState([])

  useEffect(() => {
    if (localStorage.level === '2' || localStorage.level === '1') {
      axios
        .get('https://api.rexpresstrucks.com/clientes/', {
          withCredentials: true,
        })
        .then((res) => {
          //console.log(res)
          setCustomersData(res.data)
        })
        .catch((err) => console.log(err))
      return () => {
        setCustomersData([])
      }
    }
  }, [])

  if (!localStorage.username) {
    return <Redirect to="/login" />
  }
  return (
    <CustomersContext.Provider value={[CustomersData, setCustomersData]}>
      {children}
    </CustomersContext.Provider>
  )
}
