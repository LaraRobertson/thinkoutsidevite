// components/Users.tsx
import {useContext} from 'react';
import {View} from '@aws-amplify/ui-react';
import "../../assets/css/admin.css";
import NotAvailable from "../../components/NotAvailable.tsx";
import UserSection from "../../components/admin/UserSection.tsx";
import { MyAuthContext } from '../../MyContext';

export function Users() {
    const context = useContext(MyAuthContext);
    if (!context) throw new Error("GameIntro must be used within MyAuthContext.Provider");
    const { authStatus } = context;
    return (
        <View position="relative">
            {(authStatus !== 'authenticated') ? (
                <NotAvailable authStatus={authStatus} />
            ) : (
                <View className={"admin-content"}>
                    <UserSection />
                </View>
            )}
        </View>
    )
}