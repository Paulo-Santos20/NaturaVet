document.addEventListener('DOMContentLoaded', function() {
    // Verificar se está logado
    const currentUser = getCurrentUser();
    if (!currentUser) {
        window.location.href = 'login.html';
        return;
    }

    // Inicializar dashboard
    initializeDashboard();
    loadUserInfo();
    setupNavigation();
    setupModals();
    loadData();
    setupPermissions();
});

// Dados simulados (em produção, viriam de uma API)
let dashboardData = {
    agendamentos: [
        {
            id: 1,
            data: '2024-12-20',
            hora: '09:00',
            cliente: 'Maria Silva',
            animal: 'Rex',
            servico: 'Consulta Nutricional',
            status: 'Confirmado',
            observacoes: 'Primeira consulta'
        },
        {
            id: 2,
            data: '2024-12-20',
            hora: '14:30',
            cliente: 'João Santos',
            animal: 'Mimi',
            servico: 'Alimentação Natural',
            status: 'Pendente',
            observacoes: 'Gato com problemas digestivos'
        }
    ],
    clientes: [
        {
            id: 1,
            nome: 'Maria Silva',
            email: 'maria@email.com',
            telefone: '(81) 99999-1111',
            endereco: 'Rua das Flores, 123',
            nascimento: '1985-05-15',
            cadastro: '2024-01-10',
            animais: 2,
            observacoes: 'Cliente muito cuidadosa'
        },
        {
            id: 2,
            nome: 'João Santos',
            email: 'joao@email.com',
            telefone: '(81) 99999-2222',
            endereco: 'Av. Principal, 456',
            nascimento: '1978-12-03',
            cadastro: '2024-02-15',
            animais: 1,
            observacoes: ''
        }
    ],
    animais: [
        {
            id: 1,
            nome: 'Rex',
            tipo: 'Cão',
            raca: 'Golden Retriever',
            nascimento: '2020-03-10',
            peso: 25.5,
            tutor: 'Maria Silva',
            tutorId: 1,
            observacoes: 'Animal muito ativo, sem restrições alimentares'
        },
        {
            id: 2,
            nome: 'Bella',
            tipo: 'Cão',
            raca: 'Poodle',
            nascimento: '2019-08-22',
            peso: 8.2,
            tutor: 'Maria Silva',
            tutorId: 1,
            observacoes: 'Tendência à obesidade'
        },
        {
            id: 3,
            nome: 'Mimi',
            tipo: 'Gato',
            raca: 'Siamês',
            nascimento: '2021-01-15',
            peso: 4.1,
            tutor: 'João Santos',
            tutorId: 2,
            observacoes: 'Problemas digestivos recorrentes'
        }
    ],
    contatos: []
};

// Inicializar dashboard
function initializeDashboard() {
    // Carregar contatos do localStorage
    const savedContacts = JSON.parse(localStorage.getItem('nutripet_contacts') || '[]');
    dashboardData.contatos = savedContacts.map((contact, index) => ({
        id: index + 1,
        ...contact,
        status: contact.status || 'Pendente'
    }));

    // Carregar clientes do localStorage
    initializeClientesData();

    console.log('Dashboard inicializado com', dashboardData.contatos.length, 'contatos e', dashboardData.clientes.length, 'clientes');
}

// Carregar informações do usuário
function loadUserInfo() {
    const user = getCurrentUser();
    if (user) {
        document.getElementById('userName').textContent = user.name;
        document.getElementById('userRole').textContent = user.role;
        
        // Adicionar classe para permissões
        document.body.classList.add(`user-${user.role}`);
    }
}

// Configurar navegação
function setupNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const section = this.dataset.section;
            if (section) {
                showSection(section);
                
                // Atualizar navegação ativa
                document.querySelectorAll('.nav-item').forEach(item => {
                    item.classList.remove('active');
                });
                this.parentElement.classList.add('active');
            }
        });
    });
}

