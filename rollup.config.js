/*
 * If not stated otherwise in this file or this component's LICENSE file the
 * following copyright and licenses apply:
 *
 * Copyright 2020 RDK Management
 *
 * Licensed under the Apache License, Version 2.0 (the License);
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

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
