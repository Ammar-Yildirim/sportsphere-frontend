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
  const router = useRouter();

  const columns = [
    {
      field: "sport",
      headerName: "Sport",
      flex: 1,
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
      resizable: false,
    },
    {
      field: "title",
      headerName: "Title",
      flex: 2,
      resizable: false,
    },
    {
      field: "Spots",
      valueGetter: (value, row) => {
        return row.playerNumber * row.teamNumber;
      },
      renderCell: (params) => {
        return (
          <div className="flex justify-between items-center h-full">
            <span className="w-12 h-6 flex justify-center items-center text-blue-500 rounded-full border-2 border-blue-500 font-bold">
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
      sortable: false,
      filterable: false,
    },
  ];

  useEffect(() => {
    async function getData() {
      const data = await api.get("/events/getAll");
      console.log(data);
      setRows(data.data);
    }
    getData();
  }, []);

  return (
    <div className="p-7 w-full">
      <h1 className="text-3xl font-bold mb-3 h-1/12">Find a game</h1>
      <div className="h-11/12">
        <div style={{ height: "99%", width: "99%" }}>
          <DataGrid
            rows={rows}
            columns={columns}
            columnHeaderHeight={40}
            sx={{
              "& .MuiDataGrid-columnHeaderTitle": {
                fontWeight: "600", // Keep text styling separate
              },
              '& .MuiDataGrid-toolbarContainer': {
                backgroundColor: '#E5E7EB', // Match header background
              },
            }}
            slots={{ toolbar: GridToolbar }}
            slotProps={{
              toolbar: {
                csvOptions: { disableToolbarButton: true }, // Disable export
                printOptions: { disableToolbarButton: true }, // Disable print
              },
            }}
          />
        </div>
      </div>
    </div>
  );
}
