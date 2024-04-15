import { Fragment, useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { Session } from "@supabase/supabase-js";
import { useQuery } from "@tanstack/react-query";

import {
  formatUTCOffset,
  getUTCOffsetForTimezone,
  readableTimezone,
} from "../utils/helpers";

import { fetchProfile } from "../api/profile";
import { fetchPeople } from "../api/people";

import PersonBadge from "../components/PersonBadge";
import Shift from "../components/Shift";
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

  const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  useEffect(() => {
    if (profile) {
      people?.unshift({
        id: profile.id,
        name: "Me",
        timezone: userTimezone,
        startShift: profile.startShift,
        endShift: profile.endShift,
      });
    }
  }, [people, profile, userTimezone]);

  if (!session?.user) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  if (isLoading || isPeopleLoading) {
    return <p>Loading...</p>;
  }

  return (
    <>
      <main>
        <button
          className="rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700"
          onClick={() => setShowAddPerson(true)}
        >
          Add Person
        </button>

        <div className="m-4">
          <p className="text-4xl font-semibold">
            {currentTime.toLocaleTimeString("en-US", { hour12: false })}
          </p>
          <p className="mt-2 text-sm text-gray-500">
            {readableTimezone(userTimezone)} (
            {formatUTCOffset(getUTCOffsetForTimezone(userTimezone))})
          </p>
        </div>

        <div className="mt-4 grid grid-cols-6">
          {people?.map(
            ({ id, name, timezone, startShift, endShift }, index) => (
              <Fragment key={id}>
                <PersonBadge
                  name={name}
                  timezone={timezone}
                  startShift={startShift}
                  endShift={endShift}
                  currentTime={currentTime}
                />

                <div className="relative col-span-3 flex items-center p-4 sm:col-span-4 md:col-span-5">
                  {index === 0 && (
                    <div className="absolute -top-4 left-1/2 z-10 -translate-x-1/2 transform">
                      <div className="h-4 w-4 rounded-full bg-rose-500"></div>
                    </div>
                  )}
                  <div className="absolute bottom-0 left-1/2 top-0 w-0.5 -translate-x-1/2 transform bg-rose-500">
                    <div className="-mt-2 ml-3 w-[6rem] truncate text-xs text-gray-600 sm:w-[18rem]">
                      {currentTime.toLocaleString("en-US", {
                        hour: "2-digit",
                        minute: "2-digit",
                        timeZone: timezone,
                      })}{" "}
                      <span className="ml-1 hidden sm:inline">
                        - {readableTimezone(timezone)} (
                        {formatUTCOffset(getUTCOffsetForTimezone(timezone))})
                      </span>
                    </div>
                  </div>

                  <Shift
                    startShift={startShift}
                    endShift={endShift}
                    timezone={timezone}
                    currentTime={currentTime}
                  />
                </div>
              </Fragment>
            ),
          )}
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
