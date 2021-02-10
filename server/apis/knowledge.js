const express = require('express')
const XLSX = require('xlsx')
const { knowledgeBatchAdd } = require('../modules/knowledge/resolver')
const router = express.Router()

router.post('/import', (req, res) => {
    //console.log('files', req.files)
    const workbook = XLSX.read(req.files.file.data, { type: "buffer" })
    //console.log('Sheets', workbook.Sheets)

    const datas = XLSX.utils.sheet_to_json(workbook.Sheets["Knowledge"])
    //console.log('datas', datas)

    knowledgeBatchAdd(datas)
    res.json({ name: 'Knowledge' })
})

module.exports = router