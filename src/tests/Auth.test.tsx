import { render, screen } from '@testing-library/react'
import { vi } from 'vitest'
import { useAuthenticator } from '@aws-amplify/ui-react'
import { createMemoryRouter, RouterProvider } from 'react-router-dom'
import Layout from '../components/Layout'
import Home from '../pages/Home'
import Login from '../pages/Login'
import Admin from '../pages/Admin'
import Game from '../pages/GameV1.tsx'
import ProtectedRoute from '../components/ProtectedRoute'

// Mock the data client
vi.mock('aws-amplify/data', () => ({
  generateClient: () => ({
    models: {
      Todo: {
        observeQuery: () => ({
          subscribe: vi.fn((callback) => {
            callback.next({ items: [
              { id: '1', content: 'Todo by user 1' },
              { id: '2', content: 'Todo by user 2' }
            ]})
          }),
        }),
        create: vi.fn(),
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

test('shows all todos when unauthenticated but hides + new button', () => {
  vi.mocked(useAuthenticator).mockReturnValue({
    authStatus: 'unauthenticated',
    user: null,
    route: 'signIn',
    signOut: vi.fn(),
  })

  const router = createTestRouter(['/'])
  render(<RouterProvider router={router} />)
  
  expect(screen.getByText('My todos')).toBeInTheDocument()
  expect(screen.getByText('Todo by user 1')).toBeInTheDocument()
  expect(screen.getByText('Todo by user 2')).toBeInTheDocument()
  expect(screen.queryByText('+ new')).not.toBeInTheDocument()
})

test('shows all todos and + new button when authenticated', () => {
  vi.mocked(useAuthenticator).mockReturnValue({
    authStatus: 'authenticated',
    user: { signInDetails: { loginId: 'test@example.com' } },
    route: 'authenticated',
    signOut: vi.fn(),
  })

  const router = createTestRouter(['/'])
  render(<RouterProvider router={router} />)
  
  expect(screen.getByText('My todos')).toBeInTheDocument()
  expect(screen.getByText('Todo by user 1')).toBeInTheDocument()
  expect(screen.getByText('Todo by user 2')).toBeInTheDocument()
  expect(screen.getByText('+ new')).toBeInTheDocument()
})