# 💕 Hôm Nay Đi Đâu Nè?

Website dễ thương để chọn địa điểm hẹn hò cùng người yêu. Bé sẽ chấm điểm từ 1-10 cho từng địa điểm, và anh sẽ nhận được kết quả qua Telegram!

## ✨ Tính năng

- 🌸 **Giao diện siêu cute** - Tone hồng pastel, glassmorphism, animations mượt mà
- 📱 **Responsive hoàn hảo** - Tối ưu cho điện thoại
- 💖 **35+ địa điểm** - Cafe, ẩm thực, giải trí, outdoor, và nhiều hơn nữa
- 🎯 **Chấm điểm 1-10** - Slider + heart rating
- 🏆 **Top 10 ranking** - Hiển thị kết quả đẹp mắt
- 🎊 **Confetti** - Hiệu ứng pháo hoa khi xem kết quả
- 💕 **Floating hearts** - Trái tim bay bay nền
- 📲 **Gửi Telegram** - Nhận kết quả qua Telegram Bot
- 🌙 **Dark mode** - Hỗ trợ chế độ tối pastel
- 🔍 **Tìm kiếm & lọc** - Tìm theo tên hoặc danh mục

## 🛠️ Công nghệ

- **Next.js 14** - App Router
- **TypeScript** - Type safety
- **TailwindCSS v4** - Styling
- **Framer Motion** - Animations
- **Shadcn/UI** - UI components
- **Lucide React** - Icons
- **Canvas Confetti** - Hiệu ứng pháo hoa

## 📦 Cấu trúc project

```
src/
├── app/
│   ├── api/
│   │   └── submit/
│   │       └── route.ts          # API gửi kết quả về Telegram
│   ├── globals.css               # Theme & custom animations
│   ├── layout.tsx                # Root layout + SEO
│   └── page.tsx                  # Main page (3-step flow)
├── components/
│   ├── ui/
│   │   ├── button.tsx            # Shadcn button
│   │   └── slider.tsx            # Shadcn slider
│   ├── FloatingHearts.tsx        # Nền trái tim bay
│   ├── LandingPage.tsx           # Trang chào mừng
│   ├── LoadingScreen.tsx         # Loading dễ thương
│   ├── PlaceCard.tsx             # Card chấm điểm
│   ├── RatingPage.tsx            # Trang chấm điểm
│   └── ResultsPage.tsx           # Trang kết quả
├── data/
│   └── places.ts                 # Dữ liệu 35 địa điểm
├── lib/
│   └── utils.ts                  # Utility functions
└── types/
    └── index.ts                  # TypeScript types
```

## 🚀 Chạy local

### 1. Clone & Install

```bash
git clone <your-repo-url>
cd place_date
npm install
```

### 2. Cấu hình Telegram (Tuỳ chọn)

Tạo file `.env.local` từ template:

```bash
cp .env.example .env.local
```

Điền thông tin:

```env
TELEGRAM_BOT_TOKEN=your_bot_token_here
TELEGRAM_CHAT_ID=your_chat_id_here
```

> **Lưu ý:** Website vẫn hoạt động bình thường nếu chưa cấu hình Telegram. Kết quả sẽ được log ra console thay vì gửi Telegram.

### 3. Chạy dev server

```bash
npm run dev
```

Mở http://localhost:3000

## 📲 Hướng dẫn lấy Telegram Bot Token & Chat ID

### Bước 1: Tạo Telegram Bot

1. Mở Telegram, tìm **@BotFather**
2. Gõ `/newbot`
3. Đặt tên bot (VD: "Date Place Bot")
4. Đặt username cho bot (VD: `date_place_result_bot`)
5. BotFather sẽ trả về **Bot Token** dạng: `1234567890:ABCdefGhIJKlmNoPQRsTUVwxYZ`
6. Copy token này vào `TELEGRAM_BOT_TOKEN`

### Bước 2: Lấy Chat ID

1. Mở Telegram, tìm bot bạn vừa tạo
2. Gõ `/start` cho bot
3. Truy cập URL sau trên trình duyệt (thay `YOUR_BOT_TOKEN`):
   ```
   https://api.telegram.org/botYOUR_BOT_TOKEN/getUpdates
   ```
4. Tìm `"chat":{"id": 123456789}` trong JSON response
5. Copy số `123456789` vào `TELEGRAM_CHAT_ID`

> **Mẹo:** Nếu response trống, hãy gửi thêm 1 tin nhắn bất kỳ cho bot rồi refresh lại URL.

## 🌐 Deploy lên Vercel

### Cách 1: Deploy từ GitHub (Khuyến nghị)

1. **Push code lên GitHub:**
   ```bash
   git add .
   git commit -m "🎀 Initial commit - Date place picker"
   git remote add origin https://github.com/your-username/place-date.git
   git push -u origin main
   ```

2. **Kết nối Vercel:**
   - Vào [vercel.com](https://vercel.com) → Login
   - Click **"Add New Project"**
   - Chọn repository `place-date` từ GitHub
   - Click **"Import"**

3. **Cấu hình Environment Variables:**
   - Trong trang deploy, tìm phần **"Environment Variables"**
   - Thêm 2 biến:
     | Name | Value |
     |------|-------|
     | `TELEGRAM_BOT_TOKEN` | Token bot của bạn |
     | `TELEGRAM_CHAT_ID` | Chat ID của bạn |

4. **Deploy:**
   - Click **"Deploy"**
   - Chờ ~1-2 phút
   - Done! 🎉 Website sẽ có URL dạng: `https://place-date.vercel.app`

### Cách 2: Deploy bằng Vercel CLI

```bash
# Cài Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
vercel

# Thêm env variables
vercel env add TELEGRAM_BOT_TOKEN
vercel env add TELEGRAM_CHAT_ID

# Deploy production
vercel --prod
```

## 🎨 Customization

### Thêm/sửa địa điểm

Mở file `src/data/places.ts` và thêm/sửa object:

```typescript
{
  id: "ten-dia-diem",
  name: "Tên hiển thị",
  emoji: "🌟",
  category: "Danh mục",
  description: "Mô tả ngắn gọn, dễ thương",
}
```

### Sửa nội dung text

- Landing page: `src/components/LandingPage.tsx`
- Kết quả: `src/components/ResultsPage.tsx`

### Sửa màu sắc

Mở `src/app/globals.css`, tìm phần `:root` để thay đổi color scheme.

## 💌 Gửi cho người yêu

Sau khi deploy xong, gửi link cho người yêu với lời nhắn kiểu:

> "Bé ơi, bấm vào link này chọn cho anh biết bé thích đi đâu nha 💕"
>
> https://your-app.vercel.app

---

Made with 💕 for couples
