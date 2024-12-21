
import { useContext, useEffect, useState } from 'react';
import './Room.css';
import { AppContext } from '../context/AppContext';

type UserRoom = {
    name: string;
    room: String;
};

const Room: React.FC = () => {

    const [rooms, setRooms] = useState<Set<UserRoom>>();
    const [room, setRoom] = useState('');

    const { user, setUser } = useContext(AppContext);

    useEffect(() => {
        setUsers();
    }, []);

    const setTheRoom = (ds: any) => {
        setRoom(ds.detail.value);
        user.room = room;
        setUser(user);
        setUsers();
    }


    const setUsers = (): void => {

        rooms.clear();
        setRooms(rooms);

        /*
        getIdClients().forEach(user =>
            rooms.add({ name: user, room: 'room1' })
        )
            */

        rooms.add({ name: user.name, room: user.room ? user.room : 'room1' });
        setRooms(rooms);

    }

    return (
        <div >

        </div >
    );
};

export default Room;