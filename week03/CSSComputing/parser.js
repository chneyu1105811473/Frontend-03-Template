let currentToken = null;
let currentAttribute = null;
let currentTextNode = null;
const css = require('css'); 

let stack = [{type:'document',children:[]}];

let rules = []
function addCSSRules(text) {
  let ast = css.parse(text)
  rules.push(...ast.stylesheet.rules)
  console.log(rules)
}

function match(element, selector) {
    if (!selector || !element.attributes) {
      return false
    }
    //解决复合选择器
    let selectors = splitSelector(selector);
    for(selector of selectors){
        if (selector.charAt(0) === '#') {
            let attr = element.attributes.filter((attr) => attr.name === 'id')[0]
            if (attr && attr.value === selector.replace('#', '')) {
              return true
            }
        } else if (selector.charAt(0) === '.') {
          let attr = element.attributes.filter((attr) => attr.name === 'class')[0]
          if (attr && attr.value === selector.replace('.', '')) {
            return true
          }
        } else {
          if (element.tagName === selector) {
            return true
          }
        }
        return false
    }
}

function specificity(selector) {
  let p = [0, 0, 0, 0]
  let selectors = splitSelector(selector);
  for (let part of selectors) {
    if (part.charAt(0) === "#") {
      p[1] += 1;
    } else if (part.charAt(0) === ".") {
      p[2] += 1;
    } else {
      p[3] += 1;
    }
  }
  return p
}
//复核选择器的解析
function splitSelector(selector) {
    let selectors = [];
    selector.replace(/[\w -]+/g,(match,index,str)=>{
        selectors.push(str[index-1]+match)
        console.log(selectors)
        return match;
    })
    return selectors;
}

function compare(sp1, sp2) {
  if (sp1[0] - sp2[0]) {
    return sp1[0] - sp2[0]
  }
  if (sp1[1] - sp2[1]) {
    return sp1[1] - sp2[1]
  }
  if (sp1[2] - sp2[2]) {
    return sp1[2] - sp2[2]
  }
  return sp1[3] - sp2[3]
}

function computeCSS(element) {
  let elements = stack.slice().reverse()
  if (!element.computedStyle) {
    element.computedStyle = {}
  }

  for (let rule of rules) {
    let selectorParts = rule.selectors[0].split(' ').reverse();
    // 先匹配了当前元素，所以后面j为1
    if (!match(element, selectorParts[0])) {
      continue;
    }

    let matched = false;

    let j = 1;
    for (let i = 0; i < elements.length; i++) {
      // elements[i]是element的祖先元素
      if (match(elements[i], selectorParts[j])) {
        j++;
      }
    }

    if (j >= selectorParts.length) {
      matched = true
    }

    if (matched) {
      let sp = specificity(rule.selectors[0])
      let computedStyle = element.computedStyle
      for (let declaration of rule.declarations) {
        if (!computedStyle[declaration.property]) {
          computedStyle[declaration.property] = {}
        }
        if (!computedStyle[declaration.property].specificity) {
          computedStyle[declaration.property].value = declaration.value
          computedStyle[declaration.property].specificity = sp
        } else if (compare(computedStyle[declaration.property].specificity, sp) < 0) {
          computedStyle[declaration.property].value = declaration.value
          computedStyle[declaration.property].specificity = sp
        }
      }
      console.log(element.tagName, element.attributes, element.computedStyle)
    }
  }
}

function emit(token){
    // console.log(token);
    if(token.type === 'text'){
        return ;
    }
    let top = stack[stack.length-1];

    if(token.type === 'startTag'){
        let element = {
            type:'element',
            children:[],
            attribute:[]
        };
        element.tagName = token.tagName;

        for(let p in token){
            if(p !== 'type' && p !== 'tagName'){
                element.attribute.push({
                    name:p,
                    value:token[p]
                });
            }
        }

        computeCSS(element);
        top.children.push(element);

        element.parent = top;

        if(!token.isSelfClosing){
            stack.push(element)
        }
        currentTextNode = null;
    }else if(token.type === 'endTag'){
        if(top.tagName !== token.tagName){
            throw new Error("Tag start end doesn't match!");
        }else{
            // 遇到style标签时，执行添加CSS规则的操作
            if (top.tagName === 'style') {
              addCSSRules(top.children[0].content)
            }
            stack.pop();
        }
        currentTextNode = null;
    }else if (token.type === 'text') {
        if (currentTextNode === null) {
          currentTextNode = {
            type: 'text',
            content: '',
          }
          top.children.push(currentTextNode)
        }
        currentTextNode.content += token.content
    }
}

const EOF = Symbol("EOF"); // EOF: End Of File

function data(c){
    if(c === '<'){
        return tagOpen;
    }else if(c === EOF){
        emit({
            type:'EOF'
        });
        return ;
    }else{
        emit({
            type:'text',
            content:c
        });
        return data;
    }
}

