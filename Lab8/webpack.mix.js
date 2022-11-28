const mix = require('laravel-mix');
mix.setResourceRoot('../../');
mix.js('_src/main.js','public/js')
    .css('_src/css/style.css','public/css',{
        processUrls: true,
        imgLoaderOptions: {
            enabled: false,
        },
    })
    .css('_src/css/style2.css','public/css',{
        processUrls: true,
        imgLoaderOptions: {
            enabled: false,
        },
    })
    .options({  
        fileLoaderDirs: {
            images: 'public/images'
        }});
