import React, { useEffect, useState } from "react"
import { View, FlatList, Image }  from "react-native"
import { useTheme } from "@react-navigation/native"
import { SafeAreaView } from "react-native-safe-area-context"
import moment from "moment"
import { connect } from "react-redux"
import { app_name, component_article_detail } from "../values/strings"
import { theme_primary, white } from "../values/colors"
import { startImmediateSync } from "../data/ItemsSync"
import db, { ItemsColumns } from "../data/ItemsDatabase"
import { loadAllArticles } from "../data/ItemsSelectionBuilder"
import ListItemArticle from "./ListItemArticle"
import { receiveArticles } from "../actions"
import { fetchColors } from "../remote/RemoteEndpointUtil"
import { app_header_logo_height, app_header_logo_width } from "../values/dimens"


const TAG = "MainComponent"

function MainComponent({ route, navigation, articleItems, dispatch }){
    const { screenContainer } = useTheme()
    const [isRefreshing, setRefreshing] = useState(true)

    const updateRefreshingUI = () => {
        setRefreshing(false)
    }

    const receiveNewArticlesItems = async() => {
        const newData = await loadAllArticles(db)
        //fetch colors for each artcile photo which we will set for each ArtcileFragment header and safeAreaBackground(for iOS only)
        const articlesWithColors = await fetchColors(newData)
        dispatch(receiveArticles(articlesWithColors))
    }

    useEffect(() => {
        (async () => {
            await receiveNewArticlesItems()
            updateRefreshingUI()
        })()
    }, [])

    const refresh = async () => {
        setRefreshing(true)
        /**
         * More ways to implment this logic
         * https://medium.com/enappd/refreshcontrol-pull-to-refresh-in-react-native-apps-dfe779118f75
         */
       try{
            await startImmediateSync()
            await receiveNewArticlesItems()
        }catch(e){
            console.warn(TAG ,"Error From NetworkFetch: ", e)
        }finally{
            updateRefreshingUI()
        }
    }

    const renderItem = ({ item, index }) => {
        const subtitle = moment(item[ItemsColumns.PUBLISHED_DATE]).format("MMMM D, YYYY")
            + "\n" + " by "
            + item[ItemsColumns.AUTHOR]

        return(
            <ListItemArticle
                onPress={() => navigation.navigate(component_article_detail, { itemId: index, article: item })}
                delay={index%6}
                title={item[ItemsColumns.TITLE]}
                subtitle={subtitle}
                imageSource={item[ItemsColumns.THUMB_URL]}
                imageAspectRation={item[ItemsColumns.ASPECT_RATIO]}
            />
        )
    }

    return (
        <SafeAreaView style={screenContainer} edges={["bottom", "left", "right"]}>
            <View style={[screenContainer, { backgroundColor: "#EEEEEE"}]}>
                <FlatList
                    data={articleItems}
                    renderItem={renderItem} 
                    refreshing={isRefreshing}
                    extraData={articleItems}
                    onRefresh={refresh}
                    numColumns={2}
                    keyExtractor={item => item[ItemsColumns._ID]}
                />
            </View>
        </SafeAreaView>
    )
}

function mapStateToProps (articleItems) {
    return {
        articleItems
    }
}

const connectedMainComponent = connect(mapStateToProps)
export default connectedMainComponent(MainComponent)

export function MainComponentOptions(){
    return {
        title: null,
        headerTintColor: white,
        headerStyle: { 
            backgroundColor: theme_primary,
        },
        headerLeft: () => ( 
            <Image 
                style={{
                    resizeMode: "center",
                    marginLeft: 15, 
                    width: app_header_logo_width, 
                    height: app_header_logo_height,
                }} 
                source={require("../assets/images/logo.png")}
            />
        ),
    }
}