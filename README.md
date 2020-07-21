使用插件，目前已写两种插件（swipe，toast），后续有空再添加其他插件。

1、这两种插件均用 import minPlugin from '@/plugins'; Vue.use(minPlugin);

2、单独加载swipe import swipe from "@/plugins/swipe"; Vue.use(swipe);

3、单独加载toast import toast from "@/plugins/toast"; Vue.prototype.toast = toast;