// Mostrar seção
function showSection(sectionName) {
    // Esconder todas as seções
    document.querySelectorAll('.content-section').forEach(section => {
        section.classList.remove('active');
    });
    
    // Mostrar seção específica
    const targetSection = document.getElementById(`${sectionName}-section`);
    if (targetSection) {
        targetSection.classList.add('active');
        
        // Carregar dados da seção
        switch(sectionName) {
            case 'dashboard':
                loadDashboardStats();
                break;
            case 'agendamentos':
                loadAgendamentos();
                break;
            case 'clientes':
                loadClientes();
                break;
            case 'animais':
                loadAnimais();
                break;
            case 'contatos':
                loadContatos();
                break;
        }
    }
}

// Carregar dados iniciais
function loadData() {
    loadDashboardStats();
    updateBadges();
}

// Atualizar badges de contagem
function updateBadges() {
    document.getElementById('agendamentos-count').textContent = dashboardData.agendamentos.length;
    document.getElementById('clientes-count').textContent = dashboardData.clientes.length;
    document.getElementById('animais-count').textContent = dashboardData.animais.length;
    document.getElementById('contatos-count').textContent = dashboardData.contatos.filter(c => c.status === 'Pendente').length;
}

// Carregar estatísticas do dashboard
function loadDashboardStats() {
    const hoje = new Date().toISOString().split('T')[0];
    const agendamentosHoje = dashboardData.agendamentos.filter(a => a.data === hoje).length;
    const contatosPendentes = dashboardData.contatos.filter(c => c.status === 'Pendente').length;
    
    document.getElementById('stat-agendamentos').textContent = agendamentosHoje;
    document.getElementById('stat-clientes').textContent = dashboardData.clientes.length;
    document.getElementById('stat-animais').textContent = dashboardData.animais.length;
    document.getElementById('stat-contatos').textContent = contatosPendentes;
    
    // Carregar widgets
    loadProximosAgendamentos();
    loadMensagensRecentes();
}

// Carregar próximos agendamentos
function loadProximosAgendamentos() {
    const container = document.getElementById('proximos-agendamentos');
    const hoje = new Date().toISOString().split('T')[0];
    const agendamentosHoje = dashboardData.agendamentos.filter(a => a.data === hoje);
    
    if (agendamentosHoje.length === 0) {
        container.innerHTML = '<p class="no-data">Nenhum agendamento para hoje</p>';
        return;
    }
    
    const html = agendamentosHoje.map(agendamento => `
        <div class="widget-item">
            <div class="widget-item-info">
                <strong>${agendamento.hora} - ${agendamento.cliente}</strong>
                <p>${agendamento.animal} - ${agendamento.servico}</p>
            </div>
            <span class="status-badge status-${agendamento.status.toLowerCase()}">${agendamento.status}</span>
        </div>
    `).join('');
    
    container.innerHTML = html;
}

// Carregar mensagens recentes
function loadMensagensRecentes() {
    const container = document.getElementById('mensagens-recentes');
    const mensagensRecentes = dashboardData.contatos
        .filter(c => c.status === 'Pendente')
        .slice(0, 3);
    
    if (mensagensRecentes.length === 0) {
        container.innerHTML = '<p class="no-data">Nenhuma mensagem pendente</p>';
        return;
    }
    
    const html = mensagensRecentes.map(contato => `
        <div class="widget-item">
            <div class="widget-item-info">
                <strong>${contato.nome}</strong>
                <p>${contato.mensagem?.substring(0, 50)}...</p>
                <small>${formatDate(contato.timestamp)}</small>
            </div>
        </div>
    `).join('');
    
    container.innerHTML = html;
}

// Carregar agendamentos
function loadAgendamentos() {
    const tbody = document.querySelector('#agendamentos-table tbody');
    
    if (dashboardData.agendamentos.length === 0) {
        tbody.innerHTML = '<tr class="no-data-row"><td colspan="6">Nenhum agendamento encontrado</td></tr>';
        return;
    }
    
    const html = dashboardData.agendamentos.map(agendamento => `
        <tr>
            <td>${formatDate(agendamento.data)} ${agendamento.hora}</td>
            <td>${agendamento.cliente}</td>
            <td>${agendamento.animal}</td>
            <td>${agendamento.servico}</td>
            <td><span class="status-badge status-${agendamento.status.toLowerCase()}">${agendamento.status}</span></td>
            <td>
                <div class="action-buttons">
                    <button class="btn btn-sm btn-primary" onclick="editAgendamento(${agendamento.id})">
                        <i class="fas fa-edit"></i>
                    </button>
                    ${hasPermission('delete') ? `
                        <button class="btn btn-sm btn-secondary" onclick="deleteAgendamento(${agendamento.id})">
                            <i class="fas fa-trash"></i>
                        </button>
                    ` : ''}
                </div>
            </td>
        </tr>
    `).join('');
    
    tbody.innerHTML = html;
}

