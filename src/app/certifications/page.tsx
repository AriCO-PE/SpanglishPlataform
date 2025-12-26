"use client";

import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import AuthGuard from "@/components/AuthGuard";
import PageLayout from "@/components/PageLayout";
import styles from "./certifications.module.scss";

type DiplomaStatus = "pending" | "approved" | "rejected" | null;

type Diploma = {
  id: string;
  level: "A1" | "A2" | "B1" | "B2" | "C1";
  points_used: number;
  status: DiplomaStatus;
};

const CERTIFICATIONS = [
  { level: "A1", points: 10000, difficulty: "Basic" },
  { level: "A2", points: 10000, difficulty: "Basic/Intermediate" },
  { level: "B1", points: 15000, difficulty: "Intermediate" },
  { level: "B2", points: 15000, difficulty: "Intermediate/Advanced" },
  { level: "C1", points: 20000, difficulty: "Advanced" },
];

const CertificationsPage: React.FC = () => {
  const [diplomas, setDiplomas] = useState<Record<string, DiplomaStatus>>({});
  const [loading, setLoading] = useState(false);

  const fetchDiplomas = async () => {
    setLoading(true);
    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user) throw new Error("No user logged in");

      const { data, error } = await supabase
        .from("diplomas")
        .select("*")
        .eq("user_id", user.id);

      if (error) throw error;

      const statusMap: Record<string, DiplomaStatus> = {};
      data?.forEach((d: any) => {
        statusMap[d.level] = d.status;
      });
      setDiplomas(statusMap);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleRequest = async (level: string, points: number) => {
    setLoading(true);
    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user) throw new Error("No user logged in");

      const { error } = await supabase.from("diplomas").insert({
        user_id: user.id,
        level,
        points_used: points,
      });

      if (error) throw error;

      setDiplomas((prev) => ({ ...prev, [level]: "pending" }));
    } catch (err) {
      console.error(err);
      alert("Error requesting the diploma");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDiplomas();
  }, []);

  return (
    <AuthGuard>
      <PageLayout title="Certifications">
        <div className={styles.container}>
          <div className={styles.instructions}>
            <p>
              You can exchange your challenge points to request a DELE
              certification. Once your request is approved, the points will be
              deducted from your account.
            </p>
          </div>

          <div className={styles.certGrid}>
            {CERTIFICATIONS.map((cert) => {
              const status = diplomas[cert.level] || null;

              return (
                <div key={cert.level} className={styles.certCard}>
                  <h2>{cert.level}</h2>
                  <p>Difficulty: {cert.difficulty}</p>
                  <p>Points required: {cert.points}</p>

                  <div className={styles.buttons}>
                    <button
                      onClick={() =>
                        alert(
                          `Details for ${cert.level}:\nDifficulty: ${cert.difficulty}\nPoints: ${cert.points}`
                        )
                      }
                    >
                      Details
                    </button>

                    {status === "approved" ? (
                      <button className={styles.approved} disabled>
                        ✅ Approved
                      </button>
                    ) : status === "pending" ? (
                      <button className={styles.pending} disabled>
                        ⏳ Verifying
                      </button>
                    ) : (
                      <button
                        className={styles.request}
                        disabled={loading}
                        onClick={() =>
                          handleRequest(cert.level, cert.points)
                        }
                      >
                        Request
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </PageLayout>
    </AuthGuard>
  );
};

export default CertificationsPage;
