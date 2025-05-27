/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'
import { useEffect } from 'react'

declare class FNSbooking {
  constructor(
    id_partner: string,
    container_div: string,
    lang: string,
    engine_color: string,
    cod_promo: boolean,
    darkmode: boolean,
    rounded: string,
    shadow: string,
    corporate_engines: any,
    corporate_type: any,
  )
  setCustomStyles(styles: any): void
  show(): void
}

interface FNSBookingProps {
  containerId: string
}

const FNSBooking = ({ containerId }: FNSBookingProps) => {
  useEffect(() => {
    const initializeFNSBooking = () => {
      const id_partner = '3277'
      const container_div = containerId
      const lang = 'es'
      const cod_promo = true
      const engine_color = '#5c2374'
      const darkmode = true
      const rounded = '5px'
      const shadow = '0px'
      const corporate_engines = undefined
      const corporate_type = undefined

      const fnsbooking = new FNSbooking(
        id_partner,
        container_div,
        lang,
        engine_color,
        cod_promo,
        darkmode,
        rounded,
        shadow,
        corporate_engines,
        corporate_type,
      )

      const custom_styles = undefined
      fnsbooking.setCustomStyles(custom_styles)
      fnsbooking.show()
    }

    const loadScript = (src: string) =>
      new Promise<void>((resolve, reject) => {
        if (document.querySelector(`script[src="${src}"]`)) {
          resolve()
          return
        }
        const script = document.createElement('script')
        script.src = src
        script.async = true
        script.onload = () => resolve()
        script.onerror = () => reject(`Error loading script: ${src}`)
        document.body.appendChild(script)
      })

    const loadScripts = async () => {
      try {
        await loadScript('https://reservas.fnsbooking.com/js/fecha.min.js')
        await loadScript('https://reservas.fnsbooking.com/js/hotel-datepicker.min.js')
        await loadScript('https://reservas.fnsbooking.com/js/FNSbooking_v2.js')
        initializeFNSBooking()
      } catch (error) {
        console.error(error)
      }
    }

    loadScripts()
  }, [containerId])

  return (
    <>
      <div id={containerId.slice(1)} />
      <link
        rel="stylesheet"
        type="text/css"
        href="https://reservas.fnsbooking.com/css/FNSbooking.css"
      />
      <link
        rel="stylesheet"
        type="text/css"
        href="https://reservas.fnsbooking.com/css/hotel-datepicker.css"
      />
    </>
  )
}

export default FNSBooking
