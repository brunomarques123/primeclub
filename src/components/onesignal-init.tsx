"use client";

import Script from "next/script";

declare global {
  interface Window {
    OneSignalDeferred?: unknown[];
  }
}

export default function OneSignalInit() {
  const appId = process.env.NEXT_PUBLIC_ONESIGNAL_APP_ID;
  if (!appId) return null;

  return (
    <>
      <Script src="https://cdn.onesignal.com/sdks/web/v16/OneSignalSDK.page.js" strategy="afterInteractive" />
      <Script id="onesignal-init" strategy="afterInteractive">
        {`
          window.OneSignalDeferred = window.OneSignalDeferred || [];
          OneSignalDeferred.push(function(OneSignal) {
            OneSignal.init({ appId: "${appId}" });
          });
        `}
      </Script>
    </>
  );
}
