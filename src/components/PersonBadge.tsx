import clsx from "clsx";

export default function PersonBadge({
  name,
  timezone,
  startShift,
  endShift,
  currentTime,
}: {
  name: string;
  timezone: string;
  startShift: string;
  endShift: string;
  currentTime: Date;
}) {
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
    <div className="col-span-3 flex items-center gap-x-4 bg-white p-4 sm:col-span-2 md:col-span-1">
      <div
        className={clsx(
          "flex h-12 w-12 items-center justify-center rounded-full bg-blue-500 text-white",
          isShiftActive ? "bg-green-500" : "bg-blue-500",
        )}
      >
        {name[0]}
      </div>
      <h2 className="truncate">{name}</h2>
    </div>
  );
}
