<!DOCTYPE html>
<html>

<head>
    <meta charset="utf-8">
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600&family=Outfit:wght@800&display=swap');

        body {
            margin: 0;
            padding: 0;
            background-color: #1F242D;
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
            color: #FFFFFF;
        }

        .wrapper {
            background-color: #1F242D;
            padding: 40px 20px;
            text-align: center;
        }

        .container {
            max-width: 600px;
            margin: 0 auto;
            background: #282F3B;
            border-radius: 24px;
            overflow: hidden;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
            border: 1px solid rgba(255, 255, 255, 0.05);
            text-align: left;
        }

        .header {
            background: linear-gradient(135deg, #1fb6e9 0%, #c128f5 100%);
            padding: 40px 30px;
            text-align: center;
        }

        .logo-text {
            font-family: 'Outfit', sans-serif;
            font-size: 32px;
            font-weight: 800;
            color: #ffffff;
            margin: 0;
            letter-spacing: -1px;
            text-transform: uppercase;
        }

        .badge {
            display: inline-block;
            background: rgba(255, 255, 255, 0.2);
            padding: 4px 12px;
            border-radius: 8px;
            font-size: 12px;
            font-weight: 700;
            margin-top: 10px;
            text-transform: uppercase;
            letter-spacing: 1px;
        }

        .content {
            padding: 40px 30px;
        }

        .title {
            font-family: 'Outfit', sans-serif;
            font-size: 24px;
            font-weight: 800;
            margin-bottom: 25px;
            color: #1FB6E9;
        }

        .info-row {
            margin-bottom: 20px;
        }

        .label {
            display: block;
            font-size: 12px;
            font-weight: 600;
            color: #94A3B8;
            text-transform: uppercase;
            letter-spacing: 1px;
            margin-bottom: 5px;
        }

        .value {
            font-size: 16px;
            color: #FFFFFF;
            background: rgba(255, 255, 255, 0.03);
            padding: 10px 15px;
            border-radius: 12px;
            border: 1px solid rgba(255, 255, 255, 0.05);
        }

        .message-box {
            background: rgba(31, 182, 233, 0.05);
            border-left: 4px solid #1FB6E9;
            padding: 20px;
            border-radius: 0 12px 12px 0;
            margin-top: 20px;
            color: #FFFFFF;
            line-height: 1.8;
            font-size: 16px;
        }

        .footer {
            background: #1F242D;
            padding: 30px;
            text-align: center;
            font-size: 13px;
            color: #94A3B8;
        }

        .footer a {
            color: #1FB6E9;
            text-decoration: none;
        }
    </style>
</head>

<body>
    <div class="wrapper">
        <div class="container">
            <div class="header">
                <h1 class="logo-text">PÍXELMARKET</h1>
                <div class="badge">Soporte Técnico</div>
            </div>
            <div class="content">
                <h2 class="title">Mensaje de Contacto</h2>

                <div class="info-row">
                    <span class="label">Remitente</span>
                    <div class="value">{{ $name }} ({{ $email }})</div>
                </div>

                <div class="info-row">
                    <span class="label">Asunto</span>
                    <div class="value">{{ $subject }}</div>
                </div>

                <div class="info-row">
                    <span class="label">Mensaje</span>
                    <div class="message-box">
                        {{ $body }}
                    </div>
                </div>
            </div>
            <div class="footer">
                <p>&copy; 2026 <strong>PíxelMarket</strong>. Todos los derechos reservados.</p>
                <p>Enviado desde el portal de soporte.</p>
            </div>
        </div>
    </div>
</body>

</html>