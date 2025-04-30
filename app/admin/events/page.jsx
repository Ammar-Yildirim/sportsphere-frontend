"use client";

import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import useAxiosAdminPrivate from "@/app/hooks/useAxiosAdminPrivate";
import { useState, useEffect } from "react";
import { getSportIcon } from "@/app/utils/utils";
import dayjs from "dayjs";
import sports from "@/public/sports1.svg";
import Image from "next/image";
import { getGridDateOperators } from "@mui/x-data-grid";

export default function AdminEventsPage() {
  const api = useAxiosAdminPrivate();
  const [rows, setRows] = useState([]);
  const [eventToParticipationCount, setEventToParticipationCount] = useState(
    {}
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const handleDelete = async (eventId) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        await api.delete(`/admin/events/${eventId}`);
        setRows(rows.filter((row) => row.id !== eventId));
      } catch (err) {
        console.error("Error deleting event:", err);
      }
    }
  };

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
      field: "createdAt",
      type: "dateTime",
      minWidth: 150,
      valueGetter: (value, row) => new Date(row.createdAt),
      valueFormatter: (value) => dayjs(value).format("DD MMM, YYYY HH:mm"),
      headerName: "Created At",
      flex: 0.5,
      resizable: false,
      filterOperators: getGridDateOperators().filter((operator) =>
        ["is", "after", "before"].includes(operator.value)
      ),
    },
    {
      field: "startDate",
      type: "dateTime",
      minWidth: 150,
      valueGetter: (value, row) => new Date(row.startsAt),
      valueFormatter: (value) => dayjs(value).format("DD MMM, YYYY HH:mm"),
      headerName: "Start Date",
      flex: 0.5,
      resizable: false,
      filterOperators: getGridDateOperators().filter((operator) =>
        ["is", "after", "before"].includes(operator.value)
      ),
    },
    {
      field: "title",
      headerName: "Title",
      flex: 2,
      minWidth: 150,
      resizable: false,
      sortable: false,
    },
    {
      field: "Spots",
      valueGetter: (value, row) => {
        return row.sport.category === "Group Sports"
          ? row.playerNumber
          : row.playerNumber * row.teamNumber;
      },
      renderCell: (params) => {
        return (
          <div className="flex space-x-3 items-center h-full">
            <span className="min-w-10 h-6 flex justify-center items-center text-gray-500 rounded-full border-2 border-gray-500 font-bold">
              <strong>
                {eventToParticipationCount[params.id] ?? 0}/{params.value}
              </strong>
            </span>
            <button
              className="px-3.5 py-1.5 bg-red-500 text-white rounded-md hover:bg-red-600 active:bg-red-500 text-sm font-semibold cursor-pointer"
              tabIndex={params.hasFocus ? 0 : -1}
              onClick={() => handleDelete(params.id)}
            >
              DELETE
            </button>
          </div>
        );
      },
      headerName: "Participation",
      flex: 0.5,
      minWidth: 160,
      resizable: false,
      sortable: false,
      filterable: false,
    },
  ];

  useEffect(() => {
    async function fetchEvents() {
      try {
        const { data: events } = await api.get("/admin/events");
        console.log("Events data:", events);

        if (!events || !Array.isArray(events)) {
          console.error("Invalid events data format:", events);
          setError("Invalid data format received from API");
          setLoading(false);
          return;
        }

        const eventIDs = events.map((x) => x.id);
        try {
          const { data: participationCounts } = await api.post(
            "/eventParticipation/getParticipationCounts",
            eventIDs
          );
          setEventToParticipationCount(participationCounts);
        } catch (err) {
          console.warn("Could not fetch participation counts:", err);
        }

        setRows(events);
      } catch (error) {
        console.error("Error fetching events:", error);
        setError("Failed to load events");
      } finally {
        setLoading(false);
      }
    }

    fetchEvents();
  }, []);

  if (error) return <div className="p-6 text-red-500">{error}</div>;

  if (!loading && rows.length === 0) {
    return <div className="p-6">No events found.</div>;
  }

  return (
    <div className="md:p-7 p-4 w-full">
      <h1 className="text-3xl font-bold mb-3 h-1/12">Manage Events</h1>
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
              "& .MuiDataGrid-toolbarContainer": {
                backgroundColor: "#E5E7EB",
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
