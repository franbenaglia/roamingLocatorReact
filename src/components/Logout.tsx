import { IonButton } from '@ionic/react';
import './Logout.css';
import { useContext } from 'react';
import { AppContext } from '../context/AppContext';
import { logout } from '../helpers/AuthHelper';

const Logout: React.FC = () => {

    const _logout = () => {
        logout();
    }

    return (
        <div >
            <IonButton color="danger" onClick={() =>
                _logout()}>Logout</IonButton>
        </div >
    );
};

export default Logout;