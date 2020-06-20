import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { Container, Form, Button, Spinner } from 'react-bootstrap';
import Axios from 'axios';
import { setToast } from '../../../actions/toast';

const ReviewText = ({
  match: {
    params: { id }
  },
  history,
  setToast
}) => {
  const [review, setReview] = useState({
    nepali_text: '',
    tamang_text: '',
    edit_tamang_text: false,
    loading: true
  });

  const toggleCheck = (e) => {
    setReview({ ...review, [e.target.id]: e.target.checked });
  };

  const { nepali_text, tamang_text, edit_tamang_text, loading } = review;

  const getTextToReview = async (id) => {
    try {
      const res = await Axios.get(`/api/review/assignments/${id}`);
      const {
        status,
        data: { message, translated_texts }
      } = res;
      if (status === 200 && translated_texts) {
        setReview({
          ...review,
          loading: false,
          nepali_text: translated_texts.nepali_text,
          tamang_text: translated_texts.tamang_text
        });
      }
      if (status === 200 && message) {
        setToast('Review Complete', `Review of File with ID ${id}, has been completed`, 'success');
        return history.replace('/review/assignments');
      }
    } catch (error) {
      setToast('Error', `Something went wrong with File ID ${id}`, 'danger');
      return history.replace('/review/assignments');
    }
  };

  const postReview = async (id, tamang_text) => {
    try {
      const body = { tamang_text };
      const res = await Axios.post(`/api/review/assignments/${id}`, body);
      if (!res.status === 200) {
        setToast('Review Complete', `Review of File with ID ${id}, has been completed`, 'success');
        return history.replace('/review/assignments');
      }
      return history.go(0);
    } catch (error) {
      console.log('posterr', error);

      setToast('Error', `Something went wrong with File ID ${id}`, 'danger');
      return history.replace('/review/assignments');
    }
  };

  useEffect(() => {
    getTextToReview(id);
  }, [id]);

  const handleChange = (e) => {
    setReview({ ...review, [e.target.id]: e.target.value });
  };

  const handleKey = (e) => {
    if (e.keyCode === 13) e.preventDefault();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await postReview(id, tamang_text);
  };

  return (
    <>
      <Container className="mt-3">
        <h1 className="text-center">Review Texts</h1>
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
                  readOnly={!edit_tamang_text}
                />
              </Form.Group>
              <Form.Check
                type="checkbox"
                id="edit_tamang_text"
                label="Edit Text"
                checked={edit_tamang_text}
                onChange={toggleCheck}
              />
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

ReviewText.propTypes = {
  setToast: PropTypes.func.isRequired
};

export default withRouter(connect(null, { setToast })(ReviewText));
