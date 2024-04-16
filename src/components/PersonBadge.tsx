import clsx from "clsx";
import { Person } from "../api/people";
import { getDeterministicEmoji } from "../utils/helpers";

export default function PersonBadge({
  person,
  currentTime,
}: {
  person: Person;
  currentTime: Date;
}) {
  const { name, timezone, startShift, endShift, image } = person;

  const currentDateTimezone = new Date(
    currentTime.toLocaleString("en-US", { timeZone: timezone }),
  );
  const startShiftTime = new Date(currentDateTimezone);
  const endShiftTime = new Date(currentDateTimezone);

  const [startHours, startMinutes] = startShift.split(":").map(Number);
  const [endHours, endMinutes] = endShift.split(":").map(Number);

  startShiftTime.setHours(startHours, startMinutes, 0, 0);
  endShiftTime.setHours(endHours, endMinutes, 0, 0);

  // Adjust endShiftTime if it's earlier than startShiftTime (crosses midnight)
  if (endShiftTime < startShiftTime) {
    endShiftTime.setDate(endShiftTime.getDate() + 1);
  }

  const isShiftActive =
    currentDateTimezone >= startShiftTime &&
    currentDateTimezone <= endShiftTime;

  return (
    <>
      <div
        className={clsx(
          "relative h-12 w-12 rounded-full border-4 object-cover object-top",
          isShiftActive ? "border-green-400" : "border-neutral-800",
        )}
      >
        {image ? (
          <>
            <img src={image} className="h-full w-full rounded-full" />
            <div className="absolute right-0 top-0 -translate-y-1/2 translate-x-1/4 rotate-12 transform text-2xl">
              👑
            </div>
          </>
        ) : (
          <div className="flex h-full w-full rotate-6 transform items-center justify-center rounded-full bg-neutral-600 text-2xl">
            {getDeterministicEmoji(name)}
          </div>
        )}
      </div>
      <h2 className="truncate text-white">{name}</h2>
    </>
  );
}
