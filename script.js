document.body.style.backgroundColor = "lightgrey"; // 设置背景颜色为浅灰色

Telegram.WebApp.ready(); // 确保 Web App API 已准备就绪

const buttonContainer = document.getElementById('buttonContainer');

// 创建一个单独的按钮，用户点击时随机跳转
const offerButton = document.createElement('button');
offerButton.textContent = "Offer"; // 设置按钮文本
offerButton.className = 'offer-button';

// 设置按钮的样式，调整大小
offerButton.style.fontSize = "20px"; // 设置字体大小
offerButton.style.padding = "15px 30px"; // 设置按钮内边距，使按钮更大
offerButton.style.borderRadius = "8px"; // 设置圆角，使按钮看起来更圆润
offerButton.style.backgroundColor = "#4CAF50"; // 设置按钮背景色（绿色）
offerButton.style.color = "white"; // 设置文字颜色为白色
offerButton.style.border = "none"; // 去除按钮边框
offerButton.style.cursor = "pointer"; // 设置鼠标指针为点击样式

// 按钮配置数据
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

// 按钮点击事件处理：随机选择一个链接
offerButton.onclick = function() {
    // 获取随机数，范围从 0 到 buttonsData.length - 1
    const randomIndex = Math.floor(Math.random() * buttonsData.length);
    const randomUrl = buttonsData[randomIndex].url;
    
    // 使用 Telegram WebApp API 打开随机链接
    Telegram.WebApp.openLink(randomUrl);
};

// 将按钮添加到容器中
buttonContainer.appendChild(offerButton);
