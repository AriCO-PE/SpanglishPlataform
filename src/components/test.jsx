"use client";
import { useEffect } from "react";
import { supabase } from "@/lib/supabase";

export default function TestSupabase() {
  useEffect(() => {
    const test = async () => {
      const { data, error } = await supabase.from("users").select("*");
      console.log("Data:", data);
      console.log("Error:", error);
    };
    test();
  }, []);

  return <div>Check console for Supabase test</div>;
}
