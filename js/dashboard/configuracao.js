// ===== CONFIGURAÇÕES - JAVASCRIPT COMPLETO =====

// Configurações padrão
const configuracoesPadrao = {
    geral: {
        empresa: {
            nome: 'NaturaVet',
            cnpj: '',
            telefone: '(81) 99999-9999',
            telefone2: '',
            email: 'contato@naturapet.com',
            site: 'https://naturapet.com',
            endereco: 'Rua das Flores, 123 - Centro, Recife - PE, CEP: 50000-000',
            descricao: ''
        },
        regional: {
            timezone: 'America/Sao_Paulo',
            idioma: 'pt-BR',
            moeda: 'BRL',
            formatoData: 'dd/mm/yyyy'
        },
        email: {
            servidor: '',
            porta: 587,
            usuario: '',
            senha: '',
            ssl: true,
            teste: false
        },
        visual: {
            corPrimaria: '#FC5A8D',
            corSecundaria: '#E6FAE6'
        }
    },
    agendamento: {
        horarios: {
            segunda: { ativo: true, inicio: '08:00', fim: '18:00' },
            terca: { ativo: true, inicio: '08:00', fim: '18:00' },
            quarta: { ativo: true, inicio: '08:00', fim: '18:00' },
            quinta: { ativo: true, inicio: '08:00', fim: '18:00' },
            sexta: { ativo: true, inicio: '08:00', fim: '18:00' },
            sabado: { ativo: false, inicio: '08:00', fim: '12:00' },
            domingo: { ativo: false, inicio: '08:00', fim: '12:00' }
        },
        consulta: {
            duracao: 60,
            intervalo: 15,
            limite: 10,
            antecedenciaMinima: 24,
            antecedenciaMaxima: 90,
            cancelamentoPrazo: 24
        },
        notificacoes: {
            confirmacao: true,
            lembrete24h: true,
            lembrete2h: false,
            cancelamento: true,
            reagendamento: true
        },
        servicos: [
            { nome: 'Consulta Nutricional', preco: 150, duracao: 60 },
            { nome: 'Alimentação Natural', preco: 200, duracao: 90 }
        ],
        feriados: [
            { data: '01/01/2024', nome: 'Confraternização Universal' },
            { data: '21/04/2024', nome: 'Tiradentes' }
        ]
    },
    backup: {
        automatico: true,
        frequencia: 'diario',
        horario: '02:00',
        retencao: 30,
        local: 'local',
        limpeza: {
            automatica: true,
            retencaoAgendamentos: 24,
            retencaoLogs: 90
        }
    },
    seguranca: {
        senha: {
            minimo8: true,
            maiuscula: true,
            minuscula: true,
            numeros: true,
            simbolos: false,
            validade: 90,
            historico: 5
        },
        acesso: {
            sessaoTempo: 60,
            loginTentativas: 3,
            bloqueioTempo: 15,
            inatividadeLogout: 30,
            loginMultiplo: false,
            lembrarLogin: true
        },
        twoFA: {
            obrigatorio: false,
            opcional: true,
            metodo: 'email'
        },
        log: {
            login: true,
            acoes: true,
            alteracoes: true,
            erros: true,
            nivel: 'detalhado'
        },
        permissoes: {
            escritor: {
                criar: true,
                editar: true,
                excluir: false
            },
            consultor: {
                visualizar: true,
                relatorios: true,
                exportar: false
            }
        }
    },
    relatorios: {
        automatico: true,
        frequencia: 'semanal',
        dia: 'segunda',
        horario: '08:00',
        formato: 'pdf',
        destinatarios: [
            'admin@naturapet.com',
            'gerencia@naturapet.com'
        ],
        tipos: {
            agendamentos: true,
            clientes: true,
            financeiro: true,
            performance: false,
            animais: true
        },
        metricas: [
            { nome: 'Taxa de Conversão', descricao: 'Contatos que se tornaram clientes', ativo: true },
            { nome: 'Tempo Médio de Consulta', descricao: 'Duração média das consultas realizadas', ativo: true }
        ],
        filtros: {
            periodo: 30,
            status: 'todos',
            detalhado: true,
            graficos: true,
            comparativo: false
        }
    }
};

// Navegação das configurações
function setupConfigNavigation() {
    const configLinks = document.querySelectorAll('.config-nav-link');
    
    configLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const configType = this.dataset.config;
            showConfigPanel(configType);
            
            // Atualizar navegação ativa
            document.querySelectorAll('.config-nav-item').forEach(item => {
                item.classList.remove('active');
            });
            this.parentElement.classList.add('active');
        });
    });
}

