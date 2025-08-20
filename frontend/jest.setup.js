import '@testing-library/jest-dom'

// Polyfill for Next.js API route testing
global.Request = class Request {
  constructor(url, options = {}) {
    // Make url read-only
    Object.defineProperty(this, 'url', {
      value: url,
      writable: false,
      configurable: false,
      enumerable: true,
    })
    this.method = options.method || 'GET'
    this.headers = options.headers || new Headers()
    this.body = options.body
  }
}

global.Response = class Response {
  constructor(body, options = {}) {
    this.body = body
    this.status = options.status || 200
    this.headers = options.headers || new Headers()
  }

  async json() {
    return typeof this.body === 'string' ? JSON.parse(this.body) : this.body
  }
}

global.Headers = class Headers {
  constructor(init = {}) {
    this._headers = new Map()
    if (init) {
      Object.entries(init).forEach(([key, value]) => {
        this.set(key, value)
      })
    }
  }

  set(name, value) {
    this._headers.set(name.toLowerCase(), value)
  }

  get(name) {
    return this._headers.get(name.toLowerCase()) || null
  }

  has(name) {
    return this._headers.has(name.toLowerCase())
  }

  append(name, value) {
    const existing = this.get(name)
    if (existing) {
      this.set(name, `${existing}, ${value}`)
    } else {
      this.set(name, value)
    }
  }

  delete(name) {
    this._headers.delete(name.toLowerCase())
  }

  forEach(callback, thisArg) {
    this._headers.forEach((value, name) => {
      callback.call(thisArg, value, name, this)
    })
  }

  entries() {
    return this._headers.entries()
  }

  keys() {
    return this._headers.keys()
  }

  values() {
    return this._headers.values()
  }

  [Symbol.iterator]() {
    return this._headers.entries()
  }
}

// Mock Next.js router
jest.mock('next/navigation', () => ({
  useRouter() {
    return {
      push: jest.fn(),
      replace: jest.fn(),
      prefetch: jest.fn(),
      back: jest.fn(),
      forward: jest.fn(),
      refresh: jest.fn(),
    }
  },
  useSearchParams() {
    return new URLSearchParams()
  },
  usePathname() {
    return '/'
  },
}))

// Mock Firebase
jest.mock('firebase/auth', () => ({
  onAuthStateChanged: jest.fn(),
  signOut: jest.fn(),
  GoogleAuthProvider: jest.fn(),
}))

jest.mock('firebase/app', () => ({
  initializeApp: jest.fn(),
  getApps: jest.fn(() => []),
}))

jest.mock('firebase/firestore', () => ({
  getFirestore: jest.fn(),
}))

// Mock Stripe
jest.mock('stripe', () => {
  return jest.fn().mockImplementation(() => ({
    checkout: {
      sessions: {
        create: jest.fn(),
      },
    },
    webhooks: {
      constructEvent: jest.fn(),
    },
  }))
})

// Mock environment variables
process.env.NEXT_PUBLIC_FIREBASE_API_KEY = 'test-api-key'
process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN = 'test-domain'
process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID = 'test-project'
process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET = 'test-bucket'
process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID = 'test-sender'
process.env.NEXT_PUBLIC_FIREBASE_APP_ID = 'test-app-id'
process.env.STRIPE_SECRET_KEY = 'test-stripe-key'

// Global test utilities
global.ResizeObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}))

global.matchMedia = jest.fn().mockImplementation((query) => ({
  matches: false,
  media: query,
  onchange: null,
  addListener: jest.fn(),
  removeListener: jest.fn(),
  addEventListener: jest.fn(),
  removeEventListener: jest.fn(),
  dispatchEvent: jest.fn(),
}))
