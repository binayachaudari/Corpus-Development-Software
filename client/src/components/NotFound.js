import React from 'react'
import { Link } from 'react-router-dom'

export const NotFound = () => {
  return (
    <>
      <div className="form-signin d-flex flex-column justify-content-center" style={{ maxWidth: '50%' }}>
        <h1 className="display-1 text-danger">404!</h1>
        <h3 className="display-3 text-secondary">Page Not Found</h3>
        <br />
        <Link to="/"><button type="button" class="btn btn-lg btn-warning">Return Home</button></Link>
      </div>
    </>
  )
}

export default NotFound