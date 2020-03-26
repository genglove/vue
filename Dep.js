

function removeDepand(arr, item){
    let index = arr.indexOf(item)
    if(index > -1){
        return arr.splice(index, 1)
    }
}

// 依赖的收集
// 依赖的增删改查
export class Dep {
    constructor(){
        this.subs = []
    }
    addSub(sub){
        this.subs.push(sub)
    }
    removeDep(sub){
        removeDepand(this.subs, sub)
    }
    depend(key){        
        console.log(key+'自己依赖----->', this.subs)
        if(window.target){
            //console.log('Dep.depend')
            //this.addSub(window.target)
            window.target.addDep(this)
        }
    }
    notify(){
        
        let subs = this.subs;
        //console.log(subs)
        
        for(let i=0; i<subs.length; i++){
            subs[i].update()
        }
    }
}


 

