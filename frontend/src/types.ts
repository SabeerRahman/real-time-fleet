export type Role = 'ADMIN' | 'OPERATIONS' | 'VIEWER'
export type Vehicle = { _id: string; registration: string; driver: string; type: string; status: 'MOVING'|'IDLE'|'OFFLINE'|'ALERT'; speed: number; fuel: number; location: { lat:number; lng:number; label:string }; lastUpdated:string; relay:'ON'|'OFF' }
export type Geofence = { _id:string; name:string; type:'DEPOT'|'DELIVERY_ZONE'|'RESTRICTED'; center:string; radius:number; status:'INSIDE'|'OUTSIDE'; updatedAt:string }
export type User = { id:string; name:string; email:string; role:Role }
