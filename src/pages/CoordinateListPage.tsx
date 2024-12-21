
import { IonButtons, IonContent, IonHeader, IonMenuButton, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import './CoordinateListPage.css';
import CoordinateList from '../components/CoordinateList';

const CoordinateListPage: React.FC = () => {

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonButtons slot="start">
                        <IonMenuButton />
                    </IonButtons>
                    <IonTitle>Coordinate List</IonTitle>
                </IonToolbar>
            </IonHeader>

            <IonContent fullscreen>
                <IonHeader collapse="condense">
                    <IonToolbar>
                        <IonTitle size="large">Coordinate List</IonTitle>
                    </IonToolbar>
                </IonHeader>
                <CoordinateList />
            </IonContent>
        </IonPage>
    );
};

export default CoordinateListPage;