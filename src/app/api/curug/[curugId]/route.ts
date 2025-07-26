import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// Fungsi untuk mengambil SATU data curug berdasarkan ID
export async function GET(
  request: Request,
  { params }: { params: { curugId: string } }
) {
  const { curugId } = await params;
  const curug = await prisma.curug.findUnique({
    where: { id: curugId },
  });
  return NextResponse.json(curug);
}

// Fungsi untuk MENGUPDATE data curug berdasarkan ID
export async function PATCH(
  request: Request,
  { params }: { params: { curugId: string } }
) {
  const { curugId } = await params;
  const body = await request.json();
  const { name, description, location, imageUrl } = body;

  const updatedCurug = await prisma.curug.update({
    where: { id: curugId },
    data: { name, description, location, imageUrl },
  });
  return NextResponse.json(updatedCurug);
}

// Fungsi untuk MENGHAPUS data curug berdasarkan ID
export async function DELETE(
  request: Request,
  { params }: { params: { curugId: string } }
) {
  const { curugId } = await params;
  await prisma.curug.delete({
    where: { id: curugId },
  });
  return new NextResponse(null, { status: 204 });
}
