const { build } = require("esbuild");
const { derver } = require("derver");
const sveltePlugin = require("esbuild-svelte");

const DEV = process.argv.includes('--dev');

async function build_client(){
    return await build({
        entryPoints: ['src/main.js'],
        bundle: true,
        outfile: 'public/build/bundle.js',
        sourcemap: DEV && 'inline',
        minify: !DEV,
        incremental: DEV,
        plugins: [
            sveltePlugin({compileOptions:{
                dev: DEV,
                css: false
            }})
        ]
    });
}

build_client();
if(DEV){
    derver({
        dir: 'public',
        port: 5000,
        watch:['public','src'],
        onwatch: async (lr,item)=>{
            if(item == 'src'){
                lr.prevent();
                try{
                    await build_client();
                }catch(err){
                    lr.error(err.message,'Svelte compile error')
                }
            }
        }
    })
}