import { useEffect, useState } from "react";
import useAxiosPrivate from "@/app/hooks/useAxiosPrivate";
import { FaExclamationCircle } from "react-icons/fa";
import GroupFormation from "@/app/ui/dashboard/event/GroupFormation";
import TeamFormation from "./TeamFormation";
import useAuth from "@/app/hooks/useAuth";

export default function ParticipationFormation({
  eventID,
  playerNumber,
  sportCategory,
  isPastEvent,
}) {
  const [participantData, setParticipantData] = useState([]);
  const [errorMessage, setErrorMessage] = useState(null);
  const api = useAxiosPrivate();
  const { userId } = useAuth();

  async function addParticipant(team, spot) {
    try {
      const { data: addedUser } = await api.post(
        "/eventParticipation/addParticipation",
        {
          eventID: eventID,
          team: team,
          spot: spot,
        }
      );
      setParticipantData((prevData) => {
        const participantExists = prevData.findIndex(
          (participant) => participant.userID === addedUser.userID
        );

        if (participantExists !== -1) {
          return prevData.map((participant, index) =>
            index === participantExists ? addedUser : participant
          );
        } else {
          return [...prevData, addedUser];
        }
      });
      setErrorMessage(null);
    } catch (err) {
      if (err.response?.data?.message) {
        setErrorMessage(err.response.data.message);
      } else {
        setErrorMessage("An unexpected error occurred.");
      }
      return;
    }
  }

  async function removeParticipant() {
    try {
      const { data: userID } = await api.delete(
        `/eventParticipation/removeParticipation/${eventID}`
      );
      setParticipantData((prevData) =>
        prevData.filter((participant) => participant.userID !== userID)
      );

      setErrorMessage(null);
    } catch (err) {
      if (err.response?.data?.message) {
        setErrorMessage(err.response.data.message);
      } else {
        setErrorMessage("An unexpected error occurred.");
      }
      return;
    }
  }

  useEffect(() => {
    async function getParticipationData() {
      const data = await api.get("/eventParticipation/getEventParticipation", {
        params: {
          eventID: eventID,
        },
      });
      const participantData = data.data;
      setParticipantData(participantData);
    }

    getParticipationData();
  }, [eventID, api]);

  const isUserParticipant = participantData.some(
    (participant) => participant.userID === userId
  );

  return (
    <>
      <div className="flex justify-center items-center">
        {isPastEvent ? (
          <h1 className="bg-gray-500 px-3 py-1.5 text-lg font-semibold text-white">
            Past Event
          </h1>
        ) : isUserParticipant ? (
          <button className="bg-red-500 px-3 py-1.5 text-lg font-semibold text-white cursor-pointer" onClick={removeParticipant}>
            Leave Event
          </button>
        ) : (
          <h1 className="bg-blue-500 px-3 py-1.5 text-lg font-semibold text-white">
            Pick a Spot
          </h1>
        )}
      </div>
      <div
        className={`mt-2 ${
          sportCategory === "Group Sports" ? "h-full overflow-y-auto" : ""
        }`}
      >
        <div className="m-2 flex items-center space-x-1">
          {errorMessage && (
            <>
              <FaExclamationCircle className="text-red-500 min-h-4 min-w-4" />
              <p className="text-xs text-red-500">{errorMessage}</p>
            </>
          )}
        </div>
        {sportCategory === "Group Sports" ? (
          <GroupFormation
            participants={participantData}
            addParticipant={addParticipant}
            playerNumber={playerNumber}
            isPastEvent={isPastEvent}
          />
        ) : (
          <TeamFormation
            participants={participantData}
            addParticipant={addParticipant}
            playerNumber={playerNumber}
            isPastEvent={isPastEvent}
          />
        )}
      </div>
    </>
  );
}
