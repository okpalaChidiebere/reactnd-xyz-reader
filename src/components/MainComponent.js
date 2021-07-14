import React from "react"
import { Text, View }  from "react-native"
import { useTheme } from "@react-navigation/native"
import { SafeAreaView } from "react-native-safe-area-context"
import { app_name } from "../values/strings"
import { theme_primary, white } from "../values/colors"

export default function MainComponent(){
    const { screenContainer } = useTheme()

    return (
        <SafeAreaView style={screenContainer} edges={["bottom", "left", "right"]}>
            <View style={screenContainer}>
                <Text>Open MainComponent.js to start working on your app!</Text>
            </View>
        </SafeAreaView>
    )
}

export function MainComponentOptions(){
    return {
        title: app_name,
        headerTintColor: white,
        headerStyle: { 
            backgroundColor: theme_primary,
        },
    }
}