// Carregar clientes
function loadClientes() {
    const tbody = document.querySelector('#clientes-table tbody');
    
    if (dashboardData.clientes.length === 0) {
        tbody.innerHTML = '<tr class="no-data-row"><td colspan="6">Nenhum cliente encontrado</td></tr>';
        return;
    }
    
    const html = dashboardData.clientes.map(cliente => `
        <tr>
            <td>${cliente.nome}</td>
            <td>${cliente.email}</td>
            <td>${cliente.telefone}</td>
            <td>${cliente.animais}</td>
            <td>${formatDate(cliente.cadastro)}</td>
            <td>
                <div class="action-buttons">
                    <button class="btn btn-sm btn-primary" onclick="editCliente(${cliente.id})">
                        <i class="fas fa-edit"></i>
                    </button>
                    ${hasPermission('delete') ? `
                        <button class="btn btn-sm btn-secondary" onclick="deleteCliente(${cliente.id})">
                            <i class="fas fa-trash"></i>
                        </button>
                    ` : ''}
                </div>
            </td>
        </tr>
    `).join('');
    
    tbody.innerHTML = html;
}

// Carregar animais
function loadAnimais() {
    const tbody = document.querySelector('#animais-table tbody');
    
    if (dashboardData.animais.length === 0) {
        tbody.innerHTML = '<tr class="no-data-row"><td colspan="6">Nenhum animal encontrado</td></tr>';
        return;
    }
    
    const html = dashboardData.animais.map(animal => {
        const idade = calculateAge(animal.nascimento);
        return `
            <tr>
                <td>${animal.nome}</td>
                <td>${animal.tipo}</td>
                <td>${animal.raca}</td>
                <td>${idade}</td>
                <td>${animal.tutor}</td>
                <td>
                    <div class="action-buttons">
                        <button class="btn btn-sm btn-primary" onclick="editAnimal(${animal.id})">
                            <i class="fas fa-edit"></i>
                        </button>
                        ${hasPermission('delete') ? `
                            <button class="btn btn-sm btn-secondary" onclick="deleteAnimal(${animal.id})">
                                <i class="fas fa-trash"></i>
                            </button>
                        ` : ''}
                    </div>
                </td>
            </tr>
        `;
    }).join('');
    
    tbody.innerHTML = html;
}

// Carregar contatos
function loadContatos() {
    const tbody = document.querySelector('#contatos-table tbody');
    
    if (dashboardData.contatos.length === 0) {
        tbody.innerHTML = '<tr class="no-data-row"><td colspan="7">Nenhuma mensagem encontrada</td></tr>';
        return;
    }
    
    const html = dashboardData.contatos.map(contato => `
        <tr>
            <td>${formatDate(contato.timestamp)}</td>
            <td>${contato.nome}</td>
            <td>${contato.email}</td>
            <td>${contato.telefone}</td>
            <td>${contato.servico || 'Não informado'}</td>
            <td><span class="status-badge status-${contato.status.toLowerCase()}">${contato.status}</span></td>
            <td>
                <div class="action-buttons">
                    <button class="btn btn-sm btn-primary" onclick="viewContato(${contato.id})">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="btn btn-sm btn-primary" onclick="markAsRead(${contato.id})">
                        <i class="fas fa-check"></i>
                    </button>
                    ${hasPermission('delete') ? `
                        <button class="btn btn-sm btn-secondary" onclick="deleteContato(${contato.id})">
                            <i class="fas fa-trash"></i>
                        </button>
                    ` : ''}
                </div>
            </td>
        </tr>
    `).join('');
    
    tbody.innerHTML = html;
}

