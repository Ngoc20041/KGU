import { NextResponse } from "next/server";
import {
  getTransactions,
  createTransaction,
  TRANSACTION_ERROR_NOT_CONFIGURED,
} from "@/lib/services/transaction.service";

export const dynamic = "force-dynamic";

/** GET /api/transactions - Lấy danh sách giao dịch */
export async function GET() {
  try {
    const list = await getTransactions();
    return NextResponse.json(list);
  } catch (err) {
    const message = err instanceof Error ? err.message : "";
    if (message === TRANSACTION_ERROR_NOT_CONFIGURED) {
      return NextResponse.json(
        { error: message },
        { status: 503 }
      );
    }
    return NextResponse.json(
      { error: message || "Lỗi server" },
      { status: 500 }
    );
  }
}

/** POST /api/transactions - Thêm giao dịch */
export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Body không hợp lệ (JSON)" },
      { status: 400 }
    );
  }

  const { amount, category, note, date, type } = body as Record<string, unknown>;

  if (
    typeof amount !== "number" ||
    amount <= 0 ||
    typeof category !== "string" ||
    !category.trim() ||
    typeof date !== "string" ||
    !date.trim() ||
    typeof type !== "string" ||
    !["income", "expense"].includes(type)
  ) {
    return NextResponse.json(
      {
        error:
          "Thiếu hoặc sai: amount (number > 0), category (string), date (YYYY-MM-DD), type (income | expense). note là string tùy chọn.",
      },
      { status: 400 }
    );
  }

  const payload = {
    amount,
    category: category.trim(),
    note: typeof note === "string" ? note.trim() || null : null,
    date: date.trim(),
    type,
  };

  try {
    const data = await createTransaction(payload);
    return NextResponse.json(data);
  } catch (err) {
    const message = err instanceof Error ? err.message : "";
    if (message === TRANSACTION_ERROR_NOT_CONFIGURED) {
      return NextResponse.json(
        { error: message },
        { status: 503 }
      );
    }
    return NextResponse.json(
      { error: message || "Lỗi server" },
      { status: 500 }
    );
  }
}
