import { DataGrid } from "@mui/x-data-grid";
import { getGridDateOperators } from "@mui/x-data-grid";
import sports from "@/public/sports1.svg";
import Image from "next/image";
import { getSportIcon } from "@/app/utils/utils";
import dayjs from "dayjs";
import { useRouter } from "next/navigation";

export default function EventGrid({
  rows,
  eventToParticipationCount,
  loading,
}) {
  const router = useRouter();

  const columns = [
    {
      field: "sport",
      headerName: "Sport",
      flex: 1,
      minWidth: 100,
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
      field: "Spots",
      valueGetter: (value, row) => {
        return row.sport.category === "Group Sports"
          ? row.playerNumber
          : row.playerNumber * row.teamNumber;
      },
      renderCell: (params) => {
        return (
          <div className="flex justify-between items-center h-full">
            {eventToParticipationCount && (
              <span className="w-12 h-6 flex justify-center items-center text-blue-500 rounded-full border-2 border-blue-500 font-bold">
                <strong>
                  {eventToParticipationCount[params.id] ?? 0}/{params.value}
                </strong>
              </span>
            )}

            <button
              className="px-3.5 py-1.5 bg-blue-500 text-white rounded-md  hover:bg-blue-600 active:bg-blue-500 text-sm font-semibold cursor-pointer"
              tabIndex={params.hasFocus ? 0 : -1}
              onClick={() => router.push(`dashboard/event/${params.id}`)}
            >
              OPEN
            </button>
          </div>
        );
      },
      headerName: "Spots",
      flex: eventToParticipationCount ? 1 : 0.5,
      minWidth: 100,
      resizable: false,
      sortable: false,
      filterable: false,
    },
  ];

  return (
    <div className="p-2 pt-0 h-[300px]">
      <DataGrid
        rows={rows}
        columns={columns}
        columnHeaderHeight={40}
        loading={loading}
        sx={{
          "& .MuiDataGrid-columnHeaderTitle": {
            fontWeight: "600",
          },
          "& .MuiDataGrid-columnHeader": {
            fontWeight: "600",
            backgroundColor: "#E5E7EB",
          },
          "& .MuiDataGrid-scrollbarFiller": {
            backgroundColor: "#E5E7EB",
          },
          height: "100%",
          width: "100%",
        }}
        hideFooter
      />
    </div>
  );
}
