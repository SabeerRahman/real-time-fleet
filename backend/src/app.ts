import express from 'express'
import cors from 'cors'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import { z } from 'zod'
import { Geofence, RelayAudit, User, Vehicle, roles } from './models.js'
import { connectDatabase } from './database.js'

type Role = typeof roles[number]
type RequestUser = { id: string; role: Role; name: string }
declare global { namespace Express { interface Request { demoUser?: RequestUser } } }
const app = express()
app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:5174' }))
app.use(express.json())
app.use(async (_req, _res, next) => { try { await connectDatabase(); next() } catch (error) { next(error) } })
const tokenSecret = () => process.env.JWT_SECRET || 'local-demo-secret-change-me'
const auth = (allowed?: Role[]) => (req: express.Request, res: express.Response, next: express.NextFunction) => {
  const raw = req.headers.authorization?.replace(/^Bearer\s+/i, '')
  if (!raw) return res.status(401).json({ message: 'Demo authentication is required.' })
  try { const payload = jwt.verify(raw, tokenSecret()) as RequestUser; if (allowed && !allowed.includes(payload.role)) return res.status(403).json({ message: 'Your demo role is not authorized for this action.' }); req.demoUser = payload; next() } catch { return res.status(401).json({ message: 'Demo session is invalid or expired.' }) }
}
const publicUser = (user: any) => ({ id: user._id.toString(), name: user.name, email: user.email, role: user.role })
const asyncRoute = (fn: any) => (req: any, res: any, next: any) => Promise.resolve(fn(req, res, next)).catch(next)
app.get('/api/health', (_, res) => res.json({ demo: true, status: 'ok', notice: 'Independent local academic demonstration API. All records are fictional.' }))
app.post('/api/auth/login', asyncRoute(async (req: express.Request, res: express.Response) => { const body = z.object({ email: z.string().email(), password: z.string().min(1) }).parse(req.body); const user = await User.findOne({ email: body.email.toLowerCase() }); if (!user || !(await bcrypt.compare(body.password, user.password))) return res.status(401).json({ message: 'Invalid demo credentials.' }); const safe = publicUser(user); const token = jwt.sign(safe, tokenSecret(), { expiresIn: '8h' }); res.json({ token, user: safe, demo: true }) }))
app.get('/api/auth/me', auth(), (req, res) => res.json({ user: req.demoUser, demo: true }))
app.get('/api/dashboard', auth(), asyncRoute(async (_, res: express.Response) => { const [total, moving, alerts, offline, recent] = await Promise.all([Vehicle.countDocuments(), Vehicle.countDocuments({ status: 'MOVING' }), Vehicle.countDocuments({ status: 'ALERT' }), Vehicle.countDocuments({ status: 'OFFLINE' }), Vehicle.find().sort({ lastUpdated: -1 }).limit(4)]); res.json({ total, moving, alerts, offline, recent, demo: true }) }))
app.get('/api/vehicles', auth(), asyncRoute(async (req: express.Request, res: express.Response) => { if (req.query.fail === '1') return res.status(503).json({ message: 'Simulated demonstration API failure. Use refresh to recover.' }); const q = String(req.query.q || ''); const page = Math.max(1, Number(req.query.page) || 1); const limit = 4; const sort = req.query.sort === 'registration' ? { registration: 1 } : { lastUpdated: -1 }; const filter = q ? { $or: [{ registration: { $regex: q, $options: 'i' } }, { driver: { $regex: q, $options: 'i' } }, { 'location.label': { $regex: q, $options: 'i' } }] } : {}; const [items, total] = await Promise.all([Vehicle.find(filter).sort(sort).skip((page - 1) * limit).limit(limit), Vehicle.countDocuments(filter)]); res.json({ items, total, page, pages: Math.max(1, Math.ceil(total / limit)), demo: true }) }))
app.get('/api/vehicles/:id', auth(), asyncRoute(async (req: express.Request, res: express.Response) => { const vehicle = await Vehicle.findById(req.params.id); if (!vehicle) return res.status(404).json({ message: 'Fictional vehicle not found.' }); res.json({ vehicle, demo: true }) }))
const geofenceSchema = z.object({ name: z.string().min(3).max(80), type: z.enum(['DEPOT', 'DELIVERY_ZONE', 'RESTRICTED']), center: z.string().min(3).max(100), radius: z.coerce.number().min(100).max(10000) })
app.get('/api/geofences', auth(), asyncRoute(async (_, res: express.Response) => res.json({ items: await Geofence.find().sort({ updatedAt: -1 }), demo: true })))
app.post('/api/geofences', auth(['ADMIN', 'OPERATIONS']), asyncRoute(async (req: express.Request, res: express.Response) => { const data = geofenceSchema.parse(req.body); const item = await Geofence.create({ ...data, status: 'OUTSIDE', updatedAt: new Date() }); res.status(201).json({ item, demo: true }) }))
app.patch('/api/geofences/:id', auth(['ADMIN', 'OPERATIONS']), asyncRoute(async (req: express.Request, res: express.Response) => { const data = geofenceSchema.partial().parse(req.body); const item = await Geofence.findByIdAndUpdate(req.params.id, { ...data, updatedAt: new Date() }, { new: true }); if (!item) return res.status(404).json({ message: 'Geofence not found.' }); res.json({ item, demo: true }) }))
app.post('/api/vehicles/:id/relay', auth(['ADMIN']), asyncRoute(async (req: express.Request, res: express.Response) => { const data = z.object({ action: z.enum(['ON', 'OFF']), reason: z.string().min(5).max(160) }).parse(req.body); const vehicle = await Vehicle.findById(req.params.id); if (!vehicle) return res.status(404).json({ message: 'Vehicle not found.' }); vehicle.relay = data.action; await vehicle.save(); const audit = await RelayAudit.create({ vehicle: vehicle._id, actor: req.demoUser!.id, ...data, simulated: true }); res.json({ result: { id: audit._id, action: data.action, reason: data.reason, executedAt: audit.createdAt, simulated: true }, demo: true }) }))
app.use((err: any, _: express.Request, res: express.Response, __: express.NextFunction) => { if (err instanceof z.ZodError) return res.status(422).json({ message: err.issues[0]?.message || 'Invalid input.' }); console.error(err); return res.status(500).json({ message: 'The local demo API encountered an unexpected error.' }) })
export default app
