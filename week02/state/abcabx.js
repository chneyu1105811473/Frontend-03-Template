let flag = false

function find(str){
    let state = start
    for(let i of str){
        state = state(i)
        console.log(state,flag)
    }
    return state === end
}

function start(a){
    flag = false
    if(a==='a'){
        return findA
    }else{
        return start
    }
}

function findA(b){
    if(b==='b'){
        return findB
    }else{
        return start(b)    
    }
}

function findB(c){
    if(c === 'c'){
        return findC
    }else if(flag && c === 'x'){
        return end
    }else{
        return start(c)
    }
}

function findC(a){
    flag = true
    if(a==='a'){
        return findA
    }else{
        return start(a)
    }
}

function end(){
    return end
}

console.log(find('ababcabcab'))