// ============================================
// КОНФИГУРАЦИЯ API
// ============================================

const API_URL = 'https://karasev-backend.onrender.com/api';


let case3CurrentData = [];
let case3CurrentVoting = '94008';
let case4SimulationResults = null;

let cy = null;
let case2CurrentGraph = 'real';
let case2AllDeputies = [];

// ============================================
// МОДАЛЬНОЕ ОКНО
// ============================================

function closeModal() {
    const modal = document.getElementById('modal');
    if (modal) {
        modal.style.display = 'none';
    }
}

window.onclick = function(event) {
    const modal = document.getElementById('modal');
    if (event.target === modal) {
        closeModal();
    }
}

// ============================================
// КЕЙС 1: Анализ голосований
// ============================================

function openCase1() {
    const modal = document.getElementById('modal');
    modal.innerHTML = `
        <div class="modal-content" style="max-width: 1200px;">
            <span class="close-modal" onclick="closeModal()">&times;</span>
            
            <div class="modal-header" style="background: linear-gradient(135deg, #3498db 0%, #2980b9 100%);">
                <i class="fas fa-chart-pie"></i>
                <div>
                    <h2>Кейс 1: Анализ голосований</h2>
                    <p>Визуализация распределения голосов по типам законопроектов</p>
                </div>
            </div>
            
            <div class="modal-body">
                <div style="background: #e3f2fd; padding: 1rem; border-radius: 8px; margin-bottom: 2rem;">
                    <p><strong>📊 Что показывает этот кейс:</strong></p>
                    <p>Интерактивные графики распределения голосов депутатов по различным параметрам законопроектов.</p>
                </div>
                
                <button onclick="loadCase1Visualization()" class="btn-primary" style="width: 100%; padding: 1rem; font-size: 1.1rem;">
                    <i class="fas fa-chart-bar"></i> Загрузить визуализацию
                </button>
                
                <div id="case1-results" style="margin-top: 2rem;"></div>
            </div>
        </div>
    `;
    modal.style.display = 'flex';
}

async function loadCase1Visualization() {
    const resultsDiv = document.getElementById('case1-results');
    resultsDiv.innerHTML = `
        <div style="text-align: center; padding: 2rem;">
            <div class="spinner"></div>
            <p>Загрузка данных...</p>
        </div>
    `;

    try {
        const response = await fetch(`${API_URL}/deputies`);
        const data = await response.json();

        if (!data.success) {
            resultsDiv.innerHTML = `<p style="color: red;">Ошибка: ${data.error}</p>`;
            return;
        }

        displayCase1Charts(data.deputies);

    } catch (error) {
        console.error('Ошибка загрузки:', error);
        resultsDiv.innerHTML = `
            <div style="background: #fee; padding: 1.5rem; border-radius: 8px; border-left: 4px solid #e74c3c;">
                <h3 style="color: #e74c3c;">Ошибка подключения</h3>
                <p><strong>Сообщение:</strong> ${error.message}</p>
                <p style="margin-top: 0.5rem;">Убедитесь что backend запущен: <code>python3 backend/app.py</code></p>
            </div>
        `;
    }
}

function displayCase1Charts(deputies) {
    const resultsDiv = document.getElementById('case1-results');

    const factionCounts = {};
    const voteCounts = {'За': 0, 'Против': 0, 'Воздержался': 0, 'Не голосовал': 0, 'Отсутствовал': 0};
    const voteClasses = ['За', 'Против', 'Воздержался', 'Не голосовал', 'Отсутствовал'];

    deputies.forEach(dep => {
        factionCounts[dep.faction] = (factionCounts[dep.faction] || 0) + 1;
        const vote = voteClasses[dep.real_vote];
        if (vote) voteCounts[vote]++;
    });

    resultsDiv.innerHTML = `
        <div style="margin-bottom: 2rem;">
            <h3 style="margin-bottom: 1rem;">Распределение депутатов по фракциям</h3>
            <div id="factionChart" style="height: 400px;"></div>
        </div>
        
        <div style="margin-bottom: 2rem;">
            <h3 style="margin-bottom: 1rem;">Распределение голосов</h3>
            <div id="voteChart" style="height: 400px;"></div>
        </div>
    `;

    const factionData = [{
        x: Object.keys(factionCounts),
        y: Object.values(factionCounts),
        type: 'bar',
        marker: {
            color: '#3498db',
            line: {
                color: '#2980b9',
                width: 2
            }
        }
    }];

    const factionLayout = {
        title: '',
        xaxis: { title: 'Фракция' },
        yaxis: { title: 'Количество депутатов' },
        margin: { t: 20 }
    };

    Plotly.newPlot('factionChart', factionData, factionLayout);

    const voteData = [{
        values: Object.values(voteCounts),
        labels: Object.keys(voteCounts),
        type: 'pie',
        marker: {
            colors: ['#27ae60', '#e74c3c', '#f39c12', '#95a5a6', '#34495e']
        }
    }];

    const voteLayout = {
        title: '',
        margin: { t: 20 }
    };

    Plotly.newPlot('voteChart', voteData, voteLayout);
}

// ============================================
// КЕЙС 2: Сетевой граф депутатов
// ============================================

function openCase2() {
    const modal = document.getElementById('modal');
    modal.innerHTML = `
        <div class="modal-content" style="max-width: 1400px;">
            <span class="close-modal" onclick="closeModal()">&times;</span>
            
            <div class="modal-header" style="background: linear-gradient(135deg, #e74c3c 0%, #c0392b 100%);">
                <i class="fas fa-project-diagram"></i>
                <div>
                    <h2>Кейс 2: Сетевой граф депутатов</h2>
                    <p>Визуализация связей бизнеса и сфер деятельности</p>
                </div>
            </div>
            
            <div class="modal-body">
                <div style="background: #ffebee; padding: 1.5rem; border-radius: 8px; margin-bottom: 1.5rem;">
                    <label style="display: block; margin-bottom: 0.5rem; font-weight: 600;">
                        <i class="fas fa-user"></i> Выберите депутата:
                    </label>
                    <div style="display: flex; gap: 1rem; align-items: center;">
                        <select id="case2-deputy-select" style="flex: 1; padding: 0.75rem; border: 2px solid #e74c3c; border-radius: 4px; font-size: 1rem;">
                            <option value="">Загрузка...</option>
                        </select>
                        <button onclick="loadCase2CoauthorshipGraph()" class="btn-secondary">
                            <i class="fas fa-users"></i> Граф соавторства
                        </button>
                    </div>
                </div>

                <button onclick="loadCase2DeputyGraph()" class="btn-primary" style="width: 100%; padding: 1rem; font-size: 1.1rem; margin-bottom: 2rem;">
                    <i class="fas fa-chart-line"></i> Загрузить граф
                </button>

                <div id="case2-filters" style="display: none; background: #f8f9fa; padding: 1.5rem; border-radius: 8px; margin-bottom: 1.5rem;">
                    <h4><i class="fas fa-filter"></i> Фильтры</h4>
                    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem; margin-top: 1rem;">
                        <div>
                            <label style="display: block; margin-bottom: 0.5rem; font-weight: 600;">Поиск:</label>
                            <input type="text" id="case2-search" placeholder="Название..." 
                                   oninput="case2SearchNodes(this.value)"
                                   style="width: 100%; padding: 0.5rem; border: 1px solid #ddd; border-radius: 4px;">
                        </div>
                        <div>
                            <label style="display: block; margin-bottom: 0.5rem; font-weight: 600;">
                                Мин. связей: <span id="case2-threshold-val">1</span>
                            </label>
                            <input type="range" id="case2-threshold" min="1" max="20" value="1" 
                                   oninput="case2UpdateThreshold(this.value)"
                                   style="width: 100%;">
                        </div>
                    </div>
                    <div style="margin-top: 1rem; display: flex; gap: 0.5rem;">
                        <button onclick="case2ResetGraph()" class="btn-secondary">
                            <i class="fas fa-undo"></i> Сбросить
                        </button>
                        <button onclick="case2FitGraph()" class="btn-secondary">
                            <i class="fas fa-expand"></i> По размеру
                        </button>
                        <button onclick="case2ExportGraph()" class="btn-secondary">
                            <i class="fas fa-download"></i> Экспорт PNG
                        </button>
                    </div>
                </div>

                <div id="case2-graph-container" style="display: none;">
                    <div style="background: white; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); overflow: hidden; margin-bottom: 1.5rem;">
                        <div id="cy-container" style="width: 100%; height: 600px; background: #f8f9fa;"></div>
                    </div>

                    <div style="background: white; padding: 1.5rem; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); margin-bottom: 1.5rem;">
                        <h4><i class="fas fa-info-circle"></i> Легенда</h4>
                        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem; margin-top: 1rem;">
                            <div style="display: flex; align-items: center; gap: 0.5rem;">
                                <div style="width: 25px; height: 25px; background: #4A90E2; border-radius: 50%;"></div>
                                <span>Депутат</span>
                            </div>
                            <div style="display: flex; align-items: center; gap: 0.5rem;">
                                <div style="width: 25px; height: 25px; background: #7B68EE; border-radius: 8px;"></div>
                                <span>Регион/Область</span>
                            </div>
                            <div style="display: flex; align-items: center; gap: 0.5rem;">
                                <div style="width: 25px; height: 25px; background: #FF6B6B; border-radius: 4px;"></div>
                                <span>Отрасль</span>
                            </div>
                        </div>
                    </div>

                    <div id="case2-node-info" style="display: none; background: white; padding: 1.5rem; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);"></div>
                </div>

                <div id="case2-results"></div>
            </div>
        </div>
    `;
    modal.style.display = 'flex';
    loadCase2DeputiesList();
}

