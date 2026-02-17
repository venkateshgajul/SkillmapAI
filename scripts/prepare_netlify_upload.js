const fs = require('fs');
const path = require('path');

function findBuildDir() {
  const candidates = [
    path.join(__dirname, 'frontend', 'build'),
    path.join(__dirname, '..', 'frontend', 'build'),
    path.join(process.cwd(), 'frontend', 'build'),
    path.join(process.cwd(), 'skill-gap-mapper', 'frontend', 'build')
  ];
  for (const c of candidates) {
    if (fs.existsSync(c) && fs.statSync(c).isDirectory()) return c;
  }
  return null;
}

function copyRecursive(src, dest) {
  if (!fs.existsSync(src)) return;
  const stat = fs.statSync(src);
  if (stat.isDirectory()) {
    if (!fs.existsSync(dest)) fs.mkdirSync(dest, { recursive: true });
    for (const entry of fs.readdirSync(src)) {
      copyRecursive(path.join(src, entry), path.join(dest, entry));
    }
  } else {
    fs.copyFileSync(src, dest);
  }
}

function fixIndexHtml(indexPath) {
  let html = fs.readFileSync(indexPath, 'utf8');
  // Replace absolute root paths like /static/... with relative static/...
  html = html.replace(/src=\"\//g, 'src="');
  html = html.replace(/href=\"\//g, 'href="');
  fs.writeFileSync(indexPath, html, 'utf8');
}

function main() {
  const buildDir = findBuildDir();
  if (!buildDir) {
    console.error('Could not find frontend build directory. Expected one of: frontend/build');
    process.exit(1);
  }

  const outDir = path.join(process.cwd(), 'netlify_upload');
  if (fs.existsSync(outDir)) {
    console.log('Removing existing netlify_upload folder...');
    fs.rmSync(outDir, { recursive: true, force: true });
  }
  fs.mkdirSync(outDir, { recursive: true });

  console.log('Copying build files...');
  copyRecursive(buildDir, outDir);

  const indexPath = path.join(outDir, 'index.html');
  if (fs.existsSync(indexPath)) {
    console.log('Fixing asset paths in index.html...');
    fixIndexHtml(indexPath);
  }

  // Copy netlify.toml if present in frontend
  const netlifySrc = path.join(path.dirname(buildDir), 'netlify.toml');
  if (fs.existsSync(netlifySrc)) {
    console.log('Copying netlify.toml...');
    fs.copyFileSync(netlifySrc, path.join(outDir, 'netlify.toml'));
  }

  console.log('Done. `netlify_upload` ready for Netlify.');
  console.log('Zip or upload the `netlify_upload` folder as the site publish directory.');
}

main();
