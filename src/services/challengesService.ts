import { supabase } from "@/lib/supabase";

export interface Challenge {
  id: string;
  uuid: string;
  title: string;
  summary: string;
  points: number;
  hours: number;
  description?: string;
  created_at?: string;
}

export const challengesService = {
  create: async (payload: Omit<Challenge, "id" | "uuid" | "created_at">) => {
    const { data, error } = await supabase
      .from("challenges")
      .insert(payload)
      .select()
      .single();

    if (error) throw error;
    return data;
  },
};
