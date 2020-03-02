// path
const path = require('path');
const autoprofixer = require('autoprefixer');
const ExtractCss = require('extract-text-webpack-plugin');

// env
const MODE = process.env.WEBPACK_ENV;
// entry
const ENTRY_FILE = path.resolve(__dirname, 'assets', 'js', 'main.js');
// output
const OUTPUT_DIR = path.join(__dirname, 'static');

const config = {
  entry: ["@babel/polyfill", ENTRY_FILE],
  mode: MODE,
  module: {
    rules: [
      {
        test: /\.(js)$/,
        use: [
          {
            loader: 'babel-loader'
          }
        ]
      },
      {
        test: /\.(scss|sass)$/,
        use: ExtractCss.extract([
          {
            loader: 'css-loader'
          },
          {
            loader: 'postcss-loader',
            options: {
              plugins() {
                return [autoprofixer({ browsers: "cover 99.5%"})];
              }
            }
          },
          {
            loader: 'sass-loader'
          }
        ])
      }
    ]
  },
  output: {
    path: OUTPUT_DIR,
    filename: '[name].js'
  },
  plugins: [new ExtractCss("styles.css")]
};

module.exports = config;