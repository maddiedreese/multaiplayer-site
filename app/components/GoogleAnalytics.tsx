"use client";

import Script from "next/script";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const measurementId = "G-EMB8VFKS29";
const preferenceKey = "multaiplayer:analytics-consent";

type AnalyticsPreference = "accepted" | "declined" | "undecided";

export function GoogleAnalytics() {
  const pathname = usePathname();
  const [preference, setPreference] = useState<AnalyticsPreference | null>(null);

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      const stored = window.localStorage.getItem(preferenceKey);
      setPreference(stored === "accepted" || stored === "declined" ? stored : "undecided");
    }, 0);
    return () => window.clearTimeout(timeout);
  }, []);

  if (pathname === "/invite" || pathname === "/invite/" || preference === null) return null;

  const savePreference = (next: Exclude<AnalyticsPreference, "undecided">) => {
    window.localStorage.setItem(preferenceKey, next);
    setPreference(next);
  };

  return (
    <>
      {preference === "accepted" ? (
        <>
          <Script src={`https://www.googletagmanager.com/gtag/js?id=${measurementId}`} strategy="afterInteractive" />
          <Script id="google-analytics" strategy="afterInteractive">
            {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}gtag('js',new Date());gtag('config','${measurementId}',{anonymize_ip:true});`}
          </Script>
        </>
      ) : null}

      {preference === "undecided" ? (
        <aside className="analytics-consent" aria-label="Analytics choices">
          <div>
            <strong>Help improve multAIplayer</strong>
            <p>With your permission, Google Analytics measures visits and page use. It stays off until you accept. <a href="/privacy">Privacy details</a></p>
          </div>
          <div className="analytics-consent-actions">
            <button type="button" onClick={() => savePreference("declined")}>Decline</button>
            <button className="analytics-consent-accept" type="button" onClick={() => savePreference("accepted")}>Accept analytics</button>
          </div>
        </aside>
      ) : (
        <button className="analytics-choices" type="button" onClick={() => setPreference("undecided")}>Analytics choices</button>
      )}
    </>
  );
}
