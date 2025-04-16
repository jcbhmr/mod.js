/*!
Copyright 2009 The Go Authors.
Copyright 2025 Jacob Hummer

Redistribution and use in source and binary forms, with or without
modification, are permitted provided that the following conditions are
met:

   * Redistributions of source code must retain the above copyright
notice, this list of conditions and the following disclaimer.
   * Redistributions in binary form must reproduce the above
copyright notice, this list of conditions and the following disclaimer
in the documentation and/or other materials provided with the
distribution.
   * Neither the name of Google LLC nor the names of its
contributors may be used to endorse or promote products derived from
this software without specific prior written permission.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS
"AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT
LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR
A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT
OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL,
SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE,
DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY
THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
(INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
*/

const enosys = () => {
    const err = new Error("not implemented");
    err.code = "ENOSYS";
    return err;
};

let outputBuf = "";
export const constants = { O_WRONLY: -1, O_RDWR: -1, O_CREAT: -1, O_TRUNC: -1, O_APPEND: -1, O_EXCL: -1, O_DIRECTORY: -1 } // unused
export function writeSync(fd, buf) {
    outputBuf += decoder.decode(buf);
    const nl = outputBuf.lastIndexOf("\n");
    if (nl != -1) {
        console.log(outputBuf.substring(0, nl));
        outputBuf = outputBuf.substring(nl + 1);
    }
    return buf.length;
}
export function write(fd, buf, offset, length, position, callback) {
    if (offset !== 0 || length !== buf.length || position !== null) {
        callback(enosys());
        return;
    }
    const n = writeSync(fd, buf);
    callback(null, n);
}
export function chmod(path, mode, callback) { callback(enosys()); }
export function chown(path, uid, gid, callback) { callback(enosys()); }
export function close(fd, callback) { callback(enosys()); }
export function fchmod(fd, mode, callback) { callback(enosys()); }
export function fchown(fd, uid, gid, callback) { callback(enosys()); }
export function fstat(fd, callback) { callback(enosys()); }
export function fsync(fd, callback) { callback(null); }
export function ftruncate(fd, length, callback) { callback(enosys()); }
export function lchown(path, uid, gid, callback) { callback(enosys()); }
export function link(path, link, callback) { callback(enosys()); }
export function lstat(path, callback) { callback(enosys()); }
export function mkdir(path, perm, callback) { callback(enosys()); }
export function open(path, flags, mode, callback) { callback(enosys()); }
export function read(fd, buffer, offset, length, position, callback) { callback(enosys()); }
export function readdir(path, callback) { callback(enosys()); }
export function readlink(path, callback) { callback(enosys()); }
export function rename(from, to, callback) { callback(enosys()); }
export function rmdir(path, callback) { callback(enosys()); }
export function stat(path, callback) { callback(enosys()); }
export function symlink(path, link, callback) { callback(enosys()); }
export function truncate(path, length, callback) { callback(enosys()); }
export function unlink(path, callback) { callback(enosys()); }
export function utimes(path, atime, mtime, callback) { callback(enosys()); }
const exports = {
    constants,
    writeSync,
    write,
    chmod,
    chown,
    close,
    fchmod,
    fchown,
    fstat,
    fsync,
    ftruncate,
    lchown,
    link,
    lstat,
    mkdir,
    open,
    read,
    readdir,
    readlink,
    rename,
    rmdir,
    stat,
    symlink,
    truncate,
    unlink,
    utimes,
}
export { exports as default }
export { exports as "module.exports" };