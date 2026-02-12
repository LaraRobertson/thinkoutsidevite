import { createBrowserRouter } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import Login from './pages/Login'
import Admin from './pages/Admin'
import { Games } from './pages/admin/Games';
import { Users  } from './pages/admin/Users';
import { Dashboard  } from './pages/admin/Dashboard';
import Game from './pages/Game'
import HowToPlay from './pages/HowToPlay'
import Community from './pages/Community'
import ProtectedRoute from './components/ProtectedRoute'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      { index: true, element: <Home /> },
      { path: 'login', element: <Login /> },
      { path: 'howtoplay', element: <HowToPlay /> },
      { path: 'community', element: <Community /> },
      { path: 'admin', element: <ProtectedRoute><Admin /></ProtectedRoute>,
       children: [
           { index: true, element: <Dashboard /> },
           { path: 'games', element: <Games /> },
           { path: 'users', element: <Users  /> },
       ]},
      { path: 'game', element: <Game /> },
    ],
  },
])