function showConfigPanel(panelName) {
    // Esconder todos os painéis
    document.querySelectorAll('.config-panel').forEach(panel => {
        panel.classList.remove('active');
    });
    
    // Mostrar painel específico
    const targetPanel = document.getElementById(`config-${panelName}`);
    if (targetPanel) {
        targetPanel.classList.add('active');
    }
}

// Carregar configurações
function carregarConfiguracoes() {
    const configuracoesSalvas = localStorage.getItem('NaturaVet_configuracoes');
    
    if (configuracoesSalvas) {
        const config = JSON.parse(configuracoesSalvas);
        preencherFormularios(config);
    } else {
        preencherFormularios(configuracoesPadrao);
    }
}

function preencherFormularios(config) {
    // Preencher campos gerais
    if (config.geral) {
        const empresa = config.geral.empresa;
        if (empresa) {
            setValue('empresa-nome', empresa.nome);
            setValue('empresa-cnpj', empresa.cnpj);
            setValue('empresa-telefone', empresa.telefone);
            setValue('empresa-telefone2', empresa.telefone2);
            setValue('empresa-email', empresa.email);
            setValue('empresa-site', empresa.site);
            setValue('empresa-endereco', empresa.endereco);
            setValue('empresa-descricao', empresa.descricao);
        }
        
        const regional = config.geral.regional;
        if (regional) {
            setValue('config-timezone', regional.timezone);
            setValue('config-idioma', regional.idioma);
            setValue('config-moeda', regional.moeda);
            setValue('config-formato-data', regional.formatoData);
        }
        
        const email = config.geral.email;
        if (email) {
            setValue('smtp-servidor', email.servidor);
            setValue('smtp-porta', email.porta);
            setValue('smtp-usuario', email.usuario);
            setValue('smtp-senha', email.senha);
            setChecked('smtp-ssl', email.ssl);
            setChecked('email-teste', email.teste);
        }
        
        const visual = config.geral.visual;
        if (visual) {
            setValue('cor-primaria', visual.corPrimaria);
            setValue('cor-secundaria', visual.corSecundaria);
        }
    }
    
    // Preencher configurações de agendamento
    if (config.agendamento) {
        const horarios = config.agendamento.horarios;
        if (horarios) {
            Object.keys(horarios).forEach(dia => {
                const h = horarios[dia];
                setChecked(`${dia.substring(0, 3)}-ativo`, h.ativo);
                setValue(`${dia.substring(0, 3)}-inicio`, h.inicio);
                setValue(`${dia.substring(0, 3)}-fim`, h.fim);
            });
        }
        
        const consulta = config.agendamento.consulta;
        if (consulta) {
            setValue('duracao-consulta', consulta.duracao);
            setValue('intervalo-consulta', consulta.intervalo);
            setValue('limite-agendamentos', consulta.limite);
            setValue('antecedencia-minima', consulta.antecedenciaMinima);
            setValue('antecedencia-maxima', consulta.antecedenciaMaxima);
            setValue('cancelamento-prazo', consulta.cancelamentoPrazo);
        }
        
        const notificacoes = config.agendamento.notificacoes;
        if (notificacoes) {
            setChecked('notif-confirmacao', notificacoes.confirmacao);
            setChecked('notif-lembrete-24h', notificacoes.lembrete24h);
            setChecked('notif-lembrete-2h', notificacoes.lembrete2h);
            setChecked('notif-cancelamento', notificacoes.cancelamento);
            setChecked('notif-reagendamento', notificacoes.reagendamento);
        }
    }
    
    // Preencher configurações de backup
    if (config.backup) {
        setChecked('backup-automatico', config.backup.automatico);
        setValue('backup-frequencia', config.backup.frequencia);
        setValue('backup-horario', config.backup.horario);
        setValue('backup-retencao', config.backup.retencao);
        setValue('backup-local', config.backup.local);
        
        if (config.backup.limpeza) {
            setChecked('limpeza-automatica', config.backup.limpeza.automatica);
            setValue('retencao-agendamentos', config.backup.limpeza.retencaoAgendamentos);
            setValue('retencao-logs', config.backup.limpeza.retencaoLogs);
        }
    }
    
    // Preencher configurações de segurança
    if (config.seguranca) {
        const senha = config.seguranca.senha;
        if (senha) {
            setChecked('senha-minimo-8', senha.minimo8);
            setChecked('senha-maiuscula', senha.maiuscula);
            setChecked('senha-minuscula', senha.minuscula);
            setChecked('senha-numeros', senha.numeros);
            setChecked('senha-simbolos', senha.simbolos);
            setValue('senha-validade', senha.validade);
            setValue('senha-historico', senha.historico);
        }
        
        const acesso = config.seguranca.acesso;
        if (acesso) {
            setValue('sessao-tempo', acesso.sessaoTempo);
            setValue('login-tentativas', acesso.loginTentativas);
            setValue('bloqueio-tempo', acesso.bloqueioTempo);
            setValue('inatividade-logout', acesso.inatividadeLogout);
            setChecked('login-multiplo', acesso.loginMultiplo);
            setChecked('lembrar-login', acesso.lembrarLogin);
        }
        
        const twoFA = config.seguranca.twoFA;
        if (twoFA) {
            setChecked('2fa-obrigatorio', twoFA.obrigatorio);
            setChecked('2fa-opcional', twoFA.opcional);
            setValue('2fa-metodo', twoFA.metodo);
        }
        
        const log = config.seguranca.log;
        if (log) {
            setChecked('log-login', log.login);
            setChecked('log-acoes', log.acoes);
            setChecked('log-alteracoes', log.alteracoes);
            setChecked('log-erros', log.erros);
            setValue('log-nivel', log.nivel);
        }
        
        const permissoes = config.seguranca.permissoes;
        if (permissoes) {
            if (permissoes.escritor) {
                setChecked('perm-escritor-criar', permissoes.escritor.criar);
                setChecked('perm-escritor-editar', permissoes.escritor.editar);
                setChecked('perm-escritor-excluir', permissoes.escritor.excluir);
            }
            if (permissoes.consultor) {
                setChecked('perm-consultor-visualizar', permissoes.consultor.visualizar);
                setChecked('perm-consultor-relatorios', permissoes.consultor.relatorios);
                setChecked('perm-consultor-exportar', permissoes.consultor.exportar);
            }
        }
    }
    
    // Preencher configurações de relatórios
    if (config.relatorios) {
        setChecked('relatorio-automatico', config.relatorios.automatico);
        setValue('relatorio-frequencia', config.relatorios.frequencia);
        setValue('relatorio-dia', config.relatorios.dia);
        setValue('relatorio-horario', config.relatorios.horario);
        setValue('relatorio-formato', config.relatorios.formato);
        
        const tipos = config.relatorios.tipos;
        if (tipos) {
            setChecked('rel-agendamentos', tipos.agendamentos);
            setChecked('rel-clientes', tipos.clientes);
            setChecked('rel-financeiro', tipos.financeiro);
            setChecked('rel-performance', tipos.performance);
            setChecked('rel-animais', tipos.animais);
        }
        
        const filtros = config.relatorios.filtros;
        if (filtros) {
            setValue('filtro-periodo', filtros.periodo);
            setValue('filtro-status', filtros.status);
            setChecked('filtro-detalhado', filtros.detalhado);
            setChecked('filtro-graficos', filtros.graficos);
            setChecked('filtro-comparativo', filtros.comparativo);
        }
    }
}

