import Team from "./Team";

export default function TeamFormation({
  participants,
  addParticipant,
  playerNumber,
  isPastEvent
}) {
  return (
    <div className="grid grid-cols-2 gap-3">
      <div>
        <h3 className="w-full text-right font-semibold text-gray-900 text-base">
          Team 1
        </h3>
        <Team
          participants={participants}
          addParticipant={addParticipant}
          playerNumber={playerNumber}
          teamNum={1}
          isPastEvent={isPastEvent}
        />
      </div>
      <div className="text-left">
        <h3 className="w-full font-semibold text-gray-900 text-base">Team 2</h3>
        <Team
          participants={participants}
          addParticipant={addParticipant}
          playerNumber={playerNumber}
          teamNum={2}
          isPastEvent={isPastEvent}
        />
      </div>
    </div>
  );
}
