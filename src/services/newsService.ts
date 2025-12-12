import { supabase } from "@/lib/supabase";

export interface News {
  id: number;
  title: string;
  summary: string;
  content: string;
  url?: string;
  image_url?: string;
  published_at: string;
}

export const newsService = {
  getAll: async (): Promise<News[]> => {
    const { data, error } = await supabase
      .from("news") // ✅ solo el nombre de la tabla aquí
      .select("*") as { data: News[] | null; error: any }; // casteamos el resultado a News[]

    if (error) throw error;
    return data || [];
  },
};
