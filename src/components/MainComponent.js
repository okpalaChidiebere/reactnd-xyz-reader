import React, { useEffect, useState } from "react"
import { Text, View, FlatList }  from "react-native"
import { useTheme } from "@react-navigation/native"
import { SafeAreaView } from "react-native-safe-area-context"
import { app_name } from "../values/strings"
import { theme_primary, white } from "../values/colors"
import { startImmediateSync } from "../data/ItemsSync"
import db from "../data/ItemsDatabase"
import { loadAllArticles } from "../data/ItemsSelectionBuilder"


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
            //console.log(newData[5].author)
        })()
    }, [])

    const refresh = async () => {
        setState(previousSate => ({
            ...previousSate,
            isLoading: true,
        }))

        try{
            const newData = await startImmediateSync()
            if(newData){
                setState(previousSate => ({
                    ...previousSate,
                    articles: newData,
                }))
            }
        }catch(e){
            console.warn(TAG ,"Error From NetworkFetch: ", e)
        }finally{
            setState(previousSate => ({
                ...previousSate,
                isLoading: false,
            }))
        }
    }

    const { isLoading, articles } = state
    return (
        <SafeAreaView style={screenContainer} edges={["bottom", "left", "right"]}>
            <View style={screenContainer}>
                <Text>{isLoading? "isLoading" : JSON.stringify(articles)}</Text>
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