async function loadCase2DeputiesList() {
    try {
        const response = await fetch(`${API_URL}/deputies/list`);
        const data = await response.json();

        if (data.success) {
            case2AllDeputies = data.deputies;

            const select = document.getElementById('case2-deputy-select');
            select.innerHTML = '<option value="all">Все депутаты</option>';

            data.deputies.forEach(deputy => {
                const option = document.createElement('option');
                option.value = deputy;
                option.textContent = deputy;
                select.appendChild(option);
            });
        }
    } catch (error) {
        console.error('Ошибка загрузки списка депутатов:', error);
    }
}

async function loadCase2DeputyGraph() {
    const select = document.getElementById('case2-deputy-select');
    const deputyName = select.value;

    if (!deputyName) {
        alert('Выберите депутата');
        return;
    }

    const resultsDiv = document.getElementById('case2-results');
    resultsDiv.innerHTML = `
        <div style="text-align: center; padding: 3rem;">
            <div class="spinner"></div>
            <p style="margin-top: 1rem;">Загрузка данных графа...</p>
        </div>
    `;

    try {
        const response = await fetch(`${API_URL}/graph/real/${encodeURIComponent(deputyName)}`);
        const data = await response.json();

        if (!data.success) {
            resultsDiv.innerHTML = `
                <div style="background: #fee; padding: 1.5rem; border-radius: 8px; border-left: 4px solid #e74c3c;">
                    <h3 style="color: #e74c3c;">Ошибка</h3>
                    <p>${data.error}</p>
                </div>
            `;
            return;
        }

        document.getElementById('case2-graph-container').style.display = 'block';
        document.getElementById('case2-filters').style.display = 'block';
        resultsDiv.innerHTML = '';

        case2CreateGraph(data.nodes, data.edges);
        case2DisplayStats(data.stats);

    } catch (error) {
        console.error('Ошибка:', error);
        resultsDiv.innerHTML = `
            <div style="background: #fee; padding: 1.5rem; border-radius: 8px; border-left: 4px solid #e74c3c;">
                <h3 style="color: #e74c3c;">Ошибка подключения</h3>
                <p>${error.message}</p>
            </div>
        `;
    }
}

async function loadCase2CoauthorshipGraph() {
    const resultsDiv = document.getElementById('case2-results');

    resultsDiv.innerHTML = `
        <div style="background: white; padding: 2rem; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
            <h3 style="margin-top: 0;"><i class="fas fa-project-diagram"></i> Граф соавторства депутатов 8-го созыва</h3>
            
            <div style="background: #e3f2fd; padding: 1rem; border-radius: 8px; margin-bottom: 1.5rem; border-left: 4px solid #2196F3;">
                <p style="margin: 0;">
                    <i class="fas fa-info-circle"></i> 
                    Граф показывает связи между 448 депутатами через соавторство законопроектов. 
                    Чем толще линия - тем больше совместных законопроектов.
                </p>
            </div>

            <div style="margin: 1.5rem 0;">
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem; background: #f5f5f5; padding: 1rem; border-radius: 8px;">
                    <div><strong>Депутатов:</strong> 448</div>
                    <div><strong>Связей:</strong> 40,654</div>
                    <div><strong>Источник:</strong> GEXF файл</div>
                    <div><strong>Максимальное соавторство:</strong> 607 законопроектов</div>
                </div>
            </div>

            <div style="text-align: center; margin: 2rem 0;">
                <img src="../../images/coauthorship_graph.png" 
                     alt="Граф соавторства депутатов" 
                     style="max-width: 100%; height: auto; border: 1px solid #ddd; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); cursor: pointer;"
                     onclick="window.open(this.src, '_blank')"
                     onerror="this.style.display='none'; this.nextElementSibling.style.display='block';">
                <div style="display: none; padding: 3rem; background: #fff3cd; border: 2px dashed #ffc107; border-radius: 8px; margin-top: 1rem;">
                    <i class="fas fa-exclamation-triangle" style="font-size: 3rem; color: #ff9800;"></i>
                    <h4>Изображение не найдено</h4>
                    <p>Пожалуйста, поместите файл <code>coauthorship_graph.png</code> в папку <code>static/images/</code></p>
                    <p style="font-size: 0.9rem; color: #666; margin-top: 1rem;">
                        Вы можете использовать любое изображение графа соавторства в формате PNG или JPG.
                    </p>
                </div>
            </div>

            <div style="margin-top: 2rem; padding: 1rem; background: #f9f9f9; border-radius: 8px; border-left: 4px solid #4caf50;">
                <h4 style="margin-top: 0;"><i class="fas fa-chart-bar"></i> Основные метрики</h4>
                <ul style="margin: 0.5rem 0;">
                    <li><strong>Средняя степень узла:</strong> ~90 связей на депутата</li>
                    <li><strong>Плотность графа:</strong> 0.408</li>
                    <li><strong>Сообщества:</strong> 11 фракций</li>
                    <li><strong>Наиболее активные пары:</strong> БПП ↔ НФ, БПП ↔ РпОЛ</li>
                </ul>
                <p style="margin-top: 1rem; font-size: 0.9rem; color: #666;">
                    <i class="fas fa-mouse-pointer"></i> Нажмите на изображение, чтобы открыть его в полном размере
                </p>
            </div>
        </div>
    `;

    // Скрываем контейнер графа
    document.getElementById('case2-graph-container').style.display = 'none';
    document.getElementById('case2-filters').style.display = 'none';
}

function case2CreateGraph(nodes, edges) {
    if (typeof cytoscape === 'undefined') {
        alert('Библиотека Cytoscape.js не загружена!');
        return;
    }

    if (cy) {
        cy.destroy();
    }

    const elements = [];

    nodes.forEach(node => {
        // Формируем путь к фото депутата
        let photoUrl = 'static/images/deputies/default.jpg';

        if (node.type === 'deputy' && node.label) {
            // Убираем фракцию в скобках если есть
            let cleanName = node.label;
            if (cleanName.includes('(')) {
                cleanName = cleanName.substring(0, cleanName.indexOf('(')).trim();
            }

            // Кодируем кириллицу для URL (браузер сам разберётся)
            const encodedName = encodeURIComponent(cleanName + '.jpg');
            photoUrl = `static/images/deputies/${encodedName}`;

            console.log(`Deputy: ${cleanName} → Photo: ${photoUrl}`);
        }

        elements.push({
            group: 'nodes',
            data: {
                id: node.id,
                label: node.label,
                type: node.type,
                degree: node.degree,
                photo: photoUrl,
                ...node.data
            }
        });
    });

    edges.forEach(edge => {
        elements.push({
            group: 'edges',
            data: {
                id: edge.id,
                source: edge.source,
                target: edge.target,
                weight: edge.weight,
                label: edge.label || ''
            }
        });
    });

    cy = cytoscape({
        container: document.getElementById('cy-container'),
        elements: elements,
        style: [
            {
                selector: 'node[type="deputy"]',
                style: {
                    // Фото депутата как фон
                    'background-image': 'data(photo)',
                    'background-fit': 'cover',
                    'background-clip': 'none',

                    // Если фото не загрузилось - цветной круг
                    'background-color': '#4A90E2',

                    'label': 'data(label)',
                    'width': node => 50 + Math.min(node.data('degree') * 2, 40),
                    'height': node => 50 + Math.min(node.data('degree') * 2, 40),
                    'font-size': '10px',
                    'font-weight': 'bold',

                    // Текст под кругом
                    'text-valign': 'bottom',
                    'text-halign': 'center',
                    'text-margin-y': 5,
                    'color': '#2c3e50',
                    'text-outline-width': 2,
                    'text-outline-color': '#fff',

                    // Рамка вокруг фото
                    'border-width': 3,
                    'border-color': '#2c5aa0',
                    'border-style': 'solid',

                    // Тень для объёма
                    'box-shadow': '0 4px 8px rgba(0,0,0,0.3)'
                }
            },
            {
                selector: 'node[type="region"]',
                style: {
                    'background-color': '#7B68EE',
                    'shape': 'roundrectangle',
                    'label': 'data(label)',
                    'width': 80,
                    'height': 40,
                    'font-size': '10px',
                    'text-valign': 'center',
                    'text-halign': 'center',
                    'color': '#fff',
                    'text-outline-width': 1,
                    'text-outline-color': '#5848c7'
                }
            },
            {
                selector: 'node[type="activity"]',
                style: {
                    'background-color': node => case2GetActivityColor(node.data('label')),
                    'shape': 'rectangle',
                    'label': 'data(label)',
                    'width': 100,
                    'height': 35,
                    'font-size': '9px',
                    'text-valign': 'center',
                    'text-halign': 'center',
                    'color': '#fff',
                    'text-outline-width': 1,
                    'text-outline-color': '#000',
                    'text-wrap': 'wrap',
                    'text-max-width': 90
                }
            },
            {
                selector: 'edge',
                style: {
                    'width': edge => Math.max(1, Math.min(edge.data('weight') * 0.8, 10)),
                    'line-color': '#95a5a6',
                    'curve-style': 'bezier',
                    'opacity': 0.6
                }
            },
            {
                selector: '.dimmed',
                style: {
                    'opacity': 0.2
                }
            },
            {
                selector: '.highlighted',
                style: {
                    'opacity': 1,
                    'z-index': 999
                }
            }
        ],
        layout: {
            name: 'cose',
            idealEdgeLength: 150,
            nodeOverlap: 30,
            fit: true,
            padding: 40
        }
    });

    case2SetupGraphEvents();
}

