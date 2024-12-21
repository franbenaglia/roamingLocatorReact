import { useEffect, useState } from 'react';
import './CoordinateList.css';
import { deleteAll, getAll, getByUser } from '../api/DbService';
import { Coordinate } from '../model/Coordinate';
import { IonButton, IonGrid, IonRow, IonCol, IonInput } from '@ionic/react';
import { refresh } from 'ionicons/icons';

const availableColors: string[] = ['red', 'white', 'blue', 'green', 'yellow', 'purple', 'cyan', 'magenta', 'pink'];

const CoordinateList: React.FC = () => {

    const [coordinates, setCoordinates] = useState<Coordinate[]>([]);
    const [idClients, setIdClients] = useState<Set<string>>();
    const [iconColorCount, setIconColorCount] = useState<Map<string, number>>();
    const [clientColor, setClientColor] = useState<Map<string, string>>();
    const [user, setUser] = useState('');

    const fetchAllCoordinates = async () => {
        const cs = await getAll();
        coordinates.push(...cs);
        setCoordinates(coordinates);
        setIdClients(new Set(coordinates.map(cs => cs.user)));
        initializeCss();

    }

    useEffect(() => {
        fetchAllCoordinates();
    }, []);

    const initializeCss = (): void => {

        initializeIconColor();
        assignColorToClient();

    }

    const initializeIconColor = () => {
        for (let c of availableColors) {
            iconColorCount.set(c, 0)
        }
        setIconColorCount(iconColorCount);
    }

    const assignColorToClient = (): void => {
        for (let c of idClients) {
            if (!clientColor.has(c)) {
                let luc = lessUsedColor();
                clientColor.set(c, luc);
                iconColorCount.set(luc, iconColorCount.get(luc) + 1);
                setIconColorCount(iconColorCount)
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

    const refresh = async () => {
        setCoordinates([]);
        const allCoord = await getAll();
        coordinates.push(...allCoord);
        setCoordinates(coordinates);
        initializeCss();
    }

    const _deleteAll = async () => {
        await deleteAll();
        setCoordinates([]);
    }

    const _getByUser = async () => {
        setCoordinates([]);
        const coords = await getByUser(user);
        coordinates.push(...coords)
        setCoordinates(coordinates);
        initializeCss();
    }

    const onChangeHandler = event => {
        setUser(event.target.value);
    }

    const getCssClient = (user: string): any => {

        let color = clientColor.get(user);
        return '{color:' + color + '}';
    }

    return (
        <div>

            <IonGrid>
                <IonRow>
                    <IonButton onClick={() => refresh()}>Refresh</IonButton>
                    <IonButton onClick={() => _deleteAll()}>Delete All</IonButton>
                </IonRow>
                <IonRow>
                    <IonInput onKeyUp={(event) => onChangeHandler(event)} value={user} placeholder="Enter user"></IonInput>
                    <IonButton onClick={() => _getByUser()} > By user</IonButton >
                </IonRow>
                <IonRow>
                    <IonCol>n</IonCol>
                    <IonCol>Latitude</IonCol>
                    <IonCol>Longitude</IonCol>
                    <IonCol>Date</IonCol>
                    <IonCol>User</IonCol>
                    <IonCol>Group</IonCol>
                </IonRow>

                {coordinates && coordinates.map((c, i) => {
                    return (
                        <IonRow>
                            <IonCol style={{ color: 'red' }}>{i}</IonCol>
                            <IonCol style={{ color: 'green' }}>{c.lat}</IonCol>
                            <IonCol style={{ color: 'yellow' }}>{c.ln}</IonCol>
                            <IonCol style={{ color: 'white' }}>{c.time.toISOString()}</IonCol>
                            <IonCol style={getCssClient(c.user)}>{c.user}</IonCol>
                            <IonCol style={{ color: 'pink' }}>{c.group}</IonCol>
                        </IonRow >
                    )
                })
                }

            </IonGrid >

        </div >
    );
};

export default CoordinateList;



