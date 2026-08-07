import axios from 'axios';

const axiosClient = axios.create({
    baseURL: 'http://localhost:8080/api', // La URL base de nuestro backend en Spring Boot
    headers: {
        'Content-Type': 'application/json',
    },
});

export default axiosClient;