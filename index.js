var validator = require('validator')
    ,cheerio = require('cheerio')
    ,async = require('async')
    ,request = require('request')
    ,baseUrl = 'legendas.tv'
    ,protocol = "http://"
    ,baseSearchUrl = protocol + baseUrl + '/util/carrega_legendas_busca/'
    ,baseUrlDownload = protocol + baseUrl + '/downloadarquivo/';

/*
    opts:
        - idioma:
                undefined - all
                1 - Português-BR
                2 - Inglês
                3 - Espanhol
                4 - Francês
                5 - Alemão
                6 - Japonês
                7 - Dinamarquês
                8 - Norueguês
                9 - Sueco
                10 - Português-PT
                11 - Árabe
                12 - Checo
                13 - Chinês
                14 - Coreano
                15 - Búlgaro
                16 - Italiano
                17 - Polonês
        - tipo_legenda:
                undefined - all
                d - destaque
                p - pack

        - proxy:
                protocol://IP_OR_NAME[:PORT]

 */

exports.search = function(termo, opts, cb) {
    var url = ''+baseSearchUrl;

    if (opts && typeof opts === 'function'){
        cb = opts;
        opts = {};
    }

    opts = opts || {};

    if (termo && !validator.isNull(termo) && termo!==''){
        url += '/' + termo;
    }
    else{
        return cb(new Error('termo is invalid'));
    }

    if (opts && opts!== null && opts.idioma){
        var idioma = validator.toInt(opts.idioma,10);
        if (idioma!== NaN && idioma > 0 && idioma < 18){
            url += '/' + idioma;
        }
        else{
            return cb(new Error('idioma is invalid'));
        }
    }
    else{
        url += '/-';
    }

    if (opts && opts!== null && opts.tipo_legenda){
        var tipo_legenda = opts.tipo_legenda;
        if (!validator.isNull(tipo_legenda) && (tipo_legenda === 'd' || tipo_legenda === 'p')){
            url += '/' + tipo_legenda;
        }
        else{
            return cb(new Error('tipo_legenda is invalid'));
        }
    }
    else{
        url += '/-';
    }

    if (opts && opts!== null && opts.proxy){
         var proxy = opts.proxy;
        if (!validator.isURL(proxy))
            return cb(new Error('proxy is invalid'));
    }

    url = encodeURI(url);

    return parsePage(url, termo, opts, parseResults, cb);
};

function parsePage(url, termo, opts, parse, cb) {
    var query = {
        url:url
    };

    if (opts && opts!== null && opts.proxy){
        query.proxy = opts.proxy;
    }

    request(query,function(err,resp,body){
        if (!err){
            parse(termo,body,opts,cb);
        }
        else cb(err);
    });

};

function parseResults(termo,resultsHTML,opts, cb) {
    var $ = cheerio.load(resultsHTML)
        ,arrayLinks = []
        ,undef;

    $('.f_left').each(function(index){
        var subtitle = {};
        var link = $(this).find('p').first().find('a');
        subtitle.link = link;
        subtitle.parent = $(this).parent();
        arrayLinks.push(subtitle);
    });

    async.mapSeries(arrayLinks,function(item,cb){

        var href = $(item.link).attr('href'),
            text = $(item.link).text().toUpperCase(),
            search = termo.replace(/\s/g,'.').toUpperCase()


        if (text.indexOf(search)!== -1){
            var split = href.split('/');
            item.linkLegenda = baseUrlDownload +split[2];
            item.link = protocol+baseUrl + href;
            item.titulo = text;
            item.destaque = ($(item.parent).hasClass('destaque')?1:0);
            item.idioma = $(item.parent).find('img').attr('title');
            delete item.parent;

            var query = {
                url:item.link
            };

            if (opts && opts!== null && opts.proxy){
                query.proxy = opts.proxy;
            }
            request(query,function(err,resp,body){
                if (!err){
                    $1 = cheerio.load(body);
                    item.upload = {};
                    item.upload.data = $1('.date').text();
                    item.upload.hora = $1('.hour').text();
                    item.upload.usuario = $1('.nume > a').text();
                    item.numero_downloads = $1('.number').text();
                }
                else{
                    item.linkLegenda = undef;
                }

                cb(undef,item);

            });
        }
        else cb(undef,item);

    },function(err,results){
        if (!err) {
            results = results.filter(function (item) {
                return (typeof item.linkLegenda !== 'undefined');
            });
            cb(undef,results);
        }
    });
};

