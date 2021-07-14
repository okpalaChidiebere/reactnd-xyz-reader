import { StatusBar } from "expo-status-bar"
import React from "react"
import { NavigationContainer } from "@react-navigation/native"
import { SafeAreaProvider } from "react-native-safe-area-context"
import MyTheme from "./values/styles"
import { theme_primary_dark } from "./values/colors"
import MainNavigator from "./MainNavigator"


export default function App() {

  return (
    <SafeAreaProvider>
      <NavigationContainer theme={MyTheme}>
        <StatusBar style="light" backgroundColor={theme_primary_dark}/>
        <MainNavigator />
      </NavigationContainer>
    </SafeAreaProvider>
  )
}