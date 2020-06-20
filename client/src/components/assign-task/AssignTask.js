import React from 'react';
import { Container, Tab, Nav } from 'react-bootstrap';
import AssignTranslateComponent from './AssignTranslateComponent';
import AssignReviewComponent from './AssignReviewComponent';
import Toast from '../alerts/ToastComponent';

const AssignTask = (props) => {
  const currentPill = localStorage.task_assign || 'translate';
  const onSelect = (pill) => {
    localStorage.setItem('task_assign', pill);
  };

  return (
    <div>
      <Toast />
      <Container className="mt-3">
        <h1 className="display-4 slidein__animation" style={{ animationDelay: '0.1s' }}>
          Assign Task
        </h1>
        <Tab.Container id="left-tabs-example" unmountOnExit={true} onSelect={onSelect} defaultActiveKey={currentPill}>
          <Nav variant="tabs" className="mt-5 slidein__animation" style={{ animationDelay: '0.3s' }}>
            <Nav.Item>
              <Nav.Link eventKey="translate">Translate</Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="review">Review</Nav.Link>
            </Nav.Item>
          </Nav>
          <Tab.Content className="mt-3">
            <Tab.Pane eventKey="translate">
              <AssignTranslateComponent />
            </Tab.Pane>
            <Tab.Pane eventKey="review">
              <AssignReviewComponent />
            </Tab.Pane>
          </Tab.Content>
        </Tab.Container>
      </Container>
    </div>
  );
};

export default AssignTask;
