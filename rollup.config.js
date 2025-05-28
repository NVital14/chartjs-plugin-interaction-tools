import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';

export default [
  {
    input: 'src/index.js',
    output: {
      file: 'dist/chartjs-plugin-interaction-tools.umd.js',
      format: 'umd',
      name: 'ChartjsPluginInteractionTools',
      globals: {
        'chart.js': 'Chart'
      }
    },
    external: ['chart.js'],
    plugins: [resolve(), commonjs()]
  },
  {
    input: 'src/index.js',
    output: {
      file: 'dist/chartjs-plugin-interaction-tools.esm.js',
      format: 'esm'
    },
    external: ['chart.js'],
    plugins: [resolve(), commonjs()]
  }
];
