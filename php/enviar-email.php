<?php
// Habilitar exibição de erros para debug (remover em produção)
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Headers CORS e JSON
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, X-Requested-With');

// Tratar requisições OPTIONS (preflight)
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Log da requisição para debug
error_log("Método recebido: " . $_SERVER['REQUEST_METHOD']);
error_log("POST data: " . print_r($_POST, true));

// Verificar se é POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode([
        'success' => false, 
        'message' => 'Método não permitido. Use POST.',
        'debug' => [
            'method' => $_SERVER['REQUEST_METHOD'],
            'server' => $_SERVER['SERVER_SOFTWARE'] ?? 'Desconhecido'
        ]
    ]);
    exit;
}

// Verificar se os dados POST existem
if (empty($_POST)) {
    echo json_encode([
        'success' => false, 
        'message' => 'Nenhum dado recebido.',
        'debug' => [
            'content_type' => $_SERVER['CONTENT_TYPE'] ?? 'Não definido',
            'input' => file_get_contents('php://input')
        ]
    ]);
    exit;
}

// Configurações de email
$destinatario = 'crossbrasil2018@gmail.com'; // ALTERE PARA SEU EMAIL REAL
$assunto = 'Nova mensagem do site NaturaVet';

// Validar e sanitizar dados
$nome = isset($_POST['nome']) ? trim(filter_var($_POST['nome'], FILTER_SANITIZE_STRING)) : '';
$telefone = isset($_POST['telefone']) ? trim(filter_var($_POST['telefone'], FILTER_SANITIZE_STRING)) : '';
$email = isset($_POST['email']) ? trim(filter_var($_POST['email'], FILTER_SANITIZE_EMAIL)) : '';
$pet_nome = isset($_POST['pet_nome']) ? trim(filter_var($_POST['pet_nome'], FILTER_SANITIZE_STRING)) : '';
$pet_tipo = isset($_POST['pet_tipo']) ? trim(filter_var($_POST['pet_tipo'], FILTER_SANITIZE_STRING)) : '';
$servico = isset($_POST['servico']) ? trim(filter_var($_POST['servico'], FILTER_SANITIZE_STRING)) : '';
$mensagem = isset($_POST['mensagem']) ? trim(filter_var($_POST['mensagem'], FILTER_SANITIZE_STRING)) : '';

// Validações
$erros = [];

if (empty($nome)) {
    $erros[] = 'Nome é obrigatório';
}

if (empty($telefone)) {
    $erros[] = 'Telefone é obrigatório';
}

if (empty($email)) {
    $erros[] = 'Email é obrigatório';
} elseif (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    $erros[] = 'Email inválido';
}

if (empty($mensagem)) {
    $erros[] = 'Mensagem é obrigatória';
}

if (!empty($erros)) {
    echo json_encode([
        'success' => false, 
        'message' => implode(', ', $erros),
        'debug' => $_POST
    ]);
    exit;
}

