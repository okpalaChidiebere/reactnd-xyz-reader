import React, { useState, useEffect, useCallback } from "react"
import { View, StatusBar, Animated, StyleSheet, Platform, Pressable } from "react-native"
import { Ionicons as Icon } from "@expo/vector-icons"
import { LinearGradient } from "expo-linear-gradient"
import { detail_banner_height, icon_size } from "../values/dimens"
import AnimatedSubtitle from "./AnimatedSubtitle"
import AnimatedText from "./AnimatedTitle"
import { white } from "../values/colors"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import * as RootNavigation from "../utils/navigationUtils"
import { component_main } from "../values/strings"


export default function TopNavigation ({ title, subtitle, scrollY, uri, headerColor }){
  const safeArea = useSafeAreaInsets();
  const [isTransparent, setTransparent] = useState(true)

  const [headerTitleActualLines, setActualLines] = useState(1)

  /** Used to measure the number of lines the Header title has for its text */
  const onTextLayout = useCallback(e => {
    //we get the actual number of lines for the text view
    setActualLines(e.nativeEvent.lines.length)
  }, [])

  //We pass this range to the header smaller elements we wnt to move around like title, and subtitles
  const animationRange =  scrollY.interpolate({
      inputRange: [0, detail_banner_height],
      outputRange: [0, 1],
      extrapolate: 'clamp',
  })

  //when the flatlist is at rest or scroll postion at negative valie, 
  //we show the header in full size, as the use scrolls up the article body to read,
  //we reduce the header height to half of its original height
  const headerTranslate = scrollY.interpolate({
    inputRange: [-detail_banner_height, 0, detail_banner_height],
    outputRange: [detail_banner_height, 0, -(detail_banner_height/2)],
    extrapolate: 'clamp',
  })

  const interpolatedElevation = scrollY.interpolate({
      inputRange: [0, detail_banner_height/2],
      outputRange: [0, 6], //Remember the max elevation for an appBar should be 6 according to Material design
      extrapolate: 'clamp', //dont forget to clamp. We want to stop animating at value 6
  })

  //on iOS, we want no not show any shadow when the header is at rest and gradually reveal the shadow as the user scrolls
  const shadowOpacityIos = interpolatedElevation.interpolate({
    inputRange: [0, 6],
    outputRange: [0.0, 0.5],
    //we dont have to clamp here because the parent is clamped :)
})


  useEffect(() => {
    if (!scrollY) {
      return
    }
    //attach a listener to the scroll position
    const listenerId = scrollY.addListener(a => {
      isTransparent !== a.value < 4 && 
      setTransparent(!isTransparent)
    })
    return () => scrollY.removeListener(listenerId) //remove the listener once this comonent unmoints
  })

  return (
    <>
      <StatusBar
        barStyle={isTransparent ? 'light-content' : 'dark-content'}
        backgroundColor="transparent"
        translucent
      />
      <View style={[styles.iconBackButton, { marginTop: Platform.OS === "ios" ? safeArea.top : safeArea.top + 10}]}>
        <Pressable onPress={() => RootNavigation.navigate(component_main)}>
          <Icon
            name={Platform.OS === "android" ? "arrow-back" : "chevron-back"}
            size={icon_size} color={white} />
        </Pressable>
      </View>
      <Animated.View 
        style={[
          styles.bar, 
          { 
            backgroundColor: isTransparent ? 'transparent' : headerColor, 
            ...Platform.select({
              ios: {
                shadowColor: '#000',
                shadowOffset: {width: 0, height: interpolatedElevation},
                shadowOpacity: shadowOpacityIos,
              },
              android: {
                elevation: interpolatedElevation,
              },
            }),
            transform: [{ translateY: headerTranslate }]
          }
        ]} 
        pointerEvents="none"
      >
        <Animated.Image
          style={animatedStyle.banner(safeArea, scrollY)}
          source={{ uri }}
        />
        <LinearGradient
          // Background Linear Gradient
          //i could do ["#00000000","#00000000", "#4d000000"], but i did not want the middle to be transparent
          colors={["#00000000", "#4d000000"]}
          start={[0.1, 0.1]}
          style={styles.scrim}
        />
        <View style={{paddingHorizontal: 10, paddingLeft: 10}}>
          <AnimatedText animationRange={animationRange} text={title} handleOnTextLayout={onTextLayout} headerActualLines={headerTitleActualLines}/>
          <AnimatedSubtitle animationRange={animationRange} text={subtitle} headerActualLines={headerTitleActualLines}/>
        </View>
      </Animated.View>
    </>
  );
};

const styles = StyleSheet.create({
  bar: {
    position: 'absolute',
    flex: 0, 
    top: 0,
    zIndex: 2, 
    height:detail_banner_height, 
    width:  "100%", 
    justifyContent: "flex-end",
    alignItems: "flex-start",
    paddingBottom: 16,
  },
  iconBackButton: { 
    position: "absolute",
    top: 0,
    left: 0,
    zIndex: 3, //the back button should appear over our appBar
    marginLeft: 10,
    /**
     * Since the backbutton is not iside the `bar`, we have to explicitly 
     * set the elevation to be atleast above the max elevation for the `bar` area
     */
    elevation: 7, //7 > 6, so it will always appear over the appBar
  },
  scrim: {
    position: 'absolute',
    flex: 0, 
    top: 0,
    zIndex: 1,
    width: '100%',
    height:detail_banner_height, 
    opacity: 0.95,
  },
})

const animatedStyle = {
  banner: (safeArea, scrollY) => ({
    position: "absolute",
    top: 0,
    flex: 0, 
    zIndex: 0, 
    height: detail_banner_height+ safeArea.top,
    width: "100%",
    resizeMode: "cover",
    //if the flalist is at rest, we show the header background image, as the user scrolls up we fade out the image
    opacity: scrollY.interpolate({
      inputRange: [0, 100, detail_banner_height],
      outputRange: [1, 0, 0],
      extrapolate: "clamp",
    }),
    transform: [
      {
        //More noticable on iOS, but as the user scrolls down when the flatlist is at reast causing the scroll position to have negative values
        //(meaning we scale the image up), we want to have the image cover the spaces in the statusbar
        translateY: scrollY.interpolate({
          inputRange: [0, 100, detail_banner_height],
          outputRange: [-safeArea.top, -safeArea.top, 0],
          extrapolate: "clamp",
        })
      },
      {
        //If the scroll position is neagtive, we want to increase the size of the image
        scale: scrollY.interpolate({
          inputRange: [-detail_banner_height, 0, detail_banner_height, detail_banner_height + 1],
          outputRange: [2, 1, 1, 1],
        })
      }
    ],
  }),
}
