import React from 'react';
import { Modal, Button } from 'react-bootstrap';
import './StadiumModal.css';

const StadiumModal = ({ show, onHide, data }) => {
  if (!data) return null;

  return (
    <Modal show={show} onHide={onHide} dialogClassName="custom-modal" centered>
      <Modal.Header closeButton>
        <Modal.Title>{data.name}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p><strong>Team:</strong> {data.team}</p>
        {data.stadium && (
          <img
            src={data.stadium}
            alt={`${data.name} Logo`}
            className="modal-image"
          />
        )}
        {data.credit && (
          <p className="image-credit" dangerouslySetInnerHTML={{ __html: data.credit }}></p>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default StadiumModal;
