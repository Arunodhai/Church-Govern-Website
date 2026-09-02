"use client";

import { useMemo, useState, type FormEvent } from "react";
import Link from "next/link";
import { ChevronDown, ChevronUp, ExternalLink, Search, SlidersHorizontal } from "lucide-react";

export type AdminField = {
  name: string;
  label: string;
  type: "text" | "textarea" | "number" | "checkbox" | "select";
  options?: string[];
  required?: boolean;
};
export type AdminRow = {
  id: string;
  title: string;
  subtitle: string;
  status: string;
  values: Record<string, unknown>;
};

type Props = {
  collection: string;
  rows: AdminRow[];
  fields: AdminField[];
  demo: boolean;
  workflowStatuses?: string[];
  canCreate?: boolean;
  canDelete?: boolean;
  dedicatedEditor?: boolean;
};

function formValues(form: HTMLFormElement, fields: AdminField[]) {
  const data = new FormData(form);
  return Object.fromEntries(fields.map((field) => {
    if (field.type === "checkbox") return [field.name, data.get(field.name) === "on"];
    if (field.type === "number") return [field.name, Number(data.get(field.name) ?? 0)];
    const value = String(data.get(field.name) ?? "").trim();
    return [field.name, value || null];
  }));
}

export function ManagementWorkspace({ collection, rows, fields, demo, workflowStatuses, canCreate = true, canDelete = true, dedicatedEditor = false }: Props) {
  const [workspaceRows, setWorkspaceRows] = useState(rows);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [expanded, setExpanded] = useState<string | null>(null);
  const [editing, setEditing] = useState<AdminRow | null>(null);
  const [creating, setCreating] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const filtered = useMemo(() => {
    const needle = query.toLowerCase();
    return workspaceRows.filter((row) => (statusFilter === "all" || row.status === statusFilter) && `${row.title} ${row.subtitle} ${row.status}`.toLowerCase().includes(needle));
  }, [query, statusFilter, workspaceRows]);
  const statuses = useMemo(() => [...new Set(workspaceRows.map((row) => row.status))], [workspaceRows]);

  async function submitEditor(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (demo) return setMessage("Connect Supabase to save changes.");
    setBusy(true);
    setMessage(null);
    const payload = formValues(event.currentTarget, fields);
    const url = editing
      ? `/api/admin/manage/${collection}/${editing.id}`
      : `/api/admin/manage/${collection}`;
    const response = await fetch(url, {
      method: editing ? "PATCH" : "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(payload),
    });
    const result = await response.json() as { message?: string };
    setBusy(false);
    if (!response.ok) return setMessage(result.message ?? "The change could not be saved.");
    window.location.reload();
  }

  async function updateWorkflow(row: AdminRow, status: string) {
    if (demo) {
      setWorkspaceRows((current) => current.map((item) => item.id === row.id ? { ...item, status } : item));
      setMessage(`Demo status changed to ${status}. This screen-only change was not stored.`);
      return;
    }
    setBusy(true);
    const response = await fetch(`/api/admin/manage/${collection}/${row.id}`, {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ status }),
    });
    setBusy(false);
    if (!response.ok) return setMessage("The status could not be updated.");
    window.location.reload();
  }

  async function remove(row: AdminRow) {
    if (demo) return setMessage("Connect Supabase to save changes.");
    if (!window.confirm(`Delete “${row.title}”? This cannot be undone.`)) return;
    setBusy(true);
    const response = await fetch(`/api/admin/manage/${collection}/${row.id}`, { method: "DELETE" });
    setBusy(false);
    if (!response.ok) return setMessage("The record could not be deleted.");
    window.location.reload();
  }

  const editorOpen = creating || editing !== null;
  return (
    <>
      <div className="mt-7 flex flex-col gap-3 rounded-xl border border-slate-200 bg-white p-3 sm:flex-row sm:items-center">
        <label className="relative min-w-64 flex-1"><span className="sr-only">Search this workspace</span><Search className="pointer-events-none absolute left-3 top-3.5 text-slate-400" size={18} /><input
          type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search by title, person, email, or status"
          className="w-full rounded-lg border border-[#e2e7e7] bg-[#f8faf9] py-3 pl-10 pr-4 text-sm outline-none focus:border-[#8fa313] focus:bg-white"
        /></label>
        {statuses.length > 1 && <label className="relative"><span className="sr-only">Filter by status</span><SlidersHorizontal className="pointer-events-none absolute left-3 top-3.5 text-slate-400" size={17} /><select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)} className="min-h-11 w-full rounded-lg border border-slate-200 bg-white py-3 pl-9 pr-8 text-sm sm:w-auto"><option value="all">All statuses</option>{statuses.map((status) => <option key={status} value={status}>{status}</option>)}</select></label>}
        {canCreate && dedicatedEditor && <Link href={`/admin/manage/${collection}/new`} className="rounded-lg bg-[#dff43b] px-5 py-3 text-center text-sm font-semibold text-[#101112] hover:bg-[#cfe72b]">Create {collection.slice(0, -1)}</Link>}
        {fields.length > 0 && canCreate && !dedicatedEditor && <button onClick={() => { setCreating(true); setEditing(null); }} className="rounded-lg bg-[#dff43b] px-5 py-3 text-sm font-semibold text-[#101112] hover:bg-[#cfe72b]">Create record</button>}
      </div>
      {demo && <p className="mt-3 text-xs font-medium text-slate-500">Demo workspace · search, filters, details, notes and workflow controls are safe to exercise.</p>}
      {message && <p role="status" className="mt-4 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-950">{message}</p>}
      <div className="mt-4 overflow-hidden rounded-xl border border-slate-200 bg-white">
        {filtered.length === 0 ? (
          <div className="p-10 text-center text-slate-500">No records match this view.</div>
        ) : filtered.map((row) => (
          <article key={row.id} className="border-b border-slate-200 p-5 last:border-b-0">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div className="min-w-0"><div className="flex flex-wrap items-center gap-2"><h2 className="truncate font-semibold">{row.title}</h2><span className="admin-record-status rounded-md bg-slate-100 px-2 py-1 text-[0.66rem] font-bold uppercase tracking-wide text-slate-600" data-status={row.status}>{row.status}</span></div><p className="mt-1 truncate text-sm text-slate-600">{row.subtitle || row.id}</p></div>
              <div className="flex flex-wrap items-center gap-3">
              {workflowStatuses ? (
                <select
                  aria-label={`Status for ${row.title}`}
                  defaultValue={row.status}
                  disabled={busy}
                  onChange={(event) => updateWorkflow(row, event.target.value)}
                  className="min-h-11 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm capitalize"
                >
                  {workflowStatuses.map((status) => <option key={status} value={status}>{status}</option>)}
                </select>
              ) : null}
              {workflowStatuses && <button type="button" onClick={() => setExpanded((value) => value === row.id ? null : row.id)} className="inline-flex min-h-11 items-center gap-1 rounded-md px-2 text-sm font-semibold text-slate-700 hover:bg-slate-100">Details {expanded === row.id ? <ChevronUp size={15} /> : <ChevronDown size={15} />}</button>}
              {dedicatedEditor && <Link href={`/admin/manage/${collection}/${row.id}`} className="inline-flex min-h-11 items-center gap-1 text-sm font-semibold text-[#384142]">Edit <ExternalLink size={14} /></Link>}
              {fields.length > 0 && !dedicatedEditor && <button onClick={() => { setEditing(row); setCreating(false); }} className="min-h-11 text-sm font-semibold text-[#384142]">Edit</button>}
              {fields.length > 0 && canDelete && <button onClick={() => remove(row)} className="text-sm font-semibold text-red-700">Delete</button>}
              </div>
            </div>
            {workflowStatuses && expanded === row.id && <RecordDetails row={row} collection={collection} demo={demo} />}
          </article>
        ))}
      </div>
      {editorOpen && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-slate-950/60 p-4 sm:items-center" role="dialog" aria-modal="true" aria-label={editing ? "Edit record" : "Create record"}>
          <form onSubmit={submitEditor} className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-xl bg-white p-6 shadow-2xl sm:p-8">
            <div className="flex items-start justify-between gap-4">
              <div><p className="text-xs font-bold uppercase tracking-widest text-[#687413]">Structured editor</p><h2 className="mt-2 text-2xl font-semibold">{editing ? "Edit record" : "Create record"}</h2></div>
              <button type="button" onClick={() => { setEditing(null); setCreating(false); }} className="rounded-lg bg-slate-100 px-3 py-2 text-sm">Close</button>
            </div>
            <div className="mt-6 grid gap-5 sm:grid-cols-2">
              {fields.map((field) => {
                const value = editing?.values[field.name];
                const className = "mt-2 w-full rounded-lg border border-slate-300 px-3 py-2.5 outline-none focus:border-[#8fa313]";
                return (
                  <label key={`${editing?.id ?? "new"}-${field.name}`} className={field.type === "textarea" ? "sm:col-span-2 text-sm font-semibold" : "text-sm font-semibold"}>
                    {field.type === "checkbox" ? (
                      <span className="flex items-center gap-3"><input name={field.name} type="checkbox" defaultChecked={Boolean(value)} className="size-5" />{field.label}</span>
                    ) : (<>
                      {field.label}
                      {field.type === "textarea" ? <textarea name={field.name} required={field.required} defaultValue={String(value ?? "")} rows={5} className={className} />
                        : field.type === "select" ? <select name={field.name} required={field.required} defaultValue={String(value ?? field.options?.[0] ?? "")} className={className}>{field.options?.map((option) => <option key={option} value={option}>{option}</option>)}</select>
                        : <input name={field.name} type={field.type} required={field.required} defaultValue={String(value ?? "")} className={className} />}
                    </>)}
                  </label>
                );
              })}
            </div>
            <button disabled={busy} className="mt-7 rounded-lg bg-[#dff43b] px-5 py-3 font-semibold text-[#101112] disabled:opacity-50">{busy ? "Saving…" : "Save record"}</button>
          </form>
        </div>
      )}
    </>
  );
}

