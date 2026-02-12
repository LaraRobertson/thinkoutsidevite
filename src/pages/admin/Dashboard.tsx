// components/Dashboard.tsx
import {useContext} from 'react';
import {View} from '@aws-amplify/ui-react';
import "../../assets/css/admin.css";
import NotAvailable from "../../components/NotAvailable.tsx";
import HomeSection from "../../components/admin/HomeSection.tsx";
import { MyAuthContext } from '../../MyContext';

export function Dashboard() {
    const context = useContext(MyAuthContext);
    if (!context) throw new Error("GameIntro must be used within MyAuthContext.Provider");
    const { authStatus } = context;
    return (
        <View position="relative">
            {(authStatus !== 'authenticated') ? (
                <NotAvailable authStatus={authStatus} />
            ) : (
                <View className={"admin-content"}>
                    <HomeSection />
                </View>
            )}
        </View>
    )
}