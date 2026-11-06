import bcrypt from 'bcryptjs'
import { Geofence, User, Vehicle } from './models.js'
export async function seedDemo() {
  if (await User.countDocuments()) return
  const password = await bcrypt.hash('Demo@123', 10)
  await User.insertMany([{ name: 'Demo Administrator', email: 'admin@fleet.demo', password, role: 'ADMIN' }, { name: 'Demo Operations', email: 'operations@fleet.demo', password, role: 'OPERATIONS' }, { name: 'Demo Viewer', email: 'viewer@fleet.demo', password, role: 'VIEWER' }])
  const now = new Date()
  await Vehicle.insertMany([
    { registration: 'DL 01 FT 1024', driver: 'Ravi Kumar', type: 'Refrigerated Van', status: 'MOVING', speed: 42, fuel: 68, location: { lat: 28.6139, lng: 77.209, label: 'Connaught Place, New Delhi' }, lastUpdated: now, relay: 'ON' },
    { registration: 'MH 12 FT 8891', driver: 'Anika Shah', type: 'Box Truck', status: 'IDLE', speed: 0, fuel: 43, location: { lat: 19.076, lng: 72.8777, label: 'Andheri East, Mumbai' }, lastUpdated: now, relay: 'OFF' },
    { registration: 'KA 01 FT 4733', driver: 'Sanjay Rao', type: 'Cargo Van', status: 'ALERT', speed: 18, fuel: 14, location: { lat: 12.9716, lng: 77.5946, label: 'MG Road, Bengaluru' }, lastUpdated: now, relay: 'ON' },
    { registration: 'TN 09 FT 2408', driver: 'Meera Iyer', type: 'Mini Truck', status: 'OFFLINE', speed: 0, fuel: 52, location: { lat: 13.0827, lng: 80.2707, label: 'T Nagar, Chennai' }, lastUpdated: new Date(now.getTime() - 3600000), relay: 'OFF' },
    { registration: 'GJ 01 FT 5670', driver: 'Farhan Ali', type: 'Refrigerated Van', status: 'MOVING', speed: 55, fuel: 81, location: { lat: 23.0225, lng: 72.5714, label: 'Navrangpura, Ahmedabad' }, lastUpdated: now, relay: 'ON' }
  ])
  await Geofence.insertMany([{ name: 'Delhi Central Depot', type: 'DEPOT', center: 'New Delhi', radius: 750, status: 'INSIDE', updatedAt: now }, { name: 'Mumbai Delivery Zone', type: 'DELIVERY_ZONE', center: 'Andheri', radius: 1200, status: 'INSIDE', updatedAt: now }, { name: 'Bengaluru Restricted Area', type: 'RESTRICTED', center: 'MG Road', radius: 400, status: 'OUTSIDE', updatedAt: now }])
}
