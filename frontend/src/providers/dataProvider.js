import { create } from "@mui/material/styles/createTransitions";
import axios from "axios";

const apiUrl = process.env.REACT_APP_API_URL;

export default {
    getList: async (resource, params) => {
        try {
            const { page, perPage } = params.pagination;
            const response = await axios.get(`${apiUrl}/${resource}`, {
                params: { page, perPage },
                withCredentials: true,
            });

            const items = response.data.items;

            if (!Array.isArray(items)) {
                throw new Error('Data returned from API is not an array');
            }
            
            return {
                data: items.map(item  => ({ ...item , id: item._id })),
                total: response.data.total,
            };
        } catch (error) {
            throw new Error(error.response.data.message || error.message);
        }
    },
    create: async (resource, params) => {
        try {
            const { data } = params;
            const response = await axios.post(`${apiUrl}/${resource}`, data, {
                withCredentials: true,
            });
            
            console.log(response);

            return { data: { ...response.data, id: response.data._id } };
        } catch (error) {
            throw new Error(error.response.data.message || error.message);
        }
    },
    getOne: async (resource, params) => {
        try {
            const { id } = params;
            const response = await axios.get(`${apiUrl}/${resource}/${id}`, {
                withCredentials: true,
            });

            return { data: { ...response.data, id: response.data._id } };
        } catch (error) {
            throw new Error(error.response.data.message || error.message);
        }
    },
    update: async (resource, params) => {
        try {
            const { id, data } = params;
            const response = await axios.put(`${apiUrl}/${resource}/edit/${id}`, data, {
                withCredentials: true,
            });

            console.log(response);

            return { data: { ...response.data, id: response.data._id } };
        } catch (error) {
            throw new Error(error.response.data.message || error.message);
        }
    },
    delete: async (resource, params) => {
        try {
            const { id } = params;
            const response = await axios.delete(`${apiUrl}/${resource}/delete/${id}`, {
                withCredentials: true,
            });
            
            console.log(response);

            return { data: { id } };
        } catch (error) {
            throw new Error(error.response.data.message || error.message);
        }
    },
}