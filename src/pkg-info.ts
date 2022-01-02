import { dirname } from 'path';
import { fileURLToPath } from 'url';
import { NormalizedReadResult, readPackageUpSync } from 'read-pkg-up'

const __dirname = dirname(fileURLToPath(import.meta.url));

export const readResult = readPackageUpSync({ cwd: __dirname })

if (readResult === undefined)
	throw new TypeError

export const pkgInfo: NormalizedReadResult = readResult
