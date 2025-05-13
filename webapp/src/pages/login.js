import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import styled from 'styled-components';
import { useAuth } from '../hooks/authContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faLock, faExclamationTriangle, faSignInAlt } from '@fortawesome/free-solid-svg-icons';

const LoginContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 80vh;
  padding: 2rem;
`;

const LoginCard = styled.div`
  background-color: var(--btnBg);
  border-radius: 12px;
  box-shadow: 0 8px 16px var(--shadow);
  padding: 2rem;
  width: 100%;
  max-width: 400px;
  border: 1px solid var(--bdr);
`;

const LoginTitle = styled.h2`
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

const LoginButton = styled.button`
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

const RegisterLink = styled.p`
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

export default function Login() {
  // Form state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(true);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Get auth context and navigation
  const { login, isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated && !isLoading) {
      navigate('/');
    }
  }, [isAuthenticated, isLoading, navigate]);

  // Form submission handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validate form
    if (!email || !password) {
      setError('Please enter both email and password');
      return;
    }

    // Attempt login
    setIsSubmitting(true);

    try {
      const response = await login({ email, password, remember });

      if (response.status === 200) {
        // Success - navigation happens automatically via the useEffect
      } else {
        // Show error message from response
        setError(response.message || 'Login failed. Please try again.');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <LoginContainer>
      <LoginCard>
        <LoginTitle>Login</LoginTitle>

        {error && (
          <ErrorMessage>
            <FontAwesomeIcon icon={faExclamationTriangle} />
            {error}
          </ErrorMessage>
        )}

        <form onSubmit={handleSubmit}>
          <FormGroup>
            <InputIcon>
              <FontAwesomeIcon icon={faUser} />
            </InputIcon>
            <Input
              type="email"
              placeholder="Enter your email (e.g., user@example.com)"
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
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </FormGroup>

          <FormGroup style={{ flexDirection: 'row', alignItems: 'center', marginBottom: '0.5rem' }}>
            <input
              type="checkbox"
              id="remember"
              checked={remember}
              onChange={(e) => setRemember(e.target.checked)}
              style={{ marginRight: '0.5rem' }}
            />
            <label htmlFor="remember" style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
              Remember me
            </label>
          </FormGroup>

          <LoginButton type="submit" disabled={isSubmitting || isLoading}>
            {isSubmitting ? (
              'Logging in...'
            ) : (
              <>
                <FontAwesomeIcon icon={faSignInAlt} style={{ marginRight: '0.5rem' }} />
                Login
              </>
            )}
          </LoginButton>
        </form>

        <RegisterLink>
          Don't have an account? <Link to="/register">Register</Link>
        </RegisterLink>
      </LoginCard>
    </LoginContainer>
  );
}
