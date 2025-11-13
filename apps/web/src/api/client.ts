import axios from 'axios';
import toast from 'react-hot-toast';

//redux
import { store } from '@/store/store';

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 요청 인터셉터
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error('Request error:', error);
    console.error('에러 상세:', error.response?.data);
    console.error('상태 코드:', error.response?.status);
    return Promise.reject(error);
  },
);

// 응답 인터셉터
apiClient.interceptors.response.use(
  (response) => {
    return response.data;
  },
  async (error) => {
    if (!error.response) {
      toast.error(
        '네트워크 오류가 발생했습니다. 서버가 실행 중인지 확인해주세요.',
      );
      return Promise.reject(error);
    }

    const { status, data } = error.response;
    const message = data?.message || '알 수 없는 오류가 발생했습니다';

    switch (status) {
      case 400:
        toast.error(`잘못된 요청입니다: ${status} : ${message}`);
        break;
      case 401:
        toast.error(`인증 오류: ${status} : ${message}`);
        if (!window.location.pathname.includes('/login')) {
          store.dispatch({ type: 'auth/clearCredentials' });
          window.location.href = '/login';
        }
        break;
      case 403:
        toast.error(`접근 권한이 없습니다: ${status} : ${message}`);
        break;
      case 404:
        toast.error(`요청한 리소스를 찾을 수 없습니다: ${message}`);
        break;
      case 500:
        toast.error(`서버 오류가 발생했습니다: ${status} : ${message}`);
        break;
      default:
        toast.error(`오류 발생 ${status} : ${message}`);
    }
    return Promise.reject(error);
  },
);

export default apiClient;
