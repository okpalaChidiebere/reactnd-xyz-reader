import React, { useState, useRef, useEffect } from "react"
import { View, StyleSheet, FlatList, ActivityIndicator } from "react-native"
import { useTheme } from "@react-navigation/native"
import { white } from "../values/colors"
import { ItemsColumns } from "../data/ItemsDatabase"
import ArticleBodyListItem from "./ArticleBodyListItem"


export default function ArticleDetailFragment({ route, navigation }){
    const { screenContainer } = useTheme()

    const tempArticleBodyArrayList = useRef(null)
    const [loading, setLoading] = useState(false)
    const [isListEnd, setIsListEnd] = useState(false)
    const [dataSource, setDataSource] = useState([])


    useEffect(() => {
        const { article } = route.params
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
        if (!loading && !isListEnd) {
            setLoading(true)
            const moreLines = tempArticleBodyArrayList.current.splice(0,300)
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
        <View style={[screenContainer, styles.container]} >
            <FlatList
                data={dataSource}
                extraData={dataSource}
                renderItem={renderItem}
                keyExtractor={(_, k) => k.toString()}
                ListFooterComponent={renderFooter}
                initialNumToRender={300}
                onEndReached={getData}
                scrollEventThrottle={1}
                onEndReachedThreshold={1}
                updateCellsBatchingPeriod={100}
                onEndThreshold={0}
                maxToRenderPerBatch={100}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: white
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
