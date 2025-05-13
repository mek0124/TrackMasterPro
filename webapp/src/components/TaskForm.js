import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '../hooks/authContext';
import api from '../hooks/api';

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
`;

const ModalContent = styled.div`
  background-color: var(--btnBg);
  padding: 2rem;
  border-radius: 12px;
  width: 90%;
  max-width: 500px;
  box-shadow: 0 5px 20px var(--shadow);
  position: relative;
  border: 1px solid var(--bdr);
  color: var(--text);
`;

const CloseButton = styled.button`
  position: absolute;
  top: 10px;
  right: 10px;
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: var(--fg);
`;

const FormTitle = styled.h2`
  color: var(--text);
  margin-bottom: 1.5rem;
  font-size: 1.5rem;
  text-align: center;
  position: relative;
  padding-bottom: 0.5rem;

  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 50px;
    height: 3px;
    background-color: var(--accent);
    border-radius: 3px;
  }
`;

const FormGroup = styled.div`
  margin-bottom: 1rem;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  color: var(--text);
  font-size: 1rem;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.8rem;
  border: 1px solid var(--bdr);
  border-radius: 6px;
  font-size: 1rem;
  background-color: var(--bg);
  color: var(--text);
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    border-color: var(--accent);
    box-shadow: 0 0 0 2px rgba(200, 121, 65, 0.2);
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 0.8rem;
  border: 1px solid var(--bdr);
  border-radius: 6px;
  font-size: 1rem;
  min-height: 120px;
  background-color: var(--bg);
  color: var(--text);
  transition: all 0.3s ease;
  resize: vertical;

  &:focus {
    outline: none;
    border-color: var(--accent);
    box-shadow: 0 0 0 2px rgba(200, 121, 65, 0.2);
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 1.5rem;
`;

const Button = styled.button`
  padding: 0.5rem 1rem;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
`;

const SubmitButton = styled(Button)`
  background-color: var(--success);
  color: var(--bg);
  border: 2px solid var(--success);
  padding: 0.8rem 1.5rem;
  font-weight: 600;

  &:hover {
    background-color: transparent;
    color: var(--success);
  }
`;

const CancelButton = styled(Button)`
  background-color: var(--danger);
  color: var(--bg);
  border: 2px solid var(--danger);
  padding: 0.8rem 1.5rem;
  font-weight: 600;

  &:hover {
    background-color: transparent;
    color: var(--danger);
  }
`;

const ErrorMessage = styled.div`
  color: var(--danger);
  font-size: 0.8rem;
  margin-top: 0.5rem;
  display: flex;
  align-items: center;
  gap: 0.3rem;

  &::before {
    content: '⚠';
    font-size: 0.9rem;
  }
`;

const PrioritySelector = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-top: 0.5rem;
`;

const PriorityButton = styled.button`
  flex: 1;
  padding: 0.5rem;
  border: 1px solid var(--bdr);
  background-color: var(--bg);
  color: var(--text);
  border-radius: 4px;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 3px;
    background-color: ${props => {
      if (props.$priorityLevel === 'high') return 'var(--danger)';
      if (props.$priorityLevel === 'medium') return 'var(--warning)';
      return 'var(--success)';
    }};
    transform: ${props => props.$selected ? 'scaleX(1)' : 'scaleX(0)'};
    transition: transform 0.3s ease;
  }

  &:hover {
    background-color: var(--btnBg);
    &::before {
      transform: scaleX(1);
    }
  }

  &.selected {
    background-color: ${props => {
      if (props.$priorityLevel === 'high') return 'rgba(163, 93, 106, 0.2)';
      if (props.$priorityLevel === 'medium') return 'rgba(212, 180, 131, 0.2)';
      return 'rgba(115, 158, 130, 0.2)';
    }};
    border-color: ${props => {
      if (props.$priorityLevel === 'high') return 'var(--danger)';
      if (props.$priorityLevel === 'medium') return 'var(--warning)';
      return 'var(--success)';
    }};
    &::before {
      transform: scaleX(1);
    }
  }
`;

const TaskForm = ({ isOpen, onClose, task, onTaskAdded, onTaskUpdated }) => {
  const [formData, setFormData] = useState({
    title: '',
    detail: '',
    date: '',
    time: '',
    priority: 'medium', // default priority
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { userId } = useAuth();

  useEffect(() => {
    if (task) {
      // If editing an existing task, populate the form
      setFormData({
        title: task.title || '',
        detail: task.detail || '',
        date: task.date || '',
        time: task.time || '',
        priority: task.priority || 'medium',
      });
    } else {
      // For new task, set today's date and current time as defaults
      const today = new Date();
      const formattedDate = today.toISOString().split('T')[0];
      const formattedTime = today.toTimeString().split(' ')[0].substring(0, 5);

      setFormData({
        title: '',
        detail: '',
        date: formattedDate,
        time: formattedTime,
        priority: 'medium',
      });
    }
  }, [task, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    // Clear error when user types
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: '',
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }

    if (!formData.detail.trim()) {
      newErrors.detail = 'Task details are required';
    }

    if (!formData.date) {
      newErrors.date = 'Date is required';
    }

    if (!formData.time) {
      newErrors.time = 'Time is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePriorityChange = (priority) => {
    setFormData(prev => ({
      ...prev,
      priority
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      if (task) {
        // Update existing task - convert ID to string for API
        const taskId = task.id.toString();
        const response = await api.put(`/tasks/${taskId}`, {
          ...formData,
          userId,
          completed: task.completed || false,
        }, { forceMode: 'real' });

        if (response.status === 200) {
          onTaskUpdated(response.data.task);
          onClose();
        }
      } else {
        // Create new task
        const response = await api.post('/tasks', {
          ...formData,
          userId,
          completed: false,
        }, { forceMode: 'real' });

        if (response.status === 201) {
          onTaskAdded(response.data.task);
          onClose();
        }
      }
    } catch (error) {
      console.error('Error saving task:', error);
      setErrors({
        submit: 'Failed to save task. Please try again.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <ModalOverlay onClick={onClose}>
      <ModalContent onClick={(e) => e.stopPropagation()}>
        <CloseButton onClick={onClose}>
          <FontAwesomeIcon icon={faTimes} />
        </CloseButton>

        <FormTitle>{task ? 'Edit Task' : 'Add New Task'}</FormTitle>

        <form onSubmit={handleSubmit}>
          <FormGroup>
            <Label htmlFor="title">Title</Label>
            <Input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Task title"
            />
            {errors.title && <ErrorMessage>{errors.title}</ErrorMessage>}
          </FormGroup>

          <FormGroup>
            <Label htmlFor="detail">Details</Label>
            <TextArea
              id="detail"
              name="detail"
              value={formData.detail}
              onChange={handleChange}
              placeholder="Task details"
            />
            {errors.detail && <ErrorMessage>{errors.detail}</ErrorMessage>}
          </FormGroup>

          <FormGroup>
            <Label htmlFor="date">Date</Label>
            <Input
              type="date"
              id="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
            />
            {errors.date && <ErrorMessage>{errors.date}</ErrorMessage>}
          </FormGroup>

          <FormGroup>
            <Label htmlFor="time">Time</Label>
            <Input
              type="time"
              id="time"
              name="time"
              value={formData.time}
              onChange={handleChange}
            />
            {errors.time && <ErrorMessage>{errors.time}</ErrorMessage>}
          </FormGroup>

          <FormGroup>
            <Label>Priority</Label>
            <PrioritySelector>
              <PriorityButton
                type="button"
                $priorityLevel="low"
                className={formData.priority === 'low' ? 'selected' : ''}
                onClick={() => handlePriorityChange('low')}
              >
                Low
              </PriorityButton>
              <PriorityButton
                type="button"
                $priorityLevel="medium"
                className={formData.priority === 'medium' ? 'selected' : ''}
                onClick={() => handlePriorityChange('medium')}
              >
                Medium
              </PriorityButton>
              <PriorityButton
                type="button"
                $priorityLevel="high"
                className={formData.priority === 'high' ? 'selected' : ''}
                onClick={() => handlePriorityChange('high')}
              >
                High
              </PriorityButton>
            </PrioritySelector>
          </FormGroup>

          {errors.submit && <ErrorMessage>{errors.submit}</ErrorMessage>}

          <ButtonGroup>
            <CancelButton type="button" onClick={onClose}>
              Cancel
            </CancelButton>
            <SubmitButton type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : task ? 'Update Task' : 'Add Task'}
            </SubmitButton>
          </ButtonGroup>
        </form>
      </ModalContent>
    </ModalOverlay>
  );
};

export default TaskForm;
