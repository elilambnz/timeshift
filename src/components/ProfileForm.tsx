import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { fetchProfile, updateProfile } from "../api/profile";

import clsx from "clsx";

export default function PersonForm({ onClose }: { onClose: () => void }) {
  const [startShift, setStartShift] = useState("08:30");
  const [endShift, setEndShift] = useState("17:00");

  const queryClient = useQueryClient();

  const { data: profile, isLoading: isLoading } = useQuery({
    queryKey: ["profile"],
    queryFn: fetchProfile,
  });

  const editProfileMutation = useMutation({
    mutationFn: async () => {
      if (!profile) return;
      return updateProfile({
        id: profile.id,
        data: {
          startShift,
          endShift,
        },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["profile"],
      });
    },
    onSettled: () => {
      onClose();
    },
  });

  useEffect(() => {
    if (profile) {
      setStartShift(profile.startShift);
      setEndShift(profile.endShift);
    }
  }, [profile]);

  const formReady = startShift && endShift;

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="min-w-[18rem]">
      <form
        className="mt-4 flex flex-col gap-y-4"
        onSubmit={() => {
          editProfileMutation.mutate();
        }}
      >
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
      </form>
    </div>
  );
}
