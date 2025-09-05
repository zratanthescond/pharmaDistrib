export interface ExportData {
  headers: string[]
  rows: (string | number)[][]
  filename: string
}

export const exportToCSV = (data: ExportData): void => {
  const csvContent = [
    data.headers.join(","),
    ...data.rows.map((row) =>
      row
        .map((cell) => (typeof cell === "string" && cell.includes(",") ? `"${cell.replace(/"/g, '""')}"` : cell))
        .join(","),
    ),
  ].join("\n")

  const blob = new Blob(["\uFEFF" + csvContent], { type: "text/csv;charset=utf-8;" })
  const link = document.createElement("a")

  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob)
    link.setAttribute("href", url)
    link.setAttribute("download", `${data.filename}.csv`)
    link.style.visibility = "hidden"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }
}

export const exportToExcel = (data: ExportData): void => {
  // Create a simple HTML table that Excel can interpret
  const htmlTable = `
    <table>
      <thead>
        <tr>
          ${data.headers.map((header) => `<th>${header}</th>`).join("")}
        </tr>
      </thead>
      <tbody>
        ${data.rows.map((row) => `<tr>${row.map((cell) => `<td>${cell}</td>`).join("")}</tr>`).join("")}
      </tbody>
    </table>
  `

  const blob = new Blob([htmlTable], {
    type: "application/vnd.ms-excel;charset=utf-8;",
  })

  const link = document.createElement("a")
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob)
    link.setAttribute("href", url)
    link.setAttribute("download", `${data.filename}.xls`)
    link.style.visibility = "hidden"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }
}

export const exportToPDF = async (data: ExportData): Promise<void> => {
  // Simple PDF export using HTML to PDF conversion
  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>${data.filename}</title>
      <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        table { width: 100%; border-collapse: collapse; margin-top: 20px; }
        th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
        th { background-color: #f2f2f2; font-weight: bold; }
        h1 { color: #333; border-bottom: 2px solid #007bff; padding-bottom: 10px; }
      </style>
    </head>
    <body>
      <h1>${data.filename}</h1>
      <p>Généré le ${new Date().toLocaleDateString("fr-FR")} à ${new Date().toLocaleTimeString("fr-FR")}</p>
      <table>
        <thead>
          <tr>
            ${data.headers.map((header) => `<th>${header}</th>`).join("")}
          </tr>
        </thead>
        <tbody>
          ${data.rows.map((row) => `<tr>${row.map((cell) => `<td>${cell}</td>`).join("")}</tr>`).join("")}
        </tbody>
      </table>
    </body>
    </html>
  `

  const blob = new Blob([htmlContent], { type: "text/html" })
  const link = document.createElement("a")
  const url = URL.createObjectURL(blob)
  link.setAttribute("href", url)
  link.setAttribute("download", `${data.filename}.html`)
  link.style.visibility = "hidden"
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

// Utility functions for different data types
export const prepareProductsForExport = (products: any[]) => ({
  headers: ["ID", "Nom", "Catégorie", "Prix (€)", "Stock", "Stock Min", "Stock Max", "Fournisseur", "Date Expiration"],
  rows: products.map((product) => [
    product.id,
    product.name,
    product.category,
    product.price.toFixed(2),
    product.stock,
    product.minStock,
    product.maxStock,
    product.supplier,
    new Date(product.expiryDate).toLocaleDateString("fr-FR"),
  ]),
  filename: `produits_${new Date().toISOString().split("T")[0]}`,
})

export const prepareOrdersForExport = (orders: any[]) => ({
  headers: ["ID Commande", "Client", "Date", "Statut", "Total (€)", "Nb Articles"],
  rows: orders.map((order) => [
    order.id,
    order.clientName,
    new Date(order.orderDate).toLocaleDateString("fr-FR"),
    order.status,
    order.total.toFixed(2),
    order.products?.length || 0,
  ]),
  filename: `commandes_${new Date().toISOString().split("T")[0]}`,
})

export const prepareUsersForExport = (users: any[]) => ({
  headers: ["ID", "Nom", "Email", "Rôle", "Statut", "Dernière Connexion", "Date Création"],
  rows: users.map((user) => [
    user.id,
    user.name,
    user.email,
    user.role,
    user.status,
    user.lastLogin ? new Date(user.lastLogin).toLocaleDateString("fr-FR") : "Jamais",
    new Date(user.createdAt).toLocaleDateString("fr-FR"),
  ]),
  filename: `utilisateurs_${new Date().toISOString().split("T")[0]}`,
})

export const prepareStockAlertsForExport = (products: any[]) => {
  const lowStockProducts = products.filter((p) => p.stock <= p.minStock)
  return {
    headers: ["Produit", "Stock Actuel", "Stock Minimum", "Déficit", "Fournisseur", "Urgence"],
    rows: lowStockProducts.map((product) => [
      product.name,
      product.stock,
      product.minStock,
      product.minStock - product.stock,
      product.supplier,
      product.stock === 0 ? "CRITIQUE" : product.stock < product.minStock * 0.5 ? "URGENT" : "ATTENTION",
    ]),
    filename: `alertes_stock_${new Date().toISOString().split("T")[0]}`,
  }
}
