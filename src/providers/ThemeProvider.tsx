import {
  createContext,
  FC,
  PropsWithChildren,
  useEffect,
  useMemo,
  useState,
} from 'react';

enum ThemeEnum {
  DARK = 'dark',
  LIGHT = 'light',
}
type ThemeType = ThemeEnum.DARK | ThemeEnum.LIGHT;

export const themes = {
  dark: ThemeEnum.DARK,
  light: ThemeEnum.LIGHT,
};

type Props = {
  theme: string;
  handleChangeTheme: () => void;
  handleLogOutChangeDEfTheme: () => void;
};

export const ThemeContext = createContext<Props | null>(null);

export const getTheme = () => {
  const themeLocal = window?.localStorage?.getItem('theme');

  if (themeLocal !== undefined && themeLocal !== null) {
    const theme: ThemeType = themeLocal as ThemeType;
    if (Object.values(themes).includes(theme)) return theme;
  }

  const userMedia = window.matchMedia('(prefers-color-scheme: dark)');

  if (userMedia.matches) {
    return ThemeEnum.DARK;
  }

  return ThemeEnum.LIGHT;
};

/**
 *
 * @returns return { theme, handleChangeTheme }
 * @example
 * const theme = useContext(ThemeContext);
 */
const ThemeProvider: FC<PropsWithChildren> = ({ children }) => {
  const [theme, setTheme] = useState<ThemeType>(getTheme);

  const handleChangeTheme = () => {
    if (theme === ThemeEnum.DARK) {
      setTheme(ThemeEnum.LIGHT);
    } else {
      setTheme(ThemeEnum.DARK);
    }
  };

  const handleLogOutChangeDEfTheme = () => {
    setTheme(getTheme());
  };

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem('theme', theme);
  }, [theme]);

  const handleThemeChange = (e: MediaQueryListEvent) => {
    const newTheme = e.matches ? ThemeEnum.DARK : ThemeEnum.LIGHT;
    setTheme(newTheme);
  };

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    mediaQuery.addEventListener('change', handleThemeChange);

    return () => {
      mediaQuery.removeEventListener('change', handleThemeChange);
    };
  }, []);

  const useMemoValue = useMemo(
    () => ({ theme, handleChangeTheme, handleLogOutChangeDEfTheme }),
    [theme]
  );

  return (
    <ThemeContext.Provider value={useMemoValue}>
      {children}
    </ThemeContext.Provider>
  );
};

export default ThemeProvider;
