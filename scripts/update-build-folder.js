const rimraf = require('rimraf');
const util = require('util');
const path = require('path');
const ncp = require('ncp');
const fs = require('fs');

const rimrafAsync = util.promisify(rimraf);
const ncpAsync = util.promisify(ncp.ncp);

const repoPathConf = path.join(process.cwd(), 'repo-path.conf');

let repoPath = process.env.FW_CMS_REPO_PATH;

if (fs.existsSync(repoPathConf)) {
  repoPath = fs.readFileSync(repoPathConf, 'utf8').replace(/\n$/, '');
}

if (!repoPath) {
  throw new ReferenceError('并未指定前端代码库地址');
}

const repoBuildPath = path.join(repoPath, 'build');

if (!fs.existsSync(repoBuildPath)) {
  throw new ReferenceError('source repo\'s build folder not exists');
}

(async function() {
  try {
    await rimrafAsync(path.join(process.cwd(), 'build'));
    await ncpAsync(repoBuildPath, path.join(process.cwd(), 'build'));
  }

  catch (err) {
    console.error(err);
  }
})();
