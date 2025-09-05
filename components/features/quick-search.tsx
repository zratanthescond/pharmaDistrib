"use client"

import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Search, Package, Users, FileText, TrendingUp } from "lucide-react"
import { useDataStore } from "@/lib/data-store"

interface SearchResult {
  id: string
  title: string
  description: string
  type: "product" | "order" | "user" | "report"
  category?: string
}

export function QuickSearch() {
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<SearchResult[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const { products, orders, users } = useDataStore()

  useEffect(() => {
    if (query.length < 2) {
      setResults([])
      setIsOpen(false)
      return
    }

    const searchResults: SearchResult[] = []

    // Search products
    products
      .filter(
        (p) =>
          p.name.toLowerCase().includes(query.toLowerCase()) ||
          p.category.toLowerCase().includes(query.toLowerCase()) ||
          p.supplier.toLowerCase().includes(query.toLowerCase()),
      )
      .slice(0, 3)
      .forEach((product) => {
        searchResults.push({
          id: product.id,
          title: product.name,
          description: `${product.category} - €${product.price}`,
          type: "product",
          category: product.category,
        })
      })

    // Search orders
    orders
      .filter(
        (o) =>
          o.id.toLowerCase().includes(query.toLowerCase()) || o.clientName.toLowerCase().includes(query.toLowerCase()),
      )
      .slice(0, 3)
      .forEach((order) => {
        searchResults.push({
          id: order.id,
          title: order.id,
          description: `${order.clientName} - €${order.total}`,
          type: "order",
        })
      })

    // Search users
    users
      .filter(
        (u) =>
          u.name.toLowerCase().includes(query.toLowerCase()) ||
          u.email.toLowerCase().includes(query.toLowerCase()) ||
          (u.pharmacyName && u.pharmacyName.toLowerCase().includes(query.toLowerCase())) ||
          (u.companyName && u.companyName.toLowerCase().includes(query.toLowerCase())),
      )
      .slice(0, 3)
      .forEach((user) => {
        searchResults.push({
          id: user.id,
          title: user.name,
          description: user.email,
          type: "user",
        })
      })

    setResults(searchResults)
    setIsOpen(searchResults.length > 0)
  }, [query, products, orders, users])

  const getIcon = (type: string) => {
    switch (type) {
      case "product":
        return Package
      case "order":
        return FileText
      case "user":
        return Users
      default:
        return TrendingUp
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case "product":
        return "bg-blue-100 text-blue-800"
      case "order":
        return "bg-green-100 text-green-800"
      case "user":
        return "bg-purple-100 text-purple-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="relative w-full max-w-md">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        <Input
          type="text"
          placeholder="Rechercher produits, commandes, utilisateurs..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => query.length >= 2 && setIsOpen(true)}
          onBlur={() => setTimeout(() => setIsOpen(false), 200)}
          className="pl-10 pr-4 py-2 w-full bg-gray-50 border-0 focus:bg-white focus:ring-2 focus:ring-blue-500 transition-all duration-200"
        />
      </div>

      {isOpen && results.length > 0 && (
        <Card className="absolute top-12 left-0 right-0 shadow-2xl border-0 z-50 max-h-80 overflow-hidden">
          <CardContent className="p-0">
            <div className="max-h-80 overflow-y-auto">
              {results.map((result) => {
                const Icon = getIcon(result.type)
                return (
                  <div
                    key={`${result.type}-${result.id}`}
                    className="p-4 hover:bg-gray-50 cursor-pointer border-b last:border-b-0"
                    onClick={() => {
                      setQuery("")
                      setIsOpen(false)
                      // Handle navigation based on type
                    }}
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 rounded-lg ${getTypeColor(result.type)}`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium text-sm truncate">{result.title}</h4>
                          <Badge variant="outline" className="text-xs">
                            {result.type}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600 truncate">{result.description}</p>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
