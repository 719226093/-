﻿using OpenQA.Selenium;
using OpenQA.Selenium.Chrome;
using OpenQA.Selenium.Support.UI;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Threading;
using System.Threading.Tasks;

public class Program
{
    // 存储所有任务历史记录，按 URL 分组，任务以唯一标识符（如 PID + Country + CreateTime）为键
    static Dictionary<string, Dictionary<string, TaskHistory>> allTaskHistories = new Dictionary<string, Dictionary<string, TaskHistory>>();

    // 要监控的网址列表
    static List<string> urlsToMonitor = new List<string>
    {
        "https://team.jiangyuansample.cn/platform/25?name=hills&custom=1",
        "https://team.jiangyuansample.cn/platform/27?name=QI&custom=1",
        "https://team.jiangyuansample.cn/platform/24?name=AMR+small+survey&custom=1",
        "https://team.jiangyuansample.cn/platform/23?name=gp&custom=1",
        "https://team.jiangyuansample.cn/platform/20?name=GWS&custom=1",
        "https://team.jiangyuansample.cn/platform/19?name=MI&custom=1",
        "https://team.jiangyuansample.cn/platform/18?name=NR+&custom=1",
        "https://team.jiangyuansample.cn/platform/14?name=PVP&custom=1",
    };

    // 监控配置项
    static bool monitorClick = true; // 是否监控 Click 的变化
    static bool monitorComplete = true; // 是否监控 Complete 的变化

    public static void Main(string[] args)
    {
        string driverPath = @"C:\Program Files\Google\Chrome\Application\chromedriver.exe";
        ChromeOptions options = new ChromeOptions();
        options.AddArgument("--no-sandbox");
        options.AddArgument("--disable-gpu");
        options.AddArgument("--disable-dev-shm-usage");
        options.AddArgument("--ignore-certificate-errors"); // 忽略证书错误
        options.AddArgument("--disable-web-security"); // 禁用网络安全策略（如果需要）
        options.AddArgument("--allow-insecure-localhost"); // 允许不安全的本地连接

        using (IWebDriver driver = new ChromeDriver(driverPath, options))
        {
            while (true)
            {
                foreach (var url in urlsToMonitor)
                {
                    int retryCount = 0;
                    const int maxRetries = 3;

                    while (retryCount < maxRetries)
                    {
                        try
                        {
                            Console.WriteLine($"开始监控网址：{url}");
                            driver.Navigate().GoToUrl(url);

                            // 等待页面加载完成
                            WebDriverWait wait = new WebDriverWait(driver, TimeSpan.FromSeconds(30));
                            wait.Until(drv => drv.FindElements(By.CssSelector("tr.el-table__row")).Count > 0);

                            // 提取任务数据
                            var tasks = ExtractTasks(driver);

                            // 检查任务变化并发送通知
                            CheckForChanges(url, tasks);

                            break; // 成功后退出重试循环
                        }
                        catch (WebDriverTimeoutException ex)
                        {
                            retryCount++;
                            Console.WriteLine($"重试 {retryCount}/{maxRetries}，错误：{ex.Message}");

                            if (retryCount == maxRetries)
                            {
                                Console.WriteLine($"跳过当前网址：{url}，原因：超时多次失败。");
                                break;
                            }
                        }
                        catch (Exception ex)
                        {
                            Console.WriteLine($"其他错误：{ex.Message}");
                            break; // 避免程序卡住，跳过当前网址
                        }
                    }

                    // 等待 30 秒后继续下一个网址
                    Thread.Sleep(30000);
                }
            }
        }
    }

    // 定义任务数据结构
    public class TaskHistory
    {
        public string PID { get; set; }
        public string Country { get; set; }
        public string CreateTime { get; set; }
        public int Click { get; set; }
        public int Complete { get; set; }
        public double RewardColns { get; set; } // Reward colns 价格

        public string UniqueIdentifier => $"{PID}_{Country}_{CreateTime}";
    }

