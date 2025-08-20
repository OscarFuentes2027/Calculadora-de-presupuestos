"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"

interface AmortizationRow {
  periodo: number
  saldoInicial: number
  interes: number
  abonoCapital: number
  pagoTotal: number
  saldoFinal: number
}

interface LoanSummary {
  cuotasRegulares: number
  montoCuotaRegular: number
  ultimaCuota: number
  totalCapital: number
  totalIntereses: number
  totalPagado: number
}

export default function LoanCalculator() {
  const [monto, setMonto] = useState("")
  const [meses, setMeses] = useState("")
  const [esSocio, setEsSocio] = useState(false)
  const [pagosAMeses, setPagosAMeses] = useState(false)
  const [tabla, setTabla] = useState<AmortizationRow[]>([])
  const [resumen, setResumen] = useState<LoanSummary | null>(null)
  const [errores, setErrores] = useState<string[]>([])

  const validarFormulario = (): boolean => {
    const nuevosErrores: string[] = []

    const montoNum = Number.parseFloat(monto)
    const mesesNum = Number.parseInt(meses)

    if (!monto || isNaN(montoNum) || montoNum <= 0) {
      nuevosErrores.push("El monto debe ser mayor a 0")
    }

    if (!meses || isNaN(mesesNum) || mesesNum < 1) {
      nuevosErrores.push("Los meses deben ser 1 o más")
    }

    setErrores(nuevosErrores)
    return nuevosErrores.length === 0
  }

  const calcularPrestamo = () => {
    if (!validarFormulario()) return

    const montoNum = Number.parseFloat(monto)
    const mesesNum = Number.parseInt(meses)
    const tasaInteres = esSocio ? 0.03 : 0.06

    if (pagosAMeses) {
      // Modo: Pagos a meses (cuotas mensuales)
      const pagoRegular = Math.round((montoNum / mesesNum) * 100) / 100

      const tablaAmortizacion: AmortizationRow[] = []
      let saldoActual = montoNum
      let totalIntereses = 0

      for (let periodo = 1; periodo <= mesesNum; periodo++) {
        const saldoInicial = Math.round(saldoActual * 100) / 100
        const interes = Math.round(saldoInicial * tasaInteres * 100) / 100

        let abonoCapital: number
        let pagoTotal: number

        if (periodo === mesesNum) {
          // Última cuota: ajustar para que el saldo final sea exactamente 0
          abonoCapital = saldoInicial
          pagoTotal = Math.round((saldoInicial + interes) * 100) / 100
        } else {
          abonoCapital = Math.round((pagoRegular - interes) * 100) / 100
          pagoTotal = pagoRegular

          // Asegurar que el abono a capital no sea negativo
          if (abonoCapital < 0) {
            abonoCapital = 0
            pagoTotal = interes
          }
        }

        const saldoFinal = Math.round((saldoInicial - abonoCapital) * 100) / 100

        tablaAmortizacion.push({
          periodo,
          saldoInicial,
          interes,
          abonoCapital,
          pagoTotal,
          saldoFinal,
        })

        saldoActual = saldoFinal
        totalIntereses += interes
      }

      // Calcular resumen para pagos a meses 
      const ultimaCuota = tablaAmortizacion[tablaAmortizacion.length - 1].pagoTotal
      const totalPagado = tablaAmortizacion.reduce((sum, row) => sum + row.pagoTotal, 0)

      setTabla(tablaAmortizacion)
      setResumen({
        cuotasRegulares: mesesNum - 1,
        montoCuotaRegular: pagoRegular,
        ultimaCuota,
        totalCapital: montoNum,
        totalIntereses: Math.round(totalIntereses * 100) / 100,
        totalPagado: Math.round(totalPagado * 100) / 100,
      })
    } else {
      // Modo: Pago único al final
      let totalIntereses = 0
      let saldoActual = montoNum

      // Calcular intereses acumulados durante todo el período
      for (let periodo = 1; periodo <= mesesNum; periodo++) {
        const saldoInicial = Math.round(saldoActual * 100) / 100
        const interes = Math.round(saldoInicial * tasaInteres * 100) / 100
        totalIntereses += interes
        saldoActual = saldoInicial + interes // El saldo crece con los intereses
      }

      const totalPagado = Math.round((montoNum + totalIntereses) * 100) / 100

      // No crear tabla de amortización para pago único
      setTabla([])
      setResumen({
        cuotasRegulares: 0,
        montoCuotaRegular: 0,
        ultimaCuota: totalPagado,
        totalCapital: montoNum,
        totalIntereses: Math.round(totalIntereses * 100) / 100,
        totalPagado: totalPagado,
      })
    }
  }

  const limpiar = () => {
    setMonto("")
    setMeses("")
    setEsSocio(false)
    setPagosAMeses(false)
    setTabla([])
    setResumen(null)
    setErrores([])
  }

  const formatearMoneda = (valor: number): string => {
    return new Intl.NumberFormat("es-MX", {
      style: "currency",
      currency: "MXN",
      minimumFractionDigits: 2,
    }).format(valor)
  }

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-6xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center">Calculadora de Préstamos</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Formulario */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="monto">Monto del Préstamo</Label>
                <Input
                  id="monto"
                  type="number"
                  placeholder="Ej: 10000"
                  value={monto}
                  onChange={(e) => setMonto(e.target.value)}
                  step="0.01"
                  min="0"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="meses">Meses del Préstamo</Label>
                <Input
                  id="meses"
                  type="number"
                  placeholder="Ej: 12"
                  value={meses}
                  onChange={(e) => setMeses(e.target.value)}
                  min="1"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="socio">¿Es socio/a?</Label>
                <div className="flex items-center space-x-2 pt-2">
                  <Switch id="socio" checked={esSocio} onCheckedChange={setEsSocio} />
                  <span className="text-sm">{esSocio ? "Sí (3% mensual)" : "No (6% mensual)"}</span>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="pagosAMeses">Pagos a meses</Label>
                <div className="flex items-center space-x-2 pt-2">
                  <Switch id="pagosAMeses" checked={pagosAMeses} onCheckedChange={setPagosAMeses} />
                  <span className="text-sm">{pagosAMeses ? "Sí (cuotas mensuales)" : "No (pago único al final)"}</span>
                </div>
              </div>
            </div>

            {/* Errores */}
            {errores.length > 0 && (
              <div className="bg-destructive/10 border border-destructive/20 rounded-md p-3">
                <ul className="text-sm text-destructive space-y-1">
                  {errores.map((error, index) => (
                    <li key={index}>• {error}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Botones */}
            <div className="flex gap-4">
              <Button onClick={calcularPrestamo} className="flex-1">
                Calcular
              </Button>
              <Button onClick={limpiar} variant="outline" className="flex-1 bg-transparent">
                Limpiar
              </Button>
            </div>

            {/* Resultados */}
            {resumen && (
              <div className="space-y-6">
                {/* Resumen de pagos */}
                <div className="bg-muted/50 rounded-lg p-4">
                  <p className="text-lg font-medium text-center">
                    {pagosAMeses ? (
                      <>
                        Se debe pagar {resumen.cuotasRegulares} cuotas de{" "}
                        <span className="font-bold text-primary">{formatearMoneda(resumen.montoCuotaRegular)}</span> y una
                        última de <span className="font-bold text-primary">{formatearMoneda(resumen.ultimaCuota)}</span>
                      </>
                    ) : (
                      <>
                        Se debe pagar <span className="font-bold text-primary">{formatearMoneda(resumen.ultimaCuota)}</span> en el lapso de {meses} meses
                      </>
                    )}
                  </p>
                </div>

                {/* Tabla de amortización - solo mostrar si pagos a meses está activo */}
                {pagosAMeses && tabla.length > 0 && (
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse border border-border">
                      <thead>
                        <tr className="bg-muted">
                          <th className="border border-border p-2 text-left">Período</th>
                          <th className="border border-border p-2 text-right">Saldo Inicial</th>
                          <th className="border border-border p-2 text-right">Interés</th>
                          <th className="border border-border p-2 text-right">Abono Capital</th>
                          <th className="border border-border p-2 text-right">Pago Total</th>
                          <th className="border border-border p-2 text-right">Saldo Final</th>
                        </tr>
                      </thead>
                      <tbody>
                        {tabla.map((fila) => (
                          <tr key={fila.periodo} className="hover:bg-muted/30">
                            <td className="border border-border p-2">{fila.periodo}</td>
                            <td className="border border-border p-2 text-right">{formatearMoneda(fila.saldoInicial)}</td>
                            <td className="border border-border p-2 text-right">{formatearMoneda(fila.interes)}</td>
                            <td className="border border-border p-2 text-right">{formatearMoneda(fila.abonoCapital)}</td>
                            <td className="border border-border p-2 text-right font-medium">
                              {formatearMoneda(fila.pagoTotal)}
                            </td>
                            <td className="border border-border p-2 text-right">{formatearMoneda(fila.saldoFinal)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                {/* Totales */}
                <div className="bg-primary/5 rounded-lg p-4">
                  <h3 className="text-lg font-semibold mb-3">Resumen Total</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center">
                      <p className="text-sm text-muted-foreground">Capital</p>
                      <p className="text-xl font-bold">{formatearMoneda(resumen.totalCapital)}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-muted-foreground">Intereses</p>
                      <p className="text-xl font-bold text-orange-600">{formatearMoneda(resumen.totalIntereses)}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-muted-foreground">Total Pagado</p>
                      <p className="text-xl font-bold text-primary">{formatearMoneda(resumen.totalPagado)}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