// Configurar modais
function setupModals() {
    // Configurar formulários
    setupAgendamentoForm();
    setupClienteForm();
    setupAnimalForm();
    
    // Fechar modal ao clicar fora
    document.querySelectorAll('.modal').forEach(modal => {
        modal.addEventListener('click', function(e) {
            if (e.target === this) {
                closeModal(this.id);
            }
        });
    });
}

// Configurar formulário de agendamento
function setupAgendamentoForm() {
    const form = document.getElementById('agendamento-form');
    const clienteSelect = document.getElementById('agend-cliente');
    const animalSelect = document.getElementById('agend-animal');
    
    // Popular select de clientes
    function populateClientes() {
        clienteSelect.innerHTML = '<option value="">Selecione um cliente</option>';
        dashboardData.clientes.forEach(cliente => {
            clienteSelect.innerHTML += `<option value="${cliente.id}">${cliente.nome}</option>`;
        });
    }
    
    // Atualizar animais baseado no cliente selecionado
    clienteSelect.addEventListener('change', function() {
        const clienteId = parseInt(this.value);
        animalSelect.innerHTML = '<option value="">Selecione um animal</option>';
        
        if (clienteId) {
            const animaisDoCliente = dashboardData.animais.filter(animal => animal.tutorId === clienteId);
            animaisDoCliente.forEach(animal => {
                animalSelect.innerHTML += `<option value="${animal.id}">${animal.nome}</option>`;
            });
        }
    });
    
    // Submit do formulário
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        if (!hasPermission('write')) {
            alert('Você não tem permissão para criar agendamentos.');
            return;
        }
        
        const formData = new FormData(form);
        const cliente = dashboardData.clientes.find(c => c.id === parseInt(formData.get('cliente')));
        const animal = dashboardData.animais.find(a => a.id === parseInt(formData.get('animal')));
        
        const novoAgendamento = {
            id: Date.now(),
            data: formData.get('data'),
            hora: formData.get('hora'),
            cliente: cliente.nome,
            animal: animal.nome,
            servico: formData.get('servico'),
            status: 'Confirmado',
            observacoes: formData.get('observacoes')
        };
        
        dashboardData.agendamentos.push(novoAgendamento);
        
        // Atualizar interface
        loadAgendamentos();
        updateBadges();
        closeModal('agendamento-modal');
        form.reset();
        
        showNotification('Agendamento criado com sucesso!', 'success');
    });
    
    populateClientes();
}

// Configurar formulário de cliente
// Configurar formulário de cliente (versão completa)
function setupClienteForm() {
    const form = document.getElementById('cliente-form');
    const cepInput = document.getElementById('cliente-cep');
    const cpfInput = document.getElementById('cliente-cpf');
    const telefoneInput = document.getElementById('cliente-telefone');
    const telefone2Input = document.getElementById('cliente-telefone2');
    const searchInput = document.getElementById('cliente-search');

    // Máscara para CPF
    if (cpfInput) {
        cpfInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            value = value.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
            e.target.value = value;
        });
    }

    // Máscara para telefone
    function applyPhoneMask(input) {
        input.addEventListener('input', function(e) {
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

    if (telefoneInput) applyPhoneMask(telefoneInput);
    if (telefone2Input) applyPhoneMask(telefone2Input);

    // Máscara para CEP e busca automática
    if (cepInput) {
        cepInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            value = value.replace(/(\d{5})(\d{3})/, '$1-$2');
            e.target.value = value;
        });

        cepInput.addEventListener('blur', function() {
            const cep = this.value.replace(/\D/g, '');
            if (cep.length === 8) {
                buscarCEP(cep);
            }
        });
    }

    // Busca de clientes
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase();
            filterClientes(searchTerm);
        });
    }

    // Submit do formulário
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        if (!hasPermission('write')) {
            showNotification('Você não tem permissão para criar/editar clientes.', 'error');
            return;
        }

        const formData = new FormData(form);
        const clienteId = formData.get('id');
        
        // Validar campos obrigatórios
        if (!formData.get('nome') || !formData.get('email') || !formData.get('telefone')) {
            showNotification('Preencha todos os campos obrigatórios.', 'error');
            return;
        }

        // Validar email único
        const emailExistente = dashboardData.clientes.find(c => 
            c.email === formData.get('email') && c.id != clienteId
        );
        
        if (emailExistente) {
            showNotification('Este e-mail já está cadastrado.', 'error');
            return;
        }

        if (clienteId) {
            // Editar cliente existente
            editarCliente(clienteId, formData);
        } else {
            // Criar novo cliente
            criarCliente(formData);
        }
    });
}

