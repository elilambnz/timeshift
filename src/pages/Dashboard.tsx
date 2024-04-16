import { Fragment, useEffect, useState } from "react";
import { Link, Navigate, useLocation } from "react-router-dom";

import { Session } from "@supabase/supabase-js";
import { supabase } from "../lib/supabase";
import { useQuery } from "@tanstack/react-query";

import {
  formatUTCOffset,
  getUTCOffsetForTimezone,
  readableTimezone,
} from "../utils/helpers";

import { fetchProfile } from "../api/profile";
import { Person, fetchPeople } from "../api/people";

import Loader from "../components/Loader";
import PersonBadge from "../components/PersonBadge";
import Shift from "../components/Shift";
import DialogEmpty from "../components/DialogEmpty";
import PersonForm from "../components/PersonForm";
import ProfileForm from "../components/ProfileForm";

import { MapPinIcon } from "@heroicons/react/16/solid";

export default function Dashboard({ session }: { session: Session | null }) {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [data, setData] = useState<Person[]>([]);
  const [showAddPerson, setShowAddPerson] = useState(false);
  const [personToEdit, setPersonToEdit] = useState<Person | null>(null);
  const [showEditProfile, setShowEditProfile] = useState(false);

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
    if (people) {
      setData(people);
    }
  }, [people]);

  useEffect(() => {
    if (people && profile) {
      setData((prev) => {
        const existingIndex = prev.findIndex(
          (person) => person.id === profile.id,
        );

        const updatedPerson = {
          id: profile.id,
          name: "Me",
          timezone: userTimezone,
          startShift: profile.startShift,
          endShift: profile.endShift,
          image: session?.user?.user_metadata.avatar_url,
        };

        if (existingIndex !== -1) {
          // Update existing person in the array
          const updatedData = [
            ...prev.slice(0, existingIndex),
            updatedPerson,
            ...prev.slice(existingIndex + 1),
          ];
          return updatedData;
        } else {
          // Add new person to the beginning of the array
          return [updatedPerson, ...prev];
        }
      });
    }
  }, [people, profile, userTimezone, session]);

  if (!session?.user) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  if (isLoading || isPeopleLoading) {
    <Loader />;
  }

  return (
    <>
      <header className="sticky top-0 z-10 flex items-center justify-between border-b border-neutral-800 bg-neutral-900/10 p-4 backdrop-blur-lg">
        <Link to="/">
          <img
            src="/icon.png"
            alt="Timeshift logo"
            className="h-10 w-10"
            draggable={false}
          />
        </Link>

        <button
          type="button"
          className="text-rose-500 hover:text-rose-400"
          onClick={() => supabase.auth.signOut()}
        >
          Sign Out
        </button>
      </header>

      <main className="flex h-full min-h-[40rem] flex-col items-center justify-center bg-neutral-900 px-4 py-12 text-white">
        <div className="flex w-full max-w-7xl flex-wrap items-end justify-between gap-y-4 py-4">
          <div className="text-left">
            <h1 className="text-4xl font-semibold">
              {currentTime.toLocaleTimeString("en-US", { hour12: false })}
            </h1>
            <div className="mt-2 flex items-center gap-x-1 text-sm text-gray-500">
              <MapPinIcon
                className="inline-block h-4 w-4 text-gray-500"
                aria-hidden="true"
              />
              <span>
                {readableTimezone(userTimezone)} (
                {formatUTCOffset(getUTCOffsetForTimezone(userTimezone))})
              </span>
            </div>
          </div>
          <button
            type="button"
            className="rounded-md bg-black  px-8 py-2 text-sm font-semibold text-white hover:bg-black/[0.8] hover:shadow-lg"
            onClick={() => setShowAddPerson(true)}
          >
            Add Person
          </button>
        </div>

        <div className="mx-auto w-full max-w-7xl rounded-xl border border-neutral-600 bg-[linear-gradient(110deg,#333_0.6%,#222)] p-4">
          <div className="mt-4 grid grid-cols-6">
            {data.map((person, index) => (
              <Fragment key={person.id}>
                <div className="col-span-3 p-4 sm:col-span-2 md:col-span-1">
                  <button
                    type="button"
                    className="flex w-full items-center gap-x-4 hover:opacity-50"
                    onClick={() => {
                      if (person.id === profile?.id) {
                        setShowEditProfile(true);
                      } else {
                        setPersonToEdit(person);
                      }
                    }}
                  >
                    <PersonBadge person={person} currentTime={currentTime} />
                  </button>
                </div>

                <div className="relative z-10 col-span-3 flex items-center p-4 sm:col-span-4 md:col-span-5">
                  {index === 0 && (
                    <div className="absolute -top-4 left-1/2 z-20 -translate-x-1/2 transform">
                      <div className="h-4 w-4 rounded-full bg-rose-500"></div>
                    </div>
                  )}
                  <div className="absolute bottom-0 left-1/2 top-0 w-0.5 -translate-x-1/2 transform bg-rose-500">
                    <div className="-mt-2 ml-3 flex w-[6rem] items-center gap-x-2 truncate text-xs text-gray-500 sm:w-[18rem]">
                      {currentTime.toLocaleString("en-US", {
                        hour: "2-digit",
                        minute: "2-digit",
                        timeZone: person.timezone,
                      })}
                      <div className="hidden items-center gap-x-1 sm:flex">
                        <MapPinIcon
                          className="inline-block h-3 w-3 text-gray-500"
                          aria-hidden="true"
                        />
                        <span>
                          {readableTimezone(person.timezone)} (
                          {formatUTCOffset(
                            getUTCOffsetForTimezone(person.timezone),
                          )}
                          )
                        </span>
                      </div>
                    </div>
                  </div>

                  <Shift
                    startShift={person.startShift}
                    endShift={person.endShift}
                    timezone={person.timezone}
                    currentTime={currentTime}
                  />
                </div>
              </Fragment>
            ))}
          </div>
        </div>
      </main>

      <DialogEmpty show={showAddPerson} onClose={() => setShowAddPerson(false)}>
        <div className="p-4">
          <h2 className="text-lg font-semibold">Add Person</h2>
          <PersonForm onClose={() => setShowAddPerson(false)} />
        </div>
      </DialogEmpty>

      <DialogEmpty
        show={Boolean(personToEdit)}
        onClose={() => setPersonToEdit(null)}
      >
        <div className="p-4">
          <h2 className="text-lg font-semibold">Edit Person</h2>
          <PersonForm
            person={personToEdit}
            onClose={() => setPersonToEdit(null)}
          />
        </div>
      </DialogEmpty>

      <DialogEmpty
        show={showEditProfile}
        onClose={() => setShowEditProfile(false)}
      >
        <div className="p-4">
          <h2 className="text-lg font-semibold">Edit Profile</h2>
          <ProfileForm onClose={() => setShowEditProfile(false)} />
        </div>
      </DialogEmpty>
    </>
  );
}
