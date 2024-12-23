import { createContext, useState } from "react";
import { User } from "../model/User";

export interface AppContextI {

    user: User,
    setUser: (user: User) => void,
    room: string,
    setRoom: (room: string) => void,
}

export const AppContext = createContext<AppContextI>(null);

export const AppProvider = ({ children }: any) => {

    const [user, setUser] = useState({ name: 'Anonimo' } as User);
    const [room, setRoom] = useState('room1');

    return (
        <AppContext.Provider value={{
            user, setUser, room, setRoom
        }}>
            {children}
        </AppContext.Provider>
    );

}