import db, { ItemsColumns, ITEMS } from "./ItemsDatabase"

//https://www.sqlite.org/queryplanner.html

/**
* Execute query using the current internal state as {@code WHERE} clause.
*/
export async function loadAllArticles() {
    return new Promise(async (resolve, reject) => {

        const query = "SELECT " + 
                        ItemsColumns._ID + ", " +
                        ItemsColumns.TITLE + ", " +
                        ItemsColumns.PUBLISHED_DATE + ", " +
                        ItemsColumns.AUTHOR + ", " +
                        ItemsColumns.THUMB_URL + ", " +
                        ItemsColumns.PHOTO_URL + ", " +
                        ItemsColumns.ASPECT_RATIO + ", " +
                        ItemsColumns.BODY + " " +
                        "FROM " + ITEMS + " " +
                        "ORDER BY " + ItemsColumns.PUBLISHED_DATE + " DESC;" 

        db.transaction(
            async (tx) => {
                tx.executeSql( query, [], (_, { rows: { _array } }) => resolve(_array) )
            },
            (e) => {
                reject("ERROR: " + e.message)
                console.log("ERROR: " + e.message)
            }
        )
    })
}


/**
* If we pass null as the selection, It means you want to delete all the rows
* @param selection    default value is null
*/
export function deleteArticlesData(selection = null){

    if (null === selection) selection = "1" //If you comment out this line, your entire database table will be deleted. I probably will used this for debugging

    db.transaction((tx) => {
        tx.executeSql(
           selection === "1"
           ? "DELETE FROM "+ITEMS
           : "DROP TABLE IF EXISTS "+ITEMS
        )
    })
}

export function bulkInsertWeatherData(articleJsonStr){
    return new Promise(async (resolve, reject) => {

         // is text empty?
        if (!articleJsonStr) {
            return
        }

        let values = [], bigqery = ""
        for(const index in articleJsonStr){

            let { id, title, author, body, thumb, photo, aspect_ratio, published_date } = articleJsonStr[index]

            values.push(id, author, title, body, thumb, photo, aspect_ratio, published_date)
            bigqery += `(?,?,?,?,?,?,?,?)${articleJsonStr.length-1 != index?`,`:``}`
        }

        const SQL_BULK_INSERT = "INSERT INTO "+ITEMS
            + " ("
            + ItemsColumns.SERVER_ID + ","
            + ItemsColumns.AUTHOR + ","
            + ItemsColumns.TITLE + ","
            + ItemsColumns.BODY + ","
            + ItemsColumns.THUMB_URL + ","
            + ItemsColumns.PHOTO_URL + ","
            + ItemsColumns.ASPECT_RATIO + ","
            + ItemsColumns.PUBLISHED_DATE + ") "
            + "VALUES "
            + bigqery + ";"
    
        db.transaction(
            (tx) => {
                tx.executeSql(
                    SQL_BULK_INSERT, 
                    values,
                    (_, { rowsAffected }) => resolve(rowsAffected)
                )
            },
            (e) => {
                console.log("ERROR: " + e.message)
                reject("ERROR: " + e.message)
            }
        )
    })

}