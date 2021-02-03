const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const isProductionMode = process.env.NODE_ENV === 'production';

module.exports = {
  mode: isProductionMode ? 'production' : 'development',
  devtool: !isProductionMode && 'inline-source-map',
  entry: {
    index: './src/index.tsx',
  },
  output: {
    filename: '[name].[contenthash].js',
    path: path.resolve(__dirname, 'dist'),
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx']
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      }
    ]
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
    new HtmlWebpackPlugin({
      template: './src/index.html',
      inject: 'head',
      scriptLoading: 'defer',
    }),
  ],
}
