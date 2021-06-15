module.exports = {
    mount: {
        public: { url: '/', static: true },
        src: { url: '/dist' },
    },
    plugins: [
        '@snowpack/plugin-postcss',
        '@snowpack/plugin-sass',
    ],
    packageOptions: {},
    devOptions: { tailwindConfig: './tailwind.config.js' },
    buildOptions: {},
};
