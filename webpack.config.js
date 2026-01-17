/**
 * Webpack config extending wp-scripts default.
 *
 * @package StaticLPs
 */

const path = require( 'path' );
const fs = require( 'fs' );
const defaultConfig = require( '@wordpress/scripts/config/webpack.config' );
const RemoveEmptyScriptsPlugin = require( 'webpack-remove-empty-scripts' );
const MiniCssExtractPlugin = require( 'mini-css-extract-plugin' );

// Simple plugin to copy vendor files
class CopyVendorFilesPlugin {
	apply( compiler ) {
		const pluginName = 'CopyVendorFilesPlugin';
		
		compiler.hooks.afterEmit.tap( pluginName, () => {
			const vendorSource = path.resolve( __dirname, 'assets/vendors/embla-carousel.umd.js' );
			const vendorDest = path.resolve( __dirname, 'dist/js/embla-carousel.umd.js' );
			
			// Ensure dist/js directory exists
			const distJsDir = path.dirname( vendorDest );
			if ( !fs.existsSync( distJsDir ) ) {
				fs.mkdirSync( distJsDir, { recursive: true } );
			}
			
			// Copy vendor file
			if ( fs.existsSync( vendorSource ) ) {
				fs.copyFileSync( vendorSource, vendorDest );
			}
		} );
	}
}

module.exports = {
	...defaultConfig,
	entry: {
		'js/scripts': path.resolve( __dirname, 'assets/js/scripts.js' ),
		style: path.resolve( __dirname, 'assets/scss/main.scss' ),
	},
	output: {
		...defaultConfig.output,
		path: path.resolve( __dirname, 'dist' ),
		filename: '[name].min.js',
	},
	plugins: [
		...defaultConfig.plugins.filter( ( plugin ) => {
			const pluginName = plugin.constructor.name;
			// Remove DependencyExtractionWebpackPlugin (generates .asset.php files)
			if ( pluginName === 'DependencyExtractionWebpackPlugin' )
				return false;
			// Remove RTL plugin (generates -rtl.css files)
			if (
				pluginName === 'RtlCssPlugin' ||
				pluginName === 'RtlCssWebpackPlugin'
			)
				return false;
			// Replace MiniCssExtractPlugin with custom config
			if ( pluginName === 'MiniCssExtractPlugin' ) return false;
			return true;
		} ),
		// Custom MiniCssExtractPlugin to control CSS filename
		new MiniCssExtractPlugin( {
			filename: 'css/[name].min.css',
		} ),
		new RemoveEmptyScriptsPlugin( {
			stage: RemoveEmptyScriptsPlugin.STAGE_AFTER_PROCESS_PLUGINS,
		} ),
		new CopyVendorFilesPlugin(),
	],
};