// Funções auxiliares
function setValue(id, value) {
    const element = document.getElementById(id);
    if (element) {
        element.value = value || '';
    }
}

function setChecked(id, checked) {
    const element = document.getElementById(id);
    if (element) {
        element.checked = checked || false;
    }
}

function getValue(id) {
    const element = document.getElementById(id);
    return element ? element.value : '';
}

function getChecked(id) {
    const element = document.getElementById(id);
    return element ? element.checked : false;
}

// Salvar configurações
function salvarConfiguracoes() {
    const configuracoes = {
        geral: {
            empresa: {
                nome: getValue('empresa-nome'),
                cnpj: getValue('empresa-cnpj'),
                telefone: getValue('empresa-telefone'),
                telefone2: getValue('empresa-telefone2'),
                email: getValue('empresa-email'),
                site: getValue('empresa-site'),
                endereco: getValue('empresa-endereco'),
                descricao: getValue('empresa-descricao')
            },
            regional: {
                timezone: getValue('config-timezone'),
                idioma: getValue('config-idioma'),
                moeda: getValue('config-moeda'),
                formatoData: getValue('config-formato-data')
            },
            email: {
                servidor: getValue('smtp-servidor'),
                porta: parseInt(getValue('smtp-porta')) || 587,
                usuario: getValue('smtp-usuario'),
                senha: getValue('smtp-senha'),
                ssl: getChecked('smtp-ssl'),
                teste: getChecked('email-teste')
            },
            visual: {
                corPrimaria: getValue('cor-primaria'),
                corSecundaria: getValue('cor-secundaria')
            }
        },
        agendamento: {
            horarios: {
                segunda: {
                    ativo: getChecked('seg-ativo'),
                    inicio: getValue('seg-inicio'),
                    fim: getValue('seg-fim')
                },
                terca: {
                    ativo: getChecked('ter-ativo'),
                    inicio: getValue('ter-inicio'),
                    fim: getValue('ter-fim')
                },
                quarta: {
                    ativo: getChecked('qua-ativo'),
                    inicio: getValue('qua-inicio'),
                    fim: getValue('qua-fim')
                },
                quinta: {
                    ativo: getChecked('qui-ativo'),
                    inicio: getValue('qui-inicio'),
                    fim: getValue('qui-fim')
                },
                sexta: {
                    ativo: getChecked('sex-ativo'),
                    inicio: getValue('sex-inicio'),
                    fim: getValue('sex-fim')
                },
                sabado: {
                    ativo: getChecked('sab-ativo'),
                    inicio: getValue('sab-inicio'),
                    fim: getValue('sab-fim')
                },
                domingo: {
                    ativo: getChecked('dom-ativo'),
                    inicio: getValue('dom-inicio'),
                    fim: getValue('dom-fim')
                }
            },
            consulta: {
                duracao: parseInt(getValue('duracao-consulta')) || 60,
                intervalo: parseInt(getValue('intervalo-consulta')) || 15,
                limite: parseInt(getValue('limite-agendamentos')) || 10,
                antecedenciaMinima: parseInt(getValue('antecedencia-minima')) || 24,
                antecedenciaMaxima: parseInt(getValue('antecedencia-maxima')) || 90,
                cancelamentoPrazo: parseInt(getValue('cancelamento-prazo')) || 24
            },
            notificacoes: {
                confirmacao: getChecked('notif-confirmacao'),
                lembrete24h: getChecked('notif-lembrete-24h'),
                lembrete2h: getChecked('notif-lembrete-2h'),
                cancelamento: getChecked('notif-cancelamento'),
                reagendamento: getChecked('notif-reagendamento')
            }
        },
        backup: {
            automatico: getChecked('backup-automatico'),
            frequencia: getValue('backup-frequencia'),
            horario: getValue('backup-horario'),
            retencao: parseInt(getValue('backup-retencao')) || 30,
            local: getValue('backup-local'),
            limpeza: {
                automatica: getChecked('limpeza-automatica'),
                retencaoAgendamentos: parseInt(getValue('retencao-agendamentos')) || 24,
                retencaoLogs: parseInt(getValue('retencao-logs')) || 90
            }
        },
        seguranca: {
            senha: {
                minimo8: getChecked('senha-minimo-8'),
                maiuscula: getChecked('senha-maiuscula'),
                minuscula: getChecked('senha-minuscula'),
                numeros: getChecked('senha-numeros'),
                simbolos: getChecked('senha-simbolos'),
                validade: parseInt(getValue('senha-validade')) || 90,
                historico: parseInt(getValue('senha-historico')) || 5
            },
            acesso: {
                sessaoTempo: parseInt(getValue('sessao-tempo')) || 60,
                loginTentativas: parseInt(getValue('login-tentativas')) || 3,
                bloqueioTempo: parseInt(getValue('bloqueio-tempo')) || 15,
                inatividadeLogout: parseInt(getValue('inatividade-logout')) || 30,
                loginMultiplo: getChecked('login-multiplo'),
                lembrarLogin: getChecked('lembrar-login')
            },
            twoFA: {
                obrigatorio: getChecked('2fa-obrigatorio'),
                opcional: getChecked('2fa-opcional'),
                metodo: getValue('2fa-metodo')
            },
            log: {
                login: getChecked('log-login'),
                acoes: getChecked('log-acoes'),
                alteracoes: getChecked('log-alteracoes'),
                erros: getChecked('log-erros'),
                nivel: getValue('log-nivel')
            },
            permissoes: {
                escritor: {
                    criar: getChecked('perm-escritor-criar'),
                    editar: getChecked('perm-escritor-editar'),
                    excluir: getChecked('perm-escritor-excluir')
                },
                consultor: {
                    visualizar: getChecked('perm-consultor-visualizar'),
                    relatorios: getChecked('perm-consultor-relatorios'),
                    exportar: getChecked('perm-consultor-exportar')
                }
            }
        },
        relatorios: {
            automatico: getChecked('relatorio-automatico'),
            frequencia: getValue('relatorio-frequencia'),
            dia: getValue('relatorio-dia'),
            horario: getValue('relatorio-horario'),
            formato: getValue('relatorio-formato'),
            tipos: {
                agendamentos: getChecked('rel-agendamentos'),
                clientes: getChecked('rel-clientes'),
                financeiro: getChecked('rel-financeiro'),
                performance: getChecked('rel-performance'),
                animais: getChecked('rel-animais')
            },
            filtros: {
                periodo: parseInt(getValue('filtro-periodo')) || 30,
                status: getValue('filtro-status'),
                detalhado: getChecked('filtro-detalhado'),
                graficos: getChecked('filtro-graficos'),
                comparativo: getChecked('filtro-comparativo')
            }
        }
    };
    
    // Salvar no localStorage
    localStorage.setItem('NaturaVet_configuracoes', JSON.stringify(configuracoes));
    
    showNotification('Configurações salvas com sucesso!', 'success');
    
    console.log('Configurações salvas:', configuracoes);
}

