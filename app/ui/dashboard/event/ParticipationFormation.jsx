import { useEffect, useState } from "react";
import Team from "@/app/ui/dashboard/event/Team";
import useAxiosPrivate from "@/app/hooks/useAxiosPrivate";
import { FaExclamationCircle } from "react-icons/fa";

export default function ParticipationFormation({
  eventID,
  teamNumber,
  playerNumber,
}) {
  const [participantData, setParticipantData] = useState([]);
  const [errorMessage, setErrorMessage] = useState(null);
  const api = useAxiosPrivate();

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
      setErrorMessage("This spot was occupied, please try another.");
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
  }, [errorMessage]);

  return (
    <>
      <div className="flex justify-center items-center">
        <button className="bg-blue-500 px-3 py-1.5 text-lg font-semibold text-white">
          Pick Your Spot
        </button>
      </div>
      <div className="mt-2">
        <div className="m-2 flex items-center space-x-1">
          {errorMessage && (
            <>
              <FaExclamationCircle className="text-red-500 min-h-4 min-w-4" />
              <p className="text-xs text-red-500">{errorMessage}</p>
            </>
          )}
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <h3 className="w-full text-right font-semibold text-gray-900 text-base">
              Team 1
            </h3>
            <Team
              participants={participantData}
              addParticipant={addParticipant}
              playerNumber={playerNumber}
              teamNum={1}
              eventID={eventID}
            />
          </div>
          <div className="text-left">
            <h3 className="w-full font-semibold text-gray-900 text-base">
              Team 2
            </h3>
            <Team
              participants={participantData}
              addParticipant={addParticipant}
              playerNumber={playerNumber}
              teamNum={2}
              eventID={eventID}
            />
          </div>
        </div>
      </div>
    </>
  );
}
