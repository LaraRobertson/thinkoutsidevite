import { render, screen } from '@testing-library/react'
import { vi } from 'vitest'
import { useAuthenticator } from '@aws-amplify/ui-react'
import { createMemoryRouter, RouterProvider } from 'react-router-dom'
import Layout from '../components/Layout'
import Home from '../pages/Home'
import Login from '../pages/Login'
import Admin from '../pages/Admin'
import Game from '../pages/Game'
import ProtectedRoute from '../components/ProtectedRoute'

// Mock the data client
vi.mock('aws-amplify/data', () => ({
  generateClient: () => ({
    models: {
      Todo: {
        observeQuery: () => ({
          subscribe: vi.fn((callback) => {
            callback.next({ items: [] })
          }),
        }),
      },
    },
  }),
}))

const createTestRouter = (initialEntries: string[]) => {
  return createMemoryRouter([
    {
      path: '/',
      element: <Layout />,
      children: [
        { index: true, element: <Home /> },
        { path: 'login', element: <Login /> },
        { path: 'admin', element: <ProtectedRoute><Admin /></ProtectedRoute> },
        { path: 'game', element: <ProtectedRoute><Game /></ProtectedRoute> },
      ],
    },
  ], { initialEntries })
}

test('renders Home page at root route', () => {
  vi.mocked(useAuthenticator).mockReturnValue({
    authStatus: 'unauthenticated',
    user: null,
    route: 'signIn',
    signOut: vi.fn(),
  })

  const router = createTestRouter(['/'])
  render(<RouterProvider router={router} />)
  
  expect(screen.getByText('My todos')).toBeInTheDocument()
  expect(screen.getByText('Home')).toBeInTheDocument()
})

test('renders Login page at /login route', () => {
  vi.mocked(useAuthenticator).mockReturnValue({
    authStatus: 'unauthenticated',
    user: null,
    route: 'signIn',
    signOut: vi.fn(),
  })

  const router = createTestRouter(['/login'])
  render(<RouterProvider router={router} />)
  
  expect(screen.getByText('Login')).toBeInTheDocument()
})

test('redirects to login for protected routes when unauthenticated', () => {
  vi.mocked(useAuthenticator).mockReturnValue({
    authStatus: 'unauthenticated',
    user: null,
    route: 'signIn',
    signOut: vi.fn(),
  })

  const router = createTestRouter(['/admin'])
  render(<RouterProvider router={router} />)
  
  expect(screen.getByText('Login')).toBeInTheDocument()
})

test('allows access to protected routes when authenticated', () => {
  vi.mocked(useAuthenticator).mockReturnValue({
    authStatus: 'authenticated',
    user: { signInDetails: { loginId: 'test@example.com' } },
    route: 'authenticated',
    signOut: vi.fn(),
  })

  const router = createTestRouter(['/admin'])
  render(<RouterProvider router={router} />)
  
  expect(screen.getByText('Admin Panel')).toBeInTheDocument()
})