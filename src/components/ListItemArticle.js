import React from "react"
import { Text, View } from "react-native"
import { RFValue } from "react-native-responsive-fontsize" //helps our fontSoze scale regardless of the screenSize
import DynamicHeightNetworkImage from "./DynamicHeightNetworkImage"
import { white } from "../values/colors"

export default function ListItemArticle({ title, subtitle, imageSource, imageAspectRation }){

    return (
        <View style={{flex: 1, flexDirection:"column", margin: 10, backgroundColor: white }}>
            <DynamicHeightNetworkImage source={{uri: imageSource}}/>
            <View style={{ paddingHorizontal: 10, paddingVertical: 16 }}>
                <Text numberOfLines={4} style={{ fontSize: RFValue(16) }}>{title}</Text>
                <Text numberOfLines={2} style={{ width:"100%", color:"#757575", fontSize: RFValue(14) }}>{subtitle}</Text>
            </View>
        </View>
    )
}