function case2GetActivityColor(activity) {
    const colorMap = {
        'Сельское, лесное хозяйство, охота, рыболовство и рыбоводство': '#6BCF7F',
        'Добыча полезных ископаемых': '#8B4513',
        'Производство пищевых продуктов, напитков': '#FFB347',
        'Производство текстильных изделий, одежды': '#DA70D6',
        'Химическое произовдство': '#FF6B6B',
        'Обработка и переработка древесины': '#CD853F',
        'Производство и ремонт машин, оборудования': '#708090',
        'Приборостроение и электрооборудование': '#4169E1',
        'Металлургия': '#696969',
        'ТЭК (добыча, торговля, переработка, транспортировка)': '#FFA500',
        'Строительство и ЖКХ, водо и электроснабжение, операции с недвижимостью': '#FF9800',
        'Торговля оптовая и розничная; ремонт автотранспортных средств и мотоциклов': '#20B2AA',
        'Транспортировка и хранение': '#4ECDC4',
        'Деятельность гостиниц и предприятий общественного питания': '#F4A460',
        'Деятельность в области информации и связи': '#667eea',
        'Деятельность финансовая и страховая': '#FFD93D',
        'Деятельность профессиональная, научная и техническая': '#9B59B6',
        'Деятельность в области культуры, искусства, спорта, организации досуга и развлечений': '#E91E63',
        'Политические партии, общественные организации, НГО, НПО': '#00BCD4',
        'Госуправление, госслужба': '#E74C3C',
        'Оборона и безопасность': '#34495E',
        'Здравоохранение и оказание социальной помощи': '#1ABC9C'
    };
    return colorMap[activity] || '#95a5a6';
}

function case2SetupGraphEvents() {
    cy.on('tap', 'node', function(evt) {
        const node = evt.target;
        case2ShowNodeInfo(node);
        case2HighlightNeighbors(node);
    });

    cy.on('tap', function(evt) {
        if (evt.target === cy) {
            case2ResetHighlight();
            case2HideNodeInfo();
        }
    });
}

function case2HighlightNeighbors(node) {
    cy.elements().removeClass('highlighted dimmed');
    const neighborhood = node.neighborhood().add(node);
    cy.elements().addClass('dimmed');
    neighborhood.removeClass('dimmed').addClass('highlighted');
}

function case2ResetHighlight() {
    cy.elements().removeClass('highlighted dimmed');
}

function case2ShowNodeInfo(node) {
    const data = node.data();
    const infoDiv = document.getElementById('case2-node-info');

    let content = `<h4><i class="fas fa-info-circle"></i> ${data.label}</h4>`;

    if (data.type === 'deputy') {
        content += `<p><strong>Связей:</strong> ${data.degree}</p>`;
    }

    infoDiv.innerHTML = content;
    infoDiv.style.display = 'block';
}

function case2HideNodeInfo() {
    document.getElementById('case2-node-info').style.display = 'none';
}

function case2SearchNodes(query) {
    if (!cy || !query || query.length < 2) {
        case2ResetHighlight();
        return;
    }

    case2ResetHighlight();

    const found = cy.nodes().filter(node =>
        node.data('label').toLowerCase().includes(query.toLowerCase())
    );

    if (found.length > 0) {
        cy.elements().addClass('dimmed');
        found.removeClass('dimmed').addClass('highlighted');
        cy.animate({ fit: { eles: found, padding: 50 }, duration: 500 });
    }
}

function case2UpdateThreshold(value) {
    document.getElementById('case2-threshold-val').textContent = value;
    if (!cy) return;

    cy.edges().forEach(edge => {
        if (edge.data('weight') >= parseInt(value)) {
            edge.show();
        } else {
            edge.hide();
        }
    });
}

function case2ResetGraph() {
    document.getElementById('case2-search').value = '';
    document.getElementById('case2-threshold').value = '1';
    document.getElementById('case2-threshold-val').textContent = '1';

    if (cy) {
        cy.elements().show();
        case2ResetHighlight();
        case2HideNodeInfo();
        cy.layout({ name: 'cose', fit: true }).run();
    }
}

function case2FitGraph() {
    if (cy) cy.fit(cy.elements(':visible'), 40);
}

function case2ExportGraph() {
    if (!cy) return;
    const png = cy.png({ output: 'blob', bg: 'white', full: true, scale: 2 });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(png);
    link.download = `deputy-graph-${Date.now()}.png`;
    link.click();
}

function case2DisplayStats(stats) {
    const resultsDiv = document.getElementById('case2-results');
    resultsDiv.innerHTML = `
        <div style="background: white; padding: 1.5rem; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
            <h4><i class="fas fa-chart-bar"></i> Статистика графа</h4>
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 1rem; margin-top: 1rem;">
                <div class="stat-card">
                    <div class="stat-value">${stats.nodes_count}</div>
                    <div class="stat-label">Узлов</div>
                </div>
                <div class="stat-card">
                    <div class="stat-value">${stats.edges_count}</div>
                    <div class="stat-label">Связей</div>
                </div>
            </div>
        </div>
    `;
}

// ============================================
// КЕЙС 3: Сравнение прогнозов с реальностью
// ============================================

function openCase3() {
    const modal = document.getElementById('modal');
    modal.innerHTML = `
        <div class="modal-content" style="max-width: 1400px;">
            <span class="close-modal" onclick="closeModal()">&times;</span>
            
            <div class="modal-header" style="background: linear-gradient(135deg, #9b59b6 0%, #8e44ad 100%);">
                <i class="fas fa-balance-scale"></i>
                <div>
                    <h2>Кейс 3: Сравнение прогнозов с реальностью</h2>
                    <p>На примере законопроекта № 2273 «О внесении изменений в Закон Украины Об Акционерных обществах»</p>
                </div>
            </div>
            
            <div class="modal-body">
                <div style="background: #f5f3ff; padding: 1.5rem; border-radius: 8px; margin-bottom: 2rem;">
                    <label style="font-weight: 600; margin-bottom: 0.5rem; display: block;">
                        <i class="fas fa-calendar-alt"></i> Выберите голосование:
                    </label>
                    <select id="case3-voting-select" style="width: 100%; padding: 0.75rem; border-radius: 4px; border: 2px solid #9b59b6; font-size: 1rem;">
                        <option value="">Загрузка...</option>
                    </select>
                </div>
                
                <button onclick="loadCase3Data()" class="btn-primary" style="width: 100%; padding: 1rem; font-size: 1.1rem; margin-bottom: 2rem;">
                    <i class="fas fa-chart-line"></i> Загрузить анализ
                </button>
                
                <div id="case3-results"></div>
            </div>
        </div>
    `;
    modal.style.display = 'flex';
    loadVotingsList();
}

async function loadVotingsList() {
    try {
        const response = await fetch(`${API_URL}/votings_list`);
        const data = await response.json();

        if (data.success) {
            const select = document.getElementById('case3-voting-select');
            select.innerHTML = data.votings.map(v => `
                <option value="${v.id}">${v.date} - ${v.name}</option>
            `).join('');
            case3CurrentVoting = data.votings[0].id;
        }
    } catch (error) {
        console.error('Ошибка:', error);
    }
}

async function loadCase3Data() {
    const select = document.getElementById('case3-voting-select');
    const votingId = select.value;

    if (!votingId) {
        alert('Выберите голосование');
        return;
    }

    const resultsDiv = document.getElementById('case3-results');
    resultsDiv.innerHTML = `
        <div style="text-align: center; padding: 3rem;">
            <div class="spinner"></div>
            <p style="margin-top: 1rem;">Загрузка данных и расчёт прогнозов...</p>
            <p style="color: #666; font-size: 0.9rem; margin-top: 0.5rem;">Это может занять 10-15 секунд</p>
        </div>
    `;

    try {
        const response = await fetch(`${API_URL}/predict_voting/${votingId}`, {
            method: 'POST'
        });

        const data = await response.json();

        if (!data.success) {
            resultsDiv.innerHTML = `
                <div style="background: #fee; padding: 1.5rem; border-radius: 8px; border-left: 4px solid #e74c3c;">
                    <h3 style="color: #e74c3c;">Ошибка</h3>
                    <p>${data.error}</p>
                </div>
            `;
            return;
        }

        case3CurrentData = data.deputies;
        displayCase3Results(data);

    } catch (error) {
        console.error('Ошибка:', error);
        resultsDiv.innerHTML = `
            <div style="background: #fee; padding: 1.5rem; border-radius: 8px; border-left: 4px solid #e74c3c;">
                <h3 style="color: #e74c3c;">Ошибка подключения</h3>
                <p><strong>Сообщение:</strong> ${error.message}</p>
            </div>
        `;
    }
}