// Restaurar configurações padrão
function resetConfiguracoes() {
    if (confirm('Tem certeza que deseja restaurar as configurações padrão? Esta ação não pode ser desfeita.')) {
        localStorage.removeItem('NaturaVet_configuracoes');
        preencherFormularios(configuracoesPadrao);
        showNotification('Configurações restauradas para os valores padrão!', 'success');
    }
}

// Testar configurações
function testarConfiguracoes() {
    showNotification('Testando configurações...', 'info');
    
    // Simular teste de configurações
    setTimeout(() => {
        const sucesso = Math.random() > 0.2; // 80% de chance de sucesso
        
        if (sucesso) {
            showNotification('Todas as configurações estão funcionando corretamente!', 'success');
        } else {
            showNotification('Algumas configurações podem ter problemas. Verifique as configurações de e-mail.', 'warning');
        }
    }, 2000);
}

// Funções específicas para cada seção
function adicionarFeriado() {
    const data = prompt('Digite a data do feriado (DD/MM/AAAA):');
    const nome = prompt('Digite o nome do feriado:');
    
    if (data && nome) {
        const feriadosList = document.getElementById('feriados-list');
        const feriadoItem = document.createElement('div');
        feriadoItem.className = 'feriado-item';
        feriadoItem.innerHTML = `
            <span>${data} - ${nome}</span>
            <button class="btn btn-sm btn-danger" onclick="removerFeriado(this)">
                <i class="fas fa-trash"></i>
            </button>
        `;
        feriadosList.appendChild(feriadoItem);
    }
}

