import { supabase } from "@/lib/supabase";

export interface Homework {
  id: number;
  level: "A1" | "A2" | "B1" | "B2" | "C1" | "C2";
  title: string;
  description?: string;
  pdf_url?: string;
  type: "Redactar" | "Exponer" | "Comprender";
  created_at?: string;
  created_by?: string | null;
}

export const homeworksService = {
  create: async (payload: Omit<Homework, "id" | "created_at" | "created_by">) => {
    const { data, error } = await supabase
      .from("tasks") // tabla donde se guardan los homeworks
      .insert(payload)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Opcional: listar todos los homeworks
  list: async () => {
    const { data, error } = await supabase
      .from("tasks")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data as Homework[];
  },
};
