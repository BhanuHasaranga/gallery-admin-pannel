import React from 'react';
import Script from 'next/script';

export default function GoogleAnalytics() {
  const measurementId = process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID;

  if (!measurementId) {
    console.error('Missing Google Analytics Measurement ID');
    return null;
  }

  return (
    <Script
      strategy="afterInteractive" // Load the script after the initial render
      src={`https://www.googletagmanager.com/gtag/js?id=${measurementId}`}
    />
  );
}
