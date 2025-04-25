'use client'

import useAdminAuth from '@/app/hooks/useAdminAuth';
import { adminAuthApi, axiosAdminPrivate } from '@/app/axiosConfig';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

const useAxiosAdminPrivate = () => {
    const router = useRouter()
    const { adminToken, setAdminToken } = useAdminAuth();

    useEffect(() => {
        const requestInterceptor = axiosAdminPrivate.interceptors.request.use(
            config => {
                config.headers.Authorization = 
                    !config._retry && adminToken 
                    ? `Bearer ${adminToken}`
                    : config.headers.Authorization;
                return config;
            }, (error) => {
                Promise.reject(error)
            }
        )

        const responseInterceptor = axiosAdminPrivate.interceptors.response.use(
            response => response,
            async (error) => {
                const originalRequest = error.config;
                
                if(error.response.status === 401){
                    try{
                        const newAccessToken = await adminAuthApi.get('/refresh');
                        setAdminToken(newAccessToken.data.token);
                        originalRequest.headers['Authorization'] = `Bearer ${newAccessToken.data.token}`
                        originalRequest._retry = true
                        
                        return axiosAdminPrivate(originalRequest)
                    } catch (err){
                        setAdminToken(null)
                        router.push('/admin/login')
                    }
                }

                return Promise.reject(error)
            }
        )

        return () => {
            axiosAdminPrivate.interceptors.request.eject(requestInterceptor);
            axiosAdminPrivate.interceptors.response.eject(responseInterceptor);
        }
    }, [adminToken])

    return axiosAdminPrivate;
}

export default useAxiosAdminPrivate;