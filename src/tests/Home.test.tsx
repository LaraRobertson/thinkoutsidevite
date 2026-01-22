import { render, screen } from '@testing-library/react'
import { vi } from 'vitest'
import { useAuthenticator } from '@aws-amplify/ui-react'
import { BrowserRouter } from 'react-router-dom'
import Home from '../pages/Home'

// Mock the data client
vi.mock('aws-amplify/data', () => ({
  generateClient: () => ({
    models: {
      Todo: {
        observeQuery: () => ({
          subscribe: vi.fn((callback) => {
            callback.next({ items: [
              { id: '1', content: 'Test todo 1' },
              { id: '2', content: 'Test todo 2' }
            ]})
          }),
        }),
        create: vi.fn(),
      },
    },
  }),
}))

const renderHome = () => {
  return render(
    <BrowserRouter>
      <Home />
    </BrowserRouter>
  )
}

test('shows todos for everyone', () => {
  vi.mocked(useAuthenticator).mockReturnValue({
    authStatus: 'unauthenticated',
    user: null,
    route: 'signIn',
    signOut: vi.fn(),
  })

  renderHome()
  
  expect(screen.getByText('My todos')).toBeInTheDocument()
  expect(screen.getByText('Test todo 1')).toBeInTheDocument()
  expect(screen.getByText('Test todo 2')).toBeInTheDocument()
})

test('hides + new button for unauthenticated users', () => {
  vi.mocked(useAuthenticator).mockReturnValue({
    authStatus: 'unauthenticated',
    user: null,
    route: 'signIn',
    signOut: vi.fn(),
  })

  renderHome()
  
  expect(screen.queryByText('+ new')).not.toBeInTheDocument()
})

test('shows + new button for authenticated users', () => {
  vi.mocked(useAuthenticator).mockReturnValue({
    authStatus: 'authenticated',
    user: { signInDetails: { loginId: 'test@example.com' } },
    route: 'authenticated',
    signOut: vi.fn(),
  })

  renderHome()
  
  expect(screen.getByText('+ new')).toBeInTheDocument()
})