import {Authenticator} from '@aws-amplify/ui-react'
import { MyAuthContext } from '../MyContext';
import {useState, useEffect} from "react";
import {useNavigate} from 'react-router-dom';

export default function Login() {
  /* Modal Content */
  const [modalContent, setModalContent] = useState({open:false, content:''});
  const navigate = useNavigate();

  useEffect(() => {
    const hash = window.location.hash;
    if (hash === '#playgames') {
      navigate('/#playgames');
    }
  }, [navigate]);

  return (
      <MyAuthContext.Provider value={{ setModalContent, modalContent }}>
      <section className={"main-container"}>
        <Authenticator>
          {({ signOut, user }) => {
            if (user) {
              navigate('/#playgames');
            }
            return (
            <div>
              <h1>Welcome {user?.signInDetails?.loginId}</h1>
              <button onClick={signOut}>Sign out</button>
            </div>
            );
          }}
        </Authenticator>
      </section>
      </MyAuthContext.Provider>
  )
}