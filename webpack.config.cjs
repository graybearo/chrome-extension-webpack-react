const path = require("node:path");
const CopyPlugin = require("copy-webpack-plugin");
const HtmlPlugin = require("html-webpack-plugin");
const { ExtReloader } = require("webpack-ext-reloader-next");

/** @type {(env: unknown, argv: { mode?: 'development' | 'production' }) => import('webpack').Configuration} */
module.exports = (_env, argv) => {
	const isDev = argv.mode !== "production";

	return {
		mode: isDev ? "development" : "production",
		devtool: isDev ? "cheap-module-source-map" : false,
		context: __dirname,
		entry: {
			background: "./src/background/index.ts",
			content: "./src/content/index.ts",
			popup: "./src/popup/main.tsx",
			options: "./src/options/main.tsx",
		},
		output: {
			path: path.resolve(__dirname, "dist"),
			filename: "[name].js",
			clean: true,
		},
		resolve: {
			extensions: [".ts", ".tsx", ".js", ".jsx"],
			alias: {
				"@": path.resolve(__dirname, "src"),
			},
		},
		module: {
			rules: [
				{
					test: /\.tsx?$/,
					use: { loader: "ts-loader", options: { transpileOnly: true } },
					exclude: /node_modules/,
				},
				{
					test: /\.css$/,
					use: ["style-loader", "css-loader"],
				},
			],
		},
		plugins: [
			new CopyPlugin({
				patterns: [
					{ from: "src/manifest.json", to: "manifest.json" },
					{ from: "public", to: ".", noErrorOnMissing: true },
				],
			}),
			new HtmlPlugin({
				template: "src/popup/index.html",
				filename: "popup.html",
				chunks: ["popup"],
			}),
			new HtmlPlugin({
				template: "src/options/index.html",
				filename: "options.html",
				chunks: ["options"],
			}),
			...(isDev ? [new ExtReloader()] : []),
		],
		cache: { type: "filesystem" },
		performance: { hints: false },
	};
};
