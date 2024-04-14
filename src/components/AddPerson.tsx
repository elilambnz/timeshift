import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { addPerson } from "../api/people";

export default function AppPerson() {
  const [name, setName] = useState("");
  const [timezone, setTimezone] = useState("America/New_York");
  const [startShift, setStartShift] = useState("08:30");
  const [endShift, setEndShift] = useState("17:00");

  const queryClient = useQueryClient();

  const addPersonMutation = useMutation({
    mutationFn: () =>
      addPerson({
        name,
        timezone,
        startShift,
        endShift,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["people"],
      });
    },
  });

  const timezones = Intl.supportedValuesOf("timeZone");

  return (
    <div>
      <form onSubmit={() => addPersonMutation.mutate()}>
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <select value={timezone} onChange={(e) => setTimezone(e.target.value)}>
          {timezones.map((timezone) => (
            <option key={timezone} value={timezone}>
              {timezone}
            </option>
          ))}
        </select>
        <input
          type="time"
          placeholder="Start Shift"
          value={startShift}
          onChange={(e) => setStartShift(e.target.value)}
        />
        <input
          type="time"
          placeholder="End Shift"
          value={endShift}
          onChange={(e) => setEndShift(e.target.value)}
        />
        <button type="submit">Add Person</button>
      </form>
    </div>
  );
}
