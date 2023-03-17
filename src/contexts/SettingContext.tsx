import type { Direction } from '@mui/material';
import type { ReactNode } from 'react';
import { createContext, useEffect, useState } from 'react';

// ============================================================
export type SettingsOptions = { direction: Direction };
// ============================================================

// SET "rtl" OR "ltr" HERE
// THEN GOTO BROWSER CONSOLE AND RUN localStorage.clear() TO CLEAR LOCALSTORAGE
const initialSettings: SettingsOptions = { direction: 'ltr' };

export const SettingsContext = createContext({
  settings: initialSettings,
  updateSettings: (arg: SettingsOptions) => {},
});

// ============================================================
type settingsProviderProps = { children?: ReactNode };
// ============================================================

const SettingsProvider = ({ children }: settingsProviderProps) => {
  const [settings, setSettings] = useState(initialSettings);

  const updateSettings = (updatedSetting: SettingsOptions) => {
    setSettings(updatedSetting);
    window.localStorage.setItem(
      'bazaar_settings',
      JSON.stringify(updatedSetting),
    );
  };

  useEffect(() => {
    if (!window) return null;

    const getItem = window.localStorage.getItem('bazaar_settings');

    if (getItem) setSettings(JSON.parse(getItem));
  }, []);

  return (
    <SettingsContext.Provider value={{ settings, updateSettings }}>
      {children}
    </SettingsContext.Provider>
  );
};

export default SettingsProvider;
