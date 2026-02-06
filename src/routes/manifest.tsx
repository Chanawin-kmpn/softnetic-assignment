/**
 * Manifest Route
 * This route will display the shipment manifest table
 */

import { getShipments } from '@/lib/mock-data'
import { createFileRoute } from '@tanstack/react-router'
import { z } from 'zod'

const searchSchema = z.object({
  page: z.coerce.number().int().positive().catch(1), // ทำการสร้าง validate สำหรับ page เมื่อเป็น NAN ให้กลับมาเป็น page=1
  pageSize: z.coerce.number().int().min(5).max(100).catch(20), // เช่นเดียวกัน validate สำหรับ page size ให้มีค่าเริ่มต้นที่ 20
  status: z
    .enum(['pending', 'in-transit', 'delivered', 'cancelled'])
    .optional()
    .catch(undefined),
  from: z.string().optional().catch(undefined),
  to: z.string().optional().catch(undefined),
  sort: z
    .enum(['date.asc', 'date.desc', 'amount.asc', 'amount.desc'])
    .catch('date.desc'),
})

export const Route = createFileRoute('/manifest')({
  validateSearch: (search) => searchSchema.parse(search),
  loaderDeps: ({ search }) => search, // ใช้ loaderDeps สำหรับอ่าน Search params
  loader: ({ deps }) => getShipments(deps), // นำค่า deps ที่เป็น Input สำหรับ function ที่เรียก shipment
  component: ManifestComponent,
})

function ManifestComponent() {
  const data = Route.useLoaderData() // ใช้ useLoaderData เพื่อดึงข้อมูลจาก Route ที่ใกล้ที่สุด ซึ่งก็คือ Route นี้แหละ

  console.log(data) // ทดสอบ response ของข้อมูล ได้ประมาณนี้ {rows: Array(20), total: 50, page: 1, pageSize: 20, totalPages: 3}

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Shipment Manifest</h1>
      <div className="border rounded p-12 text-center text-muted-foreground bg-muted/10">
        Manifest Route Placeholder
      </div>
    </div>
  )
}
