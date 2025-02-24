'use client'

import Link from 'next/link'
import useAxiosPrivate from '@/app/hooks/useAxiosPrivate'
import { useEffect, useState } from 'react';
import {useRouter} from 'next/navigation';

export default function Dashboard(){
    const axiosPrivate = useAxiosPrivate();
    const [data, setData] = useState()
    const router = useRouter()

    useEffect(() =>{
        const getUsers = async () =>{
            try{
                const response = await axiosPrivate.get("/demo-controller")
                setData(response.data)
            }catch(err){
                if(!err.response){
                    console.log("Server outage");
                    router.push("/")
                }
                console.error("ERROR FETCHING DATA"+err)
            }
        }
        console.log("MAKING QUERY")
        getUsers()
        console.log("FINISHED QUERY")
    }, [])

    return (
        <div>Dashboard
            <Link href={'dashboard/events'}>Events</Link>
            <div>
                {data ? data : null}
            </div>
        </div> 
    )
}