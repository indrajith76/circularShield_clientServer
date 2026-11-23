/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useCallback } from 'react';
import LoginRequiredModal from '../components/auth/LoginRequiredModal';

const AuthModalContext = createContext(null);

export const AuthModalProvider = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [modalConfig, setModalConfig] = useState({
    destination: '/dashboard',
    featureTitle: 'Protected Platform Feature',
    reason: '',
  });

  const openAuthModal = useCallback(
    ({
      destination = '/dashboard',
      featureTitle = 'Protected Platform Feature',
      reason = '',
    } = {}) => {
      setModalConfig({ destination, featureTitle, reason });
      setIsOpen(true);
    },
    []
  );

  const closeAuthModal = useCallback(() => {
    setIsOpen(false);
  }, []);

  return (
    <AuthModalContext.Provider
      value={{
        isAuthModalOpen: isOpen,
        openAuthModal,
        closeAuthModal,
      }}
    >
      {children}
      <LoginRequiredModal
        isOpen={isOpen}
        onClose={closeAuthModal}
        destination={modalConfig.destination}
        featureTitle={modalConfig.featureTitle}
        reason={modalConfig.reason}
      />
    </AuthModalContext.Provider>
  );
};

export const useAuthModal = () => {
  const context = useContext(AuthModalContext);
  if (!context) {
    throw new Error('useAuthModal must be used within an AuthModalProvider');
  }
  return context;
};

export default AuthModalContext;
