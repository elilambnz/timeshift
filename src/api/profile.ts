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