function tagOpen(c){
    if(c === '/'){
        return endTagOpen;
    }else if(c.match(/^[a-zA-Z]$/)){
        currentToken = {
            type:'startTag',
            tagName:''
        }
        return tagName(c);
    }else {
        return ;
    }
}

function endTagOpen(c){
    if(c.match(/^[a-zA-Z]$/)){
        currentToken = {
            type:'endTag',
            tagName:''
        }
        return tagName(c);
    }else if(c === '>'){

    }else if(c === EOF){

    }else {

    }
}

function tagName(c){
    if(c.match(/^[\t\n\f ]$/)){
        return beforeAttributeName;
    }else if(c === '/'){
        return selfClosingStartTag;
    }else if(c.match(/^[a-zA-Z]$/)){
        currentToken.tagName += c; //.toLowerCase()
        return tabName;
    }else if(c === '>'){
        emit(currentToken);
        return data;
    } else {
        return tagName;
    }
}

function beforeAttributeName(c){
    if(c.match(/^[\t\n\f ]$/)){
        return beforeAttributeName;
    }else if(c === '/' || c === '>' || c=== EOF){
        return afterAttributeName(c);
    }else if(c === '='){
        
    }else {
        currentAttribute = {
            name:'',
            value:''
        }
        return attributeName(c);
    }
}
function afterAttributeName(c) {
    if(c.match(/^[\t\n\f ]$/)) {
        return afterAttributeName;
    }else if (c === '/') {
        return selfClosingStartTag;
    }else if (c === '=') {
        return beforeAttributeValue;
    }else if (c === '>') {
        currentToken[currentAttribute.name] = currentAttribute.value;
        emit(currentToken);
        return data;
    }else if (c === EOF) {

    }else {
        currentAttribute = {
            name: '',
            value: '',
        }
        return attributeName(c)
    }
}

function attributeName(c){
    if(c.match(/^[\t\n\f ]$/) || c=== '/' || c=== '>' || c === EOF){
        return afterAttributeName(c);
    }else if(c === '='){
        return beforeAttributeValue;
    }else if(c === '\u0000'){

    }else if(c === '\"' || c === "'" || c === '<'){

    }else{
        currentAttribute.name += c;
        return attributeName;
    }
}

function beforeAttributeValue(c){
    if(c.match(/^[\t\n\f ]$/) || c === '/' || c === '>' || c === EOF){
        return beforeAttributeValue;
    }else if(c === '\"'){
        return doubleQuoteAttributeValue;
    }else if(c === "\'"){
        return singleQuoteAttributeValue;
    }else if(c === '>'){

    }else {
        return unQuoteAttributeValue(c);
    }
}

function doubleQuoteAttributeValue(c){
    if(c === "\""){
        currentToken[currentAttribute.name] = currentAttribute.value;
        return afterQuotedAttributeValue;
    }else if(c === '\u0000'){
        
    }else if(c === EOF){

    }else {
        currentAttribute.value += c;
        return doubleQuoteAttributeValue;
    }
}

function singleQuoteAttributeValue(c){
    if(c === "\'"){
        currentToken[currentAttribute.name] = currentAttribute.value;
        return afterQuotedAttributeValue;
    }else if(c === '\u0000'){
        
    }else if(c === EOF){

    }else {
        currentAttribute.value += c;
        return doubleQuoteAttributeValue;
    }
}

function afterQuotedAttributeValue(c){
    if(c.match(/^[\t\n\f ]$/)){
        return beforeAttributeName;
    }else if(c === '/'){
        return selfClosingStartTag;
    }else if(c === '>'){
        currentToken[currentAttribute.name] = currentAttribute.value;
        emit(currentToken);
        return data;
    }else if(c === EOF){

    }else{
        currentAttribute.value += c;
        return doubleQuoteAttributeValue;
    }
}

function unQuoteAttributeValue(c){
    if(c.match(/^[\t\n\f ]$/)){
        currentToken[currentAttribute.name] = currentAttribute.value;
        return beforeAttributeName;
    }else if(c === '/'){
        currentToken[currentAttribute.name] = currentAttribute.value;
        return selfClosingStartTag;
    }else if(c === '>'){
        currentToken[currentAttribute.name] = currentAttribute.value;
        emit(currentToken);
        return data;
    }else if(c === '\u0000'){

    }else if(c === "\"" || c === "'" || c === '<' ||c === '='|| c==="`"){

    }else if(c === EOF){

    }else {
        currentAttribute.value +=c;
        return unQuoteAttributeValue;
    }
}

function selfClosingStartTag(c){
    if(c === '>'){
        currentToken.isSelfClosing = true;
        return data;
    }else if(c === 'EOF'){

    }else {

    }
}

module.exports.parseHTML = function parseHTML(html){
    let state = data;
    for(let c of html){
        state = state(c);
    }
    state = state(EOF);
    console.log(1111,stack[0]);
    return stack[0];
}