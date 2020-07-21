import swipe from './swipe/swipe'
import swipeItem from './swipe/swipe-item'
import toast from './toast/index'

const components = {
    swipe,
    swipeItem
}

const install = Vue => {
    Object.values(components).forEach(component => {
        Vue.component(component.name, component);
    })
    Vue.prototype.toast = toast;

}
export default Object.assign(components, { install });