function displayCase3Results(data) {
    const { deputies, statistics } = data;
    const resultsDiv = document.getElementById('case3-results');

    const factions = [...new Set(deputies.map(d => d.faction))].sort();
    const voteTypes = ['За', 'Против', 'Воздержался', 'Не голосовал', 'Отсутствовал'];

    resultsDiv.innerHTML = `
        <!-- 4 КАРТОЧКИ СТАТИСТИКИ -->
        <div class="case3-stats-grid">
            <div class="stat-card" style="background: linear-gradient(135deg, #3498db 0%, #2980b9 100%); color: white;">
                <i class="fas fa-users"></i>
                <div class="stat-value">${statistics.total}</div>
                <div class="stat-label">Всего депутатов</div>
            </div>
            
            <div class="stat-card" style="background: linear-gradient(135deg, #27ae60 0%, #229954 100%); color: white;">
                <i class="fas fa-check-circle"></i>
                <div class="stat-value">${statistics.correct}</div>
                <div class="stat-label">Правильных прогнозов</div>
            </div>
            
            <div class="stat-card" style="background: linear-gradient(135deg, #9b59b6 0%, #8e44ad 100%); color: white;">
                <i class="fas fa-percentage"></i>
                <div class="stat-value">${statistics.f1_score || statistics.accuracy}%</div>
                <div class="stat-label">Точность модели F1</div>
            </div>
            
            <div class="stat-card" style="background: linear-gradient(135deg, ${statistics.real_passed ? '#27ae60' : '#e74c3c'} 0%, ${statistics.real_passed ? '#229954' : '#c0392b'} 100%); color: white;">
                <i class="fas fa-${statistics.real_passed ? 'thumbs-up' : 'thumbs-down'}"></i>
                <div class="stat-value">${statistics.real_passed ? 'ПРИНЯТ' : 'ОТКЛОНЁН'}</div>
                <div class="stat-label">Результат в реальности</div>
            </div>
        </div>
        
        <!-- СРАВНЕНИЕ: РЕАЛЬНОСТЬ vs ПРОГНОЗ -->
        <div class="case3-comparison">
            <div class="comparison-block">
                <h3><i class="fas fa-flag-checkered"></i> Реальность</h3>
                <div class="vote-breakdown">
                    ${voteTypes.map(type => {
                        const count = statistics.real_counts[type] || 0;
                        const color = getVoteColor(type);
                        return `
                            <div class="vote-item">
                                <span class="vote-label" style="background: ${color};">${type}</span>
                                <span class="vote-count">${count}</span>
                            </div>
                        `;
                    }).join('')}
                </div>
                <div style="margin-top: 1rem; padding: 0.75rem; background: ${statistics.real_passed ? '#d4edda' : '#f8d7da'}; border-radius: 4px; text-align: center; font-weight: 600;">
                    <i class="fas fa-${statistics.real_passed ? 'check' : 'times'}"></i> Закон ${statistics.real_passed ? 'принят' : 'не принят'} (${statistics.real_counts['За']} "За" из 226 необходимых)
                </div>
            </div>
            
            
            <div class="comparison-block">
                <h3><i class="fas fa-robot"></i> Прогноз модели</h3>
                <div class="vote-breakdown">
                    ${voteTypes.map(type => {
                        const count = statistics.pred_counts[type] || 0;
                        const color = getVoteColor(type);
                        return `
                            <div class="vote-item">
                                <span class="vote-label" style="background: ${color};">${type}</span>
                                <span class="vote-count">${count}</span>
                            </div>
                        `;
                    }).join('')}
                </div>
                <div style="margin-top: 1rem; padding: 0.75rem; background: ${statistics.pred_passed ? '#d4edda' : '#f8d7da'}; border-radius: 4px; text-align: center; font-weight: 600;">
                    <i class="fas fa-${statistics.pred_passed ? 'check' : 'times'}"></i> Модель: принят (${statistics.pred_counts['За']} "За" из 226 необходимых)
                </div>
            </div>
        </div>
        
        <!-- ФИЛЬТРЫ -->
        <div class="case3-filters">
            <h3><i class="fas fa-filter"></i> Фильтры</h3>
            
            <div class="filters-grid">
                <div class="filter-group">
                    <label>По фракции:</label>
                    <select id="case3-filter-faction" onchange="applyCase3Filters()">
                        <option value="">Все фракции</option>
                        ${factions.map(f => `<option value="${f}">${f}</option>`).join('')}
                    </select>
                </div>
                
                <div class="filter-group">
                    <label>Реальный голос:</label>
                    <select id="case3-filter-real" onchange="applyCase3Filters()">
                        <option value="">Все</option>
                        ${voteTypes.map(v => `<option value="${v}">${v}</option>`).join('')}
                    </select>
                </div>
                
                <div class="filter-group">
                    <label>Прогноз модели:</label>
                    <select id="case3-filter-pred" onchange="applyCase3Filters()">
                        <option value="">Все</option>
                        ${voteTypes.map(v => `<option value="${v}">${v}</option>`).join('')}
                    </select>
                </div>
                
                <div class="filter-group">
                    <label>Совпадение:</label>
                    <select id="case3-filter-correct" onchange="applyCase3Filters()">
                        <option value="">Все</option>
                        <option value="true">Только правильные ✓</option>
                        <option value="false">Только ошибки ✗</option>
                    </select>
                </div>
            </div>
            
            <button onclick="resetCase3Filters()" class="btn-secondary" style="margin-top: 1rem;">
                <i class="fas fa-redo"></i> Сбросить фильтры
            </button>
        </div>
        
        <!-- ДЕТАЛЬНАЯ ТАБЛИЦА -->
        <div class="case3-table-section">
            <h3><i class="fas fa-table"></i> Детальная таблица</h3>
            <div id="case3-table-container"></div>
        </div>
    `;

    applyCase3Filters();
}

function applyCase3Filters() {
    const factionFilter = document.getElementById('case3-filter-faction')?.value || '';
    const realFilter = document.getElementById('case3-filter-real')?.value || '';
    const predFilter = document.getElementById('case3-filter-pred')?.value || '';
    const correctFilter = document.getElementById('case3-filter-correct')?.value || '';

    let filtered = case3CurrentData.filter(dep => {
        if (factionFilter && dep.faction !== factionFilter) return false;
        if (realFilter && dep.real_vote !== realFilter) return false;
        if (predFilter && dep.predicted_vote !== predFilter) return false;
        if (correctFilter !== '') {
            const isCorrect = dep.is_correct.toString();
            if (isCorrect !== correctFilter) return false;
        }
        return true;
    });

    renderCase3Table(filtered);
}

function renderCase3Table(deputies) {
    const container = document.getElementById('case3-table-container');

    if (deputies.length === 0) {
        container.innerHTML = `
            <div style="text-align: center; padding: 2rem; color: #666;">
                <p>Нет депутатов, соответствующих фильтрам</p>
            </div>
        `;
        return;
    }

    container.innerHTML = `
        <div style="margin-bottom: 1rem; color: #666;">
            Показано депутатов: <strong>${deputies.length}</strong> из ${case3CurrentData.length}
        </div>
        
        <div class="table-wrapper">
            <table class="case3-table">
                <thead>
                    <tr>
                        <th>ФИО депутата</th>
                        <th>Фракция</th>
                        <th>Реальный голос</th>
                        <th>Прогноз модели</th>
                        <th>Уверенность</th>
                        <th>✓</th>
                    </tr>
                </thead>
                <tbody>
                    ${deputies.map(dep => {
                        const realColor = getVoteColor(dep.real_vote);
                        const predColor = getVoteColor(dep.predicted_vote);
                        const matchIcon = dep.is_correct 
                            ? '<i class="fas fa-check-circle" style="color: #27ae60;"></i>' 
                            : '<i class="fas fa-times-circle" style="color: #e74c3c;"></i>';
                        
                        return `
                            <tr class="${!dep.is_correct ? 'error-row' : ''}">
                                <td><strong>${dep.fio}</strong></td>
                                <td><small>${dep.faction}</small></td>
                                <td>
                                    <span class="vote-badge" style="background: ${realColor};">
                                        ${dep.real_vote}
                                    </span>
                                </td>
                                <td>
                                    <span class="vote-badge" style="background: ${predColor};">
                                        ${dep.predicted_vote}
                                    </span>
                                </td>
                                <td>${dep.confidence}%</td>
                                <td>${matchIcon}</td>
                            </tr>
                        `;
                    }).join('')}
                </tbody>
            </table>
        </div>
    `;
}

function resetCase3Filters() {
    document.getElementById('case3-filter-faction').value = '';
    document.getElementById('case3-filter-real').value = '';
    document.getElementById('case3-filter-pred').value = '';
    document.getElementById('case3-filter-correct').value = '';
    applyCase3Filters();
}

