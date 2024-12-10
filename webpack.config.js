const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
    mode: 'production',
    devtool: false, 
    cache: {
        type: 'filesystem',
    },
    plugins: [
        new MiniCssExtractPlugin()
    ],
    module: {
        rules: [
            {
                test: /\.scss$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    'css-loader',
                    'postcss-loader',
                    'resolve-url-loader',
                    {
                        loader: 'sass-loader',
                        options: {
                            sourceMap: false,
                            parallel: false 
                        }
                    }
                ]
            }
        ]
    }
};
