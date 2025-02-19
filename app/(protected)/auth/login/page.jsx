'use client'

import useAuth from '@/app/hooks/useAuth';
import {authApi} from '@/app/axiosConfig'
import {useRouter} from 'next/navigation'


export default function LoginPage(){
    const {token, setToken} = useAuth()
    const router = useRouter()

    async function handleLogin(formData) {
        try {
            const response = await authApi.post('/authenticate', {
                email: formData.get('email'),
                password: formData.get('password')
            });

            setToken(response.data.token);
            console.log("LOGIN TOKEN" + response.data.token)
            router.push('/dashboard');
        } catch (err) {
            console.error("Error status: ", err.message);
        }
    }

    return (
        <form action={handleLogin}>
            <br />
            <div>
                <label htmlFor="email">email: </label>
                <input name="email" type='email'></input>
            </div>

            <br />
            <div>
                <label htmlFor="password">password: </label>
                <input name="password" type='password'></input>
            </div>

            <br />
            <button type='submit'>Login</button>
        </form>
    )
}