const CopyPlugin = require("copy-webpack-plugin");
const path = require('path');

module.exports = {
	entry: './src/index.js',
	mode: 'development',
	devServer: {
		static: './dist',
	},
	resolve: {
		extensions: ['.js'],
	},
	output: {
		filename: 'main.js',
		path: path.resolve(__dirname, 'dist'),
	},
	plugins: [
		new CopyPlugin({
			patterns: [
				{ from: "public" }
			],
		}),

	],
};