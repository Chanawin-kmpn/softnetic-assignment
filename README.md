# Technical Assessment: Logistics Control Tower

## 1. Scenario & Context

**Global Freight Corp** manages a high-volume logistics network. The Operations Team uses a "Control Tower" dashboard to monitor thousands of active shipments. The current legacy dashboard has two critical failures:

1. **"State Amnesia":** Managers cannot share direct links to specific views (e.g., *"Show me all delayed shipments in Europe"*).
2. **Network Latency:** Warehouse agents on 4G connections experience frustration when updating shipment statuses; the UI freezes while waiting for the server.

**Your Goal:** Rebuild the **Shipment Manifest** using the modern TanStack ecosystem to solve these specific architectural pain points.

## 2. The Assignment

You have been provided a starter repository with the necessary UI shell (shadcn/ui). Your task is to implement the **logic, state management, and data flow** to satisfy the following 3 User Stories.

### Story A: The "Truthful" URL

**As an Ops Manager,** I want every filter, sort, and pagination state to be reflected in the URL.

* **Requirement:** Reloading the page must restore the *exact* UI state.
* **Requirement:** Invalid URLs (e.g., `?page=NaN` or `?status=garbage`) must not crash the app. They should gracefully fallback to default values (e.g., Page 1).
* **Constraint:** You must use **TanStack Router's `validateSearch**` with Zod.

### Story B: The Mobile Filter Drawer

**As a Field Agent on a tablet,** I want to filter shipments by Status and Date Range using a slide-out drawer (Sheet).

* **Requirement:** Filters live inside a shadcn/ui `Sheet`.
* **Requirement:** Changing filters inside the Sheet should be a "Draft" state. The URL (and table data) should only update when the user clicks **"Apply Filters"**.
* **Constraint:** The filter state must still be driven by the URL, not local React state alone.

### Story C: The Context-Aware Status Update

**As a Warehouse Worker,** I need to update shipment statuses. However, different statuses require different data points for compliance.

* **Requirement:** Implement a **Discriminated Union Form** (using Zod) in a Dialog or Sheet.
* **Case 1 "Delivered":** User must provide `signedBy` (Text, min 3 chars).
* **Case 2 "Delayed":** User must select `reason` (Select: 'Weather' | 'Traffic' | 'Customs').
* **Case 3 "In Transit":** No additional fields required.


* **Requirement:** The UI must update **Optimistically**.
* The table row should reflect the new status (and potentially the new metadata) *immediately* (<50ms).


* **Simulation:** Inject a **1-second artificial delay** and a **20% random failure rate** into your Server Function.
* **Resilience:** If the server returns an error, the UI must automatically rollback to the previous state and show a Toast error message.

---

## 3. Technical Decisions & Constraints

### 3.1 Architecture Decision: Filtering Strategy (Open)

You have full autonomy to decide where the filtering and sorting logic resides:

* **Option A (Server-Side):** Pass params to the server function and filter the array in the backend handler.
* **Option B (Client-Side):** Fetch the full dataset once and filter it in the browser using TanStack Table's internal logic.

**Requirement:** You must document your choice in `NOTES.md`.

* We want to know **why** you chose your approach given the "High Volume" business context.
* Discuss the trade-offs you considered (e.g., Initial Load Time vs. Interaction Latency, Complexity vs. Scalability).

### 3.2 Isomorphic Type Safety

We expect end-to-end type safety. If you change the shape of the data in the Server Function, the frontend Table component should throw a TypeScript error.

### 3.3 No `useEffect` for State Sync

Do not use `useEffect` to manually sync URL state with local component state. Rely on TanStack Router's loaders and search param validation.
