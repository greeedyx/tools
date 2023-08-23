import babel from "@rollup/plugin-babel";
import typescript from "@rollup/plugin-typescript";

export default [{
  input: {
    index: 'src/index.ts',
    task: 'src/task.ts',
    subject: 'src/subject.ts',
    tools: 'src/tools.ts'
  },
  plugins: [
    typescript({ declarationDir: 'esm' }),
    babel({
      configFile: 'babel.config.js',
      babelHelpers: 'bundled',
      exclude: 'node_modules/**'
    }),
  ],
  output: {
    dir: 'esm',
    format: 'es'
  },
}]