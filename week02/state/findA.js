function findA(str){
    for(let i in str){
        if(str[i]==='a'){
           return i
        }
    }
    return -1;
}

console.log(findA('bcdabca'));