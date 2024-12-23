import { useContext, useEffect, useState } from 'react';
import './MapComponent.css';
import { checkPermissions, getCurrentStaticPosition, getRoamingPosition } from '../helpers/GpsLocatorHelper';
import { Capacitor } from '@capacitor/core';
import { AppContext } from '../context/AppContext';
import { getCoordsMockEvent, getGap, getRandomCoords } from '../helpers/EventCoordHelper';
import { Coordinate } from '../model/Coordinate';
import { addCoordinates, mapCenter } from '../helpers/StatsHelper';
import { getCoordinateEvent, sendCoordinate, socketInit, getIdClients } from '../socket/Configuration';
import { MapContainer, Marker, Popup, TileLayer, useMap } from 'react-leaflet'
import 'leaflet/dist/leaflet.css';
import { Icon } from 'leaflet';
import { IonFab, IonFabButton, IonIcon, IonToggle } from '@ionic/react';
import { trashOutline } from 'ionicons/icons';
import { Subscription } from 'rxjs';

interface ContainerProps {
    user: string
}

const MapComponent: React.FC<ContainerProps> = ({ user }) => {

    const availableColors = new Map([['red', 0], ['black', 0], ['blue', 0],])

    const [iconColorCount, setIconColorCount] = useState<Map<string, number>>(availableColors);

    const [clientColor, setClientColor] = useState<Map<string, string>>(new Map<string, string>);

    const [enableCenter, setEnableCenter] = useState(true);

    const [center, setCenter] = useState({ lat: -34.6, lng: -58.382 });

    const [save, setSave] = useState(false);

    const { room } = useContext(AppContext);

    const [coords, setCoords] = useState([] as Coordinate[]);

    let uns1: Subscription;
    let uns2: Subscription;
    let uns3: Subscription;
    let uns4: Subscription;
    let uns5: Subscription;

    useEffect(() => {
        position(); //subscripciones duplicadas
        socketInit(room);

        return () => {

            uns1.unsubscribe();
            uns2.unsubscribe();
            uns3.unsubscribe();
            uns4.unsubscribe();
            uns5.unsubscribe();

        };

    }, []);

    const getIconUrl = (user: string): string => {
        let color = clientColor.get(user);
        return 'assets/icon/' + color + '.png';
    }

    const theIcon = (username: string) => new Icon({
        iconUrl: getIconUrl(username),
        iconRetinaUrl: getIconUrl(username),
        popupAnchor: [-0, -0],
        iconSize: [32, 45],
    })


    const position = () => {
        assignColorToLocalClient();
        if (!Capacitor.isNativePlatform()) {
            uns1 = getCurrentStaticPosition().subscribe(position => {
                mockPosition(position.coords.latitude, position.coords.longitude, 0.005);
            });
        } else {
            uns2 = getRoamingPosition().subscribe(position => {
                roamingPosition(position.coords.latitude, position.coords.longitude);
            });
        }
        clientsPositions();
    }

    const clientsPositions = (): void => {

        uns3 = getCoordinateEvent().subscribe(c => {
            if (c) {
                if (c.newUser) {
                    assignColorToClient();
                }
                let co: Coordinate = Coordinate.coordinateBuilder(c.lat, c.ln, c.time,
                    c.user, c.group);
                addCoordinates(co);
                //setCoords(coords => [...coords, co]);
                coords.push(co);
                setCoords(coords);
                centerMap();
            }
        });

    }

    const assignColorToLocalClient = (): void => {
        clientColor.set(user, 'red');
        setClientColor(clientColor);
    }


    const assignColorToClient = (): void => {
        const idClients: Set<string> = getIdClients();
        for (let c of idClients) {
            if (!clientColor.has(c)) {
                let luc = lessUsedColor();
                clientColor.set(c, luc);
                setClientColor(clientColor);
                iconColorCount.set(luc, iconColorCount.get(luc) + 1);
                setIconColorCount(iconColorCount);
            }
        }
    }

    const lessUsedColor = (): string => {

        let color: string;
        let arrayVal: number[] = Array.from(iconColorCount.values());
        let minor: number = Math.min(...arrayVal);

        iconColorCount.forEach((value, key, map) => {
            if (value === minor) {
                color = key;
            }
        })
        return color;
    }


    const mockPosition = (lat?: number, ln?: number, _gap?: number): void => {
        let gap: number = getGap(0.005, 0.0005);
        let c: Coordinate = getRandomCoords(lat, ln, 0.005, 0.0005); // c.lat, c.ln
        uns4 = getCoordsMockEvent(c.lat, c.ln, gap).subscribe(position => {
            let co: Coordinate = Coordinate.coordinateBuilder(position.lat, position.ln, new Date(),
                user, 'room1');
            addCoordinates(co);
            //setCoords([...coords, co]);
            coords.push(co);
            setCoords(coords);
            centerMap();
            co.save = save;
            sendCoordinate(co);
        });
    }

    const roamingPosition = (lat: number, ln: number): void => {
        let co: Coordinate = Coordinate.coordinateBuilder(lat, ln, new Date(),
            user, 'room1');
        addCoordinates(co);
        //setCoords([...coords, co]);
        coords.push(co);
        setCoords(coords);
        centerMap();
        co.save = save;
        sendCoordinate(co);

    }

    const centerMap = (): void => {
        if (enableCenter) {
            let center: Coordinate = mapCenter();
            setCenter({ lat: center.lat, lng: center.ln });
        }

    }

    const toggleCenter = () => {
        const centered = !enableCenter;
        setEnableCenter(centered);
    }

    const enableSave = () => {
        const grab = !save;
        setSave(grab);
        console.log('save:' + save);
    }

    const clearMarks = () => {
        setCoords([]);
    }

    const _checkPermissions = (): void => {

        uns5 = checkPermissions().subscribe(status => {
            console.log(status);
            if (status !== 'web' && (status.location !== 'granted' || status.coarseLocation !== 'granted')) {

            }
        });

    }

    const ChangeCenter = ({ center }) => {
        const map = useMap();
        map.setView(center);
        return null;
    }


    const RoamingMarkers = () => {

        if (coords && coords.length > 0) {
            return (
                coords.map((c, index) => {
                    return <Marker icon={theIcon(c.user)} position={{ lat: c.lat, lng: c.ln }} key={index} />
                }));

        }

    }

    return (
        <>
            {center ? (
                <MapContainer center={{ lat: center.lat, lng: center.lng }} zoom={12} scrollWheelZoom={false}

                    style={{
                        height: "550px", width: "100%", backgroundColor: "white", marginTop: "10px", marginBottom: '10px'
                    }}
                >
                    {enableCenter ? <ChangeCenter center={center} /> : ''}

                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />

                    <RoamingMarkers />

                </MapContainer>
            ) : ''
            }

            <IonFab slot="fixed" vertical="top" horizontal="start">
                <IonToggle checked={enableCenter} onClick={() => toggleCenter()}>Auto Center</IonToggle>
            </IonFab >
            <IonFab slot="fixed" vertical="top" horizontal="center">
                <IonToggle color="warning" checked={save} onClick={() => enableSave()}>Enable saving</IonToggle>
            </IonFab >
            <IonFab slot="fixed" vertical="bottom" horizontal="end">
                <IonFabButton onClick={() => clearMarks()}>
                    <IonIcon aria-hidden="true" slot="start" ios={trashOutline} md={trashOutline} />
                </IonFabButton >
            </IonFab >

        </>
    );
};

export default MapComponent;
