import { create } from "zustand"
import { persist, createJSONStorage } from "zustand/middleware"

// Types
export interface Product {
  id: string
  name: string
  category: string
  price: number
  stock: number
  minStock: number
  maxStock: number
  description: string
  supplier: string
  expiryDate: string
  batchNumber: string
}

export interface Order {
  id: string
  clientId: string
  clientName: string
  products: Array<{
    productId: string
    productName: string
    quantity: number
    price: number
  }>
  total: number
  status: "pending" | "confirmed" | "shipped" | "delivered" | "cancelled"
  orderDate: string
  deliveryDate?: string
  notes?: string
}

export interface User {
  id: string
  name: string
  email: string
  role: "admin" | "client" | "fournisseur"
  status: "active" | "inactive" | "suspended"
  lastLogin: string
  permissions: string[]
  pharmacyName?: string
  companyName?: string
  address?: string
  phone?: string
  createdAt: string
}

export interface Return {
  id: string
  orderId: string
  productId: string
  productName: string
  quantity: number
  reason: string
  status: "pending" | "approved" | "rejected" | "processed"
  requestDate: string
  processedDate?: string
  refundAmount?: number
}

export interface Notification {
  id: string
  userId: string
  title: string
  message: string
  type: "info" | "warning" | "error" | "success"
  read: boolean
  createdAt: string
}

export interface Invoice {
  id: string
  orderId: string
  clientId: string
  clientName: string
  amount: number
  tax: number
  total: number
  status: "draft" | "sent" | "paid" | "overdue" | "cancelled"
  issueDate: string
  dueDate: string
  paymentDate?: string
  items: Array<{
    productId: string
    productName: string
    quantity: number
    unitPrice: number
    total: number
  }>
}

export interface Delivery {
  id: string
  orderId: string
  clientId: string
  clientName: string
  address: string
  status: "scheduled" | "in_transit" | "delivered" | "failed"
  scheduledDate: string
  deliveredDate?: string
  driverId?: string
  driverName?: string
  trackingNumber: string
  notes?: string
}

export interface QualityControl {
  id: string
  productId: string
  productName: string
  batchNumber: string
  testType: "incoming" | "outgoing" | "periodic"
  status: "pending" | "passed" | "failed" | "quarantine"
  testDate: string
  results: Record<string, any>
  inspector: string
  notes?: string
}

export interface ComplianceRecord {
  id: string
  type: "license" | "certification" | "audit" | "inspection"
  title: string
  description: string
  status: "active" | "expired" | "pending_renewal"
  issueDate: string
  expiryDate: string
  authority: string
  documentUrl?: string
}

export interface AuditLog {
  id: string
  userId: string
  userName: string
  action: string
  resource: string
  resourceId: string
  timestamp: string
  details: Record<string, any>
  ipAddress: string
}

export interface Document {
  id: string
  name: string
  type: "contract" | "certificate" | "report" | "manual" | "other"
  category: string
  uploadDate: string
  uploadedBy: string
  fileSize: number
  fileType: string
  url: string
  tags: string[]
}

export interface Message {
  id: string
  senderId: string
  senderName: string
  recipientId: string
  recipientName: string
  subject: string
  content: string
  timestamp: string
  read: boolean
  type: "message" | "alert" | "announcement"
}

interface DataStore {
  // Products
  products: Product[]
  addProduct: (product: Omit<Product, "id">) => void
  updateProduct: (id: string, updates: Partial<Product>) => void
  deleteProduct: (id: string) => void

  // Orders
  orders: Order[]
  addOrder: (order: Omit<Order, "id">) => void
  updateOrder: (id: string, updates: Partial<Order>) => void

  // Users
  users: User[]
  addUser: (user: Omit<User, "id" | "createdAt">) => void
  updateUser: (id: string, updates: Partial<User>) => void
  deleteUser: (id: string) => void

  // Returns
  returns: Return[]
  addReturn: (returnItem: Omit<Return, "id">) => void
  updateReturn: (id: string, updates: Partial<Return>) => void

  // Notifications
  notifications: Notification[]
  addNotification: (notification: Omit<Notification, "id">) => void
  markNotificationRead: (id: string) => void
  clearNotifications: (userId: string) => void

