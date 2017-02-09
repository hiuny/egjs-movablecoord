var pkg = require("../package.json");
var path = require("path");
var StringReplacePlugin = require("string-replace-webpack-plugin");

module.exports = {
	entry: {
		"eg.movableCoord": "./src/index.js"
	},
	output: {
		path: path.resolve(__dirname, "../dist"),
		filename: "[name].js",
		library: ["eg", "MovableCoord"],
		libraryTarget: "umd",
	},
	externals: [{
		"eg.component": {
			commonjs: "eg.component",
			commonjs2: "eg.component",
			amd: "eg.component",
			root: ["eg", "Component"]
		},
		"hammerjs": "Hammer"
	}],
	devServer: {
		publicPath: "/dist/"
	},
	devtool: "source-map",
	module: {
		rules: [
			{
				test: /(\.js)$/,
				exclude: /(node_modules)/,
				loader: "babel-loader",
				query: {
					"presets": [ 
						[
							"es2015",
							{
								"loose": true,
								"modules": false
							}
						]
					]
				}
			},
			{ 
				test: /(\.js)$/,
				loader: StringReplacePlugin.replace({
					replacements: [
						{
							pattern: /#__VERSION__#/ig,
							replacement: function (match, p1, offset, string) {
								return pkg.version;
							}
						}
					]})
            }
		]
	},
	plugins: [ new StringReplacePlugin() ]
};