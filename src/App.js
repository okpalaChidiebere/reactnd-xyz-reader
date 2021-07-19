import { StatusBar } from "expo-status-bar"
import React, { useEffect, useState } from "react"
import { NavigationContainer } from "@react-navigation/native"
import { SafeAreaProvider } from "react-native-safe-area-context"
import AppLoading from "expo-app-loading"
import * as Font from "expo-font"
import { Provider as StoreProvider } from "react-redux"
import store from "./store/configureStore"
import MyTheme from "./values/styles"
import { theme_primary_dark } from "./values/colors"
import MainNavigator from "./MainNavigator"
import db, { createItemsTable } from "./data/ItemsDatabase"
import { startImmediateSync } from "./data/ItemsSync"


export default function App() {
  const [appIsReady, setAppIsReady] = useState(false)

  useEffect(() => {
    (async () => {
      try{
        
        createItemsTable(db)
        await startImmediateSync()
        await Font.loadAsync({
          // Load a font `Rosario-Regular`. downloaded from https://fonts.google.com/
          RosarioRegular: require("./assets/fonts/Rosario-Regular.ttf")
        })
      }catch(e){
        console.warn("Error From NetworkFetch: ", e)
      }finally{
        // Tell the application to render
        setAppIsReady(true)
      }
    })()
  }, [])

  if (!appIsReady) {
    return <AppLoading />
  }

  return (
    <SafeAreaProvider>
      <StoreProvider store={store}>
        <NavigationContainer theme={MyTheme}>
          <StatusBar style="light" backgroundColor={theme_primary_dark}/>
          <MainNavigator />
        </NavigationContainer>
      </StoreProvider>
    </SafeAreaProvider>
  )
}