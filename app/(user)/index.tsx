import { useAuth } from "@/providers/AuthProvider";
import { Redirect } from "expo-router";
import { ActivityIndicator } from "react-native";



export default function TabIndex(){

    const {session, loading } = useAuth();

    if (loading) {
        return <ActivityIndicator />;
    }
    
    if (!session) {
        return <Redirect href={'/sign-in'} />;
    }

    return <Redirect href={'/(user)/workout'} />
}