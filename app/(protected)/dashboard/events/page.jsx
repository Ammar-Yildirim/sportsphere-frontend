"use client";
import { DataGrid } from "@mui/x-data-grid";
import useAxiosPrivate from '@/app/hooks/useAxiosPrivate';
import {useState, useEffect} from 'react';
import {useRouter} from 'next/navigation';
import { getSportIcon } from "@/app/utils/utils";
import dayjs from "dayjs";
import sports from "@/public/sports1.svg";
import Image from "next/image";


export default function Dashboard() {
  const api = useAxiosPrivate();
  const [rows, setRows] = useState();
  const router = useRouter();

  const columns = [
      {
        field: "sport",
        headerName: "Sport",
        flex: 1,
        resizable: false,
        headerClassName: 'bg-gray-200',
        valueGetter: (value, row) => row.sport.name,
        renderCell: (params) => (
          <div className="flex items-center gap-2">
            <p className="text-xl text-blue-600">{getSportIcon(params.value)}</p>
            <p className="text-gray-700">{params.value}</p>
          </div>
        ),
        renderHeader: (params) => (
          <div className="flex items-center gap-2">
            <Image src={sports} alt="Sports icon" className="w-8" />
            <p>Sports</p>
          </div>
        ),
      },
      {
        field: "startDate",
        headerClassName: 'bg-gray-200',
        valueGetter: (value, row) => dayjs(row.startsAt).format("DD MMM"),
        headerName: "Date",
        headerClassName: 'bg-gray-200',
        flex: 0.5,
        resizable: false,
      },
      {
        field: "startTime",
        headerClassName: 'bg-gray-200',
        valueGetter: (value, row) => dayjs(row.startsAt).format("HH:mm"),
        headerName: "Time",
        flex: 0.5,
        resizable: false,
      },
      { field: "title", headerName: "Title", flex: 2, resizable: false, headerClassName: 'bg-gray-200' },
      {
        field: "Spots",
        headerClassName: 'bg-gray-200',
        valueGetter: (value, row) => {
          return row.playerNumber * row.teamNumber;
        },
        renderCell: (params) => {
          return (
            <div className="flex justify-between items-center h-full">
              <span className="w-12 h-6 flex justify-center items-center bg-blue-500 rounded-full text-white font-medium">
                <strong>2/{params.value}</strong>
              </span>
              <button
                className="px-3.5 py-1.5 bg-blue-500 text-white rounded-md  hover:bg-blue-600 active:bg-blue-500 text-sm font-semibold cursor-pointer"
                tabIndex={params.hasFocus ? 0 : -1}
                onClick={() => router.push(`event/${params.id}`)}
              >
                OPEN
              </button>
            </div>
          );
        },
        headerName: "Spots",
        flex: 0.5,
        minWidth: 160,
        resizable: false,
      }
    ];

  useEffect(() => {
    async function getData(){
      const data = await api.get("/events/getAll");
      console.log(data);
      setRows(data.data);
    }
    getData();
  }, [])

  return (
    <div className="p-5 w-full">
      <div style={{ height: 500, width: "100%" }}>
        <DataGrid rows={rows} columns={columns} columnHeaderHeight={40} />
      </div>
    </div>
  );
}
