import { IonApp, IonRouterOutlet, IonSplitPane, setupIonicReact } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { Redirect, Route } from 'react-router-dom';
import Menu from './components/Menu';
import Page from './pages/Page';

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

/**
 * Ionic Dark Mode
 * -----------------------------------------------------
 * For more info, please see:
 * https://ionicframework.com/docs/theming/dark-mode
 */

/* import '@ionic/react/css/palettes/dark.always.css'; */
/* import '@ionic/react/css/palettes/dark.class.css'; */
import '@ionic/react/css/palettes/dark.system.css';

/* Theme variables */
import './theme/variables.css';
import { useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';
import { isLoggedIn, setGoogleJwtToken } from './helpers/AuthHelper';
import { AppProvider } from './context/AppContext';
import Login from './components/Login';
import LoginPage from './pages/LoginPage';
import LogoutPage from './pages/LogoutPage';
import MapPage from './pages/MapPage';
import CoordinateListPage from './pages/CoordinateListPage';

setupIonicReact();

const App: React.FC = () => {

  let [renderMenu, setRenderMenu] = useState(false);

  let [user, setUser] = useState('anonimo');

  const [cookies] = useCookies(['token', 'username']);

  const logged = async () => {
    const islog = await isLoggedIn();
    setRenderMenu(islog);
  }

  useEffect(() => {
    if (cookies.token) {
      setGoogleJwtToken(cookies.token)
    }

    if (cookies.username) {
      setUser(cookies.username)
    }
    logged();
  }, []);

  return (
    <IonApp>
      <AppProvider>
        <IonReactRouter>
          <IonSplitPane contentId="main">
            {renderMenu ? <Menu user={user} /> : <Login />}
            <IonRouterOutlet id="main">
              <Route path="/Login" exact={true}>
                <LoginPage />
              </Route>
              <Route path="/Logout" exact={true}>
                <LogoutPage />
              </Route>
              <Route path="/Map" exact={true}>
                <MapPage />
              </Route>
              <Route path="/CoordinateList" exact={true}>
                <CoordinateListPage />
              </Route>
              <Route path="/" exact={true}>
                <Redirect to="/folder/Inbox" />
              </Route>
              <Route path="/folder/:name" exact={true}>
                <Page />
              </Route>
            </IonRouterOutlet>
          </IonSplitPane>
        </IonReactRouter>
      </AppProvider>
    </IonApp>
  );
};

export default App;
