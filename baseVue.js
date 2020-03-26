
let uid = 0;
/**
 *
 *
 * @class Dep
 */
class Dep{
    constructor(){
        this.id = uid++;
        this.subs = []
    }
    addSub(sub){
        this.subs.push(sub)
    }
    depend(){
        if(window.target){
            // console.log(window.target)
            window.target.addDep(this)
        }
    }
    removeSub(sub){
        removeDepend(this.subs, sub)
    }
    notify(){
        let subs = this.subs
        console.log('通知的依赖----->', this.subs)
        for(let i=0; i<subs.length; i++){
            subs[i].update()
        }
    }
}
function removeDepend(arr, item){
    let index = arr.indexOf(item)
    if(index > -1){
        return arr.splic(index, 1)
    }
}

/**
 *
 * 
 * @class Oberver
 */
class Observer{
    constructor(value){
        this.value = value;
        //this.dep = new Dep();
        if(toString.call(value) == '[object Object]'){
            this.walk(value)
        }
    }
    walk(val){
        for(let key in val){
            defineReactive(val, key, val[key])
        }
    }
}
function defineReactive(data, key, val){
    // if(typeof(val) == 'object') new Observer(val)
    let childOb = new Observer(val);
    let dep = new Dep()
    Object.defineProperty(data, key, {
        get(){
            //console.log(2)
            dep.depend();
            console.log(dep)
            /* if (childOb) {
                childOb.dep.depend();
            } */
            return val
        },
        set(newVal){
            if(newVal == val) return
            val = newVal;
            dep.notify()
        }
    })
}


/**
 *
 *
 * @class Watcher
 */
class Watcher{
    constructor(vm, expOrFn, cb){
        this.vm = vm;
        this.cb = cb;
        this.deps = []
        this.depIds = new Set()
        this.getter = parsePath(expOrFn)
        this.value = this.get()
    }
    addDep (dep){
        const id = dep.id
        if(!this.depIds.has(id)){
            console.log(id)
            this.depIds.add(id)
            this.deps.push(dep)
            dep.addSub(this)
        }
    }
    get(){
        window.target = this;
        //console.log(1)
        let value = this.getter.call(this.vm, this.vm)
        window.target = undefined
        return value
    }
    update(){
        
        let oldVal = this.value;
        this.value = this.get();
        this.cb.call(this.vm, this.value, oldVal)
    }
}
function parsePath(path){
    let arr = path.split('.')
    return function(obj){
        
        for(let i=0; i<arr.length; i++){
            if(!obj) return
            obj = obj[arr[i]]
        }
        
        return obj
    }
}



class Vue {
    constructor(options){
        let data = this._data = options.data
        Object.keys(data).forEach((key)=>this._proxy(key))
        new Observer(data)
    }
    $watch(expOrFn, cb){
        new Watcher(this, expOrFn, cb)
    }
    _proxy(key){
        let sefl = this;
        Object.defineProperty(this, key, {
            get(){
                return sefl._data[key]
            },
            set(newVal){
                if(sefl._data[key] == newVal) return
                sefl._data[key] = newVal
            }
        })
    }
}

let vm = new Vue({
    data:{
        obj: {
            a: 11
        },
        a: 1,
        b: 2,
    }
})

vm.$watch('obj.a', function(newVal, oldVal){
    console.log('old------>', oldVal)
    console.log('new------>', newVal)
})
vm.$watch('b', function(newVal, oldVal){
    console.log('old------>', oldVal)
    console.log('new------>', newVal)
})
vm.$watch('b', function(newVal, oldVal){
    console.log('old------>', oldVal)
    console.log('new------>', newVal)
})


/* vm.$watch('data.a', function(newVal, oldVal){
    console.log('old------>', oldVal)
    console.log('new------>', newVal)
}) */


window.vm1 = vm
