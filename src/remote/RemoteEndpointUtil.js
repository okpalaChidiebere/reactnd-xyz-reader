import { BASE_URL } from "./Config"


export const fetchJsonArray = () => 
fetch(BASE_URL)
  .then(res => res.json())