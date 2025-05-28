import { NextResponse } from 'next/server'

export function GET() {
  const html = `
    <!DOCTYPE html>
    <html lang="es">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="stylesheet" href="https://reservas.fnsbooking.com/css/FNSbooking.css" />
        <link rel="stylesheet" href="https://reservas.fnsbooking.com/css/hotel-datepicker.css" />
        <title>FNS Booking</title>
        <style> body { margin: 0; padding: 0; } </style>
      </head>
      <body>
        <div id="fns_booking_modal"></div>

        <script src="https://reservas.fnsbooking.com/js/fecha.min.js"></script>
        <script src="https://reservas.fnsbooking.com/js/hotel-datepicker.min.js"></script>
        <script src="https://reservas.fnsbooking.com/js/FNSbooking_v2.js"></script>

        <script>
          const fnsbooking = new FNSbooking(
            '3277',
            '#fns_booking_modal',
            'es',
            '#5c2374',
            true,
            true,
            '5px',
            '0px',
            undefined,
            undefined
          );
          fnsbooking.setCustomStyles(undefined);
          fnsbooking.show();
        </script>

        <script>
          function postHeight() {
            const height = document.body.scrollHeight;
            parent.postMessage({ fnsbookingHeight: height }, '*');
          }

          window.addEventListener('load', () => {
            postHeight();

            const isMobile = window.innerWidth <= 768;
            if (!isMobile) return;

            const MAX_ATTEMPTS = 20;
            let attempts = 0;

            const tryClickOpenButton = () => {
              const openBtn = document.getElementById('comp-dispo-btn');
              if (openBtn) {
                console.log('[FNS] Botón #comp-dispo-btn detectado, clic automático.');
                openBtn.click();
              } else if (attempts < MAX_ATTEMPTS) {
                attempts++;
                setTimeout(tryClickOpenButton, 500);
              } else {
                console.warn('[FNS] No se encontró #comp-dispo-btn luego de varios intentos.');
              }
            };

            // Esperamos 1 segundo inicial antes de buscar el botón
            setTimeout(tryClickOpenButton, 1000);
          });

          const observer = new MutationObserver(postHeight);
          observer.observe(document.body, { childList: true, subtree: true });
        </script>
      </body>
    </html>
  `

  return new NextResponse(html, {
    status: 200,
    headers: {
      'Content-Type': 'text/html',
    },
  })
}
