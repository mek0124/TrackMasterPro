import styled from "styled-components";
import { Link } from "react-router-dom";


export const FooterContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  width: 100%;
  padding: 1rem;
  flex-shrink: 0;
  background-color: var(--btnBg);
  border-top: 1px solid var(--bdr);
  box-shadow: 0 -2px 10px var(--shadow);
  margin-top: auto;
`;

export const Span = styled.span`
  font-size: 0.8rem;
  width: 100%;
  text-align: center;
  color: var(--text-muted);
  padding: 0 1rem;

  @media (max-width: 768px) {
    font-size: 0.7rem;
  }
`;

export const NavLink = styled(Link)`
  font-size: 0.8rem;
  text-align: center;
  color: var(--accent);
  margin-left: 0.5rem;
  transition: all 0.3s ease;

  &:hover {
    color: var(--highlight);
    text-decoration: none;
    transform: translateY(-2px);
    display: inline-block;
  }

  @media (max-width: 768px) {
    font-size: 0.7rem;
  }
`;
