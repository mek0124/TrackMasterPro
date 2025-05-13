import styled from "styled-components";

export const HeaderContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  background-color: var(--card-bg);
  padding: 1rem 2rem;
  box-shadow: 0 3px 15px var(--shadow);
  position: relative;
  z-index: 10;
  border-bottom: 3px solid var(--accent);

  @media (max-width: 768px) {
    padding: 1rem;
    flex-wrap: wrap;
  }
`;

export const LogoContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

export const Image = styled.img`
  width: 50px;
  height: 50px;
  border-radius: 12px;
  border: 2px solid var(--accent);
  box-shadow: 0 0 10px var(--shadow);
  transition: all 0.3s ease;
  position: relative;
  animation: float 3s ease-in-out infinite;

  @keyframes float {
    0% { transform: translateY(0px); }
    50% { transform: translateY(-5px); }
    100% { transform: translateY(0px); }
  }

  &:hover {
    transform: scale(1.05) rotate(5deg);
    box-shadow: 0 0 15px var(--accent);
    animation-play-state: paused;
  }

  @media (max-width: 576px) {
    width: 40px;
    height: 40px;
  }
`;

export const TitleGroup = styled.div`
  display: flex;
  flex-direction: column;
`;

export const Title = styled.h1`
  font-size: 1.5rem;
  font-weight: bold;
  color: var(--text);
  margin: 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  span {
    color: var(--accent);
    position: relative;

    &::after {
      content: '';
      position: absolute;
      bottom: -2px;
      left: 0;
      width: 100%;
      height: 2px;
      background-color: var(--accent);
      transform: scaleX(0);
      transform-origin: right;
      transition: transform 0.3s ease;
    }
  }

  &:hover span::after {
    transform: scaleX(1);
    transform-origin: left;
  }

  @media (max-width: 576px) {
    font-size: 1.2rem;
  }
`;

export const SubTitle = styled.h3`
  font-size: 0.85rem;
  color: var(--text-muted);
  margin: 0.2rem 0 0 0;
  font-weight: normal;

  @media (max-width: 576px) {
    font-size: 0.75rem;
  }
`;

export const ActionContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;

  @media (max-width: 768px) {
    margin-top: 0.5rem;
    width: 100%;
    justify-content: flex-end;
  }
`;

export const LogoutButton = styled.button`
  background-color: transparent;
  color: var(--accent);
  border: 1px solid var(--accent);
  border-radius: 20px;
  padding: 0.4rem 1.2rem;
  font-size: 0.85rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.3s ease;

  svg {
    font-size: 0.9rem;
  }

  &:hover {
    background-color: var(--accent);
    color: var(--bg);
    transform: translateY(-2px);
    box-shadow: 0 3px 8px var(--shadow);
  }
`;

export const ThemeToggle = styled.button`
  background-color: transparent;
  color: var(--text-muted);
  border: none;
  font-size: 1.2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.3rem;
  border-radius: 50%;
  transition: all 0.3s ease;

  &:hover {
    color: var(--text);
    transform: rotate(30deg);
  }
`;
