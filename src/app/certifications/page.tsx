"use client";

import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import AuthGuard from "@/components/AuthGuard";
import PageLayout from "@/components/PageLayout";
import Sidebar from "@/components/Sidebar";
import styles from "./certifications.module.scss";

type DiplomaStatus = "pending" | "approved" | "rejected" | null;

type Diploma = {
  id: string;
  level: "A1" | "A2" | "B1" | "B2" | "C1";
  aura_used: number;
  status: DiplomaStatus;
};

const CERTIFICATIONS = [
  { 
    level: "A1", 
    aura: 10000, 
    difficulty: "Basic", 
    description: "Demonstrates basic knowledge of Spanish. You can understand simple phrases and express yourself in familiar contexts." 
  },
  { 
    level: "A2", 
    aura: 10000, 
    difficulty: "Basic/Intermediate", 
    description: "Shows ability to communicate in everyday situations, understand frequently used expressions, and engage in simple conversations." 
  },
  { 
    level: "B1", 
    aura: 15000, 
    difficulty: "Intermediate", 
    description: "Able to handle most situations while traveling, describe experiences, and give reasons and explanations for opinions." 
  },
  { 
    level: "B2", 
    aura: 15000, 
    difficulty: "Intermediate/Advanced", 
    description: "Can understand main ideas of complex texts, interact fluently with native speakers, and produce clear, detailed text on various subjects." 
  },
  { 
    level: "C1", 
    aura: 20000, 
    difficulty: "Advanced", 
    description: "Demonstrates advanced proficiency. Can understand demanding texts, express ideas fluently and spontaneously, and use Spanish effectively in academic and professional contexts." 
  },
];

const CertificationsPage: React.FC = () => {
  const [diplomas, setDiplomas] = useState<Record<string, DiplomaStatus>>({});
  const [loading, setLoading] = useState(false);
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

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

  const handleRequest = async (level: string, aura: number) => {
    setLoading(true);
    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user) throw new Error("No user logged in");

      const { error } = await supabase.from("diplomas").insert({
        user_id: user.id,
        level,
        aura_used: aura,
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

  const toggleDetails = (level: string) => {
    setExpanded((prev) => ({ ...prev, [level]: !prev[level] }));
  };

  return (
    <AuthGuard>
      <PageLayout title="Certifications">
        <div className="flex min-h-screen">
          <Sidebar />
          <main className={styles.container}>
            <div className={styles.instructions}>
              <h1>Challenge Yourself and Unlock Your DELE Certification!</h1>
              <p>
                Your dedication and hours of study are converted into <strong>Aura</strong>. 
                Exchange your Aura to request official DELE certifications and show your progress. 
                Once approved, Aura will be deducted — choose wisely and aim high!
              </p>
            </div>

            <div className={styles.certGrid}>
              <div className={styles.group}>
                {CERTIFICATIONS.slice(0, 2).map((cert) => renderCertCard(cert))}
              </div>
              <div className={styles.group}>
                {CERTIFICATIONS.slice(2, 4).map((cert) => renderCertCard(cert))}
              </div>
              <div className={`${styles.group} ${styles.single}`}>
                {renderCertCard(CERTIFICATIONS[4])}
              </div>
            </div>
          </main>
        </div>
      </PageLayout>
    </AuthGuard>
  );

  function renderCertCard(cert: typeof CERTIFICATIONS[number]) {
    const status = diplomas[cert.level] || null;
    const isExpanded = expanded[cert.level] || false;

    return (
      <div key={cert.level} className={styles.certCard}>
        <h2>{cert.level}</h2>
        <p><strong>Difficulty:</strong> {cert.difficulty}</p>
        <p><strong>Aura required:</strong> {cert.aura}</p>

        {isExpanded && <p className={styles.description}>{cert.description}</p>}

        <div className={styles.buttons}>
          <button onClick={() => toggleDetails(cert.level)}>
            {isExpanded ? "Hide Details" : "Details"}
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
              onClick={() => handleRequest(cert.level, cert.aura)}
            >
              Request
            </button>
          )}
        </div>
      </div>
    );
  }
};

export default CertificationsPage;
