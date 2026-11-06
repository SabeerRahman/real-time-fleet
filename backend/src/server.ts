import 'dotenv/config'
import http from 'node:http'
import { Server } from 'socket.io'
import jwt from 'jsonwebtoken'
import app from './app.js'
import { Vehicle } from './models.js'
import { connectDatabase } from './database.js'

const port = Number(process.env.PORT || 5001)
await connectDatabase()
const server = http.createServer(app)
const io = new Server(server, { cors: { origin: process.env.CLIENT_URL || 'http://localhost:5174' } })
io.use((socket, next) => { try { jwt.verify(String(socket.handshake.auth.token || ''), process.env.JWT_SECRET || 'local-demo-secret-change-me'); next() } catch { next(new Error('Demo socket authentication failed.')) } })
io.on('connection', socket => { socket.emit('simulated:connection', { connected: true, label: 'Simulated local GPS feed — fictional data only.' }) })
setInterval(async () => { const vehicle = await Vehicle.findOne({ status: 'MOVING' }); if (!vehicle) return; vehicle.speed = 35 + Math.floor(Math.random() * 25); vehicle.location.lat += 0.0003; vehicle.location.lng += 0.0002; vehicle.lastUpdated = new Date(); await vehicle.save(); io.emit('simulated:position', { vehicleId: vehicle._id.toString(), speed: vehicle.speed, location: vehicle.location, lastUpdated: vehicle.lastUpdated.toISOString(), simulated: true }) }, 6000)
server.listen(port, () => console.log(`Fleet demo API + simulated Socket.IO feed listening on http://localhost:${port}`))
