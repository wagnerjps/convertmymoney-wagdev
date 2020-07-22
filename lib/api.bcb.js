const axios = require('axios')
const moment = require('moment')
const dateNow = new moment().format('MM-DD-YYYY')

const getUrl = data => `https://olinda.bcb.gov.br/olinda/servico/PTAX/versao/v1/odata/CotacaoDolarDia(dataCotacao=@dataCotacao)?@dataCotacao=%27${data}%27&$top=100&$format=json&$select=cotacaoCompra,cotacaoVenda,dataHoraCotacao`
const getCotacaoAPI = (data) => axios.get(getUrl(data))
const extCotaVenda = res => res.data.value[0].cotacaoVenda
const extCotaCompra = res => res.data.value[0].cotacaoCompra
const extDataHoraCotacao = res => res.data.value[0].dataHoraCotacao


const getCotacao = async (type) => {
    
    try{
        const res = await getCotacaoAPI(dateNow)
        let cotacao = ''
        
        switch(type){
            case 'venda':
                cotacao = extCotaVenda(res)
            break;
            case 'compra':
                cotacao = extCotaCompra(res)
            break;
            default:
                cotacao =  extDataHoraCotacao(res)
            break;
        }

        return cotacao
    }catch(err){
        return ''
    }
}

module.exports = {
    getCotacaoAPI,
    extCotaVenda,
    extCotaCompra,
    getCotacao
}
