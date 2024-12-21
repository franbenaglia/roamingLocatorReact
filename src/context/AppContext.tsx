import { createContext, useState } from "react";
import { User } from "../model/User";
import { Coordinate } from "../model/Coordinate";

export interface AppContextI {

    logged: boolean;
    setLogged: (logged: boolean) => void,
    user: User,
    setUser: (user: User) => void,
    room: string,
    setRoom: (room: string) => void,
    logout: () => void
}

export const AppContext = createContext<AppContextI>(null);

export const AppProvider = ({ children }: any) => {

    const [logged, setLogged] = useState(false);
    const [user, setUser] = useState({ name: 'Anonimo' } as User);
    const [room, setRoom] = useState('room1');

    const logout = () => {
        setLogged(false);
        window.location.assign("/");
    }

    return (
        <AppContext.Provider value={{
            logged, user, setUser, setLogged, logout, room, setRoom
        }}>
            {children}
        </AppContext.Provider>
    );

}