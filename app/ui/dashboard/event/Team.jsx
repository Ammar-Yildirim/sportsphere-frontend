import { clsx } from "clsx";
import { CheckCircleIcon } from "@heroicons/react/24/outline";
import { UserCircleIcon } from "@heroicons/react/24/solid";

export default function Team({
  participants,
  addParticipant,
  playerNumber,
  teamNum,
}) {
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
              <UserCircleIcon className="w-12" />
            ) : (
              <button
                className="cursor-pointer hover:text-blue-500 active:text-blue-600"
                onClick={() => addParticipant(teamNum, spotNumber)}
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
