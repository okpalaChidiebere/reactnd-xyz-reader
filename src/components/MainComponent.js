import React, { useEffect, useState } from "react"
import { View, FlatList }  from "react-native"
import { useTheme } from "@react-navigation/native"
import { SafeAreaView } from "react-native-safe-area-context"
import moment from "moment"
import { app_name } from "../values/strings"
import { theme_primary, white } from "../values/colors"
import { startImmediateSync } from "../data/ItemsSync"
import db, { ItemsColumns } from "../data/ItemsDatabase"
import { loadAllArticles } from "../data/ItemsSelectionBuilder"
import ListItemArticle from "./ListItemArticle"


const TAG = "MainComponent"

const initialState = {
    articles: [],
    isLoading: false,
}

export default function MainComponent(){
    const { screenContainer } = useTheme()
    const [state, setState] = useState(initialState)

    useEffect(() => {
        (async () => {
            setState({
                isLoading: true,
            })
            const newData = await loadAllArticles(db)
            setState({
                articles: newData,
                isLoading: false,
            })
        })()
    }, [])

    const refresh = async () => {
        /**
         * More ways to implment this logic
         * https://medium.com/enappd/refreshcontrol-pull-to-refresh-in-react-native-apps-dfe779118f75
         */

        setState(previousSate => ({
            ...previousSate,
            isLoading: true,
        }))

       try{
            await startImmediateSync()
            const newData = await loadAllArticles(db)
            setState(previousSate => ({
                ...previousSate,
                articles: newData,
            }))
        }catch(e){
            console.warn(TAG ,"Error From NetworkFetch: ", e)
        }finally{
            setState(previousSate => ({
                ...previousSate,
                isLoading: false,
            }))
        }
    }

    const renderItem = ({ item, index }) => {
        const subtitle = moment(item[ItemsColumns.PUBLISHED_DATE]).format("MMMM D, YYYY")
            + "\n" + " by "
            + item[ItemsColumns.AUTHOR]

        return(
            <ListItemArticle 
                title={item[ItemsColumns.TITLE]}
                subtitle={subtitle}
                imageSource={item[ItemsColumns.THUMB_URL]}
                imageAspectRation={item[ItemsColumns.ASPECT_RATIO]}
            />
        )
    }

    const { isLoading, articles } = state
    return (
        <SafeAreaView style={screenContainer} edges={["bottom", "left", "right"]}>
            <View style={[screenContainer, { backgroundColor: "#EEEEEE"}]}>
                <FlatList
                    data={articles}
                    renderItem={renderItem} 
                    refreshing={isLoading}
                    extraData={articles}
                    onRefresh={refresh}
                    numColumns={2}
                    keyExtractor={item => item[ItemsColumns._ID]}
                />
            </View>
        </SafeAreaView>
    )
}

export function MainComponentOptions(){
    return {
        title: app_name,
        headerTintColor: white,
        headerStyle: { 
            backgroundColor: theme_primary,
        },
    }
}