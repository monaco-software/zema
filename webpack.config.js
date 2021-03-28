const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const ESLintPlugin = require('eslint-webpack-plugin');
const StylelintPlugin = require('stylelint-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');
const WorkboxPlugin = require('workbox-webpack-plugin');

console.log(
  `\u{1F527}\x1b[1m\x1b[33m process.env.NODE_ENV = '\x1b[96m${process.env.NODE_ENV}\x1b[33m'\x1b[0m\n`
);

const isProductionMode = process.env.NODE_ENV === 'production';

module.exports = {
  mode: isProductionMode ? 'production' : 'development',
  devtool: !isProductionMode && 'inline-source-map',
  target: isProductionMode ? 'browserslist' : 'web', // Fix https://github.com/webpack/webpack-dev-server/issues/2758#issuecomment-710086019
  entry: {
    index: './src/index.tsx',
  },
  output: {
    filename: '[name].[contenthash].js',
    path: path.resolve(__dirname, 'dist'),
    publicPath: '/',
  },
  resolve: {
    plugins: [new TsconfigPathsPlugin()],
    extensions: ['.ts', '.tsx', '.js', '.jsx'],
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader', 'postcss-loader'],
      },
      {
        test: /\.webp|\.mp3$/,
        use: ['file-loader'],
      },
    ],
  },
  optimization: {
    moduleIds: 'deterministic',
    splitChunks: {
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks: 'all',
        },
      },
    },
  },
  devServer: {
    watchContentBase: true,
    watchOptions: {
      ignored: /node_modules/,
      aggregateTimeout: 500,
      poll: 500,
    },
    historyApiFallback: true,
    hot: true,
    port: 9000,
  },
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      template: './src/index.html',
      inject: 'head',
      scriptLoading: 'defer',
    }),
    new MiniCssExtractPlugin({
      filename: 'index.css',
    }),
    new ESLintPlugin({
      extensions: ['.ts', '.tsx'],
    }),
    new StylelintPlugin(),
    new CopyWebpackPlugin({
      patterns: [
        { from: './src/pages/game/assets/fonts/Bangers.ttf' },
        { from: './src/pwa/' },
      ],
    }),
    isProductionMode
      ? new WorkboxPlugin.GenerateSW({
          clientsClaim: true,
          skipWaiting: true,
          maximumFileSizeToCacheInBytes: 10 * 1024 * 1024,
          navigateFallback: '/index.html',
        })
      : false,
  ].filter(Boolean),
};
