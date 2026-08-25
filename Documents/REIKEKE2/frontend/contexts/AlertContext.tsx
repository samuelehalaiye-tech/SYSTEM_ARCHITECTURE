import React, { createContext, useContext, useState, ReactNode } from 'react';
import CustomAlert from '../components/CustomAlert';

export interface AlertButton {
  text: string;
  onPress?: () => void;
  style?: 'default' | 'cancel' | 'destructive';
}

interface AlertOptions {
  title: string;
  message?: string;
  buttons?: AlertButton[];
}

interface AlertContextType {
  showAlert: (title: string, message?: string, buttons?: AlertButton[]) => void;
}

const AlertContext = createContext<AlertContextType | undefined>(undefined);

export function CustomAlertProvider({ children }: { children: ReactNode }) {
  const [visible, setVisible] = useState(false);
  const [options, setOptions] = useState<AlertOptions | null>(null);

  const showAlert = (title: string, message?: string, buttons?: AlertButton[]) => {
    setOptions({ title, message, buttons });
    setVisible(true);
  };

  const hideAlert = () => {
    setVisible(false);
    setTimeout(() => setOptions(null), 300); // Wait for animation
  };

  const handleButtonPress = (onPress?: () => void) => {
    hideAlert();
    if (onPress) {
      setTimeout(onPress, 300); // Execute after close animation
    }
  };

  return (
    <AlertContext.Provider value={{ showAlert }}>
      {children}
      <CustomAlert
        visible={visible}
        options={options}
        onClose={hideAlert}
        onButtonPress={handleButtonPress}
      />
    </AlertContext.Provider>
  );
}

export function useCustomAlert() {
  const context = useContext(AlertContext);
  if (!context) {
    throw new Error('useCustomAlert must be used within an CustomAlertProvider');
  }
  return context;
}
