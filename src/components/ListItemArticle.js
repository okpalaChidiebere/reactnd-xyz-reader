import React, { useEffect, useRef } from "react"
import { Text, View, Animated, useWindowDimensions, Pressable } from "react-native"
import { RFValue } from "react-native-responsive-fontsize" //helps our fontSoze scale regardless of the screenSize
import DynamicHeightNetworkImage from "./DynamicHeightNetworkImage"
import { white } from "../values/colors"

export default function ListItemArticle({ title, subtitle, imageSource, imageAspectRation, delay, onPress }){

    const animatedItem = useRef(new Animated.Value(0)).current
    
    const animatedItemStyle = {
        transform: [
            {
                translateY: animatedItem.interpolate({
                    inputRange: [0, 1],
                    outputRange: [useWindowDimensions().height, 1] //we want the list items to appear from the bottom of the screen, so we get the device height.
                    //NOTE: Negative value of the device height will make the items slide from the top of the screen
                })
            }
        ]
    }

    useEffect(() => {
        Animated.timing(animatedItem, {
            toValue: 1,
            duration: 300, //recommended period for animations is ~300ms
            useNativeDriver: true,
            delay: delay*100, //there will be an increase in delay for ListItemArticle animation to start which will visually increase the distance between the moving components.
        }).start()
    }, [])

    return (
        <Pressable onPress={onPress} style={{ flex: 1}}>
            <Animated.View style={{ flex: 1, flexDirection:"column", margin: 10, backgroundColor: white, ...animatedItemStyle, }}>
                <DynamicHeightNetworkImage source={{uri: imageSource}}/>
                <View style={{ paddingHorizontal: 10, paddingVertical: 16 }}>
                    <Text numberOfLines={4} style={{ fontSize: RFValue(16) }}>{title}</Text>
                    <Text numberOfLines={2} style={{ width:"100%", color:"#757575", fontSize: RFValue(14) }}>{subtitle}</Text>
                </View>
            </Animated.View>
        </Pressable>
    )
}