"use client";
import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import Sidebar from "@/components/Sidebar";
import PageLayout from "@/components/PageLayout";
import AuthGuard from "@/components/AuthGuard";
import styles from "./challenges.module.scss";

interface Challenge {
  id: string;
  title: string;
  summary: string;
  description: string;
  points: number;
  hours: number;
}

interface Submission {
  challenge_id: string;
  status: "pending" | "approved" | "rejected";
}

export default function ChallengesPage() {
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedChallenge, setSelectedChallenge] = useState<Challenge | null>(null);
  const [submissions, setSubmissions] = useState<Submission[]>([]);

  // NEW STATES
  const [search, setSearch] = useState("");
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    fetchChallenges();
    fetchSubmissions();
  }, []);

  const fetchChallenges = async () => {
    setLoading(true);
    const { data, error } = await supabase.from("challenges").select("*");
    if (!error && data) setChallenges(data);
    setLoading(false);
  };

  const fetchSubmissions = async () => {
    const { data } = await supabase.from("challenge_submissions").select("*");
    if (data) setSubmissions(data);
  };

  const handleComplete = async (challengeId: string) => {
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) return alert("No se pudo obtener el usuario");

    const { error } = await supabase.from("challenge_submissions").insert({
      challenge_id: challengeId,
      user_id: userData.user.id,
      status: "pending",
    });

    if (error) return alert("No se pudo marcar como cumplido");

    alert("Reto enviado para verificación por el administrador.");
    setSubmissions([...submissions, { challenge_id: challengeId, status: "pending" }]);
  };

  const isApproved = (challengeId: string) =>
    submissions.some(
      (s) => s.challenge_id === challengeId && s.status === "approved"
    );

  // FILTER LOGIC
  const filteredChallenges = challenges.filter((c) => {
    const matchesSearch = c.title.toLowerCase().includes(search.toLowerCase());
    const isCompleted = isApproved(c.id);

    // If "showAll" is OFF → hide completed
    if (!showAll && isCompleted) return false;

    return matchesSearch;
  });

  if (loading) return <p>Cargando retos...</p>;

  return (
    <AuthGuard>
      <Sidebar />
      <PageLayout title="Retos">
        <div className={styles.challengesContainer}>

          {/* SEARCH + TOGGLE */}
          <div className={styles.controls}>
            <input
              type="text"
              placeholder="Buscar reto por nombre..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

            <button onClick={() => setShowAll(!showAll)}>
              {showAll ? "Ocultar completados" : "Ver todos"}
            </button>
          </div>

          {filteredChallenges.length === 0 && <p>No hay retos disponibles.</p>}

          {filteredChallenges.map((challenge) => (
            <div key={challenge.id} className={styles.challengeCard}>
              <h3>{challenge.title}</h3>
              <p>{challenge.summary}</p>

              <div className={styles.challengeInfo}>
                <span>🕒 {challenge.hours} horas</span>
                <span>⭐ {challenge.points} aura</span>
              </div>

              <div className={styles.actions}>
                <button onClick={() => setSelectedChallenge(challenge)}>
                  Details
                </button>
                <button
                  onClick={() => handleComplete(challenge.id)}
                  disabled={isApproved(challenge.id)}
                >
                  {isApproved(challenge.id) ? "Completed ✅" : "Completed"}
                </button>
              </div>
            </div>
          ))}

          {/* MODAL */}
          {selectedChallenge && (
            <div
              className={styles.modalBackdrop}
              onClick={() => setSelectedChallenge(null)}
            >
              <div
                className={styles.modalContent}
                onClick={(e) => e.stopPropagation()}
              >
                <h3>{selectedChallenge.title}</h3>
                <p>{selectedChallenge.description}</p>
                <button onClick={() => setSelectedChallenge(null)}>Cerrar</button>
              </div>
            </div>
          )}
        </div>
      </PageLayout>
    </AuthGuard>
  );
}
