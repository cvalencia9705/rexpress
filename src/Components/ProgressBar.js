import React from 'react'

function ProgressBar({ project }) {
  const width = project.value === 'Complete!' ? '100' : project.value
  return (
    <>
      <h4 className="small font-weight-bold">
        {project.topic}
        <span className="float-right">{project.value}</span>
      </h4>
      <div className="progress mb-4">
        <div
          className={`progress-bar bg-${project.color} `}
          role="progressbar"
          style={{ width: `${width / (project.max / 100)}%` }}
          aria-valuenow="0"
          aria-valuemin="0"
          aria-valuemax="10000"
        ></div>
      </div>
    </>
  )
}

export default ProgressBar
