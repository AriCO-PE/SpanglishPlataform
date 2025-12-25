// src/services/booksService.ts
import { supabase } from "@/lib/supabase";

export interface Book {
  id?: string;
  title: string;
  author?: string;
  category?: string;
  difficulty?: string;
  description?: string;
  cover_url?: string;
  file_url?: string;
  created_at?: string;
}

export const booksService = {
  add: async (book: Book) => {
    const { data, error } = await supabase.from("books").insert(book);
    if (error) throw error;
    return data;
  },

  getAll: async (): Promise<Book[]> => {
    const { data, error } = await supabase.from("books").select("*");
    if (error) throw error;
    return data || [];
  },
};
