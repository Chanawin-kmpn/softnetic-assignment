/**
 * Manifest Route
 * This route will display the shipment manifest table
 */

import { getShipments } from '@/lib/mock-data'
import { createFileRoute, redirect } from '@tanstack/react-router'
import { z } from 'zod'
import { ShipmentStatus } from '@/types/types'
import { ShipmentTable } from '@/components/ShipmentTable'
import { useState } from 'react'
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { toISO } from '@/lib/helper/helper'

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
  loader: async ({ deps }) => {
    const result = await getShipments(deps)

    if (result.page !== deps.page) {
      throw redirect({
        to: '/manifest',
        search: {
          ...deps,
          page: result.page,
        },
        replace: true,
      })
    }

    return result
  }, // นำค่า deps ที่เป็น Input สำหรับ function ที่เรียก shipment
  component: ManifestComponent,
})

function ManifestComponent() {
  const search = Route.useSearch() // เก็บค่าที่ได้จาก query parameter
  const data = Route.useLoaderData() // ใช้ useLoaderData เพื่อดึงข้อมูลจาก Route ที่ใกล้ที่สุด ซึ่งก็คือ Route นี้แหละ
  const navigate = Route.useNavigate() // ใช้เปลี่ยน pathname url

  const [open, setOpen] = useState(false)

  const [draft, setDraft] = useState({
    status: search.status,
    from: search.from,
    to: search.to,
  })

  function openSheet() {
    setDraft({ status: search.status, from: search.from, to: search.to })
    setOpen(true)
  }

  function applyFilters() {
    navigate({
      search: (prev) => ({
        ...prev,
        status: draft.status,
        from: draft.from,
        to: draft.to,
        page: 1,
      }),
    })
    setOpen(false)
  }

  function clearDraft() {
    setDraft({ status: undefined, from: undefined, to: undefined })
  }

  // console.log(data) // ทดสอบ response ของข้อมูล ได้ประมาณนี้ {rows: Array(20), total: 50, page: 1, pageSize: 20, totalPages: 3}

  return (
    <div className="container mx-auto py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Shipment Manifest</h1>

        <Sheet open={open} onOpenChange={setOpen}>
          {/* ใช้ปุ่มนี้เป็นตัวเปิด เพื่อให้เรา set draft ก่อน */}
          <SheetTrigger>
            <Button variant="outline" onClick={openSheet}>
              Filter
            </Button>
          </SheetTrigger>

          <SheetContent side="right" className="w-[360px] sm:w-[420px] p-8">
            <SheetHeader>
              <SheetTitle>Filters</SheetTitle>
            </SheetHeader>

            <div className="py-6 space-y-6">
              {/* Status */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Status</label>
                <select
                  className="w-full border rounded px-2 py-2"
                  value={draft.status ?? ''}
                  onChange={(e) =>
                    setDraft((d) => ({
                      ...d,
                      status: (e.target.value || undefined) as any,
                    }))
                  }
                >
                  <option value="">All</option>
                  <option value="pending">pending</option>
                  <option value="in-transit">in-transit</option>
                  <option value="delivered">delivered</option>
                  <option value="cancelled">cancelled</option>
                </select>
              </div>

              {/* Date range */}
              <div className="space-y-2">
                <label className="text-sm font-medium">From</label>
                <input
                  type="date"
                  className="w-full border rounded px-2 py-2"
                  value={draft.from ? draft.from.slice(0, 10) : ''}
                  onChange={(e) =>
                    setDraft((d) => ({
                      ...d,
                      from: e.target.value ? toISO(e.target.value) : undefined,
                    }))
                  }
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">To</label>
                <input
                  type="date"
                  className="w-full border rounded px-2 py-2"
                  value={draft.to ? draft.to.slice(0, 10) : ''}
                  onChange={(e) =>
                    setDraft((d) => ({
                      ...d,
                      to: e.target.value ? toISO(e.target.value) : undefined,
                    }))
                  }
                />
              </div>

              <Button variant="ghost" className="w-full" onClick={clearDraft}>
                Clear
              </Button>
            </div>

            <SheetFooter className="gap-2">
              <Button
                variant="outline"
                onClick={() => {
                  setOpen(false)
                }}
              >
                Cancel
              </Button>
              <Button onClick={applyFilters}>Apply Filters</Button>
            </SheetFooter>
          </SheetContent>
        </Sheet>
      </div>

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

        <label className="text-sm ml-4">Page size:</label>
        <select
          className="border rounded px-2 py-1"
          value={search.pageSize}
          onChange={(e) => {
            const nextSize = Number(e.target.value)
            navigate({
              search: (prev) => ({ ...prev, pageSize: nextSize, page: 1 }),
            })
          }}
        >
          {[10, 20, 50, 100].map((n) => (
            <option key={n} value={n}>
              {n}
            </option>
          ))}
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
