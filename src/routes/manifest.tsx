/**
 * Manifest Route
 * This route will display the shipment manifest table
 */

import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/manifest')({
  component: ManifestComponent,
})

function ManifestComponent() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Shipment Manifest</h1>
      <div className="border rounded p-12 text-center text-muted-foreground bg-muted/10">
        Manifest Route Placeholder
      </div>
    </div>
  )
}
