import { StatusBar } from "expo-status-bar"
import React, { useEffect } from "react"
import { NavigationContainer } from "@react-navigation/native"
import { SafeAreaProvider } from "react-native-safe-area-context"
import MyTheme from "./values/styles"
import { theme_primary_dark } from "./values/colors"
import MainNavigator from "./MainNavigator"
import db, { createItemsTable } from "./data/ItemsDatabase"
import { startImmediateSync } from "./data/ItemsSync"


export default function App() {

  useEffect(() => {
    (async () => {
      try{
        
        createItemsTable(db)
        await startImmediateSync()
      }catch(e){
        console.warn("Error From NetworkFetch: ", e)
      }
    })()
  }, [])

  return (
    <SafeAreaProvider>
      <NavigationContainer theme={MyTheme}>
        <StatusBar style="light" backgroundColor={theme_primary_dark}/>
        <MainNavigator />
      </NavigationContainer>
    </SafeAreaProvider>
  )
}