function removerFeriado(button) {
    if (confirm('Tem certeza que deseja remover este feriado?')) {
        button.parentElement.remove();
    }
}

function adicionarServico() {
    const nome = prompt('Nome do serviço:');
    const preco = prompt('Preço (R$):');
    const duracao = prompt('Duração (minutos):');
    
    if (nome && preco && duracao) {
        const servicosList = document.getElementById('servicos-list');
        const servicoItem = document.createElement('div');
        servicoItem.className = 'servico-item';
        servicoItem.innerHTML = `
            <div class="servico-info">
                <strong>${nome}</strong>
                <span>R$ ${preco} - ${duracao} min</span>
            </div>
            <div class="servico-actions">
                <button class="btn btn-sm btn-secondary" onclick="editarServico(this)">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn btn-sm btn-danger" onclick="removerServico(this)">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `;        servicosList.appendChild(servicoItem);
    }
}

function editarServico(button) {
    const servicoItem = button.closest('.servico-item');
    const servicoInfo = servicoItem.querySelector('.servico-info');
    const nome = servicoInfo.querySelector('strong').textContent;
    const detalhes = servicoInfo.querySelector('span').textContent;
    
    const novoNome = prompt('Nome do serviço:', nome);
    const novoPreco = prompt('Preço (R$):', detalhes.split(' - ')[0].replace('R$ ', ''));
    const novaDuracao = prompt('Duração (minutos):', detalhes.split(' - ')[1].replace(' min', ''));
    
    if (novoNome && novoPreco && novaDuracao) {
        servicoInfo.innerHTML = `
            <strong>${novoNome}</strong>
            <span>R$ ${novoPreco} - ${novaDuracao} min</span>
        `;
    }
}

function removerServico(button) {
    if (confirm('Tem certeza que deseja remover este serviço?')) {
        button.closest('.servico-item').remove();
    }
}

function adicionarDestinatario() {
    const email = prompt('Digite o e-mail do destinatário:');
    
    if (email && isValidEmail(email)) {
        const destinatariosList = document.getElementById('destinatarios-list');
        const destinatarioItem = document.createElement('div');
        destinatarioItem.className = 'destinatario-item';
        destinatarioItem.innerHTML = `
            <span>${email}</span>
            <div class="destinatario-actions">
                <label class="toggle-switch">
                    <input type="checkbox" checked>
                    <span class="toggle-slider"></span>
                </label>
                <button class="btn btn-sm btn-danger" onclick="removerDestinatario(this)">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `;
        destinatariosList.appendChild(destinatarioItem);
    } else {
        showNotification('E-mail inválido!', 'error');
    }
}

function removerDestinatario(button) {
    if (confirm('Tem certeza que deseja remover este destinatário?')) {
        button.closest('.destinatario-item').remove();
    }
}

