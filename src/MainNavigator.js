import React from "react"
import { createStackNavigator } from "@react-navigation/stack"
import MainComponent, { MainComponentOptions } from "./components/MainComponent"
import { component_main, component_article_detail } from "./values/strings"
import ArticleDetailComponent, { ArticleDetailComponentOptions } from "./components/ArticleDetailComponent"

const Stack = createStackNavigator()
const MainNavigator = () => (
  <Stack.Navigator headerMode="screen" initialRouteName={component_main}>
    <Stack.Screen
      name={component_main}
      component={MainComponent}
      options={MainComponentOptions}
    />
    <Stack.Screen
      name={component_article_detail}
      component={ArticleDetailComponent}
      options={ArticleDetailComponentOptions}
    />
  </Stack.Navigator>
)

export default MainNavigator