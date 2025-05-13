import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import api from '../hooks/api';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLock, faEnvelope, faExclamationTriangle, faCheckCircle } from '@fortawesome/free-solid-svg-icons';

const RegisterContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 80vh;
  padding: 2rem;
`;

const RegisterCard = styled.div`
  background-color: var(--btnBg);
  border-radius: 12px;
  box-shadow: 0 8px 16px var(--shadow);
  padding: 2rem;
  width: 100%;
  max-width: 400px;
  border: 1px solid var(--bdr);
`;

const RegisterTitle = styled.h2`
  color: var(--text);
  text-align: center;
  margin-bottom: 2rem;
  font-size: 1.8rem;
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
  margin-bottom: 1.5rem;
  position: relative;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.8rem 1rem 0.8rem 2.5rem;
  border: 1px solid var(--bdr);
  border-radius: 6px;
  background-color: var(--bg);
  color: var(--text);
  font-size: 1rem;
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    border-color: var(--accent);
    box-shadow: 0 0 0 2px rgba(200, 121, 65, 0.2);
  }
`;

const InputIcon = styled.div`
  position: absolute;
  left: 0.8rem;
  top: 50%;
  transform: translateY(-50%);
  color: var(--accent);
`;

const RegisterButton = styled.button`
  width: 100%;
  padding: 0.8rem;
  background-color: var(--accent);
  color: var(--bg);
  border: none;
  border-radius: 6px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 1rem;

  &:hover:not(:disabled) {
    background-color: var(--hvr);
    transform: translateY(-2px);
  }

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
`;

const ErrorMessage = styled.div`
  background-color: rgba(163, 93, 106, 0.2);
  color: var(--text);
  padding: 0.8rem;
  margin: 1rem 0;
  border-radius: 6px;
  border-left: 4px solid var(--danger);
  display: flex;
  align-items: center;
  gap: 0.8rem;
  font-size: 0.9rem;

  svg {
    color: var(--danger);
    font-size: 1.2rem;
  }
`;

const SuccessMessage = styled.div`
  background-color: rgba(115, 158, 130, 0.2);
  color: var(--text);
  padding: 0.8rem;
  margin: 1rem 0;
  border-radius: 6px;
  border-left: 4px solid var(--success);
  display: flex;
  align-items: center;
  gap: 0.8rem;
  font-size: 0.9rem;

  svg {
    color: var(--success);
    font-size: 1.2rem;
  }
`;

const LoginLink = styled.p`
  text-align: center;
  margin-top: 1.5rem;
  color: var(--text-muted);
  font-size: 0.9rem;

  a {
    color: var(--accent);
    text-decoration: none;
    font-weight: 600;
    
    &:hover {
      text-decoration: underline;
    }
  }
`;

export default function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const navigate = useNavigate();

  const validateForm = () => {
    if (!email || !password || !confirmPassword) {
      setError('Please fill in all fields');
      return false;
    }
    
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return false;
    }
    
    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      return false;
    }
    
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    if (!validateForm()) {
      return;
    }
    
    setIsLoading(true);
    
    try {
      const response = await api.post('/auth/register', {
        email,
        password
      });
      
      if (response.status === 201) {
        setSuccess('Registration successful! Redirecting to login...');
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      }
    } catch (err) {
      console.error('Registration error:', err);
      setError(err.response?.data?.detail || 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <RegisterContainer>
      <RegisterCard>
        <RegisterTitle>Register</RegisterTitle>
        
        {error && (
          <ErrorMessage>
            <FontAwesomeIcon icon={faExclamationTriangle} />
            {error}
          </ErrorMessage>
        )}
        
        {success && (
          <SuccessMessage>
            <FontAwesomeIcon icon={faCheckCircle} />
            {success}
          </SuccessMessage>
        )}
        
        <form onSubmit={handleSubmit}>
          <FormGroup>
            <InputIcon>
              <FontAwesomeIcon icon={faEnvelope} />
            </InputIcon>
            <Input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </FormGroup>
          
          <FormGroup>
            <InputIcon>
              <FontAwesomeIcon icon={faLock} />
            </InputIcon>
            <Input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </FormGroup>
          
          <FormGroup>
            <InputIcon>
              <FontAwesomeIcon icon={faLock} />
            </InputIcon>
            <Input
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </FormGroup>
          
          <RegisterButton type="submit" disabled={isLoading}>
            {isLoading ? 'Registering...' : 'Register'}
          </RegisterButton>
        </form>
        
        <LoginLink>
          Already have an account? <a href="/login">Login</a>
        </LoginLink>
      </RegisterCard>
    </RegisterContainer>
  );
}
