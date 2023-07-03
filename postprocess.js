const toml = require("@iarna/toml");
const fs = require("fs");
const path = require("path");

let cf_redirects_file = path.join("public", "_redirects");

function create_page_redirect(slug, redirect_url){
    // realistically speaking, this doesn't do anything,
    // but future insurance if I stop using Cloudflare pages

    // https://gohugo.io/content-management/urls/#how-aliases-work
    slug_dir = path.join("public", slug);

    // make the directory if it does not exist
    if (!fs.existsSync(slug_dir)){
        fs.mkdirSync(slug_dir);
    }

    fs.writeFileSync(path.join(slug_dir, "index.html"),
    `<!DOCTYPE html>
    <html lang="en-us">
      <head>
        <title>${redirect_url}</title>
        <link rel="canonical" href="${redirect_url}">
        <meta name="robots" content="noindex">
        <meta charset="utf-8">
        <meta http-equiv="refresh" content="0; url=${redirect_url}">
      </head>
    </html>`)
}

function create_cf_redirect(slug, redirect_url){
    fs.appendFileSync(cf_redirects_file, `/${slug} ${redirect_url} 302\n`)
}

// delete existing redirects file
if (fs.existsSync(cf_redirects_file)){
    fs.rmSync(cf_redirects_file);
}

// parse the toml file
let hugo_config = toml.parse(fs.readFileSync("hugo.toml"));
let all_links = hugo_config.author.links.concat(hugo_config.author.nonrender_links);

all_links.forEach(element => {
    // get the url slug
    let slug = Object.keys(element)[0];

    // get the data for it
    let data = element[slug];

    // if it's just a string, use that, otherwise use the value from the "href" key.
    let redirect_url = typeof data == "string" ? data : data.href;

    console.log(`Creating redirect for /${slug} to ${redirect_url}`);

    create_page_redirect(slug, redirect_url);
    create_cf_redirect(slug, redirect_url);
});