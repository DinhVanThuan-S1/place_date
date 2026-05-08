import { NextRequest, NextResponse } from "next/server";
import { SubmitData, RankedPlace } from "@/types";

function formatTelegramMessage(topPlaces: RankedPlace[], submittedAt: string, isRandom: boolean = false): string {
  const date = new Date(submittedAt);
  const formattedDate = date.toLocaleString("vi-VN", {
    timeZone: "Asia/Ho_Chi_Minh",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });

  const rankEmoji: Record<number, string> = {
    1: "👑",
    2: "💖",
    3: "✨",
    4: "💕",
    5: "💗",
    6: "🌸",
    7: "🌷",
    8: "🎀",
    9: "💐",
    10: "🌺",
  };

  let message = isRandom
    ? `🎲 *KẾT QUẢ CHỌN NGẪU NHIÊN* 🎲\n`
    : `💕 *KẾT QUẢ CHỌN ĐỊA ĐIỂM HẸN HÒ* 💕\n`;
  message += `📅 ${formattedDate}\n`;
  if (isRandom) {
    message += `🎯 _Chế độ: Số phận quyết định!_\n`;
  }
  message += `━━━━━━━━━━━━━━━━━━━━\n\n`;

  topPlaces.forEach((place) => {
    const emoji = rankEmoji[place.rank] || "💫";
    message += `${emoji} *Top ${place.rank}:* ${place.emoji} ${place.name}\n`;
    message += `    ❤️ Điểm: ${place.score}/10\n`;
    message += `    📝 ${place.description}\n\n`;
  });

  message += `━━━━━━━━━━━━━━━━━━━━\n`;
  message += `🥰 Bé đã chọn xong rồi, plan date thôi!`;

  return message;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const isRandom = body.isRandom === true;

    // Validate data
    if (!body.topPlaces || !Array.isArray(body.topPlaces) || body.topPlaces.length === 0) {
      return NextResponse.json(
        { success: false, error: "Dữ liệu không hợp lệ" },
        { status: 400 }
      );
    }

    // Validate each place
    for (const place of body.topPlaces) {
      if (!place.id || !place.name || typeof place.score !== "number" || place.score < 0 || place.score > 10) {
        return NextResponse.json(
          { success: false, error: "Dữ liệu địa điểm không hợp lệ" },
          { status: 400 }
        );
      }
    }

    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;

    if (!botToken || !chatId) {
      console.warn("Telegram credentials not configured. Logging results instead.");
      console.log("===== DATING PLACE RESULTS =====");
      console.log(JSON.stringify(body.topPlaces, null, 2));
      console.log("================================");

      return NextResponse.json({
        success: true,
        message: "Kết quả đã được ghi nhận! (Telegram chưa được cấu hình)",
      });
    }

    // Format message for Telegram
    const message = formatTelegramMessage(body.topPlaces, body.submittedAt, isRandom);

    // Send to Telegram
    const telegramUrl = `https://api.telegram.org/bot${botToken}/sendMessage`;
    const telegramResponse = await fetch(telegramUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text: message,
        parse_mode: "Markdown",
      }),
    });

    const telegramData = await telegramResponse.json();

    if (!telegramResponse.ok) {
      console.error("Telegram API error:", telegramData);
      return NextResponse.json(
        {
          success: false,
          error: "Không gửi được tin nhắn Telegram",
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Đã gửi kết quả thành công! 💕",
    });
  } catch (error) {
    console.error("Submit error:", error);
    return NextResponse.json(
      { success: false, error: "Có lỗi xảy ra, thử lại sau nhé!" },
      { status: 500 }
    );
  }
}
