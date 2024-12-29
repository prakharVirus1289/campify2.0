import {createContext, useState, useEffect, ReactNode } from 'react';

export interface User {
   first_name: string;
   last_name: string;
   email: string;
   id: string;
   image: string;
}

interface SessionContextType {
   user: User | null;
   setUser: (user: User | null) => void;
}

interface SessionProviderProps {
   children: ReactNode;
}

export const SessionContext = createContext<SessionContextType>({
    user: null,
    setUser: () => {}
});

export const SessionProvider: React.FC<SessionProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  return (
    <SessionContext.Provider value={{ user, setUser }}>
      {children}
    </SessionContext.Provider>
  );
};
