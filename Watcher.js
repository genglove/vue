const bilRE = /[^\w.$]/
function parsePath(path){
    if(bilRE.test(path)) return;
    let arr = path.split('.')
    return function(obj){
        
        for(let i=0; i<arr.length; i++){
            if(!obj) return;
            obj = obj[arr[i]]
        }
        return obj
    }
}


export class Watcher{
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
            this.depIds.add(id)
            this.deps.push(dep)
            dep.addSub(this)
        }
    }
    get(){
        window.target = this;
        let value = this.getter.call(this.vm, this.vm)
        window.target = undefined
        return value
    }
    update(){
        //console.log('Watcher.update')
        let oldVal = this.value;
        this.value = this.get();
        this.cb.call(this.vm, this.value, oldVal)
    }
}
