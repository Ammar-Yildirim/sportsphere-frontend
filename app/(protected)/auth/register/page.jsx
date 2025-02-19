'use client'

import useAuth from '@/app/hooks/useAuth';
import {authApi} from '@/app/axiosConfig'
import {useRouter} from 'next/navigation'

export default function RegistrationPage(){
    const {setToken} = useAuth()
    const router = useRouter()

    async function handleRegistration(formData) {
        try{
            const response = await authApi.post('/register', {
                email : formData.get('email'),
                firstName : formData.get('firstName'),
                lastName : formData.get('lastName'),
                password : formData.get('password')
            })

            setToken(response.data.token)
            router.push('/dashboard')
        }catch(err){
            console.error("Error status: ", err.message)
       } 
    }

    return (
        <form action={handleRegistration}>
            <br />
            <div>
                <label htmlFor="firstName">firstName: </label>
                <input name="firstName"></input>
            </div>

            <br />
            <div>
                <label htmlFor="lastName">lastName: </label>
                <input name="lastName"></input>
            </div>

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
            <button type='submit'>Register</button>
        </form>
    )
}