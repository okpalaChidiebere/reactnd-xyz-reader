import React, { useState, useEffect } from "react"
import { StyleSheet, Animated } from "react-native"
import { RFValue } from "react-native-responsive-fontsize" 
import buildTransform from "../utils/buildTransform"
import { white } from "../values/colors"
import { detail_title_text_size } from "../values/dimens"

export default function AnimatedTitle({ animationRange, text, handleOnTextLayout, headerActualLines }){

        const [measure, setMeasure] = useState(null)

        useEffect(() => {}, [measure])

        const animateTextStyle = measure ? buildTransform( 
            animationRange, 
            measure.elementX, 
            measure.elementY, 
            measure.elementHeight, 
            measure.elementWidth, 
            45, 
            -30, //how far to the up we want to move the text
            0.7 //scale down the text a bit
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
                style={[
                    {
                        ...styles.text, 
                        marginTop: headerActualLines >= 2 ? -40 : 0 //for larger screen sizes, we will consider adjusting this margin based on line height as well which i did not do :)
                    }, 
                    animateTextStyle
                ]}
                onTextLayout={handleOnTextLayout}
                onLayout={onLayoutSetMeasurements} >
                {text}
            </Animated.Text>
        )       
}

const styles = StyleSheet.create({
    text: {        
        fontSize: RFValue(detail_title_text_size),
        color: white,
        fontWeight: 'bold',
        fontFamily: "RosarioRegular",
        paddingRight: 14,
    }
})