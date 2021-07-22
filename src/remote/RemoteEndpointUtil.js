import { BASE_URL } from "./Config"
import Palette from "react-native-palette-full"
import { ItemsColumns } from "../data/ItemsDatabase"


export const fetchJsonArray = () => 
fetch(BASE_URL)
  .then(res => res.json())


export async function  fetchColors(rowsFromDB){
  const promises = await rowsFromDB.map(async (item , i) => {
    /* String array to hold each day's weather String */
    let selectedColor = '#03A9F4'

    try {
      const result = await Palette.getNamedSwatchesFromUrl(item[ItemsColumns.PHOTO_URL])

      //sort the colors based on population; i.e which color is more prevelant on the image
      const mostDominantColor = Object.values(result).sort((prev, next) => {
        //Skip sorting null values. eg `Vibrant Dark`, `Vibrant Light` and `Vibrant` could be null
        if(prev && next){
          return next["population"] - prev["population"]
        }
      })

      //Pick the first color
      selectedColor = mostDominantColor[0]["color"]
    } catch (err) {
      console.log('Error:', err);
    }

    //add a new attribute
    return { ...item, headerColor: selectedColor }
  })
  return Promise.all(promises)
}