import { useState } from 'react';
import './Login.css';
import { githubOauth2Login, googleOauth2Login } from '../helpers/AuthHelper';
import { IonButton, IonIcon, IonItem, IonLabel, IonList, IonListHeader, IonToast } from '@ionic/react';

const Login: React.FC = () => {

    const [showMessage, setShowMessage] = useState(false);

    const setOpen = (value: boolean) => {
        setShowMessage(value);
    }

    const googleOauth2 = () => {
        googleOauth2Login();
    }

    const githubOauth2 = () => {
        githubOauth2Login();
    }


    return (
        <div >
            <IonToast position="top" positionAnchor="header" isOpen={showMessage} message="Login fail."
                onDidDismiss={() => setOpen(false)} duration={4000}>
            </IonToast>
            <IonList lines="inset">
                <IonListHeader>
                    <IonLabel>Complete:</IonLabel>
                </IonListHeader>
                <IonItem>
                    <IonButton type="button" onClick={() => googleOauth2()} shape="round" color="medium"
                        size="default">Google&nbsp;<IonIcon name="logo-google"></IonIcon ></IonButton>
                    <IonButton type="button" onClick={() => githubOauth2()} shape="round" color="light"
                        size="default">Github&nbsp;<IonIcon name="logo-github"></IonIcon ></IonButton>
                </IonItem >
            </IonList >
        </div >
    );
};

export default Login;