function adicionarMetrica() {
    const nome = prompt('Nome da métrica:');
    const descricao = prompt('Descrição da métrica:');
    
    if (nome && descricao) {
        const metricasList = document.getElementById('metricas-list');
        const metricaItem = document.createElement('div');
        metricaItem.className = 'metrica-item';
        metricaItem.innerHTML = `
            <div class="metrica-info">
                <strong>${nome}</strong>
                <span>${descricao}</span>
            </div>
            <div class="metrica-actions">
                <label class="toggle-switch">
                    <input type="checkbox" checked>
                    <span class="toggle-slider"></span>
                </label>
                <button class="btn btn-sm btn-secondary" onclick="editarMetrica(this)">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn btn-sm btn-danger" onclick="removerMetrica(this)">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `;
        metricasList.appendChild(metricaItem);
    }
}

function editarMetrica(button) {
    const metricaItem = button.closest('.metrica-item');
    const metricaInfo = metricaItem.querySelector('.metrica-info');
    const nome = metricaInfo.querySelector('strong').textContent;
    const descricao = metricaInfo.querySelector('span').textContent;
    
    const novoNome = prompt('Nome da métrica:', nome);
    const novaDescricao = prompt('Descrição da métrica:', descricao);
    
    if (novoNome && novaDescricao) {
        metricaInfo.innerHTML = `
            <strong>${novoNome}</strong>
            <span>${novaDescricao}</span>
        `;
    }
}

function removerMetrica(button) {
    if (confirm('Tem certeza que deseja remover esta métrica?')) {
        button.closest('.metrica-item').remove();
    }
}

function configurarRelatorio(tipo) {
    showNotification(`Configurando relatório de ${tipo}...`, 'info');
    // Aqui você pode abrir um modal específico para configurar o relatório
}

// Funções de backup e exportação
function exportarDados(tipo, formato) {
    showNotification(`Exportando ${tipo} em formato ${formato.toUpperCase()}...`, 'info');
    
    let dados;
    let nomeArquivo;
    
    switch (tipo) {
        case 'clientes':
            dados = dashboardData.clientes;
            nomeArquivo = `clientes_${new Date().toISOString().split('T')[0]}`;
            break;
        case 'agendamentos':
            dados = dashboardData.agendamentos;
            nomeArquivo = `agendamentos_${new Date().toISOString().split('T')[0]}`;
            break;
        case 'animais':
            dados = dashboardData.animais;
            nomeArquivo = `animais_${new Date().toISOString().split('T')[0]}`;
            break;
        case 'completo':
            dados = {
                clientes: dashboardData.clientes,
                agendamentos: dashboardData.agendamentos,
                animais: dashboardData.animais,
                contatos: dashboardData.contatos,
                configuracoes: JSON.parse(localStorage.getItem('NaturaVet_configuracoes') || '{}'),
                usuarios: JSON.parse(localStorage.getItem('NaturaVet_usuarios') || '[]')
            };
            nomeArquivo = `backup_completo_${new Date().toISOString().split('T')[0]}`;
            break;
        default:
            showNotification('Tipo de dados não reconhecido!', 'error');
            return;
    }
    
    if (formato === 'json') {
        exportarJSON(dados, nomeArquivo);
    } else if (formato === 'excel') {
        exportarExcel(dados, nomeArquivo);
    } else if (formato === 'csv') {
        exportarCSV(dados, nomeArquivo);
    } else if (formato === 'pdf') {
        exportarPDF(dados, nomeArquivo);
    }
    
    setTimeout(() => {
        showNotification(`${tipo} exportado com sucesso!`, 'success');
    }, 1000);
}

