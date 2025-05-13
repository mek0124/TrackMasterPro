import React from 'react';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faTrash, faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  animation: fadeIn 0.3s ease;

  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
`;

const ModalContent = styled.div`
  background-color: var(--card-bg);
  padding: 2rem;
  border-radius: 12px;
  width: 90%;
  max-width: 400px;
  box-shadow: 0 5px 20px var(--shadow);
  position: relative;
  border: 1px solid var(--bdr);
  color: var(--text);
  animation: slideIn 0.3s ease;
  
  @keyframes slideIn {
    from { transform: translateY(-20px); opacity: 0; }
    to { transform: translateY(0); opacity: 1; }
  }
`;

const CloseButton = styled.button`
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: transparent;
  border: none;
  color: var(--text-muted);
  font-size: 1.2rem;
  cursor: pointer;
  transition: all 0.3s ease;
  padding: 0.3rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    color: var(--text);
    transform: rotate(90deg);
  }
`;

const ModalTitle = styled.h2`
  font-size: 1.5rem;
  margin-bottom: 1.5rem;
  color: var(--text);
  display: flex;
  align-items: center;
  gap: 0.8rem;
  
  svg {
    color: var(--danger);
  }
`;

const ModalMessage = styled.p`
  font-size: 1rem;
  margin-bottom: 2rem;
  color: var(--text);
  line-height: 1.5;
`;

const WarningIcon = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 1.5rem;
  
  svg {
    font-size: 3rem;
    color: var(--warning);
  }
`;

const TaskCount = styled.span`
  font-weight: bold;
  color: var(--danger);
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 1.5rem;
`;

const Button = styled.button`
  padding: 0.8rem 1.5rem;
  border-radius: 8px;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: 600;
`;

const CancelButton = styled(Button)`
  background-color: transparent;
  color: var(--text);
  border: 2px solid var(--bdr);

  &:hover {
    background-color: var(--btnBg);
    border-color: var(--accent);
  }
`;

const DeleteButton = styled(Button)`
  background-color: var(--danger);
  color: var(--bg);
  border: 2px solid var(--danger);
  display: flex;
  align-items: center;
  gap: 0.5rem;

  &:hover {
    background-color: transparent;
    color: var(--danger);
  }
`;

const DeleteTaskModal = ({ isOpen, onClose, onDelete, taskCount }) => {
  if (!isOpen) return null;

  return (
    <ModalOverlay onClick={onClose}>
      <ModalContent onClick={(e) => e.stopPropagation()}>
        <CloseButton onClick={onClose}>
          <FontAwesomeIcon icon={faTimes} />
        </CloseButton>

        <WarningIcon>
          <FontAwesomeIcon icon={faExclamationTriangle} />
        </WarningIcon>

        <ModalTitle>
          <FontAwesomeIcon icon={faTrash} />
          Confirm Deletion
        </ModalTitle>

        <ModalMessage>
          Are you sure you want to delete <TaskCount>{taskCount}</TaskCount> {taskCount === 1 ? 'task' : 'tasks'}? 
          This action cannot be undone.
        </ModalMessage>

        <ButtonGroup>
          <CancelButton onClick={onClose}>
            Cancel
          </CancelButton>
          <DeleteButton onClick={onDelete}>
            <FontAwesomeIcon icon={faTrash} />
            Delete
          </DeleteButton>
        </ButtonGroup>
      </ModalContent>
    </ModalOverlay>
  );
};

export default DeleteTaskModal;
