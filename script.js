const navButtons = document.querySelectorAll('.nav-btn');
const mainContent = document.getElementById('main-content');

const categoryFiles = {
    about: [],
    udemy: ["udemy"],
    hahow: ["hahow"],
    youtube: ["youtube"],
    personal: ["personal"]
};

document.addEventListener('DOMContentLoaded', function() {
    showWorks('about');
});

navButtons.forEach(button => {
    button.addEventListener('click', function() {
        const category = this.getAttribute('data-category');
        navButtons.forEach(btn => btn.classList.remove('active'));
        this.classList.add('active');
        showWorks(category);
    });
});

async function showWorks(category) {
    if (category === 'about') {
        mainContent.innerHTML = `
            <div class="works-section">
                <h2 class="section-title">個人簡介</h2>
                <p style="line-height:1.8; color:#444; text-align:center;">
                    嗨！我是 yuyeh，一位熱愛前端與全端開發的工程師。<br>
                    喜歡探索新技術，從 Udemy、Hahow、hexSchool 到實際專案中持續學習與成長。<br>
                    希望透過這個作品集展現我的學習歷程與實作能力！
                </p>
            </div>
        `;
        return;
    }

    let worksToShow = [];
    const categoriesToLoad = categoryFiles[category] || [];
    for (let cat of categoriesToLoad) {
        const response = await fetch(`data/works-${cat}.json`);
        const data = await response.json();
        worksToShow.push(...data);
    }

    const html = createWorksHTML(worksToShow, category);
    mainContent.innerHTML = html;
    bindLoadMore(worksToShow);
}

function createWorksHTML(works, category) {
    if (works.length === 0) {
        return `<div class="works-section"><h2 class="section-title">尚未有作品</h2><p style="text-align:center;color:#666;">這個分類還沒有作品</p></div>`;
    }

    const categoryNames = {
        udemy: "Udemy 課程作品",
        hahow: "Hahow 課程作品",
        youtube: "YouTube 教學作品",
        personal: "個人專案作品"
    };

    const initialWorks = works.slice(0, 6);
    const remainingWorks = works.slice(6);

    const worksCards = initialWorks.map(work => createWorkCard(work)).join('');

    return `
        <div class="works-section">
            <h2 class="section-title">${categoryNames[category]}</h2>
            <div class="works-grid" id="works-grid">
                ${worksCards}
            </div>
            ${remainingWorks.length > 0 ? `<button id="load-more-btn" class="load-more-btn">查看更多</button>` : ""}
        </div>
    `;
}

function createWorkCard(work) {
    return `
        <div class="work-card">
            <h3 class="work-title">${work.title}</h3>
            <p class="work-description">${work.description}</p>
            <div class="work-tech">
                ${work.tech.map(tech => `<span class="tech-tag">${tech}</span>`).join('')}
            </div>
            <a href="${work.link}" target="_blank" class="work-link">查看作品 →</a>
        </div>
    `;
}

function bindLoadMore(works) {
    const loadMoreBtn = document.getElementById("load-more-btn");
    const worksGrid = document.getElementById("works-grid");
    if (!loadMoreBtn) return;

    let currentIndex = 6;
    loadMoreBtn.addEventListener("click", () => {
        const nextWorks = works.slice(currentIndex, currentIndex + 6);
        worksGrid.insertAdjacentHTML("beforeend", nextWorks.map(work => createWorkCard(work)).join(''));
        currentIndex += 6;
        if (currentIndex >= works.length) {
            loadMoreBtn.style.display = "none";
        }
    });
}
