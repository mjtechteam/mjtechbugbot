const TelegramBot = require("node-telegram-bot-api");

// Get your token from the environment variable.
// NEVER put your real bot token directly into GitHub.
const token = process.env.BOT_TOKEN;

if (!token) {
  console.error("ERROR: BOT_TOKEN environment variable is missing.");
  process.exit(1);
}

const bot = new TelegramBot(token, {
  polling: true
});

console.log("Telegram bot is running...");

bot.onText(/\/start/, async (msg) => {
  const chatId = msg.chat.id;
  const name = msg.from?.first_name || "User";

  await bot.sendMessage(
    chatId,
    `👋 Welcome ${name}!\n\n` +
    `🤖 MJ Tech Connection Bot\n\n` +
    `Choose an option below:`,
    {
      reply_markup: {
        inline_keyboard: [
          [
            {
              text: "📱 Pair WhatsApp",
              callback_data: "pair_whatsapp"
            }
          ],
          [
            {
              text: "📊 Status",
              callback_data: "status"
            },
            {
              text: "❓ Help",
              callback_data: "help"
            }
          ]
        ]
      }
    }
  );
});

bot.on("callback_query", async (query) => {
  const chatId = query.message.chat.id;
  const action = query.data;

  await bot.answerCallbackQuery(query.id);

  if (action === "pair_whatsapp") {
    await bot.sendMessage(
      chatId,
      "📱 WhatsApp pairing setup\n\n" +
      "The pairing service is not connected yet.\n\n" +
      "⚙️ Backend setup is required before a WhatsApp account can be connected."
    );
  }

  if (action === "status") {
    await bot.sendMessage(
      chatId,
      "📊 Status\n\n" +
      "Telegram Bot: ✅ Online\n" +
      "WhatsApp: ⚪ Not connected"
    );
  }

  if (action === "help") {
    await bot.sendMessage(
      chatId,
      "❓ Help\n\n" +
      "/start - Open the main menu\n" +
      "/status - Check connection status\n" +
      "/help - Show help"
    );
  }
});

bot.onText(/\/status/, async (msg) => {
  await bot.sendMessage(
    msg.chat.id,
    "📊 Bot Status\n\n" +
    "Telegram: ✅ Online\n" +
    "WhatsApp: ⚪ Not connected"
  );
});

bot.onText(/\/help/, async (msg) => {
  await bot.sendMessage(
    msg.chat.id,
    "❓ Commands\n\n" +
    "/start - Main menu\n" +
    "/status - Connection status\n" +
    "/help - Help"
  );
});

bot.on("polling_error", (error) => {
  console.error("Polling error:", error.message);
});

process.on("SIGINT", () => {
  console.log("Stopping bot...");
  bot.stopPolling();
  process.exit(0);
});

process.on("SIGTERM", () => {
  console.log("Stopping bot...");
  bot.stopPolling();
  process.exit(0);
});
