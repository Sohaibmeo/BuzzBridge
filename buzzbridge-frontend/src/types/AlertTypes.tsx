import { AlertProps } from '@mui/material';
import { ReactNode } from 'react';

export interface AlertState {
  id: number;
  severity: AlertProps['severity'];
  message: string;
}

export interface AlertContextType {
  alerts: AlertState[];
  showAlert: (severity: AlertProps['severity'], message: string) => void;
  hideAlert: (id: number) => void;
}
export interface AlertProviderProps {
  children: ReactNode;
}
