import Link from "next/link";

export function Brand({ footer = false }: { footer?: boolean }) {
  return (
    <Link className={`brand${footer ? " brand--footer" : ""}`} href="/">
      <span className="brand__mark" aria-hidden="true">
        <span />
        <span />
        <span />
      </span>
      <span className="brand__type">
        <strong>Church</strong>
        <span>Govern</span>
      </span>
    </Link>
  );
}
