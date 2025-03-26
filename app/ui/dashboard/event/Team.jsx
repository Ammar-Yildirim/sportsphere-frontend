import { clsx } from "clsx";
import { CheckCircleIcon } from "@heroicons/react/24/outline";
import { UserCircleIcon } from "@heroicons/react/24/solid";
import useAuth from "@/app/hooks/useAuth";

export default function Team({
  participants,
  addParticipant,
  removeParticipant,
  playerNumber,
  teamNum,
  isPastEvent,
}) {
  const { userId } = useAuth();
  const teamParticipants = participants
    .filter((participant) => participant.team === teamNum)
    .sort((a, b) => a.spot - b.spot);

  const occupiedSpots = new Map(
    teamParticipants.map((participant) => [participant.spot, participant])
  );

  const isLeftTeam = teamNum === 1;
  const textClassName = isLeftTeam ? "text-right" : "text-left";
  const justifyClassName = isLeftTeam ? "justify-end" : "justify-start";

  return (
    <div>
      {Array.from({ length: playerNumber }, (_, index) => {
        const spotNumber = index + 1;
        const participant = occupiedSpots.get(spotNumber);
        const isOccupied = !!participant;
        const isCurrentUserSpot = isOccupied && participant.userID === userId;

        return (
          <div
            key={spotNumber}
            className={clsx("flex items-center space-x-1", justifyClassName)}
          >
            {isLeftTeam && (
              <p className={textClassName}>
                {isOccupied ? participant.userName : "Open Spot"}
              </p>
            )}

            {isOccupied ? (
              <UserCircleIcon
                className={`w-12 ${
                  isCurrentUserSpot && !isPastEvent ? "hover:text-red-600 cursor-pointer" : ""
                }`}
                onClick={
                  isCurrentUserSpot && !isPastEvent ? () => removeParticipant() : undefined
                }
              />
            ) : (
              <button
                className={`${
                  !isPastEvent &&
                  "cursor-pointer hover:text-blue-500 active:text-blue-600"
                }`}
                onClick={
                  !isPastEvent
                    ? () => addParticipant(teamNum, spotNumber)
                    : undefined
                }
                disabled={isPastEvent}
              >
                <CheckCircleIcon className="w-12" />
              </button>
            )}

            {!isLeftTeam && (
              <p className={textClassName}>
                {isOccupied ? participant.userName : "Open Spot"}
              </p>
            )}
          </div>
        );
      })}
    </div>
  );
}
