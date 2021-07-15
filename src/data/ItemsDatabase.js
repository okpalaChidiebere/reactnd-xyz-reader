import * as SQLite from "expo-sqlite"


const DATABASE_NAME = "xyzreader.db"
export const ITEMS = "items"

export const ItemsColumns = {
    /** Type: INTEGER PRIMARY KEY AUTOINCREMENT */
    _ID: "_id",
    /** Type: TEXT */
    SERVER_ID: "server_id",
    /** Type: TEXT NOT NULL */
    TITLE: "title",
    /** Type: TEXT NOT NULL */
    AUTHOR: "author",
    /** Type: TEXT NOT NULL */
    BODY: "body",
    /** Type: TEXT NOT NULL */
    THUMB_URL: "thumb_url",
    /** Type: TEXT NOT NULL */
    PHOTO_URL: "photo_url",
    /** Type: REAL NOT NULL DEFAULT 1.5 */
    ASPECT_RATIO: "aspect_ratio",
    /** Type: INTEGER NOT NULL DEFAULT 0 */
    PUBLISHED_DATE: "published_date",
}

const db = SQLite.openDatabase(DATABASE_NAME)


export function createItemsTable(db) {

    db.transaction((tx) => {
        //tx.executeSql("DROP TABLE IF EXISTS "+TABLE_NAME); //used for debugging
        tx.executeSql("CREATE TABLE IF NOT EXISTS " + ITEMS + " ("
            + ItemsColumns._ID + " INTEGER PRIMARY KEY AUTOINCREMENT,"
            + ItemsColumns.SERVER_ID + " TEXT," //we want to keep track of the id of the item in the remote server
            + ItemsColumns.TITLE + " TEXT NOT NULL,"
            + ItemsColumns.AUTHOR + " TEXT NOT NULL,"
            + ItemsColumns.BODY + " TEXT NOT NULL,"
            + ItemsColumns.THUMB_URL + " TEXT NOT NULL,"
            + ItemsColumns.PHOTO_URL + " TEXT NOT NULL,"
            + ItemsColumns.ASPECT_RATIO + " REAL NOT NULL DEFAULT 1.5,"
            + ItemsColumns.PUBLISHED_DATE + " TEXT NOT NULL"
            + ")" )
    },
    (e) => {
        console.log("ERROR: " + e.message)
    })
}

export default db