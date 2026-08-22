import Link from "next/link";
import { ArrowLeft } from "lucide-react";
export default function NotFound() { return <section className="not-found"><div className="shell"><span>404</span><p className="eyebrow">Page not found</p><h1>This path doesn’t lead where you expected.</h1><p>The page may have moved, or the address may be incomplete.</p><Link className="button" href="/"><ArrowLeft size={18} /> Return home</Link></div></section>; }
