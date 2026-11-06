import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import type { Geofence, User, Vehicle } from '../types'
import type { RootState } from '../store'
const baseUrl = import.meta.env.VITE_API_URL || (import.meta.env.DEV ? 'http://localhost:5001/api' : '/api')
export const fleetApi = createApi({ reducerPath: 'fleetApi', baseQuery: fetchBaseQuery({ baseUrl, prepareHeaders: (headers, { getState }) => { const token = (getState() as RootState).auth?.token; if (token) headers.set('authorization', `Bearer ${token}`); return headers } }), tagTypes: ['Vehicles','Geofences','Dashboard'], endpoints: builder => ({
 login: builder.mutation<{token:string;user:User}, {email:string;password:string}>({ query: body => ({ url:'auth/login', method:'POST', body }) }),
 dashboard: builder.query<any, void>({ query: () => 'dashboard', providesTags:['Dashboard'] }),
 vehicles: builder.query<{items:Vehicle[];total:number;page:number;pages:number}, {q?:string;page?:number;sort?:string;fail?:boolean}>({ query: ({ fail, ...args }) => ({ url:'vehicles', params: { ...args, ...(fail ? { fail: '1' } : {}) } }), providesTags:['Vehicles'] }),
 vehicle: builder.query<{vehicle:Vehicle}, string>({ query: id => `vehicles/${id}`, providesTags:['Vehicles'] }),
 geofences: builder.query<{items:Geofence[]}, void>({ query: () => 'geofences', providesTags:['Geofences'] }),
 saveGeofence: builder.mutation<{item:Geofence}, Partial<Geofence> & {id?:string}>({ query: ({id,...body}) => ({ url: id ? `geofences/${id}` : 'geofences', method:id?'PATCH':'POST', body }), invalidatesTags:['Geofences'] }),
 relay: builder.mutation<{result:any}, {id:string;action:'ON'|'OFF';reason:string}>({ query: ({id,...body}) => ({url:`vehicles/${id}/relay`,method:'POST',body}), invalidatesTags:['Vehicles','Dashboard'] })
}) })
export const { useLoginMutation, useDashboardQuery, useVehiclesQuery, useVehicleQuery, useGeofencesQuery, useSaveGeofenceMutation, useRelayMutation } = fleetApi
