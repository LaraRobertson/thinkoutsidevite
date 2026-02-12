import { createContext } from 'react';
import type { AuthUser } from 'aws-amplify/auth';
import type { ModalContent } from './utils/modalHelpers';

type AuthContextType = {
  setModalContent: React.Dispatch<React.SetStateAction<ModalContent>>;
  modalContent: ModalContent;
  authStatus?: string;
  user?: AuthUser;
  email?: string;
  isChecked?: boolean;
  setIsChecked?: React.Dispatch<React.SetStateAction<boolean>>;
};

export const MyAuthContext = createContext<AuthContextType | null>(null);