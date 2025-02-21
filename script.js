document.body.style.backgroundColor = "lightgrey"; // 设置背景颜色为浅灰色

Telegram.WebApp.ready(); // 确保 Web App API 已准备就绪

const buttonContainer = document.getElementById('buttonContainer');

// 按钮配置数据 (您可以根据需要修改)
const buttonsData = [
    { text: "Offer 1", url: "https://nanoushaks.net/4/8985364" }, // 替换为您的 Monetag 链接
    { text: "Offer 2", url: "https://nanoushaks.net/4/8985363" }, // 替换为您的 Monetag 链接
    { text: "Offer 3", url: "https://nanoushaks.net/4/8985362" }, // 替换为您的 Monetag 链接
    { text: "Offer 4", url: "https://nanoushaks.net/4/8985314" }, // 替换为您的 Monetag 链接
    { text: "Offer 5", url: "https://nanoushaks.net/4/8985312" }, // 替换为您的 Monetag 链接
    { text: "Offer 6", url: "https://nanoushaks.net/4/8985313" }, // 替换为您的 Monetag 链接
    { text: "Offer 7", url: "https://nanoushaks.net/4/8985310" }, // 替换为您的 Monetag 链接
    { text: "Offer 8", url: "https://nanoushaks.net/4/8985307" }, // 替换为您的 Monetag 链接
    { text: "Offer 9", url: "https://nanoushaks.net/4/8985375" }, // 替换为您的 Monetag 链接
    { text: "Offer 10", url: "https://nanoushaks.net/4/8985309" }, // 替换为您的 Monetag 链接
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
