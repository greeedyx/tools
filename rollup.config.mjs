import babel from "@rollup/plugin-babel";
import commonjs from "@rollup/plugin-commonjs";
import typescript from "@rollup/plugin-typescript";
import { defineConfig } from 'rollup';
import terser from '@rollup/plugin-terser';

const cjs = defineConfig({
  input: 'src/index.ts',
  plugins: [
    typescript({
      declarationDir: 'dist'
    }),
    commonjs(),
    babel({
      configFile: 'babel.config.js',
      babelHelpers: 'bundled',
      exclude: 'node_modules/**'
    }),
  ],
  external: ['clone'],
  output: [
    {
      file: 'dist/index.cjs',
      format: 'cjs',
      exports: 'named'
    },
    {
      file: 'dist/index.min.cjs',
      format: 'cjs',
      exports: 'named',
      plugins: [terser({ maxWorkers: 4 })]
    }
  ]
})


const esm = defineConfig({
  input: {
    index: 'src/index.ts',
    task: 'src/task.ts',
    subject: 'src/subject.ts'
  },
  plugins: [
    typescript({
      declarationDir: 'dist/esm'
    }),
    babel({
      configFile: 'babel.config.js',
      babelHelpers: 'bundled',
      exclude: 'node_modules/**'
    }),
  ],
  external: ['clone'],
  output: [
    { dir: 'dist/esm', format: 'es', exports: 'named' }
  ]
})

export default [cjs, esm];

