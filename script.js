document.body.style.backgroundColor = "lightgrey"; // 设置背景颜色为浅灰色

Telegram.WebApp.ready(); // 确保 Web App API 已准备就绪

// 按钮配置数据 (您可以根据需要修改)
const buttonsData = [
    { text: "Offer 1", url: "https://nanoushaks.net/4/8985364" },
    { text: "Offer 2", url: "https://nanoushaks.net/4/8985363" },
    { text: "Offer 3", url: "https://nanoushaks.net/4/8985362" },
    { text: "Offer 4", url: "https://nanoushaks.net/4/8985314" },
    { text: "Offer 5", url: "https://nanoushaks.net/4/8985312" },
    { text: "Offer 6", url: "https://nanoushaks.net/4/8985313" },
    { text: "Offer 7", url: "https://nanoushaks.net/4/8985310" },
    { text: "Offer 8", url: "https://nanoushaks.net/4/8985307" },
    { text: "Offer 9", url: "https://nanoushaks.net/4/8985375" },
    { text: "Offer 10", url: "https://nanoushaks.net/4/8985309" },
];

// 获取容器
const buttonContainer = document.getElementById('buttonContainer');

// 创建多个按钮
for (let i = 0; i < 6; i++) {  // 创建6个按钮
    const offerButton = document.createElement('button');
    offerButton.textContent = `Offer ${i + 1}`; // 设置按钮文本，动态生成
    offerButton.className = 'offer-button'; // 添加一个类名以便样式使用

    // 设置按钮样式
    offerButton.style.fontSize = "20px";
    offerButton.style.padding = "15px 30px";
    offerButton.style.borderRadius = "8px";
    offerButton.style.color = "black";
    offerButton.style.border = "2px solid #000";
    offerButton.style.cursor = "pointer";
    offerButton.style.margin = "10px"; // 给按钮加点间距，防止它们太挤

    // 按钮点击事件：随机选择链接
    offerButton.addEventListener('click', function() {
        // 随机选择一个链接
        const randomUrl = getRandomLink(buttonsData);
        
        // 使用 Telegram WebApp API 打开链接
        Telegram.WebApp.openLink(randomUrl);
    });

    // 将按钮添加到容器中
    buttonContainer.appendChild(offerButton);
}

// 获取随机链接的函数
function getRandomLink(links) {
    const randomIndex = Math.floor(Math.random() * links.length);
    return links[randomIndex].url;
}
