document.addEventListener('DOMContentLoaded', function () {
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


// Adicione após as variáveis existentes
let currentCalendarDate = new Date();
let usuarios = [
    {
        id: 1,
        nome: 'Administrador',
        email: 'admin@NaturaVet.com',
        senha: 'admin123',
        tipo: 'admin',
        status: 'ativo',
        cadastro: new Date().toISOString().split('T')[0]
    }

];
// Variáveis globais

// ===== FUNÇÕES DE INICIALIZAÇÃO =====

// Inicializar dashboard
function initializeDashboard() {
    console.log('Iniciando dashboard...');
    
    // Carregar contatos do localStorage
    const savedContacts = JSON.parse(localStorage.getItem('NaturaVet_contacts') || '[]');
    dashboardData.contatos = savedContacts.map((contact, index) => ({
        id: index + 1,
        ...contact,
        status: contact.status || 'Pendente'
    }));

    // Carregar dados do localStorage
      initializeClientesData();
    initializeAgendamentosData();
    initializeAnimaisData();
    initializeUsuariosData(); // IMPORTANTE: Esta linha deve estar aqui

    console.log('Dashboard inicializado com todos os dados');
}
   
// Inicializar dados de clientes do localStorage
function initializeClientesData() {
    const savedClientes = localStorage.getItem('NaturaVet_clientes');
    if (savedClientes) {
        dashboardData.clientes = JSON.parse(savedClientes);
    }
}

// Inicializar dados de agendamentos do localStorage
function initializeAgendamentosData() {
    const savedAgendamentos = localStorage.getItem('NaturaVet_agendamentos');
    if (savedAgendamentos) {
        dashboardData.agendamentos = JSON.parse(savedAgendamentos);
    }
}

// Inicializar dados de animais do localStorage
function initializeAnimaisData() {
    const savedAnimais = localStorage.getItem('NaturaVet_animais');
    if (savedAnimais) {
        dashboardData.animais = JSON.parse(savedAnimais);
    }
}

// ===== FUNÇÕES DE INTERFACE =====

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
        link.addEventListener('click', function (e) {
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
        switch (sectionName) {
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

// ===== FUNÇÕES DE DASHBOARD =====

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

// ===== FUNÇÕES DE CARREGAMENTO DE TABELAS =====

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
                    ${hasPermission('write') ? `
                        <button class="btn btn-sm btn-primary" onclick="editAgendamento(${agendamento.id})" title="Editar">
                            <i class="fas fa-edit"></i>
                        </button>
                    ` : ''}
                    ${hasPermission('delete') ? `
                        <button class="btn btn-sm btn-danger" onclick="deleteAgendamento(${agendamento.id})" title="Excluir">
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
            <td><span class="status-badge status-${cliente.status || 'ativo'}">${cliente.status || 'ativo'}</span></td>
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
                <td>${animal.raca || 'N/A'}</td>
                <td>${idade}</td>
                <td>${animal.tutor}</td>
                <td>
                    <div class="action-buttons">
                        ${hasPermission('write') ? `
                            <button class="btn btn-sm btn-primary" onclick="editAnimal(${animal.id})" title="Editar">
                                <i class="fas fa-edit"></i>
                            </button>
                        ` : ''}
                        ${hasPermission('delete') ? `
                            <button class="btn btn-sm btn-danger" onclick="deleteAnimal(${animal.id})" title="Excluir">
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
                        <button class="btn btn-sm btn-danger" onclick="deleteContato(${contato.id})">
                            <i class="fas fa-trash"></i>
                        </button>
                    ` : ''}
                </div>
            </td>
        </tr>
    `).join('');

    tbody.innerHTML = html;
}

// ===== CONFIGURAÇÃO DE MODAIS =====

// Configurar modais
function setupModals() {
    // Configurar formulários
    setupAgendamentoForm();
    setupClienteForm();
    setupAnimalForm();

    // Fechar modal ao clicar fora
    document.querySelectorAll('.modal').forEach(modal => {
        modal.addEventListener('click', function (e) {
            if (e.target === this) {
                closeModal(this.id);
            }
        });
    });
}

// Configurar formulário de agendamento
function setupAgendamentoForm() {
    const form = document.getElementById('agendamento-form');
    if (!form) return;

    const clienteSelect = document.getElementById('agend-cliente');
    const animalSelect = document.getElementById('agend-animal');

    // Atualizar animais baseado no cliente selecionado
    if (clienteSelect && animalSelect) {
        clienteSelect.addEventListener('change', function () {
            const clienteId = parseInt(this.value);
            animalSelect.innerHTML = '<option value="">Selecione um animal</option>';

            if (clienteId) {
                const animaisDoCliente = dashboardData.animais.filter(animal => animal.tutorId === clienteId);
                animaisDoCliente.forEach(animal => {
                    animalSelect.innerHTML += `<option value="${animal.id}">${animal.nome}</option>`;
                });
            }
        });
    }

    // Submit do formulário
    form.addEventListener('submit', function (e) {
        e.preventDefault();

        if (!hasPermission('write')) {
            showNotification('Você não tem permissão para criar/editar agendamentos.', 'error');
            return;
        }

        const formData = new FormData(form);

        // Validação
        if (!formData.get('cliente') || !formData.get('animal') || !formData.get('data') ||
            !formData.get('hora') || !formData.get('servico')) {
            showNotification('Preencha todos os campos obrigatórios.', 'error');
            return;
        }

        salvarAgendamento(formData);
    });
}

// Configurar formulário de cliente
function setupClienteForm() {
    const form = document.getElementById('cliente-form');
    if (!form) return;

    const cepInput = document.getElementById('cliente-cep');
    const cpfInput = document.getElementById('cliente-cpf');
    const telefoneInput = document.getElementById('cliente-telefone');
    const telefone2Input = document.getElementById('cliente-telefone2');
    const searchInput = document.getElementById('cliente-search');

    // Máscara para CPF
    if (cpfInput) {
        cpfInput.addEventListener('input', function (e) {
            let value = e.target.value.replace(/\D/g, '');
            value = value.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
            e.target.value = value;
        });
    }

    // Máscara para telefone
    function applyPhoneMask(input) {
        if (!input) return;
        input.addEventListener('input', function (e) {
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

    applyPhoneMask(telefoneInput);
    applyPhoneMask(telefone2Input);

    // Máscara para CEP e busca automática
    if (cepInput) {
        cepInput.addEventListener('input', function (e) {
            let value = e.target.value.replace(/\D/g, '');
            value = value.replace(/(\d{5})(\d{3})/, '$1-$2');
            e.target.value = value;
        });

        cepInput.addEventListener('blur', function () {
            const cep = this.value.replace(/\D/g, '');
            if (cep.length === 8) {
                buscarCEP(cep);
            }
        });
    }

    // Busca de clientes
    if (searchInput) {
        searchInput.addEventListener('input', function () {
            const searchTerm = this.value.toLowerCase();
            filterClientes(searchTerm);
        });
    }

    // Submit do formulário
    form.addEventListener('submit', function (e) {
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
            editarCliente(clienteId, formData);
        } else {
            criarCliente(formData);
        }
    });
}

// Configurar formulário de animal
function setupAnimalForm() {
    const form = document.getElementById('animal-form');
    if (!form) return;

    form.addEventListener('submit', function (e) {
        e.preventDefault();

        if (!hasPermission('write')) {
            showNotification('Você não tem permissão para criar/editar animais.', 'error');
            return;
        }

        const formData = new FormData(form);

        // Validação
        if (!formData.get('nome') || !formData.get('tutor') || !formData.get('tipo')) {
            showNotification('Preencha todos os campos obrigatórios.', 'error');
            return;
        }

        salvarAnimal(formData);
    });
}

// ===== FUNÇÕES DE AGENDAMENTO =====

// Função para abrir modal de agendamento
function openAgendamentoModal(agendamentoId = null) {
    const modal = document.getElementById('agendamento-modal');
    const form = document.getElementById('agendamento-form');
    const title = modal.querySelector('.modal-header h2');
    const submitBtn = form.querySelector('button[type="submit"]');

    // Resetar formulário
    form.reset();

    // Popular selects
    populateClientesSelect();

    if (agendamentoId) {
        // Modo edição
        const agendamento = dashboardData.agendamentos.find(a => a.id === agendamentoId);
        if (agendamento) {
            title.textContent = 'Editar Agendamento';
            submitBtn.innerHTML = '<i class="fas fa-save"></i> Atualizar Agendamento';

            // Adicionar campo hidden se não existir
            let hiddenId = document.getElementById('agend-id');
            if (!hiddenId) {
                hiddenId = document.createElement('input');
                hiddenId.type = 'hidden';
                hiddenId.id = 'agend-id';
                hiddenId.name = 'id';
                form.insertBefore(hiddenId, form.firstChild);
            }
            hiddenId.value = agendamento.id;

            // Encontrar cliente e animal pelos nomes
            const cliente = dashboardData.clientes.find(c => c.nome === agendamento.cliente);
            const animal = dashboardData.animais.find(a => a.nome === agendamento.animal);

            if (cliente) {
                document.getElementById('agend-cliente').value = cliente.id;
                // Trigger change para popular animais
                const event = new Event('change');
                document.getElementById('agend-cliente').dispatchEvent(event);

                setTimeout(() => {
                    if (animal) {
                        document.getElementById('agend-animal').value = animal.id;
                    }
                }, 100);
            }

            document.getElementById('agend-data').value = agendamento.data;
            document.getElementById('agend-hora').value = agendamento.hora;
            document.getElementById('agend-servico').value = agendamento.servico;
            document.getElementById('agend-observacoes').value = agendamento.observacoes || '';
        }
    } else {
        // Modo criação
        title.textContent = 'Novo Agendamento';
        submitBtn.innerHTML = '<i class="fas fa-save"></i> Salvar Agendamento';
    }

    openModal('agendamento-modal');
}

// Popular select de clientes
function populateClientesSelect() {
    const clienteSelect = document.getElementById('agend-cliente');
    if (!clienteSelect) return;

    clienteSelect.innerHTML = '<option value="">Selecione um cliente</option>';
    dashboardData.clientes.forEach(cliente => {
        clienteSelect.innerHTML += `<option value="${cliente.id}">${cliente.nome}</option>`;
    });
}

// Editar agendamento
function editAgendamento(id) {
    if (!hasPermission('write')) {
        showNotification('Você não tem permissão para editar agendamentos.', 'error');
        return;
    }
    openAgendamentoModal(id);
}

// Salvar agendamento
function salvarAgendamento(formData) {
    const agendamentoId = formData.get('id');
    const cliente = dashboardData.clientes.find(c => c.id === parseInt(formData.get('cliente')));
    const animal = dashboardData.animais.find(a => a.id === parseInt(formData.get('animal')));

    if (!cliente || !animal) {
        showNotification('Cliente ou animal não encontrado.', 'error');
        return;
    }

    const agendamentoData = {
        data: formData.get('data'),
        hora: formData.get('hora'),
        cliente: cliente.nome,
        animal: animal.nome,
        servico: formData.get('servico'),
        status: 'Confirmado',
        observacoes: formData.get('observacoes')
    };

    if (agendamentoId) {
        // Editar existente
        const index = dashboardData.agendamentos.findIndex(a => a.id == agendamentoId);
        if (index !== -1) {
            dashboardData.agendamentos[index] = {
                ...dashboardData.agendamentos[index],
                ...agendamentoData
            };
            showNotification('Agendamento atualizado com sucesso!', 'success');
        }
    } else {
        // Criar novo
        const novoAgendamento = {
            id: Date.now(),
            ...agendamentoData
        };
        dashboardData.agendamentos.push(novoAgendamento);
        showNotification('Agendamento criado com sucesso!', 'success');
    }

    // Salvar no localStorage
    localStorage.setItem('NaturaVet_agendamentos', JSON.stringify(dashboardData.agendamentos));

    // Atualizar interface
    loadAgendamentos();
    updateBadges();
    closeModal('agendamento-modal');
    document.getElementById('agendamento-form').reset();
}

// ===== FUNÇÕES DE CLIENTE =====

// Criar novo cliente
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
    localStorage.setItem('NaturaVet_clientes', JSON.stringify(dashboardData.clientes));

    // Atualizar interface
    loadClientes();
    updateBadges();
    closeModal('cliente-modal');
    document.getElementById('cliente-form').reset();

    showNotification('Cliente cadastrado com sucesso!', 'success');
}

// Editar cliente
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
        localStorage.setItem('NaturaVet_clientes', JSON.stringify(dashboardData.clientes));

        // Atualizar interface
        loadClientes();
        closeModal('cliente-modal');
        document.getElementById('cliente-form').reset();

        showNotification('Cliente atualizado com sucesso!', 'success');
    }
}

// Abrir modal de cliente
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

            // Adicionar campo hidden se não existir
            let hiddenId = document.getElementById('cliente-id');
            if (!hiddenId) {
                hiddenId = document.createElement('input');
                hiddenId.type = 'hidden';
                hiddenId.id = 'cliente-id';
                hiddenId.name = 'id';
                form.insertBefore(hiddenId, form.firstChild);
            }
            hiddenId.value = cliente.id;

            // Preencher formulário
            const campos = [
                'nome', 'cpf', 'email', 'telefone', 'telefone2', 'nascimento',
                'profissao', 'endereco', 'bairro', 'cidade', 'estado', 'cep',
                'como-conheceu', 'status', 'observacoes'
            ];

            campos.forEach(campo => {
                const elemento = document.getElementById(`cliente-${campo}`);
                if (elemento) {
                    const valor = cliente[campo.replace('-', '_')] || '';
                    elemento.value = valor;
                }
            });
        }
    } else {
        // Modo criação
        title.textContent = 'Novo Cliente';
        btnText.textContent = 'Salvar Cliente';
        const statusElement = document.getElementById('cliente-status');
        if (statusElement) statusElement.value = 'ativo';
    }

    openModal('cliente-modal');
}

