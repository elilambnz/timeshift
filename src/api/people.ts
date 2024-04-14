import { supabase } from "../lib/supabase";

export const fetchPeople = async () => {
  try {
    const { data, error } = await supabase.from("people").select(
      `id,
        name,
        timezone,
        start_shift,
        end_shift`,
    );
    if (error) throw error;

    return data;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error("Error fetching people:", error.message);
    throw new Error("Error fetching people");
  }
};

export const addPerson = async (person: {
  name: string;
  timezone: string;
  start_shift: string;
  end_shift: string;
}) => {
  try {
    const session = await supabase.auth.getSession();
    if (!session) return;
    const userId = session.data.session?.user.id;
    if (!userId) throw new Error("No user ID");

    const { data, error } = await supabase.from("people").insert({
      name: person.name,
      timezone: person.timezone,
      start_shift: person.start_shift,
      end_shift: person.end_shift,
      user_id: userId,
    });
    if (error) throw error;

    return data;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error("Error adding person:", error.message);
    throw new Error("Error adding person");
  }
};
