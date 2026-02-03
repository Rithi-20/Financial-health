import axios from 'axios';

const api = axios.create({
    baseURL: '/api', // Proxied to FastAPI Backend
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add a request interceptor
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export const uploadFile = async (file, type) => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await api.post(`/upload?type=${type}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
};

export const fetchMetrics = async () => {
    const response = await api.get('/dashboard/metrics');
    return response.data;
};

export const connectBank = async (bankName) => {
    const response = await api.post('/bank/connect', { bank_name: bankName });
    return response.data;
};

export const downloadReport = async () => {
    try {
        const response = await api.get('/report/download', {
            responseType: 'blob',
            headers: {
                'Accept': 'application/pdf'
            }
        });
        const blob = new Blob([response.data], { type: 'application/pdf' });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'Financial_Report.pdf');
        document.body.appendChild(link);
        link.click();

        // Cleanup
        setTimeout(() => {
            window.URL.revokeObjectURL(url);
            link.remove();
        }, 100);
    } catch (err) {
        console.error("Download error:", err);
        throw err;
    }
};

export const fetchNotifications = async () => {
    const response = await api.get('/notifications');
    return response.data;
};

// Auth
export const login = async (email, password) => {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
};

export const signup = async (data) => {
    const response = await api.post('/auth/signup', data);
    return response.data;
};

export default api;
