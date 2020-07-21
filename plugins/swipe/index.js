import swipe from './swipe'
import swipeItem from './swipe-item'

let Swipe = {};
Swipe.install = (Vue => {
    Vue.component(swipe.name, swipe);
    Vue.component(swipeItem.name, swipeItem);
})

export default Swipe;
