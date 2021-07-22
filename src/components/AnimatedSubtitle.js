import React, { useState, useEffect } from "react"
import { StyleSheet, Animated } from "react-native"
import { RFValue } from "react-native-responsive-fontsize" 
import buildTransform from "../utils/buildTransform"
import { white } from "../values/colors"
import { detail_subtitle_endY } from "../values/dimens"

export default function AnimatedSubtitle({ animationRange, text, headerActualLines }){

        const [measure, setMeasure] = useState(null)
        let finalEndY

        useEffect(() => {}, [measure])

        finalEndY = headerActualLines >= 2 ? 40 : 20 //FYI: i did not use `detail_subtitle_endY` value but in real app, we will have to adjust the endY for larger screenSizes i guess
        const animateTextStyle = measure ? buildTransform(
            animationRange, 
            measure.elementX, 
            measure.elementY, 
            measure.elementHeight, 
            measure.elementWidth, 
            45, //how far to the right we want the text to move
            finalEndY, //how far to the up we want to move the text
            0.8 //scale down the text a bit
        ) : null

        /*const animateOpacity = {
            opacity: animationRange.interpolate({
                inputRange: [0, 0.9, 1],
                outputRange: [1, 0, 1],
            }),
        }*/

        const onLayoutSetMeasurements = event => {
            setMeasure({ 
                elementX: event.nativeEvent.layout.x,
                elementY: event.nativeEvent.layout.y,
                elementWidth: event.nativeEvent.layout.width,
                elementHeight: event.nativeEvent.layout.height,
            })
        }

        return (
            <Animated.Text 
                style={[styles.text, animateTextStyle ]}
                onLayout={onLayoutSetMeasurements} >
                {text}
            </Animated.Text>
        )       
}

const styles = StyleSheet.create({
    text: {        
        color: white,
        fontSize: RFValue(14),
        fontFamily: "RosarioRegular",
    }
})