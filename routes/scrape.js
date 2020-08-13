const scraperjs = require('scraperjs');

// とりあえずgithubを想定
const get_texts = async (url, path) => {
    return new Promise(resolve => {
        scraperjs.StaticScraper.create(url)
            .scrape(($) => {
                return $(path).map(function () {
                    return $(this).text();
                }).get();
            }).then((content) => {
                resolve(content);
            }).catch((error) => {
                console.error('Error:', error);
            });
    });
}

// (
    async () => {
        const path = "[id^=LC]";
        const url = "https://github.com/KoenHan/gym_sfm/blaob/master/gym_sfm/envs/world.py";
        const res = await get_texts(url, path);
        console.log(res);
        // console.log(res[4][0] == ' ' && res[4][3] == ' ');
    }
// )();

module.exports = get_texts;