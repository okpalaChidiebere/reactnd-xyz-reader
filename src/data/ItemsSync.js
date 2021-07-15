import * as Network from "expo-network"
import { fetchJsonArray } from "../remote/RemoteEndpointUtil"
import { bulkInsertWeatherData, deleteArticlesData, loadAllArticles } from "./ItemsSelectionBuilder"

const TAG = "ItemsSync"
export async function startImmediateSync(){
    return await syncArticlesTask()
}

export async function syncArticlesTask() {

    const cn = await Network.getNetworkStateAsync()
    if ( !cn.isInternetReachable || !cn.isConnected ){
        console.log(TAG, "Not online, not refreshing.")
        //early return
        return null
    }

    const jsonArticleResponse = await fetchJsonArray()

    /*
    * In cases due to HTTP error, the fetch request would have returned null. 
    * We need to check for those cases here to prevent any error being thrown
    * We also have no reason to insert fresh data if there isn't any to insert.
    */
    if (jsonArticleResponse != null && jsonArticleResponse.length > 0) {

        /* Delete old article data because we don't need to keep multiple artcile data */
        deleteArticlesData(null)

        /* Insert our new weather data into Sunshine's SQLite */
        bulkInsertWeatherData(jsonArticleResponse)
    }

    /* If the code reaches this point, we have successfully performed our sync */
    return jsonArticleResponse
}