// Visualizar cliente
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
Status: ${cliente.status || 'ativo'}

Animais cadastrados: ${animaisDoCliente.length}
${animaisDoCliente.map(a => `- ${a.nome} (${a.tipo})`).join('\n')}

Observações: ${cliente.observacoes || 'Nenhuma observação'}

Cadastrado em: ${formatDate(cliente.cadastro)}
        `);
    }
}

// Buscar CEP
function buscarCEP(cep) {
    fetch(`https://viacep.com.br/ws/${cep}/json/`)
        .then(response => response.json())
        .then(data => {
            if (!data.erro) {
                const campos = {
                    'cliente-endereco': data.logradouro || '',
                    'cliente-bairro': data.bairro || '',
                    'cliente-cidade': data.localidade || '',
                    'cliente-estado': data.uf || ''
                };

                Object.entries(campos).forEach(([id, valor]) => {
                    const elemento = document.getElementById(id);
                    if (elemento) elemento.value = valor;
                });
            }
        })
        .catch(error => {
            console.log('Erro ao buscar CEP:', error);
        });
}

// Filtrar clientes
function filterClientes(searchTerm) {
    const rows = document.querySelectorAll('#clientes-table tbody tr:not(.no-data-row)');

    rows.forEach(row => {
        const text = row.textContent.toLowerCase();
        row.style.display = text.includes(searchTerm) ? '' : 'none';
    });
}

