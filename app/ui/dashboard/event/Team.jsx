import { clsx } from "clsx";
import { CheckCircleIcon } from "@heroicons/react/24/outline";
import { UserCircleIcon } from "@heroicons/react/24/solid";

export default function Team({
  participants,
  addParticipant,
  playerNumber,
  teamNum,
  eventID
}) {

  const filteredTeam = participants.filter((x) => x.team == teamNum);
  const sortedTeam = filteredTeam.sort((a, b) => a.spot - b.spot);
  let items = [];
  let idx = 0;

  for (let i = 1; i <= playerNumber; i++) {
    if (idx < sortedTeam.length && sortedTeam[idx].spot == i) {
      items.push(
        <div
          key={i}
          className={clsx(
            "flex items-center space-x-1",
            teamNum == 1 ? "justify-end" : "justify-start"
          )}
        >
          {teamNum == 1 && (
            <p className="text-right">{sortedTeam[idx].userName}</p>
          )}
          <UserCircleIcon className="w-12" />
          {teamNum == 2 && (
            <p className=" text-left">{sortedTeam[idx].userName}</p>
          )}
        </div>
      );
      idx++;
    } else {
      items.push(
        <div
          key={i}
          className={clsx(
            "flex items-center space-x-1",
            teamNum == 1 ? "justify-end" : "justify-start"
          )}
        >
          {teamNum == 1 && <p className="text-right">Open Spot</p>}
          <button
            className="cursor-pointer hover:text-blue-500 active:text-blue-600"
            onClick={() => addParticipant(teamNum, i)}
          >
            <CheckCircleIcon className="w-12" />
          </button>
          {teamNum == 2 && <p className="text-left">Open Spot</p>}
        </div>
      );
    }
  }

  return <div>{items}</div>;
}
