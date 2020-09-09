const core=require("@actions/core"),github=require("@actions/github"),path=require("path"),fs=require("fs"),glob=require("glob"),csso=require("csso"),{minify:minify}=require("terser"),{Octokit:Octokit}=require("@octokit/core"),{createPullRequest:createPullRequest}=require("octokit-plugin-create-pull-request"),MyOctokit=Octokit.plugin(createPullRequest);!async function(){try{let t=core.getInput("directory");const e=process.env.GITHUB_TOKEN;if(void 0===e||0===e.length)throw new Error("\n        Token not found. Please, set a secret token in your repository. \n        To know more about creating tokens, visit: https://docs.github.com/en/github/authenticating-to-github/creating-a-personal-access-token\n        To know more about setting up personal access token, visit: https://docs.github.com/en/actions/configuring-and-managing-workflows/creating-and-storing-encrypted-secrets\n      ");const n=github.context.ref.slice(11);if(n.startsWith("_minisauras_"))return void console.log(`Code has been minifed. Branch ${n} can be merged now.`);const o=new MyOctokit({auth:e}),i=github.context.repo;(null==t||null==t||t.startsWith("."))&&(t="");const s=t+"**/*.{css,js}",r={dot:!0,ignore:["node_modules/**/*"]},c="_minisauras_"+Math.random().toString(36).slice(2);glob(s,r,(function(t,e){if(t)throw new Error("File not found");let s=[];e.forEach((function(t){Promise.all([readAndMinify(t)]).then((function(e){s.push({path:t,content:e[0]})})).finally((async function(){let t={};if(s.length==e.length&&!n.startsWith("_minisauras_")&&0!==e.length){s.forEach((function(e){t[e.path]=e.content}));const n="https://media1.tenor.com/images/841aeb9f113999616d097b414c539dfd/tenor.gif";let r="Changes in these files:\n";e.forEach((function(t){r+=`- **${t}** \n`})),r+=`![cat](${n})`,r.includes(n)&&await o.createPullRequest({owner:i.owner,repo:i.repo,title:`Minified ${e.length} files`,body:r,head:c,changes:[{files:t,commit:`Minified ${e.length} files`}]}).then((function(t){const e={"Pull request url":t.data.url,"Pull request title":t.data.title,"Sent by":t.data.user.login,"Total number of commits":t.data.commits,Additions:t.data.additions,Deletions:t.data.deletions,"Number of files changed":t.data.changed_files};console.table(e)})).catch((function(){process.on("unhandledRejection",()=>{})}))}})).catch((function(t){throw new Error(t)}))}))}))}catch(t){throw new Error(t)}}();const readAndMinify=async function(t){const e=fs.readFileSync(t,"utf8"),n=path.extname(t);if(".js"===n){return(await minify(e,{compress:!0})).code}if(".css"===n)return csso.minify(e).css;console.log("Other files")};