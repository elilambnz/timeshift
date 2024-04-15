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
  const currentTimeInTimezone = new Date(
    currentTime.toLocaleString("en-US", { timeZone: timezone }),
  );

  const [startHour, startMinute] = startShift.split(":").map(Number);
  const [endHour, endMinute] = endShift.split(":").map(Number);

  const shiftStartTime = new Date(currentTimeInTimezone);
  shiftStartTime.setHours(startHour, startMinute, 0, 0);

  const shiftEndTime = new Date(currentTimeInTimezone);
  shiftEndTime.setHours(endHour, endMinute, 0, 0);

  const currentTimeTimestamp = currentTimeInTimezone.getTime();
  const shiftStartTimeTimestamp = shiftStartTime.getTime();
  const shiftEndTimeTimestamp = shiftEndTime.getTime();
  const shiftDuration = shiftEndTimeTimestamp - shiftStartTimeTimestamp;
  const elapsedTime = currentTimeTimestamp - shiftStartTimeTimestamp;
  let shiftPosition = (elapsedTime / shiftDuration) * 100;
  // Handle negative shiftPosition
  if (shiftPosition < 0) {
    shiftPosition = 100 + shiftPosition;
  }
  shiftPosition -= 50;
  const totalDuration = 24 * 60 * 60 * 1000;
  const shiftWidth = (shiftDuration / totalDuration) * 100;

  return (
    <div className="relative -z-10 h-full w-full overflow-hidden rounded-xl bg-blue-300">
      <div
        className="absolute top-0 h-full bg-green-400"
        style={{
          width: `${shiftWidth}%`,
          right: `${shiftPosition}%`,
        }}
      />
      {shiftPosition + shiftWidth > 100 && (
        <div
          className="absolute top-0 h-full bg-green-400"
          style={{
            width: `${shiftPosition + shiftWidth - 100}%`,
            right: 0,
          }}
        />
      )}
      <p className="absolute left-3 flex h-full items-center text-xs text-gray-700">
        {startHour.toString().padStart(2, "0")}:
        {startMinute.toString().padStart(2, "0")} -{" "}
        {endHour.toString().padStart(2, "0")}:
        {endMinute.toString().padStart(2, "0")}
      </p>
    </div>
  );
}
