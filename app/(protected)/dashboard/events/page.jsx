'use client'

import Link from 'next/link'
import useAxiosPrivate from '@/app/hooks/useAxiosPrivate'
import { useEffect, useState } from 'react';

export default function Dashboard(){
    const axiosPrivate = useAxiosPrivate();
    const [data, setData] = useState()
    
    useEffect(() =>{
        const getUsers = async () =>{
            try{
                const response = await axiosPrivate.get("/demo-controller")
                setData(response.data)
            }catch(err){
                console.error("ERROR FETCHING DATA"+err)
            }
        }

        getUsers()
    }, [])

    return (
        <div>Dashboard
            <div>
                {data ? data : null}
            </div>
        </div> 
    )
}