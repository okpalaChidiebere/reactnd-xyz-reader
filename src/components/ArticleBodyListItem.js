import React from "react"
import { View, Text } from "react-native"
import { RFValue } from "react-native-responsive-fontsize"
import { colorPrimaryText, theme_accent } from "../values/colors"

const ArticleBodyListItem = React.memo(function ArticleBodyListItem({ line }) {
    return (
        
            <Text style={{
                    fontSize: RFValue(12),
                    lineHeight: 40, 
                    color: colorPrimaryText,
                    alignSelf: 'flex-start',
                }}
                selectable
                selectionColor={theme_accent}
                /**This will force the text fit the contraint of one line. more explanation in the link below
                 * https://medium.com/@vygaio/how-to-auto-adjust-text-font-size-to-fit-into-a-nodes-width-in-react-native-9f7d1d68305b */
                adjustsFontSizeToFit
                numberOfLines={1}
                minimumFontScale={.5}
            >
                {line}
            </Text>
        
    )
})

export default ArticleBodyListItem

//More about react memo
//https://dmitripavlutin.com/use-react-memo-wisely/
//https://reactjs.org/docs/react-api.html#reactmemo