// ===== FUNÇÕES DE ANIMAL =====

// Abrir modal de animal
function openAnimalModal(animalId = null) {
    const modal = document.getElementById('animal-modal');
    const form = document.getElementById('animal-form');
    const title = modal.querySelector('.modal-header h2');
    const submitBtn = form.querySelector('button[type="submit"]');

    // Resetar formulário
    form.reset();

    // Popular select de tutores
    populateTutoresSelect();

    if (animalId) {
        // Modo edição
        const animal = dashboardData.animais.find(a => a.id === animalId);
        if (animal) {
            title.textContent = 'Editar Animal';
            submitBtn.innerHTML = '<i class="fas fa-save"></i> Atualizar Animal';

            // Adicionar campo hidden se não existir
            let hiddenId = document.getElementById('animal-id');
            if (!hiddenId) {
                hiddenId = document.createElement('input');
                hiddenId.type = 'hidden';
                hiddenId.id = 'animal-id';
                hiddenId.name = 'id';
                form.insertBefore(hiddenId, form.firstChild);
            }
            hiddenId.value = animal.id;

            // Preencher formulário
            document.getElementById('animal-nome').value = animal.nome;
            document.getElementById('animal-tutor').value = animal.tutorId;
            document.getElementById('animal-tipo').value = animal.tipo.toLowerCase();
            document.getElementById('animal-raca').value = animal.raca || '';
            document.getElementById('animal-nascimento').value = animal.nascimento || '';
            document.getElementById('animal-peso').value = animal.peso || '';
            document.getElementById('animal-observacoes').value = animal.observacoes || '';
        }
    } else {
        // Modo criação
        title.textContent = 'Novo Animal';
        submitBtn.innerHTML = '<i class="fas fa-save"></i> Salvar Animal';
    }

    openModal('animal-modal');
}

// Popular select de tutores
function populateTutoresSelect() {
    const tutorSelect = document.getElementById('animal-tutor');
    if (!tutorSelect) return;

    tutorSelect.innerHTML = '<option value="">Selecione um cliente</option>';
    dashboardData.clientes.forEach(cliente => {
        tutorSelect.innerHTML += `<option value="${cliente.id}">${cliente.nome}</option>`;
    });
}

// Editar animal
function editAnimal(id) {
    if (!hasPermission('write')) {
        showNotification('Você não tem permissão para editar animais.', 'error');
        return;
    }
    openAnimalModal(id);
}

