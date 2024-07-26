import React from 'react'

function HomePage () {
  return (
    <div>
      <h1 className="text-center bg-blue-500 text-white p-4">Welcome to the Home Page</h1>
      <p className="text-3xl font-light underline">This is a protected area accessible only by authenticated users.</p>
    </div>
  )
}

export default HomePage
