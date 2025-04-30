import useAuth from '@/app/hooks/useAuth';
import { authApi, axiosPrivate} from '@/app/axiosConfig';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';


const useAxiosPrivate = () => {
    const router = useRouter()
    const {token, setToken} = useAuth();

    useEffect( () => {
        const requestInterceptor = axiosPrivate.interceptors.request.use(
            config => {
                config.headers.Authorization = 
                    !config._retry && token 
                    ? `Bearer ${token}`
                    : config.headers.Authorization;
                return config;
            }, (error) => {
                Promise.reject(error)
            }
        )

        const responseInterceptor = axiosPrivate.interceptors.response.use(
            response => response,
            async (error) => {
                const originalRequest = error.config;
                
                if(error.response.status === 401){
                    try{
                        const newAccessToken = await authApi.get('/refresh');
                        setToken(newAccessToken.data.token);
                        originalRequest.headers['Authorization'] = `Bearer ${newAccessToken.data.token}`
                        originalRequest._retry = true
                        
                        return axiosPrivate(originalRequest)
                    } catch (err){
                        setToken(null)
                        router.push('/auth/login')
                    }
                }

                return Promise.reject(error)
            }
        )

        return () => {
            axiosPrivate.interceptors.request.eject(requestInterceptor);
            axiosPrivate.interceptors.response.eject(responseInterceptor);
        }
    }, [token])

    return axiosPrivate;
}

export default useAxiosPrivate