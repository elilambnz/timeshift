import clsx from "clsx";

export default function Shift({
  startShift,
  endShift,
  timezone,
  currentTime,
}: {
  startShift: string;
  endShift: string;
  timezone: string;
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

  const shiftStartTimeTimestamp = startShiftTime.getTime();
  const shiftEndTimeTimestamp = endShiftTime.getTime();
  const shiftDuration = shiftEndTimeTimestamp - shiftStartTimeTimestamp;
  const totalDuration = 24 * 60 * 60 * 1000;
  const shiftWidth = (shiftDuration / totalDuration) * 100;

  // Calculate the current time position within the shift duration
  const currentTimeMillis = currentDateTimezone.getTime();
  const elapsedDuration = currentTimeMillis - shiftStartTimeTimestamp;

  // Calculate the percentage progress within the shift duration
  const shiftProgress = (elapsedDuration / shiftDuration) * 100;

  // Center the shift position
  const shiftPosition = 50 - shiftProgress / 3;

  return (
    <div className="relative -z-10 h-full w-full overflow-hidden rounded-xl bg-blue-300">
      {/* {[...Array(24)].map((_, index) => (
        <div
          key={index}
          className="absolute top-0 h-full w-0.5 bg-gray-200"
          style={{
            left: `${(index / 24) * 100}%`,
          }}
        />
      ))} */}
      <div
        className={clsx(
          "absolute top-0 h-full",
          isShiftActive ? "bg-green-400" : "bg-red-400",
        )}
        style={{
          width: `${shiftWidth}%`,
          left: `${shiftPosition}%`,
        }}
      />
      {shiftPosition < 0 && (
        <div
          className={clsx(
            "absolute top-0 h-full",
            isShiftActive ? "bg-green-400" : "bg-red-400",
          )}
          style={{
            width: `${shiftWidth}%`,
            left: `${shiftPosition + 100}%`,
          }}
        />
      )}
      <p className="absolute left-3 flex h-full items-center text-xs text-gray-700">
        {startHours.toString().padStart(2, "0")}:
        {startMinutes.toString().padStart(2, "0")} -{" "}
        {endHours.toString().padStart(2, "0")}:
        {endMinutes.toString().padStart(2, "0")} {shiftPosition}
      </p>
    </div>
  );
}
