import { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { Session } from "@supabase/supabase-js";
import { useQuery } from "@tanstack/react-query";

import { fetchPeople } from "../api/people";

import DialogEmpty from "../components/DialogEmpty";
import AddPerson from "../components/AddPerson";
import { formatUTCOffset, getUTCOffsetForTimezone } from "../utils/helpers";

export default function Dashboard({ session }: { session: Session | null }) {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [showAddPerson, setShowAddPerson] = useState(false);

  const location = useLocation();

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const { data: people, isLoading: isPeopleLoading } = useQuery({
    queryKey: ["people"],
    queryFn: fetchPeople,
  });

  if (!session?.user) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  if (isPeopleLoading) {
    return <p>Loading...</p>;
  }

  const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  return (
    <>
      <main>
        <button
          className="rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700"
          onClick={() => setShowAddPerson(true)}
        >
          Add Person
        </button>

        <div className="mt-4">
          <h1 className="text-2xl font-semibold">Current Time</h1>
          <p className="font-mono text-4xl">
            {currentTime.toLocaleTimeString("en-US", { hour12: false })}
          </p>
        </div>

        <ul className="relative mt-4">
          <div className="absolute left-1/2 top-0 h-full w-0.5 bg-red-500" />
          <li className="mb-4 rounded bg-white p-4 shadow-md">
            <h2>You</h2>
            <p>{userTimezone}</p>
            <p>{getUTCOffsetForTimezone(userTimezone)}</p>
            {formatUTCOffset(getUTCOffsetForTimezone(userTimezone))}
          </li>
          {people?.map((person) => (
            <li
              key={person.id}
              className="relative mb-4 grid grid-cols-12 rounded bg-white p-4 py-12 shadow-md"
            >
              <div className="absolute">
                <h2>{person.name}</h2>
                <p>
                  {person.start_shift} - {person.end_shift}
                </p>
                <p>{person.timezone}</p>
                <p>{getUTCOffsetForTimezone(person.timezone)}</p>
                <p>
                  {formatUTCOffset(getUTCOffsetForTimezone(person.timezone))}
                </p>
              </div>
              {Array.from({ length: 12 }).map((_, index) => (
                <div
                  key={index}
                  className="h-4 border-l border-gray-200"
                  style={{ width: "calc(100% / 12)" }}
                />
              ))}
            </li>
          ))}
        </ul>
      </main>

      <DialogEmpty show={showAddPerson} onClose={() => setShowAddPerson(false)}>
        <div className="p-4">
          <h2 className="text-lg font-semibold">Add Person</h2>
          <AddPerson />
        </div>
      </DialogEmpty>
    </>
  );
}
