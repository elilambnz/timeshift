import { formatUTCOffset, getUTCOffsetForTimezone } from "../utils/helpers";

export default function PersonRow({
  person,
  currentTime,
}: {
  person: {
    id: string;
    name: string;
    timezone: string;
    startShift: string;
    endShift: string;
  };
  currentTime: Date;
}) {
  const isShiftActive = () => {
    const currentDateTimezone = new Date(
      currentTime.toLocaleString("en-US", { timeZone: person.timezone }),
    );
    const startShiftTime = new Date(currentDateTimezone);
    const endShiftTime = new Date(currentDateTimezone);

    const [startHours, startMinutes] = person.startShift.split(":").map(Number);
    const [endHours, endMinutes] = person.endShift.split(":").map(Number);

    startShiftTime.setHours(startHours, startMinutes, 0, 0);
    endShiftTime.setHours(endHours, endMinutes, 0, 0);

    // Adjust endShiftTime if it's earlier than startShiftTime (crosses midnight)
    if (endShiftTime < startShiftTime) {
      endShiftTime.setDate(endShiftTime.getDate() + 1);
    }

    return (
      currentDateTimezone >= startShiftTime &&
      currentDateTimezone <= endShiftTime
    );
  };

  return (
    <li
      key={person.id}
      className="mb-4 rounded border border-gray-500 bg-white p-4"
    >
      <h3>{person.name}</h3>
      <p>Start Shift: {person.startShift}</p>
      <p>End Shift: {person.endShift}</p>
      <p>
        Timezone: {person.timezone} (
        {formatUTCOffset(getUTCOffsetForTimezone(person.timezone))})
      </p>
      <p>
        Current Time:{" "}
        {currentTime.toLocaleString("en-US", { timeZone: person.timezone })}
      </p>
      {isShiftActive() ? (
        <p style={{ color: "green" }}>Shift Active</p>
      ) : (
        <p style={{ color: "red" }}>Shift Inactive</p>
      )}
    </li>
  );
}