// Função para criar novo cliente
function criarCliente(formData) {
    const novoCliente = {
        id: Date.now(),
        nome: formData.get('nome'),
        cpf: formData.get('cpf'),
        email: formData.get('email'),
        telefone: formData.get('telefone'),
        telefone2: formData.get('telefone2'),
        nascimento: formData.get('nascimento'),
        profissao: formData.get('profissao'),
        endereco: formData.get('endereco'),
        bairro: formData.get('bairro'),
        cidade: formData.get('cidade'),
        estado: formData.get('estado'),
        cep: formData.get('cep'),
        como_conheceu: formData.get('como_conheceu'),
        status: formData.get('status') || 'ativo',
        observacoes: formData.get('observacoes'),
        cadastro: new Date().toISOString().split('T')[0],
        animais: 0,
        ultima_consulta: null
    };

    dashboardData.clientes.push(novoCliente);
    
    // Salvar no localStorage
    localStorage.setItem('nutripet_clientes', JSON.stringify(dashboardData.clientes));
    
    // Atualizar interface
    loadClientes();
    updateBadges();
    closeModal('cliente-modal');
    document.getElementById('cliente-form').reset();
    
    showNotification('Cliente cadastrado com sucesso!', 'success');
}

// Função para editar cliente
function editarCliente(clienteId, formData) {
    const index = dashboardData.clientes.findIndex(c => c.id == clienteId);
    
    if (index !== -1) {
        const cliente = dashboardData.clientes[index];
        
        // Atualizar dados
        cliente.nome = formData.get('nome');
        cliente.cpf = formData.get('cpf');
        cliente.email = formData.get('email');
        cliente.telefone = formData.get('telefone');
        cliente.telefone2 = formData.get('telefone2');
        cliente.nascimento = formData.get('nascimento');
        cliente.profissao = formData.get('profissao');
        cliente.endereco = formData.get('endereco');
        cliente.bairro = formData.get('bairro');
        cliente.cidade = formData.get('cidade');
        cliente.estado = formData.get('estado');
        cliente.cep = formData.get('cep');
        cliente.como_conheceu = formData.get('como_conheceu');
        cliente.status = formData.get('status');
        cliente.observacoes = formData.get('observacoes');
        
        // Salvar no localStorage
        localStorage.setItem('nutripet_clientes', JSON.stringify(dashboardData.clientes));
        
        // Atualizar interface
        loadClientes();
        closeModal('cliente-modal');
        document.getElementById('cliente-form').reset();
        
        showNotification('Cliente atualizado com sucesso!', 'success');
    }
}

// Função para abrir modal de cliente
function openClienteModal(clienteId = null) {
    const modal = document.getElementById('cliente-modal');
    const form = document.getElementById('cliente-form');
    const title = document.getElementById('cliente-modal-title');
    const btnText = document.getElementById('cliente-btn-text');
    
    // Resetar formulário
    form.reset();
    
    if (clienteId) {
        // Modo edição
        const cliente = dashboardData.clientes.find(c => c.id === clienteId);
        if (cliente) {
            title.textContent = 'Editar Cliente';
            btnText.textContent = 'Atualizar Cliente';
            
            // Preencher formulário
            document.getElementById('cliente-id').value = cliente.id;
            document.getElementById('cliente-nome').value = cliente.nome || '';
            document.getElementById('cliente-cpf').value = cliente.cpf || '';
            document.getElementById('cliente-email').value = cliente.email || '';
            document.getElementById('cliente-telefone').value = cliente.telefone || '';
            document.getElementById('cliente-telefone2').value = cliente.telefone2 || '';
            document.getElementById('cliente-nascimento').value = cliente.nascimento || '';
            document.getElementById('cliente-profissao').value = cliente.profissao || '';
            document.getElementById('cliente-endereco').value = cliente.endereco || '';
            document.getElementById('cliente-bairro').value = cliente.bairro || '';
            document.getElementById('cliente-cidade').value = cliente.cidade || '';
            document.getElementById('cliente-estado').value = cliente.estado || '';
            document.getElementById('cliente-cep').value = cliente.cep || '';
            document.getElementById('cliente-como-conheceu').value = cliente.como_conheceu || '';
            document.getElementById('cliente-status').value = cliente.status || 'ativo';
            document.getElementById('cliente-observacoes').value = cliente.observacoes || '';
        }
    } else {
        // Modo criação
        title.textContent = 'Novo Cliente';
        btnText.textContent = 'Salvar Cliente';
        document.getElementById('cliente-status').value = 'ativo';
    }
    
    openModal('cliente-modal');
}

