import { Octokit } from '@octokit/rest';
import * as fs from 'fs';
import * as path from 'path';

const OWNER = 'graphlynk';
const REPO = 'mvp';

// Files/directories to exclude
const EXCLUDE = new Set([
  '.git',
  'node_modules',
  '.replit',
  'replit.nix',
  '.cache',
  '.config',
  '.local',
  'dist',
  '.upm',
  'tmp',
  '.replit.d'
]);

let connectionSettings: any;

async function getAccessToken() {
  if (connectionSettings && connectionSettings.settings.expires_at && new Date(connectionSettings.settings.expires_at).getTime() > Date.now()) {
    return connectionSettings.settings.access_token;
  }
  
  const hostname = process.env.REPLIT_CONNECTORS_HOSTNAME;
  const xReplitToken = process.env.REPL_IDENTITY 
    ? 'repl ' + process.env.REPL_IDENTITY 
    : process.env.WEB_REPL_RENEWAL 
    ? 'depl ' + process.env.WEB_REPL_RENEWAL 
    : null;

  if (!xReplitToken) {
    throw new Error('X_REPLIT_TOKEN not found');
  }

  connectionSettings = await fetch(
    'https://' + hostname + '/api/v2/connection?include_secrets=true&connector_names=github',
    {
      headers: {
        'Accept': 'application/json',
        'X_REPLIT_TOKEN': xReplitToken
      }
    }
  ).then(res => res.json()).then(data => data.items?.[0]);

  const accessToken = connectionSettings?.settings?.access_token || connectionSettings.settings?.oauth?.credentials?.access_token;

  if (!connectionSettings || !accessToken) {
    throw new Error('GitHub not connected');
  }
  return accessToken;
}

function getAllFiles(dir: string, baseDir: string = dir): {path: string, content: string}[] {
  const files: {path: string, content: string}[] = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  
  for (const entry of entries) {
    if (EXCLUDE.has(entry.name) || entry.name.startsWith('.')) continue;
    
    const fullPath = path.join(dir, entry.name);
    const relativePath = path.relative(baseDir, fullPath);
    
    if (entry.isDirectory()) {
      files.push(...getAllFiles(fullPath, baseDir));
    } else if (entry.isFile()) {
      try {
        const content = fs.readFileSync(fullPath);
        // Skip binary files
        let isBinary = false;
        for (let i = 0; i < Math.min(content.length, 8000); i++) {
          if (content[i] === 0) { isBinary = true; break; }
        }
        if (!isBinary && content.length < 10000000) {
          files.push({
            path: relativePath,
            content: content.toString('base64')
          });
        }
      } catch (e) {
        console.log(`Skipping ${relativePath}`);
      }
    }
  }
  return files;
}

async function main() {
  const accessToken = await getAccessToken();
  const octokit = new Octokit({ auth: accessToken });
  
  const { data: user } = await octokit.users.getAuthenticated();
  console.log(`Authenticated as: ${user.login}`);
  
  console.log('Collecting files...');
  const files = getAllFiles('/home/runner/workspace');
  console.log(`Found ${files.length} files to push`);
  
  let sha: string | undefined;
  try {
    const { data: ref } = await octokit.git.getRef({
      owner: OWNER,
      repo: REPO,
      ref: 'heads/main'
    });
    sha = ref.object.sha;
    console.log(`Found main branch at ${sha.slice(0,7)}`);
  } catch (e: any) {
    if (e.status === 404) {
      console.log('Empty repository, will create initial commit');
    } else throw e;
  }
  
  console.log('Creating blobs...');
  const tree: { path: string; mode: '100644'; type: 'blob'; sha: string }[] = [];
  
  let count = 0;
  for (const file of files) {
    const { data: blob } = await octokit.git.createBlob({
      owner: OWNER,
      repo: REPO,
      content: file.content,
      encoding: 'base64'
    });
    tree.push({ path: file.path, mode: '100644', type: 'blob', sha: blob.sha });
    count++;
    if (count % 10 === 0) process.stdout.write(`${count}/${files.length}\r`);
  }
  console.log(`\nCreated ${count} blobs`);
  
  console.log('Creating tree...');
  const { data: newTree } = await octokit.git.createTree({
    owner: OWNER,
    repo: REPO,
    tree: tree,
    base_tree: sha
  });
  
  console.log('Creating commit...');
  const { data: commit } = await octokit.git.createCommit({
    owner: OWNER,
    repo: REPO,
    message: 'Graphlynk MVP - SEO & Knowledge Graph Platform\n\nFeatures:\n- SEO-optimized link profiles with JSON-LD schema markup\n- Search rank tracking\n- Blog & newsletter functionality\n- Dual Knowledge Graph search (internal DB + Google KG API)\n- Scroll reveal animations with accessibility support',
    tree: newTree.sha,
    parents: sha ? [sha] : []
  });
  
  console.log('Updating branch...');
  if (sha) {
    await octokit.git.updateRef({
      owner: OWNER,
      repo: REPO,
      ref: 'heads/main',
      sha: commit.sha
    });
  } else {
    await octokit.git.createRef({
      owner: OWNER,
      repo: REPO,
      ref: 'refs/heads/main',
      sha: commit.sha
    });
  }
  
  console.log(`\n✓ Successfully pushed to https://github.com/${OWNER}/${REPO}`);
  console.log(`  Commit: ${commit.sha.slice(0,7)}`);
}

main().catch(e => {
  console.error('Error:', e.message || e);
  process.exit(1);
});
