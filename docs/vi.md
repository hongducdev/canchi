# 🌙 Lịch Âm — Hướng dẫn tiếng Việt

Ứng dụng **lịch âm dương Việt Nam** chạy hoàn toàn offline trên iOS, Android và Web.

Không cần tài khoản · Không cần mạng · Dữ liệu chỉ lưu trên máy.

[🇬🇧 English README](../README.md) · [⬇️ Tải bản phát hành](https://github.com/hongducdev/canchi/releases)

---

## ✨ Tính năng chính

### 📅 Lịch

- 🔄 Đổi ngày dương ↔ âm (múi giờ Việt Nam, khoảng 1800–2199)
- 🎋 Can Chi năm / tháng / ngày / giờ
- 🐲 Con giáp theo Địa Chi ngày
- 🌿 24 tiết khí
- ⏰ Giờ Hoàng Đạo / Hắc Đạo
- 📜 Trực, 28 Tú, sao, hướng, việc nên / tránh
- 🎉 Lễ hội truyền thống & ngày lễ quốc gia
- 🗓️ Lưới tháng hai lịch
- 🧨 Đếm ngược Tết

### 🧰 Công cụ (Cài đặt → Công cụ)

| | Công cụ | Mô tả |
| --- | --- | --- |
| 🔍 | Tìm kiếm | Ngày, lễ hội, tiết khí |
| 🍀 | Ngày tốt | Cưới hỏi, khai trương, xuất hành… |
| 📌 | Sự kiện cá nhân | Sinh nhật, kỷ niệm, nhắc nhở |
| 🧮 | Tính ngày lễ | Đầy tháng, 49 ngày, giỗ… |
| 👪 | Gia đình | Năm sinh / con giáp trên máy |
| 🧭 | Phong thủy | Hồ sơ theo năm sinh |
| 🌌 | Thiên văn | Trăng, nhật thực, mưa sao băng |
| 🙏 | Văn khấn | Mẫu khấn + điền từ hồ sơ |
| 👤 | Hồ sơ của tôi | Họ tên, năm sinh, quê quán |

### 📱 Trải nghiệm app

- 📝 Ghi chú ngày (lưu local)
- 💾 Sao lưu / khôi phục JSON
- 🌓 Sáng / tối / theo hệ thống
- 📳 Rung cảm ứng (bật/tắt)
- 🔌 Hoạt động offline 100%

---

## 🧩 Widget màn hình chính (Android)

Cần **bản cài APK / development build** — không dùng được trong Expo Go.

| Widget | Kích thước | Nội dung |
| --- | --- | --- |
| DayLore | Trung bình | Lời hay / lễ + ngày âm |
| MonthSmall | Nhỏ | Lưới tháng |
| DateMinimal | Nhỏ | Ngày lớn + âm lịch |
| Combo | Trung bình | Ngày hôm nay + lưới tháng |
| DayDetail | Lớn | Đủ dương/âm, can chi, hoàng đạo |

---

## 🙏 Văn khấn

Mở **Cài đặt → Văn khấn**.

- Danh mục mẫu theo dịp (Tết, rằm, giỗ, nhập trạch…)
- Gợi ý “Phù hợp hôm nay” theo lịch
- Điền tự động từ **Hồ sơ của tôi** (`{{hoTen}}`, địa chỉ, ngày âm…)
- Chi tiết: lễ vật, chuẩn bị, các bước, lưu ý, bài liên quan

Nguồn dữ liệu: [`src/data/vankhan.json`](../src/data/vankhan.json).

---

## 🚀 Cài đặt & chạy (dev)

```bash
npm install
npx expo start
```

Nhấn `a` (Android), `i` (iOS), hoặc quét QR bằng **Expo Go SDK 56**.

### Web

```bash
npm run web
npm run build:web   # xuất tĩnh → thư mục dist/
```

### APK Android

```bash
npx expo prebuild --platform android
cd android
.\gradlew.bat assembleRelease
```

File APK: `android/app/build/outputs/apk/release/app-release.apk`

Bản phát hành đầu tiên: **v1.0.0** trên [GitHub Releases](https://github.com/hongducdev/canchi/releases).

---

## 📁 Cấu trúc thư mục

```
app/                 Màn hình (Expo Router)
src/lib/             Động cơ lịch âm, can chi, công cụ
src/data/            Lễ hội, quotes, văn khấn
src/components/      UI
src/store/           Zustand + AsyncStorage
src/widgets/         Widget Android
docs/vi.md           Tài liệu này
docs/superpowers/    Spec & plan thiết kế
```

---

## 🔒 Quyền riêng tư

Mọi tính toán và lưu trữ diễn ra trên thiết bị.  
Không analytics · Không đăng nhập · Không đồng bộ đám mây.

---

## ❓ Lưu ý

- Văn khấn là **mẫu tham khảo** — chỉnh theo gia đình và vùng miền.
- Widget chỉ có trên bản native Android.
- Web không hỗ trợ sửa hồ sơ / gia đình / thông báo — dùng app mobile.
