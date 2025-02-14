document.body.style.backgroundColor = "lightgrey"; // 设置背景颜色为浅灰色

Telegram.WebApp.ready(); // 确保 Web App API 已准备就绪

const buttonContainer = document.getElementById('buttonContainer');

// 按钮配置数据 (您可以根据需要修改)
const buttonsData = [
    { text: "Offer 1", url: "https://theeghumoaps.com/4/8940769" }, // 替换为您的 Monetag 链接
    { text: "Offer 2", url: "https://theeghumoaps.com/4/8940779" }, // 替换为您的 Monetag 链接
    // ... 更多按钮
];

buttonsData.forEach(buttonData => {
    const buttonLink = document.createElement('a');
    buttonLink.href = buttonData.url;
    buttonLink.textContent = buttonData.text;
    buttonLink.className = 'button-link';
    buttonLink.onclick = function(event) {
        event.preventDefault(); // 阻止默认的链接跳转行为
        Telegram.WebApp.openLink(buttonData.url); // 使用 Telegram WebApp API 打开链接
    };
    buttonContainer.appendChild(buttonLink);
});
