import { NextPageContext } from "next";

interface ErrorProps {
  statusCode?: number;
}

export default function Error({ statusCode }: ErrorProps) {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "100vh", fontFamily: "sans-serif", color: "#334155" }}>
      <h1 style={{ fontSize: "1.8rem", marginBottom: "8px", fontWeight: 700 }}>
        {statusCode ? `An error ${statusCode} occurred` : "An error occurred"}
      </h1>
      <p style={{ color: "#64748B", fontSize: "0.95rem" }}>Please refresh or return home.</p>
    </div>
  );
}

Error.getInitialProps = ({ res, err }: NextPageContext) => {
  const statusCode = res ? res.statusCode : err ? err.statusCode : 404;
  return { statusCode };
};
