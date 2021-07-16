import React, { useState } from "react"
import { Image, View } from "react-native"

export default function DynamicHeightNetworkImage({ source }){

    const [measure, setMeasure] = useState({
        width: 0,
        height: 0,
    })

    /*useEffect(() => {
    }, [measure])*/
    //https://stackoverflow.com/questions/29642685/maintain-aspect-ratio-of-image-with-full-width-in-react-native
    //https://stackoverflow.com/questions/41735846/how-to-get-image-height-and-width-from-uri-on-react-native

    function calculateRatio (a, b) {
        return (b == 0) ? a : calculateRatio (b, a%b);
    }

    const onLayoutSetMeasurements = event => {

        const measuredWidth = event.nativeEvent.layout.width

        Image.getSize(source.uri, (width, height) => {

            /** Aspect ratio helps us enforce the size of the Component (Image) itself */
            const r = calculateRatio (width, height)
            //console.log("Aspect ratio = " + width/r + ":" + height/r);
            setMeasure({ 
                width: measuredWidth,
                height: parseInt(measuredWidth * (height/r) / (width/r)), 
                //NOTE: the aspect ratio here is not fixed for our app. If we wanted it fixed, look at the links above to see how to do that
            })
        }, (error) => {
            console.error(`Couldn't get the image size: ${error.message}`);
        })

    }

    return (
        <View onLayout={onLayoutSetMeasurements}>
            <Image
                source={source}
                style={{
                    width: measure.width,
                    height: measure.height,
                    resizeMode: "center" //this makes the content fit within the image component
                    /*
                    one good thing about determing the width and height dymaically is because you will not have to worry
                    much about the 'resizeMode' attribute. Knowing aspectRatio of the image, you could calculate the size
                    of the image component and the image quality will still be thesame regardless of the screensize*/
                }} />
        </View>
    )
}