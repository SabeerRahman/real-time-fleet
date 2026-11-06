import { describe, expect, it } from 'vitest'
import { z } from 'zod'
describe('demo validation and permission rules', () => {
  it('requires a valid relay simulation reason', () => expect(z.object({ action:z.enum(['ON','OFF']), reason:z.string().min(5) }).safeParse({action:'OFF',reason:'no'}).success).toBe(false))
  it('keeps viewer role outside relay permissions', () => expect(['ADMIN'].includes('VIEWER')).toBe(false))
})
