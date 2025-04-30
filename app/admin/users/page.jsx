'use client';

import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import useAxiosAdminPrivate from '@/app/hooks/useAxiosAdminPrivate';
import { useState, useEffect } from 'react';
import dayjs from "dayjs";
import { FaUser } from "react-icons/fa";

export default function AdminUsersPage() {
  const api = useAxiosAdminPrivate();
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const handleDelete = async (userId) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        await api.delete(`/admin/users/${userId}`);
        setRows(rows.filter(row => row.id !== userId));
      } catch (err) {
        console.error("Error deleting user:", err);
      }
    }
  };

  const columns = [
    {
      field: "fullName",
      headerName: "User Name",
      flex: 1,
      minWidth: 200,
      resizable: false,
      valueGetter: (value, row) => {
        if (row) {
          return `${row.firstname || ''} ${row.lastname || ''}`;
        }
        return '';
      },
      renderHeader: (params) => (
        <div className="flex items-center gap-2">
          <FaUser className="w-8" />
          <p className="font-bold">Full Name</p>
        </div>
      ),
      renderCell: (params) => (
        <div className="flex items-center gap-2">
          <FaUser className="text-gray-600" />
          <span>{params.value}</span>
        </div>
      ),
    },
    {
      field: "email",
      headerName: "Email",
      flex: 2,
      minWidth: 200,
      resizable: false,
    },
    {
      field: "createdAt",
      type: "dateTime",
      minWidth: 120,
      valueGetter: (value, row) => new Date(row.createdAt),
      valueFormatter: (value) => dayjs(value).format("DD MMM YYYY"),
      headerName: "Joined Date",
      flex: 1,
      resizable: false,
    },
    {
      field: "role",
      headerName: "Role",
      flex: 1,
      minWidth: 100,
      resizable: false,
    },
    {
      field: "actions",
      headerName: "Actions",
      flex: 0.7,
      minWidth: 100,
      resizable: false,
      sortable: false,
      filterable: false,
      renderCell: (params) => (
        <button
          className="px-3.5 py-1.5 bg-red-500 text-white rounded-md hover:bg-red-600 active:bg-red-500 text-sm font-semibold cursor-pointer"
          tabIndex={params.hasFocus ? 0 : -1}
          onClick={() => handleDelete(params.id)}
        >
          DELETE
        </button>
      )
    },
  ];

  useEffect(() => {
    const getUsers = async () => {
      try {
        const response = await api.get('/admin/users');
        setRows(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to load users');
        setLoading(false);
      }
    };

    getUsers();
  }, []);

  if (error) return <div className="p-6 text-red-500">{error}</div>;

  return (
    <div className="md:p-7 p-4 w-full">
      <h1 className="text-3xl font-bold mb-3 h-1/12">Manage Users</h1>
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