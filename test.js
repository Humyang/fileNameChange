let content ='aaabbbccc'
let valu = 'bbb'
let s = content.replace(new RegExp(valu,'g'),'123')
console.log(s,content)