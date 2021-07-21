import React, { useState, useEffect } from "react"
import { View, StatusBar, Animated, StyleSheet, Platform, Pressable } from "react-native"
import { Ionicons as Icon } from "@expo/vector-icons"
import { detail_banner_height, icon_size } from "../values/dimens"
import AnimatedSubtitle from "./AnimatedSubtitle"
import AnimatedText from "./AnimatedTitle"
import { white } from "../values/colors"
import { useSafeAreaInsets } from "react-native-safe-area-context"


export default function TopNavigation ({ title, subtitle, scrollY, uri }){
  const safeArea = useSafeAreaInsets();
  const [isTransparent, setTransparent] = useState(true)

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
        <Pressable onPress={() => console.log("here")}>
          <Icon
            name={Platform.OS === "android" ? "arrow-back" : "chevron-back"}
            size={icon_size} color={white} />
        </Pressable>
      </View>
      <Animated.View 
        style={[
          styles.bar, 
          { 
            backgroundColor: isTransparent ? 'transparent' : '#03A9F4', 
            transform: [{ translateY: headerTranslate }]
          }
        ]} 
        pointerEvents="none"
      >
        <Animated.Image
          style={animatedStyle.banner(safeArea, scrollY)}
          source={{ uri }}
        />
        <View style={{paddingHorizontal: 10, paddingLeft: 10}}>
          <AnimatedText animationRange={animationRange} text={title}/>
          <AnimatedSubtitle animationRange={animationRange} text={subtitle}/>
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
    zIndex: 1, 
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
    zIndex: 2, //the back button should appear over our appBar
    marginLeft: 10,
  }
})

const animatedStyle = {
  banner: (safeArea, scrollY) => ({
    position: "absolute",
    top: 0,
    flex: 0, 
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
