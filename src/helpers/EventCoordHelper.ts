import { Coordinate } from "../model/Coordinate";
import { repeat, defer, of, Observable, delay } from 'rxjs';

export const getCoordsMockEvent = (lat?: number, ln?: number, gap?: number): Observable<Coordinate> => {

    let latitude: number = lat ? lat : 34;
    let longitude: number = ln ? ln : -57;
    let skip: number = gap ? gap : 0.5;
    let diff: number = 0;
    let plusOrMinusLat: number = Math.random() < 0.5 ? -1 : 1;
    let plusOrMinusLn: number = Math.random() < 0.5 ? -1 : 1;

    let sourceCoords = defer(() => {

        let c: Coordinate = new Coordinate();

        c.lat = latitude + (diff * plusOrMinusLat);
        c.ln = longitude + (diff * plusOrMinusLn);
        c.time = new Date();
        c.group = 'room1';
        c.user = 'user1';

        diff = diff + skip;
        if (diff > 2) diff = 0;

        return of(c);
    });

    return sourceCoords.pipe(repeat({ delay: 5000 }));//.pipe(delay(7000));
}


//called once per client
export const getRandomCoords = (clat: number, cln: number, max: number, min: number): Coordinate => {

    let cfake: Coordinate = new Coordinate();
    let plusOrMinus: number = Math.random() < 0.5 ? -1 : 1;

    let klat = Math.random() * (max - min) + min;
    let kln = Math.random() * (max - min) + min;

    let latitude: number = clat + plusOrMinus * klat;
    let longitude: number = cln + plusOrMinus * kln;

    cfake.ln = longitude;
    cfake.lat = latitude;

    return cfake;
}

//called once per client
export const getGap = (max: number, min: number): number => {
    return Math.random() * (max - min) + min;
}