function getVoteColor(vote) {
    const colors = {
        'За': '#27ae60',
        'Против': '#e74c3c',
        'Воздержался': '#f39c12',
        'Не голосовал': '#95a5a6',
        'Отсутствовал': '#34495e'
    };
    return colors[vote] || '#95a5a6';
}

// ============================================
// КЕЙС 4: Симулятор голосования
// ============================================

function openCase4() {
    const modal = document.getElementById('modal');
    modal.innerHTML = `
        <div class="modal-content" style="max-width: 1200px;">
            <span class="close-modal" onclick="closeModal()">&times;</span>
            
            <div class="modal-header" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);">
                <i class="fas fa-gavel"></i>
                <div>
                    <h2>Кейс 4: Симулятор голосования в Верховной Раде VIII созыва</h2>
                    <p>Создайте законопроект и узнайте его судьбу</p>
                </div>
            </div>
            
            <div class="modal-body">
                <div style="background: linear-gradient(135deg, #667eea15 0%, #764ba215 100%); 
                            padding: 1.5rem; border-radius: 12px; margin-bottom: 2rem; 
                            border-left: 4px solid #667eea;">
                    <h3 style="color: #667eea; margin-bottom: 0.5rem;">
                        <i class="fas fa-lightbulb"></i> Создайте законопроект и узнайте его судьбу
                    </h3>
                    <p style="color: #555; line-height: 1.6;">
                        Задайте параметры законопроекта и модель покажет как проголосуют все 423 депутата. 
                        Для принятия закона нужно минимум <strong>226 голосов "За"</strong>.
                    </p>
                </div>
                
                <form id="billForm">
                    <div style="background: white; padding: 2rem; border-radius: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
                        <h3 style="margin-top: 0; margin-bottom: 2rem; color: #2c3e50; font-size: 1.4rem;">
                            <i class="fas fa-file-alt"></i> Параметры законопроекта (8 параметров)
                        </h3>
                        
                        <div class="bill-params-grid">
                            <div class="param-card">
                                <div class="param-number">1</div>
                                <label class="param-label">
                                    <i class="fas fa-user-tie"></i> Инициатор законопроекта
                                </label>
                                <select name="mainExecutives" required class="param-select">
                                    <option value="0">Временная специальная комиссия ВР Украины</option>
                                    <option value="1">x (не указано)</option>
                                    <option value="2">Руководство Верховного Совета Украины</option>
                                    <option value="3">Комитет по вопросам Регламента и организации работы ВРУ</option>
                                    <option value="4">Комитет по вопросам аграрной политики и земельных отношений</option>
                                    <option value="5">Комитет по вопросам национальной безопасности и обороны</option>
                                    <option value="6">Комитет по вопросам европейской интеграции</option>
                                    <option value="7">Комитет по законодательному обеспечению правоохранительной деятельности</option>
                                    <option value="8">Комитет по вопросам информатизации и связи</option>
                                    <option value="9">Народный депутат Украины</option>
                                    <option value="10">Комитет по вопросам семьи, молодежной политики, спорта и туризма</option>
                                    <option value="11">Комитет по вопросам экономической политики</option>
                                    <option value="12">Комитет по свободе слова и информационной политики</option>
                                    <option value="13">Комитет по вопросам ТЭК, ядерной политики и ядерной безопасности</option>
                                    <option value="14">Комитет по вопросам транспорта</option>
                                    <option value="15">Комитет по вопросам здравоохранения</option>
                                    <option value="16">Комитет по делам ветеранов и лиц с инвалидностью</option>
                                    <option value="17">Комитет по вопросам бюджета</option>
                                    <option value="18">Комитет по вопросам правовой политики и правосудия</option>
                                    <option value="19">Комитет по предотвращению и противодействию коррупции</option>
                                    <option value="20">Комитет по вопросам экологической политики и Чернобыля</option>
                                    <option value="21">Комитет по правам человека, нацменьшинствам и межнацотношениям</option>
                                    <option value="22">Комитет по делам ветеранов, участников АТО и людей с инвалидностью</option>
                                    <option value="23">Комитет по вопросам промышленной политики и предпринимательства</option>
                                    <option value="24">Комитет по вопросам финансовой политики и банковской деятельности</option>
                                    <option value="25">Комитет по вопросам науки и образования</option>
                                    <option value="26">Комитет по вопросам строительства, градостроительства и ЖКХ</option>
                                    <option value="27">Комитет по вопросам социальной политики, занятости и пенсионного обеспечения</option>
                                    <option value="28">Комитет по вопросам госстроительства, региональной политики и местного самоуправления</option>
                                    <option value="29">Комитет по вопросам налоговой и таможенной политики</option>
                                    <option value="30">Комитет по вопросам культуры и духовности</option>
                                    <option value="31">Комитет по иностранным делам</option>
                                </select>
                            </div>
                            
                            <div class="param-card">
                                <div class="param-number">2</div>
                                <label class="param-label">
                                    <i class="fas fa-folder-open"></i> Рубрика законопроекта
                                </label>
                                <select name="rubric" required class="param-select">
                                    <option value="0">Государственное строительство</option>
                                    <option value="1">Экономическая политика</option>
                                    <option value="2">Социальная политика</option>
                                    <option value="3">Правовая политика</option>
                                    <option value="4">Безопасность и оборона</option>
                                    <option value="5">Отраслевое развитие</option>
                                    <option value="6">Гуманитарная политика</option>
                                    <option value="7">Международные соглашения</option>
                                </select>
                            </div>
                            
                            <div class="param-card">
                                <div class="param-number">3</div>
                                <label class="param-label">
                                    <i class="fas fa-file-contract"></i> Тип законопроекта
                                </label>
                                <select name="type" required class="param-select">
                                    <option value="0">Проект Закона</option>
                                    <option value="1">Проект Постановления</option>
                                    <option value="2">Проект Заявления</option>
                                    <option value="3">Предложения Президента</option>
                                </select>
                            </div>
                            
                            <div class="param-card">
                                <div class="param-number">4</div>
                                <label class="param-label">
                                    <i class="fas fa-building"></i> Комитет инициатора
                                </label>
                                <select name="initiators_sort" required class="param-select">
                                    <option value="0">Комитет по экономике</option>
                                    <option value="1">Комитет по финансам</option>
                                    <option value="2">Комитет по внешней политике</option>
                                </select>
                            </div>
                            
                            <div class="param-card">
                                <div class="param-number">5</div>
                                <label class="param-label">
                                    <i class="fas fa-users"></i> Количество инициаторов
                                </label>
                                <input type="number" name="N_initiators" min="1" max="100" value="10" required class="param-select">
                                <small style="color: #7f8c8d; font-size: 0.85rem; margin-top: 0.25rem; display: block;">
                                    От 1 до 100 депутатов
                                </small>
                            </div>
                            
                            <div class="param-card">
                                <div class="param-number">6</div>
                                <label class="param-label">
                                    <i class="fas fa-calendar-alt"></i> Сессия
                                </label>
                                <select name="Session" required class="param-select">
                                    <option value="1">1-я сессия</option>
                                    <option value="2">2-я сессия</option>
                                    <option value="3">3-я сессия</option>
                                    <option value="4" selected>4-я сессия</option>
                                    <option value="5">5-я сессия</option>
                                    <option value="6">6-я сессия</option>
                                    <option value="7">7-я сессия</option>
                                </select>
                            </div>
                            
                            <div class="param-card">
                                <div class="param-number">7</div>
                                <label class="param-label">
                                    <i class="fas fa-edit"></i> Количество поправок
                                </label>
                                <input type="number" name="ammendments_authors_sorted" min="0" max="1000" value="200" required class="param-select">
                                <small style="color: #7f8c8d; font-size: 0.85rem; margin-top: 0.25rem; display: block;">
                                    От 0 до 1000 поправок
                                </small>
                            </div>
                            
                            <div class="param-card">
                                <div class="param-number">8</div>
                                <label class="param-label">
                                    <i class="fas fa-vote-yea"></i> Тип процедуры голосования
                                </label>
                                <select name="meta_type_name_eng" required class="param-select">
                                    <option value="agenda">Постановка на голосование (первое чтение)</option>
                                    <option value="president">Голосование по президентскому законопроекту</option>
                                    <option value="second_voting">Второе чтение законопроекта</option>
                                    <option value="final_voting">Третье чтение (финальное)</option>
                                    <option value="ammendments">Голосование по поправкам</option>
                                    <option value="signal_voting">Сигнальное голосование</option>
                                    <option value="cancel">Голосование по отмене закона</option>
                                    <option value="not_classified">Не классифицировано</option>
                                    <option value="short_procedure">Сокращенная процедура</option>
                                </select>
                            </div>
                        </div>
                        
                        <button type="submit" class="btn-simulate" style="margin-top: 2rem;">
                            <i class="fas fa-rocket"></i> Запустить голосование
                        </button>
                    </div>
                </form>
                
                <div id="simulationResults"></div>
            </div>
        </div>
    `;

    modal.style.display = 'flex';
    document.getElementById('billForm').addEventListener('submit', simulateVoting);
}

