const axios = require('axios')

function tiktok(url) {
    return new Promise((resolve, reject) => {
        axios.post('https://downloader.bot/api/tiktok/info', {
            "url": url
        }).then(({ data }) => {
            resolve(data)
        })
    })
}


module.exports = tiktok 