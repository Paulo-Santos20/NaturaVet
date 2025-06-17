document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('contactForm');
    const submitBtn = form.querySelector('.submit-btn');
    const formMessages = document.getElementById('form-messages');
    
    // Verificar se os elementos existem
    if (!form || !submitBtn || !formMessages) {
        console.error('Elementos do formulário não encontrados');
        return;
    }
    
    // Máscara para telefone
    const telefoneInput = document.getElementById('telefone');
    if (telefoneInput) {
        telefoneInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            
            if (value.length <= 11) {
                if (value.length <= 10) {
                    value = value.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
                } else {
                    value = value.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
                }
            }
            
            e.target.value = value;
        });
    }
    
    // Validação em tempo real
    const inputs = form.querySelectorAll('input[required], textarea[required]');
    inputs.forEach(input => {
        input.addEventListener('blur', validateField);
        input.addEventListener('input', clearFieldError);
    });
    
    function validateField(e) {
        const field = e.target;
        const value = field.value.trim();
        
        clearFieldError(e);
        
        if (!value) {
            showFieldError(field, 'Este campo é obrigatório');
            return false;
        }
        
        if (field.type === 'email') {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                showFieldError(field, 'Digite um e-mail válido');
                return false;
            }
        }
        
        if (field.type === 'tel') {
            const phoneRegex = /\(\d{2}\)\s\d{4,5}-\d{4}/;
            if (!phoneRegex.test(value)) {
                showFieldError(field, 'Digite um telefone válido');
                return false;
            }
        }
        
        return true;
    }
    
    function showFieldError(field, message) {
        field.style.borderColor = '#dc3545';
        field.style.backgroundColor = '#fff5f5';
        
        const existingError = field.parentNode.querySelector('.field-error');
        if (existingError) {
            existingError.remove();
        }
        
        const errorDiv = document.createElement('div');
        errorDiv.className = 'field-error';
        errorDiv.style.color = '#dc3545';
        errorDiv.style.fontSize = '0.8rem';
        errorDiv.style.marginTop = '0.25rem';
        errorDiv.textContent = message;
        
        field.parentNode.appendChild(errorDiv);
    }
    
    function clearFieldError(e) {
        const field = e.target;
        field.style.borderColor = '#e1e5e9';
        field.style.backgroundColor = '#f8f9fa';
        
        const errorDiv = field.parentNode.querySelector('.field-error');
        if (errorDiv) {
            errorDiv.remove();
        }
    }
    
    // Submit do formulário
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        console.log('Formulário enviado');
        
        // Validar todos os campos obrigatórios
        let isValid = true;
        inputs.forEach(input => {
            if (!validateField({ target: input })) {
                isValid = false;
            }
        });
        
        // Verificar checkbox de termos
        const termosCheckbox = document.getElementById('termos');
        if (termosCheckbox && !termosCheckbox.checked) {
            showFormMessage('❌ Você deve concordar com os termos de uso e política de privacidade.', 'error');
            isValid = false;
        }
        
        if (!isValid) {
            return;
        }
        
        // Mostrar loading
        submitBtn.classList.add('loading');
        submitBtn.disabled = true;
        
        // Coletar dados do formulário
        const formData = new FormData(form);
        
        // Tentar enviar via EmailJS
        sendViaEmailJS(formData)
            .then(() => {
                console.log('Email enviado com sucesso via EmailJS');
            })
            .catch((error) => {
                console.error('Erro ao enviar via EmailJS:', error);
                // Se falhar, usar WhatsApp como fallback
                sendViaWhatsAppFallback(formData);
            })
            .finally(() => {
                submitBtn.classList.remove('loading');
                submitBtn.disabled = false;
            });
    });
    
    // Enviar via EmailJS
    function sendViaEmailJS(formData) {
        return new Promise((resolve, reject) => {
            // Verificar se EmailJS está carregado
            if (typeof emailjs === 'undefined') {
                console.error('EmailJS não está carregado');
                reject(new Error('EmailJS not loaded'));
                return;
            }
            
            // Mapear tipos de pet para exibição
            const petTypes = {
                'cao': 'Cão',
                'gato': 'Gato',
                'outro': 'Outro'
            };
            
            // Mapear serviços para exibição
            const services = {
                'consulta': 'Consulta Nutricional',
                'natural': 'Alimentação Natural',
                'mista': 'Alimentação Mista',
                'comercial': 'Alimentação Comercial',
                'emagrecimento': 'Programa de Emagrecimento',
                'dietas-coadjuvantes': 'Dietas Coadjuvantes'
            };
            
            // Preparar parâmetros do template
            const templateParams = {
                from_name: formData.get('nome') || 'Nome não informado',
                from_email: formData.get('email') || 'Email não informado',
                phone: formData.get('telefone') || 'Telefone não informado',
                pet_name: formData.get('pet_nome') || '',
                pet_type: petTypes[formData.get('pet_tipo')] || formData.get('pet_tipo') || '',
                service: services[formData.get('servico')] || formData.get('servico') || '',
                message: formData.get('mensagem') || 'Mensagem não informada',
                current_date: new Date().toLocaleString('pt-BR', {
                    timeZone: 'America/Sao_Paulo',
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                }),
                to_email: 'crossbrasil2018@gmail.com' // Email de destino
            };
            
            console.log('Enviando email com parâmetros:', templateParams);
            
            // SUBSTITUA ESTAS CONFIGURAÇÕES PELAS SUAS DO EMAILJS
            const SERVICE_ID = 'service_mwhw2kl';     // Ex: 'service_abc123'
            const TEMPLATE_ID = 'template_kz236jp';   // Ex: 'template_def456'
            const PUBLIC_KEY = 'Ct7xRienxSuULGJS_';     // Ex: 'user_ghi789'
            
            // Verificar se as configurações foram definidas
            if (SERVICE_ID === 'YOUR_SERVICE_ID' || TEMPLATE_ID === 'YOUR_TEMPLATE_ID' || PUBLIC_KEY === 'YOUR_PUBLIC_KEY') {
                console.error('⚠️ Configurações do EmailJS não foram definidas!');
                showFormMessage('⚠️ Configuração de email pendente. Redirecionando para WhatsApp...', 'error');
                setTimeout(() => redirectToWhatsApp(formData), 2000);
                reject(new Error('EmailJS not configured'));
                return;
            }
            
            // Enviar email
            emailjs.send(SERVICE_ID, TEMPLATE_ID, templateParams, PUBLIC_KEY)
                .then((response) => {
                    console.log('✅ EmailJS SUCCESS!', response.status, response.text);
                    
                    // Salvar contato localmente para backup
                    saveContactLocally(formData, 'Enviado por email');
                    
                    // Mostrar mensagem de sucesso
                    showFormMessage('✅ Mensagem enviada com sucesso! Entraremos em contato em breve. Redirecionando para WhatsApp...', 'success');
                    
                    // Resetar formulário
                    form.reset();
                    
                    // Redirecionar para WhatsApp após 3 segundos
                    setTimeout(() => {
                        redirectToWhatsApp(formData);
                    }, 3000);
                    
                    resolve(response);
                })
                .catch((error) => {
                    console.error('❌ EmailJS FAILED:', error);
                    
                    // Mostrar erro específico baseado no tipo
                    let errorMessage = 'Erro ao enviar email. ';
                    
                    if (error.status === 400) {
                        errorMessage += 'Dados inválidos. ';
                    } else if (error.status === 401) {
                        errorMessage += 'Configuração de autenticação incorreta. ';
                    } else if (error.status === 404) {
                        errorMessage += 'Serviço ou template não encontrado. ';
                    } else if (error.status === 429) {
                        errorMessage += 'Limite de envios excedido. ';
                    } else {
                        errorMessage += 'Erro de conexão. ';
                    }
                    
                    errorMessage += 'Redirecionando para WhatsApp...';
                    
                    showFormMessage('⚠️ ' + errorMessage, 'error');
                    
                    // Salvar localmente como fallback
                    saveContactLocally(formData, 'Erro no email - enviado via WhatsApp');
                    
                    // Redirecionar para WhatsApp após 2 segundos
                    setTimeout(() => {
                        redirectToWhatsApp(formData);
                    }, 2000);
                    
                    reject(error);
                });
        });
    }
    
    // Fallback para WhatsApp quando EmailJS falha
    function sendViaWhatsAppFallback(formData) {
        // Salvar localmente
        saveContactLocally(formData, 'Enviado via WhatsApp (fallback)');
        
        // Mostrar mensagem
        showFormMessage('📱 Redirecionando para WhatsApp para finalizar seu contato...', 'success');
        
        // Resetar formulário
        form.reset();
        
        // Redirecionar para WhatsApp
        setTimeout(() => {
            redirectToWhatsApp(formData);
        }, 2000);
    }
    
    // Salvar contato no localStorage para backup
    function saveContactLocally(formData, status = 'Pendente') {
        const contactData = {
            id: Date.now(),
            timestamp: new Date().toLocaleString('pt-BR', {
                timeZone: 'America/Sao_Paulo',
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit'
            }),
            nome: formData.get('nome'),
            telefone: formData.get('telefone'),
            email: formData.get('email'),
            pet_nome: formData.get('pet_nome') || 'Não informado',
            pet_tipo: formData.get('pet_tipo') || 'Não informado',
            servico: formData.get('servico') || 'Não informado',
            mensagem: formData.get('mensagem'),
            status: status
        };
        
        // Salvar no localStorage
        let contacts = JSON.parse(localStorage.getItem('nutripet_contacts') || '[]');
        contacts.push(contactData);
        
        // Manter apenas os últimos 50 contatos
        if (contacts.length > 50) {
            contacts = contacts.slice(-50);
        }
        
        localStorage.setItem('nutripet_contacts', JSON.stringify(contacts));
        
        console.log('💾 Contato salvo localmente:', contactData);
    }
    
    // Redirecionar para WhatsApp
    function redirectToWhatsApp(formData) {
        const nome = formData.get('nome') || 'Visitante';
        const telefone = formData.get('telefone') || '';
        const email = formData.get('email') || '';
        const petNome = formData.get('pet_nome') || '';
        const petTipo = formData.get('pet_tipo') || '';
        const servico = formData.get('servico') || '';
        const mensagem = formData.get('mensagem') || 'Gostaria de mais informações sobre os serviços.';
        
        // Mapear serviços
        const services = {
            'consulta': 'Consulta Nutricional',
            'natural': 'Alimentação Natural',
            'mista': 'Alimentação Mista',
            'comercial': 'Alimentação Comercial',
            'emagrecimento': 'Programa de Emagrecimento',
            'dietas-coadjuvantes': 'Dietas Coadjuvantes'
        };
        
        // Mapear tipos de pet
        const petTypes = {
            'cao': 'Cão',
            'gato': 'Gato',
            'outro': 'Outro'
        };
        
        // Montar mensagem do WhatsApp
        let whatsappMessage = `🐾 *Contato via Site NutriPet*\n\n`;
        whatsappMessage += `👤 *Nome:* ${nome}\n`;
        
        if (telefone) whatsappMessage += `📱 *Telefone:* ${telefone}\n`;
        if (email) whatsappMessage += `📧 *Email:* ${email}\n`;
        
        if (petNome) {
            whatsappMessage += `🐕 *Pet:* ${petNome}`;
            if (petTipo) {
                whatsappMessage += ` (${petTypes[petTipo] || petTipo})`;
            }
            whatsappMessage += `\n`;
        }
        
        if (servico) {
            whatsappMessage += `🩺 *Serviço de Interesse:* ${services[servico] || servico}\n`;
        }
        
        whatsappMessage += `\n💬 *Mensagem:*\n${mensagem}`;
        whatsappMessage += `\n\n_Mensagem enviada em ${new Date().toLocaleString('pt-BR')}_`;
        
        const whatsappUrl = `https://wa.me/5581985795635?text=${encodeURIComponent(whatsappMessage)}`;
        window.open(whatsappUrl, '_blank');
    }
    
    // Mostrar mensagens do formulário
    function showFormMessage(message, type) {
        formMessages.innerHTML = `
            <div style="display: flex; align-items: center; gap: 10px;">
                <span>${message}</span>
            </div>
        `;
        formMessages.className = `form-messages ${type}`;
        formMessages.style.display = 'block';
        formMessages.scrollIntoView({ behavior: 'smooth', block: 'center' });
        
        // Auto-hide após 8 segundos
        setTimeout(() => {
            formMessages.style.display = 'none';
        }, 8000);
    }
});

// Funções utilitárias para administração (opcional)
function viewSavedContacts() {
    const contacts = JSON.parse(localStorage.getItem('nutripet_contacts') || '[]');
    console.table(contacts);
    return contacts;
}

function exportContacts() {
    const contacts = JSON.parse(localStorage.getItem('nutripet_contacts') || '[]');
    const dataStr = JSON.stringify(contacts, null, 2);
    const dataBlob = new Blob([dataStr], {type: 'application/json'});
    
    const link = document.createElement('a');
    link.href = URL.createObjectURL(dataBlob);
    link.download = `nutripet_contatos_${new Date().toISOString().split('T')[0]}.json`;
    link.click();
}

function clearSavedContacts() {
    if (confirm('Tem certeza que deseja limpar todos os contatos salvos?')) {
        localStorage.removeItem('nutripet_contacts');
        console.log('Contatos limpos!');
    }
}