const mix = require('laravel-mix');
mix.setResourceRoot('../../');
mix.webpackConfig({
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                loader: 'ts-loader',
                options: { appendTsSuffixTo: [/\.vue$/] },
                exclude: /node_modules/,
            },
        ],
    },
    resolve: {
        extensions: ['.js', '.jsx', '.ts', '.tsx'],
    },
    });

mix.js('_src/main.ts','public/js')
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
mix.copy("_src/index.html","public/index.html");

