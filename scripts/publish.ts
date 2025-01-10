import { execSync } from 'child_process';
import { join } from 'path';

interface Release {
  name: string;
  type: 'major' | 'minor' | 'patch';
}

interface ChangesetStatus {
  releases: Release[];
}

async function publishPackages() {
  const changesetStatus = JSON.parse(
    execSync('pnpm exec changeset status --output=json').toString(),
  ) as ChangesetStatus;

  for (const release of changesetStatus.releases) {
    const packagePath = join('packages', release.name);

    // Version
    execSync(`npm version ${release.type}`, { cwd: packagePath });

    // Publish
    execSync('npm publish --access public', {
      cwd: packagePath,
      env: { ...process.env, NODE_AUTH_TOKEN: process.env.NPM_TOKEN },
    });
  }
}

publishPackages().catch(console.error);
