import { Coordinate } from "../model/Coordinate";

export const coordinates: Map<string, Array<Coordinate>> = new Map<string, Array<Coordinate>>();
const N_COORDS_AVERAGE = import.meta.env.VITE_N_COORDS_AVERAGE;
//push coordinates all users, max n for user
export const addCoordinates = (c: Coordinate,): void => {

    let cs: Array<Coordinate>;

    if (coordinates.has(c.user)) {
        cs = coordinates.get(c.user);
        cs.push(c);
        if (cs.length > N_COORDS_AVERAGE) {
            cs.shift();
        }

    } else {
        coordinates.set(c.user, [c]);
    }

}

//all coordinates n for client
export const mapCenter = (): Coordinate => {

    let avcoordinates: Coordinate[] = groupCoordinates();
    let c = new Coordinate();
    let size = avcoordinates.length;
    let sumlats: number = 0;
    let sumlns: number = 0;

    for (let cs of avcoordinates) {
        sumlats = sumlats + cs.lat;
        sumlns = sumlns + cs.ln;
    }

    c.lat = sumlats / size;
    c.ln = sumlns / size;

    return c;

}


//group of coords to average
const groupCoordinates = () => {
    let avcoordinates: Coordinate[] = [];
    coordinates.forEach(c => {
        avcoordinates.push(...c);
    });
    return avcoordinates;
}














