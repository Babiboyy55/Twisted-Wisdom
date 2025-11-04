# Reverse-Proverbs

*Bởi vì động lực thì quá phổ biến rồi*

Một ứng dụng tạo câu trích dẫn phản động lực hiện đại, hài hước đen tối được xây dựng bằng Next.js, React, TailwindCSS, shadcn/ui và Framer Motion.

## Tính năng

- 🎨 **Giao diện tối giản**: Thiết kế sắc sảo với nền gradient và hiệu ứng thủy tinh
- 🌊 **Hoạt hình mượt mà**: Được hỗ trợ bởi Framer Motion cho hiệu ứng hình ảnh thu hút
- 📱 **Tương thích di động**: Trải nghiệm liền mạch trên mọi kích thước màn hình
- 🎯 **Trích dẫn theo chủ đề**: Nhập bất kỳ chủ đề nào hoặc nhận sự thất vọng chung về cuộc sống
- ⚡ **API nhanh**: Tích hợp Gemini API với thời gian phản hồi thực tế
- 🚀 **Sẵn sàng chia sẻ**: Hoàn hảo để chia sẻ liều thực tế hàng ngày của bạn

## Công nghệ sử dụng

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: TailwindCSS với hoạt hình tùy chỉnh
- **UI Components**: shadcn/ui với Radix UI primitives
- **Hoạt hình**: Framer Motion
- **Biểu tượng**: Lucide React
- **API**: Next.js API Routes (sẵn sàng tích hợp Gemini)

## Bắt đầu

### Yêu cầu

- Node.js 18+ 
- npm, yarn, pnpm, hoặc bun
- Google Gemini API key (lấy từ [Google AI Studio](https://makersuite.google.com/app/apikey))

### Cài đặt

1. Clone repository
```bash
git clone <your-repo-url>
cd reverse-proverbs
```

2. Cài đặt dependencies
```bash
npm install
```

3. Thiết lập biến môi trường
```bash
# Sao chép file môi trường mẫu
cp .env.example .env.local

# Chỉnh sửa .env.local và thêm Gemini API key của bạn
GEMINI_API_KEY=your_actual_api_key_here
```

4. Chạy server phát triển
```bash
npm run dev
```

5. Mở [http://localhost:3000](http://localhost:3000) trong trình duyệt của bạn

## Cách sử dụng

1. **Nhập chủ đề** (tùy chọn): Gõ bất kỳ chủ đề nào bạn muốn phản động lực, hoặc để trống để nhận trí tuệ chung về cuộc sống
2. **Tạo trích dẫn**: Click nút Generate hoặc nhấn Enter
3. **Chia sẻ nỗi khổ**: Sao chép và chia sẻ liều thực tế cá nhân hóa của bạn

## Tích hợp API

Dự án hiện bao gồm **tích hợp Google Gemini AI** để tạo các trích dẫn phản động lực chính thống!

### Tính năng:
- ✅ **Trích dẫn được tạo bởi AI thực** sử dụng mô hình Gemini 2.0 Flash của Google
- ✅ **Phản hồi nhanh nhất** - Mô hình Gemini mới nhất được tối ưu hóa về tốc độ
- ✅ **Hệ thống dự phòng** - Sử dụng trích dẫn có sẵn nếu API lỗi
- ✅ **Prompting thông minh** - Được tối ưu hóa cho nội dung hài hước đen tối, sẵn sàng viral
- ✅ **Giới hạn tốc độ** - Xử lý lỗi API một cách khéo léo
- ✅ **Dưới 20 từ** - Hoàn hảo để chia sẻ trên mạng xã hội

### Thiết lập:
1. Lấy API key miễn phí từ [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sao chép `.env.example` thành `.env.local`
3. Thêm API key của bạn: `GEMINI_API_KEY=your_key_here`
4. Khởi động lại server phát triển

### Cách hoạt động:
API gửi một prompt được thiết kế cẩn thận tới Gemini Pro yêu cầu các trích dẫn phản động lực ngắn gọn, châm biếm nhằm chế giễu nội dung truyền cảm hứng thông thường. Mỗi trích dẫn được tạo mới và được thiết kế sẵn sàng viral cho mạng xã hội.

## Cấu trúc dự án

```
src/
├── app/
│   ├── api/gemini/          # API endpoint để tạo trích dẫn
│   ├── globals.css          # Styles toàn cục và cấu hình Tailwind
│   ├── layout.tsx           # Layout gốc với metadata
│   └── page.tsx             # Component ứng dụng chính
├── components/ui/           # shadcn/ui components
│   ├── button.tsx
│   ├── card.tsx
│   └── input.tsx
└── lib/
    └── utils.ts             # Utility functions
```

## Scripts phát triển

- `npm run dev` - Khởi động server phát triển
- `npm run build` - Build cho production
- `npm run start` - Khởi động server production
- `npm run lint` - Chạy ESLint

## Tùy chỉnh

### Thêm trích dẫn mới
Chỉnh sửa mảng `mockQuotes` trong `src/app/api/gemini/route.ts`

### Styling
- Màu sắc: Cập nhật `tailwind.config.ts`
- Hoạt hình: Chỉnh sửa keyframes trong cấu hình Tailwind
- Components: Tùy chỉnh shadcn/ui components trong `src/components/ui/`

### Tính năng
- Trạng thái loading và xử lý lỗi được tích hợp sẵn
- Thiết kế responsive thích ứng với mọi kích thước màn hình
- Chủ đề tối được tối ưu hóa cho thẩm mỹ hiện đại

## Đóng góp

1. Fork repository
2. Tạo feature branch
3. Thực hiện các thay đổi của bạn
4. Test kỹ lưỡng
5. Gửi pull request

## Giấy phép

Dự án này là mã nguồn mở và có sẵn theo [Giấy phép MIT](LICENSE).

## Tuyên bố miễn trừ trách nhiệm

Ứng dụng này chỉ nhằm mục đích giải trí. Các trích dẫn phản động lực có ý nghĩa hài hước và không nên được coi là lời khuyên nghiêm túc về cuộc sống. Nếu bạn thực sự cảm thấy thiếu động lực, hãy tìm kiếm sự hỗ trợ từ bạn bè, gia đình hoặc các chuyên gia sức khỏe tâm thần.

---

*"Tiềm năng của bạn là vô hạn, điều đó có nghĩa là nó cũng vô nghĩa."* - Reverse-Proverbs
