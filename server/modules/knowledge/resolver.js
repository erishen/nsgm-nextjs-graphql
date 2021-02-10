const { serverDB } = require('nsgm-cli')
const _ = require('lodash')

const { getConnection } = serverDB

module.exports = {
    knowledge: ({ page = 0, pageSize = 10 }) => {
        return new Promise((resolve, reject)=>{
            getConnection().then((connection)=>{
                const sql = 'SELECT id, name, content from knowledge LIMIT ? OFFSET ?'
                const countSql = 'SELECT count(*) as counts from knowledge'
                const values = [pageSize, page * pageSize]

                console.log('sql', sql, values, countSql)

                connection.query(sql, values, (error, results, fields) => {
                    if (error) throw error
                    console.log('results', results)
                    
                    connection.query(countSql, (countError, countResults, countFields) => {
                        if (countError) throw countError
                        const totalCounts = countResults[0].counts
                        console.log('totalCounts', totalCounts)

                        resolve({
                            totalCounts,
                            items: results
                        })
                        connection.end()
                    })
                })
            })
        })
    }, 
    knowledgeGet: ({ id }) => {
        console.log('knowledgeGet', id)
        return new Promise((resolve, reject)=>{
            getConnection().then((connection)=>{
                let sql = 'SELECT id, name, content from knowledge WHERE 1=1'
                let values = []

                if(id != undefined){
                    sql += ' AND id=? '
                    values.push(id)
                } 

                console.log('sql', sql, values)
                connection.query(sql, values, (error, results, fields) => {
                    if (error) throw error
                    console.log('results', results)

                    if(results.length > 0)
                        resolve(results[0])
                    else
                        reject()
                    connection.end()
                })
            })
        })
    },
    knowledgeSearch: ({ page = 0, pageSize = 10, data }) => {
        console.log('knowledgeSearch', page, pageSize, data)
        const { name } = data
        return new Promise((resolve, reject)=>{
            getConnection().then((connection)=>{
                const values = []
                const countsValues = []

                let whereSql = ''
                if(name != undefined && name != ''){
                    whereSql += ' AND name like ? '
                    values.push('%' + name + '%')
                    countsValues.push('%' + name + '%')
                }

                const sql = 'SELECT id, name, content from knowledge WHERE 1=1 ' + whereSql + ' LIMIT ? OFFSET ?'
                const countSql = 'SELECT count(*) as counts from knowledge WHERE 1=1 ' + whereSql

                values.push(pageSize)
                values.push(page * pageSize)
                
                console.log('sql', sql, values, countSql)

                connection.query(sql, values, (error, results, fields) => {
                    if (error) throw error
                    console.log('results', results)
                    
                    connection.query(countSql, countsValues, (countError, countResults, countFields) => {
                        if (countError) throw countError
                        const totalCounts = countResults[0].counts
                        console.log('totalCounts', totalCounts)

                        resolve({
                            totalCounts,
                            items: results
                        })
                        connection.end()
                    })
                })
            })
        })
    }, 
    knowledgeAdd: ({ data }) => {
        console.log('knowledgeAdd', data)
        const { name, content } = data
        return new Promise((resolve, reject)=>{
            getConnection().then((connection)=>{

                let sql = 'INSERT INTO knowledge (name, content) values (?,?)'
                let values = [name, content]
                
                console.log('sql', sql, values)
                connection.query(sql, values, (error, results, fields) => {
                    if (error) throw error
                    console.log('results', results)

                    resolve(results.insertId)
                    connection.end()
                })
            })
        })
    },
    knowledgeUpdate: ({ id, data }) => {
        console.log('knowledgeUpdate', id, data)
        const { name, content } = data
        return new Promise((resolve, reject)=>{
            getConnection().then((connection)=>{
                let sql = 'UPDATE knowledge SET'
                let values = []

                if(name != undefined){
                    sql += ' name=? '
                    values.push(name)
                }

                if(content != undefined){
                    sql += ', content=? '
                    values.push(content)
                }

                if(sql.indexOf('?') == -1){
                    sql += ' id=? '
                    values.push(id)
                }

                sql += ' WHERE id=? '
                values.push(id)

                console.log('sql', sql, values)
                connection.query(sql, values, (error, results, fields) => {
                    if (error) throw error
                    console.log('results', results)

                    resolve(true)
                    connection.end()
                })
            })
        })
    },
    knowledgeDelete: ({ id }) => {
        console.log('knowledgeDelete', id)
        return new Promise((resolve, reject)=>{
            getConnection().then((connection)=>{
                const sql = 'DELETE FROM knowledge WHERE id=?'
                const values = [id]
                console.log('sql', sql, values)

                connection.query(sql, values, (error, results, fields) => {
                    if (error) throw error
                    console.log('results', results)

                    resolve(true)
                    connection.end()
                })
            })
        })
    }
}