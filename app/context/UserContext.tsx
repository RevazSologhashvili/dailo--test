"use client"

import React, {createContext, useContext, useState, useEffect} from "react";

type User = {
    id: number;
    first_name: string;
    last_name: string;
    username: string;
    is_admin: boolean;
}

type UserContextType = {
    user: User | null;
    setUser: (user: User) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);

    useEffect(()=> {
        const storeUser = localStorage.getItem("user");
        if(storeUser) {
            setUser(JSON.parse(storeUser))
        }
    },[])

    const handleSetUser = (user: User) => {
        localStorage.setItem("user", JSON.stringify(user));
        setUser(user)
    }

    return (
        <UserContext.Provider value={{ user, setUser: handleSetUser }}>
            {children}
        </UserContext.Provider>
    )
}


export const useUser = () => {
    const context = useContext(UserContext);
    if(!context) {
        throw new Error('Provider must be used')
    }
    return context
}
