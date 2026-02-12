import { View, Flex} from "@aws-amplify/ui-react";
import { useNavigate } from "react-router-dom";

interface NotAvailableProps {
    message?: string;
    showBackButton?: boolean;
    authStatus?: string;
}

export default function NotAvailable({ 
    message = "This page is not available", 
    showBackButton = true,
    authStatus
}: NotAvailableProps) {
    const navigate = useNavigate();

    if (authStatus === "configuring") {
        return <View>Loading...</View>;
    }

    return (
        <View>
            <View paddingTop="30px" textAlign="center">{message}</View>
            {showBackButton && (
                <Flex justifyContent="center">
                    <button className="topLink" onClick={() => navigate('/')}>
                        Back to Home
                    </button>
                </Flex>
            )}
        </View>
    );
}