// Preparar conteúdo do email
$conteudo = "
<html>
<head>
    <title>Nova mensagem do site NaturaVet</title>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #FC5A8D; color: white; padding: 20px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9f9f9; padding: 20px; border-radius: 0 0 10px 10px; }
        .field { margin-bottom: 15px; padding: 10px; background: white; border-radius: 5px; }
        .label { font-weight: bold; color: #FC5A8D; }
        .value { margin-top: 5px; }
        .footer { background: #333; color: white; padding: 15px; text-align: center; font-size: 12px; margin-top: 20px; border-radius: 5px; }
    </style>
</head>
<body>
    <div class='container'>
        <div class='header'>
            <h2>🐾 Nova Mensagem - NaturaVet</h2>
        </div>
        <div class='content'>
            <div class='field'>
                <div class='label'>Nome:</div>
                <div class='value'>" . htmlspecialchars($nome) . "</div>
            </div>
            <div class='field'>
                <div class='label'>Telefone/WhatsApp:</div>
                <div class='value'>" . htmlspecialchars($telefone) . "</div>
            </div>
            <div class='field'>
                <div class='label'>Email:</div>
                <div class='value'>" . htmlspecialchars($email) . "</div>
            </div>";

if (!empty($pet_nome)) {
    $conteudo .= "
            <div class='field'>
                <div class='label'>Nome do Pet:</div>
                <div class='value'>" . htmlspecialchars($pet_nome) . "</div>
            </div>";
}

if (!empty($pet_tipo)) {
    $tipos = [
        'cao' => 'Cão',
        'gato' => 'Gato',
        'outro' => 'Outro'
    ];
    $tipo_formatado = isset($tipos[$pet_tipo]) ? $tipos[$pet_tipo] : htmlspecialchars($pet_tipo);
    
    $conteudo .= "
            <div class='field'>
                <div class='label'>Tipo de Animal:</div>
                <div class='value'>{$tipo_formatado}</div>
            </div>";
}

if (!empty($servico)) {
    $servicos = [
        'consulta' => 'Consulta Nutricional',
        'natural' => 'Alimentação Natural',
        'mista' => 'Alimentação Mista',
        'comercial' => 'Alimentação Comercial',
        'emagrecimento' => 'Programa de Emagrecimento',
        'dietas-coadjuvantes' => 'Dietas Coadjuvantes'
    ];
    $servico_formatado = isset($servicos[$servico]) ? $servicos[$servico] : htmlspecialchars($servico);
    
    $conteudo .= "
            <div class='field'>
                <div class='label'>Serviço de Interesse:</div>
                <div class='value'>{$servico_formatado}</div>
            </div>";
}

$conteudo .= "
            <div class='field'>
                <div class='label'>Mensagem:</div>
                <div class='value'>" . nl2br(htmlspecialchars($mensagem)) . "</div>
            </div>
            <div class='field'>
                <div class='label'>Data/Hora:</div>
                <div class='value'>" . date('d/m/Y H:i:s') . "</div>
            </div>
            <div class='field'>
                <div class='label'>IP:</div>
                <div class='value'>" . ($_SERVER['REMOTE_ADDR'] ?? 'N/A') . "</div>
            </div>
        </div>
        <div class='footer'>
            <p>Esta mensagem foi enviada através do formulário de contato do site NaturaVet</p>
            <p>Para responder, utilize o email: " . htmlspecialchars($email) . "</p>
        </div>
    </div>
</body>
</html>";

// Headers do email
$headers = [
    'MIME-Version: 1.0',
    'Content-type: text/html; charset=UTF-8',
    'From: Site NaturaVet <noreply@NaturaVet.com>',
    'Reply-To: ' . $email,
    'X-Mailer: PHP/' . phpversion(),
    'X-Priority: 1'
];

// Tentar enviar o email
try {
    $email_enviado = mail($destinatario, $assunto, $conteudo, implode("\r\n", $headers));
    
    if ($email_enviado) {
        // Log do contato (criar diretório se não existir)
        $log_dir = __DIR__ . '/../logs';
        if (!file_exists($log_dir)) {
            mkdir($log_dir, 0755, true);
        }
        
        $log_data = [
            'timestamp' => date('Y-m-d H:i:s'),
            'nome' => $nome,
            'email' => $email,
            'telefone' => $telefone,
            'servico' => $servico,
            'ip' => $_SERVER['REMOTE_ADDR'] ?? 'N/A',
            'user_agent' => $_SERVER['HTTP_USER_AGENT'] ?? 'N/A'
        ];
        
        file_put_contents($log_dir . '/contatos.log', json_encode($log_data) . "\n", FILE_APPEND | LOCK_EX);
        
        echo json_encode([
            'success' => true, 
            'message' => 'Mensagem enviada com sucesso! Entraremos em contato em breve.',
            'debug' => 'Email enviado para: ' . $destinatario
        ]);
    } else {
        throw new Exception('Falha na função mail()');
    }
    
} catch (Exception $e) {
    error_log("Erro ao enviar email: " . $e->getMessage());
    
    echo json_encode([
        'success' => false, 
        'message' => 'Erro ao enviar mensagem. Tente novamente ou entre em contato via WhatsApp.',
        'debug' => $e->getMessage()
    ]);
}
?>