import Vue from 'vue';
import ToastVue from './toast.vue'
const ToastConstructor = Vue.extend(ToastVue);
ToastConstructor.prototype.close = function () {//关闭Toast
    this.$el && document.body.removeChild(this.$el);
    this.$destroy();
}

const Toast = (opt) => {
    let instance = new ToastConstructor();
    let el = instance.$mount().$el;
    document.body.appendChild(el);//将toast加入body中
    instance.isShow = true;
    if (typeof opt == "string") {
        instance.title = opt;
    } else if (typeof opt == "object") {
        let { title = "", mode = "loading", icon = "info", duration = 0, mask = false } = opt;
        instance.title = title;
        instance.mode = mode;
        instance.icon = icon;
        instance.duration = duration;
        instance.mask = mask;
        if (duration > 0) {
            window.setTimeout(() => {
                instance.close();
            }, duration);
        }
    }
    return instance
}

export default Toast;
