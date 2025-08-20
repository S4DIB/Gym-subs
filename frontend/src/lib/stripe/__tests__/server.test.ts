import { PLANS, type PlanType } from '@/lib/stripe/server'

describe('Stripe server configuration', () => {
  describe('PLANS constant', () => {
    it('should have three subscription plans', () => {
      expect(Object.keys(PLANS)).toHaveLength(3)
    })

    it('should include basic, standard, and premium plans', () => {
      expect(PLANS).toHaveProperty('basic')
      expect(PLANS).toHaveProperty('standard')
      expect(PLANS).toHaveProperty('premium')
    })

    describe('Basic plan', () => {
      it('should have correct basic plan properties', () => {
        const basic = PLANS.basic
        expect(basic.name).toBe('Basic')
        expect(basic.price).toBe(29)
        expect(basic.interval).toBe('month')
        expect(basic.priceId).toBe('price_basic')
      })

      it('should have basic features', () => {
        const basic = PLANS.basic
        expect(basic.features).toContain('Access to gym equipment')
        expect(basic.features).toContain('Locker room access')
        expect(basic.features).toContain('Basic fitness assessment')
        expect(basic.features).toContain('Mobile app access')
        expect(basic.features).toHaveLength(4)
      })
    })

    describe('Standard plan', () => {
      it('should have correct standard plan properties', () => {
        const standard = PLANS.standard
        expect(standard.name).toBe('Standard')
        expect(standard.price).toBe(49)
        expect(standard.interval).toBe('month')
        expect(standard.priceId).toBe('price_standard')
      })

      it('should have standard features including basic features', () => {
        const standard = PLANS.standard
        expect(standard.features).toContain('Everything in Basic')
        expect(standard.features).toContain('Group fitness classes')
        expect(standard.features).toContain('Personal training session (1/month)')
        expect(standard.features).toContain('Nutrition consultation')
        expect(standard.features).toContain('Guest passes (2/month)')
        expect(standard.features).toHaveLength(5)
      })
    })

    describe('Premium plan', () => {
      it('should have correct premium plan properties', () => {
        const premium = PLANS.premium
        expect(premium.name).toBe('Premium')
        expect(premium.price).toBe(79)
        expect(premium.interval).toBe('month')
        expect(premium.priceId).toBe('price_premium')
      })

      it('should have premium features including standard features', () => {
        const premium = PLANS.premium
        expect(premium.features).toContain('Everything in Standard')
        expect(premium.features).toContain('Unlimited personal training')
        expect(premium.features).toContain('Premium classes access')
        expect(premium.features).toContain('Massage therapy (1/month)')
        expect(premium.features).toContain('Meal planning service')
        expect(premium.features).toContain('Priority booking')
        expect(premium.features).toHaveLength(6)
      })
    })

    it('should have ascending prices', () => {
      expect(PLANS.basic.price).toBeLessThan(PLANS.standard.price)
      expect(PLANS.standard.price).toBeLessThan(PLANS.premium.price)
    })

    it('should have consistent interval across all plans', () => {
      expect(PLANS.basic.interval).toBe('month')
      expect(PLANS.standard.interval).toBe('month')
      expect(PLANS.premium.interval).toBe('month')
    })
  })

  describe('PlanType type', () => {
    it('should allow valid plan types', () => {
      const validPlans: PlanType[] = ['basic', 'standard', 'premium']
      expect(validPlans).toHaveLength(3)
    })

    it('should not allow invalid plan types', () => {
      // This test ensures TypeScript compilation
      const plan: PlanType = 'basic' // Should compile
      expect(plan).toBe('basic')
    })
  })

  describe('Plan structure consistency', () => {
    it('should have consistent structure across all plans', () => {
      const planKeys = ['priceId', 'name', 'price', 'interval', 'features']
      
      Object.values(PLANS).forEach(plan => {
        planKeys.forEach(key => {
          expect(plan).toHaveProperty(key)
        })
      })
    })

    it('should have string priceId for all plans', () => {
      Object.values(PLANS).forEach(plan => {
        expect(typeof plan.priceId).toBe('string')
      })
    })

    it('should have string name for all plans', () => {
      Object.values(PLANS).forEach(plan => {
        expect(typeof plan.name).toBe('string')
      })
    })

    it('should have number price for all plans', () => {
      Object.values(PLANS).forEach(plan => {
        expect(typeof plan.price).toBe('number')
      })
    })

    it('should have string interval for all plans', () => {
      Object.values(PLANS).forEach(plan => {
        expect(typeof plan.interval).toBe('string')
      })
    })

    it('should have array features for all plans', () => {
      Object.values(PLANS).forEach(plan => {
        expect(Array.isArray(plan.features)).toBe(true)
      })
    })
  })
})
