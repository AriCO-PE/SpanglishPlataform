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
      .from<News>("news")
      .select("*")
      .order("published_at", { ascending: false });

    if (error) throw error;
    return data;
  },
};
