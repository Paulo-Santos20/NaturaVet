<?php
// Configurações do sistema de email

// Configurações SMTP (recomendado para produção)
define('SMTP_HOST', 'smtp.gmail.com'); // ou seu provedor SMTP
define('SMTP_PORT', 587);
define('SMTP_USERNAME', 'seu-email@gmail.com');
define('SMTP_PASSWORD', 'sua-senha-de-app');
define('SMTP_ENCRYPTION', 'tls');

// Email de destino
define('EMAIL_DESTINATARIO', 'crossbrasil2018@gmail.com');
define('EMAIL_COPIA', ''); // Email para cópia (opcional)

// Configurações gerais
define('SITE_NAME', 'NutriPet');
define('SITE_URL', 'https://nutripet.com');

// Configurações de segurança
define('RATE_LIMIT_MINUTES', 5); // Limite de tempo entre envios
define('MAX_MESSAGE_LENGTH', 2000);

// Configurações de log
define('ENABLE_LOGGING', true);
define('LOG_FILE', 'logs/contatos.log');
?>