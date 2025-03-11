'use client';

import LocationMap from "@/app/ui/dashboard/LocationMap"
import useAxiosPrivate from "@/app/hooks/useAxiosPrivate"
import { useEffect } from "react";

export default function Dashboard(){
    const api = useAxiosPrivate();
    
    useEffect(() =>{
        async function getAll(){
            const data = await api.get("/events/getAll");

            console.log(data);
        }

        getAll();
    },[])

    return (
        <div className="w-64 h-64">
            <LocationMap coordinates={{ lat: 40.8128, lng: -74.0060 }}/>
        </div> 
    )
}