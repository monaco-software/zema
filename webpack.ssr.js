const path = require('path');
const ESLintPlugin = require('eslint-webpack-plugin');
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');
const nodeExternals = require('webpack-node-externals');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const StylelintPlugin = require('stylelint-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const WorkboxPlugin = require('workbox-webpack-plugin');
const NodemonPlugin = require('nodemon-webpack-plugin');
const { StatsWriterPlugin } = require('webpack-stats-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const stats = {
  all: false,
  entrypoints: true,
  chunkGroups: true,
  timings: true,
  errors: true,
};

const isProductionMode = process.env.NODE_ENV === 'production';

const serverConfig = {
  name: 'server',
  stats,
  mode: isProductionMode ? 'production' : 'development',
  target: 'node',
  externals: [nodeExternals()],
  entry: {
    server: './server/server.ts',
  },
  output: {
    filename: 'server.js',
    path: path.resolve(__dirname, 'ssr/server'),
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
        exclude: [/node_modules/],
      },
      {
        test: /\.css$/,
        use: ['null-loader'],
      },
      {
        test: /\.webp|\.mp3$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              emitFile: false,
              publicPath: '/',
            },
          },
        ],
      },
    ],
  },
  plugins: [
    new ESLintPlugin({
      extensions: ['.ts', '.tsx'],
    }),
  ],
};

const clientConfig = {
  name: 'client',
  stats,
  mode: isProductionMode ? 'production' : 'development',
  devtool: !isProductionMode && 'inline-source-map',
  target: isProductionMode ? 'browserslist' : 'web', // Fix https://github.com/webpack/webpack-dev-server/issues/2758#issuecomment-710086019
  entry: {
    index: './src/index.ssr.tsx',
  },
  output: {
    filename: '[name].[contenthash].js',
    path: path.resolve(__dirname, 'ssr/dist'),
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
        exclude: [/node_modules/],
      },
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader', 'postcss-loader'],
      },
      {
        test: /\.webp|\.mp3$/,
        use: {
          loader: 'file-loader',
          options: {
            name: '[hash].[ext]',
            publicPath: '/',
          },
        },
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
  plugins: [
    new CleanWebpackPlugin(),
    new MiniCssExtractPlugin({
      filename: 'index.css',
    }),
    new ESLintPlugin({
      extensions: ['.ts', '.tsx'],
    }),
    new StylelintPlugin({
      files: ['./src/**.css'],
    }),
    new CopyWebpackPlugin({
      patterns: [
        { from: './src/pages/game/assets/fonts/Bangers.ttf' },
        { from: './src/pwa/favicon.ico' },
      ],
    }),
    new StatsWriterPlugin({
      filename: 'stats.json',
      transform(data) {
        return JSON.stringify(
          data.assetsByChunkName.index.concat(data.assetsByChunkName.vendors)
        );
      },
    }),
  ],
};

if (!isProductionMode) {
  clientConfig.plugins.push(
    new CopyWebpackPlugin({
      patterns: [{ from: './scripts/reload.js' }],
    })
  );
  clientConfig.plugins.push(
    new NodemonPlugin({
      script: './ssr/server/server.js',
      watch: [
        path.resolve('./ssr/server/server.js'),
        path.resolve('./ssr/dist/stats.json'),
      ],
      delay: '1000',
      verbose: false,
    })
  );
}

module.exports = [serverConfig, clientConfig];
