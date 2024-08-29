let currentKeyword = '';
let currentPage = 1;
const articlesPerPage = 5;

async function fetchNews(keyword) {
    const url = `/api/news/search?q=${keyword}&hl=ko&gl=KR&ceid=KR:ko`;
    try {
        const response = await fetch(url, {
            headers: {
                'Cache-Control': 'no-cache',
                'Pragma': 'no-cache'
            }
        });
        if (response.ok) {
            const html = await response.text();
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');
            return doc;
        }
    } catch (error) {
        console.error('Failed to fetch news:', error);
    }
    return null;
}

async function loadNews(keyword) {
    currentKeyword = keyword;
    currentPage = 1;
    const doc = await fetchNews(keyword);
    displayNews(doc);
}

async function loadMoreNews() {
    currentPage += 1;
    const doc = await fetchNews(currentKeyword);
    displayNews(doc, true);
}

function displayNews(doc, append = false) {
    const articles = Array.from(doc.querySelectorAll('article'));
    const newsContainer = document.getElementById('newsContainer');
    if (!append) {
        newsContainer.innerHTML = '';
    }
    const start = (currentPage - 1) * articlesPerPage;
    const end = currentPage * articlesPerPage;
    articles.slice(start, end).forEach(article => {
        const source = article.querySelector('.vr1PYe')?.textContent || 'No Source';
        const titleTag = article.querySelector('a.JtKRv');
        const title = titleTag?.textContent || 'No Title';
        const link = titleTag ? 'https://news.google.com' + titleTag.getAttribute('href').substring(1) : 'No Link';
        const thumbnailTag = article.querySelector('img.Quavad');
        const thumbnail = thumbnailTag ? (thumbnailTag.src.startsWith('/') ? 'https://news.google.com' + thumbnailTag.src : thumbnailTag.src) : 'https://via.placeholder.com/300x150?text=No+Image';
        const dateTag = article.querySelector('time.hvbAAd');
        const date = dateTag ? dateTag.getAttribute('datetime') : 'No Date';

        const newsHtml = `
            <div class="table">
            <tr>
                <th><a href="${link}" target="_blank">${title}</a></th>
             </tr>
            </div>
        `;
        newsContainer.innerHTML += newsHtml;
    });
    const moreButton = document.getElementById('moreButton');
    if (articles.length > end) {
        moreButton.style.display = 'block';
    } else {
        moreButton.style.display = 'none';
    }
}

document.addEventListener('DOMContentLoaded', () => {
    loadNews('해상운임'); // Load initial news category
});