// Salvar animal
function salvarAnimal(formData) {
    const animalId = formData.get('id');
    const tutor = dashboardData.clientes.find(c => c.id === parseInt(formData.get('tutor')));

    if (!tutor) {
        showNotification('Tutor não encontrado.', 'error');
        return;
    }

    const animalData = {
        nome: formData.get('nome'),
        tipo: capitalizeFirst(formData.get('tipo')),
        raca: formData.get('raca'),
        nascimento: formData.get('nascimento'),
        peso: parseFloat(formData.get('peso')) || 0,
        tutor: tutor.nome,
        tutorId: tutor.id,
        observacoes: formData.get('observacoes')
    };

    if (animalId) {
        // Editar existente
        const index = dashboardData.animais.findIndex(a => a.id == animalId);
        if (index !== -1) {
            const oldTutorId = dashboardData.animais[index].tutorId;
            dashboardData.animais[index] = {
                ...dashboardData.animais[index],
                ...animalData
            };

            // Atualizar contagem de animais dos tutores se mudou
            if (oldTutorId !== tutor.id) {
                const oldTutor = dashboardData.clientes.find(c => c.id === oldTutorId);
                if (oldTutor) oldTutor.animais = Math.max(0, oldTutor.animais - 1);
                tutor.animais = (tutor.animais || 0) + 1;
            }

            showNotification('Animal atualizado com sucesso!', 'success');
        }
    } else {
        // Criar novo
        const novoAnimal = {
            id: Date.now(),
            ...animalData
        };
        dashboardData.animais.push(novoAnimal);

        // Atualizar contagem de animais do tutor
        tutor.animais = (tutor.animais || 0) + 1;

        showNotification('Animal cadastrado com sucesso!', 'success');
    }

    // Salvar no localStorage
    localStorage.setItem('NaturaVet_animais', JSON.stringify(dashboardData.animais));
    localStorage.setItem('NaturaVet_clientes', JSON.stringify(dashboardData.clientes));

    // Atualizar interface
    loadAnimais();
    loadClientes();
    updateBadges();
    closeModal('animal-modal');
    document.getElementById('animal-form').reset();
}

// ===== FUNÇÕES DE AÇÃO =====

// Deletar agendamento
function deleteAgendamento(id) {
    if (!hasPermission('delete')) {
        showNotification('Você não tem permissão para excluir agendamentos.', 'error');
        return;
    }

    if (confirm('Tem certeza que deseja excluir este agendamento?')) {
        dashboardData.agendamentos = dashboardData.agendamentos.filter(a => a.id !== id);
        localStorage.setItem('NaturaVet_agendamentos', JSON.stringify(dashboardData.agendamentos));
        loadAgendamentos();
        updateBadges();
        showNotification('Agendamento excluído com sucesso!', 'success');
    }
}

// Deletar cliente
function deleteCliente(id) {
    if (!hasPermission('delete')) {
        showNotification('Você não tem permissão para excluir clientes.', 'error');
        return;
    }

    if (confirm('Tem certeza que deseja excluir este cliente?')) {
        dashboardData.clientes = dashboardData.clientes.filter(c => c.id !== id);
        localStorage.setItem('NaturaVet_clientes', JSON.stringify(dashboardData.clientes));
        loadClientes();
        updateBadges();
        showNotification('Cliente excluído com sucesso!', 'success');
    }
}

// Deletar animal
function deleteAnimal(id) {
    if (!hasPermission('delete')) {
        showNotification('Você não tem permissão para excluir animais.', 'error');
        return;
    }

    if (confirm('Tem certeza que deseja excluir este animal?')) {
        const animal = dashboardData.animais.find(a => a.id === id);
        if (animal) {
            // Atualizar contagem do tutor
            const tutor = dashboardData.clientes.find(c => c.id === animal.tutorId);
            if (tutor) tutor.animais = Math.max(0, tutor.animais - 1);
        }

        dashboardData.animais = dashboardData.animais.filter(a => a.id !== id);
        localStorage.setItem('NaturaVet_animais', JSON.stringify(dashboardData.animais));
        localStorage.setItem('NaturaVet_clientes', JSON.stringify(dashboardData.clientes));
        loadAnimais();
        loadClientes();
        updateBadges();
        showNotification('Animal excluído com sucesso!', 'success');
    }
}

// Visualizar contato
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

// Marcar como lido
function markAsRead(id) {
    const contato = dashboardData.contatos.find(c => c.id === id);
    if (contato) {
        contato.status = 'Lido';

        // Atualizar localStorage
        const savedContacts = JSON.parse(localStorage.getItem('NaturaVet_contacts') || '[]');
        const index = savedContacts.findIndex(c => c.timestamp === contato.timestamp);
        if (index !== -1) {
            savedContacts[index].status = 'Lido';
            localStorage.setItem('NaturaVet_contacts', JSON.stringify(savedContacts));
        }

        loadContatos();
        updateBadges();
        showNotification('Mensagem marcada como lida!', 'success');
    }
}

// Deletar contato
function deleteContato(id) {
    if (!hasPermission('delete')) {
        showNotification('Você não tem permissão para excluir contatos.', 'error');
        return;
    }

    if (confirm('Tem certeza que deseja excluir este contato?')) {
        const contato = dashboardData.contatos.find(c => c.id === id);
        dashboardData.contatos = dashboardData.contatos.filter(c => c.id !== id);

        // Atualizar localStorage
        const savedContacts = JSON.parse(localStorage.getItem('NaturaVet_contacts') || '[]');
        const updatedContacts = savedContacts.filter(c => c.timestamp !== contato.timestamp);
        localStorage.setItem('NaturaVet_contacts', JSON.stringify(updatedContacts));

        loadContatos();
        updateBadges();
        showNotification('Contato excluído com sucesso!', 'success');
    }
}

// ===== FUNÇÕES DE PERMISSÃO =====

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

// ===== FUNÇÕES DE MODAL =====

// Abrir modal
function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

// Fechar modal
function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = 'auto';
    }
}

// ===== FUNÇÕES UTILITÁRIAS =====

// Formatar data
function formatDate(dateString) {
    if (!dateString) return 'N/A';

    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
}

// Calcular idade
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

// Capitalizar primeira letra
function capitalizeFirst(str) {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1);
}

