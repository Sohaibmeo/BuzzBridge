import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { Alert, AlertProps } from '@mui/material';

interface AlertState {
  id: number;
  severity: AlertProps['severity'];
  message: string;
}

interface AlertContextType {
  alerts: AlertState[];
  showAlert: (severity: AlertProps['severity'], message: string) => void;
  hideAlert: (id: number) => void;
}

const AlertContext = createContext<AlertContextType>({
  alerts: [],
  showAlert: () => {},
  hideAlert: () => {},
});

export const useAlert = () => useContext(AlertContext);

interface AlertProviderProps {
  children: ReactNode;
}

export const AlertProvider: React.FC<AlertProviderProps> = ({ children }) => {
  const [alerts, setAlerts] = useState<AlertState[]>([]);

  const showAlert = (severity: AlertProps['severity'], message: string) => {
    const newAlert: AlertState = {
      id: Date.now(), // Generate unique id for each alert
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
      const timerId = setTimeout(() => hideAlert(alert.id), 5000); // Auto close after 5 seconds
      return () => clearTimeout(timerId);
    });
  }, [alerts]);

  return (
    <AlertContext.Provider value={{ alerts, showAlert, hideAlert }}>
      {children}
      {alerts.map((alert,index) => (
        <Alert
          key={index}
          severity={alert.severity}
          sx={{ width: '100%', maxWidth: "30%", position:'absolute', top:`${index*7}%`, left:'35%' }} // Customize width here
          onClose={() => hideAlert(alert.id)}
        >
          {alert.message}
        </Alert>
      ))}
    </AlertContext.Provider>
  );
};