async function simulateVoting(e) {
    e.preventDefault();

    const form = e.target;
    const formData = new FormData(form);

    const mainExecutives = parseFloat(formData.get('mainExecutives'));
    const initiators_sort = parseFloat(formData.get('initiators_sort'));

    // Автоматическая проверка: совпадает ли принадлежность инициатора с комитетом
    const mp_law_same_com = (mainExecutives === initiators_sort) ? 1 : 0;

    const params = {
        mainExecutives: mainExecutives,
        rubric: parseFloat(formData.get('rubric')),
        type: parseFloat(formData.get('type')),
        initiators_sort: initiators_sort,
        N_initiators: parseFloat(formData.get('N_initiators')),
        Session: parseFloat(formData.get('Session')),
        ammendments_authors_sorted: parseFloat(formData.get('ammendments_authors_sorted')),
        meta_type_name_eng: formData.get('meta_type_name_eng'),
        mp_law_same_com: mp_law_same_com
    };

    const resultsDiv = document.getElementById('simulationResults');
    resultsDiv.innerHTML = `
        <div style="text-align: center; padding: 2rem; margin-top: 2rem; background: #f8f9fa; border-radius: 8px;">
            <div class="spinner"></div>
            <p style="margin-top: 1rem; font-size: 1.1rem;">Симуляция голосования...</p>
            <p style="color: #7f8c8d; font-size: 0.9rem; margin-top: 0.5rem;">
                ⏰ Первый запрос может занять до 60 секунд
            </p>
            <p style="color: #667eea; font-size: 0.85rem; margin-top: 0.5rem;">
                ℹ️ mp_law_same_com: ${mp_law_same_com === 1 ? 'Совпадает ✓' : 'Не совпадает ✗'}
            </p>
        </div>
    `;

    try {
        const response = await fetch(`${API_URL}/simulate`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(params)
        });

        const data = await response.json();

        if (!data.success) {
            resultsDiv.innerHTML = `
                <div style="background: #fee; padding: 1rem; border-radius: 8px; margin-top: 2rem; border-left: 4px solid #e74c3c;">
                    <strong style="color: #e74c3c;">Ошибка симуляции:</strong> ${data.error}
                </div>
            `;
            return;
        }

        case4SimulationResults = data;
        displaySimulationResults(data);

    } catch (error) {
        console.error('Ошибка симуляции:', error);
        resultsDiv.innerHTML = `
            <div style="background: #fee; padding: 1rem; border-radius: 8px; margin-top: 2rem; border-left: 4px solid #e74c3c;">
                <strong style="color: #e74c3c;">Ошибка:</strong> ${error.message}
            </div>
        `;
    }
}

function displaySimulationResults(data) {
    const resultsDiv = document.getElementById('simulationResults');

    const resultColor = data.passed ? '#27ae60' : '#e74c3c';
    const resultIcon = data.passed ? 'fa-check-circle' : 'fa-times-circle';
    const resultText = data.passed ? 'ПРИНЯТ' : 'ОТКЛОНЁН';

    resultsDiv.innerHTML = `
        <div style="margin-top: 2rem; animation: fadeIn 0.5s;">
            <div style="background: ${resultColor}; color: white; padding: 2rem; border-radius: 12px; text-align: center; margin-bottom: 2rem;">
                <i class="fas ${resultIcon}" style="font-size: 4rem; margin-bottom: 1rem;"></i>
                <h2 style="font-size: 2.5rem; margin: 0;">${resultText}</h2>
                <p style="font-size: 1.3rem; margin-top: 0.5rem; opacity: 0.95;">
                    ${data.vote_counts['За']} из 423 голосов "За"
                </p>
                <p style="font-size: 1rem; margin-top: 0.5rem; opacity: 0.9;">
                    ${data.passed ? 'Законопроект набрал необходимое количество голосов' : 'Недостаточно голосов для принятия (нужно ≥226)'}
                </p>
            </div>
            
            <!-- Кнопка сравнения с реальностью -->
            <div style="text-align: center; margin-bottom: 2rem;">
                <button onclick="showRealVotingComparison()" class="btn-primary" style="padding: 1rem 2rem; font-size: 1.1rem;">
                    <i class="fas fa-balance-scale"></i> Сравнить с реальным голосованием
                </button>
                <p style="color: #666; margin-top: 0.5rem; font-size: 0.9rem;">
                    Загрузит реальные данные и покажет разницу между прогнозом и реальностью
                </p>
            </div>
            
            <div style="display: grid; grid-template-columns: repeat(5, 1fr); gap: 1rem; margin-bottom: 2rem;">
                ${generateVoteCards(data.vote_counts)}
            </div>
            
            <div style="background: white; padding: 1.5rem; border-radius: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); margin-bottom: 2rem;">
                <h3 style="margin-bottom: 1rem;"><i class="fas fa-users"></i> Голосование по фракциям</h3>
                <div style="overflow-x: auto;">
                    ${generateFactionTable(data.faction_votes)}
                </div>
            </div>
            
            <details style="background: white; padding: 1.5rem; border-radius: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
                <summary style="cursor: pointer; font-size: 1.2rem; font-weight: 600; padding: 0.5rem;">
                    <i class="fas fa-list"></i> Показать детали по всем депутатам (${data.total_deputies})
                </summary>
                <div style="margin-top: 1rem; max-height: 500px; overflow-y: auto;">
                    ${generateDeputiesTable(data.deputies)}
                </div>
            </details>
        </div>
    `;
}

async function showRealVotingComparison() {
    const resultsDiv = document.getElementById('simulationResults');

    resultsDiv.innerHTML += `
        <div id="real-voting-section" style="margin-top: 2rem; padding: 2rem; background: #f8f9fa; border-radius: 12px; text-align: center;">
            <div class="spinner"></div>
            <p style="margin-top: 1rem;">Загрузка реальных данных голосования...</p>
        </div>
    `;

    try {
        const response = await fetch(`${API_URL}/predict_voting/94008`, {
            method: 'POST'
        });

        const realData = await response.json();

        if (!realData.success) {
            document.getElementById('real-voting-section').innerHTML = `
                <div style="background: #fee; padding: 1rem; border-radius: 8px; border-left: 4px solid #e74c3c;">
                    <strong style="color: #e74c3c;">Ошибка:</strong> ${realData.error}
                </div>
            `;
            return;
        }

        displayVotingComparison(case4SimulationResults, realData);

    } catch (error) {
        console.error('Ошибка загрузки реального голосования:', error);
        document.getElementById('real-voting-section').innerHTML = `
            <div style="background: #fee; padding: 1rem; border-radius: 8px; border-left: 4px solid #e74c3c;">
                <strong style="color: #e74c3c;">Ошибка подключения:</strong> ${error.message}
            </div>
        `;
    }
}

function displayVotingComparison(simulationData, realData) {
    const section = document.getElementById('real-voting-section');

    const voteTypes = ['За', 'Против', 'Воздержался', 'Не голосовал', 'Отсутствовал'];

    section.innerHTML = `
        <h3 style="margin-bottom: 1.5rem; color: #2c3e50; text-align: center;">
            <i class="fas fa-balance-scale"></i> Сравнение: Симуляция vs Прогноз vs Реальность
        </h3>
        
        <div style="background: #fff3cd; padding: 1rem; border-radius: 8px; margin-bottom: 1.5rem; border-left: 4px solid #ffc107;">
            <strong>📌 Примечание:</strong> Показано реальное голосование от 08.04.2016 (ID: 94008) для сравнения с вашей симуляцией.
        </div>
        
        <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 1.5rem; margin-bottom: 2rem;">
            <!-- Симуляция -->
            <div class="comparison-block">
                <h3><i class="fas fa-robot"></i> Ваша симуляция</h3>
                <div class="vote-breakdown">
                    ${voteTypes.map(type => {
                        const count = simulationData.vote_counts[type] || 0;
                        const color = getVoteColor(type);
                        return `
                            <div class="vote-item">
                                <span class="vote-label" style="background: ${color};">${type}</span>
                                <span class="vote-count">${count}</span>
                            </div>
                        `;
                    }).join('')}
                </div>
                <div style="margin-top: 1rem; padding: 0.75rem; background: ${simulationData.passed ? '#d4edda' : '#f8d7da'}; border-radius: 4px; text-align: center; font-weight: 600;">
                    ${simulationData.passed ? '✅ Принят' : '❌ Не принят'} (${simulationData.vote_counts['За']} "За")
                </div>
            </div>
            
            <!-- Прогноз модели на реальные данные -->
            <div class="comparison-block">
                <h3><i class="fas fa-brain"></i> Прогноз модели</h3>
                <div class="vote-breakdown">
                    ${voteTypes.map(type => {
                        const count = realData.statistics.pred_counts[type] || 0;
                        const color = getVoteColor(type);
                        return `
                            <div class="vote-item">
                                <span class="vote-label" style="background: ${color};">${type}</span>
                                <span class="vote-count">${count}</span>
                            </div>
                        `;
                    }).join('')}
                </div>
                <div style="margin-top: 1rem; padding: 0.75rem; background: ${realData.statistics.pred_passed ? '#d4edda' : '#f8d7da'}; border-radius: 4px; text-align: center; font-weight: 600;">
                    ${realData.statistics.pred_passed ? '✅ Принят' : '❌ Не принят'} (${realData.statistics.pred_counts['За']} "За")
                </div>
                <div style="margin-top: 0.5rem; padding: 0.5rem; background: #e3f2fd; border-radius: 4px; text-align: center; font-size: 0.9rem;">
                    <strong>Точность:</strong> ${realData.statistics.accuracy}%
                </div>
            </div>
            
            <!-- Реальность -->
            <div class="comparison-block">
                <h3><i class="fas fa-flag-checkered"></i> Реальность</h3>
                <div class="vote-breakdown">
                    ${voteTypes.map(type => {
                        const count = realData.statistics.real_counts[type] || 0;
                        const color = getVoteColor(type);
                        return `
                            <div class="vote-item">
                                <span class="vote-label" style="background: ${color};">${type}</span>
                                <span class="vote-count">${count}</span>
                            </div>
                        `;
                    }).join('')}
                </div>
                <div style="margin-top: 1rem; padding: 0.75rem; background: ${realData.statistics.real_passed ? '#d4edda' : '#f8d7da'}; border-radius: 4px; text-align: center; font-weight: 600;">
                    ${realData.statistics.real_passed ? '✅ Принят' : '❌ Не принят'} (${realData.statistics.real_counts['За']} "За")
                </div>
            </div>
        </div>

        <!-- Голосование по фракциям (реальное) -->
        <div style="background: white; padding: 1.5rem; border-radius: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); margin-bottom: 2rem;">
            <h3 style="margin-bottom: 1rem;"><i class="fas fa-users"></i> Реальное голосование по фракциям</h3>
            <div style="overflow-x: auto;">
                ${generateFactionTableFromRealData(realData.deputies)}
            </div>
        </div>

        <!-- Детали по депутатам (реальное) -->
        <details style="background: white; padding: 1.5rem; border-radius: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
            <summary style="cursor: pointer; font-size: 1.2rem; font-weight: 600; padding: 0.5rem;">
                <i class="fas fa-list"></i> Показать детали реального голосования (${realData.deputies.length} депутатов)
            </summary>
            <div style="margin-top: 1rem; max-height: 500px; overflow-y: auto;">
                ${generateRealVotingTable(realData.deputies)}
            </div>
        </details>
    `;
}

