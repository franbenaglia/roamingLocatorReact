import { BehaviorSubject, Observable } from 'rxjs';
import { Socket, io } from "socket.io-client";
import { CoordinateEvent } from '../model/CoordinateEvent';
import { Coordinate } from '../model/Coordinate';

const URL_RESOURCE_SERVER = import.meta.env.VITE_URL_RESOURCE_SERVER;

export const Coordevent: BehaviorSubject<CoordinateEvent> = new BehaviorSubject(null);
//https://stackoverflow.com/questions/34351804/how-to-declare-a-global-variable-in-react
export const idClients: Set<string> = new Set<string>();

export const socket: Socket<any, any> = io(URL_RESOURCE_SERVER);

export const socketInit = (room: string) => {

    socket.on("connect", () => {
        console.log('socket id ' + socket.id);
        console.log('socket connected ' + socket.connected);
        const engine = socket.io.engine;
        console.log('socket trasnsport ' + engine.transport.name);
    });

    socket.on("disconnect", (reason) => {

        console.log('socket id ' + socket.id);
        console.log('socket connected ' + socket.connected);

        if (socket.active) {
            // temporary disconnection, the socket will automatically try to reconnect
        } else {
            // the connection was forcefully closed by the server or the client itself
            // in that case, `socket.connect()` must be manually called in order to reconnect
            console.log(reason);
        }
    });

    socket.on('newclientconnected', (arg: any) => {
        console.log('new client connected:' + arg);
    });

    socket.on('coordinateall', (c: Coordinate) => {
        console.log('receiving coordinates from server included me: ' + JSON.stringify(c));
    });

    socket.on(room, (c: CoordinateEvent) => { //'coordinateallwithoutme'
        console.log('receiving coordinates from server whitout me: ' + JSON.stringify(c));
        //addCoordinates(c); already added in map
        let newClient = false;
        let originals = idClients.size;
        idClients.add(c.user);
        let currents = idClients.size;
        if (originals < currents) {
            newClient = true;
        }
        c.newUser = newClient;
        setCoordinateEvent(c);
    });


    socket.on("connect_error", (error) => {
        if (socket.active) {
            // temporary failure, the socket will automatically try to reconnect
        } else {
            // the connection was denied by the server
            // in that case, `socket.connect()` must be manually called in order to reconnect
            console.log(error.message);
        }
    });

}


export const getCoordinateEvent = (): Observable<CoordinateEvent> => {
    return Coordevent.asObservable();
}

export const setCoordinateEvent = (event: CoordinateEvent) => {
    Coordevent.next(event);
}

export const sendCoordinate = (coordinate: Coordinate): void => {
    socket.emit("coordinate", coordinate, (response: any) => {
        console.log(response);
    });

}

export const getIdClients = (): Set<string> => {
    return idClients;
}
    