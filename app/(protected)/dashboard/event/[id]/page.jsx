"use client";

import {
  ClockIcon
} from "@heroicons/react/24/outline";
import{
  CalendarIcon,
  UserIcon,
  MapPinIcon,
}from "@heroicons/react/24/solid";
import Image from 'next/image'
import sports from "@/public/sports.svg"
import LocationMap from "@/app/ui/dashboard/LocationMap";
import { createTeam, parseIncomingEvent } from "@/app/utils/utils";
import { useEffect, useState } from "react";
import useAxiosPrivate from "@/app/hooks/useAxiosPrivate";
import { use } from 'react';



// const event = {
//   title: "6v6 Football Match",
//   description:
//     "Lorem, ipsum dolor sit amet consectetur adipisicing elit. Beatae necessitatibus repudiandae commodi praesentium maxime voluptatem obcaecati pariatur excepturi accusamus, cum illo temporibus optio alias odit eum cupiditate magnam tempore nobis ipsa mollitia numquam sequi omnis. Enim, perspiciatis nobis? Fugiat numquam ipsam animi, a quisquam quam, debitis minima illo unde repellendus harum repudiandae autem corporis consectetur in quia aliquid. Ipsam impedit voluptate nostrum ipsum, reiciendis provident rem? Quam magni labore voluptates minima libero voluptatum culpa expedita illum in ab a eveniet corrupti esse, at qui optio sequi dolores, accusantium numquam nisi quibusdam modi! Dolorum excepturi culpa, ad tempora aspernatur quasi exercitationem, cupiditate aliquam modi quibusdam reiciendis quae vitae repudiandae! Consequatur, perspiciatis doloremque excepturi natus repudiandae recusandae? Iste, numquam velit non cupiditate, quibusdam dolore in tempore harum debitis, doloremque fugiat nulla id consequatur asperiores. Obcaecati porro voluptatum tenetur tempora vitae voluptates. Porro recusandae, labore error quo dicta doloremque cupiditate sit eligendi reiciendis tenetur alias sunt facere quas aspernatur aliquid veritatis saepe distinctio. Fugiat consequuntur recusandae eaque nihil. Nostrum, animi reiciendis! Sed molestiae cumque dolorum officia id, dolorem incidunt impedit aliquid accusamus eius a itaque reprehenderit repellendus tempora repudiandae ab praesentium voluptatibus dolores veritatis voluptas recusandae deleniti inventore. Sed vitae pariatur atque ipsam?",
//   startsAt: "2025-03-28T05:00:00",
//   teamNumber: 2,
//   playerNumber: 11,
//   location: {
//     name: "Pickleball Social",
//     latitude: 29.7869485,
//     longitude: -95.54917019999999,
//   },
//   sport: {
//     name: "Squash",
//     category: "Individual Sports",
//   },
//   createdBy: "Ammar Yildirim",
// };

const participants = [
  { playerName: "John Smith",
    team: "1",
    pos: "1"
  },
  { playerName: "Hailey Johsons",
    team: "1",
    pos: "3"
  },
  { playerName: "Adam Pecker",
    team: "2",
    pos: "3"
  },
  { playerName: "Natasha Loly",
    team: "1",
    pos: "4",
  },
  { playerName: "John Smith",
    team: "1",
    pos: "6"
  },
  { playerName: "John Smith",
    team: "2",
    pos: "1"
  },
]

export default function EventPage({ params }) {
  const [loading, setLoading] = useState(true);
  const [parsedEvent, setParsedEvent] = useState(null);
  const [team1, setTeam1] = useState([]);
  const [team2, setTeam2] = useState([]);
  const api = useAxiosPrivate();
  const id = use(params).id;

  useEffect(() => {
    async function get(){
        const data = await api.get("/events/getByID", {
          params: {
            id: id
          }
        })
        console.log(data);
        const fetchedEvent = data.data;
        setParsedEvent(parseIncomingEvent(fetchedEvent))
        setTeam1(createTeam(participants, fetchedEvent.playerNumber, 1));
        setTeam2(createTeam(participants, fetchedEvent.playerNumber, 2));
        setLoading(false);
    }

    get()
  },[])

  if(loading){
    return <div>Loading...</div>
  }

  return (
    <div className="md:p-6 px-6 w-full max-h-screen text-sm">
      <div className="md:h-1/12 my-2.5 text-3xl font-semibold text-gray-900">
        {parsedEvent.title}
      </div>
      <div className="md:h-11/12 md:grid md:grid-cols-3 md:space-x-5 md:overflow-y-auto w-full pb-3 pt-1 text-gray-500">
        <div className="shadow-sm border border-gray-100  h-fit">
          <h3 className="p-2 bg-gray-50 font-semibold text-gray-900">
            When and Where
          </h3>
          <div className="p-3 flex items-center space-x-1  border-b border-b-gray-200">
            <CalendarIcon className="w-8" />
            <p>{parsedEvent.date}</p>
          </div>
          <div className="p-3 flex items-center space-x-1 text-gray-500 border-b border-b-gray-200">
            <ClockIcon className="w-8" />
            <p>{parsedEvent.time}</p>
          </div>
          <div className="p-3 flex items-center space-x-1 text-gray-500 border-b border-b-gray-200">
            <MapPinIcon className="w-8" />
            <p>{parsedEvent.locationDTO.name}</p>
          </div>
          <div className="w-full h-80 md:h-64">
            <LocationMap
              coordinates={{
                lat: parsedEvent.locationDTO.latitude,
                lng: parsedEvent.locationDTO.longitude,
              }}
              zoom={16}
            />
          </div>
        </div>
        <div className="p-2 shadow-sm border border-gray-100  h-fit ">
          <div className="flex justify-center items-center">
            <button className="bg-blue-500 px-4 py-2 text-lg font-semibold text-white cursor-pointer active:bg-blue-500 hover:bg-blue-600">
              Join us
            </button>
          </div>
          <div className="mt-2 flex justify-center space-x-3">
            <div className="w-1/2">
              <h3 className="w-full text-right font-semibold text-gray-900 text-base">
                Team 1
              </h3>
                {team1}
            </div>
            <div className="w-1/2 text-left">
              <h3 className="w-full font-semibold text-gray-900 text-base">
                Team 2
              </h3>
              {team2}
            </div>
          </div>
        </div>
        <div className="shadow-sm border border-gray-100 h-fit">
          <div className="p-5 flex items-center space-x-1 text-gray-500 ">
            <Image src={sports} alt="Sports icon" className="w-10" />
            <div>
              <p className="text-gray-700 font-semibold">{parsedEvent.sport.name}</p>
              <p className="text-sm">{parsedEvent.sport.category}</p>
            </div>
          </div>
          <div className="p-5 flex items-center space-x-1 text-gray-500 bg-gray-100">
            <UserIcon className="w-10" />
            <div>
              <p className="text-gray-700 font-semibold">{parsedEvent.createdBy}</p>
              <p className="text-sm">Game Organizer</p>
            </div>
          </div>
          <div className="p-3">
            <h2 className="text-xl mb-2">Description</h2>
            <p className="overflow-y-auto">{parsedEvent.description}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
