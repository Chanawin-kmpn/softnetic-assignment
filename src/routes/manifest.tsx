/**
 * Manifest Route
 * This route will display the shipment manifest table
 */

import { getShipments } from '@/lib/mock-data'
import { createFileRoute } from '@tanstack/react-router'
import { z } from 'zod'
import { ShipmentStatus } from '@/types/types'
import { ShipmentTable } from '@/components/ShipmentTable'

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
  const search = Route.useSearch() // เก็บค่าที่ได้จาก query parameter
  const data = Route.useLoaderData() // ใช้ useLoaderData เพื่อดึงข้อมูลจาก Route ที่ใกล้ที่สุด ซึ่งก็คือ Route นี้แหละ
  const navigate = Route.useNavigate() // ใช้เปลี่ยน pathname url

  // console.log(data) // ทดสอบ response ของข้อมูล ได้ประมาณนี้ {rows: Array(20), total: 50, page: 1, pageSize: 20, totalPages: 3}

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Shipment Manifest</h1>

      <div className="flex items-center gap-2 mb-4">
        <label className="text-sm">Status:</label>
        <select
          className="border rounded px-2 py-1"
          value={search.status ?? ''}
          onChange={(e) => {
            const value = e.target.value || undefined
            navigate({
              search: (prev) => ({
                ...prev,
                status: value as ShipmentStatus,
                page: 1,
              }),
            })
          }}
        >
          <option value="">All</option>
          <option value="pending">pending</option>
          <option value="in-transit">in-transit</option>
          <option value="delivered">delivered</option>
          <option value="cancelled">cancelled</option>
        </select>

        <label className="text-sm ml-4">Sort:</label>
        <select
          className="border rounded px-2 py-1"
          value={search.sort}
          onChange={(e) => {
            navigate({
              search: (prev) => ({
                ...prev,
                sort: e.target.value as any,
                page: 1,
              }),
            })
          }}
        >
          <option value="date.desc">date desc</option>
          <option value="date.asc">date asc</option>
          <option value="amount.desc">amount desc</option>
          <option value="amount.asc">amount asc</option>
        </select>
      </div>

      <div className="border rounded p-4">
        <div className="text-sm text-muted-foreground mb-3">
          Total: {data.total} • Page {data.page}/{data.totalPages}
        </div>

        <ShipmentTable data={data.rows} />

        <div className="flex gap-2 mt-4">
          <button
            className="border rounded px-3 py-1 disabled:opacity-50"
            disabled={data.page <= 1}
            onClick={() =>
              navigate({ search: (prev) => ({ ...prev, page: prev.page - 1 }) })
            }
          >
            Prev
          </button>
          <button
            className="border rounded px-3 py-1 disabled:opacity-50"
            disabled={data.page >= data.totalPages}
            onClick={() =>
              navigate({ search: (prev) => ({ ...prev, page: prev.page + 1 }) })
            }
          >
            Next
          </button>

          {/* ตัวอย่างลิงก์ share ได้ */}
          <button
            className="ml-auto underline text-sm cursor-pointer"
            onClick={() => navigator.clipboard.writeText(window.location.href)}
          >
            Copy link to this view
          </button>
        </div>
      </div>
    </div>
  )
}
