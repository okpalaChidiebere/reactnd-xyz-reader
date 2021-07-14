import React from "react"
import { createStackNavigator } from "@react-navigation/stack"
import MainComponent, { MainComponentOptions } from "./components/MainComponent"
import { component_main } from "./values/strings"


const Stack = createStackNavigator()
const MainNavigator = () => (
  <Stack.Navigator headerMode="screen" initialRouteName={component_main}>
    <Stack.Screen
      name={component_main}
      component={MainComponent}
      options={MainComponentOptions}
  />
  </Stack.Navigator>
)

export default MainNavigator