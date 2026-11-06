# Local demonstration API

All routes are newly built for this academic demo and operate only on fictional MongoDB data.

| Method | Route | Access |
|---|---|---|
| POST | `/api/auth/login` | Public demo sign-in |
| GET | `/api/auth/me` | Signed-in user |
| GET | `/api/dashboard` | Any demo role |
| GET | `/api/vehicles` | Any demo role |
| GET | `/api/vehicles/:id` | Any demo role |
| GET/POST | `/api/geofences` | GET any; POST ADMIN/OPERATIONS |
| PATCH | `/api/geofences/:id` | ADMIN/OPERATIONS |
| POST | `/api/vehicles/:id/relay` | ADMIN only; simulated audit action |

Socket.IO authenticates the same demo JWT and emits `simulated:position` roughly every six seconds. These events are generated from fictional local records and never contact GPS hardware.
