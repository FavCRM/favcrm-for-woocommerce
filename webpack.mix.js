let mix = require('laravel-mix');
let path = require('path');

mix.setResourceRoot('../');
mix.setPublicPath(path.resolve('./'));

mix.webpackConfig({
    watchOptions: { ignored: [
        path.posix.resolve(__dirname, './node_modules'),
        path.posix.resolve(__dirname, './css'),
        path.posix.resolve(__dirname, './js'),
        path.posix.resolve(__dirname, './public'),
    ] },
});

mix.js('resources/js/favored-public.js', './public/js');

mix.postCss("resources/css/app.css", "./public/css");

mix.postCss("resources/css/editor-style.css", "./public/css");

// mix.browserSync({
//     proxy: 'http://tailpress.test',
//     host: 'tailpress.test',
//     open: 'external',
//     port: 8000
// });

if (mix.inProduction()) {
    mix.version();
} else {
    mix.options({ manifest: false });
}
