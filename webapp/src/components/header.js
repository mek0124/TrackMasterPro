import {
  HeaderContainer,
  LogoContainer,
  TitleGroup,
  Image,
  Title,
  SubTitle,
  ActionContainer,
  LogoutButton,
  ThemeToggle
} from '../assets/styles/components/header.style';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignOutAlt, faMoon, faSun, faMugHot } from '@fortawesome/free-solid-svg-icons';
import { useState } from 'react';
import { useAuth } from '../hooks/authContext';
import { useTheme } from '../hooks/themeContext';
import LogoutModal from './LogoutModal';

export default function Header() {
  const { userId, logout, isLoading } = useAuth();
  const { isDarkTheme, toggleTheme } = useTheme();
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const handleLogoutClick = () => {
    setShowLogoutModal(true);
  };

  const handleCloseModal = () => {
    setShowLogoutModal(false);
  };

  const handleConfirmLogout = () => {
    logout();
    setShowLogoutModal(false);
  };

  const handleThemeToggle = () => {
    toggleTheme();
  };

  return (
    <HeaderContainer>
      <LogoContainer>
        <Image
          src="/icon.png"
          alt="Track Master Pro Icon"
        />
        <TitleGroup>
          <Title>
            <FontAwesomeIcon icon={faMugHot} />
            Track<span>Master</span>Pro
          </Title>
          <SubTitle>
            Organize your tasks with a coffee break
          </SubTitle>
        </TitleGroup>
      </LogoContainer>

      <ActionContainer>
        <ThemeToggle
          onClick={handleThemeToggle}
          title={isDarkTheme ? "Switch to light mode" : "Switch to dark mode"}
        >
          <FontAwesomeIcon icon={isDarkTheme ? faSun : faMoon} />
        </ThemeToggle>

        {userId && !isLoading && (
          <LogoutButton
            onClick={handleLogoutClick}
            title="Log out of your account"
          >
            <FontAwesomeIcon icon={faSignOutAlt} />
            Logout
          </LogoutButton>
        )}
      </ActionContainer>

      {/* Custom Logout Modal */}
      <LogoutModal
        isOpen={showLogoutModal}
        onClose={handleCloseModal}
        onLogout={handleConfirmLogout}
      />
    </HeaderContainer>
  );
};
