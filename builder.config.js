export default {
	esbuild: {
        bundle: true,
        minify: true,
        sourcemap: true,
        drop: ['console', 'debugger'],
        platform: 'browser',
        format: 'esm',
        target: ['es2015'],
        legalComments: 'none',
        loader: {
          '.json': 'json',
        },
        define: {
          'process.env.NODE_ENV': '"production"',
        },
	},
  sass: {
    paths: [ 
      'base', 
    ], // in styles/
  },
  compression: {
    gzip: true,
    // BROTLI OPTIONAL
    // brotli: false,
  },
	verbose: false,
}
