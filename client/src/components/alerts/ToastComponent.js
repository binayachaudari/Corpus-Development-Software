import React from 'react'
import PropTypes from 'prop-types'
import { Toast } from 'react-bootstrap'
import { connect } from 'react-redux'
import { REMOVE_TOAST } from '../../actions/constants'

const ToastComponent = ({ toast, dispatch }) => {
  const handleClose = (itemID) => {
    dispatch({
      type: REMOVE_TOAST,
      payload: itemID
    });
  }

  return (
    <div
      aria-live="polite"
      aria-atomic="true"
      style={{
        top: '1em',
        right: '2em',
        position: 'relative',
        minHeight: '200px',
      }}
    >
      <div
        style={{
          position: 'absolute',
          top: 0,
          right: 0,
        }}
      >
        {toast !== null && toast.length > 0 && toast.map(item => (
          <Toast key={item.id} show={true} delay={3000} onClose={handleClose.bind(this, item.id)} autohide>
            <Toast.Header>
              <strong className={`mr-auto text-${item.toastType}`}>{item.title}</strong>
            </Toast.Header>
            <Toast.Body className={`text-${item.toastType}`}>{item.message}</Toast.Body>
          </Toast>
        ))}
      </div>
    </div>
  )
}

ToastComponent.propTypes = {
  toast: PropTypes.array.isRequired
}

const mapStateToProps = state => ({
  toast: state.toast
})

export default connect(mapStateToProps)(ToastComponent)

