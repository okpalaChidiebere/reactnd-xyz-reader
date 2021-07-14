import { DefaultTheme } from "@react-navigation/native"
import { white } from "./colors"

//https://reactnavigation.org/docs/themes#basic-usage
export default {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors, 
    },
    screenContainer: {
      flex: 1,
      backgroundColor: white,
    }
}