// Mostrar notificação
function showNotification(message, type = 'info') {
    // Criar notificação
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check' : type === 'error' ? 'exclamation' : 'info'}-circle"></i>
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
            if (document.body.contains(notification)) {
                document.body.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

// Exportar contatos
function exportContacts() {
    const contacts = dashboardData.contatos;
    const dataStr = JSON.stringify(contacts, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });

    const link = document.createElement('a');
    link.href = URL.createObjectURL(dataBlob);
    link.download = `NaturaVet_contatos_${new Date().toISOString().split('T')[0]}.json`;
    link.click();

    showNotification('Contatos exportados com sucesso!', 'success');
}

// ===== FUNÇÕES PARA MOBILE =====

// Toggle da sidebar no mobile
function toggleSidebar() {
    const sidebar = document.querySelector('.dashboard-sidebar');
    if (sidebar) {
        sidebar.classList.toggle('active');
    }
}

// Fechar sidebar ao clicar fora (mobile)
document.addEventListener('click', function (e) {
    const sidebar = document.querySelector('.dashboard-sidebar');
    const toggleBtn = document.querySelector('.mobile-sidebar-toggle');

    if (window.innerWidth <= 1024 &&
        sidebar && toggleBtn &&
        !sidebar.contains(e.target) &&
        !toggleBtn.contains(e.target) &&
        sidebar.classList.contains('active')) {
        sidebar.classList.remove('active');
    }
});

// ===== FUNÇÕES GLOBAIS PARA COMPATIBILIDADE =====

// Função global para abrir modal de agendamento (compatibilidade com HTML)
window.openAgendamentoModal = openAgendamentoModal;
window.openClienteModal = openClienteModal;
window.openAnimalModal = openAnimalModal;
window.editAgendamento = editAgendamento;
window.editCliente = function (id) { openClienteModal(id); };
window.editAnimal = editAnimal;
window.deleteAgendamento = deleteAgendamento;
window.deleteCliente = deleteCliente;
window.deleteAnimal = deleteAnimal;
window.viewContato = viewContato;
window.viewCliente = viewCliente;
window.markAsRead = markAsRead;
window.deleteContato = deleteContato;
window.openModal = openModal;
window.closeModal = closeModal;
window.showSection = showSection;
window.exportContacts = exportContacts;
window.toggleSidebar = toggleSidebar;

// ===== FUNÇÕES DE USUÁRIOS CORRIGIDAS =====

// Inicializar dados de usuários
function initializeUsuariosData() {
    const savedUsuarios = localStorage.getItem('nutripet_usuarios');
    if (savedUsuarios) {
        usuarios = JSON.parse(savedUsuarios);
    } else {
        // Usuários padrão
        usuarios = [
            {
                id: 1,
                nome: 'Administrador',
                email: 'admin@nutripet.com',
                senha: 'admin123',
                tipo: 'admin',
                status: 'ativo',
                cadastro: new Date().toISOString().split('T')[0]
            }
        ];
        // Salvar usuários padrão
        localStorage.setItem('nutripet_usuarios', JSON.stringify(usuarios));
    }
}

// Carregar usuários
function loadUsuarios() {
    const tbody = document.querySelector('#usuarios-table tbody');
    
    if (!tbody) {
        console.error('Tabela de usuários não encontrada');
        return;
    }
    
    if (usuarios.length === 0) {
        tbody.innerHTML = '<tr class="no-data-row"><td colspan="6">Nenhum usuário encontrado</td></tr>';
        return;
    }
    
    const html = usuarios.map(usuario => `
        <tr>
            <td>${usuario.nome}</td>
            <td>${usuario.email}</td>
            <td>${capitalizeFirst(usuario.tipo)}</td>
            <td><span class="status-badge status-${usuario.status}">${capitalizeFirst(usuario.status)}</span></td>
            <td>${formatDate(usuario.cadastro)}</td>
            <td>
                <div class="action-buttons">
                    <button class="btn btn-sm btn-primary" onclick="openUsuarioModal(${usuario.id})" title="Editar">
                        <i class="fas fa-edit"></i>
                    </button>
                    ${usuario.id !== 1 ? `
                        <button class="btn btn-sm btn-danger" onclick="deleteUsuario(${usuario.id})" title="Excluir">
                            <i class="fas fa-trash"></i>
                        </button>
                    ` : ''}
                </div>
            </td>
        </tr>
    `).join('');
    
    tbody.innerHTML = html;
}

// Configurar formulário de usuário
function setupUsuarioForm() {
    const form = document.getElementById('usuario-form');
    if (!form) {
        console.error('Formulário de usuário não encontrado');
        return;
    }
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const user = getCurrentUser();
        if (!user || user.role !== 'admin') {
            showNotification('Apenas administradores podem gerenciar usuários.', 'error');
            return;
        }
        
        const formData = new FormData(form);
        const usuarioId = formData.get('id');
        
        // Validar campos obrigatórios
        if (!formData.get('nome') || !formData.get('email') || !formData.get('tipo')) {
            showNotification('Preencha todos os campos obrigatórios.', 'error');
            return;
        }
        
        // Validar senha apenas para novos usuários ou se foi fornecida
        if (!usuarioId && !formData.get('senha')) {
            showNotification('A senha é obrigatória para novos usuários.', 'error');
            return;
        }
        
        // Validar email único
        const emailExistente = usuarios.find(u => 
            u.email === formData.get('email') && u.id != usuarioId
        );
        
        if (emailExistente) {
            showNotification('Este e-mail já está cadastrado.', 'error');
            return;
        }
        
        if (usuarioId) {
            editarUsuario(usuarioId, formData);
        } else {
            criarUsuario(formData);
        }
    });
}

