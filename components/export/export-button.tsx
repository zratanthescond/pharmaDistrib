"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu"
import { Download, FileText, Table, FileSpreadsheet, Loader2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { exportToCSV, exportToExcel, exportToPDF, type ExportData } from "@/lib/export-utils"

interface ExportButtonProps {
  data: ExportData
  variant?: "default" | "outline" | "ghost"
  size?: "sm" | "default" | "lg"
  className?: string
}

export function ExportButton({ data, variant = "outline", size = "default", className }: ExportButtonProps) {
  const [isExporting, setIsExporting] = useState(false)
  const { toast } = useToast()

  const handleExport = async (format: "csv" | "excel" | "pdf") => {
    setIsExporting(true)

    try {
      toast({
        title: "Export en cours",
        description: `Génération du fichier ${format.toUpperCase()}...`,
      })

      // Simulate processing time for better UX
      await new Promise((resolve) => setTimeout(resolve, 1000))

      switch (format) {
        case "csv":
          exportToCSV(data)
          break
        case "excel":
          exportToExcel(data)
          break
        case "pdf":
          exportToPDF(data)
          break
      }

      toast({
        title: "Export réussi",
        description: `Fichier ${format.toUpperCase()} téléchargé avec succès.`,
      })
    } catch (error) {
      toast({
        title: "Erreur d'export",
        description: "Une erreur est survenue lors de l'export.",
        variant: "destructive",
      })
    } finally {
      setIsExporting(false)
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant={variant} size={size} className={className} disabled={isExporting}>
          {isExporting ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Download className="w-4 h-4 mr-2" />}
          {isExporting ? "Export..." : "Exporter"}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel className="flex items-center space-x-2">
          <Download className="w-4 h-4" />
          <span>Formats d'export</span>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />

        <DropdownMenuItem onClick={() => handleExport("csv")} className="cursor-pointer" disabled={isExporting}>
          <Table className="w-4 h-4 mr-2" />
          <div>
            <p className="font-medium">CSV</p>
            <p className="text-xs text-gray-500">Fichier de valeurs séparées</p>
          </div>
        </DropdownMenuItem>

        <DropdownMenuItem onClick={() => handleExport("excel")} className="cursor-pointer" disabled={isExporting}>
          <FileSpreadsheet className="w-4 h-4 mr-2" />
          <div>
            <p className="font-medium">Excel</p>
            <p className="text-xs text-gray-500">Tableur Microsoft Excel</p>
          </div>
        </DropdownMenuItem>

        <DropdownMenuItem onClick={() => handleExport("pdf")} className="cursor-pointer" disabled={isExporting}>
          <FileText className="w-4 h-4 mr-2" />
          <div>
            <p className="font-medium">PDF</p>
            <p className="text-xs text-gray-500">Document portable</p>
          </div>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
