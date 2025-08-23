const navButtons = document.querySelectorAll(".nav-btn");
const mainContent = document.getElementById("main-content");

const categoryFiles = {
  about: [],
  udemy: ["udemy"],
  hahow: ["hahow"],
  hexschool: ["hexschool"],
  personal: ["personal"],
};

document.addEventListener("DOMContentLoaded", function () {
  showWorks("about");
});

navButtons.forEach((button) => {
  button.addEventListener("click", function () {
    const category = this.getAttribute("data-category");
    navButtons.forEach((btn) => btn.classList.remove("active"));
    this.classList.add("active");
    showWorks(category);
  });
});

async function showWorks(category) {
  if (category === "about") {
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
    return `
      <div class="works-section">
        <h2 class="section-title">🚧 待更新</h2>
        <p style="text-align:center;color:#666;font-size:1.1rem;margin:2rem 0;">
          此分類內容正在準備中，敬請期待！
        </p>
        <div style="text-align:center;color:#999;font-size:0.9rem;">
          ✨ 更多精彩作品即將上線 ✨
        </div>
      </div>`;
  }

  const categoryNames = {
    udemy: "Udemy 課程作品",
    hahow: "Hahow 課程作品",
    hexschool: "hexSchool 課程作品",
    personal: "個人專案作品",
  };

  const initialWorks = works.slice(0, 6);
  const remainingWorks = works.slice(6);

  const worksCards = initialWorks.map((work) => createWorkCard(work)).join("");

  return `
        <div class="works-section">
            <h2 class="section-title">${categoryNames[category]}</h2>
            <div class="works-count" style="text-align:center; color:#666; margin-bottom:1rem;">
                顯示 ${Math.min(6, works.length)} / ${works.length} 個作品
            </div>
            <div class="works-grid" id="works-grid">
                ${worksCards}
            </div>
            ${
              remainingWorks.length > 0
                ? `<button id="load-more-btn" class="load-more-btn">
                    查看更多 (還有 ${remainingWorks.length} 個作品)
                </button>`
                : works.length > 6
                ? `<div style="text-align:center; color:#888; margin-top:1rem;">✨ 已載入所有作品 ✨</div>`
                : ""
            }
        </div>
    `;
}

function createWorkCard(work) {
  return `
        <div class="work-card">
            <h3 class="work-title">${work.title}</h3>
            <p class="work-description">${work.description}</p>
            <div class="work-tech">
                ${work.tech
                  .map((tech) => `<span class="tech-tag">${tech}</span>`)
                  .join("")}
            </div>
            <a href="${
              work.link
            }" target="_blank" class="work-link">查看作品 →</a>
        </div>
    `;
}

function bindLoadMore(works) {
  const loadMoreBtn = document.getElementById("load-more-btn");
  const worksGrid = document.getElementById("works-grid");
  const worksCount = document.querySelector(".works-count");
  if (!loadMoreBtn) return;

  let currentIndex = 6;
  loadMoreBtn.addEventListener("click", () => {
    // 添加載入動畫
    loadMoreBtn.innerHTML = "載入中...";
    loadMoreBtn.disabled = true;

    // 模擬載入延遲 (可選)
    setTimeout(() => {
      const nextWorks = works.slice(currentIndex, currentIndex + 6);

      // 為新載入的卡片添加淡入動畫
      const newCards = nextWorks.map((work) => createWorkCard(work)).join("");
      const tempDiv = document.createElement("div");
      tempDiv.innerHTML = newCards;
      tempDiv.style.opacity = "0";
      tempDiv.style.transition = "opacity 0.5s ease";

      worksGrid.appendChild(tempDiv);

      // 觸發淡入動畫
      setTimeout(() => {
        tempDiv.style.opacity = "1";
        setTimeout(() => {
          // 動畫完成後，將卡片移出臨時容器
          while (tempDiv.firstChild) {
            worksGrid.appendChild(tempDiv.firstChild);
          }
          worksGrid.removeChild(tempDiv);
        }, 500);
      }, 10);

      currentIndex += 6;

      // 更新顯示計數
      const displayedCount = Math.min(currentIndex, works.length);
      worksCount.innerHTML = `顯示 ${displayedCount} / ${works.length} 個作品`;

      // 更新按鈕文字或隱藏
      if (currentIndex >= works.length) {
        loadMoreBtn.style.display = "none";
        // 顯示完成提示
        const completeMsg = document.createElement("div");
        completeMsg.style.cssText =
          "text-align:center; color:#888; margin-top:1rem;";
        completeMsg.innerHTML = "✨ 已載入所有作品 ✨";
        loadMoreBtn.parentNode.appendChild(completeMsg);
      } else {
        const remaining = works.length - currentIndex;
        loadMoreBtn.innerHTML = `查看更多 (還有 ${remaining} 個作品)`;
        loadMoreBtn.disabled = false;
      }
    }, 300);
  });
}
