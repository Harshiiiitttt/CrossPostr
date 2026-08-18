import Link from "next/link";

export default function Custom404() {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "100vh", fontFamily: "sans-serif", color: "#334155" }}>
      <h1 style={{ fontSize: "2rem", marginBottom: "8px", fontWeight: 700 }}>404 - Page Not Found</h1>
      <p style={{ color: "#64748B", marginBottom: "16px" }}>The requested page could not be found.</p>
      <Link href="/" style={{ color: "#2D8A4E", fontWeight: 600, textDecoration: "none" }}>
        ← Return to CuddlyTails Suite
      </Link>
    </div>
  );
}