function generateFactionTableFromRealData(deputies) {
    const voteColors = {
        'За': '#27ae60',
        'Против': '#e74c3c',
        'Воздержался': '#f39c12',
        'Не голосовал': '#95a5a6',
        'Отсутствовал': '#34495e'
    };

    const factionVotes = {};
    deputies.forEach(dep => {
        if (!factionVotes[dep.faction]) {
            factionVotes[dep.faction] = {
                'За': 0,
                'Против': 0,
                'Воздержался': 0,
                'Не голосовал': 0,
                'Отсутствовал': 0
            };
        }
        factionVotes[dep.faction][dep.real_vote]++;
    });

    let html = `
        <table style="width: 100%; border-collapse: collapse;">
            <thead style="background: #34495e; color: white;">
                <tr>
                    <th style="padding: 0.75rem; text-align: left;">Фракция</th>
                    <th style="padding: 0.75rem; text-align: center;">За</th>
                    <th style="padding: 0.75rem; text-align: center;">Против</th>
                    <th style="padding: 0.75rem; text-align: center;">Воздержался</th>
                    <th style="padding: 0.75rem; text-align: center;">Не голосовал</th>
                    <th style="padding: 0.75rem; text-align: center;">Отсутствовал</th>
                </tr>
            </thead>
            <tbody>
    `;

    for (const [faction, votes] of Object.entries(factionVotes)) {
        html += `
            <tr style="border-bottom: 1px solid #ecf0f1;">
                <td style="padding: 0.75rem; font-weight: 600;">${faction}</td>
                <td style="padding: 0.75rem; text-align: center; background: ${voteColors['За']}22;">${votes['За']}</td>
                <td style="padding: 0.75rem; text-align: center; background: ${voteColors['Против']}22;">${votes['Против']}</td>
                <td style="padding: 0.75rem; text-align: center; background: ${voteColors['Воздержался']}22;">${votes['Воздержался']}</td>
                <td style="padding: 0.75rem; text-align: center; background: ${voteColors['Не голосовал']}22;">${votes['Не голосовал']}</td>
                <td style="padding: 0.75rem; text-align: center; background: ${voteColors['Отсутствовал']}22;">${votes['Отсутствовал']}</td>
            </tr>
        `;
    }

    html += `</tbody></table>`;
    return html;
}

function generateRealVotingTable(deputies) {
    const voteColors = {
        'За': '#27ae60',
        'Против': '#e74c3c',
        'Воздержался': '#f39c12',
        'Не голосовал': '#95a5a6',
        'Отсутствовал': '#34495e'
    };

    let html = `
        <table style="width: 100%; border-collapse: collapse; font-size: 0.9rem;">
            <thead style="background: #34495e; color: white; position: sticky; top: 0;">
                <tr>
                    <th style="padding: 0.75rem; text-align: left;">ФИО</th>
                    <th style="padding: 0.75rem; text-align: left;">Фракция</th>
                    <th style="padding: 0.75rem; text-align: center;">Реальный голос</th>
                    <th style="padding: 0.75rem; text-align: center;">Прогноз</th>
                    <th style="padding: 0.75rem; text-align: center;">Совпадение</th>
                </tr>
            </thead>
            <tbody>
    `;

    deputies.forEach(deputy => {
        const matchIcon = deputy.is_correct
            ? '<i class="fas fa-check-circle" style="color: #27ae60;"></i>'
            : '<i class="fas fa-times-circle" style="color: #e74c3c;"></i>';

        html += `
            <tr style="border-bottom: 1px solid #ecf0f1; ${!deputy.is_correct ? 'background: #fff5f5;' : ''}">
                <td style="padding: 0.75rem;">${deputy.fio}</td>
                <td style="padding: 0.75rem;">${deputy.faction}</td>
                <td style="padding: 0.75rem; text-align: center;">
                    <span style="background: ${voteColors[deputy.real_vote]}; color: white; padding: 0.3rem 0.6rem; border-radius: 4px; font-weight: 600; display: inline-block; min-width: 100px;">
                        ${deputy.real_vote}
                    </span>
                </td>
                <td style="padding: 0.75rem; text-align: center;">
                    <span style="background: ${voteColors[deputy.predicted_vote]}; color: white; padding: 0.3rem 0.6rem; border-radius: 4px; font-weight: 600; display: inline-block; min-width: 100px;">
                        ${deputy.predicted_vote}
                    </span>
                </td>
                <td style="padding: 0.75rem; text-align: center;">${matchIcon}</td>
            </tr>
        `;
    });

    html += `</tbody></table>`;
    return html;
}

function generateDeputiesTable(deputies) {
    const voteColors = {
        'За': '#27ae60',
        'Против': '#e74c3c',
        'Воздержался': '#f39c12',
        'Не голосовал': '#95a5a6',
        'Отсутствовал': '#34495e'
    };

    let html = `
        <table style="width: 100%; border-collapse: collapse; font-size: 0.9rem;">
            <thead style="background: #34495e; color: white; position: sticky; top: 0;">
                <tr>
                    <th style="padding: 0.75rem; text-align: left;">ФИО</th>
                    <th style="padding: 0.75rem; text-align: left;">Фракция</th>
                    <th style="padding: 0.75rem; text-align: center;">Голос</th>
                    <th style="padding: 0.75rem; text-align: center;">Уверенность</th>
                </tr>
            </thead>
            <tbody>
    `;

    deputies.forEach(deputy => {
        html += `
            <tr style="border-bottom: 1px solid #ecf0f1;">
                <td style="padding: 0.75rem;">${deputy.name}</td>
                <td style="padding: 0.75rem;">${deputy.faction}</td>
                <td style="padding: 0.75rem; text-align: center;">
                    <span style="background: ${voteColors[deputy.vote]}; color: white; padding: 0.3rem 0.6rem; border-radius: 4px; font-weight: 600; display: inline-block; min-width: 100px;">
                        ${deputy.vote}
                    </span>
                </td>
                <td style="padding: 0.75rem; text-align: center;">${deputy.confidence}%</td>
            </tr>
        `;
    });

    html += `</tbody></table>`;
    return html;
}

function generateVoteCards(counts) {
    const voteConfig = {
        'За': { color: '#27ae60', icon: 'fa-thumbs-up' },
        'Против': { color: '#e74c3c', icon: 'fa-thumbs-down' },
        'Воздержался': { color: '#f39c12', icon: 'fa-hand-paper' },
        'Не голосовал': { color: '#95a5a6', icon: 'fa-minus-circle' },
        'Отсутствовал': { color: '#34495e', icon: 'fa-user-slash' }
    };

    const total = Object.values(counts).reduce((a, b) => a + b, 0);

    return Object.entries(counts).map(([vote, count]) => {
        const config = voteConfig[vote];
        const percentage = ((count / total) * 100).toFixed(1);

        return `
            <div style="background: ${config.color}; color: white; padding: 1.5rem; border-radius: 8px; text-align: center;">
                <i class="fas ${config.icon}" style="font-size: 2rem; margin-bottom: 0.5rem;"></i>
                <div style="font-size: 2rem; font-weight: bold;">${count}</div>
                <div style="font-size: 0.9rem; opacity: 0.9;">${vote}</div>
                <div style="font-size: 0.85rem; opacity: 0.8; margin-top: 0.25rem;">${percentage}%</div>
            </div>
        `;
    }).join('');
}