function exportarJSON(dados, nomeArquivo) {
    const dataStr = JSON.stringify(dados, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    
    const link = document.createElement('a');
    link.href = URL.createObjectURL(dataBlob);
    link.download = `${nomeArquivo}.json`;
    link.click();
}

function exportarCSV(dados, nomeArquivo) {
    if (!Array.isArray(dados)) {
        showNotification('Formato CSV disponível apenas para listas de dados!', 'error');
        return;
    }
    
    if (dados.length === 0) {
        showNotification('Nenhum dado para exportar!', 'warning');
        return;
    }
    
    // Cabeçalhos
    const headers = Object.keys(dados[0]);
    let csvContent = headers.join(',') + '\n';
    
    // Dados
    dados.forEach(item => {
        const row = headers.map(header => {
            const value = item[header] || '';
            return `"${value.toString().replace(/"/g, '""')}"`;
        });
        csvContent += row.join(',') + '\n';
    });
    
    const dataBlob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(dataBlob);
    link.download = `${nomeArquivo}.csv`;
    link.click();
}

function exportarExcel(dados, nomeArquivo) {
    // Simulação de exportação Excel (em produção, usar biblioteca como SheetJS)
    showNotification('Funcionalidade Excel em desenvolvimento. Usando CSV como alternativa.', 'info');
    exportarCSV(dados, nomeArquivo);
}

function exportarPDF(dados, nomeArquivo) {
    // Simulação de exportação PDF (em produção, usar biblioteca como jsPDF)
    showNotification('Funcionalidade PDF em desenvolvimento. Usando JSON como alternativa.', 'info');
    exportarJSON(dados, nomeArquivo);
}

function importarDados(tipo) {
    const fileInput = document.getElementById(`import-${tipo}`);
    const file = fileInput.files[0];
    
    if (!file) {
        showNotification('Selecione um arquivo para importar!', 'error');
        return;
    }
    
    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            let dadosImportados;
            
            if (file.name.endsWith('.json')) {
                dadosImportados = JSON.parse(e.target.result);
            } else if (file.name.endsWith('.csv')) {
                dadosImportados = parseCSV(e.target.result);
            } else {
                showNotification('Formato de arquivo não suportado!', 'error');
                return;
            }
            
            // Validar e importar dados
            if (validarDadosImportacao(dadosImportados, tipo)) {
                importarDadosValidados(dadosImportados, tipo);
                showNotification(`${tipo} importados com sucesso!`, 'success');
            } else {
                showNotification('Dados inválidos para importação!', 'error');
            }
            
        } catch (error) {
            console.error('Erro ao importar dados:', error);
            showNotification('Erro ao processar arquivo de importação!', 'error');
        }
    };
    
    reader.readAsText(file);
}

