import { configureStore, createSlice, type PayloadAction } from '@reduxjs/toolkit'
import { fleetApi } from './services/api'
import type { User } from './types'
const saved = localStorage.getItem('fleet_demo_session')
const auth = createSlice({ name: 'auth', initialState: saved ? JSON.parse(saved) as { token:string; user:User } : null as { token:string; user:User } | null, reducers: { setSession: (_, action:PayloadAction<{token:string;user:User}>) => action.payload, logout: () => null } })
export const { setSession, logout } = auth.actions
export const store = configureStore({ reducer: { auth: auth.reducer, [fleetApi.reducerPath]: fleetApi.reducer }, middleware: getDefault => getDefault().concat(fleetApi.middleware) })
store.subscribe(() => { const session = store.getState().auth; if (session) localStorage.setItem('fleet_demo_session', JSON.stringify(session)); else localStorage.removeItem('fleet_demo_session') })
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