function generateFactionTable(factionVotes) {
    const voteColors = {
        'За': '#27ae60',
        'Против': '#e74c3c',
        'Воздержался': '#f39c12',
        'Не голосовал': '#95a5a6',
        'Отсутствовал': '#34495e'
    };

    let html = `
        <table style="width: 100%; border-collapse: collapse;">
            <thead style="background: #34495e; color: white;">
                <tr>
                    <th style="padding: 0.75rem; text-align: left;">Фракция</th>
                    <th style="padding: 0.75rem; text-align: center;">За</th>
                    <th style="padding: 0.75rem; text-align: center;">Против</th>
                    <th style="padding: 0.75rem; text-align: center;">Воздержался</th>
                    <th style="padding: 0.75rem; text-align: center;">Не голосовал</th>
                    <th style="padding: 0.75rem; text-align: center;">Отсутствовал</th>
                </tr>
            </thead>
            <tbody>
    `;

    for (const [faction, votes] of Object.entries(factionVotes)) {
        html += `
            <tr style="border-bottom: 1px solid #ecf0f1;">
                <td style="padding: 0.75rem; font-weight: 600;">${faction}</td>
                <td style="padding: 0.75rem; text-align: center; background: ${voteColors['За']}22;">${votes['За'] || 0}</td>
                <td style="padding: 0.75rem; text-align: center; background: ${voteColors['Против']}22;">${votes['Против'] || 0}</td>
                <td style="padding: 0.75rem; text-align: center; background: ${voteColors['Воздержался']}22;">${votes['Воздержался'] || 0}</td>
                <td style="padding: 0.75rem; text-align: center; background: ${voteColors['Не голосовал']}22;">${votes['Не голосовал'] || 0}</td>
                <td style="padding: 0.75rem; text-align: center; background: ${voteColors['Отсутствовал']}22;">${votes['Отсутствовал'] || 0}</td>
            </tr>
        `;
    }

    html += `
            </tbody>
        </table>
    `;

    return html;
}
// ============================================
// СТИЛИ
// ============================================
const style = document.createElement('style');
style.textContent = `
    .spinner {
        border: 4px solid #f3f3f3;
        border-top: 4px solid #3498db;
        border-radius: 50%;
        width: 40px;
        height: 40px;
        animation: spin 1s linear infinite;
        margin: 0 auto;
    }
    
    @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }
    
    .stat-card {
        background: white;
        padding: 1.5rem;
        border-radius: 8px;
        box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        text-align: center;
    }
    
    .stat-value {
        font-size: 2.5rem;
        font-weight: bold;
        margin: 0.5rem 0;
    }
    
    .stat-label {
        font-size: 0.9rem;
        opacity: 0.9;
    }
    
    .case3-stats-grid {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        gap: 1rem;
        margin-bottom: 2rem;
    }
    
    .case3-stats-grid .stat-card {
        color: white;
    }
    
    .case3-comparison {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 2rem;
        margin-bottom: 2rem;
    }
    
    .metrics-table-wrapper {
        overflow-x: auto;
    }
    
    .metrics-table {
        width: 100%;
        border-collapse: collapse;
    }
    
    .metrics-table thead {
        background: #9b59b6;
        color: white;
    }
    
    .metrics-table th {
        padding: 0.75rem;
        text-align: center;
        font-weight: 600;
    }
    
    .metrics-table td {
        padding: 0.75rem;
        text-align: center;
        border-bottom: 1px solid #ecf0f1;
    }
    
    .metrics-table tbody tr:hover {
        background: #f8f9fa;
    }
    
    .case3-filters {
        background: #f8f9fa;
        padding: 1.5rem;
        border-radius: 8px;
        margin-bottom: 2rem;
    }
    
    .case3-filters h3 {
        margin-top: 0;
        margin-bottom: 1rem;
    }
    
    .filters-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 1rem;
        margin-top: 1rem;
    }
    
    .filter-group {
        display: flex;
        flex-direction: column;
    }
    
    .filter-group label {
        font-weight: 600;
        margin-bottom: 0.5rem;
        color: #2c3e50;
    }
    
    .filter-group select {
        width: 100%;
        padding: 0.5rem;
        border: 2px solid #ddd;
        border-radius: 4px;
        font-size: 0.95rem;
    }
    
    .filter-group select:focus {
        outline: none;
        border-color: #9b59b6;
    }
    
    .case3-table-section {
        background: white;
        padding: 1.5rem;
        border-radius: 8px;
        box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }
    
    .case3-table-section h3 {
        margin-top: 0;
        margin-bottom: 1rem;
    }
    
    .case3-table {
        width: 100%;
        border-collapse: collapse;
    }
    
    .case3-table th {
        background: #9b59b6;
        color: white;
        padding: 1rem;
        text-align: left;
        font-weight: 600;
    }
    
    .case3-table td {
        padding: 0.75rem;
        border-bottom: 1px solid #eee;
    }
    
    .case3-table tbody tr:hover {
        background: #f8f9fa;
    }
    
    .error-row {
        background: #fff5f5;
    }
    
    .vote-badge {
        display: inline-block;
        padding: 0.25rem 0.75rem;
        border-radius: 4px;
        color: white;
        font-weight: 600;
    }
    
    .btn-secondary {
        background: #95a5a6;
        color: white;
        border: none;
        padding: 0.5rem 1rem;
        border-radius: 4px;
        cursor: pointer;
        transition: all 0.2s;
    }
    
    .btn-secondary:hover {
        background: #7f8c8d;
    }
    
    .btn-primary {
        background: #3498db;
        color: white;
        border: none;
        padding: 0.75rem 1.5rem;
        border-radius: 8px;
        cursor: pointer;
        font-weight: 600;
    }
    
    .form-row {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 1rem;
        margin-bottom: 1rem;
    }
    
    .form-group select {
        width: 100%;
        padding: 0.75rem;
        border: 2px solid #ecf0f1;
        border-radius: 8px;
    }
    
    .btn-simulate {
        width: 100%;
        padding: 1rem;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        border: none;
        border-radius: 8px;
        font-size: 1.1rem;
        cursor: pointer;
        transition: transform 0.2s, box-shadow 0.2s;
    }
    
    .btn-simulate:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
    }
    
    .bill-params-grid {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 1.5rem;
    }
    
    @media (max-width: 768px) {
        .bill-params-grid {
            grid-template-columns: 1fr;
        }
    }
    
    .param-card {
        background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
        padding: 1.25rem;
        border-radius: 10px;
        border: 2px solid #dee2e6;
        transition: all 0.3s ease;
        position: relative;
    }
    
    .param-card:hover {
        border-color: #667eea;
        box-shadow: 0 4px 12px rgba(102, 126, 234, 0.15);
        transform: translateY(-2px);
    }
    
    .param-number {
        position: absolute;
        top: -12px;
        left: 12px;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        width: 28px;
        height: 28px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: bold;
        font-size: 0.9rem;
        box-shadow: 0 2px 6px rgba(102, 126, 234, 0.3);
    }
    
    .param-label {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        font-weight: 600;
        color: #2c3e50;
        margin-bottom: 0.75rem;
        font-size: 1rem;
    }
    
    .param-label i {
        color: #667eea;
        font-size: 1.1rem;
    }
    
    .param-select {
        width: 100%;
        padding: 0.75rem;
        border: 2px solid #ced4da;
        border-radius: 6px;
        background: white;
        font-size: 0.95rem;
        transition: all 0.2s;
        cursor: pointer;
    }
    
    .param-select:focus {
        outline: none;
        border-color: #667eea;
        box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
    }
    
    .param-select:hover {
        border-color: #667eea;
    }
    
    input.param-select[type="number"] {
        cursor: text;
    }
    
    .table-wrapper {
        overflow-x: auto;
        background: white;
        border-radius: 8px;
    }
    
    .comparison-block {
        background: #f8f9fa;
        padding: 1.5rem;
        border-radius: 8px;
    }
    
    .comparison-block h3 {
        margin-top: 0;
        color: #2c3e50;
        display: flex;
        align-items: center;
        gap: 0.5rem;
    }
    
    .vote-breakdown {
        display: flex;
        flex-direction: column;
        gap: 0.75rem;
        margin-top: 1rem;
    }
    
    .vote-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
    }
    
    .vote-label {
        padding: 0.5rem 1rem;
        border-radius: 4px;
        color: white;
        font-weight: 600;
        flex: 1;
    }
    
    .vote-count {
        font-size: 1.5rem;
        font-weight: bold;
        margin-left: 1rem;
        min-width: 50px;
        text-align: right;
    }
`;
document.head.appendChild(style);

console.log('✅ Cases.js загружен успешно');
console.log('📡 API URL:', API_URL);