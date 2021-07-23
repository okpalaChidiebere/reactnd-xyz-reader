import React, { useLayoutEffect, useRef, useState } from "react"
import { StyleSheet, Platform, TouchableNativeFeedback, Share, View, Animated, TouchableWithoutFeedback } from "react-native"
import { useTheme } from "@react-navigation/native"
import { TransitionPresets } from "@react-navigation/stack"
import { SafeAreaView } from "react-native-safe-area-context"
import PagerView from "react-native-pager-view"
import { connect } from "react-redux"
import { Entypo } from "@expo/vector-icons"
import ArticleDetailFragment from "./ArticleDetailFragment"
import { theme_accent, white } from "../values/colors"
import { ItemsColumns } from "../data/ItemsDatabase"

const initialState = {
    safeAreaBgColor: white,
    indexToShare: null,
}
function ArticleDetailComponent({ route, navigation, articleItems }){

    const { screenContainer } = useTheme()
    const pager = useRef(null)
    const scrollA = useRef(new Animated.Value(0)).current
    const animatedElevation = useRef(new Animated.Value(0)).current
    const [state, setState] = useState(initialState)

    const { itemId } = route.params
    /** 
     * We set the index for Android device here.
     * For iOS, setting the `initalPage` prop is good enough and we set undefined for android
     * */
    useLayoutEffect(() => {
        pager.current?.setPageWithoutAnimation(itemId)
    }, [])

    const pressedTranslationZ = animatedElevation.interpolate({
        inputRange: [0, 8], //this animation translation will go from 0 to 8
        outputRange: [6, 12], //our Animated View will actually go from an elevation of 6 to 12
        extrapolate: 'clamp',
    }) 

    //we dont want the shadow to rotate with icon, so we separate the styles
    const animateIconElevation = {
        ...Platform.select({
            ios: {
              shadowColor: '#000',
              shadowOffset: {width: 0, height: pressedTranslationZ},
              shadowOpacity: 0.5,
            },
            android: {
              elevation: pressedTranslationZ,
            },
        }),
    }

    const rotate = {
        transform: [
            {
                rotate: scrollA.interpolate({
                    inputRange: [0, 0.2, 0.4, 0.6, 1],
                    outputRange: ['0deg', '-90deg', '-180deg', '-270deg', '-360deg'],
                }),
            },
        ],
    }

    const shareArticle = async () => {
        const title = "XYZ Reader"
        const XYZ_READER_APP_HASHTAG = " #XYZreader"
        const artcile = articleItems[state.indexToShare]
        const textThatYouWantToShare =
            `${artcile[ItemsColumns.TITLE]}` +
            XYZ_READER_APP_HASHTAG

        /*
        More content config options here
        https://reactnative.dev/docs/share 
        https://github.com/react-native-share/react-native-share/issues/866
        https://github.com/react-native-share/react-native-share/issues/767
        */
        const content = { title, message: textThatYouWantToShare }

        try {
            const result = await Share.share(content)
              
            // The content was successfully shared.
            if (result.action === Share.sharedAction) {
                if (result.activityType) {
                    // shared with activity type of result.activityType
                } else {
                    // shared
                }
            } else if (result.action === Share.dismissedAction) {
                // The dialog has been dismissed.
            }
        }catch (error) {
            console.log(error.message)
        }
    }

    const { safeAreaBgColor } = state
    return (
        <SafeAreaView
            style={[screenContainer, {backgroundColor: safeAreaBgColor}]}
            edges={["bottom", "left", "right"]}
        >
            <PagerView 
                ref={pager}
                style={styles.viewPager}
                initialPage={Platform.OS === "ios" ? itemId : undefined}
                onPageSelected={e => {
                    setState({
                        safeAreaBgColor: articleItems[e.nativeEvent.position].headerColor,
                        indexToShare: e.nativeEvent.position,
                    })
                }}
                onPageScroll={Animated.event(
                    [{nativeEvent: {offset: scrollA }}],
                    {
                        /**
                         * FYI: I set it `useNativeDriver` to false because this component is an animated component. 
                         * This means that the animation will be a bit laggy because we are using JavaScript and not native code
                         * On android testing, the rotate FAB animaion was not as smooth due to this :()
                         * 
                         * To useNativeDriver, you will have to convert this component to an Animated Component. eg: Animated.createAnimatedComponent(PagerView)
                         * See a really good example below
                         * https://githubmemory.com/repo/callstack/react-native-pager-view/issues?cursor=Y3Vyc29yOnYyOpK5MjAyMS0wNS0xN1QxNDo0MDoxOCswODowMM41Oalp&pagination=next&page=5
                         */
                        useNativeDriver: false,
                    }
                )}
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
            {Platform.select({
                ios: (
                    <TouchableWithoutFeedback 
                        onPress={shareArticle}
                        onPressIn={() => Animated.timing(animatedElevation, {
                            useNativeDriver: true,
                            toValue: 8,
                            duration: 100,
                          }).start()} 
                          onPressOut={() => Animated.timing(animatedElevation, {
                            useNativeDriver: true,
                            toValue: 0,
                            duration: 100,
                          }).start()}
                    >
                        <Animated.View style={[styles.button, animateIconElevation]}>
                            <Animated.View style={rotate}>
                                <Entypo name="share" size={24} color="#fff"/>
                            </Animated.View>
                        </Animated.View>
                    </TouchableWithoutFeedback>
                ),
                android: (
                    <TouchableNativeFeedback background={TouchableNativeFeedback.Ripple("#E0E0E0", false, 30)}
                        onPress={shareArticle}
                        onPressIn={() => Animated.timing(animatedElevation, {
                            useNativeDriver: true,
                            toValue: 8,
                            duration: 100,
                          }).start()} 
                          onPressOut={() => Animated.timing(animatedElevation, {
                            useNativeDriver: true,
                            toValue: 0,
                            duration: 100,
                          }).start()}
                    >
                        <Animated.View style={[styles.button, animateIconElevation, rotate]}>
                            <Entypo name="share" size={24} color="#fff"/>
                        </Animated.View>
                    </TouchableNativeFeedback>
                )
            })}
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
    button: {
        backgroundColor: theme_accent,
        position: 'absolute',
        bottom: 0,
        margin: 25,
        right: 0,
        height: 60,
        width: 60,
        borderRadius: 50,
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