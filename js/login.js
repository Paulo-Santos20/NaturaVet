document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    const loginMessages = document.getElementById('login-messages');
    const togglePassword = document.querySelector('.toggle-password');
    const passwordInput = document.getElementById('password');
    const submitBtn = document.querySelector('.btn-login-submit');
    const demoButtons = document.querySelectorAll('.btn-demo');
    const forgotPasswordLink = document.getElementById('forgot-password');

    // Contas de usuário (em produção, isso viria de um banco de dados)
    const users = {
        'admin@NaturaVet.com': {
            password: 'admin123',
            role: 'admin',
            name: 'Administrador',
            permissions: ['read', 'write', 'delete', 'manage_users']
        },
        'consultor@NaturaVet.com': {
            password: 'consultor123',
            role: 'consultor',
            name: 'Consultor',
            permissions: ['read']
        },
        'escritor@NaturaVet.com': {
            password: 'escritor123',
            role: 'escritor',
            name: 'Escritor',
            permissions: ['read', 'write']
        }
    };

    // Toggle mostrar/esconder senha
    if (togglePassword && passwordInput) {
        togglePassword.addEventListener('click', function() {
            const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
            passwordInput.setAttribute('type', type);
            
            const icon = this.querySelector('i');
            icon.classList.toggle('fa-eye');
            icon.classList.toggle('fa-eye-slash');
        });
    }

    // Botões de conta demo
    demoButtons.forEach(button => {
        button.addEventListener('click', function() {
            const email = this.dataset.email;
            const password = this.dataset.password;
            
            document.getElementById('email').value = email;
            document.getElementById('password').value = password;
            
            // Feedback visual
            this.style.background = '#28a745';
            this.textContent = 'Dados preenchidos!';
            
            setTimeout(() => {
                this.style.background = '#FC5A8D';
                this.textContent = 'Usar esta conta';
            }, 1500);
        });
    });

    // Esqueceu a senha
    if (forgotPasswordLink) {
        forgotPasswordLink.addEventListener('click', function(e) {
            e.preventDefault();
            showMessage('Para recuperar sua senha, entre em contato via WhatsApp: (81) 98579-5635', 'success');
        });
    }

    // Submit do formulário
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value;
        const remember = document.getElementById('remember').checked;
        
        // Validação básica
        if (!email || !password) {
            showMessage('Por favor, preencha todos os campos.', 'error');
            return;
        }
        
        if (!isValidEmail(email)) {
            showMessage('Por favor, digite um e-mail válido.', 'error');
            return;
        }
        
        // Mostrar loading
        submitBtn.classList.add('loading');
        submitBtn.disabled = true;
        
        // Simular verificação (em produção, seria uma requisição ao servidor)
        setTimeout(() => {
            if (authenticateUser(email, password)) {
                const user = users[email];
                
                // Salvar dados do usuário
                const userData = {
                    email: email,
                    name: user.name,
                    role: user.role,
                    permissions: user.permissions,
                    loginTime: new Date().toISOString()
                };
                
                // Salvar no localStorage
                if (remember) {
                    localStorage.setItem('NaturaVet_user', JSON.stringify(userData));
                    localStorage.setItem('NaturaVet_remember', 'true');
                } else {
                    sessionStorage.setItem('NaturaVet_user', JSON.stringify(userData));
                }
                
                showMessage('Login realizado com sucesso! Redirecionando...', 'success');
                
                // Redirecionar para dashboard
                setTimeout(() => {
                    window.location.href = 'dashboard.html';
                }, 1500);
                
            } else {
                showMessage('E-mail ou senha incorretos. Tente novamente.', 'error');
                
                // Remover loading
                submitBtn.classList.remove('loading');
                submitBtn.disabled = false;
            }
        }, 1500);
    });
    
    // Função para autenticar usuário
    function authenticateUser(email, password) {
        const user = users[email];
        return user && user.password === password;
    }
    
    // Função para validar e-mail
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    
    // Função para mostrar mensagens
    function showMessage(message, type) {
        loginMessages.textContent = message;
        loginMessages.className = `login-messages ${type}`;
        loginMessages.style.display = 'block';
        
        // Auto-hide após 5 segundos
        setTimeout(() => {
            loginMessages.style.display = 'none';
        }, 5000);
    }
    
    // Verificar se já está logado
    const savedUser = localStorage.getItem('NaturaVet_user') || sessionStorage.getItem('NaturaVet_user');
    if (savedUser) {
        const userData = JSON.parse(savedUser);
        showMessage(`Bem-vindo de volta, ${userData.name}! Redirecionando...`, 'success');
        
        setTimeout(() => {
            window.location.href = 'dashboard.html';
        }, 2000);
    }
});

// Função global para logout (pode ser usada em outras páginas)
function logout() {
    localStorage.removeItem('NaturaVet_user');
    localStorage.removeItem('NaturaVet_remember');
    sessionStorage.removeItem('NaturaVet_user');
    
    window.location.href = 'login.html';
}

// Função para verificar se está logado (pode ser usada em outras páginas)
function isLoggedIn() {
    return localStorage.getItem('NaturaVet_user') || sessionStorage.getItem('NaturaVet_user');
}

// Função para obter dados do usuário logado
function getCurrentUser() {
    const userData = localStorage.getItem('NaturaVet_user') || sessionStorage.getItem('NaturaVet_user');
    return userData ? JSON.parse(userData) : null;
}

// Função para verificar permissões
function hasPermission(permission) {
    const user = getCurrentUser();
    return user && user.permissions.includes(permission);
}

// No login.js, atualize a função validateLogin:
function validateLogin(email, password) {
    // Carregar usuários do localStorage com a chave correta
    const savedUsuarios = localStorage.getItem('NaturaVet_usuarios'); // Mudança aqui
    let usuarios = [];
    
    if (savedUsuarios) {
        usuarios = JSON.parse(savedUsuarios);
    } else {
        // Usuários padrão se não houver dados salvos
        usuarios = [
            {
                id: 1,
                nome: 'Administrador',
                email: 'admin@NaturaVet.com', // Mudança aqui
                senha: 'admin123',
                tipo: 'admin',
                status: 'ativo'
            }
        ];
        localStorage.setItem('NaturaVet_usuarios', JSON.stringify(usuarios)); // Mudança aqui
    }
    
    const user = usuarios.find(u => 
        u.email === email && 
        u.senha === password && 
        u.status === 'ativo'
    );
    
    if (user) {
        return {
            name: user.nome,
            email: user.email,
            role: user.tipo
        };
    }
    
    return null;
}