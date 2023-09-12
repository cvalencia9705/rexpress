import React, { useContext } from 'react'
import ProgressBar from './ProgressBar'
import { CustomersContext } from '../Context/Customers/Customers'
import { DriversContext } from '../Context/Drivers/Drivers'
import { TrailersContext } from '../Context/Trailers/Trailers'
import { TrucksContext } from '../Context/Trucks/Trucks'
import { LoadsContext } from '../Context/Loads/Loads'

function ProjectProgress() {
  const [TrucksData, setTrucksData] = useContext(TrucksContext)
  const [DriversData, setDriversData] = useContext(DriversContext)
  const [TrailersData, setTrailersData] = useContext(TrailersContext)
  const [CustomersData, setCustomersData] = useContext(CustomersContext)
  const [LoadsData, setLoadsData] = useContext(LoadsContext)

  const Projects = [
    {
      topic: 'Drivers',
      value: DriversData.length.toString(),
      color: 'info',
      max: 150,
    },
    {
      topic: 'Trucks',
      value: TrucksData.length.toString(),
      color: 'info',
      max: 100,
    },
    {
      topic: 'Trailers',
      value: TrailersData.length.toString(),
      color: 'info',
      max: 100,
    },
    {
      topic: 'Customers',
      value: CustomersData.length.toString(),
      color: 'info',
      max: 150,
    },
    {
      topic: 'Loads',
      value: LoadsData.length.toString(),
      color: 'info',
      max: 10000,
    },
  ]

  return (
    <div className="card shadow mb-4">
      <div className="card-header py-3">
        <h6 className="m-0 font-weight-bold text-primary">Statistics</h6>
      </div>
      <div className="card-body">
        {Projects.map((project, index) => (
          <ProgressBar key={index} project={project} />
        ))}
      </div>
    </div>
  )
}

export default ProjectProgress
