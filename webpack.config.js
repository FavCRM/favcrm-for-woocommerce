const defaultConfig = require('@wordpress/scripts/config/webpack.config');
const { getWebpackEntryPoints } = require("@wordpress/scripts/utils/config");
const WooCommerceDependencyExtractionWebpackPlugin = require('@woocommerce/dependency-extraction-webpack-plugin');
const path = require('path');
const glob = require('glob');
const fs = require('fs');

const wcDepMap = {
    '@woocommerce/blocks-registry': ['wc', 'wcBlocksRegistry']
};

const wcHandleMap = {
    '@woocommerce/blocks-registry': 'wc-blocks-registry'
};

const requestToExternal = (request) => {
    if (wcDepMap[request]) {
        return wcDepMap[request];
    }
};

const requestToHandle = (request) => {
    if (wcHandleMap[request]) {
        return wcHandleMap[request];
    }
};

const getEntries = () => {
    const entries = {};

    const adminFolders = fs.readdirSync(path.resolve(__dirname, 'src/admin'));

    adminFolders.forEach((folder) => {
        const srcFile = path.resolve(__dirname, `src/admin/${folder}/${folder}.js`);

        if (fs.existsSync(srcFile)) {
            entries[`admin/${folder}/index`] = srcFile;
        }
    });

    entries['frontend/cart-use-credit/index'] = path.resolve(__dirname, 'resources/js/frontend/cart-use-credit.js');

    return entries;
}

// Export configuration.
module.exports = {
    ...defaultConfig,
    entry: {
        ...defaultConfig.entry(),
        ...getEntries(),
    },
    output: {
        path: path.resolve( __dirname, 'build' ),
    },
    plugins: [
        ...defaultConfig.plugins.filter(
            (plugin) =>
                plugin.constructor.name !== 'DependencyExtractionWebpackPlugin'
        ),
        new WooCommerceDependencyExtractionWebpackPlugin({
            requestToExternal,
            requestToHandle
        })
    ]
};
