module.exports = {
  // Presets run last-to-first, so TypeScript stripping happens first,
  // then React JSX, then env transforms.
  presets: [
    ['@babel/preset-env', { targets: { node: 'current' } }],
    ['@babel/preset-react', { runtime: 'automatic' }],
    // Must be LAST in array (runs first) so TS types are stripped
    // before any other preset sees the code.
    ['@babel/preset-typescript', { allExtensions: true, isTSX: true }],
  ],
};
