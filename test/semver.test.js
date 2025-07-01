import test from "node:test"
import { isValid, canonical, major, majorMinor, prerelease, build, compare, sort, max } from "../src/semver.ts";

const tests = [
    { in: "bad", out: "" },
    { in: "v1-alpha.beta.gamma", out: "" },
    { in: "v1-pre", out: "" },
    { in: "v1+meta", out: "" },
    { in: "v1-pre+meta", out: "" },
    { in: "v1.2-pre", out: "" },
    { in: "v1.2+meta", out: "" },
    { in: "v1.2-pre+meta", out: "" },
    { in: "v1.0.0-alpha", out: "v1.0.0-alpha" },
    { in: "v1.0.0-alpha.1", out: "v1.0.0-alpha.1" },
    { in: "v1.0.0-alpha.beta", out: "v1.0.0-alpha.beta" },
    { in: "v1.0.0-beta", out: "v1.0.0-beta" },
    { in: "v1.0.0-beta.2", out: "v1.0.0-beta.2" },
    { in: "v1.0.0-beta.11", out: "v1.0.0-beta.11" },
    { in: "v1.0.0-rc.1", out: "v1.0.0-rc.1" },
    { in: "v1", out: "v1.0.0" },
    { in: "v1.0", out: "v1.0.0" },
    { in: "v1.0.0", out: "v1.0.0" },
    { in: "v1.2", out: "v1.2.0" },
    { in: "v1.2.0", out: "v1.2.0" },
    { in: "v1.2.3-456", out: "v1.2.3-456" },
    { in: "v1.2.3-456.789", out: "v1.2.3-456.789" },
    { in: "v1.2.3-456-789", out: "v1.2.3-456-789" },
    { in: "v1.2.3-456a", out: "v1.2.3-456a" },
    { in: "v1.2.3-pre", out: "v1.2.3-pre" },
    { in: "v1.2.3-pre+meta", out: "v1.2.3-pre" },
    { in: "v1.2.3-pre.1", out: "v1.2.3-pre.1" },
    { in: "v1.2.3-zzz", out: "v1.2.3-zzz" },
    { in: "v1.2.3", out: "v1.2.3" },
    { in: "v1.2.3+meta", out: "v1.2.3" },
    { in: "v1.2.3+meta-pre", out: "v1.2.3" },
    { in: "v1.2.3+meta-pre.sha.256a", out: "v1.2.3" },
]

/**
 * @param {TemplateStringsArray} strings 
 * @param  {unknown[]} values 
 * @returns {string}
 */
function jf(strings, ...values) {
    const values2 = values.map(v => JSON.stringify(v));
    return String.raw({ raw: strings }, ...values2);
}

test("isValid", (t) => {
    for (const tt of tests) {
        const ok = isValid(tt.in);
        t.assert.equal(ok, tt.out !== "", jf`isValid(${tt.in}) = ${ok}, want ${!ok}`);
    }
})

test("canonical", (t) => {
    for (const tt of tests) {
        const c = canonical(tt.in);
        t.assert.equal(c, tt.out, jf`canonical(${tt.in}) = ${c}, want ${tt.out}`);
    }
})

test("major", (t) => {
    for (const tt of tests) {
        const out = major(tt.in);
        let want = "";
        const i = tt.out.indexOf(".");
        if (i >= 0) {
            want = tt.out.slice(0, i);
        }
        t.assert.equal(out, want, jf`major(${tt.in}) = ${out}, want ${want}`);
    }
})
