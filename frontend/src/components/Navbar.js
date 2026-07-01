"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { clearAuthSession, getAuthSession } from "@/lib/storage";

const NAV_LINKS = [
  { label: "Dashboard", href: "/dashboard", roles: ["ADMIN", "STAFF", "STUDENT"] },
  { label: "Students",  href: "/students",  roles: ["ADMIN", "STAFF"] },
  { label: "Courses",   href: "/courses",   roles: ["ADMIN", "STAFF", "STUDENT"] },
  { label: "Profile",   href: "/profile",   roles: ["ADMIN", "STAFF", "STUDENT"] },
];

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const [session, setSession] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);

  // Re-read session whenever the route changes so the navbar
  // updates immediately after login / logout.
  useEffect(() => {
    setSession(getAuthSession());
  }, [pathname]);

  function handleLogout() {
    clearAuthSession();
    setSession(null);
    router.push("/login");
  }

  // Hide the navbar completely on the login / register pages
  // when the user is NOT logged in.
  const isAuthPage = pathname === "/login" || pathname === "/register";
  if (!session && isAuthPage) return null;
  if (!session) return null;

  // Only show links that are allowed for the current role
  const visibleLinks = NAV_LINKS.filter((link) =>
    link.roles.includes(session?.role)
  );

  return (
    <nav style={styles.nav}>
      <div style={styles.inner}>
        {/* Brand */}
        <Link href="/dashboard" style={styles.brand}>
          <span style={styles.brandIcon}>🎓</span>
          <span style={styles.brandText}>SMS</span>
        </Link>

        {/* Desktop links */}
        <div style={styles.links}>
          {visibleLinks.map((link) => {
            const active = pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                style={{
                  ...styles.link,
                  ...(active ? styles.linkActive : {}),
                }}
              >
                {link.label}
                {active && <span style={styles.linkDot} />}
              </Link>
            );
          })}
        </div>

        {/* Right side */}
        <div style={styles.right}>
          {session?.role && (
            <span style={styles.roleBadge}>{session.role}</span>
          )}
          <button onClick={handleLogout} style={styles.logoutBtn}>
            Logout
          </button>

          {/* Mobile hamburger */}
          <button
            style={styles.hamburger}
            onClick={() => setMenuOpen((o) => !o)}
            aria-label="Toggle menu"
          >
            <span style={styles.hamburgerLine} />
            <span style={styles.hamburgerLine} />
            <span style={styles.hamburgerLine} />
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div style={styles.mobileMenu}>
          {visibleLinks.map((link) => {
            const active = pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                style={{
                  ...styles.mobileLink,
                  ...(active ? styles.mobileLinkActive : {}),
                }}
                onClick={() => setMenuOpen(false)}
              >
                {link.label}
              </Link>
            );
          })}
          <button
            onClick={() => {
              setMenuOpen(false);
              handleLogout();
            }}
            style={styles.mobileLogout}
          >
            Logout
          </button>
        </div>
      )}
    </nav>
  );
}


/* ─── Inline styles ─────────────────────────────────────────────── */
const styles = {
  nav: {
    position: "sticky",
    top: 0,
    zIndex: 50,
    background: "rgba(255,255,255,0.85)",
    backdropFilter: "blur(12px)",
    WebkitBackdropFilter: "blur(12px)",
    borderBottom: "1px solid #e2e8f0",
    boxShadow: "0 1px 8px rgba(0,0,0,0.06)",
  },
  inner: {
    maxWidth: "72rem",
    margin: "0 auto",
    padding: "0 1.5rem",
    height: "3.75rem",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "1rem",
  },
  brand: {
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
    textDecoration: "none",
    flexShrink: 0,
  },
  brandIcon: {
    fontSize: "1.4rem",
    lineHeight: 1,
  },
  brandText: {
    fontSize: "1.1rem",
    fontWeight: 800,
    color: "#0f172a",
    letterSpacing: "-0.02em",
  },
  links: {
    display: "flex",
    alignItems: "center",
    gap: "0.25rem",
    flex: 1,
    justifyContent: "center",
  },
  link: {
    position: "relative",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: "0.45rem 0.9rem",
    borderRadius: "0.6rem",
    fontSize: "0.9rem",
    fontWeight: 600,
    color: "#475569",
    textDecoration: "none",
    transition: "background 0.15s, color 0.15s",
  },
  linkActive: {
    background: "#f0fdfa",
    color: "#0f766e",
  },
  linkDot: {
    position: "absolute",
    bottom: "4px",
    width: "4px",
    height: "4px",
    borderRadius: "50%",
    background: "#0d9488",
  },
  right: {
    display: "flex",
    alignItems: "center",
    gap: "0.75rem",
    flexShrink: 0,
  },
  roleBadge: {
    padding: "0.2rem 0.65rem",
    borderRadius: "999px",
    fontSize: "0.7rem",
    fontWeight: 700,
    textTransform: "uppercase",
    letterSpacing: "0.05em",
    background: "#f1f5f9",
    color: "#64748b",
  },
  logoutBtn: {
    padding: "0.4rem 1rem",
    borderRadius: "0.6rem",
    fontSize: "0.875rem",
    fontWeight: 600,
    background: "#fee2e2",
    color: "#b91c1c",
    border: "none",
    cursor: "pointer",
    transition: "background 0.15s",
  },
  hamburger: {
    display: "none",
    flexDirection: "column",
    gap: "4px",
    background: "none",
    border: "none",
    cursor: "pointer",
    padding: "4px",
  },
  hamburgerLine: {
    display: "block",
    width: "22px",
    height: "2px",
    background: "#475569",
    borderRadius: "2px",
  },
  mobileMenu: {
    display: "flex",
    flexDirection: "column",
    padding: "0.75rem 1.5rem 1rem",
    borderTop: "1px solid #e2e8f0",
    gap: "0.25rem",
  },
  mobileLink: {
    padding: "0.6rem 0.75rem",
    borderRadius: "0.5rem",
    fontSize: "0.95rem",
    fontWeight: 600,
    color: "#475569",
    textDecoration: "none",
  },
  mobileLinkActive: {
    background: "#f0fdfa",
    color: "#0f766e",
  },
  mobileLogout: {
    marginTop: "0.5rem",
    padding: "0.6rem 0.75rem",
    borderRadius: "0.5rem",
    fontSize: "0.95rem",
    fontWeight: 600,
    background: "#fee2e2",
    color: "#b91c1c",
    border: "none",
    cursor: "pointer",
    textAlign: "left",
  },
};
