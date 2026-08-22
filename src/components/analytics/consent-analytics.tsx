"use client";

import Script from "next/script";
import { useSyncExternalStore } from "react";

type Consent = "accepted" | "rejected" | null;
const storageKey = "church-govern-analytics-consent";
const consentEvent = "church-govern-consent";

function subscribe(callback: () => void) {
  window.addEventListener("storage", callback);
  window.addEventListener(consentEvent, callback);
  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener(consentEvent, callback);
  };
}

function getSnapshot(): Consent {
  const saved = window.localStorage.getItem(storageKey);
  return saved === "accepted" || saved === "rejected" ? saved : null;
}

export function ConsentAnalytics() {
  const measurementId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
  const consent = useSyncExternalStore(subscribe, getSnapshot, () => null);

  function choose(value: Exclude<Consent, null>) {
    window.localStorage.setItem(storageKey, value);
    window.dispatchEvent(new Event(consentEvent));
  }

  if (!measurementId) return null;

  return (
    <>
      {consent === "accepted" && (
        <>
          <Script src={`https://www.googletagmanager.com/gtag/js?id=${measurementId}`} strategy="afterInteractive" />
          <Script id="church-govern-ga4" strategy="afterInteractive">
            {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)};gtag('js',new Date());gtag('config','${measurementId}',{anonymize_ip:true});`}
          </Script>
        </>
      )}
      {consent === null && (
        <aside className="fixed bottom-4 left-4 right-4 z-[100] mx-auto max-w-2xl rounded-2xl border border-stone-200 bg-white p-5 shadow-2xl" aria-label="Analytics preferences">
          <p className="font-semibold text-stone-950">Help us improve Church Govern</p>
          <p className="mt-1 text-sm leading-6 text-stone-600">With your permission, privacy-conscious analytics help us understand which pages are useful. Form details and personal information are never sent to analytics.</p>
          <div className="mt-4 flex flex-wrap gap-3">
            <button type="button" onClick={() => choose("accepted")} className="rounded-full bg-emerald-900 px-5 py-2.5 text-sm font-semibold text-white">Allow analytics</button>
            <button type="button" onClick={() => choose("rejected")} className="rounded-full border border-stone-300 px-5 py-2.5 text-sm font-semibold text-stone-800">Continue without analytics</button>
          </div>
        </aside>
      )}
    </>
  );
}
