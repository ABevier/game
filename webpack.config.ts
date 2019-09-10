import path from 'path';
import { Configuration } from 'webpack';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import cssnano from 'cssnano';

const nodeModulesPath = path.resolve(__dirname, 'node_modules');

const config: Configuration = {
  entry: ['./src/client/client'],
  output: {
    path: path.join(__dirname, 'dist', 'statics'),
    filename: `[name]-[hash:8]-bundle.js`,
    publicPath: '/statics/',
  },
  resolve: {
    extensions: ['.js', '.ts', '.tsx'],
  },
  optimization: {
    splitChunks: {
      cacheGroups: {
        commons: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks: 'all',
        },
      },
    },
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: ['ts-loader'],
        exclude: [/node_modules/, nodeModulesPath],
      },
      {
        test: /\.css$/,
        use: [
          {
            loader: 'style-loader',
          },
          {
            loader: 'css-loader',
          },
        ],
      },
      {
        test: /.jpe?g$|.gif$|.png$|.svg$|.woff$|.woff2$|.ttf$|.eot$/,
        use: 'url-loader?limit=10000',
      },
    ],
  },
  externals: {
    'react': 'React',
    'react-dom': 'ReactDOM',
  },
  plugins: [
    new HtmlWebpackPlugin({
        template: "./index.html",
        filename: "index.html",
        inject: "body"
    }),
  ],
};

export default config;