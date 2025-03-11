import { CheckCircleIcon } from "@heroicons/react/24/outline";
import { UserCircleIcon } from "@heroicons/react/24/solid";
import dayjs from "dayjs";
import advancedFormat from "dayjs/plugin/advancedFormat";
import { clsx } from "clsx";

export function parseIncomingEvent(event) {
  dayjs.extend(advancedFormat);
  return {
    ...event,
    date: dayjs(event.startsAt).format("dddd, MMMM D, YYYY"),
    time: dayjs(event.startsAt).format("h:mm A"),
  };
}

export function createTeam(participants, playerNumber, teamNum) {
  const filteredTeam = participants.filter((x) => x.team == teamNum);
  const sortedTeam = filteredTeam.sort((a, b) => a.pos - b.pos);
  let items = [];
  let idx = 0;

  for (let i = 1; i <= playerNumber; i++) {
    if (idx < sortedTeam.length && sortedTeam[idx].pos == i) {
      items.push(
        <div
          key={i}
          className={clsx(
            "flex items-center space-x-1",
            teamNum == 1 ? "justify-end" : "justify-start"
          )}
        >
          {teamNum == 1 && (
            <p className="text-right">{sortedTeam[idx].playerName}</p>
          )}
          <UserCircleIcon className="w-12" />
          {teamNum == 2 && (
            <p className=" text-left">{sortedTeam[idx].playerName}</p>
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
          <button className="cursor-pointer">
            <CheckCircleIcon className="w-12" />
          </button>
          {teamNum == 2 && <p className="text-left">Open Spot</p>}
        </div>
      );
    }
  }

  return items;
}
