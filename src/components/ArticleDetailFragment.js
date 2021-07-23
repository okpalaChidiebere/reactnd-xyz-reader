import React, { useState, useRef, useEffect, useLayoutEffect } from "react"
import { View, StyleSheet, ActivityIndicator, Dimensions, Animated } from "react-native"
import moment from "moment"
import { white } from "../values/colors"
import { ItemsColumns } from "../data/ItemsDatabase"
import ArticleBodyListItem from "./ArticleBodyListItem"
import AnimatedHeader from "./AnimatedHeader"
import { detail_article_body_padding_left, detail_article_body_padding_right, 
    detail_article_body_vertical_margin, detail_banner_height } from "../values/dimens"


export default function ArticleDetailFragment({ article }){
    const tempArticleBodyArrayList = useRef(null)
    const [loading, setLoading] = useState(false)
    const [isListEnd, setIsListEnd] = useState(false)
    const [dataSource, setDataSource] = useState([])

    /**
     * We are modifying these values to optimize the flatlist based on the screensize.
     * Eg: Ipad can handle loading more item on screen that for small mobile device
     * 
     * more about optimizing flatlist here
     * https://stackoverflow.com/questions/55032060/react-native-lazy-loading-250-images-in-a-scroll-view
     */
    const {
        width: SCREEN_WIDTH,
    } = Dimensions.get('window')
    const limit = 100
    const itemsToRender = SCREEN_WIDTH >= 600 ? 20 : 25

    const scrollY = useRef(new Animated.Value(0)).current
    const instruct = useRef(new Animated.Value(0)).current

    /** 
     * Animation to bounce the article body a bit. This will let the user know that 
     * the article bidy is scrollable
     * 
     * We use this to instruct the user on how to use our app. 
     * It is called Instructive Moton
     *  */
    const insturctiveMotionScroll = Animated.sequence([
        Animated.delay(600),
        Animated.timing(instruct, { useNativeDriver: true, toValue: -10, duration: 100}),
        Animated.spring(instruct, { useNativeDriver: true, toValue: 0, friction: 2})
    ])

    const subtitle = moment(article[ItemsColumns.PUBLISHED_DATE]).format("MMMM D, YYYY")
            + " by "
            + article[ItemsColumns.AUTHOR]

    useEffect(() => {
        const body = article[ItemsColumns.BODY].replace(/\r\n|\n/g, "<br />")
        tempArticleBodyArrayList.current = splitArticleBody(body)
        getData()
    }, [])

    useLayoutEffect(() => {
        //we run instructive motion oce the component is dont mounting
        insturctiveMotionScroll.start()
    }, [])

    const renderItem = ({ item, index }) => {
    
        return (
            <ArticleBodyListItem  line={item} key={index}/>
        )
    }

    const renderFooter = () => {
        return (
          // Footer View with Loader
          <View style={styles.footer}>
            {loading ? (
              <ActivityIndicator
                color="black"
                size="large"
                style={{margin: 15}} />
            ) : null}
          </View>
        )
    }

    const renderHeader = () => {
        return <View style={{ height: detail_banner_height }}/>
    }

    const getData = () => {
        //more explanation to implement this lazy loading of more data here
        //https://medium.com/nerd-for-tech/flatlist-is-still-underrated-796130a8b8f2
        //https://levelup.gitconnected.com/react-native-firebase-cloud-firestore-implementing-infinite-scroll-lazy-loading-with-flatlist-a9e942cf66c6
        //https://aboutreact.com/infinite-list-view/
        if (!loading && !isListEnd) {
            setLoading(true)
            const moreLines = tempArticleBodyArrayList.current.splice(0,limit)
            if(moreLines.length > 0){
                setDataSource(dataSource.concat(moreLines))
                setLoading(false)
            }else{
                setIsListEnd(true)
                setLoading(false)
            }
        }
    }

    return (
        <View style={[ styles.container ]}>
            <AnimatedHeader scrollY={scrollY} title={article[ItemsColumns.TITLE]} subtitle={subtitle} uri={article[ItemsColumns.PHOTO_URL]} headerColor={article.headerColor}/>
            <Animated.View style={animatedStyle.articleBody(scrollY, instruct)}>
                <Animated.FlatList
                    data={dataSource}
                    extraData={dataSource}
                    keyExtractor={(_, k) => k.toString()}
                    onEndReached={getData}
                    ListFooterComponent={renderFooter}
                    showsVerticalScrollIndicator={false}
                    renderItem={renderItem}
                    ListHeaderComponent={renderHeader}
                    /**
                     * we bind the animated value to the ScrollView scroll position. 
                     * To do that we use an Animated.event with a mapping to the event object 
                     * property that we want to bind to the animated value.
                     * In this case it is <eventObject>.nativeEvent.contentOffset.y
                     * 
                     * https://medium.com/appandflow/react-native-scrollview-animated-header-10a18cb9469e
                     */
                    onScroll={Animated.event(
                        [{nativeEvent: {contentOffset: {y: scrollY}}}],
                        {
                            //https://animationbook.codedaily.io/animated-event/
                            /*listener: ({nativeEvent: {contentOffset: {y }}})=>{
                                console.log(y)
                            },*/
                            useNativeDriver: true, //this makes the animation calulation a lot faster, but you can directly animate the layout anymore. This means you cant directly manipulate width, height, margin, padding and top style properties
                        }
                    )}

                    /** 
                    * performance settings. 
                    * Read this article below to see why we set these values
                    * https://medium.com/sanjagh/how-to-optimize-your-react-native-flatlist-946490c8c49b
                    */
                    initialNumToRender={itemsToRender}
                    maxToRenderPerBatch={itemsToRender}
                    onEndReachedThreshold={1}
                    /** 
                     * it is important that windowSize be low as possible for this usecase. it improves render time which is 
                     * important for this article body. This is one of the important props for optimizing 
                     * flatlist. Setting this at a low value might annoy your users that like to scroll a lot, so find a sweet spot
                     * depending on the kind of data or UI. For article body, this will do :)
                     */
                    windowSize={5}
                />
            </Animated.View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: white,
        justifyContent: 'center',
        alignItems: 'center',
    },
    footer: {
        padding: 10,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
    },
})

const animatedStyle = {
    articleBody: (scrollY, instruct )=> ({
        width: "100%",
        marginBottom: 0,
        justifyContent: "center",
        alignItems: "center",
        marginVertical: detail_article_body_vertical_margin,
        paddingLeft: detail_article_body_padding_left,
        paddingRight: detail_article_body_padding_right,     
        transform: [
          {
              //We want to make the article body smaller as the scroll position enters negative value. 
              //The scroll position enters negative values noticably on iOS
            translateY: scrollY.interpolate({
              inputRange: [-detail_banner_height, 0, detail_banner_height],
              outputRange: [detail_banner_height / 2, 0, 0],
            }),
          },
          {
            translateY: instruct
          },
        ],
      }),
}

function splitArticleBody(text) {
    const articleBodyArrayList = []

    const lines = text.split("<br />")
    for (const line of lines) {
        articleBodyArrayList.push(line)
    }

    return articleBodyArrayList
}
