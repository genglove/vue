import {Observer} from './Observer.js'
import {Watcher} from './Watcher.js'

export class Vue { //Vue对象
    constructor (options) {
      this.$options=options;
      let data = this._data=this.$options.data;
      Object.keys(data).forEach(key=>this._proxy(key));
      // 拿到data之后，我们循环data里的所有属性，都传入代理函数中
      new Observer(data,this);
    }
    $watch(expOrFn, cb, options){  //监听赋值方法
      new Watcher(this, expOrFn, cb);
      // 传入的是Vue对象
    }

    _proxy(key) { //代理赋值方法
      // 当未开启监听的时候，属性的赋值使用的是代理赋值的方法
      // 而其主要的作用，是当我们访问Vue.a的时候，也就是Vue实例的属性时，我们返回的是Vue.data.a的属性而不是Vue实例上的属性
      var self = this
      Object.defineProperty(self, key, {
        configurable: true,
        enumerable: true,
        get: function proxyGetter () {
          return self._data[key]
          // 返回 Vue实例上data的对应属性值
        },
        set: function proxySetter (val) {
          self._data[key] = val
        }
      })
    }
}