import resolve from "@rollup/plugin-node-resolve";
import commonjs from '@rollup/plugin-commonjs';
import nodePolyfills from "rollup-plugin-node-polyfills";

export default [
  {
    input: "./dist/esm/encodingMethods/bytewords.js",
    output: {
      file: "./dist/web/bytewords.js",
      format: "esm",
      exports: "auto",
    },
    plugins: [
      nodePolyfills(),
      resolve({
        preferBuiltins: false,
        moduleDirectories: ["node_modules"],
        exportConditions: ["default", "import", "node"],
      }),
      commonjs(),
    ],
  },
];
