# Screenshot evidence

All PNG files below were captured from the running local Fleet Pulse application on 6 November 2026. They have been moved to the ignored project-level `e2e-screenshots/` folder so they remain separate from the documentation and source repository. They show only fictional records from the independent academic demo. No enterprise system, live GPS feed, or physical vehicle was contacted.

| File | Caption and validation note |
| --- | --- |
| `01-login.png` | Login page before authentication. |
| `02-dashboard.png` | Authenticated admin dashboard with the simulated Socket.IO position-feed status. |
| `03-vehicle-list.png` | Searchable vehicle directory after searching for a fictional registration. |
| `04-vehicle-detail.png` | Fictional vehicle detail and telemetry screen. |
| `05-geofence.png` | Admin-created `Playwright Demo Zone`, persisted by the local Express + MongoDB API. |
| `06-relay-simulation.png` | Admin relay simulation after confirmation; the action is an audit-only fictional event. |
| `07-loading-error-state.png` | Deliberately triggered simulated API failure and recovery control. |
| `08-access-denied.png` | VIEWER role geofence restriction; no create control is displayed. |
| `09-localization.png` | Hindi navigation labels after the in-app locale toggle. |
| `10-mobile-responsive.png` | Dashboard rendered at a 390 × 844 mobile viewport. |
| `11-api-request-sanitized.png` | Public `/api/health` response; it contains no credentials or personal data. |
| `12-test-results.png` | Generated Playwright HTML report showing the actual successful browser suite. |
