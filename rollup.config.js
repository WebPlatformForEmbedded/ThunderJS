import babel from 'rollup-plugin-babel'
import resolve from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs'
import { uglify } from 'rollup-plugin-uglify'
import peerDepsExternal from 'rollup-plugin-peer-deps-external'

export default [
  {
    input: './src/thunderJS.js',
    output: {
      file: './dist/thunderJS.js',
      format: 'iife',
      name: 'ThunderJS',
    },
    plugins: [resolve({ browser: true }), commonjs(), babel(), uglify()],
  },
  {
    input: './src/thunderJS.js',
    output: {
      file: './module/thunderJS.js',
      format: 'cjs',
      name: 'ThunderJS',
    },
    plugins: [peerDepsExternal(), babel(), uglify()],
  },
]
