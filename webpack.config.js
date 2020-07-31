module.exports = {
    ...
    plugins: [
        new webpack.ProvidePlugin({
           $: "jquery",
           jQuery: "jquery"
       })
    ]
};