    // 提取任务数据
    static List<TaskHistory> ExtractTasks(IWebDriver driver)
    {
        var tasks = new List<TaskHistory>();
        var rows = driver.FindElements(By.CssSelector("tr.el-table__row"));

        if (rows.Count == 0)
        {
            Console.WriteLine("无法找到任何任务行，检查页面结构是否已更改。");
            return tasks;
        }

        foreach (var row in rows)
        {
            try
            {
                var pid = row.FindElement(By.CssSelector("td:nth-child(1) div.cell")).Text.Trim();
                var country = row.FindElement(By.CssSelector("td:nth-child(3) div.cell")).Text.Trim();
                var createTime = row.FindElement(By.CssSelector("td:nth-child(8) div.cell")).Text.Trim();
                var clickComplete = row.FindElement(By.CssSelector("td:nth-child(4) div.cell")).Text.Trim().Split('丨');
                var click = int.Parse(clickComplete[0]);
                var complete = int.Parse(clickComplete[1]);

                // 使用 XPath 提取 Reward colns 的值
                var rewardColnsElement = row.FindElement(By.XPath(".//td[7]//div[@class='money']"));
                var rewardColnsText = rewardColnsElement.Text.Trim(); // 提取文本值（如 "350.000"）
                var rewardColns = double.Parse(rewardColnsText); // 解析为 double 类型

                tasks.Add(new TaskHistory
                {
                    PID = pid,
                    Country = country,
                    CreateTime = createTime,
                    Click = click,
                    Complete = complete,
                    RewardColns = rewardColns
                });
            }
            catch (NoSuchElementException ex)
            {
                Console.WriteLine($"提取任务行时出现错误：{ex.Message}");
            }
        }

        return tasks;
    }

    // 检查任务变化并发送通知
    static void CheckForChanges(string url, List<TaskHistory> currentTasks)
    {
        if (!allTaskHistories.ContainsKey(url))
        {
            allTaskHistories[url] = currentTasks.ToDictionary(t => t.UniqueIdentifier, t => t);
            return;
        }

        var taskHistories = allTaskHistories[url];
        int totalTasks = currentTasks.Count; // 获取网页中的任务总数

        foreach (var currentTask in currentTasks)
        {
            if (taskHistories.TryGetValue(currentTask.UniqueIdentifier, out var oldTask))
            {
                bool hasClickChanged = monitorClick && oldTask.Click != currentTask.Click;
                bool hasCompleteChanged = monitorComplete && oldTask.Complete != currentTask.Complete;

                if (hasClickChanged || hasCompleteChanged)
                {
                    string notification = $"通知：任务 {currentTask.PID} ({currentTask.Country}) (创建时间: {currentTask.CreateTime}) (总任务数: {totalTasks}) 有变化！\n";
                    if (hasClickChanged)
                    {
                        notification += $"旧值 -> Click: {oldTask.Click}, 新值 -> Click: {currentTask.Click}\n";
                    }
                    if (hasCompleteChanged)
                    {
                        notification += $"旧值 -> Complete: {oldTask.Complete}, 新值 -> Complete: {currentTask.Complete}\n";
                    }
                    notification += $"Reward colns: {currentTask.RewardColns}\n"; // 始终显示 Reward colns 的值

                    Console.WriteLine(notification);

                    Task.Run(() => SendTelegramNotification(notification));

                    oldTask.Click = currentTask.Click;
                    oldTask.Complete = currentTask.Complete;
                }
            }
            else
            {
                taskHistories[currentTask.UniqueIdentifier] = currentTask;
            }
        }
    }

    // 发送 Telegram 通知
    static async Task SendTelegramNotification(string message)
    {
        string telegramBotToken = "7824782880:AAH-MrZJbhos1H9XhuSvY2qjU0xKcHgNXfs"; // 替换为您的 Telegram Bot Token
        string telegramChatId = "1341685845"; // 替换为您的 Chat ID

        using (HttpClient client = new HttpClient())
        {
            string url = $"https://api.telegram.org/bot{telegramBotToken}/sendMessage?chat_id={telegramChatId}&text={Uri.EscapeDataString(message)}";

            try
            {
                var response = await client.GetAsync(url);
                if (!response.IsSuccessStatusCode)
                {
                    Console.WriteLine($"通知发送失败：{response.StatusCode}");
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"通知发送异常：{ex.Message}");
            }
        }
    }
}