// Abrir modal de usuário
function openUsuarioModal(usuarioId = null) {
    console.log('Tentando abrir modal de usuário, ID:', usuarioId);
    
    const user = getCurrentUser();
    if (!user || user.role !== 'admin') {
        showNotification('Apenas administradores podem gerenciar usuários.', 'error');
        return;
    }
    
    // Verificar se todos os elementos existem
    const modal = document.getElementById('usuario-modal');
    const form = document.getElementById('usuario-form');
    const title = document.getElementById('usuario-modal-title');
    const btnText = document.getElementById('usuario-btn-text');
    
    console.log('Verificando elementos do modal:', {
        modal: !!modal,
        form: !!form,
        title: !!title,
        btnText: !!btnText
    });
    
    if (!modal) {
        console.error('Modal usuario-modal não encontrado no DOM');
        showNotification('Erro: Modal de usuário não encontrado. Verifique o HTML.', 'error');
        return;
    }
    
    if (!form) {
        console.error('Formulário usuario-form não encontrado no DOM');
        showNotification('Erro: Formulário de usuário não encontrado. Verifique o HTML.', 'error');
        return;
    }
    
    if (!title) {
        console.error('Título usuario-modal-title não encontrado no DOM');
        showNotification('Erro: Título do modal não encontrado. Verifique o HTML.', 'error');
        return;
    }
    
    if (!btnText) {
        console.error('Botão usuario-btn-text não encontrado no DOM');
        showNotification('Erro: Botão do modal não encontrado. Verifique o HTML.', 'error');
        return;
    }
    
    // Resetar formulário
    form.reset();
    
    // Verificar e criar campo hidden se necessário
    let hiddenId = document.getElementById('usuario-id');
    if (!hiddenId) {
        console.log('Criando campo hidden para ID do usuário');
        hiddenId = document.createElement('input');
        hiddenId.type = 'hidden';
        hiddenId.id = 'usuario-id';
        hiddenId.name = 'id';
        form.insertBefore(hiddenId, form.firstChild);
    }
    hiddenId.value = '';
    
    if (usuarioId) {
        // Modo edição
        const usuario = usuarios.find(u => u.id === usuarioId);
        if (usuario) {
            console.log('Editando usuário:', usuario);
            
            title.textContent = 'Editar Usuário';
            btnText.textContent = 'Atualizar Usuário';
            
            // Preencher formulário
            hiddenId.value = usuario.id;
            
            const nomeField = document.getElementById('usuario-nome');
            const emailField = document.getElementById('usuario-email');
            const tipoField = document.getElementById('usuario-tipo');
            const statusField = document.getElementById('usuario-status');
            const senhaField = document.getElementById('usuario-senha');
            
            if (nomeField) nomeField.value = usuario.nome;
            if (emailField) emailField.value = usuario.email;
            if (tipoField) tipoField.value = usuario.tipo;
            if (statusField) statusField.value = usuario.status;
            
            // Senha não obrigatória na edição
            if (senhaField) {
                senhaField.required = false;
                senhaField.placeholder = 'Deixe em branco para manter a senha atual';
                senhaField.value = '';
            }
        }
    } else {
        // Modo criação
        console.log('Criando novo usuário');
        
        title.textContent = 'Novo Usuário';
        btnText.textContent = 'Salvar Usuário';
        
        // Valores padrão
        const statusField = document.getElementById('usuario-status');
        const senhaField = document.getElementById('usuario-senha');
        
        if (statusField) statusField.value = 'ativo';
        
        // Senha obrigatória na criação
        if (senhaField) {
            senhaField.required = true;
            senhaField.placeholder = 'Digite a senha do usuário';
        }
    }
    
    openModal('usuario-modal');
    console.log('Modal de usuário aberto com sucesso');
}
// Criar usuário
function criarUsuario(formData) {
    try {
        const novoUsuario = {
            id: Date.now(),
            nome: formData.get('nome'),
            email: formData.get('email'),
            senha: formData.get('senha'),
            tipo: formData.get('tipo'),
            status: formData.get('status') || 'ativo',
            cadastro: new Date().toISOString().split('T')[0]
        };
        
        usuarios.push(novoUsuario);
        
        // Salvar no localStorage
        localStorage.setItem('nutripet_usuarios', JSON.stringify(usuarios));
        
        // Atualizar interface
        loadUsuarios();
        closeModal('usuario-modal');
        document.getElementById('usuario-form').reset();
        
        showNotification('Usuário cadastrado com sucesso!', 'success');
        
        console.log('Usuário criado:', novoUsuario);
    } catch (error) {
        console.error('Erro ao criar usuário:', error);
        showNotification('Erro ao criar usuário. Tente novamente.', 'error');
    }
}

// Editar usuário
function editarUsuario(usuarioId, formData) {
    try {
        const index = usuarios.findIndex(u => u.id == usuarioId);
        
        if (index !== -1) {
            const usuario = usuarios[index];
            
            // Atualizar dados
            usuario.nome = formData.get('nome');
            usuario.email = formData.get('email');
            usuario.tipo = formData.get('tipo');
            usuario.status = formData.get('status');
            
            // Só atualizar senha se foi fornecida
            const novaSenha = formData.get('senha');
            if (novaSenha && novaSenha.trim() !== '') {
                usuario.senha = novaSenha;
            }
            
            // Salvar no localStorage
            localStorage.setItem('nutripet_usuarios', JSON.stringify(usuarios));
            
            // Atualizar interface
            loadUsuarios();
            closeModal('usuario-modal');
            document.getElementById('usuario-form').reset();
            
            showNotification('Usuário atualizado com sucesso!', 'success');
            
            console.log('Usuário editado:', usuario);
        } else {
            showNotification('Usuário não encontrado.', 'error');
        }
    } catch (error) {
        console.error('Erro ao editar usuário:', error);
        showNotification('Erro ao editar usuário. Tente novamente.', 'error');
    }
}

// Deletar usuário
function deleteUsuario(id) {
    const user = getCurrentUser();
    if (!user || user.role !== 'admin') {
        showNotification('Apenas administradores podem excluir usuários.', 'error');
        return;
    }
    
    if (id === 1) {
        showNotification('O usuário administrador padrão não pode ser excluído.', 'error');
        return;
    }
    
    if (confirm('Tem certeza que deseja excluir este usuário?')) {
        try {
            usuarios = usuarios.filter(u => u.id !== id);
            localStorage.setItem('nutripet_usuarios', JSON.stringify(usuarios));
            loadUsuarios();
            showNotification('Usuário excluído com sucesso!', 'success');
            
            console.log('Usuário excluído, ID:', id);
        } catch (error) {
            console.error('Erro ao excluir usuário:', error);
            showNotification('Erro ao excluir usuário. Tente novamente.', 'error');
        }
    }
}

// ===== FUNÇÕES DE VISUALIZAÇÃO DE CONTATO =====