  // Cart
  cart: Array<{ productId: string; quantity: number }>
  addToCart: (productId: string, quantity: number) => void
  removeFromCart: (productId: string) => void
  updateCartQuantity: (productId: string, quantity: number) => void
  clearCart: () => void

  // Invoices
  invoices: Invoice[]
  addInvoice: (invoice: Omit<Invoice, "id">) => void
  updateInvoice: (id: string, updates: Partial<Invoice>) => void

  // Deliveries
  deliveries: Delivery[]
  addDelivery: (delivery: Omit<Delivery, "id">) => void
  updateDelivery: (id: string, updates: Partial<Delivery>) => void

  // Quality Control
  qualityControls: QualityControl[]
  addQualityControl: (qc: Omit<QualityControl, "id">) => void
  updateQualityControl: (id: string, updates: Partial<QualityControl>) => void

  // Compliance
  complianceRecords: ComplianceRecord[]
  addComplianceRecord: (record: Omit<ComplianceRecord, "id">) => void
  updateComplianceRecord: (id: string, updates: Partial<ComplianceRecord>) => void

  // Audit Logs
  auditLogs: AuditLog[]
  addAuditLog: (log: Omit<AuditLog, "id">) => void

  // Documents
  documents: Document[]
  addDocument: (doc: Omit<Document, "id">) => void
  deleteDocument: (id: string) => void

  // Messages
  messages: Message[]
  addMessage: (message: Omit<Message, "id">) => void
  markMessageRead: (id: string) => void
}