function RecordDetails({ row, collection, demo }: { row: AdminRow; collection: string; demo: boolean }) {
  const [notes, setNotes] = useState(String(row.values.internal_notes ?? ""));
  const [message, setMessage] = useState<string | null>(null);
  const hidden = new Set(["id", "ip_hash", "utm", "internal_notes", "assigned_to", "status", "updated_at"]);
  const entries = Object.entries(row.values).filter(([key, value]) => !hidden.has(key) && value !== null && value !== "" && value !== undefined);
  async function saveNotes() {
    if (demo) return setMessage("Demo note saved for this screen only. No personal data was stored.");
    const response = await fetch(`/api/admin/manage/${collection}/${row.id}`, { method: "PATCH", headers: { "content-type": "application/json" }, body: JSON.stringify({ status: row.status, internal_notes: notes }) });
    setMessage(response.ok ? "Notes saved." : "Notes could not be saved.");
  }
  return <div className="mt-5 grid gap-5 border-t border-slate-200 bg-slate-50 p-4 lg:grid-cols-[minmax(0,1fr)_320px]">
    <dl className="grid gap-x-5 gap-y-4 sm:grid-cols-2 xl:grid-cols-3">{entries.map(([key, value]) => <div key={key}><dt className="text-[0.65rem] font-bold uppercase tracking-wider text-slate-400">{key.replaceAll("_", " ")}</dt><dd className="mt-1 break-words text-sm text-slate-800">{Array.isArray(value) ? value.join(", ") : typeof value === "object" ? JSON.stringify(value) : String(value)}</dd></div>)}</dl>
    {collection.includes("leads") || collection === "inquiries" ? <div><label className="text-xs font-bold uppercase tracking-wider text-slate-500">Internal notes<textarea value={notes} onChange={(event) => setNotes(event.target.value)} rows={4} className="mt-2 w-full rounded-lg border border-slate-300 bg-white p-3 text-sm" /></label><button type="button" onClick={saveNotes} className="mt-2 min-h-11 rounded-lg bg-slate-900 px-3 py-2 text-xs font-semibold text-white">Save notes</button>{message && <span className="ml-3 text-xs text-slate-600">{message}</span>}</div> : null}
  </div>;
}
