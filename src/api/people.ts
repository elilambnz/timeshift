import { supabase } from "../lib/supabase";

export type Person = {
  id: string;
  name: string;
  timezone: string;
  startShift: string;
  endShift: string;
  image?: string;
};

export const fetchPeople = async () => {
  try {
    const { data, error } = await supabase
      .from("people")
      .select(
        `id,
        name,
        timezone,
        startShift: start_shift,
        endShift: end_shift`,
      )
      .order("id")
      .returns<Person[]>();
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
  startShift: string;
  endShift: string;
}) => {
  try {
    const session = await supabase.auth.getSession();
    if (!session) return;
    const userId = session.data.session?.user.id;
    if (!userId) throw new Error("No user ID");

    const { data, error } = await supabase.from("people").insert({
      name: person.name,
      timezone: person.timezone,
      start_shift: person.startShift,
      end_shift: person.endShift,
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

export const updatePerson = async (data: {
  id: string;
  name: string;
  timezone: string;
  startShift: string;
  endShift: string;
}) => {
  try {
    const { error } = await supabase
      .from("people")
      .update({
        name: data.name,
        timezone: data.timezone,
        start_shift: data.startShift,
        end_shift: data.endShift,
      })
      .eq("id", data.id);
    if (error) throw error;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error("Error updating person:", error.message);
    throw new Error("Error updating person");
  }
};

export const deletePerson = async (id: string) => {
  try {
    const { error } = await supabase.from("people").delete().eq("id", id);
    if (error) throw error;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error("Error deleting person:", error.message);
    throw new Error("Error deleting person");
  }
};