export const useDataStore = create<DataStore>()(
  persist(
    (set, get) => ({
      // Initial data
      products: [
        {
          id: "1",
          name: "Paracétamol 500mg",
          category: "Antalgiques",
          price: 3.5,
          stock: 150,
          minStock: 50,
          maxStock: 300,
          description: "Antalgique et antipyrétique",
          supplier: "PharmaLab",
          expiryDate: "2025-12-31",
          batchNumber: "PAR2024001",
        },
        {
          id: "2",
          name: "Ibuprofène 400mg",
          category: "Anti-inflammatoires",
          price: 4.2,
          stock: 25,
          minStock: 50,
          maxStock: 200,
          description: "Anti-inflammatoire non stéroïdien",
          supplier: "MediSupply",
          expiryDate: "2025-08-15",
          batchNumber: "IBU2024002",
        },
        {
          id: "3",
          name: "Amoxicilline 1g",
          category: "Antibiotiques",
          price: 8.9,
          stock: 180,
          minStock: 30,
          maxStock: 250,
          description: "Antibiotique à large spectre",
          supplier: "BioPharm",
          expiryDate: "2025-06-30",
          batchNumber: "AMO2024003",
        },
      ],

      orders: [
        {
          id: "ORD-2024-001",
          clientId: "1",
          clientName: "Pharmacie du Centre",
          products: [{ productId: "1", productName: "Paracétamol 500mg", quantity: 50, price: 3.5 }],
          total: 175.0,
          status: "confirmed",
          orderDate: "2024-01-15T10:30:00Z",
          deliveryDate: "2024-01-16T14:00:00Z",
        },
      ],

      users: [
        {
          id: "1",
          name: "Dr. Martin Dubois",
          email: "martin.dubois@pharmacie-centre.fr",
          role: "client",
          status: "active",
          lastLogin: "2024-01-15T14:30:00Z",
          permissions: ["orders", "invoices", "stock"],
          pharmacyName: "Pharmacie du Centre",
          address: "123 Rue de la Paix, 75001 Paris",
          phone: "+33 1 23 45 67 89",
          createdAt: "2023-01-15T10:00:00Z",
        },
      ],

      returns: [],
      notifications: [],
      cart: [],
      invoices: [
        {
          id: "INV-2024-001",
          orderId: "ORD-2024-001",
          clientId: "1",
          clientName: "Pharmacie du Centre",
          amount: 175.0,
          tax: 35.0,
          total: 210.0,
          status: "paid",
          issueDate: "2024-01-15T10:30:00Z",
          dueDate: "2024-02-15T10:30:00Z",
          paymentDate: "2024-01-20T14:00:00Z",
          items: [{ productId: "1", productName: "Paracétamol 500mg", quantity: 50, unitPrice: 3.5, total: 175.0 }],
        },
      ],

      deliveries: [
        {
          id: "DEL-2024-001",
          orderId: "ORD-2024-001",
          clientId: "1",
          clientName: "Pharmacie du Centre",
          address: "123 Rue de la Paix, 75001 Paris",
          status: "delivered",
          scheduledDate: "2024-01-16T09:00:00Z",
          deliveredDate: "2024-01-16T14:30:00Z",
          driverId: "driver1",
          driverName: "Pierre Martin",
          trackingNumber: "TRK123456789",
        },
      ],

      qualityControls: [],
      complianceRecords: [],
      auditLogs: [],
      documents: [],
      messages: [],

      // Actions with error handling
      addProduct: (product) => {
        try {
          set((state) => ({
            products: [...state.products, { ...product, id: Date.now().toString() }],
          }))
        } catch (error) {
          console.error("Error adding product:", error)
        }
      },

      updateProduct: (id, updates) => {
        try {
          set((state) => ({
            products: state.products.map((p) => (p.id === id ? { ...p, ...updates } : p)),
          }))
        } catch (error) {
          console.error("Error updating product:", error)
        }
      },

      deleteProduct: (id) => {
        try {
          set((state) => ({
            products: state.products.filter((p) => p.id !== id),
          }))
        } catch (error) {
          console.error("Error deleting product:", error)
        }
      },

      addOrder: (order) => {
        try {
          set((state) => ({
            orders: [...state.orders, { ...order, id: `ORD-${Date.now()}` }],
          }))
        } catch (error) {
          console.error("Error adding order:", error)
        }
      },

      updateOrder: (id, updates) => {
        try {
          set((state) => ({
            orders: state.orders.map((o) => (o.id === id ? { ...o, ...updates } : o)),
          }))
        } catch (error) {
          console.error("Error updating order:", error)
        }
      },

      addUser: (user) => {
        try {
          set((state) => ({
            users: [
              ...state.users,
              {
                ...user,
                id: Date.now().toString(),
                createdAt: new Date().toISOString(),
              },
            ],
          }))
        } catch (error) {
          console.error("Error adding user:", error)
        }
      },

      updateUser: (id, updates) => {
        try {
          set((state) => ({
            users: state.users.map((u) => (u.id === id ? { ...u, ...updates } : u)),
          }))
        } catch (error) {
          console.error("Error updating user:", error)
        }
      },

      deleteUser: (id) => {
        try {
          set((state) => ({
            users: state.users.filter((u) => u.id !== id),
          }))
        } catch (error) {
          console.error("Error deleting user:", error)
        }
      },

      addReturn: (returnItem) => {
        try {
          set((state) => ({
            returns: [...state.returns, { ...returnItem, id: `RET-${Date.now()}` }],
          }))
        } catch (error) {
          console.error("Error adding return:", error)
        }
      },

      updateReturn: (id, updates) => {
        try {
          set((state) => ({
            returns: state.returns.map((r) => (r.id === id ? { ...r, ...updates } : r)),
          }))
        } catch (error) {
          console.error("Error updating return:", error)
        }
      },

      addNotification: (notification) => {
        try {
          set((state) => ({
            notifications: [
              ...state.notifications,
              {
                ...notification,
                id: Date.now().toString(),
              },
            ],
          }))
        } catch (error) {
          console.error("Error adding notification:", error)
        }
      },

      markNotificationRead: (id) => {
        try {
          set((state) => ({
            notifications: state.notifications.map((n) => (n.id === id ? { ...n, read: true } : n)),
          }))
        } catch (error) {
          console.error("Error marking notification as read:", error)
        }
      },

      clearNotifications: (userId) => {
        try {
          set((state) => ({
            notifications: state.notifications.filter((n) => n.userId !== userId),
          }))
        } catch (error) {
          console.error("Error clearing notifications:", error)
        }
      },

      addToCart: (productId, quantity) => {
        try {
          set((state) => {
            const existingItem = state.cart.find((item) => item.productId === productId)
            if (existingItem) {
              return {
                cart: state.cart.map((item) =>
                  item.productId === productId ? { ...item, quantity: item.quantity + quantity } : item,
                ),
              }
            }
            return { cart: [...state.cart, { productId, quantity }] }
          })
        } catch (error) {
          console.error("Error adding to cart:", error)
        }
      },

      removeFromCart: (productId) => {
        try {
          set((state) => ({
            cart: state.cart.filter((item) => item.productId !== productId),
          }))
        } catch (error) {
          console.error("Error removing from cart:", error)
        }
      },

      updateCartQuantity: (productId, quantity) => {
        try {
          if (quantity <= 0) {
            get().removeFromCart(productId)
          } else {
            set((state) => ({
              cart: state.cart.map((item) => (item.productId === productId ? { ...item, quantity } : item)),
            }))
          }
        } catch (error) {
          console.error("Error updating cart quantity:", error)
        }
      },

      clearCart: () => {
        try {
          set({ cart: [] })
        } catch (error) {
          console.error("Error clearing cart:", error)
        }
      },

      addInvoice: (invoice) => {
        try {
          set((state) => ({
            invoices: [...state.invoices, { ...invoice, id: `INV-${Date.now()}` }],
          }))
        } catch (error) {
          console.error("Error adding invoice:", error)
        }
      },

      updateInvoice: (id, updates) => {
        try {
          set((state) => ({
            invoices: state.invoices.map((i) => (i.id === id ? { ...i, ...updates } : i)),
          }))
        } catch (error) {
          console.error("Error updating invoice:", error)
        }
      },

      addDelivery: (delivery) => {
        try {
          set((state) => ({
            deliveries: [...state.deliveries, { ...delivery, id: `DEL-${Date.now()}` }],
          }))
        } catch (error) {
          console.error("Error adding delivery:", error)
        }
      },

      updateDelivery: (id, updates) => {
        try {
          set((state) => ({
            deliveries: state.deliveries.map((d) => (d.id === id ? { ...d, ...updates } : d)),
          }))
        } catch (error) {
          console.error("Error updating delivery:", error)
        }
      },

      addQualityControl: (qc) => {
        try {
          set((state) => ({
            qualityControls: [...state.qualityControls, { ...qc, id: `QC-${Date.now()}` }],
          }))
        } catch (error) {
          console.error("Error adding quality control:", error)
        }
      },

      updateQualityControl: (id, updates) => {
        try {
          set((state) => ({
            qualityControls: state.qualityControls.map((qc) => (qc.id === id ? { ...qc, ...updates } : qc)),
          }))
        } catch (error) {
          console.error("Error updating quality control:", error)
        }
      },

      addComplianceRecord: (record) => {
        try {
          set((state) => ({
            complianceRecords: [...state.complianceRecords, { ...record, id: `COMP-${Date.now()}` }],
          }))
        } catch (error) {
          console.error("Error adding compliance record:", error)
        }
      },

      updateComplianceRecord: (id, updates) => {
        try {
          set((state) => ({
            complianceRecords: state.complianceRecords.map((c) => (c.id === id ? { ...c, ...updates } : c)),
          }))
        } catch (error) {
          console.error("Error updating compliance record:", error)
        }
      },

      addAuditLog: (log) => {
        try {
          set((state) => ({
            auditLogs: [...state.auditLogs, { ...log, id: `AUDIT-${Date.now()}` }],
          }))
        } catch (error) {
          console.error("Error adding audit log:", error)
        }
      },

      addDocument: (doc) => {
        try {
          set((state) => ({
            documents: [...state.documents, { ...doc, id: `DOC-${Date.now()}` }],
          }))
        } catch (error) {
          console.error("Error adding document:", error)
        }
      },

      deleteDocument: (id) => {
        try {
          set((state) => ({
            documents: state.documents.filter((d) => d.id !== id),
          }))
        } catch (error) {
          console.error("Error deleting document:", error)
        }
      },

      addMessage: (message) => {
        try {
          set((state) => ({
            messages: [...state.messages, { ...message, id: `MSG-${Date.now()}` }],
          }))
        } catch (error) {
          console.error("Error adding message:", error)
        }
      },

      markMessageRead: (id) => {
        try {
          set((state) => ({
            messages: state.messages.map((m) => (m.id === id ? { ...m, read: true } : m)),
          }))
        } catch (error) {
          console.error("Error marking message as read:", error)
        }
      },
    }),
    {
      name: "pharma-data-store",
      storage: createJSONStorage(() => localStorage),
    },
  ),
)
