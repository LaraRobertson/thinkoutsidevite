import '@testing-library/jest-dom'
import { vi } from 'vitest'

// Mock AWS Amplify
vi.mock('@aws-amplify/ui-react', () => ({
  useAuthenticator: vi.fn(() => ({
    authStatus: 'authenticated',
    user: { signInDetails: { loginId: 'test@example.com' } },
    route: 'authenticated',
    signOut: vi.fn(),
  })),
  Authenticator: ({ children }: any) => children({ 
    signOut: vi.fn(), 
    user: { signInDetails: { loginId: 'test@example.com' } } 
  }),
}))

vi.mock('aws-amplify/data', () => ({
  generateClient: () => ({
    models: {
      Todo: {
        observeQuery: () => ({
          subscribe: vi.fn(),
        }),
        create: vi.fn(),
        delete: vi.fn(),
      },
    },
  }),
}))