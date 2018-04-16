// 中文名转换英文名的文件路径
let exchangeFilePath = `C:\\Users\\admin\\Documents\\GitLab\\wxxcx_shop\\images\\icon`
// 要替换文件内容的目录
let replaceFilePath = 'C:\\Users\\admin\\Documents\\GitLab\\wxxcx_shop\\pages'
var fs = require('fs')
var pathSearh = require("./module/pathSearch.js")
var iconv = require('iconv-lite');


function exchangeFileName(from,to){
    return new Promise((reslove,reject)=>{
        fs.rename(from,to,err=>{
            if(err){
                reject(err)
            }
            reslove(true)
        })
    })
    
}
async function replaceContent(path,excute){
    // 读取文件
    let data = await readFile(path)
    
    // console.log('load data ：',data)
    let newCotent = excute(data)
    // console.log('newContent',newCotent)
    fs.writeFile(path,newCotent,(err)=>{
        if(err){
            reject(err)
        }
    })
    // console.log('new content',newCotent)
}
function readFile(path){
    return new Promise((reslove,reject)=>{
        fs.readFile(path,{encoding: 'binary'},(err,data)=>{
            if(err){
                reject(err)
            }
            var str = iconv.decode(data, 'utf8');
			// console.log(str);
            reslove(str)
        })
    })
}

async function main(){

    let array = await pathSearh.getFilePath(exchangeFilePath)
    let fileArray = await pathSearh.getFilePath(replaceFilePath)
    // console.log(array)

    // 排序，让文件名称较长的排在前面
    array = array.sort((a,b)=>{
        // console.log(a,b)
        return  b.from.length-a.from.length
    })
    console.log(array)

    // 循环遍历，替换文件名
    array.map(item=>{
        exchangeFileName(item.fromPath,item.toPath)
    })
    // 循环遍历，读取文件，替换文件内容
    fileArray.map(item=>{
        // 循环遍历，要替换文件的数组替换文件名
        replaceContent(item.fromPath,(content)=>{
            array.map(sitem=>{
                // console.log(sitem)
                
                content = content.replace(new RegExp(sitem.from,'g'),sitem.to)
                console.log(sitem.from,sitem.to)
            })
            return content
        })
    })
    fs.writeFile(exchangeFilePath+"\\1.txt",JSON.stringify(array),(err)=>{
        if(err){
        }
    })
}
main()

// 遍历转换目录下的所有文件，1生成映射表，2修改文件名


// 存储映射表，存入本地文件

// 遍历项目文件夹下所有文件，读取文件内容，根据映射表文件进行替换

// var pinyinlite = require('pinyinlite');

// console.log(pinyinlite('世界你好'))