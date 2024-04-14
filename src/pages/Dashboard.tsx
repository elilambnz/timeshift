import { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { Session } from "@supabase/supabase-js";
import { useQuery } from "@tanstack/react-query";

import { formatUTCOffset, getUTCOffsetForTimezone } from "../utils/helpers";

import { fetchProfile } from "../api/profile";
import { fetchPeople } from "../api/people";

import PersonRow from "../components/PersonRow";
import DialogEmpty from "../components/DialogEmpty";
import AddPerson from "../components/AddPerson";

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

  const { data: profile, isLoading: isLoading } = useQuery({
    queryKey: ["profile"],
    queryFn: fetchProfile,
  });

  const { data: people, isLoading: isPeopleLoading } = useQuery({
    queryKey: ["people"],
    queryFn: fetchPeople,
  });

  if (!session?.user) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  if (isLoading || isPeopleLoading) {
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

        <div className="relative mt-4">
          <div className="absolute left-1/2 top-0 h-full w-0.5 bg-red-500" />
          <ul>
            <li className="mb-4 rounded border border-gray-500 bg-white p-4">
              <h2>You</h2>
              <p>Start Shift: {profile?.startShift}</p>
              <p>End Shift: {profile?.endShift}</p>
              <p>
                {userTimezone} (
                {formatUTCOffset(getUTCOffsetForTimezone(userTimezone))})
              </p>
            </li>
            {people && people.length > 0 ? (
              people.map((person) => (
                <PersonRow
                  key={person.id}
                  person={person}
                  currentTime={currentTime}
                />
              ))
            ) : (
              <p>No people added yet</p>
            )}
          </ul>
        </div>
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
