var fs = require('fs')
var pinyinlite = require('pinyinlite');

// console.log(pinyinlite('世界你好'))
function readDir(path) {
    return new Promise((reslove, reject) => {
        fs.readdir(path, function (err, arr) {
            if (err) {
                reject(err)
            }
            reslove(arr)
        })
    })
}
function readFile(path) {
    return new Promise((reslove, reject) => {
        fs.readFile(path, function (err, arr) {
            if (err) {
                reject(err)
            }
            reslove(arr)
        })
    })
}
function Stat(path) {
    return new Promise((reslove, reject) => {
        fs.stat(path, function (err, stat) {
            if (err) {
                reject(err)
            }
            reslove(stat)
        })
    })
}
async function getFilePath(path) {
    // 获取目录当前所有文件夹
    let arr = await readDir(path)
    // 获取目录当前所有文件
    let currentFileArray = []
    if (arr) {
        for (let i = 0; i < arr.length; i++) {
            let cpath = path + "\\" + arr[i]
            let stat = await Stat(cpath)
            if (stat.isDirectory()) {
                // 是目录
                let subFileArray = await getFilePath(cpath)
                // console.log(subFileArray)

                currentFileArray = currentFileArray.concat(subFileArray)
            } else {
                // 不是目录
                // 将中文转换成拼音
                let toPinYin = pinyinlite(arr[i], {
                    keepUnrecognized: true
                })
                let toPinYinStr = ''
                toPinYin.forEach(item => {
                    if (item.length > 0) {
                        toPinYinStr += item[0]
                    }
                })
                let obj = {
                    fromPath: cpath,
                    from: arr[i],
                    toPath: path + "\\" + toPinYinStr,
                    to: toPinYinStr
                }
                currentFileArray.push(obj)
            }
        }
    }
    return currentFileArray
}

module.exports = { getFilePath }