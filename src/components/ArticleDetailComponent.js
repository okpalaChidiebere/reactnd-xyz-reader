import React from "react"
import { View, StyleSheet, Text } from "react-native"
import { useTheme } from "@react-navigation/native"
import { SafeAreaView } from "react-native-safe-area-context"
import PagerView from "react-native-pager-view"
import { connect } from "react-redux"
import ArticleDetailFragment from "./ArticleDetailFragment"


function ArticleDetailComponent({ route, navigation, articleItems }){

    const { screenContainer } = useTheme()

    const { itemId } = route.params

    return (
        <SafeAreaView style={screenContainer} edges={["bottom", "left", "right"]}>
            <PagerView style={styles.viewPager} initialPage={itemId}>
                {
                    articleItems.length > 0
                    ? (
                        articleItems.map((item, key) => (
                            <ArticleDetailFragment 
                                article={item}
                                key={key}
                            />
                        ))
                    )
                    : (
                        <View style={styles.page}><Text>No Articles</Text></View>
                    )
                }
            </PagerView>
        </SafeAreaView>
    )
}

function mapStateToProps (articleItems) {
    return {
        articleItems
    }
}

const connectedArticleDetailComponent = connect(mapStateToProps)
export default connectedArticleDetailComponent(ArticleDetailComponent)

const styles = StyleSheet.create({
    viewPager: {
        flex: 1,
        backgroundColor: "transparent",
      },
      page: {
        justifyContent: 'center',
        alignItems: 'center',
      },
})

export function ArticleDetailComponentOptions({ route, navigation }){
    return {
        headerShown: false,
    }
}