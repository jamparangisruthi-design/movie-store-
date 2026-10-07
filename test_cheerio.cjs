async function test() {
    try {
        const res = await fetch('https://cinehd.vc/home', {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
            }
        });
        const html = await res.text();
        console.log(html.substring(0, 200));
        console.log('Blocked?', html.includes('Cloudflare'));
    } catch (e) {
        console.error(e);
    }
}
test();