// Função para buscar CEP
function buscarCEP(cep) {
    fetch(`https://viacep.com.br/ws/${cep}/json/`)
        .then(response => response.json())
        .then(data => {
            if (!data.erro) {
                document.getElementById('cliente-endereco').value = data.logradouro || '';
                document.getElementById('cliente-bairro').value = data.bairro || '';
                document.getElementById('cliente-cidade').value = data.localidade || '';
                document.getElementById('cliente-estado').value = data.uf || '';
            }
        })
        .catch(error => {
            console.log('Erro ao buscar CEP:', error);
        });
}

// Função para filtrar clientes
function filterClientes(searchTerm) {
    const rows = document.querySelectorAll('#clientes-table tbody tr:not(.no-data-row)');
    
    rows.forEach(row => {
        const text = row.textContent.toLowerCase();
        if (text.includes(searchTerm)) {
            row.style.display = '';
        } else {
            row.style.display = 'none';
        }
    });
}

// Atualizar função loadClientes
function loadClientes() {
    const tbody = document.querySelector('#clientes-table tbody');
    
    if (dashboardData.clientes.length === 0) {
        tbody.innerHTML = '<tr class="no-data-row"><td colspan="8">Nenhum cliente encontrado</td></tr>';
        return;
    }
    
    const html = dashboardData.clientes.map(cliente => `
        <tr>
            <td>
                <div class="client-info">
                    <strong>${cliente.nome}</strong>
                    ${cliente.cpf ? `<small>CPF: ${cliente.cpf}</small>` : ''}
                </div>
            </td>
            <td>${cliente.email}</td>
            <td>
                <div class="phone-info">
                    ${cliente.telefone}
                    ${cliente.telefone2 ? `<small>${cliente.telefone2}</small>` : ''}
                </div>
            </td>
            <td>${cliente.cidade || 'N/A'}</td>
            <td>${cliente.animais}</td>
            <td><span class="status-badge status-${cliente.status}">${cliente.status}</span></td>
            <td>${formatDate(cliente.cadastro)}</td>
            <td>
                <div class="action-buttons">
                    <button class="btn btn-sm btn-primary" onclick="openClienteModal(${cliente.id})" title="Editar">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-sm btn-secondary" onclick="viewCliente(${cliente.id})" title="Visualizar">
                        <i class="fas fa-eye"></i>
                    </button>
                    ${hasPermission('delete') ? `
                        <button class="btn btn-sm btn-danger" onclick="deleteCliente(${cliente.id})" title="Excluir">
                            <i class="fas fa-trash"></i>
                        </button>
                    ` : ''}
                </div>
            </td>
        </tr>
    `).join('');
    
    tbody.innerHTML = html;
}

