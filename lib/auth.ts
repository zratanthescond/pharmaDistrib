export interface User {
  id: string
  email: string
  name: string
  role: "client" | "fournisseur" | "admin"
  permissions: string[]
  pharmacyName?: string
  companyName?: string
  status: "active" | "inactive" | "pending"
  lastLogin?: string
  createdAt: string
}

export interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
}

// Mock users database
export const mockUsers: User[] = [
  {
    id: "1",
    email: "admin@pharmadistrib.fr",
    name: "Administrateur Système",
    role: "admin",
    permissions: ["all"],
    status: "active",
    createdAt: "2024-01-01",
    lastLogin: "2024-01-15 16:45",
  },
  {
    id: "2",
    email: "martin.dubois@pharmacie-centre.fr",
    name: "Dr. Martin Dubois",
    role: "client",
    permissions: ["catalog:read", "orders:create", "orders:read", "invoices:read", "deliveries:read"],
    pharmacyName: "Pharmacie du Centre",
    status: "active",
    createdAt: "2024-01-01",
    lastLogin: "2024-01-15 14:30",
  },
  {
    id: "3",
    email: "jean.dupont@pharmalab.fr",
    name: "Jean Dupont",
    role: "fournisseur",
    permissions: ["stocks:read", "stocks:write", "orders:read", "returns:read", "analytics:read"],
    companyName: "PharmaLab",
    status: "active",
    createdAt: "2024-01-01",
    lastLogin: "2024-01-15 09:15",
  },
  {
    id: "4",
    email: "sophie.laurent@pharmacie-lilas.fr",
    name: "Sophie Laurent",
    role: "client",
    permissions: ["catalog:read", "orders:create", "orders:read"],
    pharmacyName: "Pharmacie des Lilas",
    status: "pending",
    createdAt: "2024-01-10",
  },
]

// Mock authentication functions
export const authenticateUser = async (email: string, password: string): Promise<User | null> => {
  // Simulate API call delay
  await new Promise((resolve) => setTimeout(resolve, 1000))

  const user = mockUsers.find((u) => u.email === email && u.status === "active")

  // Simple password check (in real app, use proper hashing)
  if (user && password === "password123") {
    return {
      ...user,
      lastLogin: new Date().toISOString(),
    }
  }

  return null
}

export const registerUser = async (userData: Partial<User>, password: string): Promise<User | null> => {
  // Simulate API call delay
  await new Promise((resolve) => setTimeout(resolve, 1000))

  // Check if user already exists
  const existingUser = mockUsers.find((u) => u.email === userData.email)
  if (existingUser) {
    throw new Error("Un utilisateur avec cet email existe déjà")
  }

  const newUser: User = {
    id: Date.now().toString(),
    email: userData.email!,
    name: userData.name!,
    role: userData.role!,
    permissions: getDefaultPermissions(userData.role!),
    pharmacyName: userData.pharmacyName,
    companyName: userData.companyName,
    status: "pending",
    createdAt: new Date().toISOString(),
  }

  mockUsers.push(newUser)
  return newUser
}

export const getDefaultPermissions = (role: string): string[] => {
  switch (role) {
    case "admin":
      return ["all"]
    case "client":
      return ["catalog:read", "orders:create", "orders:read", "invoices:read", "deliveries:read"]
    case "fournisseur":
      return ["stocks:read", "stocks:write", "orders:read", "returns:read", "analytics:read"]
    default:
      return []
  }
}

export const hasPermission = (user: User | null, permission: string): boolean => {
  if (!user) return false
  if (user.permissions.includes("all")) return true
  return user.permissions.includes(permission)
}

export const canAccessModule = (user: User | null, module: string): boolean => {
  if (!user) return false
  if (user.permissions.includes("all")) return true

  switch (module) {
    case "client":
      return user.role === "client" || user.role === "admin"
    case "fournisseur":
      return user.role === "fournisseur" || user.role === "admin"
    case "admin":
      return user.role === "admin"
    default:
      return false
  }
}
