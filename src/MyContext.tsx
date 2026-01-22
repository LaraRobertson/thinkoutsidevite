import { createContext } from 'react';
import type { AuthUser } from 'aws-amplify/auth';

type ModalContent = {
  open: boolean;
  content: string;
  id: string;
  modalStyle: string;
  action: string;
  gameID: string;
  zoneID: string;
  puzzleID: string;
  updatedDB: boolean;
};

type AuthContextType = {
  setModalContent: React.Dispatch<React.SetStateAction<ModalContent>>;
  modalContent: ModalContent;
  authStatus?: string;
  user?: AuthUser;
  email?: string;
};

export const MyAuthContext = createContext<AuthContextType | null>(null);
export const MyGameContext = createContext("");