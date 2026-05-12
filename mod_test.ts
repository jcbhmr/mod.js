import { execa } from "execa"
import { fileURLToPath } from "node:url";

const version = await (async () => {
    const result = await execa`git -C ${fileURLToPath(import.meta.resolve("./mod/"))} describe --exact-match --tags`
    const lines = result.stdout.split(/\r?\n/g)
    const line = lines[0]
    if (line == null) {
        throw new DOMException(`No output`)
    }
    return line;
})()

Deno.test(`go test golang.org/x/mod@${}`, async () => {

})