import useAuth from "@/app/hooks/useAuth";
import { CheckCircleIcon } from "@heroicons/react/24/outline";
import { UserCircleIcon } from "@heroicons/react/24/solid";

export default function GroupFormation({
  participants,
  addParticipant,
  removeParticipant,
  playerNumber,
  isPastEvent,
}) {
  const { userId } = useAuth();
  const teamParticipants = participants.sort((a, b) => a.spot - b.spot);
  const occupiedSpots = new Map(
    teamParticipants.map((participant) => [participant.spot, participant])
  );

  return (
    <div className="grid grid-cols-2 xl:grid-cols-3 gap-2">
      {Array.from({ length: playerNumber }, (_, index) => {
        const spotNumber = index + 1;
        const participant = occupiedSpots.get(spotNumber);
        const isOccupied = !!participant;
        const isCurrentUserSpot = isOccupied && participant.userID === userId;

        return (
          <div
            key={spotNumber}
            className="flex items-center justify-end space-x-1 w-full"
          >
            <p>{isOccupied ? participant.userName : "Open Spot"}</p>
            {isOccupied ? (
              <UserCircleIcon 
                className={`w-12 ${isCurrentUserSpot && !isPastEvent ? 'hover:text-red-600 cursor-pointer' : ''}`}
                onClick={isCurrentUserSpot && !isPastEvent ? () => removeParticipant() : undefined}
              />
            ) : (
              <button
                className={`${
                  !isPastEvent &&
                  "cursor-pointer hover:text-blue-500 active:text-blue-600"
                }`}
                onClick={!isPastEvent ? () => addParticipant(1, spotNumber) : undefined}
                disabled={isPastEvent}
              >
                <CheckCircleIcon className="w-12" />
              </button>
            )}
          </div>
        );
      })}
    </div>
  );
}