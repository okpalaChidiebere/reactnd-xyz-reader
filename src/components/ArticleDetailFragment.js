import React, { useState, useRef, useEffect } from "react"
import { View, StyleSheet, FlatList, ActivityIndicator, Dimensions } from "react-native"
import { white } from "../values/colors"
import { ItemsColumns } from "../data/ItemsDatabase"
import ArticleBodyListItem from "./ArticleBodyListItem"


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

    useEffect(() => {
        const body = article[ItemsColumns.BODY].replace(/\r\n|\n/g, "<br />")
        tempArticleBodyArrayList.current = splitArticleBody(body)
        getData()
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
            <FlatList
                data={dataSource}
                extraData={dataSource}
                keyExtractor={(_, k) => k.toString()}
                onEndReached={getData}
                ListFooterComponent={renderFooter}
                showsVerticalScrollIndicator={false}
                renderItem={renderItem}

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

function splitArticleBody(text) {
    const articleBodyArrayList = []

    const lines = text.split("<br />")
    for (const line of lines) {
        articleBodyArrayList.push(line)
    }

    return articleBodyArrayList
}