// Função para visualizar cliente
function viewCliente(id) {
    const cliente = dashboardData.clientes.find(c => c.id === id);
    if (cliente) {
        const animaisDoCliente = dashboardData.animais.filter(a => a.tutorId === id);
        
        alert(`
INFORMAÇÕES DO CLIENTE

Nome: ${cliente.nome}
CPF: ${cliente.cpf || 'Não informado'}
Email: ${cliente.email}
Telefone: ${cliente.telefone}
${cliente.telefone2 ? `Telefone 2: ${cliente.telefone2}` : ''}

Endereço: ${cliente.endereco || 'Não informado'}
Bairro: ${cliente.bairro || 'Não informado'}
Cidade: ${cliente.cidade || 'Não informado'}
Estado: ${cliente.estado || 'Não informado'}
CEP: ${cliente.cep || 'Não informado'}

Profissão: ${cliente.profissao || 'Não informado'}
Como conheceu: ${cliente.como_conheceu || 'Não informado'}
Status: ${cliente.status}

Animais cadastrados: ${animaisDoCliente.length}
${animaisDoCliente.map(a => `- ${a.nome} (${a.tipo})`).join('\n')}

Observações: ${cliente.observacoes || 'Nenhuma observação'}

Cadastrado em: ${formatDate(cliente.cadastro)}
        `);
    }
}

// Inicializar dados de clientes do localStorage
function initializeClientesData() {
    const savedClientes = localStorage.getItem('nutripet_clientes');
    if (savedClientes) {
        dashboardData.clientes = JSON.parse(savedClientes);
    }
}
// Configurar formulário de animal
function setupAnimalForm() {
    const form = document.getElementById('animal-form');
    const tutorSelect = document.getElementById('animal-tutor');
    
    // Popular select de tutores
    function populateTutores() {
        tutorSelect.innerHTML = '<option value="">Selecione um cliente</option>';
        dashboardData.clientes.forEach(cliente => {
            tutorSelect.innerHTML += `<option value="${cliente.id}">${cliente.nome}</option>`;
        });
    }
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        if (!hasPermission('write')) {
            alert('Você não tem permissão para cadastrar animais.');
            return;
        }
        
        const formData = new FormData(form);
        const tutor = dashboardData.clientes.find(c => c.id === parseInt(formData.get('tutor')));
        
        const novoAnimal = {
            id: Date.now(),
            nome: formData.get('nome'),
            tipo: formData.get('tipo'),
            raca: formData.get('raca'),
            nascimento: formData.get('nascimento'),
            peso: parseFloat(formData.get('peso')),
            tutor: tutor.nome,
            tutorId: tutor.id,
            observacoes: formData.get('observacoes')
        };
        
        dashboardData.animais.push(novoAnimal);
        
        // Atualizar contagem de animais do cliente
        tutor.animais++;
        
        // Atualizar interface
        loadAnimais();
        loadClientes();
        updateBadges();
        closeModal('animal-modal');
        form.reset();
        
        showNotification('Animal cadastrado com sucesso!', 'success');
    });
    
    populateTutores();
}

// Configurar permissões
function setupPermissions() {
    const user = getCurrentUser();
    if (!user) return;
    
    // Esconder elementos baseado nas permissões
    if (!hasPermission('write')) {
        document.querySelectorAll('.write-only').forEach(el => {
            el.style.display = 'none';
        });
    }
    
    if (user.role !== 'admin') {
        document.querySelectorAll('.admin-only').forEach(el => {
            el.style.display = 'none';
        });
    }
}

// Funções de ação
function editAgendamento(id) {
    if (!hasPermission('write')) {
        alert('Você não tem permissão para editar agendamentos.');
        return;
    }
    // Implementar edição
    console.log('Editar agendamento:', id);
}

function deleteAgendamento(id) {
    if (!hasPermission('delete')) {
        alert('Você não tem permissão para excluir agendamentos.');
        return;
    }
    
    if (confirm('Tem certeza que deseja excluir este agendamento?')) {
        dashboardData.agendamentos = dashboardData.agendamentos.filter(a => a.id !== id);
        loadAgendamentos();
        updateBadges();
        showNotification('Agendamento excluído com sucesso!', 'success');
    }
}

function editCliente(id) {
    if (!hasPermission('write')) {
        alert('Você não tem permissão para editar clientes.');
        return;
    }
    console.log('Editar cliente:', id);
}

function deleteCliente(id) {
    if (!hasPermission('delete')) {
        alert('Você não tem permissão para excluir clientes.');
        return;
    }
    
    if (confirm('Tem certeza que deseja excluir este cliente?')) {
        dashboardData.clientes = dashboardData.clientes.filter(c => c.id !== id);
        loadClientes();
        updateBadges();
        showNotification('Cliente excluído com sucesso!', 'success');
    }
}

