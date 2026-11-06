# Test evidence

Executed against the running local application on 6 November 2026:

- `pnpm build` — passed: TypeScript check and Vite production build.
- `pnpm test` — passed: 2/2 backend validation/permission tests.
- `pnpm --filter fleet-web test:e2e` — passed: 3/3 Playwright browser/API tests.

The browser suite verifies admin sign-in, dashboard access, simulated Socket.IO feed status, vehicle search/detail, persisted geofence creation, relay simulation confirmation, deliberate API error/recovery, viewer restrictions, Hindi localization, mobile rendering, and a direct API-level `403` response for an unauthorized VIEWER geofence write. It produced the sanitized real captures in `docs/screenshots/`.