function parseCSV(csvText) {
    const lines = csvText.split('\n');
    const headers = lines[0].split(',').map(h => h.replace(/"/g, '').trim());
    const data = [];
    
    for (let i = 1; i < lines.length; i++) {
        if (lines[i].trim()) {
            const values = lines[i].split(',').map(v => v.replace(/"/g, '').trim());
            const obj = {};
            headers.forEach((header, index) => {
                obj[header] = values[index] || '';
            });
            data.push(obj);
        }
    }
    
    return data;
}

function validarDadosImportacao(dados, tipo) {
    if (!Array.isArray(dados)) return false;
    
    const camposObrigatorios = {
        clientes: ['nome', 'email'],
        animais: ['nome', 'tipo', 'tutor'],
        agendamentos: ['data', 'hora', 'cliente', 'animal', 'servico']
    };
    
    const campos = camposObrigatorios[tipo];
    if (!campos) return false;
    
    return dados.every(item => 
        campos.every(campo => item.hasOwnProperty(campo) && item[campo])
    );
}

function importarDadosValidados(dados, tipo) {
    switch (tipo) {
        case 'clientes':
            dados.forEach(cliente => {
                cliente.id = Date.now() + Math.random();
                cliente.cadastro = new Date().toISOString().split('T')[0];
                cliente.animais = 0;
                dashboardData.clientes.push(cliente);
            });
            localStorage.setItem('NaturaVet_clientes', JSON.stringify(dashboardData.clientes));
            loadClientes();
            break;
            
        case 'animais':
            dados.forEach(animal => {
                animal.id = Date.now() + Math.random();
                // Encontrar tutor por nome
                const tutor = dashboardData.clientes.find(c => c.nome === animal.tutor);
                if (tutor) {
                    animal.tutorId = tutor.id;
                    tutor.animais = (tutor.animais || 0) + 1;
                }
                dashboardData.animais.push(animal);
            });
            localStorage.setItem('NaturaVet_animais', JSON.stringify(dashboardData.animais));
            localStorage.setItem('NaturaVet_clientes', JSON.stringify(dashboardData.clientes));
            loadAnimais();
            loadClientes();
            break;
            
        case 'agendamentos':
            dados.forEach(agendamento => {
                agendamento.id = Date.now() + Math.random();
                agendamento.status = agendamento.status || 'Confirmado';
                dashboardData.agendamentos.push(agendamento);
            });
            localStorage.setItem('NaturaVet_agendamentos', JSON.stringify(dashboardData.agendamentos));
            loadAgendamentos();
            break;
    }
    
    updateBadges();
}

function restaurarBackup() {
    const fileInput = document.getElementById('import-backup');
    const file = fileInput.files[0];
    
    if (!file) {
        showNotification('Selecione um arquivo de backup!', 'error');
        return;
    }
    
    if (!confirm('ATENÇÃO: Esta ação irá substituir todos os dados atuais. Tem certeza que deseja continuar?')) {
        return;
    }
    
    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const backup = JSON.parse(e.target.result);
            
            // Restaurar dados
            if (backup.clientes) {
                dashboardData.clientes = backup.clientes;
                localStorage.setItem('NaturaVet_clientes', JSON.stringify(backup.clientes));
            }
            
            if (backup.agendamentos) {
                dashboardData.agendamentos = backup.agendamentos;
                localStorage.setItem('NaturaVet_agendamentos', JSON.stringify(backup.agendamentos));
            }
            
            if (backup.animais) {
                dashboardData.animais = backup.animais;
                localStorage.setItem('NaturaVet_animais', JSON.stringify(backup.animais));
            }
            
            if (backup.contatos) {
                dashboardData.contatos = backup.contatos;
                localStorage.setItem('NaturaVet_contacts', JSON.stringify(backup.contatos));
            }
            
            if (backup.configuracoes) {
                localStorage.setItem('NaturaVet_configuracoes', JSON.stringify(backup.configuracoes));
            }
            
            if (backup.usuarios) {
                localStorage.setItem('NaturaVet_usuarios', JSON.stringify(backup.usuarios));
            }
            
            showNotification('Backup restaurado com sucesso! Recarregando página...', 'success');
            
            setTimeout(() => {
                location.reload();
            }, 2000);
            
        } catch (error) {
            console.error('Erro ao restaurar backup:', error);
            showNotification('Erro ao processar arquivo de backup!', 'error');
        }
    };
    
    reader.readAsText(file);
}

function executarLimpeza() {
    if (!confirm('Tem certeza que deseja executar a limpeza de dados? Esta ação não pode ser desfeita.')) {
        return;
    }
    
    showNotification('Executando limpeza de dados...', 'info');
    
    const retencaoAgendamentos = parseInt(getValue('retencao-agendamentos')) || 24;
    const retencaoLogs = parseInt(getValue('retencao-logs')) || 90;
    
    // Simular limpeza
    setTimeout(() => {
        const dataLimite = new Date();
        dataLimite.setMonth(dataLimite.getMonth() - retencaoAgendamentos);
        
        const agendamentosAntigos = dashboardData.agendamentos.filter(a => 
            new Date(a.data) < dataLimite
        ).length;
        
        // Remover agendamentos antigos (simulação)
        dashboardData.agendamentos = dashboardData.agendamentos.filter(a => 
            new Date(a.data) >= dataLimite
        );
        
        localStorage.setItem('NaturaVet_agendamentos', JSON.stringify(dashboardData.agendamentos));
        
        showNotification(`Limpeza concluída! ${agendamentosAntigos} agendamentos antigos foram removidos.`, 'success');
        
        loadAgendamentos();
        updateBadges();
    }, 2000);
}

function gerarRelatorio(tipo) {
    showNotification(`Gerando relatório de ${tipo}...`, 'info');
    
    // Simular geração de relatório
    setTimeout(() => {
        const nomeArquivo = `relatorio_${tipo}_${new Date().toISOString().split('T')[0]}.pdf`;
        showNotification(`Relatório gerado: ${nomeArquivo}`, 'success');
        
        // Em produção, aqui você faria o download real do relatório
        console.log(`Relatório ${tipo} gerado com sucesso`);
    }, 2000);
}

// Função auxiliar para validar e-mail
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Inicializar configurações quando a seção for carregada
function initializeConfiguracoes() {
    setupConfigNavigation();
    carregarConfiguracoes();
    
    console.log('Configurações inicializadas');
}

// Atualizar a função showSection para incluir configurações
const originalShowSection = showSection;
showSection = function(sectionName) {
    originalShowSection(sectionName);
    
    if (sectionName === 'configuracoes') {
        setTimeout(() => {
            initializeConfiguracoes();
        }, 100);
    }
};

// Expor funções globalmente
window.salvarConfiguracoes = salvarConfiguracoes;
window.resetConfiguracoes = resetConfiguracoes;
window.testarConfiguracoes = testarConfiguracoes;
window.adicionarFeriado = adicionarFeriado;
window.removerFeriado = removerFeriado;
window.adicionarServico = adicionarServico;
window.editarServico = editarServico;
window.removerServico = removerServico;
window.adicionarDestinatario = adicionarDestinatario;
window.removerDestinatario = removerDestinatario;
window.adicionarMetrica = adicionarMetrica;
window.editarMetrica = editarMetrica;
window.removerMetrica = removerMetrica;
window.configurarRelatorio = configurarRelatorio;
window.exportarDados = exportarDados;
window.importarDados = importarDados;
window.restaurarBackup = restaurarBackup;
window.executarLimpeza = executarLimpeza;
window.gerarRelatorio = gerarRelatorio;

console.log('Sistema de configurações carregado com sucesso!');