import { Telegram } from "src/telegram/telegram.interface";

export const getTelegramConfig = (): Telegram => ({
  chatId: "",
  token: process.env.TELEGRAM_TOKEN ?? "",
});
