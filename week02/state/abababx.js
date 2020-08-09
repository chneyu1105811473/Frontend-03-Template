function find(str){
    let state = start
    for(let i of str){
        state = state(i)
        console.log(state)
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

function findB(a){
    if(a === 'a'){
        return findA2
    }else{
        return start(a)
    }
}

function findA2(b){
    if(b==='b'){
        return findB2
    }else{
        return findA(b)
    }
}
function findB2(a){
    if(a === 'a'){
        return findA3
    }else{
        return findB(a)
    }
}

function findA3(b){
    if(b==='b'){
        return findB3
    }else{
        return findA2(b)
    }
}
function findB3(x){
    if(x === 'x'){
        return end
    }else{
        return findB2(x)
    }
}

function end(){
    return end
}

console.log(find('ababababx'))