
/**
 * 依赖的收集
 * 功能有对依赖操作有增删和通知
 * @class Dep
 */
let uid = 0;
class Dep{
    constructor(){
        this.subs = []
        this.id = uid++;
    }
    depend(){
        if(window.target){
            window.target.addDep(this)
        }
    }
    addSub(sub){
        this.subs.push(sub)
    }
    removeSub(sub){
        let subs = this.subs;
        let index = subs.indexOf(sub);
        if(index > -1){
            subs.splice(index, 1)
        }
    }
    notity(){
        let subs = this.subs;
        for(let i=0; i<subs.length; i++){
            subs[i].update()
        }
    }
}

class Observer{
    constructor(value){
        this.dep = new Dep()
        def(value, '__ob__', this)
        if(toString.call(value) == "[object Object]"){
            this.walk(value)
        }
    }
    walk(val){
        for(let key in val){
            if(typeof(val[key]) == "object") new Observer(val[key])
            defineReactive(val, key, val[key])
        }
    }
}
// 每个数据属性都添加Observer
function def(obj, key, val){
    Object.defineProperty(obj, key, {
        value: val
    })
}
// 追踪Object对象数据
function defineReactive(obj, key, val){
    let dep = new Dep()
    Object.defineProperty(obj, key, {
        enumerable: true,
        configurable: true,
        get(){
            dep.depend()
            return val
        },
        set(newVal){
            if(val === newVal) return;
            val = newVal;
            dep.notity()
        }
    })
}

var arrayMethods = JSON.parse(JSON.stringify(Array.prototype));

['push', 'pop', 'shift', 'unshift', 'sort', 'splice', 'reverse'].forEach((method)=>{
    let fun = Array.prototype[method]
    arrayMethods[method] = function(...ags){
        console.log("执行")
        return fun.apply(this, ags)
    }
})


class Watcher{
    constructor(vm, expOrFn, cb, options){
        this.vm = vm;
        this.cb = cb;
        
        if(options) {
            this.deep = !!options.deep
        }else{
            this.deep = false
        }
        this.getter = parsePath(expOrFn)
        this.depIds = new Set()
        this.value = this.get()
    }
    addDep(dep){
        let id = dep.id;
        if(!this.depIds.has(id)){
            this.depIds.add(id)
            dep.addSub(this)
        }
    }
    get(){
        window.target = this;
        let value = this.getter.call(this.vm, this.vm);
        if(this.deep) traverse(value)
        window.target = undefined;
        return value;
    }
    update(){
        let oldVal = this.value;
        this.value = this.get()
        this.cb.call(this.vm, this.value, oldVal)
    }
}
function parsePath(path){
    let arr = path.split('.');
    return function(obj){
        for(let i=0; i<arr.length; i++){
            obj = obj[arr[i]]
        }
        return obj;
    }
}

let seenObject = new Set()
function traverse(val){
    _traverse(val, seenObject)
    seenObject.clear()
}

function _traverse(val, seen){
    let keys, i;
    let isArr = Array.isArray(val)
    let isObj = toString.call(val) == "[object Object]"
    if(!isArr && !isObj) return;

    if(val.__ob__){
        let id = val.__ob__.dep.id;
        if(seen.has(id)) return;
        seen.add(id)
    }

    if(isArr){
        i = val.length;
        while(i--){
            _traverse(val[i], seen)
        }
    }else{
        keys = Object.keys(val);
        i = keys.length;
        while(i--){
            _traverse(val[keys[i]], seen)
        }
    }
}



class Vue{
    constructor(options){
        let data = this.data = options.data
        new Observer(data)
    }
    $watch(expOrFn, cb, op){
        let option = op || {}
        new Watcher(this, expOrFn, cb, option);
    }
}

let vm = new Vue({
    data: {
        a: 1,
        obj: {
            a:2
        }
    }
})

vm.$watch('data.obj', function(newVal,oldVal){
    console.log('old---->', oldVal)
    console.log('new---->', newVal)
},{
    deep: true
})
vm.$watch('data.a', function(newVal, oldVal){
    console.log('new---->', newVal)
    console.log('old---->', oldVal)
})

window.vm = vm

































