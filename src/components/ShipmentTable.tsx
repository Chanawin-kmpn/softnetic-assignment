/**
 * ShipmentTable Component
 * Headless table component for displaying shipment data
 * Built with @tanstack/react-table
 */

import type { Shipment } from '@/lib/mock-data'

interface ShipmentTableProps {
  data: Array<Shipment>
}

export function ShipmentTable({ data }: ShipmentTableProps) {
  return (
    <div className="border rounded p-12 text-center text-muted-foreground bg-muted/10">
      Table Component Placeholder
      <p className="mt-2 text-sm">Will display {data.length} shipments</p>
    </div>
  )
}