// Visualizar contato em modal
function viewContato(id) {
    const contato = dashboardData.contatos.find(c => c.id === id);
    if (!contato) return;

    const modal = document.getElementById('view-contato-modal');
    const detailsContainer = document.getElementById('contato-details');

    detailsContainer.innerHTML = `
        <div class="contato-info">
            <div class="contato-info-row">
                <span class="contato-info-label">Nome:</span>
                <span class="contato-info-value">${contato.nome}</span>
            </div>
            <div class="contato-info-row">
                <span class="contato-info-label">E-mail:</span>
                <span class="contato-info-value">${contato.email}</span>
            </div>
            <div class="contato-info-row">
                <span class="contato-info-label">Telefone:</span>
                <span class="contato-info-value">${contato.telefone}</span>
            </div>
            <div class="contato-info-row">
                <span class="contato-info-label">Pet:</span>
                <span class="contato-info-value">${contato.pet_nome || 'Não informado'}</span>
            </div>
            <div class="contato-info-row">
                <span class="contato-info-label">Serviço:</span>
                <span class="contato-info-value">${contato.servico || 'Não informado'}</span>
            </div>
            <div class="contato-info-row">
                <span class="contato-info-label">Data:</span>
                <span class="contato-info-value">${formatDate(contato.timestamp)}</span>
            </div>
            <div class="contato-info-row">
                <span class="contato-info-label">Status:</span>
                <span class="contato-info-value">
                    <span class="status-badge status-${contato.status.toLowerCase()}">${contato.status}</span>
                </span>
            </div>
        </div>
        <div class="contato-mensagem">
            <strong>Mensagem:</strong>
            <p>${contato.mensagem}</p>
        </div>
    `;

    openModal('view-contato-modal');
}

// ===== FUNÇÕES DO CALENDÁRIO ATUALIZADAS =====

// Variável para controlar o dia selecionado
let selectedDate = null;

// Inicializar calendário
function initializeCalendar() {
    generateCalendar();
    // Selecionar o dia atual por padrão
    const today = new Date();
    selectDay(today);
}

// Gerar calendário
function generateCalendar() {
    const calendarGrid = document.getElementById('calendar-grid');
    const monthYearElement = document.getElementById('calendar-month-year');

    if (!calendarGrid || !monthYearElement) return;

    const year = currentCalendarDate.getFullYear();
    const month = currentCalendarDate.getMonth();

    // Atualizar título
    const monthNames = [
        'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
        'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
    ];
    monthYearElement.textContent = `${monthNames[month]} ${year}`;

    // Limpar grid
    calendarGrid.innerHTML = '';

    // Cabeçalho dos dias da semana
    const dayHeaders = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
    dayHeaders.forEach(day => {
        const headerElement = document.createElement('div');
        headerElement.className = 'calendar-header';
        headerElement.textContent = day;
        calendarGrid.appendChild(headerElement);
    });

    // Primeiro dia do mês e último dia do mês anterior
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());

    // Gerar 42 dias (6 semanas)
    for (let i = 0; i < 42; i++) {
        const currentDate = new Date(startDate);
        currentDate.setDate(startDate.getDate() + i);

        const dayElement = document.createElement('div');
        dayElement.className = 'calendar-day';
        dayElement.textContent = currentDate.getDate();

        // Classes para diferentes estados
        if (currentDate.getMonth() !== month) {
            dayElement.classList.add('other-month');
        }

        // Dia atual
        const today = new Date();
        if (currentDate.toDateString() === today.toDateString()) {
            dayElement.classList.add('today');
        }

        // Verificar se há agendamentos neste dia
        const dateString = currentDate.toISOString().split('T')[0];
        const dayAppointments = dashboardData.agendamentos.filter(a => a.data === dateString);

        if (dayAppointments.length > 0) {
            dayElement.classList.add('has-appointments');

            // Adicionar indicador de quantidade
            const indicator = document.createElement('div');
            indicator.className = 'appointments-indicator';
            indicator.textContent = `${dayAppointments.length}`;
            dayElement.appendChild(indicator);
        }

        // Verificar se é o dia selecionado
        if (selectedDate && currentDate.toDateString() === selectedDate.toDateString()) {
            dayElement.classList.add('selected');
        }

        // Event listener para clique
        dayElement.addEventListener('click', () => {
            selectDay(currentDate);
        });

        calendarGrid.appendChild(dayElement);
    }
}

// Selecionar um dia
function selectDay(date) {
    selectedDate = new Date(date);

    // Atualizar visual do calendário
    document.querySelectorAll('.calendar-day').forEach(day => {
        day.classList.remove('selected');
    });

    // Encontrar e marcar o dia selecionado
    const dayElements = document.querySelectorAll('.calendar-day');
    dayElements.forEach(dayElement => {
        const dayNumber = parseInt(dayElement.textContent);
        const elementDate = new Date(currentCalendarDate.getFullYear(), currentCalendarDate.getMonth(), dayNumber);

        if (elementDate.toDateString() === selectedDate.toDateString()) {
            dayElement.classList.add('selected');
        }
    });

    // Atualizar painel de informações
    updateDayInfo(selectedDate);
}

