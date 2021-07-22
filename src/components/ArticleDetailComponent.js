import React, { useLayoutEffect, useRef, useState } from "react"
import { StyleSheet, Platform } from "react-native"
import { useTheme } from "@react-navigation/native"
import { TransitionPresets } from "@react-navigation/stack"
import { SafeAreaView } from "react-native-safe-area-context"
import PagerView from "react-native-pager-view"
import { connect } from "react-redux"
import ArticleDetailFragment from "./ArticleDetailFragment"
import { white } from "../values/colors"


function ArticleDetailComponent({ route, navigation, articleItems }){

    const { screenContainer } = useTheme()
    const pager = useRef(null)
    const [safeAreaBgColor, setSafeAreaBgColor] = useState(white)

    const { itemId } = route.params
    /** 
     * We set the index for Android device here.
     * For iOS, setting the `initalPage` prop is good enough and we set undefined for android
     * */
    useLayoutEffect(() => {
        pager.current?.setPageWithoutAnimation(itemId)
    }, [])

    return (
        <SafeAreaView
            style={[screenContainer, {backgroundColor: safeAreaBgColor}]}
            edges={["bottom", "left", "right"]}
        >
            <PagerView 
                ref={pager}
                style={styles.viewPager}
                initialPage={Platform.OS === "ios" ? itemId : undefined}
                onPageSelected={e => setSafeAreaBgColor(articleItems[e.nativeEvent.position].headerColor)}
            >
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