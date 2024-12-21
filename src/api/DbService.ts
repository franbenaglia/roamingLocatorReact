import { Coordinate } from '../model/Coordinate';
import axios from "axios";

const urlresourceserver: string = import.meta.env.VITE_URL_RESOURCE_SERVER;


export const getAll = async () => {
    try {

        return await axios.get<Coordinate[]>(urlresourceserver + 'all');

    } catch (error) {
        console.error('Error creating data:', error);
        return error;
    }
};

export const deleteAll = async () => {
    try {

        return await axios.delete(urlresourceserver + 'deleteAll');

    } catch (error) {
        console.error('Error creating data:', error);
        return error;
    }
};

export const getByUser = async (user: string) => {
    try {

        return await axios.get<Coordinate>(urlresourceserver + 'byuser/' + user);

    } catch (error) {
        console.error('Error creating data:', error);
        return error;
    }
};
