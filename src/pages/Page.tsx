import { IonButtons, IonContent, IonHeader, IonMenuButton, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import { useParams } from 'react-router';
import ExploreContainer from '../components/ExploreContainer';
import './Page.css';
import { useContext, useEffect } from 'react';
import { useCookies } from 'react-cookie';
import { AppContext, AppContextI } from '../context/AppContext';

const Page: React.FC = () => {

  const { name } = useParams<{ name: string; }>();

  /*
  const { setUser } = useContext<AppContextI>(AppContext);

  const [cookies] = useCookies(['token', 'username']);

  useEffect(() => {

    if (cookies.username) {
      setUser(cookies.username);
    }

  }, []);
  */

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonMenuButton />
          </IonButtons>
          <IonTitle>{name}</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">{name}</IonTitle>
          </IonToolbar>
        </IonHeader>
        <ExploreContainer name={name} />
      </IonContent>
    </IonPage>
  );
};

export default Page;
