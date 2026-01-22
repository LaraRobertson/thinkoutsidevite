import { Outlet} from 'react-router-dom'
import { useAuthenticator } from '@aws-amplify/ui-react'
import { useState } from 'react'
import { MyAuthContext } from '../MyContext'
import TopNav from './TopNav'
import Footer from './Footer'

export default function Layout() {
  const { authStatus, signOut, user } = useAuthenticator()
  const [modalContent, setModalContent] = useState({
    open: false,
    content: '',
    id: '',
    modalClass: '',
    modalClassOpen: '',
    action: '',
    gameID: '',
    zoneID: '',
    updatedDB: false
  })

  return (
    <MyAuthContext.Provider value={{ setModalContent, modalContent, user, authStatus }}>
        <TopNav signOut={signOut} />
        <main className={"background-dark"}>
          <Outlet />
        </main>
        <Footer signOut={signOut} />
    </MyAuthContext.Provider>
  )
}