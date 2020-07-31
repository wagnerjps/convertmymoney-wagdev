const express = require('express')
const app = express()
const path = require('path')
const convert = require('./lib/convert')
const apiBCB = require('./lib/api.bcb')
const nm_dependencies = ['bootstrap', 'jquery', 'popper.js']; // keep adding required node_modules to this array.


app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))
app.use(express.static(path.join(__dirname, 'public')))
nm_dependencies.forEach(dep => {
    app.use(`/${dep}`, express.static(path.resolve(`node_modules/${dep}`)));
});

app.get('/', async (req, res) => {
    let cotacao = {}

    const cotacaoVenda = await apiBCB.getCotacao('venda')
    const cotacaoCompra = await apiBCB.getCotacao('compra')
    const dataHoraCotacao = await apiBCB.getCotacao('dataCotacao')
    
    if(cotacaoVenda === '' || cotacaoCompra === ''){
        cotacao = {
            error: true
        }
    }else{
        cotacao = {
            error: false,
            cotacaoVenda: cotacaoVenda,
            cotacaoCompra: cotacaoCompra,
            dataHoraCotacao: dataHoraCotacao
        }
    }

    res.render('home', { cotacao: cotacao })
})

app.get('/cotacao', (req, res) => {
    const { cotacao, quantidade } = req.query

    if(cotacao && quantidade){
        const conversao = convert.convert(cotacao, quantidade)

        res.render('cotacao', {
            error: false,
            cotacao: convert.toMoney(cotacao),
            quantidade: convert.toMoney(quantidade),
            conversao: convert.toMoney(conversao)
        })
    }else{
        res.render('cotacao', {
            error: 'Valores inválidos'
        })
    }

    
})

app.listen(5000 || process.env.PORT, err => {
    if(err){
        console.log('Não foi possível iniciar!')
    }else{
        console.log('ConvertMyMoney esta online!')
    }
})