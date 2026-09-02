"use client";

import { Search } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import type { PublicModule } from "@/lib/content/types";
import { ModuleCard } from "./module-card";

type Suite = PublicModule["suite"];
const suites: Suite[] = ["Office suite", "Member suite"];

export function ProductModuleExplorer({ modules }: { modules: PublicModule[] }) {
  const [suite, setSuite] = useState<Suite>("Office suite");
  const [query, setQuery] = useState("");

  useEffect(() => {
    const syncHash = () => {
      if (window.location.hash === "#member-suite") setSuite("Member suite");
      if (window.location.hash === "#office-suite") setSuite("Office suite");
    };
    syncHash();
    window.addEventListener("hashchange", syncHash);
    return () => window.removeEventListener("hashchange", syncHash);
  }, []);

  const shown = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return modules.filter((module) => module.suite === suite && (!normalized || `${module.name} ${module.summary}`.toLowerCase().includes(normalized)));
  }, [modules, query, suite]);

  function choose(nextSuite: Suite) {
    setSuite(nextSuite);
    setQuery("");
    const hash = nextSuite === "Office suite" ? "office-suite" : "member-suite";
    window.history.replaceState(null, "", `#${hash}`);
  }

  return (
    <section className="section module-explorer" id={suite === "Office suite" ? "office-suite" : "member-suite"} aria-labelledby="module-explorer-title">
      <div className="shell">
        <div className="module-explorer__heading">
          <div>
            <p className="eyebrow">Explore the platform</p>
            <h2 id="module-explorer-title">Find the right capability.</h2>
          </div>
          <p>Switch between the team and member experiences, then search by the work you need to support.</p>
        </div>
        <div className="module-explorer__controls">
          <div className="suite-tabs" role="tablist" aria-label="Product suite">
            {suites.map((item) => {
              const count = modules.filter((module) => module.suite === item).length;
              return <button key={item} type="button" role="tab" aria-selected={suite === item} onClick={() => choose(item)}>{item}<span>{count}</span></button>;
            })}
          </div>
          <label className="module-search"><span>Search modules</span><div><Search aria-hidden="true" size={19} /><input value={query} onChange={(event) => setQuery(event.target.value)} type="search" placeholder="e.g. records, finance, family" /></div></label>
        </div>
        <p className="module-result-count" aria-live="polite">Showing {shown.length} {suite.toLowerCase()} {shown.length === 1 ? "module" : "modules"}</p>
        {shown.length ? <div className="module-grid">{shown.map((module) => <ModuleCard key={module.slug} module={module} />)}</div> : <div className="empty-state" role="status"><h2>No matching modules</h2><p>Try another term or clear the search to see every module in this suite.</p><button className="text-button" type="button" onClick={() => setQuery("")}>Clear search</button></div>}
      </div>
    </section>
  );
}
