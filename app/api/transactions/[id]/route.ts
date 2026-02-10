import { NextResponse } from "next/server";
import {
  deleteTransactionById,
  TRANSACTION_ERROR_NOT_CONFIGURED,
} from "@/lib/services/transaction.service";

export const dynamic = "force-dynamic";

/** DELETE /api/transactions/[id] - Xóa giao dịch */
export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  if (!id) {
    return NextResponse.json(
      { error: "Thiếu id" },
      { status: 400 }
    );
  }

  try {
    const { createServerSupabaseClient } = await import('@/lib/supabase');
    const supabaseServer = await createServerSupabaseClient();

    const { data: { user }, error: authError } = await supabaseServer.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { error } = await supabaseServer
      .from("expense_transaction")
      .delete()
      .eq("id", id)
      .eq("user_id", user.id);

    if (error) throw new Error(error.message);
    return new NextResponse(null, { status: 204 });
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
