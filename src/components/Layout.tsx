import { Outlet, useLocation} from 'react-router-dom'
import { useAuthenticator } from '@aws-amplify/ui-react'
import { useState, useEffect} from 'react'
import {MyAuthContext} from '../MyContext'
import TopNav from './TopNav'
import Footer from './Footer'
import { getDefaultModalContent } from '../utils/modalHelpers'
import type { ModalContent } from '../utils/modalHelpers'

export default function Layout() {
    const {authStatus, signOut, user} = useAuthenticator()
    const location = useLocation()
    const [hideNav, setHideNav] = useState(false)
    const [isChecked, setIsChecked] = useState(true)
    const [modalContent, setModalContent] = useState<ModalContent>(getDefaultModalContent())
    
    useEffect(() => {
        /* if route is admin or game set hideNav to true */
        if (location.pathname.includes('admin') || location.pathname.includes('game')) {
            setHideNav(true);
            console.log("hideNav is true");
        } else {
            setHideNav(false);
        }
    }, [location.pathname]);

    return (
        <MyAuthContext.Provider value={{setModalContent, modalContent, user, authStatus, isChecked, setIsChecked}}>
            <TopNav signOut={signOut} hideNav={hideNav}/>
            <main>
                <Outlet/>
            </main>
            <Footer signOut={signOut}  hideNav={hideNav} />
    </MyAuthContext.Provider>
  )
}