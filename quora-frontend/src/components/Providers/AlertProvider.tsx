import React, { createContext, useContext, useState, useEffect } from 'react';
import { Alert, AlertProps, Snackbar } from '@mui/material';
import {
  AlertContextType,
  AlertProviderProps,
  AlertState,
} from '../../types/AlertTypes';

const AlertContext = createContext<AlertContextType>({
  alerts: [],
  showAlert: () => {},
  hideAlert: () => {},
});

export const useAlert = () => useContext(AlertContext);

export const AlertProvider: React.FC<AlertProviderProps> = ({ children }) => {
  const [alerts, setAlerts] = useState<AlertState[]>([]);

  const showAlert = (severity: AlertProps['severity'], message: string) => {
    const newAlert: AlertState = {
      id: Date.now(),
      severity,
      message,
    };
    setAlerts((prevAlerts) => [...prevAlerts, newAlert]);
  };

  const hideAlert = (id: number) => {
    setAlerts((prevAlerts) => prevAlerts.filter((alert) => alert.id !== id));
  };

  useEffect(() => {
    alerts.forEach((alert) => {
      const timerId = setTimeout(() => hideAlert(alert.id), 5000);
      return () => clearTimeout(timerId);
    });
  }, [alerts]);

  return (
    <AlertContext.Provider value={{ alerts, showAlert, hideAlert }}>
      {children}
      {alerts.map((alert, index) => (
        <Snackbar
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          open={alerts.length > 0}
          autoHideDuration={5000}
          key={index}
          onClose={() => hideAlert(alert.id)}
        >
          <Alert
            severity={alert.severity}
            variant="filled"
            onClose={() => hideAlert(alert.id)}
          >
            {alert.message}
          </Alert>
        </Snackbar>
      ))}
    </AlertContext.Provider>
  );
};
