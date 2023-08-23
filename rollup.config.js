import babel from "@rollup/plugin-babel";
import typescript from "@rollup/plugin-typescript";
import terser from '@rollup/plugin-terser';

export default [{
  input: {
    index: 'src/index.ts',
    task: 'src/task.ts',
    subject: 'src/subject.ts',
    tools: 'src/tools.ts'
  },
  plugins: [
    typescript({ declarationDir: 'dist' }),
    babel({
      configFile: 'babel.config.js',
      babelHelpers: 'bundled',
      exclude: 'node_modules/**'
    }),
    terser({ maxWorkers: 4 })
  ],
  output: {
    dir: 'dist',
    format: 'cjs'
  }
}]