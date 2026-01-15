import { createContext, useContext, useMemo, useState } from "react";
import type { AuthContextType } from "./types";

export const AuthContext = createContext<AuthContextType>({
    active: false,
})

export const AuthProvider = ({ children, active = false }: { children: React.ReactNode, active: boolean }) => {

    const value = useMemo(() => ({ active }), [active]);
    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => {
    const context = useContext(AuthContext);
    if(!context) throw new Error('useAuth must be used within an AuthProvider');
    return context;
}