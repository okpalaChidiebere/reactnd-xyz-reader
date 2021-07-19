import { RECEIVE_ARTICLES } from "../actions"

function articleItems (state = [], action) {
    switch (action.type) {
        case RECEIVE_ARTICLES:
          return action.articles
        default:
          return state
    }
}

export default articleItems