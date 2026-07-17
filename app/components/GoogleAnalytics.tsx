"use client";

import Script from "next/script";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const measurementId = "G-EMB8VFKS29";
const preferenceKey = "multaiplayer:analytics-consent";
const disableKey = `ga-disable-${measurementId}`;

type AnalyticsPreference = "accepted" | "declined" | "undecided";
type AnalyticsWindow = Window & {
  gtag?: (...args: unknown[]) => void;
  [disableKey]?: boolean;
};

function clearAnalyticsCookies() {
  const cookieNames = document.cookie
    .split(";")
    .map((cookie) => cookie.trim().split("=", 1)[0])
    .filter((name) => /^_(?:ga(?:_|$)|gid$|gat(?:_|$))/.test(name));
  for (const name of cookieNames) {
    const expired = `${name}=; Max-Age=0; Path=/; SameSite=Lax`;
    document.cookie = expired;
    if (window.location.hostname.includes(".")) document.cookie = `${expired}; Domain=.${window.location.hostname}`;
  }
}

function setAnalyticsRuntimeEnabled(enabled: boolean) {
  const analyticsWindow = window as AnalyticsWindow;
  analyticsWindow[disableKey] = !enabled;
  analyticsWindow.gtag?.("consent", "update", { analytics_storage: enabled ? "granted" : "denied" });
  if (!enabled) clearAnalyticsCookies();
}

export function GoogleAnalytics() {
  const pathname = usePathname();
  const [preference, setPreference] = useState<AnalyticsPreference | null>(null);

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      let stored: string | null = null;
      try {
        stored = window.localStorage.getItem(preferenceKey);
      } catch {
        // Storage can be unavailable in hardened browsing modes; analytics stays off.
      }
      const next = stored === "accepted" || stored === "declined" ? stored : "undecided";
      setAnalyticsRuntimeEnabled(next === "accepted");
      setPreference(next);
    }, 0);
    return () => window.clearTimeout(timeout);
  }, []);

  if (pathname === "/invite" || pathname === "/invite/" || preference === null) return null;

  const savePreference = (next: Exclude<AnalyticsPreference, "undecided">) => {
    try {
      window.localStorage.setItem(preferenceKey, next);
    } catch {
      // Keep the choice for this page even when persistence is unavailable.
    }
    setAnalyticsRuntimeEnabled(next === "accepted");
    setPreference(next);
  };

  const reopenChoices = () => {
    setAnalyticsRuntimeEnabled(false);
    setPreference("undecided");
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
        <button className="analytics-choices" type="button" onClick={reopenChoices}>Analytics choices</button>
      )}
    </>
  );
}
