import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { Container, Form, Button, Spinner } from 'react-bootstrap';
import Axios from 'axios';
import { setToast } from '../../../actions/toast';

const TranslateText = ({
  match: {
    params: { id }
  },
  history,
  setToast
}) => {
  const [translation, setTranslation] = useState({
    nepali_text: '',
    tamang_text: '',
    loading: true
  });

  const { nepali_text, tamang_text, loading } = translation;

  const getTextToTranslate = async (id) => {
    try {
      const res = await Axios.get(`/api/translation/assignments/${id}`);
      const {
        status,
        data: { message, nepali_text }
      } = res;
      if (status === 200 && nepali_text) {
        setTranslation({ ...translation, loading: false, nepali_text });
      }
      if (status === 200 && message) {
        setToast('Translation Complete', `Translation of File with ID ${id}, has been completed`, 'success');
        return history.replace('/translate/assignments');
      }
    } catch (error) {
      setToast('Error', `Something went wrong with File ID ${id}`, 'danger');
      return history.replace('/translate/assignments');
    }
  };

  const postTranslation = async (id, tamang_text) => {
    try {
      const body = { tamang_text };
      const res = await Axios.post(`/api/translation/assignments/${id}`, body);
      if (!res.status === 200) {
        setToast('Translation Complete', `Translation of File with ID ${id}, has been completed`, 'success');
        return history.replace('/translate/assignments');
      }
      return history.go(0);
    } catch (error) {
      setToast('Error', `Something went wrong with File ID ${id}`, 'danger');
      return history.replace('/translate/assignments');
    }
  };

  useEffect(() => {
    getTextToTranslate(id);
  }, [id]);

  const handleChange = (e) => {
    setTranslation({ ...translation, [e.target.id]: e.target.value });
  };

  const handleKey = (e) => {
    if (e.keyCode === 13) e.preventDefault();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await postTranslation(id, tamang_text);
  };

  return (
    <>
      <Container className="mt-3">
        <h1 className="text-center">Translate Texts</h1>
        <div>
          <div className="mb-5">
            <p className="text-center text-uppercase font-weight-bold">Nepali Text:</p>
            {loading ? (
              <div className="d-flex justify-content-center">
                <Spinner animation="grow" role="status">
                  <span className="sr-only">Loading...</span>
                </Spinner>
              </div>
            ) : (
              <p className="lead" style={{ fontSize: '2rem' }}>
                {nepali_text}
              </p>
            )}
          </div>
          <div className="border-top border-primary my-3"></div>
          <div>
            <p className="text-center text-uppercase font-weight-bold">Tamang Text:</p>
            <Form onSubmit={handleSubmit}>
              <Form.Group controlId="tamang_text">
                <Form.Control
                  as="textarea"
                  rows="4"
                  style={{ fontSize: '1.5rem' }}
                  value={tamang_text}
                  onChange={handleChange}
                  onKeyDown={handleKey}
                  required
                />
              </Form.Group>
              <div className="text-right">
                <Button type="submit">Save and Continue</Button>
              </div>
            </Form>
          </div>
        </div>
      </Container>
    </>
  );
};

TranslateText.propTypes = {
  history: PropTypes.object.isRequired,
  setToast: PropTypes.func.isRequired
};

export default withRouter(connect(null, { setToast })(TranslateText));
