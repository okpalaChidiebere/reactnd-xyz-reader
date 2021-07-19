import React from "react"
import { View, StyleSheet, Text } from "react-native"
import { useTheme } from "@react-navigation/native"
import { TransitionPresets } from "@react-navigation/stack"
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
        /**
         * Define Component Screen Transition; how we want this screen to appear in UI when navigated to
         * learn more here https://reactnavigation.org/docs/stack-navigator/#animations
         * https://www.youtube.com/watch?v=PvjV96CNPqM
         */
        ...TransitionPresets.ModalSlideFromBottomIOS,
    }
}