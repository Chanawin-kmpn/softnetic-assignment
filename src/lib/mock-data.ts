/**
 * Mock data utilities for development
 * This file will contain mock shipment data generation utilities
 */

export type ShipmentStatus =
  | 'pending'
  | 'in-transit'
  | 'delivered'
  | 'cancelled'

export interface Shipment {
  id: string
  status: ShipmentStatus
  customer: string
  date: string
  amount: number
}

export function generateMockShipments(count: number = 50): Array<Shipment> {
  return Array.from({ length: count }, (_, i) => ({
    id: `SHP-${String(i + 1).padStart(5, '0')}`,
    status: ['pending', 'in-transit', 'delivered', 'cancelled'][
      Math.floor(Math.random() * 4)
    ] as any,
    customer: `Customer ${i + 1}`,
    date: new Date(
      Date.now() - Math.floor(Math.random() * 10000000000),
    ).toISOString(),
    amount: Math.floor(Math.random() * 5000) + 100,
  }))
}

const DB: Shipment[] = generateMockShipments(50) // สร้าง Database จำลองขึ้นมา

export type GetShipmentsInput = {
  page: number
  pageSize: number
  status?: ShipmentStatus
  from?: string // วันเริ่มต้น (ISO)
  to?: string // วันสิ้นสุด (ISO)
  sort?: 'date.asc' | 'date.desc' | 'amount.asc' | 'amount.desc'
}

export type GetShipmentsResult = {
  rows: Shipment[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}

// สร้าง function เรียก Shipments สำหรับ Input ที่เป็นค่าต่างๆจาก url เช่น page pageSize sort ฯ
// และ return ค่า rows total page pageSize และ total pages เพื่อไปแสดงผล
export async function getShipments(
  input: GetShipmentsInput,
): Promise<GetShipmentsResult> {
  let data = DB

  if (input.status)
    data = data.filter((shipment) => shipment.status === input.status)

  if (input.from) {
    const fromMs = Date.parse(input.from) // แปลงเป็น Millisecond
    if (!Number.isNaN(fromMs))
      // ป้องกันวันที่ไม่ใช่ตัวเลข
      data = data.filter((shipment) => Date.parse(shipment.date) >= fromMs)
  }

  if (input.to) {
    const toMs = Date.parse(input.to)
    if (!Number.isNaN(toMs))
      data = data.filter((shipment) => Date.parse(shipment.date) <= toMs)
  }

  const sort = input.sort ?? 'date.desc'
  data = [...data].sort((a, b) => {
    if (sort === 'date.asc') return Date.parse(a.date) - Date.parse(b.date)
    if (sort === 'date.desc') return Date.parse(b.date) - Date.parse(a.date)
    if (sort === 'amount.asc') return a.amount - b.amount
    return b.amount - a.amount
  })

  const total = data.length
  const pageSize = input.pageSize
  const totalPages = Math.max(1, Math.ceil(total / pageSize))
  const page = Math.min(Math.max(1, input.page), totalPages)

  const start = (page - 1) * pageSize
  const rows = data.slice(start, start + pageSize)

  return { rows, total, page, pageSize, totalPages }
}
