// Sentry error monitoring. Loaded after the Sentry bundle (both deferred).
if (window.Sentry) {
  Sentry.init({
    dsn: 'https://284a7c1c691a0a7941864361cbd91638@o4511513837174784.ingest.us.sentry.io/4511513851658240',
    tracesSampleRate: 0.1,
    // Don't send IP addresses or other personal data (see /privacy-policy/).
    sendDefaultPii: false,
    environment: location.hostname === 'roses-cleaning.com' ? 'production' : 'development',
  });
}
