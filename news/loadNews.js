/**
 * 新闻模块的修改，把原本的固定模块修改为了js动态加载的方式
 */
document.addEventListener("DOMContentLoaded", function () {
  const newsList = [
    {
      img: "./img/news_1.png",
      title: "宣传部党支部进行专题理论学习",
      link: "./inner.html",
      date: "2025年07月09日 18:06",
    },
    {
      img: "./img/news_2.png",
      title: "宣传部党支部召开“习近平文化思想”专题理论学习会 ",
      link: "./inner.html",
      date: "2025年06月05日 15:37",
    },
    {
      img: "./img/news_3.png",
      title:
        "凝心聚力强文化 提质进位创辉煌 ——党委宣传部、总务处、教育发展基金会办公室、哲学与公共管理学院、经济学院 联合举办主题党日活动",
      link: "./inner.html",
      date: "2025年05月30日 09:51",
    },
    {
      img: "./img/news_4.png",
      title: "河南省报业协会秘书长李宜鹏一行到我校调研座谈",
      link: "./inner.html",
      date: "2025年03月20日 10:04",
    },
    {
      img: "./img/news_5.png",
      title: "党委宣传部召开组织生活会",
      link: "./inner.html",
      date: "2025年02月26日 17:20",
    },
    {
      img: "./img/news_6.png",
      title: "党委宣传部召开巡察整改专题民主生活会",
      link: "./inner.html",
      date: "2024年10月29日 15:01",
    },
    // 可继续添加更多新闻
  ];

  const newsListEl = document.getElementById("newsList");
  const covers = document.getElementById("carouselWrapper");
  const coverBtn = document.getElementById("carouselButtons");

  let autoPlayTimer = null;
  let loadedCount = 0;
  const batchSize = 5; // 每次加载5条
  let currentCoverIndex = 0;

  // 创建 sentinel 元素
  const sentinel = document.createElement("div");
  sentinel.className = "sentinel";
  newsListEl.appendChild(sentinel);

  // 懒加载新闻
  function addNewsItem() {
    const nextBatch = newsList.slice(loadedCount, loadedCount + batchSize);
    nextBatch.forEach((element, idx) => {
      // 新闻项
      const item = document.createElement("div");
      const realIndex = loadedCount + idx; // 真实索引
      item.className = "newsItem";
      item.innerHTML = `
        <div class="newsContent" >
          <h3 class="singleRow">${element.title || ""}</h3>
          <p class="singleRow">${element.date || ""}</p>
        </div>
        <div class="singleRow">${element.abstract || ""}</div>
      `;
      // 添加点击事件处理，支持移动端触摸
      item.onclick = () => {
        window.open(element.link, "_blank");
      };

      // 添加触摸事件支持移动端
      item.addEventListener("touchstart", function (e) {
        // 防止触摸时的默认行为
        e.preventDefault();
        showNewsItem(realIndex);
        currentCoverIndex = realIndex;
      });

      // 鼠标悬停事件（桌面端）
      item.onmouseenter = () => {
        showNewsItem(realIndex); // 直接高亮和切换
        currentCoverIndex = realIndex;
      };
      newsListEl.insertBefore(item, sentinel);
    });
    loadedCount += nextBatch.length;
    // 按钮栏同步添加
    renderCoverButtons();
    // 如果全部加载完，移除观察
    if (loadedCount >= newsList.length) {
      observer.unobserve(sentinel);
      sentinel.remove();
    }
  }

  // IntersectionObserver 回调
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          addNewsItem();
        }
      });
    },
    {
      root: newsListEl,
      rootMargin: "0px",
      threshold: 1.0,
    }
  );
  // 初始化时只创建一次容器
  function initCoverBox() {
    covers.innerHTML = "";
    const imgBox = document.createElement("div");
    imgBox.className = "coverImageBox";

    const img = document.createElement("img");
    img.className = "coverImage";
    imgBox.appendChild(img);

    const titleDiv = document.createElement("div");
    titleDiv.className = "coverTitle";
    imgBox.appendChild(titleDiv);

    covers.appendChild(imgBox);
  }
  initCoverBox();

  // 渲染轮播封面
  function showNewsItem(idx) {
    // 高亮新闻
    const newsItems = newsListEl.querySelectorAll(".newsItem");
    newsItems.forEach((item, i) => {
      item.classList.toggle("active", i === idx);
    });

    // 获取唯一的图片和标题元素
    const imgBox = covers.querySelector(".coverImageBox");
    const img = imgBox.querySelector(".coverImage");
    const titleDiv = imgBox.querySelector(".coverTitle");

    // 动画：淡出
    img.classList.add("fade-out");
    titleDiv.classList.add("fade-out");

    //点击进入新闻
    img.onclick = () => {
      window.open(newsList[idx].link, "_blank");
    };

    img.addEventListener(
      "animationend",
      () => {
        // 切换图片和标题
        img.src = newsList[idx].img;
        img.alt = "封面图片";
        titleDiv.textContent = newsList[idx].title;

        // 动画：淡入
        img.classList.remove("fade-out");
        img.classList.add("fade-in");
        titleDiv.classList.remove("fade-out");
        titleDiv.classList.add("fade-in");

        // 移除淡入动画类
        img.addEventListener(
          "animationend",
          () => {
            img.classList.remove("fade-in");
            titleDiv.classList.remove("fade-in");
          },
          { once: true }
        );
      },
      { once: true }
    );

    // 按钮高亮
    const btns = coverBtn.querySelectorAll("button");
    btns.forEach((btn, i) => {
      btn.classList.toggle("active", i === idx);
    });
  }

  // 渲染轮播按钮
  function renderCoverButtons() {
    coverBtn.innerHTML = "";
    for (let i = 0; i < loadedCount; i++) {
      const btn = document.createElement("button");
      btn.className = "coverBtn";
      if (i === currentCoverIndex) btn.classList.add("active");
      btn.onclick = () => {
        currentCoverIndex = i;
        showNewsItem(currentCoverIndex);
      };
      coverBtn.appendChild(btn);
    }
  }

  // 自动轮播函数
  function startAutoPlay() {
    stopAutoPlay(); // 避免多次启动
    autoPlayTimer = setInterval(() => {
      if (loadedCount === 0) return;
      currentCoverIndex = (currentCoverIndex + 1) % loadedCount;
      showNewsItem(currentCoverIndex);
    }, 4000); // 每4秒切换一次
  }

  // 停止自动轮播
  function stopAutoPlay() {
    if (autoPlayTimer) {
      clearInterval(autoPlayTimer);
      autoPlayTimer = null;
    }
  }

  // 鼠标悬停封面或新闻栏时暂停，移出时恢复
  covers.addEventListener("mouseenter", stopAutoPlay);
  covers.addEventListener("mouseleave", startAutoPlay);
  newsListEl.addEventListener("mouseenter", stopAutoPlay);
  newsListEl.addEventListener("mouseleave", startAutoPlay);

  // 初始加载
  addNewsItem();
  showNewsItem(currentCoverIndex);
  observer.observe(sentinel);
  startAutoPlay();
});
