import { Capacitor } from '@capacitor/core';
import { Observable, from, of } from 'rxjs';
import { Geolocation, Position } from '@capacitor/geolocation';


export const getRoamingPosition = (): Observable<any> => {
  if (!Capacitor.isNativePlatform()) {
    return from(getRoamingNavigatorPosition());
  } else {
    return getRoamingNativePosition();
  }
}


const getRoamingNativePosition = (): Observable<any> => {
  return from(watchCurrentPositionNative());
}


export const getCurrentStaticPosition = (): Observable<any> => {

  if (!Capacitor.isNativePlatform()) {
    return from(getStaticPositionFromNavigator());
  } else {
    return from(staticPositionNative());
  }
}

const staticPositionNative = async () => {
  return await Geolocation.getCurrentPosition();
};

const getStaticPositionFromNavigator = () => {
  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(resolve, reject);
  });
}

const getRoamingNavigatorPosition = () => {
  return new Promise((res, rej) => {
    navigator.geolocation.watchPosition(res, rej);
  });
}

export const watchCurrentPositionNative2 = async () => {
  return await Geolocation.watchPosition({}, (position: Position) => {
    console.log(position.coords.latitude);
    console.log(position.coords.longitude);
    console.log(position.coords.speed);
    console.log(position.coords.altitude);
    console.log(position.timestamp);
  });

}

const watchCurrentPositionNative = () => {
  return new Promise((res, rej) => {
    Geolocation.watchPosition({}, res);
  });
}

export const checkPermissions = (): Observable<any> => {

  if (Capacitor.isNativePlatform()) {
    return from(Geolocation.checkPermissions());
  } else {
    return of('web');
  }

}
