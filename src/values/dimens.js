import { Dimensions } from "react-native"

const {
    width: SCREEN_WIDTH,
} = Dimensions.get('window')

export const detail_article_body_vertical_margin = 16
export const detail_article_body_padding_left = SCREEN_WIDTH >= 600 ? 48  : 16
export const detail_article_body_padding_right = SCREEN_WIDTH >= 600 ? 48  : 16
export const detail_article_body_line_height = SCREEN_WIDTH >= 600 ? 40  : 30 

export const icon_size = SCREEN_WIDTH >= 600 ? 35  : 24 
export const detail_banner_height = SCREEN_WIDTH >= 600 ? 400  : 350 
export const detail_title_text_size = 32

/** Animated dimens */
export const detail_subtitle_endY = SCREEN_WIDTH >= 600 ? 40 : 20