function editAnimal(id) {
    if (!hasPermission('write')) {
        alert('Você não tem permissão para editar animais.');
        return;
    }
    console.log('Editar animal:', id);
}

function deleteAnimal(id) {
    if (!hasPermission('delete')) {
        alert('Você não tem permissão para excluir animais.');
        return;
    }
    
    if (confirm('Tem certeza que deseja excluir este animal?')) {
        dashboardData.animais = dashboardData.animais.filter(a => a.id !== id);
        loadAnimais();
        updateBadges();
        showNotification('Animal excluído com sucesso!', 'success');
    }
}

function viewContato(id) {
    const contato = dashboardData.contatos.find(c => c.id === id);
    if (contato) {
        alert(`
Contato de: ${contato.nome}
Email: ${contato.email}
Telefone: ${contato.telefone}
Pet: ${contato.pet_nome || 'Não informado'}
Serviço: ${contato.servico || 'Não informado'}

Mensagem:
${contato.mensagem}

Data: ${formatDate(contato.timestamp)}
        `);
    }
}

function markAsRead(id) {
    const contato = dashboardData.contatos.find(c => c.id === id);
    if (contato) {
        contato.status = 'Lido';
        
        // Atualizar localStorage
        const savedContacts = JSON.parse(localStorage.getItem('nutripet_contacts') || '[]');
        const index = savedContacts.findIndex(c => c.timestamp === contato.timestamp);
        if (index !== -1) {
            savedContacts[index].status = 'Lido';
            localStorage.setItem('nutripet_contacts', JSON.stringify(savedContacts));
        }
        
        loadContatos();
        updateBadges();
        showNotification('Mensagem marcada como lida!', 'success');
    }
}

function deleteContato(id) {
    if (!hasPermission('delete')) {
        alert('Você não tem permissão para excluir contatos.');
        return;
    }
    
    if (confirm('Tem certeza que deseja excluir este contato?')) {
        const contato = dashboardData.contatos.find(c => c.id === id);
        dashboardData.contatos = dashboardData.contatos.filter(c => c.id !== id);
        
        // Atualizar localStorage
        const savedContacts = JSON.parse(localStorage.getItem('nutripet_contacts') || '[]');
        const updatedContacts = savedContacts.filter(c => c.timestamp !== contato.timestamp);
        localStorage.setItem('nutripet_contacts', JSON.stringify(updatedContacts));
        
        loadContatos();
        updateBadges();
        showNotification('Contato excluído com sucesso!', 'success');
    }
}

// Funções de modal
function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = 'auto';
    }
}

// Funções utilitárias
function formatDate(dateString) {
    if (!dateString) return 'N/A';
    
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
}

function calculateAge(birthDate) {
    if (!birthDate) return 'N/A';
    
    const today = new Date();
    const birth = new Date(birthDate);
    const ageInMilliseconds = today - birth;
    const ageInYears = Math.floor(ageInMilliseconds / (1000 * 60 * 60 * 24 * 365));
    
    if (ageInYears === 0) {
        const ageInMonths = Math.floor(ageInMilliseconds / (1000 * 60 * 60 * 24 * 30));
        return `${ageInMonths} meses`;
    }
    
    return `${ageInYears} anos`;
}

function showNotification(message, type = 'info') {
    // Criar notificação
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check' : 'info'}-circle"></i>
        <span>${message}</span>
    `;
    
    // Adicionar ao body
    document.body.appendChild(notification);
    
    // Mostrar com animação
    setTimeout(() => {
        notification.classList.add('show');
    }, 100);
    
    // Remover após 3 segundos
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Exportar contatos
function exportContacts() {
    const contacts = dashboardData.contatos;
    const dataStr = JSON.stringify(contacts, null, 2);
    const dataBlob = new Blob([dataStr], {type: 'application/json'});
    
    const link = document.createElement('a');
    link.href = URL.createObjectURL(dataBlob);
    link.download = `nutripet_contatos_${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    
    showNotification('Contatos exportados com sucesso!', 'success');
}