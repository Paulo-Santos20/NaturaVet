<?php
require_once 'config.php';
require_once 'vendor/autoload.php'; // Se usar Composer para PHPMailer

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\SMTP;
use PHPMailer\PHPMailer\Exception;

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Método não permitido']);
    exit;
}

// Verificar rate limiting (opcional)
session_start();
$now = time();
$last_submit = $_SESSION['last_submit'] ?? 0;

if ($now - $last_submit < (RATE_LIMIT_MINUTES * 60)) {
    echo json_encode([
        'success' => false, 
        'message' => 'Aguarde ' . RATE_LIMIT_MINUTES . ' minutos antes de enviar outra mensagem.'
    ]);
    exit;
}

// Validar e sanitizar dados (mesmo código anterior)
$nome = filter_input(INPUT_POST, 'nome', FILTER_SANITIZE_STRING);
$telefone = filter_input(INPUT_POST, 'telefone', FILTER_SANITIZE_STRING);
$email = filter_input(INPUT_POST, 'email', FILTER_VALIDATE_EMAIL);
$pet_nome = filter_input(INPUT_POST, 'pet_nome', FILTER_SANITIZE_STRING);
$pet_tipo = filter_input(INPUT_POST, 'pet_tipo', FILTER_SANITIZE_STRING);
$servico = filter_input(INPUT_POST, 'servico', FILTER_SANITIZE_STRING);
$mensagem = filter_input(INPUT_POST, 'mensagem', FILTER_SANITIZE_STRING);

// Validações (mesmo código anterior)
$erros = [];
if (empty($nome)) $erros[] = 'Nome é obrigatório';
if (empty($telefone)) $erros[] = 'Telefone é obrigatório';
if (empty($email)) $erros[] = 'Email é obrigatório';
if (empty($mensagem)) $erros[] = 'Mensagem é obrigatória';
if (strlen($mensagem) > MAX_MESSAGE_LENGTH) $erros[] = 'Mensagem muito longa';

if (!empty($erros)) {
    echo json_encode(['success' => false, 'message' => implode(', ', $erros)]);
    exit;
}

try {
    $mail = new PHPMailer(true);
    
    // Configurações SMTP
    $mail->isSMTP();
    $mail->Host = SMTP_HOST;
    $mail->SMTPAuth = true;
    $mail->Username = SMTP_USERNAME;
    $mail->Password = SMTP_PASSWORD;
    $mail->SMTPSecure = SMTP_ENCRYPTION;
    $mail->Port = SMTP_PORT;
    $mail->CharSet = 'UTF-8';
    
    // Destinatários
    $mail->setFrom(SMTP_USERNAME, SITE_NAME);
    $mail->addAddress(EMAIL_DESTINATARIO);
    $mail->addReplyTo($email, $nome);
    
    if (!empty(EMAIL_COPIA)) {
        $mail->addCC(EMAIL_COPIA);
    }
    
    // Conteúdo
    $mail->isHTML(true);
    $mail->Subject = '🐾 Nova mensagem do site ' . SITE_NAME;
    
    // Mesmo conteúdo HTML do arquivo anterior
    $mail->Body = "<!-- Mesmo HTML do arquivo anterior -->";
    
    $mail->send();
    
    // Atualizar rate limiting
    $_SESSION['last_submit'] = $now;
    
    // Log (se habilitado)
    if (ENABLE_LOGGING) {
        $log_data = [
            'timestamp' => date('Y-m-d H:i:s'),
            'nome' => $nome,
            'email' => $email,
            'telefone' => $telefone,
            'servico' => $servico,
            'ip' => $_SERVER['REMOTE_ADDR'] ?? 'N/A'
        ];
        
        if (!file_exists(dirname(LOG_FILE))) {
            mkdir(dirname(LOG_FILE), 0755, true);
        }
        
        file_put_contents(LOG_FILE, json_encode($log_data) . "\n", FILE_APPEND | LOCK_EX);
    }
    
    echo json_encode([
        'success' => true,
        'message' => 'Mensagem enviada com sucesso! Entraremos em contato em breve.'
    ]);
    
} catch (Exception $e) {
    error_log("Erro ao enviar email: " . $e->getMessage());
    
    echo json_encode([
        'success' => false,
        'message' => 'Erro ao enviar mensagem. Tente novamente ou entre em contato via WhatsApp.'
    ]);
}
?>