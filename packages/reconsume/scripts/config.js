const babel = require('rollup-plugin-babel');
const commonjs = require('rollup-plugin-commonjs');
const replace = require('rollup-plugin-replace');
const resolve = require('rollup-plugin-node-resolve');
const uglify = require('rollup-plugin-uglify');

const getPlugins = (env) => {
  const plugins = [
    resolve({
      module: true,
      jsnext: true,
    }),
  ];

  if (env) {
    plugins.push(replace({
      'process.env.NODE_ENV': JSON.stringify(env),
    }));
  }

  plugins.push(
    babel({
      exclude: 'node_modules/**',
      babelrc: false,
      presets: [['env', { loose: true, modules: false }], 'stage-1', 'react'],
      plugins: ['external-helpers'].concat(env === 'production' ? ['dev-expression', 'transform-react-remove-prop-types'] : []),
    }),
    commonjs({
      include: ['node_modules/**', '../../../node_modules/**', '../../node_modules/**'],
      namedExports: {
        '../../../node_modules/prop-types/index.js': ['PropTypes'],
      },
    }),
  );

  if (env === 'production') {
    plugins.push(uglify());
  }

  return plugins;
};

const config = {
  input: 'modules/index.js',
  output: {
    globals: {
      react: 'React',
      'prop-types': 'PropTypes',
    },
  },
  external: ['react', 'prop-types'],
  plugins: getPlugins(process.env.BUILD_ENV),
};

module.exports = config;
