import withTM from 'next-transpile-modules';

export default withTM(['formidable'])({
  webpack(config, { isServer }) {
    // Transpile the 'formidable' module for use in the client-side bundle
    if (isServer) {
      config.externalsPresets = { node: true };
      config.externals = [{ formidable: 'commonjs formidable' }];
    }

    // Add a rule to handle CSS files
    config.module.rules.push({
      test: /\.css$/,
      use: ['style-loader', 'css-loader', 'postcss-loader'],
    });

    // Configure webpack to handle node: URIs
    config.module.rules.push({
      test: /\/node:crypto/,
      loader: 'null-loader', // Replace with appropriate loader if needed
    });

    return config;
  },
});
