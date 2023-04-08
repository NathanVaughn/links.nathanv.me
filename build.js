const spawn = require('cross-spawn');
var base_url = "/";

if (process.env.CF_PAGES_BRANCH === 'main') {
    base_url = "https://links.nathanv.me/";
} else if (process.env.CF_PAGES_URL) {
    base_url = process.env.CF_PAGES_URL;
}

console.log(`Using base url "${base_url}"`);
cmd = spawn.sync("npx", ["hugo", "--cleanDestinationDir", "--minify", "-b", base_url], { encoding : 'utf8' });

if (cmd.error) {
    console.log("ERROR: ", cmd.error);
}

console.log(cmd.stdout);
console.error(cmd.stderr);

process.exit(cmd.status);
