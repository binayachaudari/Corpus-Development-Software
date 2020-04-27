import React from 'react'
import PropTypes from 'prop-types'
import { Table } from 'react-bootstrap'

const usersRoleHead = ['Name', 'Email', 'Role', 'UserID'];

const UserRoleComponent = ({ caption, userData }) => {
  return (
    <Table className="bg-light" responsive bordered>
      <caption className="font-weight-lighter font-italic">{caption}</caption>
      <thead className="table-dark" >
        <tr>
          {usersRoleHead.map((head, index) => (
            <th key={index}>{head}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {userData.map((item, index) => (
          <tr key={index}>
            <td className="align-middle">{item.name}</td>
            <td className="align-middle">{item.email}</td>
            <td className="align-middle">{item.role}</td>
            <td className="align-middle">{item._id}</td>
          </tr>
        ))}
      </tbody>
    </Table>
  )
}

UserRoleComponent.propTypes = {
  caption: PropTypes.string.isRequired,
  userData: PropTypes.array.isRequired,
}

export default UserRoleComponent
