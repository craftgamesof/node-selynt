import { exec } from 'child_process';

export const getCurrentGitBranch = async (cwd)=>{
    return new Promise((resolve, reject) => {
        exec('git rev-parse --abbrev-ref HEAD', { cwd }, (err, stdout, stderr) => {
            if (!err && typeof stdout === 'string') {
                resolve(stdout.trim())
            }
            resolve(null)
        });
    })
}

export const getCurrentGitCommit = async (cwd)=>{
    return new Promise((resolve, reject) => {
        exec('git rev-parse --short HEAD', { cwd }, (err, stdout, stderr) => {
            if (!err && typeof stdout === 'string') {
                resolve(stdout.trim())
            }
            resolve(null)
        });
    })
}