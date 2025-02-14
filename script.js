document.body.style.backgroundColor = "lightgrey"; // 设置背景颜色为浅灰色

Telegram.WebApp.ready(); // 确保 Web App API 已准备就绪

const buttonContainer = document.getElementById('buttonContainer');

// 按钮配置数据 (您可以根据需要修改)
const buttonsData = [
    { text: "Offer 1", url: "https://mostourigoatik.com/4/8904850" }, // 替换为您的 Monetag 链接
    { text: "Offer 2", url: "https://mostourigoatik.com/4/8905048" }, // 替换为您的 Monetag 链接
    { text: "Offer 3", url: "https://mostourigoatik.com/afu.php?zoneid=8904863&var=8904863&rid=XXz4jyvWNyEJSqRKY8d18w%3D%3D&rhd=false&ab2r=0&sf=1" }  // 替换为您的 Monetag 链接
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
