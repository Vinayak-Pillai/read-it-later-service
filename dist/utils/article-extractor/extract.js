import * as cheerio from "cheerio";
export const extractArticle = async (rawUrl) => {
    const parsedUrl = new URL(rawUrl);
    const domain = parsedUrl.hostname.replace(/^www\./, "");
    const response = await fetch(rawUrl, {
        headers: {
            "User-Agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1",
            Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
            "Accept-Language": "en-US,en;q=0.9",
        },
        signal: AbortSignal.timeout(8000),
    });
    if (!response.ok) {
        throw new Error(`Target site responded with status ${response.status}`);
    }
    const contentType = response.headers.get("content-type") || "";
    if (!contentType.includes("text/html")) {
        throw new Error(`Invalid content type: expected HTML but received "${contentType}"`);
    }
    const MAX_BYTES = 5 * 1024 * 1024;
    const contentLength = response.headers.get("content-length");
    if (contentLength && parseInt(contentLength, 10) > MAX_BYTES) {
        throw new Error("Payload size exceeds 5MB limit");
    }
    let html = "";
    if (response.body) {
        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let totalBytes = 0;
        while (true) {
            const { done, value } = await reader.read();
            if (done)
                break;
            totalBytes += value.byteLength;
            if (totalBytes > MAX_BYTES) {
                await reader.cancel();
                throw new Error("Payload size exceeds 5MB limit");
            }
            html += decoder.decode(value, { stream: true });
        }
        html += decoder.decode();
    }
    else {
        html = await response.text();
    }
    const $ = cheerio.load(html);
    // Extract title with fallbacks
    const rawTitle = $('meta[property="og:title"]').attr("content") ||
        $('meta[name="twitter:title"]').attr("content") ||
        $('meta[name="title"]').attr("content") ||
        $("title").first().text() ||
        $("h1").first().text() ||
        null;
    const title = rawTitle ? rawTitle.trim() : null;
    // Extract thumbnail / image with fallbacks
    const rawThumbnail = $('meta[property="og:image"]').attr("content") ||
        $('meta[property="og:image:url"]').attr("content") ||
        $('meta[property="og:image:secure_url"]').attr("content") ||
        $('meta[name="twitter:image"]').attr("content") ||
        $('meta[name="twitter:image:src"]').attr("content") ||
        $('link[rel="image_src"]').attr("href") ||
        $('meta[itemprop="image"]').attr("content") ||
        null;
    let thumbnailUrl = null;
    if (rawThumbnail) {
        const trimmed = rawThumbnail.trim();
        try {
            thumbnailUrl = new URL(trimmed, rawUrl).href;
        }
        catch {
            thumbnailUrl = trimmed;
        }
    }
    return {
        thumbnailUrl,
        rawUrl,
        domain,
        title,
    };
};
