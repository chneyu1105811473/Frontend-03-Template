function findAB(str){
    let {length} = str
    for(let i = 0 ; i < length ; i++){
        let j = i+1
        if(str[i] === 'a' && str[j] === 'b'){
            return i
        }
    }
    return -1
}

console.log(findAB('adsdsfsfabsdsdab'))