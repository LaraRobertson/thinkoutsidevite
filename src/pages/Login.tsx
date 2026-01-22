import {Authenticator, useAuthenticator} from '@aws-amplify/ui-react'
import TopNav from "../components/TopNav.tsx";
import { MyAuthContext } from '../MyContext';
import {useState} from "react";

export default function Login() {
  const {  signOut } = useAuthenticator((context) => [
    context.authStatus,
    context.user,
    context.signOut,
  ]);
  /* Modal Content */
  const [modalContent, setModalContent] = useState({open:false, content:''});

  return (
      <MyAuthContext.Provider value={{ setModalContent, modalContent }}>
      <section className={"main-container"}>
        <Authenticator>
          {({ signOut, user }) => (
            <div>
              <h1>Welcome {user?.signInDetails?.loginId}</h1>
              <button onClick={signOut}>Sign out</button>
            </div>
          )}
        </Authenticator>
      </section>
      </MyAuthContext.Provider>
  )
}