// Atualizar informações do dia
function updateDayInfo(date) {
    const titleElement = document.getElementById('selected-day-title');
    const dateElement = document.getElementById('selected-day-date');
    const contentElement = document.getElementById('day-info-content');

    if (!titleElement || !dateElement || !contentElement) return;

    // Formatar data
    const dayNames = ['Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado'];
    const monthNames = [
        'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
        'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
    ];

    const dayName = dayNames[date.getDay()];
    const day = date.getDate();
    const month = monthNames[date.getMonth()];
    const year = date.getFullYear();

    titleElement.textContent = dayName;
    dateElement.textContent = `${day} de ${month} de ${year}`;

    // Buscar agendamentos do dia
    const dateString = date.toISOString().split('T')[0];
    const dayAppointments = dashboardData.agendamentos.filter(a => a.data === dateString);

    if (dayAppointments.length === 0) {
        // Nenhum agendamento
        contentElement.innerHTML = `
            <div class="no-appointments">
                <i class="fas fa-calendar-check"></i>
                <h4>Nenhum agendamento</h4>
                <p>Não há agendamentos para este dia</p>
            </div>
        `;
    } else {
        // Ordenar agendamentos por horário
        const sortedAppointments = dayAppointments.sort((a, b) => a.hora.localeCompare(b.hora));

        // Estatísticas do dia
        const confirmedCount = sortedAppointments.filter(a => a.status === 'Confirmado').length;
        const pendingCount = sortedAppointments.filter(a => a.status === 'Pendente').length;

        contentElement.innerHTML = `
            <div class="day-summary">
                <h4>Resumo do Dia</h4>
                <p>${dayAppointments.length} agendamento${dayAppointments.length > 1 ? 's' : ''} marcado${dayAppointments.length > 1 ? 's' : ''}</p>
                <div class="summary-stats">
                    <div class="summary-stat">
                        <div class="summary-stat-number">${dayAppointments.length}</div>
                        <div class="summary-stat-label">Total</div>
                    </div>
                    <div class="summary-stat">
                        <div class="summary-stat-number">${confirmedCount}</div>
                        <div class="summary-stat-label">Confirmados</div>
                    </div>
                    <div class="summary-stat">
                        <div class="summary-stat-number">${pendingCount}</div>
                        <div class="summary-stat-label">Pendentes</div>
                    </div>
                </div>
            </div>
            
            <div class="day-appointments-list">
                ${sortedAppointments.map(appointment => `
                    <div class="day-appointment-item">
                        <div class="appointment-time">${appointment.hora}</div>
                        <div class="appointment-details">
                            <div class="appointment-client">${appointment.cliente}</div>
                            <div class="appointment-animal">
                                <i class="fas fa-paw"></i> ${appointment.animal}
                            </div>
                            <div class="appointment-service">
                                <i class="fas fa-stethoscope"></i> ${appointment.servico}
                            </div>
                            ${appointment.observacoes ? `
                                <div class="appointment-notes">
                                    <i class="fas fa-sticky-note"></i> ${appointment.observacoes}
                                </div>
                            ` : ''}
                        </div>
                        <div class="appointment-status">
                            <span class="status-badge status-${appointment.status.toLowerCase()}">${appointment.status}</span>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
    }
}

// Navegação do calendário (atualizada)
function previousMonth() {
    currentCalendarDate.setMonth(currentCalendarDate.getMonth() - 1);
    generateCalendar();

    // Manter o dia selecionado se estiver no novo mês
    if (selectedDate) {
        const selectedMonth = selectedDate.getMonth();
        const currentMonth = currentCalendarDate.getMonth();
        const selectedYear = selectedDate.getFullYear();
        const currentYear = currentCalendarDate.getFullYear();

        if (selectedMonth !== currentMonth || selectedYear !== currentYear) {
            // Se o dia selecionado não está no mês atual, selecionar o primeiro dia do mês
            selectDay(new Date(currentCalendarDate.getFullYear(), currentCalendarDate.getMonth(), 1));
        }
    }
}

function nextMonth() {
    currentCalendarDate.setMonth(currentCalendarDate.getMonth() + 1);
    generateCalendar();

    // Manter o dia selecionado se estiver no novo mês
    if (selectedDate) {
        const selectedMonth = selectedDate.getMonth();
        const currentMonth = currentCalendarDate.getMonth();
        const selectedYear = selectedDate.getFullYear();
        const currentYear = currentCalendarDate.getFullYear();

        if (selectedMonth !== currentMonth || selectedYear !== currentYear) {
            // Se o dia selecionado não está no mês atual, selecionar o primeiro dia do mês
            selectDay(new Date(currentCalendarDate.getFullYear(), currentCalendarDate.getMonth(), 1));
        }
    }
}

// Atualizar calendário quando agendamentos mudarem
const originalSalvarAgendamento = salvarAgendamento;
salvarAgendamento = function (formData) {
    originalSalvarAgendamento(formData);

    // Regenerar calendário e atualizar informações do dia
    setTimeout(() => {
        generateCalendar();
        if (selectedDate) {
            updateDayInfo(selectedDate);
        }
    }, 100);
};

const originalDeleteAgendamento = deleteAgendamento;
deleteAgendamento = function (id) {
    originalDeleteAgendamento(id);

    // Regenerar calendário e atualizar informações do dia
    setTimeout(() => {
        generateCalendar();
        if (selectedDate) {
            updateDayInfo(selectedDate);
        }
    }, 100);
};


// ===== ATUALIZAÇÕES NAS FUNÇÕES EXISTENTES =====

// Atualizar initializeDashboard para incluir usuários
function initializeDashboard() {
    // Carregar contatos do localStorage
    const savedContacts = JSON.parse(localStorage.getItem('nutripet_contacts') || '[]');
    dashboardData.contatos = savedContacts.map((contact, index) => ({
        id: index + 1,
        ...contact,
        status: contact.status || 'Pendente'
    }));
// Carregar dados do localStorage
    initializeClientesData();
    initializeAgendamentosData();
    initializeAnimaisData();
    initializeUsuariosData(); // Adicionar esta linha
    
    // Inicializar calendário após carregar dados
    setTimeout(() => {
        initializeCalendar();
    }, 100);

    console.log('Dashboard inicializado com todos os dados');
    console.log('Usuários carregados:', usuarios.length);
}
// Atualizar setupModals para incluir usuários
function setupModals() {
    // Configurar formulários
    setupAgendamentoForm();
    setupClienteForm();
    setupAnimalForm();
    setupUsuarioForm(); // Adicionar esta linha
    
    // Fechar modal ao clicar fora
    document.querySelectorAll('.modal').forEach(modal => {
        modal.addEventListener('click', function(e) {
            if (e.target === this) {
                closeModal(this.id);
            }
        });
    });
}

// Atualizar showSection para incluir usuários
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
            case 'usuarios': // Adicionar este case
                loadUsuarios();
                break;
        }
    }
}

// Expor funções globalmente
window.openUsuarioModal = openUsuarioModal;
window.deleteUsuario = deleteUsuario;
window.previousMonth = previousMonth;
window.nextMonth = nextMonth;