import styled from "styled-components";


export const HomeContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: start;
  align-items: center;
  width: 100%;
  flex-grow: 1;
  color: black;
  margin-top: 0.2rem;
  margin-bottom: 0.2rem;
`;

export const ButtonContainer = styled(HomeContainer)`
  flex-direction: row;
  justify-content: flex-end;
  flex-grow: 0;
  flex-shrink: 0;
  padding: 1rem;
  margin-bottom: 1rem;
  position: relative;
  z-index: 5;
`;

export const Button = styled.button`
  font-size: 0.9rem;
  font-weight: 500;
  color: var(--text);
  background-color: var(--btnBg);
  border: 2px solid var(--bdr);
  border-radius: 50px;
  width: 5rem;
  height: 5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 0.5rem;
  transition: all 0.3s ease;
  cursor: pointer;
  box-shadow: 0 2px 5px var(--shadow);

  &:disabled {
    outline: none;
    opacity: 0.5;
    cursor: not-allowed;
  }

  &:hover:not(:disabled) {
    background-color: var(--hvr);
    color: var(--text);
    border: 2px solid var(--accent);
    transform: translateY(-3px);
    box-shadow: 0 4px 8px var(--shadow);
  }
`;

export const TaskContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: flex-start;
  flex-wrap: wrap;
  width: 95%;
  max-height: calc(100vh - 200px);
  overflow-y: auto;
  padding: 10px;
  background-color: rgba(59, 31, 20, 0.5);
  border-radius: 12px;
  box-shadow: inset 0 0 10px var(--shadow);
  position: relative;
  z-index: 1;

  /* Style the entire scrollbar */
  &::-webkit-scrollbar {
    width: 8px; /* Width of the vertical scrollbar */
    height: 8px; /* Height of the horizontal scrollbar */
  }

  /* Style the scrollbar track (background) */
  &::-webkit-scrollbar-track {
    background: var(--bg); /* Light gray background */
  }

  /* Style the scrollbar thumb (scroll handle) */
  &::-webkit-scrollbar-thumb {
    background: var(--fg); /* Use border color for consistency */
    border-radius: 4px; /* Rounded corners */
  }

  /* Style the scrollbar thumb on hover */
  &::-webkit-scrollbar-thumb:hover {
    background: var(--accent); /* Darker gray when hovered */
  }

  /* Optional: Style the scrollbar corners (only visible if both scrollbars are present) */
  &::-webkit-scrollbar-corner {
    background: var(--bg);
  }
`;

export const TaskCard = styled.div`
  background-color: var(--card-bg);
  border: 2px solid var(--bdr);
  border-radius: 12px;
  width: calc(100% - 10px);
  margin: 8px;
  padding: 1rem;
  transition: all 0.3s ease-in-out;
  box-shadow: 0 4px 8px var(--shadow);
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 4px;
    height: 100%;
    background-color: var(--accent);
    transition: all 0.3s ease;
  }

  @media (min-width: 576px) {
    width: calc(50% - 16px);
  }

  @media (min-width: 768px) {
    width: calc(33.333% - 16px);
  }

  @media (min-width: 992px) {
    width: calc(25% - 16px);
  }

  @media (min-width: 1200px) {
    width: calc(20% - 16px);
  }

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 16px var(--shadow);

    &::before {
      width: 8px;
    }
  }
`;

export const TaskRow = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-evenly;
  align-items: center;
  width: 100%;
  flex-shrink: 0;
`;

export const TaskTitle = styled.h3`
  font-size: 1.1rem;
  margin: 0.5rem 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  color: var(--text);
  font-weight: 600;
  letter-spacing: 0.5px;
`;

export const TaskText = styled.p`
  font-size: 0.9rem;
  width: 90%;
  margin: 0.25rem 0;
  overflow: hidden;
  text-overflow: ellipsis;
  color: var(--text-muted);
  line-height: 1.4;
`;

export const CheckBox = styled.input`
  cursor: pointer;
  width: 18px;
  height: 18px;
  accent-color: var(--accent);
  margin-right: 8px;
  transition: all 0.2s ease;

  &:hover {
    transform: scale(1.1);
  }
`;
