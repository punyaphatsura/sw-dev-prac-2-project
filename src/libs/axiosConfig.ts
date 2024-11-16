import axios from 'axios';

export const apiClient = axios.create({
    baseURL:
        process.env.NEXT_PUBLIC_API_ENDPOINT ||
        'https://temp1.jackpyp.xyz/api/v1',
    timeout: 80000,
    headers: {
        Authorization: 'Bearer ' + localStorage.getItem('token'),
    },
});
