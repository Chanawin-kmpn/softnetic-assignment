/**
 * Mock data utilities for development
 * This file will contain mock shipment data generation utilities
 */

export interface Shipment {
  id: string
  status: 'pending' | 'in-transit' | 'delivered' | 'cancelled'
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
