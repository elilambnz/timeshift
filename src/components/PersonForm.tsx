import { useEffect, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { readableTimezone } from "../utils/helpers";

import { Person, addPerson, deletePerson, updatePerson } from "../api/people";
import clsx from "clsx";

export default function PersonForm({
  person,
  onClose,
}: {
  person?: Person | null;
  onClose: () => void;
}) {
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
    onMutate: () => {
      onClose();
    },
  });

  const editPersonMutation = useMutation({
    mutationFn: async () => {
      if (!person) return;
      return updatePerson({
        id: person.id,
        name,
        timezone,
        startShift,
        endShift,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["people"],
      });
    },
    onSettled: () => {
      onClose();
    },
  });

  const deletePersonMutation = useMutation({
    mutationFn: async () => {
      if (!person) return;
      return deletePerson(person.id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["people"],
      });
    },
    onSettled: () => {
      onClose();
    },
  });

  useEffect(() => {
    if (person) {
      setName(person.name);
      setTimezone(person.timezone);
      setStartShift(person.startShift);
      setEndShift(person.endShift);
    }
  }, [person]);

  const timezones = Intl.supportedValuesOf("timeZone");

  const formReady = name && timezone && startShift && endShift;

  return (
    <div className="min-w-[18rem]">
      <form
        className="mt-4 flex flex-col gap-y-4"
        onSubmit={() => {
          person ? editPersonMutation.mutate() : addPersonMutation.mutate();
        }}
      >
        <input
          className="rounded-md border border-neutral-600 bg-neutral-800 p-2 text-white"
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <select
          className="rounded-md border border-neutral-600 bg-neutral-800 p-2 text-white"
          value={timezone}
          onChange={(e) => setTimezone(e.target.value)}
        >
          {timezones.map((timezone) => (
            <option key={timezone} value={timezone}>
              {readableTimezone(timezone)}
            </option>
          ))}
        </select>
        <input
          className="rounded-md border border-neutral-600 bg-neutral-800 p-2 text-white"
          type="time"
          placeholder="Start Shift"
          value={startShift}
          onChange={(e) => setStartShift(e.target.value)}
        />
        <input
          className="rounded-md border border-neutral-600 bg-neutral-800 p-2 text-white"
          type="time"
          placeholder="End Shift"
          value={endShift}
          onChange={(e) => setEndShift(e.target.value)}
        />
        <button
          className={clsx(
            "rounded-md border border-neutral-600 bg-neutral-800 p-2 text-white",
            !formReady && "cursor-not-allowed opacity-50",
          )}
          type="submit"
          disabled={!formReady}
        >
          Submit
        </button>
        {person && (
          <button
            className="rounded-md border border-rose-300 bg-rose-800 p-2 text-white"
            type="button"
            onClick={() => deletePersonMutation.mutate()}
          >
            Delete
          </button>
        )}
      </form>
    </div>
  );
}
