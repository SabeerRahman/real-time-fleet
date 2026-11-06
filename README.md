# Real-Time Fleet Tracking Dashboard — Academic Demonstration

An independently built MCA demonstration. It uses only fictional records and deterministic simulated GPS updates; it does not use, copy, or connect to any employer system, API, vehicle or relay device.

## Stack

React + Vite + TypeScript + Tailwind + Redux Toolkit/RTK Query; Node/Express + MongoDB + Socket.IO.

## Run

1. Copy `backend/.env.example` to `backend/.env`, set a local MongoDB URI and random `JWT_SECRET`.
2. Run `pnpm install` in the project root.
3. Run `pnpm dev`.
4. Visit `http://localhost:5174`.

The backend seeds fictional data on an empty database. Demo login passwords are all `Demo@123`: `admin@fleet.demo`, `operations@fleet.demo`, and `viewer@fleet.demo`.

## Project structure

- `frontend/`: responsive React dashboard, RTK Query, Redux auth state, Socket.IO client and locales.
- `backend/`: Express REST API, MongoDB schemas, JWT role checks, Socket.IO simulation and relay audit persistence.
- `docs/`: architecture, API, testing notes and real screenshot evidence when captured.

## Limitations

The map is a coordinate/location card rather than an external map service. Socket.IO events are deterministic local simulations. Relay actions are persisted audit events marked `simulated: true`; no real device is contacted.
