import { execSync } from 'child_process';
import { join } from 'path';
import fs from 'fs';

interface Release {
  name: string;
  type: 'major' | 'minor' | 'patch';
}

interface ChangesetStatus {
  releases: Release[];
}

async function publishPackages() {
  execSync('pnpm exec changeset status --output=json');
  fs.readFile('json', 'utf-8', (err, data) => {
    try {
      const changesetStatus = JSON.parse(data.toString()) as ChangesetStatus;
      for (const release of changesetStatus.releases) {
        const packagePath = join('packages', release.name);
        // Version
        execSync('pnpm changeset version');
        // Publish
        execSync('npm publish --access public', {
          cwd: packagePath,
          env: { ...process.env, NODE_AUTH_TOKEN: process.env.NPM_TOKEN },
        });
      }
    } catch (err) {
      console.log(err);
      throw new Error('something went wrong while publishig ');
    }
  });
}

publishPackages().catch(console.error);
