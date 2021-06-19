module.exports = {
    mount: {
        public: { url: '/', static: true },
        src: { url: '/dist' },
    },
    plugins: [
        '@snowpack/plugin-postcss',
    ],
    packageOptions: {},
    devOptions: { tailwindConfig: './tailwind.config.js' },
    buildOptions: {},
};
