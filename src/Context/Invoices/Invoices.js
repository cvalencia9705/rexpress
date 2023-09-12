import React, { useState, useEffect } from 'react'
import { Redirect } from 'react-router'
import axios from 'axios'
// Step 1 -  create context for Invoices

export const InvoicesContext = React.createContext()

// Step2 - create a provider function
// All components wrapped inside Invoicesprovider will be able to access Invoices data

export const InvoicesProvider = ({ children }) => {
  const [InvoicesData, setInvoicesData] = useState([])

  useEffect(() => {
    if (localStorage.level === '1') {
      axios
        .get('https://api.rexpresstrucks.com/facturas/', {
          withCredentials: true,
        })
        .then((res) => {
          //console.log(res)
          setInvoicesData(res.data)
        })
        .catch((err) => console.log(err))
      return () => {
        setInvoicesData([])
      }
    }
  }, [])

  if (!localStorage.username) {
    return <Redirect to="/login" />
  }
  return (
    <InvoicesContext.Provider value={[InvoicesData, setInvoicesData]}>
      {children}
    </InvoicesContext.Provider>
  )
}
