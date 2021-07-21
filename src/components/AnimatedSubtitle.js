import React, { useState, useEffect } from "react"
import { StyleSheet, Animated } from "react-native"
import { RFValue } from "react-native-responsive-fontsize" 
import buildTransform from "../utils/buildTransform"
import { white } from "../values/colors"
import { detail_subtitle_endY } from "../values/dimens"

export default function AnimatedSubtitle({ animationRange, text }){

        const [measure, setMeasure] = useState(null)

        useEffect(() => {}, [measure])

        const animateTextStyle = measure ? buildTransform(
            animationRange, 
            measure.elementX, 
            measure.elementY, 
            measure.elementHeight, 
            measure.elementWidth, 
            60, 
            detail_subtitle_endY, 
            1
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
        //marginBottom: 10
    }
})