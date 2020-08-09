function find(str,test='abcdef'){
    let result = []
    let len = test.length
    let matchArr = []
    for(let index=0; index<len;index++){
        result[index] = []
        let targe = index === 0 ? str:result[index-1]
        let {length} = targe
        for(let i = 0; i < length; i++){
            if(str[index===0?i:targe[i]]===test[index]){
                result[index].push(index === 0?i+1:targe[i]+1)
            }
        }
        if(!result[index].length)return -1;
    }
    
    for(let i of result[len-1]){
        matchArr.push(i-len)
    }
    return matchArr
}
console.log(find('ababcdef'));