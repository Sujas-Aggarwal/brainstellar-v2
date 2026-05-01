import posthog from 'posthog-js';

const isBrowser = typeof window !== 'undefined';

export const initPostHog = () => {
  if (isBrowser) {
    const key = import.meta.env.VITE_POSTHOG_KEY;
    const host = import.meta.env.VITE_POSTHOG_HOST;

    if (key && host) {
      posthog.init(key, {
        api_host: host,
        person_profiles: 'identified_only',
        capture_pageview: false, // We handle this manually for SPA transitions
        // Disable session recording on all pages (prevents loading posthog-recorder.js ~47KiB)
        disable_session_recording: ['.*'] as unknown as boolean,
        // Disable surveys (prevents loading surveys.js ~32KiB)
        disable_surveys: true,
      });
    }
  }
};

export const trackEvent = (event: string, properties?: Record<string, any>) => {
  if (isBrowser) {
    posthog.capture(event, properties);
  }
};

export const identifyUser = (id: string, properties?: Record<string, any>) => {
  if (isBrowser) {
    posthog.identify(id, properties);
  }
};

export const resetUser = () => {
  if (isBrowser) {
    posthog.reset();
  }
};

export default posthog;
