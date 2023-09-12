import React, { useEffect, useState, useContext } from 'react'
import DisplayDashboardData from './DisplayDashboardData'
import ProjectProgress from './ProjectProgress'
import { Redirect } from 'react-router'
import axios from 'axios'
import ProgressBar from './ProgressBar'

import { InvoicesContext } from '../Context/Invoices/Invoices'
import { TravelsContext } from '../Context/Travels/Travels'

function AdminDashboard() {
  const [InvoicesData, setInvoicesData] = useContext(InvoicesContext)
  const [TravelsData, setTravelsData] = useContext(TravelsContext)

  const [earnM, setEarnM] = useState('0')
  const [earnA, setEarnA] = useState('0')
  const [invoPaid, setInvoPaid] = useState('0')
  const [invoUnpaid, setInvoUnpaid] = useState('0')

  const datas = [
    {
      Earnings: 'Earnings (This Month)',
      value: '$' + earnM,
      symbol: 'fas fa-calendar',
      bar: 0,
      color: 'success',
    },
    {
      Earnings: 'Earnings (This Year)',
      value: '$' + earnA,
      symbol: 'fas fa-dollar-sign',
      bar: 0,
      color: 'success',
    },
    {
      Earnings: 'Invoices',
      value: InvoicesData.length.toString(),
      symbol: 'fas fa-scroll',
      bar: 0,
      color: 'info',
    },
    {
      Earnings: 'Travels',
      value: TravelsData.length.toString(),
      symbol: 'fas fa-road',
      bar: 0,
      color: 'info',
    },
  ]

  //Effect to get all documents from the db
  useEffect(() => {
    if (localStorage.level === '1') {
      axios
        .get('https://api.rexpresstrucks.com/reportes/ganancias_mensuales/', {
          withCredentials: true,
        })
        .then((res) => {
          //console.log(res.data)
          setEarnM(res.data)
        })
        .catch((err) => console.log(err))
      axios
        .get('https://api.rexpresstrucks.com/reportes/ganancias_anuales/', {
          withCredentials: true,
        })
        .then((res) => {
          //console.log(res.data)
          setEarnA(res.data)
        })
        .catch((err) => console.log(err))
      axios
        .get('https://api.rexpresstrucks.com/facturas_pagadas/', {
          withCredentials: true,
        })
        .then((res) => {
          //console.log(res.data)
          setInvoPaid(res.data.length)
        })
        .catch((err) => console.log(err))
      axios
        .get('https://api.rexpresstrucks.com/facturas_no_pagadas/', {
          withCredentials: true,
        })
        .then((res) => {
          //console.log(res.data)
          setInvoUnpaid(res.data.length)
        })
        .catch((err) => console.log(err))
    }
  }, [])

  if (localStorage.level !== '1') {
    return <Redirect to="/403" />
  }

  return (
    <div className="container-fluid">
      <div className="d-sm-flex align-items-center justify-content-between mb-4">
        <h1 className="h3 mb-0 text-gray-800">Admin Dashboard</h1>
        {/* <a
          href="/"
          className="d-none d-sm-inline-block btn btn-sm btn-primary shadow-sm"
        >
          <i className="fas fa-download fa-sm text-white-50"></i>
          Generate Report
        </a> */}
      </div>
      <div className="row">
        {datas.map((data, index) => {
          return <DisplayDashboardData key={index} data={data} />
        })}
      </div>
      <div className="row">
        <div className="col-lg-6 mb-4">
          <ProjectProgress />
        </div>
        <div className="col-lg-6 mb-4">
          <div className="card shadow mb-4">
            <div className="card-header py-3">
              <h6 className="m-0 font-weight-bold text-primary">
                Invoices Status
              </h6>
            </div>
            <div className="card-body">
              <ProgressBar
                project={{
                  topic: 'Paid Invoices',
                  value: invoPaid.toString(),
                  color: 'success',
                  max: 10000,
                }}
              />
              <ProgressBar
                project={{
                  topic: 'Pending Invoices',
                  value: invoUnpaid.toString(),
                  color: 'warning',
                  max: 10000,
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard
