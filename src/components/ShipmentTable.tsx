/**
 * ShipmentTable Component
 * Headless table component for displaying shipment data
 * Built with @tanstack/react-table
 */

import type { Shipment } from '@/lib/mock-data'
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  createColumnHelper,
} from '@tanstack/react-table'

interface ShipmentTableProps {
  data: Array<Shipment>
}

const ch = createColumnHelper<Shipment>()

// กำหนด หัวและข้อมูลจาก Shipment
const columns = [
  ch.accessor('id', { header: 'ID', cell: (info) => info.getValue() }),
  ch.accessor('customer', {
    header: 'Customer',
    cell: (info) => info.getValue(),
  }),
  ch.accessor('status', { header: 'Status', cell: (info) => info.getValue() }),
  ch.accessor('date', {
    header: 'Date',
    cell: (info) => new Date(info.getValue()).toLocaleString(),
  }),
  ch.accessor('amount', {
    header: () => <div className="text-right">Amount</div>,
    cell: (info) => <div className="text-right">{info.getValue()}</div>,
  }),
]

export function ShipmentTable({ data }: ShipmentTableProps) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  })
  return (
    <div className="border rounded">
      <table className="w-full text-sm">
        <thead>
          {table.getHeaderGroups().map((hg) => (
            <tr key={hg.id} className="border-b">
              {hg.headers.map((h) => (
                <th key={h.id} className="text-left px-3 py-2">
                  {h.isPlaceholder
                    ? null
                    : flexRender(h.column.columnDef.header, h.getContext())}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => (
            <tr key={row.id} className="border-b">
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id} className="px-3 py-2">
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
          {data.length === 0 ? (
            <tr>
              <td
                className="px-3 py-8 text-center text-muted-foreground"
                colSpan={columns.length}
              >
                No shipments found
              </td>
            </tr>
          ) : null}
        </tbody>
      </table>
    </div>
  )
}
