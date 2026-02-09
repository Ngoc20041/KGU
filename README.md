# Expense Manager (Quản Lý Chi Tiêu)

Ứng dụng quản lý tài chính cá nhân và các module demo (báo cáo, COVID-19, mạng lưới đại học, database schema, matrix).

## Công nghệ

- **Framework:** [Next.js 16](https://nextjs.org/) (App Router)
- **UI:** React 19, TypeScript, [Tailwind CSS 4](https://tailwindcss.com/)
- **Icons:** [Lucide React](https://lucide-react.dev/)
- **Biểu đồ:** [Recharts](https://recharts.org/)
- **Đồ thị / Graph:** [React Flow](https://reactflow.dev/), [Cytoscape](https://js.cytoscape.org/), [Dagre](https://github.com/dagrejs/dagre)
- **Backend / DB:** [Supabase](https://supabase.com/)
- **Editor:** [Monaco Editor](https://microsoft.github.io/monaco-editor/) (React)
- **CSV:** [PapaParse](https://www.papaparse.com/)

## Yêu cầu

- Node.js 20+
- npm / yarn / pnpm / bun

## Cài đặt & Chạy

```bash
# Clone (nếu chưa có)
git clone <repo-url>
cd expense-manager

# Cài dependency
npm install

# Chạy development
npm run dev
```

Mở [http://localhost:3000](http://localhost:3000) trên trình duyệt.

### Scripts

| Lệnh           | Mô tả                |
|----------------|----------------------|
| `npm run dev`  | Chạy dev server      |
| `npm run build`| Build production     |
| `npm run start`| Chạy bản production  |
| `npm run lint` | Chạy ESLint          |

## Cấu trúc dự án

```
expense-manager/
├── app/
│   ├── (dashboard)/          # Layout có sidebar
│   │   ├── page.tsx          # Tổng quan – Quản lý thu chi
│   │   ├── report/           # Báo cáo thống kê
│   │   ├── covid-tracker/    # Theo dõi COVID-19
│   │   ├── university-network/ # Mạng lưới đại học
│   │   ├── database-schema/  # Xem schema database
│   │   ├── login/            # Đăng nhập
│   │   └── register/         # Đăng ký
│   └── (matrix)/             # Layout riêng (Câu hỏi 1)
│       └── matrix/           # Xe giao hàng / Matrix
├── components/
│   ├── Sidebar.tsx           # Menu điều hướng
│   ├── SettingsModal.tsx     # Modal cài đặt
│   ├── covid/                # Component COVID
│   ├── matrix/               # Component Matrix
│   ├── schema/               # ERD, Schema viewer
│   └── university-graph/     # Đồ thị đại học
├── lib/
│   ├── settings.ts           # Cài đặt app (localStorage)
│   ├── supabase.ts           # Client Supabase
│   ├── schema-meta.ts        # Meta schema
│   └── data/                 # Dữ liệu (covid, universities)
└── interface/                # Type/interface dùng chung
```

## Tính năng chính

### Dashboard (Câu hỏi 2 & 3)

- **Tổng quan:** Thêm/xóa giao dịch thu chi, xem số dư, phân loại chi tiêu, lịch sử giao dịch.
- **Báo cáo:** Lọc theo tháng, biểu đồ cột (thu/chi theo ngày), biểu đồ tròn (cơ cấu chi tiêu).
- **Theo dõi COVID-19:** Dashboard với biểu đồ dữ liệu COVID (demo).
- **Mạng lưới Đại Học:** Đồ thị mối quan hệ giữa các trường (demo).
- **Database Schema:** Xem sơ đồ ERD / schema (demo).

### Câu hỏi 1 – Matrix

- Trang **Matrix** (xe giao hàng) với layout riêng, không dùng sidebar dashboard.

### Cài đặt

- Bấm **Cài đặt** ở thanh bên → mở **modal** cài đặt.
- Tùy chọn: **Tiền tệ** (VNĐ/USD), **Giao diện** (sáng/tối/hệ thống), **Ngôn ngữ**, **Thông báo**, **Tuần bắt đầu** (Chủ nhật/Thứ hai).
- Lưu trong `localStorage`, dùng lại khi mở lại app.

## API (Câu hỏi 2 – Thu chi)

Frontend gọi API nội bộ, API kết nối Supabase.

| Method | Endpoint | Mô tả |
|--------|----------|--------|
| `GET` | `/api/transactions` | Lấy danh sách giao dịch (sắp xếp theo ngày giảm dần) |
| `POST` | `/api/transactions` | Thêm giao dịch. Body: `{ amount, category, note?, date, type }` với `type` = `"income"` \| `"expense"` |
| `DELETE` | `/api/transactions/[id]` | Xóa giao dịch theo `id` |

- Trả về `503` khi chưa cấu hình Supabase.
- `POST` trả về object giao dịch vừa tạo; `DELETE` trả về 204 No Content.

## Biến môi trường & Database (Câu hỏi 2 – Thu chi)

Để **lưu giao dịch thu chi** vào database:

1. Tạo file `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

2. Trong Supabase: **SQL Editor** → New query → chạy nội dung file `supabase/migrations/001_expense_transaction.sql` để tạo bảng `expense_transaction`.

Sau khi cấu hình, trang **Tổng quan** và **Báo cáo** sẽ dùng dữ liệu từ Supabase. Nếu chưa cấu hình, app vẫn chạy với dữ liệu mẫu trong bộ nhớ.

## License

Private / MIT (tùy quy định dự án).
