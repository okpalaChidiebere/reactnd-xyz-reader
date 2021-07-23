# Project: Make your App Material

This app show list for you books from a lbrary that you can read online and offline

I design this app to follow the Material Design guidelines and made the design mocks to a living and breathing app.

I learned: 
- Understand the fundamentals of Android and iOS design.
- Apply Material Design guidelines to a mobile application.
- Separate an interface into [surfaces](https://material.io/design/environment/elevation.html).
- Effectively use transitions and motion. eg magnetic reaction (with interactive surfaces like FAB), seam to step transition (between AnimatedHeader and ArticleBody), etc


# Shared Element Transitions
- For this app, implementing the Shared Element did not workout well. On my own free time i will try to re-implement [this app](https://github.com/IjzerenHein/react-native-shared-element/tree/master/test-app) which will help me understand Shared Element for React native in full
- NOTE: it is important you run `yarn add react-native-shared-element react-navigation-shared-element@next` as stated in this [article](https://blog.logrocket.com/how-to-use-shared-element-transition-with-react-navigation-v5/) to install the package for your app. It still dont not stop you from using react navigation screen transitions though :). If you are still getting an error after installation follow this [step](https://www.youtube.com/watch?v=sUAle04RTvk)
- https://www.youtube.com/watch?v=nEntsYyCbLM
- https://www.youtube.com/watch?v=iejTIn9zi0U
- https://medium.com/@boltdsg/react-navigation-5-shared-element-2525abb0dc4d
- https://github.com/IjzerenHein/react-navigation-shared-element-demo
- https://dribbble.com/shots/4038053-Tasty-Burger-App

# Other Useful Links not related to Shared Eleemt
- [https://www.youtube.com/watch?v=T9LWjpHCW_E](https://medium.com/appandflow/react-native-scrollview-animated-header-10a18cb9469e)
- [https://medium.com/appandflow/react-native-scrollview-animated-header-10a18cb9469e](https://medium.com/appandflow/react-native-scrollview-animated-header-10a18cb9469e)
- [https://stackoverflow.com/questions/63937106/try-to-make-my-svg-element-rotating-using-animated-but-it-doesnt-work](https://stackoverflow.com/questions/63937106/try-to-make-my-svg-element-rotating-using-animated-but-it-doesnt-work)
- [https://github.com/bungferdly/ScrollAnimation-RN](https://github.com/bungferdly/ScrollAnimation-RN)
- [https://github.com/catalinmiron/react-native-dot-inversion](https://github.com/catalinmiron/react-native-dot-inversion)

# TakeAways from implementing this App
- Before you implement animation motions in a screen, it is important to know the herarchy of the animations on screen. For example in my details screen, i could have statred from animating the ViewPager and work my way down to the Appheader motions after. Instead i started from the flatlist and work my way out which made it harder.
- Implement your animations with mock values and direct components first, then you can start to add dynamic values(from db or redux store) and components after. This way you will see the animations work first hand without external uneccessary delay, so then when you start to fill in the data from db or redux store you can catch where the delay is coming from and work around it
- In the details screen, i sure could have added a loading bar for components that taks a bit of time or maybe the whole screen. Maybe have a state to keep track of each components loading state?
- The articleBody could have been one of the last thing i should do. I could have used dummy listItems implement other stuffs or implement it and not use it yet, i will swap it out with the dummy list and add it at the end. This way i can see my animations run and catch any nonesense errors