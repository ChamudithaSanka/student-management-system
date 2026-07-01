"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getAuthSession } from "@/lib/storage";
import { getProfile } from "@/lib/api";

export default function ProfilePage() {
  const router = useRouter();
  const [profile, setProfile] = useState(null);
  const [message, setMessage] = useState("Loading profile...");

  const session = getAuthSession();
  const isStudent = session?.role === "STUDENT";

  useEffect(() => {
    const sess = getAuthSession();
    if (!sess?.token) {
      router.push("/login");
      return;
    }

    async function loadProfile() {
      try {
        const data = await getProfile(sess.token);
        setProfile(data);
        setMessage("");
      } catch (error) {
        setMessage(error.message || "Unable to load profile.");
      }
    }

    loadProfile();
  }, [router]);

  const roleBadgeColor = {
    ADMIN:   { bg: "#fef3c7", color: "#92400e" },
    STAFF:   { bg: "#dbeafe", color: "#1e40af" },
    STUDENT: { bg: "#d1fae5", color: "#065f46" },
  };

  const badge = roleBadgeColor[profile?.role] ?? { bg: "#f1f5f9", color: "#64748b" };

  return (
    <main style={styles.main}>
      <section style={styles.card}>
        <div style={styles.header}>
          <div style={styles.avatarCircle}>
            {profile?.fullName?.charAt(0)?.toUpperCase() ?? "?"}
          </div>
          <div>
            <h1 style={styles.name}>{profile?.fullName ?? "—"}</h1>
            <p style={styles.email}>{profile?.email ?? "—"}</p>
          </div>
        </div>

        {message && (
          <p style={styles.infoMsg}>{message}</p>
        )}

        {profile && (
          <div style={styles.fields}>
            <div style={styles.field}>
              <span style={styles.fieldLabel}>Full Name</span>
              <span style={styles.fieldValue}>{profile.fullName}</span>
            </div>

            <div style={styles.field}>
              <span style={styles.fieldLabel}>Email</span>
              <span style={styles.fieldValue}>{profile.email}</span>
            </div>

            <div style={styles.field}>
              <span style={styles.fieldLabel}>Role</span>
              <span style={{ ...styles.roleBadge, background: badge.bg, color: badge.color }}>
                {profile.role}
              </span>
            </div>

            <div style={styles.field}>
              <span style={styles.fieldLabel}>Member Since</span>
              <span style={styles.fieldValue}>
                {profile.createdAt
                  ? new Date(profile.createdAt).toLocaleDateString("en-US", {
                      year: "numeric", month: "long", day: "numeric",
                    })
                  : "—"}
              </span>
            </div>

            {isStudent && (
              <p style={styles.viewOnlyNotice}>
                🔒 Your profile is view only. Contact an admin to update your information.
              </p>
            )}
          </div>
        )}
      </section>
    </main>
  );
}


const styles = {
  main: {
    display: "flex",
    justifyContent: "center",
    alignItems: "flex-start",
    padding: "3rem 1.5rem",
    minHeight: "80vh",
  },
  card: {
    width: "100%",
    maxWidth: "480px",
    background: "#ffffff",
    borderRadius: "1.25rem",
    border: "1px solid #e2e8f0",
    boxShadow: "0 4px 24px rgba(0,0,0,0.07)",
    padding: "2rem",
  },
  header: {
    display: "flex",
    alignItems: "center",
    gap: "1.25rem",
    marginBottom: "2rem",
    paddingBottom: "1.5rem",
    borderBottom: "1px solid #f1f5f9",
  },
  avatarCircle: {
    width: "64px",
    height: "64px",
    borderRadius: "50%",
    background: "linear-gradient(135deg, #0d9488, #0f766e)",
    color: "#ffffff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "1.75rem",
    fontWeight: 800,
    flexShrink: 0,
  },
  name: {
    fontSize: "1.4rem",
    fontWeight: 700,
    color: "#0f172a",
    margin: 0,
  },
  email: {
    fontSize: "0.875rem",
    color: "#64748b",
    margin: "0.2rem 0 0",
  },
  infoMsg: {
    padding: "0.75rem 1rem",
    background: "#f8fafc",
    borderRadius: "0.75rem",
    fontSize: "0.875rem",
    color: "#64748b",
    marginBottom: "1.5rem",
  },
  fields: {
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
  },
  field: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "0.75rem 1rem",
    background: "#f8fafc",
    borderRadius: "0.75rem",
    gap: "1rem",
  },
  fieldLabel: {
    fontSize: "0.8rem",
    fontWeight: 600,
    color: "#94a3b8",
    textTransform: "uppercase",
    letterSpacing: "0.05em",
    flexShrink: 0,
  },
  fieldValue: {
    fontSize: "0.95rem",
    fontWeight: 500,
    color: "#0f172a",
    textAlign: "right",
  },
  roleBadge: {
    padding: "0.25rem 0.75rem",
    borderRadius: "999px",
    fontSize: "0.75rem",
    fontWeight: 700,
    textTransform: "uppercase",
    letterSpacing: "0.05em",
  },
  viewOnlyNotice: {
    marginTop: "0.5rem",
    padding: "0.75rem 1rem",
    background: "#fafafa",
    border: "1px dashed #cbd5e1",
    borderRadius: "0.75rem",
    fontSize: "0.8rem",
    color: "#64748b",
    textAlign: "center",
  },
};
