import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Alert } from 'react-bootstrap';

const AlertComponent = ({ alertProp }) => {
  const [alertState, setAlertState] = useState({
    message: alertProp.message,
    alertType: alertProp.alertType,
    dismissible: alertProp.dismissible
  });

  const { message, alertType, dismissible } = alertState;

  useEffect(() => {
    setAlertState({
      message: alertProp.message,
      alertType: alertProp.alertType,
      dismissible: alertProp.dismissible
    });
  }, [alertProp])

  if (message) {
    return (
      <Alert variant={`${alertType}`} onClose={() => setAlertState({})} dismissible={dismissible}>
        {message}
      </Alert>
    );
  }
  return null;
}

AlertComponent.propTypes = {
  alertProp: PropTypes.object.isRequired,
}

export default AlertComponent;
