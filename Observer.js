import { Dep } from "./Dep.js";


// 监控object对象
function defineReactive(data, key, val){
    let dep = new Dep();
    Object.defineProperty(data, key, {
        get(){
            dep.depend(key)
            //console.log('读取--->', val)
            return val
        },
        set(newVal){
            if(newVal == val) return
            val = newVal;
            dep.notify()
        }
    })
}

// 测试所有数据
export class Observer{
    constructor(value){
        if(toString.call(value) == '[object Object]'){
            for(let key in value){
                this.wale(value, key, value[key])
            }
        }
    }
    wale(data, key, val){
        
        if(typeof(val) == 'object') new Observer(val)
        defineReactive(data, key, val)
    }
}
