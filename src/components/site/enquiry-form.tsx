"use client";

import { useState, type FormEvent } from "react";

type FormKind = "demo" | "digitization" | "contact" | "topic";
type ApiResponse = { success?: boolean; message?: string; referenceId?: string; errors?: Record<string, string[]> };

const labels: Record<FormKind, { title: string; intro: string; submit: string }> = {
  demo: { title: "Request a demonstration", intro: "Tell us enough to prepare a relevant product conversation.", submit: "Send demo request" },
  digitization: { title: "Request a digitization assessment", intro: "Share an initial picture of the records you want to preserve.", submit: "Send digitization enquiry" },
  contact: { title: "Send a general enquiry", intro: "Ask a question or tell us what you would like to discuss.", submit: "Send enquiry" },
  topic: { title: "Suggest an insight topic", intro: "Recommend a useful topic related to church administration, technology or governance.", submit: "Suggest topic" },
};

function FieldError({ errors, name }: { errors: Record<string, string[]>; name: string }) {
  const message = errors[name]?.[0];
  return message ? <span className="field-error">{message}</span> : null;
}

export function EnquiryForm({ kind, compact = false }: { kind: FormKind; compact?: boolean }) {
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [message, setMessage] = useState("");
  const [reference, setReference] = useState("");
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const copy = labels[kind];

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const payload: Record<string, unknown> = Object.fromEntries(data.entries());
    if (kind === "digitization") {
      payload.pageSizes = data.getAll("pageSizes");
      if (payload.approximatePages) payload.approximatePages = Number(payload.approximatePages);
    }
    if (kind !== "topic") {
      payload.type = kind;
      payload.consent = data.get("consent") === "on";
    }
    Object.keys(payload).forEach((key) => payload[key] === "" && delete payload[key]);
    setStatus("sending"); setErrors({}); setMessage(""); setReference("");
    try {
      const response = await fetch(kind === "topic" ? "/api/topic-suggestions" : "/api/leads", {
        method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload),
      });
      const result = await response.json() as ApiResponse;
      if (!response.ok) {
        setStatus("error"); setErrors(result.errors ?? {}); setMessage(result.message ?? "We could not send your enquiry. Please review the form and try again."); return;
      }
      setStatus("success"); setMessage(result.message ?? "Thank you. Your enquiry has been received."); setReference(result.referenceId ?? ""); form.reset();
    } catch {
      setStatus("error"); setMessage("We could not reach the enquiry service. Please try again shortly.");
    }
  }

  if (status === "success") return <div className="form-success" role="status"><span aria-hidden="true">✓</span><h2>Thank you</h2><p>{message}</p>{reference && <p className="reference">Reference: {reference}</p>}<button className="text-button" type="button" onClick={() => setStatus("idle")}>Send another enquiry</button></div>;

  return (
    <form className={`enquiry-form${compact ? " enquiry-form--compact" : ""}`} onSubmit={submit}>
      <div className="form-heading"><p className="eyebrow">Start a conversation</p><h2>{copy.title}</h2><p>{copy.intro}</p></div>
      {status === "error" && <div className="form-alert" role="alert">{message}</div>}
      <div className="form-grid">
        {kind === "demo" && <>
          <label><span>Church name *</span><input name="churchName" required aria-invalid={!!errors.churchName} /><FieldError errors={errors} name="churchName" /></label>
          <label><span>Denomination *</span><input name="denomination" required aria-invalid={!!errors.denomination} /><FieldError errors={errors} name="denomination" /></label>
          <label><span>Contact person *</span><input name="contactPerson" autoComplete="name" required aria-invalid={!!errors.contactPerson} /><FieldError errors={errors} name="contactPerson" /></label>
        </>}
        {kind === "digitization" && <>
          <label><span>Church name *</span><input name="churchName" required aria-invalid={!!errors.churchName} /><FieldError errors={errors} name="churchName" /></label>
          <label><span>Contact person *</span><input name="contactPerson" autoComplete="name" required aria-invalid={!!errors.contactPerson} /><FieldError errors={errors} name="contactPerson" /></label>
        </>}
        {kind === "contact" && <label><span>Name *</span><input name="name" autoComplete="name" required aria-invalid={!!errors.name} /><FieldError errors={errors} name="name" /></label>}
        {kind === "topic" && <label><span>Name <small>(optional)</small></span><input name="name" autoComplete="name" aria-invalid={!!errors.name} /><FieldError errors={errors} name="name" /></label>}
        <label><span>Email {kind === "topic" ? <small>(optional)</small> : "*"}</span><input name="email" type="email" autoComplete="email" required={kind !== "topic"} aria-invalid={!!errors.email} /><FieldError errors={errors} name="email" /></label>
        {kind !== "topic" && <label><span>Phone {kind === "contact" ? <small>(optional)</small> : "*"}</span><input name="phone" type="tel" autoComplete="tel" required={kind !== "contact"} aria-invalid={!!errors.phone} /><FieldError errors={errors} name="phone" /></label>}
        {kind === "demo" && <>
          <label><span>Country *</span><input name="country" autoComplete="country-name" required aria-invalid={!!errors.country} /><FieldError errors={errors} name="country" /></label>
          <label><span>State / province *</span><input name="state" autoComplete="address-level1" required aria-invalid={!!errors.state} /><FieldError errors={errors} name="state" /></label>
          <label><span>District *</span><input name="district" required aria-invalid={!!errors.district} /><FieldError errors={errors} name="district" /></label>
          <label><span>City *</span><input name="city" autoComplete="address-level2" required aria-invalid={!!errors.city} /><FieldError errors={errors} name="city" /></label>
          <label><span>Postal code *</span><input name="pincode" autoComplete="postal-code" required aria-invalid={!!errors.pincode} /><FieldError errors={errors} name="pincode" /></label>
        </>}
        {kind === "digitization" && <>
          <label><span>Record age *</span><select name="recordType" required defaultValue=""><option value="" disabled>Select record age</option><option value="old">Historical / old</option><option value="new">Current / new</option><option value="both">Both old and new</option></select><FieldError errors={errors} name="recordType" /></label>
          <label><span>Approximate pages</span><input name="approximatePages" type="number" inputMode="numeric" min="1" /><FieldError errors={errors} name="approximatePages" /></label>
          <fieldset className="field-full"><legend>Page sizes *</legend><div className="check-row">{["A4", "A3", "Ledger", "Register / bound book", "Mixed / unsure"].map((size) => <label key={size}><input type="checkbox" name="pageSizes" value={size} /> {size}</label>)}</div><FieldError errors={errors} name="pageSizes" /></fieldset>
          <label><span>State / province *</span><input name="state" required /><FieldError errors={errors} name="state" /></label>
          <label><span>District *</span><input name="district" required /><FieldError errors={errors} name="district" /></label>
          <label><span>Location *</span><input name="location" required /><FieldError errors={errors} name="location" /></label>
          <label><span>Postal code *</span><input name="pincode" required /><FieldError errors={errors} name="pincode" /></label>
          <label className="field-full"><span>Additional context <small>(optional)</small></span><textarea name="comments" rows={4} /></label>
        </>}
        {kind === "contact" && <>
          <label><span>Subject *</span><input name="subject" required aria-invalid={!!errors.subject} /><FieldError errors={errors} name="subject" /></label>
          <label className="field-full"><span>Message *</span><textarea name="message" rows={5} required aria-invalid={!!errors.message} /><FieldError errors={errors} name="message" /></label>
        </>}
        {kind === "topic" && <>
          <div className="field-full topic-guidance" role="note"><strong>Suggested areas</strong><span>Church administration · technology · management · operations · engagement · digital transformation · governance · finance · record management</span></div>
          <label className="field-full"><span>Suggested topic *</span><input name="topic" required aria-invalid={!!errors.topic} /><FieldError errors={errors} name="topic" /></label>
          <label className="field-full"><span>Why would this be useful? *</span><textarea name="description" rows={4} required aria-invalid={!!errors.description} /><FieldError errors={errors} name="description" /></label>
        </>}
      </div>
      {kind !== "topic" && <label className="consent"><input type="checkbox" name="consent" required /><span>I agree that Church Govern may use these details to respond to this enquiry. See the <a href="/privacy">privacy notice</a>.</span></label>}
      <button className="button button--submit" type="submit" disabled={status === "sending"}>{status === "sending" ? "Sending…" : copy.submit}</button>
    </form>
  );
}
