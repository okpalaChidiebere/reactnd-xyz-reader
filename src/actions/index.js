export const RECEIVE_ARTICLES = "RECEIVE_ARTICLES"

export function receiveArticles (articles) {
    return {
      type: RECEIVE_ARTICLES,
      articles
    }
}
  