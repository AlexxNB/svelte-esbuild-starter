const esbuild = require("esbuild");
const { derver } = require("derver");
const sveltePlugin = require("esbuild-svelte");

const DEV = process.argv.includes('--dev');

// Development server configuration. To configure production server
// see `start` script in `package.json` file.

const HOST = 'localhost';
const PORT = 5000;

esbuild.build({
        // esbuild configuration
        entryPoints: ['src/main.js'],
        bundle: true,
        outfile: 'public/build/bundle.js',
        mainFields: ['svelte','module','main'],
        minify: !DEV,
        incremental: DEV,
        sourcemap: DEV,  // Use `DEV && 'inline'` to inline sourcemaps to the bundle
        plugins: [
            sveltePlugin({

                compileOptions:{
                    // Svelte compile options
                    dev: DEV,
                    css: false  //use `css:true` to inline CSS in `bundle.js`
                },
                
                preprocess:[
                    // Place here any Svelte preprocessors
                ]
                
            })
        ]

    }).then(bundle => {
        DEV && derver({
            dir: 'public',
            host: HOST,
            port: PORT,
            watch:['public','src'],
            onwatch: async (lr,item)=>{
                if(item == 'src'){
                    lr.prevent();
                    bundle.rebuild().catch(err => lr.error(err.message,'Svelte compile error'));
                }
            }
        })
});

