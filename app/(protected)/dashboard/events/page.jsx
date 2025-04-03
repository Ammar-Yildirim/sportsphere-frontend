"use client";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import useAxiosPrivate from "@/app/hooks/useAxiosPrivate";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getSportIcon } from "@/app/utils/utils";
import dayjs from "dayjs";
import sports from "@/public/sports1.svg";
import Image from "next/image";
import { getGridDateOperators } from "@mui/x-data-grid";

export default function Dashboard() {
  const api = useAxiosPrivate();
  const [rows, setRows] = useState([]);
  const [eventToParticipationCount, setEventToParticipationCount] = useState({});
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  const columns = [
    {
      field: "sport",
      headerName: "Sport",
      flex: 1,
      minWidth: 130,
      resizable: false,
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
          <p className="font-bold">Sports</p>
        </div>
      ),
    },
    {
      field: "startDate",
      type: "dateTime",
      minWidth: 70,
      valueGetter: (value, row) => new Date(row.startsAt),
      valueFormatter: (value) => dayjs(value).format("DD MMM"),
      headerName: "Date",
      flex: 0.5,
      resizable: false,
      filterOperators: getGridDateOperators().filter((operator) =>
        ["is", "after", "before"].includes(operator.value)
      ),
    },
    {
      field: "startTime",
      valueGetter: (value, row) => dayjs(row.startsAt).format("HH:mm"),
      headerName: "Time",
      flex: 0.5,
      minWidth: 70,
      resizable: false,
    },
    {
      field: "title",
      headerName: "Title",
      flex: 2,
      minWidth: 150,
      resizable: false,
    },
    {
      field: "Spots",
      valueGetter: (value, row) => {
        return row.sport.category === "Group Sports" ? row.playerNumber : row.playerNumber * row.teamNumber;
      },
      renderCell: (params) => {
        return (
          <div className="flex space-x-3 items-center h-full">
            <span className="min-w-10 h-6 flex justify-center items-center text-blue-500 rounded-full border-2 border-blue-500 font-bold">
              <strong>{eventToParticipationCount[params.id] ?? 0}/{params.value}</strong>
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
      sortable: false,
      filterable: false,
    },
  ];

  const getCurrentLocation = () => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        return reject(new Error("Geolocation is not supported by this browser."));
      }
      navigator.geolocation.getCurrentPosition(resolve, reject);
    });
  };

  useEffect(() => {
    async function getData() {
      try {
        const position = await getCurrentLocation().catch((error) => {
          console.warn("Geolocation failed/denied:", error);
          return null; 
        });
  
        const params = position
          ? { refLat: position.coords.latitude, refLon: position.coords.longitude }
          : {};
        const { data : events } = await api.get("/events/upcoming", { params });

        const eventIDs = events.map(x => x.id);
        const {data : participationCounts} = await api.post("/eventParticipation/getParticipationCounts", eventIDs);
  
        setRows(events);
        setEventToParticipationCount(participationCounts);          
      } catch (error) {
        console.error("Error fetching data:", error);
      }finally{
        setLoading(false);
      }
    }
  
    getData();
  }, []);

  return (
    <div className="md:p-7 p-4 w-full">
      <h1 className="text-3xl font-bold mb-3 h-1/12">Find a game</h1>
      <div className="h-11/12">
        <div style={{ height: "99%", width: "99%" }}>
          <DataGrid
            loading={loading}
            rows={rows}
            columns={columns}
            columnHeaderHeight={40}
            sx={{
              "& .MuiDataGrid-columnHeaderTitle": {
                fontWeight: "600", 
              },
              '& .MuiDataGrid-toolbarContainer': {
                backgroundColor: '#E5E7EB', 
              },
            }}
            slots={{ toolbar: GridToolbar }}
            slotProps={{
              toolbar: {
                csvOptions: { disableToolbarButton: true }, 
                printOptions: { disableToolbarButton: true },
              },
            }}
          />
        </div>
      </div>
    </div>
  );
}
