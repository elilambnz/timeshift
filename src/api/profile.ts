import { supabase } from "../lib/supabase";

export const fetchProfile = async () => {
  try {
    const { data, error } = await supabase
      .from("profiles")
      .select(
        `id,
        startShift: start_shift,
        endShift: end_shift`,
      )
      .single();
    if (error) throw error;

    return data;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error("Error fetching profile:", error.message);
    throw new Error("Error fetching profile");
  }
};

export const updateProfile = async ({
  id,
  data,
}: {
  id: string;
  data: {
    startShift: string;
    endShift: string;
  };
}) => {
  try {
    const { error } = await supabase
      .from("profiles")
      .update({
        start_shift: data.startShift,
        end_shift: data.endShift,
      })
      .eq("id", id);
    if (error) throw error;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error("Error updating profile:", error.message);
    throw new Error("Error updating profile");
  }
};
