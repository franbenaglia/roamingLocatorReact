const URL_RESOURCE_SERVER = import.meta.env.VITE_URL_RESOURCE_SERVER;
import { Preferences } from '@capacitor/preferences';

export const logout = async () => {
    await removeGoogleJwtToken();
    removeGoogleJwtTokenCookie();
    removeJwtToken();
    location.href = "/";
}

export const removeGoogleJwtTokenCookie = () => {
    //const [removeCookie] = useCookies(['googleJwtToken']);
    //removeCookie.googleJwtToken;
    document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
}

export const removeGoogleJwtToken = async () => {
    return Preferences.remove({ key: 'googleJwtToken' });
};

export const removeJwtToken = async () => {
    return Preferences.remove({ key: 'jwtToken' });
};

export const isLoggedIn = async () => {

    const loggedGoogle = (await getGoogleJwtToken()).value;

    const logged = (await getJwtToken()).value;

    return (loggedGoogle && loggedGoogle.length > 0)
        || (logged && logged.length > 0);
}

export const getToken = async () => {

    return (await getGoogleJwtToken()).value || (await getJwtToken()).value;
};


export const getGoogleJwtToken = async () => {
    return await Preferences.get({ key: 'googleJwtToken' });
};

export const setGoogleJwtToken = async (flag: string) => {
    await Preferences.set({
        key: 'googleJwtToken',
        value: flag,
    });
};

export const getJwtToken = async () => {
    return await Preferences.get({ key: 'jwtToken' });
};

export const setJwtToken = async (token: string) => {
    await Preferences.set({
        key: 'jwtToken',
        value: token,
    });
};

export const googleOauth2Login = (): void => {
    window.open(URL_RESOURCE_SERVER + "/googleoauth2/google", "_self");
}

export const githubOauth2Login = (): void => {
    window.open(URL_RESOURCE_SERVER + "/googleoauth2/github", "_self");
}