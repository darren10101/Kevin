import { createContext, useState, useContext, ReactNode } from 'react';

interface NavbarContextType {
    navbarData: string;
    setNavbarData: (data: string) => void;
}

const NavbarContext = createContext<NavbarContextType | undefined>(undefined);

export const NavbarProvider = ({ children }: { children: ReactNode }) => {
    const [navbarData, setNavbarData] = useState<string>('');

    return (
        <NavbarContext.Provider value={{ navbarData, setNavbarData }}>
            {children}
        </NavbarContext.Provider>
    );
};

export const useNavbar = () => {
    const context = useContext(NavbarContext);
    if (!context) {
        throw new Error('useNavbar must be used within a NavbarProvider');
    }
    return context;
};