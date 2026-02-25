// ============================================
// КОНФИГУРАЦИЯ API
// ============================================
const API_URL = 'https://karasev-backend.onrender.com/api';
let case3CurrentData = [];
let case3CurrentVoting = '94008';
let cy = null;
let case2CurrentGraph = 'real';
let case2AllDeputies = [];

function closeModal() {
    const modal = document.getElementById('modal');
    if (modal) { modal.style.display = 'none'; }
}

window.onclick = function(event) {
    const modal = document.getElementById('modal');
    if (event.target === modal) { closeModal(); }
}

// ============================================
// КЕЙС 1: Вводные визуализации
// ============================================

function openCase1() {
    const modal = document.getElementById('modal');
    modal.innerHTML = `
        <div class="modal-content" style="max-width: 1400px;">
            <span class="close-modal" onclick="closeModal()">&times;</span>
            <div class="modal-header" style="background: linear-gradient(135deg, #3498db 0%, #2980b9 100%);">
                <i class="fas fa-chart-pie"></i>
                <div>
                    <h2>Вводные визуализации для Верховной Рады 8-го созыва и ML-модели</h2>
                    <p>Описательные статистики • Визуализация данных ВРУ-8</p>
                </div>
            </div>
            <div class="modal-body">
                <div style="display: flex; gap: 1rem; margin-bottom: 2rem; flex-wrap: wrap; justify-content: center;">
                    <button onclick="switchCase1Section('bills')" id="btn-bills" class="case1-tab-btn active" style="flex: 1; min-width: 200px;">
                        <i class="fas fa-file-alt"></i><br>
                        <span style="font-size: 1.1rem; font-weight: 600;">Законопроекты и<br>динамика ВРУ-8</span>
                    </button>
                    <button onclick="switchCase1Section('deputies')" id="btn-deputies" class="case1-tab-btn" style="flex: 1; min-width: 200px;">
                        <i class="fas fa-users"></i><br>
                        <span style="font-size: 1.1rem; font-weight: 600;">Депутаты и<br>фракции</span>
                    </button>
                    <button onclick="switchCase1Section('model')" id="btn-model" class="case1-tab-btn" style="flex: 1; min-width: 200px;">
                        <i class="fas fa-brain"></i><br>
                        <span style="font-size: 1.1rem; font-weight: 600;">Точность<br>ML-модели</span>
                    </button>
                </div>
                <style>
                    .case1-tab-btn { padding: 1.5rem; border: 2px solid #dee2e6; border-radius: 12px; background: white; cursor: pointer; transition: all 0.3s ease; text-align: center; }
                    .case1-tab-btn:hover { border-color: #3498db; box-shadow: 0 4px 12px rgba(52,152,219,0.2); }
                    .case1-tab-btn.active { background: linear-gradient(135deg, #3498db 0%, #2980b9 100%); color: white; border-color: #2980b9; }
                    .case1-tab-btn i { font-size: 2rem; margin-bottom: 0.5rem; display: block; }
                    .case1-section { display: none; }
                    .case1-section.active { display: block; }
                    .viz-card { background: white; border-radius: 12px; padding: 1.5rem; box-shadow: 0 2px 8px rgba(0,0,0,0.1); margin-bottom: 2rem; }
                    .viz-card h4 { margin-top: 0; color: #2c3e50; margin-bottom: 1rem; }
                    .viz-placeholder { min-height: 400px; display: flex; align-items: center; justify-content: center; flex-direction: column; color: #999; background: #f8f9fa; border-radius: 8px; }
                    .viz-placeholder i { font-size: 3rem; margin-bottom: 1rem; }
                    .explanation-box { margin-top: 1rem; padding: 0.75rem; background: #f8f9fa; border-radius: 6px; border-left: 3px solid #95a5a6; }
                    .explanation-box p { margin: 0; font-size: 0.85rem; color: #666; line-height: 1.5; }
                    .explanation-box a { color: #667eea; text-decoration: none; font-weight: 600; }
                    .explanation-box a:hover { text-decoration: underline; }
                </style>

                <!-- СЕКЦИЯ 1: Законопроекты -->
                <div id="section-bills" class="case1-section active">
                    <h3 style="color: #3498db; margin-bottom: 1.5rem; border-bottom: 2px solid #3498db; padding-bottom: 0.5rem;">
                        <i class="fas fa-file-alt"></i> Законопроекты и динамика ВРУ-8
                    </h3>
                    <div class="viz-card">
                        <h4><i class="fas fa-chart-line"></i> 1. Доли типов поведения депутатов по сессиям ВРУ-8</h4>
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 2rem;">
                            <div>
                                <img src="/karasev_science/images/graphs/behavior_shares_by_session.png" style="max-width: 100%; height: auto; border-radius: 8px;" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';" alt="Доли типов поведения">
                                <div class="viz-placeholder" style="display: none;"><i class="fas fa-image"></i><p>Вставьте: <strong>behavior_shares_by_session.png</strong></p></div>
                            </div>
                            <div id="behaviorTable"></div>
                        </div>
                        <div class="explanation-box"><p><i class="fas fa-info-circle" style="margin-right: 0.25rem;"></i><strong>Пояснение:</strong> [ВСТАВЬТЕ ТЕКСТ ПОЯСНЕНИЯ] <a href="/karasev_science/projects/main-project/index.html#iii-4">→ Подробнее в разделе III.4</a></p></div>
                    </div>
                    <div class="viz-card">
                        <h4><i class="fas fa-chart-bar"></i> 2. Кол-во законопроектов, поданных депутатами по сессиям ВРУ-8</h4>
                        <img src="/karasev_science/images/graphs/bills_by_session.png" style="max-width: 100%; height: auto; border-radius: 8px;" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';" alt="Кол-во законопроектов">
                        <div class="viz-placeholder" style="display: none;"><i class="fas fa-image"></i><p>Вставьте: <strong>bills_by_session.png</strong></p></div>
                        <div class="explanation-box"><p><i class="fas fa-info-circle" style="margin-right: 0.25rem;"></i><strong>Пояснение:</strong> [ВСТАВЬТЕ ТЕКСТ ПОЯСНЕНИЯ] <a href="/karasev_science/projects/main-project/index.html#ii-4">→ Подробнее в разделе II.4</a></p></div>
                    </div>
                    <div class="viz-card">
                        <h4><i class="fas fa-users"></i> 3. Медианное количество соавторов одного законопроекта по сессиям ВРУ-8</h4>
                        <img src="/karasev_science/images/graphs/median_coauthors.png" style="max-width: 100%; height: auto; border-radius: 8px;" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';" alt="Медианное кол-во соавторов">
                        <div class="viz-placeholder" style="display: none;"><i class="fas fa-image"></i><p>Вставьте: <strong>median_coauthors.png</strong></p></div>
                        <div class="explanation-box"><p><i class="fas fa-info-circle" style="margin-right: 0.25rem;"></i><strong>Пояснение:</strong> [ВСТАВЬТЕ ТЕКСТ ПОЯСНЕНИЯ] <a href="/karasev_science/projects/main-project/index.html#iii-3">→ Подробнее в разделе III.3</a></p></div>
                    </div>
                    <div class="viz-card">
                        <h4><i class="fas fa-vote-yea"></i> 4. Среднее кол-во голосований, приходящееся на один законопроект по сессиям ВРУ-8</h4>
                        <img src="/karasev_science/images/graphs/avg_votings.png" style="max-width: 100%; height: auto; border-radius: 8px;" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';" alt="Среднее кол-во голосований">
                        <div class="viz-placeholder" style="display: none;"><i class="fas fa-image"></i><p>Вставьте: <strong>avg_votings.png</strong></p></div>
                        <div class="explanation-box"><p><i class="fas fa-info-circle" style="margin-right: 0.25rem;"></i><strong>Пояснение:</strong> [ВСТАВЬТЕ ТЕКСТ ПОЯСНЕНИЯ] <a href="/karasev_science/projects/main-project/index.html#iii-3">→ Подробнее в разделе III.3</a></p></div>
                    </div>
                    <!-- НОВЫЕ ГРАФИКИ после карточки 4 -->
                    <div class="viz-card">
                        <h4><i class="fas fa-chart-bar"></i> 4а. Кол-во законопроектов с указанным кол-вом соавторов</h4>
                        <img src="/karasev_science/images/graphs/bills_by_coauthors_hist.png" style="max-width: 100%; height: auto; border-radius: 8px;" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';" alt="Гистограмма соавторов">
                        <div class="viz-placeholder" style="display: none;"><i class="fas fa-image"></i><p>Вставьте: <strong>bills_by_coauthors_hist.png</strong></p></div>
                        <div class="explanation-box"><p><i class="fas fa-info-circle" style="margin-right: 0.25rem;"></i><strong>Пояснение:</strong> [ВСТАВЬТЕ ТЕКСТ ПОЯСНЕНИЯ] <a href="/karasev_science/projects/main-project/index.html#iii-3">→ Подробнее в разделе III.3</a></p></div>
                    </div>
                    <div class="viz-card">
                        <h4><i class="fas fa-chart-bar"></i> 4б. Кол-во законопроектов с указанным кол-вом голосований по ним</h4>
                        <img src="/karasev_science/images/graphs/bills_by_votings_hist.png" style="max-width: 100%; height: auto; border-radius: 8px;" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';" alt="Гистограмма голосований">
                        <div class="viz-placeholder" style="display: none;"><i class="fas fa-image"></i><p>Вставьте: <strong>bills_by_votings_hist.png</strong></p></div>
                        <div class="explanation-box"><p><i class="fas fa-info-circle" style="margin-right: 0.25rem;"></i><strong>Пояснение:</strong> [ВСТАВЬТЕ ТЕКСТ ПОЯСНЕНИЯ] <a href="/karasev_science/projects/main-project/index.html#iii-3">→ Подробнее в разделе III.3</a></p></div>
                    </div>
                    <div class="viz-card">
                        <h4><i class="fas fa-chart-bar"></i> 4в. Разброс кол-ва голосований по законопроектам, сгруппированным по рубрикам</h4>
                        <img src="/karasev_science/images/graphs/votings_by_rubrics_boxplot.png" style="max-width: 100%; height: auto; border-radius: 8px;" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';" alt="Боксплот голосований по рубрикам">
                        <div class="viz-placeholder" style="display: none;"><i class="fas fa-image"></i><p>Вставьте: <strong>votings_by_rubrics_boxplot.png</strong></p></div>
                        <div class="explanation-box"><p><i class="fas fa-info-circle" style="margin-right: 0.25rem;"></i><strong>Пояснение:</strong> [ВСТАВЬТЕ ТЕКСТ ПОЯСНЕНИЯ] <a href="/karasev_science/projects/main-project/index.html#iii-3">→ Подробнее в разделе III.3</a></p></div>
                    </div>
                    <div class="viz-card">
                        <h4><i class="fas fa-chart-bar"></i> 4г. Разброс кол-ва соавторов законопроектов, сгруппированных по рубрикам</h4>
                        <img src="/karasev_science/images/graphs/coauthors_by_rubrics_boxplot.png" style="max-width: 100%; height: auto; border-radius: 8px;" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';" alt="Боксплот соавторов по рубрикам">
                        <div class="viz-placeholder" style="display: none;"><i class="fas fa-image"></i><p>Вставьте: <strong>coauthors_by_rubrics_boxplot.png</strong></p></div>
                        <div class="explanation-box"><p><i class="fas fa-info-circle" style="margin-right: 0.25rem;"></i><strong>Пояснение:</strong> [ВСТАВЬТЕ ТЕКСТ ПОЯСНЕНИЯ] <a href="/karasev_science/projects/main-project/index.html#iii-3">→ Подробнее в разделе III.3</a></p></div>
                    </div>
                    <div class="viz-card">
                        <h4><i class="fas fa-table"></i> 5. Распределение типов законодательных процедур по сессиям ВРУ-8</h4>
                        <div id="votingTypesTable" style="overflow-x: auto;"></div>
                        <div class="explanation-box"><p><i class="fas fa-info-circle" style="margin-right: 0.25rem;"></i><strong>Пояснение:</strong> [ВСТАВЬТЕ ТЕКСТ ПОЯСНЕНИЯ] <a href="/karasev_science/projects/main-project/index.html#iii-3">→ Подробнее в разделе III.3</a></p></div>
                    </div>
                </div>

                <!-- СЕКЦИЯ 2: Депутаты и фракции -->
                <div id="section-deputies" class="case1-section">
                    <h3 style="color: #27ae60; margin-bottom: 1.5rem; border-bottom: 2px solid #27ae60; padding-bottom: 0.5rem;">
                        <i class="fas fa-users"></i> Депутаты и фракции
                    </h3>
                    <div class="viz-card">
                        <h4><i class="fas fa-chair"></i> 1. Схема рассадки и кол-во мест у фракций</h4>
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 2rem;">
                            <div>
                                <h5 style="text-align: center;">Схема рассадки по фракциям</h5>
                                <img src="/karasev_science/images/graphs/seating_grid.png" style="max-width: 100%; height: auto; border-radius: 8px;" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';" alt="Схема рассадки">
                                <div class="viz-placeholder" style="display: none; height: 300px;"><i class="fas fa-image"></i><p>Вставьте: <strong>seating_grid.png</strong></p></div>
                            </div>
                            <div>
                                <h5 style="text-align: center;">Распределение мест (450 мест)</h5>
                                <img src="/karasev_science/images/graphs/seating_semicircle.png" style="max-width: 100%; height: auto; border-radius: 8px;" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';" alt="Полукруг">
                                <div class="viz-placeholder" style="display: none; height: 300px;"><i class="fas fa-image"></i><p>Вставьте: <strong>seating_semicircle.png</strong></p></div>
                            </div>
                        </div>
                        <div style="margin-top: 1.5rem; padding: 1rem; background: #f8f9fa; border-radius: 8px;">
                            <h5 style="margin-top: 0; text-align: center;">Легенда фракций</h5>
                            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 0.75rem;">
                                <div style="display: flex; align-items: center; gap: 0.5rem;"><div style="width: 20px; height: 20px; background: #cf2034; border-radius: 3px;"></div><span>Блок Петра Порошенка «Солидарность» (БПП) 127</span></div>
                                <div style="display: flex; align-items: center; gap: 0.5rem;"><div style="width: 20px; height: 20px; background: #f97000; border-radius: 3px;"></div><span>Народный фронта (НФ) 79</span></div>
                                <div style="display: flex; align-items: center; gap: 0.5rem;"><div style="width: 20px; height: 20px; background: #0000ff; border-radius: 3px;"></div><span>Опозиционный блок (ОпБл) 39</span></div>
                                <div style="display: flex; align-items: center; gap: 0.5rem;"><div style="width: 20px; height: 20px; background: #159100; border-radius: 3px;"></div><span>Самопомощь (СмПм) 25</span></div>
                                <div style="display: flex; align-items: center; gap: 0.5rem;"><div style="width: 20px; height: 20px; background: #1494a6; border-radius: 3px;"></div><span>Возроджение (Взржд) 25</span></div>
                                <div style="display: flex; align-items: center; gap: 0.5rem;"><div style="width: 20px; height: 20px; background: #8f0072; border-radius: 3px;"></div><span>ВО Батьковщина (Бтк) 21</span></div>
                                <div style="display: flex; align-items: center; gap: 0.5rem;"><div style="width: 20px; height: 20px; background: #e1e200; border-radius: 3px;"></div><span>Радикальная партия Олега Ляшко (РпОЛ) 21</span></div>
                                <div style="display: flex; align-items: center; gap: 0.5rem;"><div style="width: 20px; height: 20px; background: #9ba500; border-radius: 3px;"></div><span>Воля народу (ВлНр) 17</span></div>
                                <div style="display: flex; align-items: center; gap: 0.5rem;"><div style="width: 20px; height: 20px; background: #bbbbbb; border-radius: 3px;"></div><span>вне фракции 68</span></div>
                            </div>
                        </div>
                        <div class="explanation-box"><p><i class="fas fa-info-circle" style="margin-right: 0.25rem;"></i><strong>Пояснение:</strong> [ВСТАВЬТЕ ТЕКСТ ПОЯСНЕНИЯ] <a href="/karasev_science/projects/main-project/index.html#ii-4">→ Подробнее в разделе II.4</a></p></div>
                    </div>
                    <div class="viz-card">
                        <h4><i class="fas fa-chart-bar"></i> 2. Распределение депутатов по фракциям</h4>
                        <div id="factionChart" style="height: 400px;"></div>
                        <div class="explanation-box"><p><i class="fas fa-info-circle" style="margin-right: 0.25rem;"></i><strong>Пояснение:</strong> [ВСТАВЬТЕ ТЕКСТ ПОЯСНЕНИЯ] <a href="/karasev_science/projects/main-project/index.html#ii-4">→ Подробнее в разделе II.4</a></p></div>
                    </div>
                    <div class="viz-card">
                        <h4><i class="fas fa-project-diagram"></i> 3. Кластеры (k=3) депутатов в зависимости от их поведения</h4>
                        <img src="/karasev_science/images/graphs/clusters_k3.png" style="max-width: 100%; height: auto; border-radius: 8px;" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';" alt="Кластеры k=3">
                        <div class="viz-placeholder" style="display: none;"><i class="fas fa-image"></i><p>Вставьте: <strong>clusters_k3.png</strong></p></div>
                        <div class="explanation-box"><p><i class="fas fa-info-circle" style="margin-right: 0.25rem;"></i><strong>Пояснение:</strong> [ВСТАВЬТЕ ТЕКСТ ПОЯСНЕНИЯ] <a href="/karasev_science/projects/main-project/index.html#iii-8">→ Подробнее в разделе III.8</a> &nbsp;|&nbsp; <a href="https://colab.research.google.com/drive/1T5GzcmK3F9_SlFOa4cB9Jut6iKI9ooIS?usp=sharing" target="_blank"><i class="fab fa-google"></i> Открыть в Google Colab</a></p></div>
                    </div>
                    <div class="viz-card">
                        <h4><i class="fas fa-project-diagram"></i> 4. Кластеры (k=5) депутатов в зависимости от их поведения</h4>
                        <img src="/karasev_science/images/graphs/clusters_k5.png" style="max-width: 100%; height: auto; border-radius: 8px;" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';" alt="Кластеры k=5">
                        <div class="viz-placeholder" style="display: none;"><i class="fas fa-image"></i><p>Вставьте: <strong>clusters_k5.png</strong></p></div>
                        <div class="explanation-box"><p><i class="fas fa-info-circle" style="margin-right: 0.25rem;"></i><strong>Пояснение:</strong> [ВСТАВЬТЕ ТЕКСТ ПОЯСНЕНИЯ] <a href="/karasev_science/projects/main-project/index.html#iii-8">→ Подробнее в разделе III.8</a> &nbsp;|&nbsp; <a href="https://colab.research.google.com/drive/1T5GzcmK3F9_SlFOa4cB9Jut6iKI9ooIS?usp=sharing" target="_blank"><i class="fab fa-google"></i> Открыть в Google Colab</a></p></div>
                    </div>

                    <!-- 5. Матрицы сходства — СТАТИЧЕСКИЕ ИЗОБРАЖЕНИЯ -->
                    <div class="viz-card">
                        <h4><i class="fas fa-th"></i> 5. Матрицы сходства голосования по всем фракциям</h4>
                        <p style="color: #666; margin-bottom: 3rem;">Матрицы показывают согласованность голосования депутатов внутри каждой фракции</p>
                        <div style="margin-bottom: 12rem; padding-bottom: 8rem; border-bottom: 4px solid #95a5a6;">
                            <h5 style="color: #e74c3c; margin-bottom: 2rem; font-size: 1.4rem; font-weight: 700;"><i class="fas fa-square" style="color: #e74c3c;"></i> Блок Петра Порошенко (БПП) - 132 депутата</h5>
                            <img src="/karasev_science/images/graphs/similarity_bpp.png" style="max-width: 100%; height: auto; border-radius: 8px;" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';" alt="Матрица БПП">
                            <div class="viz-placeholder" style="display: none;"><i class="fas fa-image"></i><p>Вставьте: <strong>similarity_bpp.png</strong></p></div>
                        </div>
                        <div style="margin-bottom: 12rem; padding-bottom: 8rem; border-bottom: 4px solid #95a5a6;">
                            <h5 style="color: #9b59b6; margin-bottom: 2rem; font-size: 1.4rem; font-weight: 700;"><i class="fas fa-square" style="color: #9b59b6;"></i> Народный фронт (НФ) - 82 депутата</h5>
                            <img src="/karasev_science/images/graphs/similarity_nf.png" style="max-width: 100%; height: auto; border-radius: 8px;" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';" alt="Матрица НФ">
                            <div class="viz-placeholder" style="display: none;"><i class="fas fa-image"></i><p>Вставьте: <strong>similarity_nf.png</strong></p></div>
                        </div>
                        <div style="margin-bottom: 12rem; padding-bottom: 8rem; border-bottom: 4px solid #95a5a6;">
                            <h5 style="color: #f39c12; margin-bottom: 2rem; font-size: 1.4rem; font-weight: 700;"><i class="fas fa-square" style="color: #f39c12;"></i> Самопомощь (СмПм) - 33 депутата</h5>
                            <img src="/karasev_science/images/graphs/similarity_smpm.png" style="max-width: 100%; height: auto; border-radius: 8px;" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';" alt="Матрица Самопомощь">
                            <div class="viz-placeholder" style="display: none;"><i class="fas fa-image"></i><p>Вставьте: <strong>similarity_smpm.png</strong></p></div>
                        </div>
                        <div style="margin-bottom: 12rem; padding-bottom: 8rem; border-bottom: 4px solid #95a5a6;">
                            <h5 style="color: #3498db; margin-bottom: 2rem; font-size: 1.4rem; font-weight: 700;"><i class="fas fa-square" style="color: #3498db;"></i> Радикальная партия Олега Ляшко (РпОЛ) - 43 депутата</h5>
                            <img src="/karasev_science/images/graphs/similarity_rpol.png" style="max-width: 100%; height: auto; border-radius: 8px;" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';" alt="Матрица РпОЛ">
                            <div class="viz-placeholder" style="display: none;"><i class="fas fa-image"></i><p>Вставьте: <strong>similarity_rpol.png</strong></p></div>
                        </div>
                        <div style="margin-bottom: 12rem; padding-bottom: 8rem; border-bottom: 4px solid #95a5a6;">
                            <h5 style="color: #27ae60; margin-bottom: 2rem; font-size: 1.4rem; font-weight: 700;"><i class="fas fa-square" style="color: #27ae60;"></i> ВО Батькивщина (Бтк) - 19 депутатов</h5>
                            <img src="/karasev_science/images/graphs/similarity_batk.png" style="max-width: 100%; height: auto; border-radius: 8px;" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';" alt="Матрица Батькивщина">
                            <div class="viz-placeholder" style="display: none;"><i class="fas fa-image"></i><p>Вставьте: <strong>similarity_batk.png</strong></p></div>
                        </div>
                        <div style="margin-bottom: 12rem; padding-bottom: 8rem; border-bottom: 4px solid #95a5a6;">
                            <h5 style="color: #34495e; margin-bottom: 2rem; font-size: 1.4rem; font-weight: 700;"><i class="fas fa-square" style="color: #34495e;"></i> Оппозиционный блок (ОпБл) - 43 депутата</h5>
                            <img src="/karasev_science/images/graphs/similarity_opbl.png" style="max-width: 100%; height: auto; border-radius: 8px;" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';" alt="Матрица Оппозиционный блок">
                            <div class="viz-placeholder" style="display: none;"><i class="fas fa-image"></i><p>Вставьте: <strong>similarity_opbl.png</strong></p></div>
                        </div>
                        <div style="margin-bottom: 12rem; padding-bottom: 8rem; border-bottom: 4px solid #95a5a6;">
                            <h5 style="color: #1abc9c; margin-bottom: 2rem; font-size: 1.4rem; font-weight: 700;"><i class="fas fa-square" style="color: #1abc9c;"></i> Воля народу (ВлНр) - 20 депутатов</h5>
                            <img src="/karasev_science/images/graphs/similarity_vlnr.png" style="max-width: 100%; height: auto; border-radius: 8px;" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';" alt="Матрица Воля народу">
                            <div class="viz-placeholder" style="display: none;"><i class="fas fa-image"></i><p>Вставьте: <strong>similarity_vlnr.png</strong></p></div>
                        </div>
                        <div style="margin-bottom: 6rem; padding-bottom: 4rem;">
                            <h5 style="color: #e67e22; margin-bottom: 2rem; font-size: 1.4rem; font-weight: 700;"><i class="fas fa-square" style="color: #e67e22;"></i> Відродження (Взржд) - 26 депутатов</h5>
                            <img src="/karasev_science/images/graphs/similarity_vidr.png" style="max-width: 100%; height: auto; border-radius: 8px;" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';" alt="Матрица Відродження">
                            <div class="viz-placeholder" style="display: none;"><i class="fas fa-image"></i><p>Вставьте: <strong>similarity_vidr.png</strong></p></div>
                        </div>
                        <div class="explanation-box"><p><i class="fas fa-info-circle" style="margin-right: 0.25rem;"></i><strong>Пояснение:</strong> [ВСТАВЬТЕ ТЕКСТ ПОЯСНЕНИЯ] <a href="/karasev_science/projects/main-project/index.html#iii-11">→ Подробнее в разделе III.11</a></p></div>
                    </div>

                    <!-- 6. Unity — ИНТЕРАКТИВНЫЙ PLOTLY -->
                    <div class="viz-card">
                        <h4><i class="fas fa-chart-line"></i> 6. Динамика сплоченности фракций по сессиям ВРУ-8 (UNITY)</h4>
                        <div id="unity-dynamics-plot" style="min-height: 500px; width: 100%;"></div>
                        <div class="explanation-box"><p><i class="fas fa-info-circle" style="margin-right: 0.25rem;"></i><strong>Пояснение:</strong> [ВСТАВЬТЕ ТЕКСТ ПОЯСНЕНИЯ] <a href="/karasev_science/projects/main-project/index.html#iii-11">→ Подробнее в разделе III.11</a></p></div>
                    </div>
                </div>

                <!-- СЕКЦИЯ 3: ML-модель -->
                <div id="section-model" class="case1-section">
                    <h3 style="color: #9b59b6; margin-bottom: 1.5rem; border-bottom: 2px solid #9b59b6; padding-bottom: 0.5rem;">
                        <i class="fas fa-brain"></i> Точность ML-модели
                    </h3>
                    <div class="viz-card">
                        <h4><i class="fas fa-chart-pie"></i> 1. Доли типов поведения train и test</h4>
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 2rem;">
                            <div>
                                <div id="trainPieChart" style="height: 350px;"></div>
                                <div id="trainTable" style="margin-top: 1rem;"></div>
                            </div>
                            <div>
                                <div id="testPieChart" style="height: 350px;"></div>
                                <div id="testTable" style="margin-top: 1rem;"></div>
                            </div>
                        </div>
                        <div class="explanation-box"><p><i class="fas fa-info-circle" style="margin-right: 0.25rem;"></i><strong>Пояснение:</strong> [ВСТАВЬТЕ ТЕКСТ ПОЯСНЕНИЯ] <a href="/karasev_science/projects/main-project/index.html#iii-13">→ Подробнее в разделе III.13</a></p></div>
                    </div>
                    <div class="viz-card">
                        <h4><i class="fas fa-table"></i> 2. Classification report - train</h4>
                        <div id="classReportTrain" style="overflow-x: auto;"></div>
                        <div class="explanation-box"><p><i class="fas fa-info-circle" style="margin-right: 0.25rem;"></i><strong>Пояснение:</strong> [ВСТАВЬТЕ ТЕКСТ ПОЯСНЕНИЯ] <a href="/karasev_science/projects/main-project/index.html#iii-13">→ Подробнее в разделе III.13</a></p></div>
                    </div>
                    <div class="viz-card">
                        <h4><i class="fas fa-table"></i> 3. Classification report - test</h4>
                        <div id="classReportTest" style="overflow-x: auto;"></div>
                        <div class="explanation-box"><p><i class="fas fa-info-circle" style="margin-right: 0.25rem;"></i><strong>Пояснение:</strong> [ВСТАВЬТЕ ТЕКСТ ПОЯСНЕНИЯ] <a href="/karasev_science/projects/main-project/index.html#iii-13">→ Подробнее в разделе III.13</a></p></div>
                    </div>
                    <div class="viz-card">
                        <h4><i class="fas fa-chart-area"></i> 4. ROC-кривые</h4>
                        <div id="rocCurves"></div>
                        <div class="explanation-box"><p><i class="fas fa-info-circle" style="margin-right: 0.25rem;"></i><strong>Пояснение:</strong> [ВСТАВЬТЕ ТЕКСТ ПОЯСНЕНИЯ] <a href="/karasev_science/projects/main-project/index.html#iii-13">→ Подробнее в разделе III.13</a></p></div>
                    </div>
                    <div class="viz-card">
                        <h4><i class="fas fa-th"></i> 5. Матрица неточностей (Confusion Matrix)</h4>
                        <img src="/karasev_science/images/graphs/confusion_matrix.png" style="max-width: 100%; height: auto; border-radius: 8px;" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';" alt="Confusion Matrix">
                        <div class="viz-placeholder" style="display: none;"><i class="fas fa-image"></i><p>Вставьте: <strong>confusion_matrix.png</strong></p></div>
                        <div class="explanation-box"><p><i class="fas fa-info-circle" style="margin-right: 0.25rem;"></i><strong>Пояснение:</strong> [ВСТАВЬТЕ ТЕКСТ ПОЯСНЕНИЯ] <a href="/karasev_science/projects/main-project/index.html#iii-13">→ Подробнее в разделе III.13</a></p></div>
                    </div>
                </div>
            </div>
        </div>
    `;
    modal.style.display = 'flex';
    loadCase1Data();
}

// switchCase1Section — матрицы статичные, вызовы generate*SimilarityMatrix убраны
function switchCase1Section(section) {
    document.querySelectorAll('.case1-tab-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelectorAll('.case1-section').forEach(sec => sec.classList.remove('active'));
    document.getElementById(`btn-${section}`).classList.add('active');
    document.getElementById(`section-${section}`).classList.add('active');
    setTimeout(() => {
        if (section === 'deputies') {
            generateFactionChart();
            generateUnityDynamics();
        } else if (section === 'model') {
            generateTrainTestCharts();
            generateROCCurves();
        }
    }, 500);
}

async function loadCase1Data() {
    generateBehaviorTable();
    generateVotingTypesTable();
    generateCoauthorsTable();
    generateClassificationReports();
    generateTrainTestTables();
    try {
        const response = await fetch(`${API_URL}/deputies`);
        const data = await response.json();
        if (data.success) { window.deputiesData = data.deputies; }
    } catch (error) { console.error('Ошибка загрузки:', error); }
    generateFactionChart();
}

function generateFactionChart() {
    const factionCounts = { 'БПП': 127, 'НФ': 79, 'Самопомощь': 25, 'РпОЛ': 21, 'Батькивщина': 21, 'Опозиционный блок': 39, 'Воля народа': 17, 'Возрождение': 25, 'вне фракциии': 68 };
    const factionData = [{ x: Object.keys(factionCounts), y: Object.values(factionCounts), type: 'bar', marker: { color: ['#cf2034','#f97000','#159100','#e1e200','#8f0072','#0000ff','#9ba500','#1494a6','#bbbbbb'] }, text: Object.values(factionCounts), textposition: 'outside' }];
    const layout = { yaxis: { title: 'Количество депутатов' }, margin: { t: 20, l: 60, r: 20, b: 100 }, font: { family: 'Arial, sans-serif' } };
    Plotly.newPlot('factionChart', factionData, layout, {responsive: true});
}

function generateBehaviorTable() {
    const data = { sessions: [1,2,3,4,5,6,7,8,9,10], vozderzhal: [0.06,0.07,0.05,0.07,0.07,0.06,0.08,0.05,0.05,0.03], za: [0.44,0.48,0.18,0.41,0.43,0.22,0.33,0.37,0.40,0.48], ne_golosoval: [0.26,0.22,0.45,0.31,0.29,0.47,0.42,0.39,0.32,0.29], otsutstvoval: [0.23,0.21,0.33,0.20,0.20,0.21,0.20,0.21,0.21,0.21], protiv: [0.01,0.02,0.01,0.01,0.01,0.01,0.01,0.01,0.02,0.01] };
    const container = document.getElementById('behaviorTable');
    if (!container) return;
    let html = `<table style="width:100%;border-collapse:collapse;font-size:0.85rem;"><thead><tr style="background:#ecf0f1;"><th style="padding:0.5rem;border:1px solid #bdc3c7;">Сессия</th><th style="padding:0.5rem;border:1px solid #bdc3c7;">Воздержался</th><th style="padding:0.5rem;border:1px solid #bdc3c7;">За</th><th style="padding:0.5rem;border:1px solid #bdc3c7;">Не голосовал</th><th style="padding:0.5rem;border:1px solid #bdc3c7;">Отсутствовал</th><th style="padding:0.5rem;border:1px solid #bdc3c7;">Против</th></tr></thead><tbody>`;
    for (let i = 0; i < data.sessions.length; i++) {
        const bg = i % 2 === 0 ? '#f8f9fa' : 'white';
        html += `<tr style="background:${bg};"><td style="padding:0.5rem;border:1px solid #bdc3c7;font-weight:600;">${data.sessions[i]}</td><td style="padding:0.5rem;border:1px solid #bdc3c7;text-align:center;">${data.vozderzhal[i].toFixed(2)}</td><td style="padding:0.5rem;border:1px solid #bdc3c7;text-align:center;">${data.za[i].toFixed(2)}</td><td style="padding:0.5rem;border:1px solid #bdc3c7;text-align:center;">${data.ne_golosoval[i].toFixed(2)}</td><td style="padding:0.5rem;border:1px solid #bdc3c7;text-align:center;">${data.otsutstvoval[i].toFixed(2)}</td><td style="padding:0.5rem;border:1px solid #bdc3c7;text-align:center;">${data.protiv[i].toFixed(2)}</td></tr>`;
    }
    html += '</tbody></table>';
    container.innerHTML = html;
}

function generateVotingTypesTable() {
    const data = { sessions: [1,2,3,4,5,6,7,8,9,10], agenda: [0.04,0.32,0.04,0.14,0.09,0.06,0.10,0.18,0.23,0.52], ammendments: [0.29,0.12,0.75,0.34,0.28,0.68,0.53,0.31,0.23,0.02], cancel: [0.09,0.07,0.02,0.06,0.07,0.06,0.06,0.13,0.09,0.08], final_voting: [0.31,0.22,0.09,0.22,0.24,0.09,0.12,0.18,0.21,0.22], second_voting: [0.06,0.03,0.01,0.04,0.03,0.02,0.04,0.03,0.01,0.01], short_procedure: [0.17,0.16,0.05,0.17,0.14,0.07,0.11,0.13,0.17,0.14], signal_voting: [0.05,0.07,0.05,0.03,0.16,0.02,0.04,0.04,0.05,0.02] };
    const container = document.getElementById('votingTypesTable');
    if (!container) return;
    let html = `<table style="width:100%;border-collapse:collapse;font-size:0.9rem;"><thead><tr style="background:#ecf0f1;"><th style="padding:0.75rem;border:1px solid #bdc3c7;">Session</th><th style="padding:0.75rem;border:1px solid #bdc3c7;">agenda</th><th style="padding:0.75rem;border:1px solid #bdc3c7;">ammendments</th><th style="padding:0.75rem;border:1px solid #bdc3c7;">cancel</th><th style="padding:0.75rem;border:1px solid #bdc3c7;">final_voting</th><th style="padding:0.75rem;border:1px solid #bdc3c7;">second_voting</th><th style="padding:0.75rem;border:1px solid #bdc3c7;">short_procedure</th><th style="padding:0.75rem;border:1px solid #bdc3c7;">signal_voting</th></tr></thead><tbody>`;
    for (let i = 0; i < data.sessions.length; i++) {
        const bg = i % 2 === 0 ? '#f8f9fa' : 'white';
        html += `<tr style="background:${bg};"><td style="padding:0.75rem;border:1px solid #bdc3c7;font-weight:600;text-align:center;">${data.sessions[i]}</td><td style="padding:0.75rem;border:1px solid #bdc3c7;text-align:center;">${data.agenda[i].toFixed(2)}</td><td style="padding:0.75rem;border:1px solid #bdc3c7;text-align:center;">${data.ammendments[i].toFixed(2)}</td><td style="padding:0.75rem;border:1px solid #bdc3c7;text-align:center;">${data.cancel[i].toFixed(2)}</td><td style="padding:0.75rem;border:1px solid #bdc3c7;text-align:center;">${data.final_voting[i].toFixed(2)}</td><td style="padding:0.75rem;border:1px solid #bdc3c7;text-align:center;">${data.second_voting[i].toFixed(2)}</td><td style="padding:0.75rem;border:1px solid #bdc3c7;text-align:center;">${data.short_procedure[i].toFixed(2)}</td><td style="padding:0.75rem;border:1px solid #bdc3c7;text-align:center;">${data.signal_voting[i].toFixed(2)}</td></tr>`;
    }
    html += '</tbody></table>';
    container.innerHTML = html;
}

function generateCoauthorsTable() {
    const container = document.getElementById('coauthorsTable');
    if (!container) return;

    const columns = ['БПП', 'БПП,Бтк,Вне_Фр,НФ', 'НФ,РпОЛ,СмПм', 'БПП,Вне_Фр,НФ', 'БПП,НФ', 'Бтк', 'Взрдж', 'КабМин', 'НФ', 'ОпБл', 'Президент'];
    const rows = [
        [1,  0.17, null, 0.07, 0.01, 0.13, 0.09, 0.02, 0.25, 0.17, 0.04, 0.05],
        [2,  0.14, null, 0.03, 0.02, 0.08, 0.01, null, 0.50, 0.07, 0.02, 0.13],
        [3,  0.05, null, 0.01, 0.01, 0.00, 0.00, null, 0.00, null, null, 0.01],
        [4,  0.06, null, 0.03, 0.01, 0.11, 0.01, 0.01, 0.54, 0.06, 0.03, 0.14],
        [5,  0.13, null, 0.04, 0.02, 0.04, 0.02, 0.01, 0.59, 0.05, 0.02, 0.08],
        [6,  0.02, null, 0.38, 0.01, 0.03, 0.01, 0.00, 0.18, 0.02, 0.00, 0.35],
        [7,  0.07, null, 0.00, 0.01, 0.03, 0.01, null, 0.20, 0.01, 0.00, 0.88],
        [8,  0.16, null, 0.04, null, 0.03, 0.02, 0.00, 0.28, 0.04, 0.02, 0.41],
        [9,  0.17, null, 0.02, 0.01, 0.03, 0.01, 0.00, 0.56, 0.08, 0.03, 0.07],
        [10, 0.10, null, 0.16, 0.01, 0.15, 0.02, 0.01, 0.22, 0.07, 0.02, 0.25],
    ];

    let html = `<div style="overflow-x:auto;"><table style="width:100%;border-collapse:collapse;font-size:0.8rem;">
        <thead>
            <tr style="background:#ecf0f1;">
                <th style="padding:0.5rem;border:1px solid #bdc3c7;">Session</th>
                ${columns.map(col => `<th style="padding:0.5rem;border:1px solid #bdc3c7;white-space:nowrap;font-size:0.75rem;">${col}</th>`).join('')}
            </tr>
        </thead>
        <tbody>`;

    rows.forEach((row, i) => {
        const bg = i % 2 === 0 ? '#f8f9fa' : 'white';
        html += `<tr style="background:${bg};">`;
        row.forEach((val, j) => {
            if (j === 0) {
                html += `<td style="padding:0.5rem;border:1px solid #bdc3c7;font-weight:600;text-align:center;">${val}</td>`;
            } else {
                html += `<td style="padding:0.5rem;border:1px solid #bdc3c7;text-align:center;">${val === null ? '<span style="color:#bdc3c7;">NaN</span>' : val.toFixed(2)}</td>`;
            }
        });
        html += `</tr>`;
    });

    html += '</tbody></table></div>';
    container.innerHTML = html;
}
function generateTrainTestTables() {
    const trainData = [{behavior:'За',share:0.31},{behavior:'Не голосовал',share:0.37},{behavior:'Отсутствовал',share:0.24},{behavior:'Воздержался',share:0.07},{behavior:'Против',share:0.01}];
    const testData = [{behavior:'За',share:0.39},{behavior:'Не голосовал',share:0.33},{behavior:'Отсутствовал',share:0.21},{behavior:'Воздержался',share:0.05},{behavior:'Против',share:0.01}];
    const trainContainer = document.getElementById('trainTable');
    const testContainer = document.getElementById('testTable');
    if (trainContainer) trainContainer.innerHTML = generateSmallTable(trainData);
    if (testContainer) testContainer.innerHTML = generateSmallTable(testData);
}

function generateSmallTable(data) {
    let html = `<table style="width:100%;border-collapse:collapse;font-size:0.85rem;"><thead><tr style="background:#ecf0f1;"><th style="padding:0.5rem;border:1px solid #bdc3c7;">#</th><th style="padding:0.5rem;border:1px solid #bdc3c7;">behavior</th><th style="padding:0.5rem;border:1px solid #bdc3c7;">vote_percent</th></tr></thead><tbody>`;
    data.forEach((row, i) => {
        const bg = i % 2 === 0 ? '#f8f9fa' : 'white';
        html += `<tr style="background:${bg};"><td style="padding:0.5rem;border:1px solid #bdc3c7;text-align:center;">${i}</td><td style="padding:0.5rem;border:1px solid #bdc3c7;">${row.behavior}</td><td style="padding:0.5rem;border:1px solid #bdc3c7;text-align:center;">${row.share.toFixed(2)}</td></tr>`;
    });
    html += '</tbody></table>';
    return html;
}

function generateTrainTestCharts() {
    const trainData = [{ values: [0.31,0.37,0.24,0.07,0.01], labels: ['За','Не голосовал','Отсутствовал','Воздержался','Против'], type: 'pie', marker: { colors: ['#27ae60','#95a5a6','#34495e','#f39c12','#e74c3c'] }, textinfo: 'percent', textposition: 'inside' }];
    const testData = [{ values: [0.39,0.33,0.21,0.05,0.01], labels: ['За','Не голосовал','Отсутствовал','Воздержался','Против'], type: 'pie', marker: { colors: ['#27ae60','#95a5a6','#34495e','#f39c12','#e74c3c'] }, textinfo: 'percent', textposition: 'inside' }];
    const trainLayout = {
        title: { text: 'Обучающая выборка (1-7 сессии)', font: { size: 13 } },
        margin: { t: 40, l: 10, r: 10, b: 10 },
        showlegend: true,
        legend: { orientation: 'h', y: -0.15, x: 0.5, xanchor: 'center' }
    };
    const testLayout = {
        title: { text: 'Тестовая выборка (8-10 сессии)', font: { size: 13 } },
        margin: { t: 40, l: 10, r: 10, b: 10 },
        showlegend: true,
        legend: { orientation: 'h', y: -0.15, x: 0.5, xanchor: 'center' }
    };
    Plotly.newPlot('trainPieChart', trainData, trainLayout, {responsive: true});
    Plotly.newPlot('testPieChart', testData, testLayout, {responsive: true});
}

function generateClassificationReports() {
    const trainData = { classes: ['Воздержался','За','Не голосовал','Отсутствовал','Против'], precision: [0.27,0.70,0.77,0.68,0.09], recall: [0.58,0.68,0.55,0.59,0.73], f1score: [0.37,0.69,0.64,0.63,0.16], support: [599389,2815396,3409493,2235135,90500], accuracy: 0.60, macro_avg: {precision:0.50,recall:0.63,f1score:0.50,support:9149913}, weighted_avg: {precision:0.69,recall:0.60,f1score:0.63,support:9149913} };
    const testData = { classes: ['Воздержался','За','Не голосовал','Отсутствовал','Против'], precision: [0.21,0.66,0.58,0.44,0.07], recall: [0.20,0.62,0.39,0.59,0.49], f1score: [0.21,0.64,0.47,0.51,0.12], support: [48976,414294,350803,219973,11610], accuracy: 0.52, macro_avg: {precision:0.39,recall:0.46,f1score:0.39,support:1045656}, weighted_avg: {precision:0.56,recall:0.52,f1score:0.53,support:1045656} };
    generateClassReportTable('classReportTrain', trainData, 'CatBoostClassifier - Train');
    generateClassReportTable('classReportTest', testData, 'CatBoostClassifier - Test');
}

function generateClassReportTable(containerId, data, title) {
    const container = document.getElementById(containerId);
    if (!container) return;
    let html = `<div style="text-align:center;margin-bottom:1rem;"><h5 style="margin:0;color:#2c3e50;">${title}</h5></div><table style="width:100%;border-collapse:collapse;font-size:0.9rem;"><thead><tr style="background:#ecf0f1;"><th style="padding:0.75rem;border:1px solid #bdc3c7;"></th><th style="padding:0.75rem;border:1px solid #bdc3c7;">precision</th><th style="padding:0.75rem;border:1px solid #bdc3c7;">recall</th><th style="padding:0.75rem;border:1px solid #bdc3c7;">f1-score</th><th style="padding:0.75rem;border:1px solid #bdc3c7;">кейсов</th></tr></thead><tbody>`;
    for (let i = 0; i < data.classes.length; i++) {
        const bg = i % 2 === 0 ? '#f8f9fa' : 'white';
        html += `<tr style="background:${bg};"><td style="padding:0.75rem;border:1px solid #bdc3c7;font-weight:600;">${data.classes[i]}</td><td style="padding:0.75rem;border:1px solid #bdc3c7;text-align:center;">${data.precision[i].toFixed(2)}</td><td style="padding:0.75rem;border:1px solid #bdc3c7;text-align:center;">${data.recall[i].toFixed(2)}</td><td style="padding:0.75rem;border:1px solid #bdc3c7;text-align:center;">${data.f1score[i].toFixed(2)}</td><td style="padding:0.75rem;border:1px solid #bdc3c7;text-align:center;">${data.support[i].toLocaleString()}</td></tr>`;
    }
    html += `<tr style="background:white;"><td colspan="5" style="padding:0.25rem;border:none;"></td></tr>
    <tr style="background:#e8f5e9;"><td style="padding:0.75rem;border:1px solid #bdc3c7;font-weight:600;">accuracy</td><td colspan="2" style="border:1px solid #bdc3c7;"></td><td style="padding:0.75rem;border:1px solid #bdc3c7;text-align:center;font-weight:600;">${data.accuracy.toFixed(2)}</td><td style="padding:0.75rem;border:1px solid #bdc3c7;text-align:center;">${data.macro_avg.support.toLocaleString()}</td></tr>
    <tr style="background:#fff3cd;"><td style="padding:0.75rem;border:1px solid #bdc3c7;font-weight:600;">macro avg</td><td style="padding:0.75rem;border:1px solid #bdc3c7;text-align:center;">${data.macro_avg.precision.toFixed(2)}</td><td style="padding:0.75rem;border:1px solid #bdc3c7;text-align:center;">${data.macro_avg.recall.toFixed(2)}</td><td style="padding:0.75rem;border:1px solid #bdc3c7;text-align:center;">${data.macro_avg.f1score.toFixed(2)}</td><td style="padding:0.75rem;border:1px solid #bdc3c7;text-align:center;">${data.macro_avg.support.toLocaleString()}</td></tr>
    <tr style="background:#d1ecf1;"><td style="padding:0.75rem;border:1px solid #bdc3c7;font-weight:600;">weighted avg</td><td style="padding:0.75rem;border:1px solid #bdc3c7;text-align:center;">${data.weighted_avg.precision.toFixed(2)}</td><td style="padding:0.75rem;border:1px solid #bdc3c7;text-align:center;">${data.weighted_avg.recall.toFixed(2)}</td><td style="padding:0.75rem;border:1px solid #bdc3c7;text-align:center;">${data.weighted_avg.f1score.toFixed(2)}</td><td style="padding:0.75rem;border:1px solid #bdc3c7;text-align:center;">${data.weighted_avg.support.toLocaleString()}</td></tr>
    </tbody></table>`;
    container.innerHTML = html;
}

function generateROCCurves() {
    const container = document.getElementById('rocCurves');
    if (!container) return;
    const rocData = {
        'За': { train_auc:0.88, test_auc:0.79, color:'#27ae60', train_fpr:[0,0.05,0.1,0.15,0.2,0.25,0.3,0.4,0.5,0.6,0.7,0.8,0.9,1.0], train_tpr:[0,0.5,0.65,0.75,0.82,0.86,0.89,0.93,0.95,0.97,0.98,0.99,0.995,1.0], test_fpr:[0,0.05,0.1,0.15,0.2,0.25,0.3,0.4,0.5,0.6,0.7,0.8,0.9,1.0], test_tpr:[0,0.4,0.55,0.65,0.72,0.77,0.81,0.86,0.90,0.93,0.95,0.97,0.985,1.0] },
        'Воздержался': { train_auc:0.86, test_auc:0.78, color:'#f39c12', train_fpr:[0,0.05,0.1,0.15,0.2,0.25,0.3,0.4,0.5,0.6,0.7,0.8,0.9,1.0], train_tpr:[0,0.45,0.62,0.72,0.79,0.84,0.87,0.91,0.94,0.96,0.97,0.985,0.995,1.0], test_fpr:[0,0.05,0.1,0.15,0.2,0.25,0.3,0.4,0.5,0.6,0.7,0.8,0.9,1.0], test_tpr:[0,0.35,0.52,0.63,0.71,0.76,0.81,0.86,0.90,0.93,0.95,0.97,0.99,1.0] },
        'Не голосовал': { train_auc:0.83, test_auc:0.72, color:'#95a5a6', train_fpr:[0,0.05,0.1,0.15,0.2,0.25,0.3,0.4,0.5,0.6,0.7,0.8,0.9,1.0], train_tpr:[0,0.42,0.58,0.68,0.76,0.81,0.85,0.90,0.93,0.95,0.97,0.985,0.995,1.0], test_fpr:[0,0.05,0.1,0.15,0.2,0.25,0.3,0.4,0.5,0.6,0.7,0.8,0.9,1.0], test_tpr:[0,0.3,0.45,0.56,0.64,0.70,0.75,0.82,0.87,0.91,0.94,0.96,0.985,1.0] },
        'Отсутствовал': { train_auc:0.85, test_auc:0.77, color:'#34495e', train_fpr:[0,0.05,0.1,0.15,0.2,0.25,0.3,0.4,0.5,0.6,0.7,0.8,0.9,1.0], train_tpr:[0,0.44,0.60,0.70,0.77,0.82,0.86,0.91,0.94,0.96,0.97,0.985,0.995,1.0], test_fpr:[0,0.05,0.1,0.15,0.2,0.25,0.3,0.4,0.5,0.6,0.7,0.8,0.9,1.0], test_tpr:[0,0.33,0.48,0.59,0.67,0.73,0.78,0.85,0.89,0.92,0.95,0.97,0.99,1.0] },
        'Против': { train_auc:0.93, test_auc:0.83, color:'#e74c3c', train_fpr:[0,0.02,0.05,0.1,0.15,0.2,0.25,0.3,0.4,0.5,0.6,0.7,0.8,0.9,1.0], train_tpr:[0,0.5,0.70,0.82,0.88,0.92,0.94,0.96,0.97,0.98,0.99,0.995,0.998,0.999,1.0], test_fpr:[0,0.02,0.05,0.1,0.15,0.2,0.25,0.3,0.4,0.5,0.6,0.7,0.8,0.9,1.0], test_tpr:[0,0.4,0.60,0.72,0.79,0.84,0.87,0.90,0.93,0.95,0.97,0.98,0.99,0.995,1.0] }
    };
    container.innerHTML = `<div style="display:grid;grid-template-columns:repeat(2,1fr);gap:2rem;">${Object.keys(rocData).map(voteType => `<div><h5 style="text-align:center;margin-bottom:0.5rem;font-size:0.9rem;">One-vs-Rest ROC curve: '${voteType}' vs (Остальные типы поведения)</h5><div id="roc-${voteType.replace(/\s/g,'_')}" style="height:350px;"></div></div>`).join('')}</div>`;
    Object.keys(rocData).forEach(voteType => {
        const data = rocData[voteType];
        const divId = `roc-${voteType.replace(/\s/g,'_')}`;
        const traces = [
            { x:[0,1], y:[0,1], mode:'lines', line:{dash:'dash',color:'#95a5a6',width:1.5}, showlegend:false, hoverinfo:'skip' },
            { x:data.train_fpr, y:data.train_tpr, mode:'lines', name:`'${voteType}' vs rest| train (AUC = ${data.train_auc})`, line:{color:data.color,width:3}, hovertemplate:'FPR: %{x:.3f}<br>TPR: %{y:.3f}<extra></extra>' },
            { x:data.test_fpr, y:data.test_tpr, mode:'lines', name:`'${voteType}' vs rest| test (AUC = ${data.test_auc})`, line:{color:data.color,width:2.5,dash:'dot'}, hovertemplate:'FPR: %{x:.3f}<br>TPR: %{y:.3f}<extra></extra>' }
        ];
        const layout = {
            xaxis: { title:{text:`Доля ошибочно спрогнозированных '${voteType}'<br>от общего количества остальных типов (FPR)`,font:{size:9}}, range:[0,1], showgrid:true, gridcolor:'#e0e0e0' },
            yaxis: { title:{text:`Доля верно спрогнозированных '${voteType}'<br>от общего количества '${voteType}' (TPR)`,font:{size:9}}, range:[0,1], showgrid:true, gridcolor:'#e0e0e0' },
            margin:{t:10,l:80,r:20,b:80}, legend:{x:0.5,y:-0.35,xanchor:'center',orientation:'v',font:{size:8}}, font:{size:10}, plot_bgcolor:'#ffffff', paper_bgcolor:'#ffffff'
        };
        Plotly.newPlot(divId, traces, layout, {responsive:true, displayModeBar:false});
    });
}

// ============= UNITY — ИНТЕРАКТИВНЫЙ ГРАФИК PLOTLY =============
function generateUnityDynamics() {
    const plotDiv = document.getElementById('unity-dynamics-plot');
    if (!plotDiv) return;
    const sessions = [1,2,3,4,5,6,7,8,9,10];
    const factions = {
        'Блок Петра Порошенко':           { values:[0.55,0.63,0.20,0.55,0.56,0.28,0.39,0.48,0.50,0.53], color:'#cf2034' },
        'Народный фронт':                 { values:[0.59,0.69,0.21,0.57,0.59,0.29,0.39,0.52,0.57,0.61], color:'#f97000' },
        'Самопомощь':                     { values:[0.47,0.59,0.22,0.47,0.45,0.33,0.38,0.43,0.30,0.53], color:'#159100' },
        'Батьковщина':                    { values:[0.09,-0.05,-0.67,-0.23,-0.15,-0.48,-0.48,-0.34,-0.45,-0.13], color:'#8f0072' },
        'Радикальная Партия Олега Ляшко': { values:[0.18,0.29,-0.69,-0.28,-0.05,-0.54,-0.38,-0.13,-0.18,0.25], color:'#e1e200' },
        'вне фракции':                    { values:[0.31,0.28,0.11,0.29,0.29,0.15,0.21,0.26,0.26,0.42], color:'#bbbbbb' },
        'Воля народа':                    { values:[-0.67,-0.58,-0.87,-0.60,-0.60,-0.80,-0.72,-0.68,-0.55,-0.65], color:'#9ba500' },
        'Возрождение':                    { values:[-0.66,-0.65,-0.88,-0.65,-0.62,-0.81,-0.71,-0.65,-0.47,-0.71], color:'#1494a6' },
        'Оппозиционный блок':             { values:[-0.80,-0.78,-0.89,-0.67,-0.75,-0.73,-0.74,-0.69,-0.64,-0.57], color:'#0000ff' }
    };
    const traces = Object.keys(factions).map(name => ({
        x: sessions, y: factions[name].values, mode: 'lines+markers', name: name,
        line: { color: factions[name].color, width: 2.5 },
        marker: { size: 8, color: factions[name].color },
        hovertemplate: '<b>' + name + '</b><br>Сессия: %{x}<br>Unity: %{y:.2f}<extra></extra>'
    }));
    const layout = {
        title: { text: 'Динамика сплоченности фракций (Unity) по сессиям ВРУ-8', font: { size: 16, color: '#2c3e50' } },
        xaxis: { title: 'Сессия ВРУ-8', tickmode: 'linear', tick0: 1, dtick: 1, showgrid: true, gridcolor: '#e0e0e0' },
        yaxis: { title: 'Индекс сплоченности (Unity)', range: [-1,1], showgrid: true, gridcolor: '#e0e0e0', zeroline: true, zerolinecolor: '#666', zerolinewidth: 2 },
        hovermode: 'closest',
        legend: { orientation: 'v', x: 1.02, y: 1, xanchor: 'left', bgcolor: 'rgba(255,255,255,0.9)', bordercolor: '#e0e0e0', borderwidth: 1 },
        margin: { l: 80, r: 250, t: 80, b: 80 },
        plot_bgcolor: '#ffffff', paper_bgcolor: '#ffffff',
        font: { family: 'Arial, sans-serif', size: 12 }
    };
    Plotly.newPlot('unity-dynamics-plot', traces, layout, { responsive: true, displayModeBar: true, displaylogo: false, modeBarButtonsToRemove: ['pan2d','lasso2d','select2d'] });
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
                    <h2>Сетевой граф депутатов</h2>
                    <p>Визуализация связей бизнеса и сфер деятельности</p>
                </div>
            </div>
            
            <div class="modal-body">
                <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 1rem; margin-bottom: 2rem;">
                    <div class="graph-type-card" onclick="loadCase2GraphType('coauthorship')" 
                         style="background: linear-gradient(135deg, #fff5f5 0%, #ffe8e8 100%); border: 2px solid #ffcdd2; border-radius: 12px; padding: 2rem; cursor: pointer; text-align: center; transition: all 0.3s;">
                        <i class="fas fa-users" style="font-size: 2.5rem; color: #e74c3c; margin-bottom: 1rem;"></i>
                        <h4 style="margin: 0; color: #c0392b; font-size: 1.1rem;">Граф соавторства<br>законопроектов</h4>
                        <p style="font-size: 0.85rem; color: #666; margin-top: 0.5rem;">
                            Связи депутатов через совместное авторство законопроектов
                        </p>
                    </div>

                    <div class="graph-type-card active" onclick="loadCase2GraphType('industry')" 
                         style="background: linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%); border: 3px solid #2196F3; border-radius: 12px; padding: 2rem; cursor: pointer; text-align: center; transition: all 0.3s; box-shadow: 0 4px 12px rgba(33, 150, 243, 0.3);">
                        <i class="fas fa-industry" style="font-size: 2.5rem; color: #2196F3; margin-bottom: 1rem;"></i>
                        <h4 style="margin: 0; color: #1976d2; font-size: 1.1rem;">Граф отраслевых<br>связей</h4>
                        <p style="font-size: 0.85rem; color: #666; margin-top: 0.5rem;">
                            <strong>ИНТЕРАКТИВНО:</strong> Связи депутатов с бизнесом и отраслями
                        </p>
                    </div>

                    <div class="graph-type-card" onclick="loadCase2GraphType('voting')" 
                         style="background: linear-gradient(135deg, #f3e5f5 0%, #e1bee7 100%); border: 2px solid #ce93d8; border-radius: 12px; padding: 2rem; cursor: pointer; text-align: center; transition: all 0.3s;">
                        <i class="fas fa-vote-yea" style="font-size: 2.5rem; color: #9c27b0; margin-bottom: 1rem;"></i>
                        <h4 style="margin: 0; color: #7b1fa2; font-size: 1.1rem;">Граф<br>соголосования</h4>
                        <p style="font-size: 0.85rem; color: #666; margin-top: 0.5rem;">
                            Связи депутатов через совместное голосование
                        </p>
                    </div>
                </div>

                <div id="case2-deputy-selector" style="background: #f5f5f5; padding: 1.5rem; border-radius: 8px; margin-bottom: 1.5rem;">
                    <label style="display: block; margin-bottom: 0.5rem; font-weight: 600;">
                        <i class="fas fa-user"></i> Выберите депутата для интерактивного графа:
                    </label>
                    <div style="display: flex; gap: 1rem; align-items: center;">
                        <select id="case2-deputy-select" style="flex: 1; padding: 0.75rem; border: 2px solid #e74c3c; border-radius: 4px; font-size: 1rem;">
                            <option value="">Загрузка...</option>
                        </select>
                        <button onclick="loadCase2DeputyGraph()" class="btn-primary" style="padding: 0.75rem 2rem;">
                            <i class="fas fa-chart-line"></i> Загрузить граф
                        </button>
                    </div>
                </div>

                <div id="case2-content-area" style="min-height: 600px;">
                    <div id="case2-filters" style="display: none; background: #f8f9fa; padding: 1.5rem; border-radius: 8px; margin-bottom: 1.5rem;">
                        <h4><i class="fas fa-filter"></i> Фильтры</h4>
                        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem; margin-top: 1rem;">
                            <div>
                                <label style="display: block; margin-bottom: 0.5rem; font-weight: 600;">Поиск:</label>
                                <input type="text" id="case2-search" placeholder="Название..." 
                                       oninput="case2SearchNodes(this.value)"
                                       onkeypress="if(event.key==='Enter'){event.preventDefault(); case2SearchNodes(this.value);}"
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
                    <div id="case2-industry-explanation" style="display:none; margin-top:1rem;" class="explanation-box">
                        <p><i class="fas fa-info-circle" style="margin-right:0.25rem;"></i><strong>Пояснение:</strong> [ВСТАВЬТЕ ТЕКСТ ПОЯСНЕНИЯ] <a href="/karasev_science/projects/main-project/index.html#отраслевые-лобби">→ Подробнее в разделе «Отраслевые лобби»</a></p>
                    </div>
                    <div id="case2-static-image" style="display: none;">
                        <div style="background: white; border-radius: 8px; padding: 2rem; box-shadow: 0 2px 8px rgba(0,0,0,0.1); min-height: 600px; display: flex; align-items: center; justify-content: center;">
                            <img id="case2-graph-image" style="max-width: 100%; height: auto;" alt="График">
                        </div>
                        <p id="case2-image-caption" style="text-align: center; color: #666; font-size: 0.9rem; margin-top: 1rem;"></p>
                    </div>

                    <div id="case2-results"></div>
                </div>
            </div>
        </div>
    `;
    modal.style.display = 'flex';
    loadCase2DeputiesList();
    loadCase2GraphType('industry');
}

function loadCase2GraphType(type) {
    const staticImage = document.getElementById('case2-static-image');
    const graphContainer = document.getElementById('case2-graph-container');
    const filters = document.getElementById('case2-filters');
    const deputySelector = document.getElementById('case2-deputy-selector');
    const image = document.getElementById('case2-graph-image');
    const caption = document.getElementById('case2-image-caption');

    staticImage.style.display = 'none';
    graphContainer.style.display = 'none';
    filters.style.display = 'none';

    if (type === 'coauthorship') {
        deputySelector.style.display = 'none';
        staticImage.style.display = 'block';
        image.src = '/karasev_science/images/graphs/coauthorship_graph.png';
        image.onerror = function() {
            this.parentElement.innerHTML = `
                <div style="display: flex; flex-direction: column; align-items: center; color: #999;">
                    <i class="fas fa-image" style="font-size: 4rem; margin-bottom: 1rem;"></i>
                    <p style="font-size: 1.2rem;">Вставьте изображение графа соавторства</p>
                    <small>Путь: /images/graphs/coauthorship_graph.png</small>
                </div>
            `;
        };
        caption.innerHTML = 'Граф соавторства депутатов Верховной Рады VIII созыва (448 депутатов). Связи показывают совместное авторство законопроектов.<br><br><div class="explanation-box" style="text-align:left;"><p><i class="fas fa-info-circle" style="margin-right:0.25rem;"></i><strong>Пояснение:</strong> [ВСТАВЬТЕ ТЕКСТ ПОЯСНЕНИЯ] <a href="/karasev_science/projects/main-project/index.html#iii-9b">→ Подробнее в разделе «Сети соавторства законопроектов»</a></p></div>';
    } else if (type === 'industry') {
        deputySelector.style.display = 'block';
    } else if (type === 'voting') {
        deputySelector.style.display = 'none';
        staticImage.style.display = 'block';
        image.src = '/karasev_science/images/graphs/covoting_graph.png';
        image.onerror = function() {
            this.parentElement.innerHTML = `
                <div style="display: flex; flex-direction: column; align-items: center; color: #999;">
                    <i class="fas fa-image" style="font-size: 4rem; margin-bottom: 1rem;"></i>
                    <p style="font-size: 1.2rem;">Вставьте изображение графа соголосования</p>
                    <small>Путь: /images/graphs/covoting_graph.png</small>
                </div>
            `;
        };
        caption.innerHTML = 'Граф соголосования депутатов по законопроекту № 1310. <strong>Важно:</strong> граф построен только по одному законопроекту № 1310, а не по всем голосованиям ВРУ-8 за 5 лет.<br><br><div class="explanation-box" style="text-align:left;"><p><i class="fas fa-info-circle" style="margin-right:0.25rem;"></i><strong>Пояснение:</strong> [ВСТАВЬТЕ ТЕКСТ ПОЯСНЕНИЯ] <a href="/karasev_science/projects/main-project/index.html#кейс-коломойского">→ Подробнее в разделе «Кейс «людей Коломойского» в ВРУ-VIII»</a></p></div>';
    }
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
        document.getElementById('case2-industry-explanation').style.display = 'block';

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
                    <h2>Сравнение прогнозов с реальностью</h2>
                    <p>На примере законопроекта «О внесении изменений в Закон Украины Об Акционерных обществах»</p>
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
                <option value="${v.id}">${getVotingDate(v.id)} - ${formatVotingName(v.name, v.id)}</option>
            `).join('');
            case3CurrentVoting = data.votings[0].id;
        }
    } catch (error) {
        console.error('Ошибка:', error);
    }
}


function getVotingDate(votingId) {
    const dates = {
        '121108': '2015-03-19',
        '121208': '2015-03-19',
        '121308': '2015-03-19',
        '121408': '2015-03-19',
        '121508': '2015-03-19',
        '94008': '2015-03-02',
        '94108': '2015-03-02'
    };
    return dates[votingId] || votingId;
}

function formatVotingName(originalName, votingId) {
    const votingNames = {
        '121108': 'Отмена предыдущей редакции закона "Об акционерных обществах"',
        '121208': 'Рассмотрение законопроекта по сокращенной процедуре',
        '121308': 'Первое чтение законопроекта',
        '121408': 'Второе чтение законопроекта',
        '121508': 'Третье чтение законопроекта (финальное голосование)',
        '94008': 'Включение законопроектов в повестку дня',
        '94108': 'Повторное включение законопроектов в повестку дня'
    };

    return votingNames[votingId] || originalName;
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
                        ${factions.map(f => `<option value='${f}'>${f}</option>`).join('')}
                    </select>
                </div>
                
                <div class="filter-group">
                    <label>Реальный голос:</label>
                    <select id="case3-filter-real" onchange="applyCase3Filters()">
                        <option value="">Все</option>
                        ${voteTypes.map(v => `<option value='${v}'>${v}</option>`).join('')}
                    </select>
                </div>
                
                <div class="filter-group">
                    <label>Прогноз модели:</label>
                    <select id="case3-filter-pred" onchange="applyCase3Filters()">
                        <option value="">Все</option>
                        ${voteTypes.map(v => `<option value='${v}'>${v}</option>`).join('')}
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
                        
                        const rowStyle = getErrorRowColor(dep.real_vote, dep.predicted_vote);
                        
                        return `
                            <tr style="${rowStyle}">
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

// Умная раскраска ошибок: желтый для похожих, красный для противоположных
function getErrorRowColor(realVote, predVote) {
    if (realVote === predVote) return ''; // Правильно - без цвета

    // Группы похожих голосов
    const abstentionGroup = ['Воздержался', 'Не голосовал', 'Отсутствовал'];
    const activeGroup = ['За', 'Против'];

    // Если оба в группе воздержавшихся/отсутствующих - желтый (похожие)
    if (abstentionGroup.includes(realVote) && abstentionGroup.includes(predVote)) {
        return 'background-color: #fff3cd;'; // Желтый
    }


    if ((realVote === 'За' && predVote === 'Против') ||
        (realVote === 'Против' && predVote === 'За')) {
        return 'background-color: #f8d7da;'; // Красный
    }

    return 'background-color: #fff3cd;'; // Желтый
}
// ============================================
// КЕЙС 4: ML-симулятор голосования
// ============================================
let case4SimulationResults = null;

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
                        
                        <style>
                            .bill-params-grid {
                                display: grid;
                                grid-template-columns: repeat(2, 1fr);
                                gap: 1.5rem;
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
                            .param-card.numeric-param {
                                border-color: #667eea;
                                background: linear-gradient(135deg, rgba(102,126,234,0.03) 0%, rgba(118,75,162,0.03) 100%);
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
                                display: block;
                                font-weight: 600;
                                color: #2c3e50;
                                margin-bottom: 0.75rem;
                                font-size: 0.95rem;
                            }
                            .param-label i {
                                color: #667eea;
                                margin-right: 0.5rem;
                            }
                            .param-select, .param-input {
                                width: 100%;
                                padding: 0.75rem;
                                border: 1px solid #ced4da;
                                border-radius: 6px;
                                font-size: 0.95rem;
                                background: white;
                                transition: border-color 0.2s, box-shadow 0.2s;
                            }
                            .param-select:focus, .param-input:focus {
                                outline: none;
                                border-color: #667eea;
                                box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.15);
                            }
                            .param-help {
                                font-size: 0.8rem;
                                color: #6c757d;
                                margin-top: 0.5rem;
                            }
                            .param-help.scaler-note {
                                color: #667eea;
                                font-style: italic;
                            }
                            .btn-simulate {
                                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                                color: white;
                                padding: 1rem 2rem;
                                width: 100%;
                                margin-top: 2rem;
                                border: none;
                                border-radius: 8px;
                                font-size: 1.1rem;
                                font-weight: 600;
                                cursor: pointer;
                                transition: transform 0.2s, box-shadow 0.2s;
                                display: flex;
                                align-items: center;
                                justify-content: center;
                                gap: 0.5rem;
                            }
                            .btn-simulate:hover {
                                transform: translateY(-2px);
                                box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
                            }
                            @media (max-width: 768px) {
                                .bill-params-grid {
                                    grid-template-columns: 1fr;
                                }
                            }
                        </style>
                        
                        <div class="bill-params-grid">
                            <!-- Параметр 1: Инициатор законопроекта -->
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
                                    <option value="9" selected>Народный депутат Украины</option>
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
                            
                            <!-- Параметр 2: Рубрика законопроекта -->
                            <div class="param-card">
                                <div class="param-number">2</div>
                                <label class="param-label">
                                    <i class="fas fa-folder-open"></i> Рубрика законопроекта
                                </label>
                                <select name="rubric" required class="param-select">
                                    <option value="0" selected>Государственное строительство</option>
                                    <option value="1">Экономическая политика</option>
                                    <option value="2">Социальная политика</option>
                                    <option value="3">Гуманитарная и информационная политика</option>
                                    <option value="4">Правовая политика</option>
                                    <option value="5">Безопасность и оборона</option>
                                    <option value="6">Отраслевое развитие</option>
                                    <option value="7">Другие (заявления обращения ВРУ)</option>
                                </select>
                            </div>
                            
                            <div class="param-card">
                                <div class="param-number">3</div>
                                <label class="param-label">
                                    <i class="fas fa-file-contract"></i> Тип законопроекта
                                </label>
                                <select name="type" required class="param-select">
                                    <option value="0" selected>Проект Закона</option>
                                    <option value="1">Проект Постановления</option>
                                    <option value="2">Проект Заявления</option>
                                    <option value="3">Предложения Президента к Закону</option>
                                </select>
                            </div>

                            <!-- Параметр 4: Инициаторы по фракциям (ИСПРАВЛЕНО - теперь включает КабМін, Президент) -->
                            <div class="param-card">
                                <div class="param-number">4</div>
                                <label class="param-label">
                                    <i class="fas fa-users"></i> Инициаторы по фракциям
                                </label>
                                <select name="initiators_sort" required class="param-select">
                                    <option value="КабМін" selected>Кабинет Министров</option>
                                    <option value="Президент">Президент</option>
                                    <option value="БПП">БПП</option>
                                    <option value="НФ">НФ</option>
                                    <option value="Вне_Фр">Вне фракций</option>
                                    <option value="ОпБл">Оппозиционный блок</option>
                                    <option value="Бтк">Батькивщина</option>
                                    <option value="СмПм">Самопомощь</option>
                                    <option value="РпОЛ">Радикальная партия</option>
                                    <option value="Взржд">Возрождение</option>
                                    <option value="Вл_Нр">Воля народа</option>
                                    <option value="НФ, БПП">НФ + БПП</option>
                                    <option value="БПП, НФ">БПП + НФ</option>
                                    <option value="Вне_Фр, БПП">Вне фракций + БПП</option>
                                    <option value="Вне_Фр, НФ">Вне фракций + НФ</option>
                                    <option value="Вне_Фр, ОпБл">Вне фракций + ОпБл</option>
                                    <option value="Вне_Фр, Бтк">Вне фракций + Батькивщина</option>
                                    <option value="Вне_Фр, СмПм">Вне фракций + Самопомощь</option>
                                    <option value="Бтк, БПП">Батькивщина + БПП</option>
                                    <option value="Бтк, НФ">Батькивщина + НФ</option>
                                    <option value="Бтк, СмПм">Батькивщина + Самопомощь</option>
                                    <option value="Бтк, РпОЛ">Батькивщина + Радикальная партия</option>
                                    <option value="НФ, СмПм">НФ + Самопомощь</option>
                                    <option value="НФ, Бтк">НФ + Батькивщина</option>
                                    <option value="НФ, РпОЛ">НФ + Радикальная партия</option>
                                    <option value="СмПм, БПП">Самопомощь + БПП</option>
                                    <option value="Взржд, БПП">Возрождение + БПП</option>
                                    <option value="НФ, СмПм, БПП">НФ + Самопомощь + БПП</option>
                                    <option value="Вне_Фр, Бтк, БПП">Вне фракций + Батькивщина + БПП</option>
                                    <option value="Взржд, СмПм, БПП">Возрождение + Самопомощь + БПП</option>
                                    <option value="Бтк, РпОЛ, БПП">Батькивщина + Радикальная партия + БПП</option>
                                </select>
                            </div>

                            <!-- Параметр 5: Авторы поправок по фракциям (ИСПРАВЛЕНО - теперь только фракции) -->
                            <div class="param-card">
                                <div class="param-number">5</div>
                                <label class="param-label">
                                    <i class="fas fa-edit"></i> Авторы поправок по фракциям
                                </label>
                                <select name="ammendments_authors_sorted" required class="param-select">
                                    <option value="unknown" selected>Неизвестно / нет поправок</option>
                                    <option value="БПП">БПП</option>
                                    <option value="НФ">НФ</option>
                                    <option value="Вне_Фр">Вне фракций</option>
                                    <option value="ОпБл">Оппозиционный блок</option>
                                    <option value="Бтк">Батькивщина</option>
                                    <option value="СмПм">Самопомощь</option>
                                    <option value="РпОЛ">Радикальная партия</option>
                                    <option value="Взржд">Возрождение</option>
                                    <option value="НФ, БПП">НФ + БПП</option>
                                    <option value="БПП, НФ">БПП + НФ</option>
                                    <option value="БПП, Вне_Фр">БПП + Вне фракций</option>
                                    <option value="БПП, Вне_Фр, НФ">БПП + Вне фракций + НФ</option>
                                    <option value="БПП, Бтк, НФ">БПП + Батькивщина + НФ</option>
                                    <option value="БПП, Бтк, Вне_Фр, НФ">БПП + Батькивщина + Вне фракций + НФ</option>
                                    <option value="БПП, Бтк, Вне_Фр, НФ, РпОЛ, СмПм">Широкая коалиция</option>
                                    <option value="Бтк, БПП">Батькивщина + БПП</option>
                                    <option value="Бтк, ОпБл">Батькивщина + ОпБл</option>
                                    <option value="РпОЛ, БПП">Радикальная партия + БПП</option>
                                    <option value="Взржд, Вне_Фр">Возрождение + Вне фракций</option>
                                    <option value="Взржд, НФ, БПП">Возрождение + НФ + БПП</option>
                                    <option value="Взржд, Бтк, БПП">Возрождение + Батькивщина + БПП</option>
                                    <option value="НФ, Бтк, СмПм">НФ + Батькивщина + Самопомощь</option>
                                    <option value="НФ, СмПм, РпОЛ">НФ + Самопомощь + Радикальная партия</option>
                                </select>
                            </div>

                            <div class="param-card">
                                <div class="param-number">6</div>
                                <label class="param-label">
                                    <i class="fas fa-clipboard-list"></i> Тип процедуры голосования
                                </label>
                                <select name="meta_type_name_eng" required class="param-select">
                                    <option value="final_voting" selected>Постановка на голосование (первое чтение)</option>
                                    <option value="second_voting">Второе чтение</option>
                                    <option value="agenda">Включение в повестку дня</option>
                                    <option value="ammendments">Голосование поправок</option>
                                    <option value="cancel">Отмена/снятие</option>
                                    <option value="short_procedure">Сокращённая процедура</option>
                                    <option value="signal_voting">Сигнальное голосование</option>
                                </select>
                            </div>

                            <!-- Параметр 7: Количество инициаторов -->
                            <div class="param-card numeric-param">
                                <div class="param-number">7</div>
                                <label class="param-label">
                                    <i class="fas fa-users"></i> Количество инициаторов
                                </label>
                                <input type="number"
                                       name="N_initiators"
                                       required
                                       class="param-input"
                                       min="1"
                                       max="200"
                                       value="10"
                                       placeholder="Введите число от 1 до 200">
                                <div class="param-help">
                                    <i class="fas fa-info-circle"></i> От 1 до 200 депутатов
                                </div>
                                <div class="param-help scaler-note">
                                    <i class="fas fa-cog"></i> Нормируется StandardScaler
                                </div>
                            </div>

                            <!-- Параметр 8: Количество поправок -->
                            <div class="param-card numeric-param">
                                <div class="param-number">8</div>
                                <label class="param-label">
                                    <i class="fas fa-edit"></i> Количество поправок
                                </label>
                                <input type="number"
                                       name="law_circ"
                                       required
                                       class="param-input"
                                       min="1"
                                       max="3000"
                                       value="200"
                                       placeholder="Введите число от 1 до 3000">
                                <div class="param-help">
                                    <i class="fas fa-info-circle"></i> От 1 до 3000 поправок
                                </div>
                                <div class="param-help scaler-note">
                                    <i class="fas fa-cog"></i> Нормируется StandardScaler
                                </div>
                            </div>
                        </div>

                        <button type="submit" class="btn-simulate">
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

    const nInitiators = parseInt(formData.get('N_initiators'));
    const lawCirc = parseInt(formData.get('law_circ'));

    if (nInitiators < 1 || nInitiators > 200) {
        alert('Количество инициаторов должно быть от 1 до 200');
        return;
    }

    if (lawCirc < 1 || lawCirc > 3000) {
        alert('Количество поправок должно быть от 1 до 3000');
        return;
    }

    const params = {
        mainExecutives: formData.get('mainExecutives'),
        rubric: formData.get('rubric'),
        type: formData.get('type'),
        initiators_sort: formData.get('initiators_sort'),
        ammendments_authors_sorted: formData.get('ammendments_authors_sorted'),
        meta_type_name_eng: formData.get('meta_type_name_eng'),
        N_initiators: nInitiators,
        law_circ: lawCirc
    };

    console.log('📤 Отправляем параметры:', params);

    const resultsDiv = document.getElementById('simulationResults');
    resultsDiv.innerHTML = `
        <div style="text-align: center; padding: 2rem; margin-top: 2rem; background: #f8f9fa; border-radius: 8px;">
            <div class="spinner"></div>
            <p style="margin-top: 1rem; font-size: 1.1rem;">Симуляция голосования...</p>
            <p style="color: #7f8c8d; font-size: 0.9rem; margin-top: 0.5rem;">
                ⏰ Первый запрос может занять до 60 секунд (сервер просыпается)
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

        console.log('📥 Получены результаты:', data);
        case4SimulationResults = data;
        displayCase4SimulationResults(data);

    } catch (error) {
        console.error('Ошибка симуляции:', error);
        resultsDiv.innerHTML = `
            <div style="background: #fee; padding: 1rem; border-radius: 8px; margin-top: 2rem; border-left: 4px solid #e74c3c;">
                <strong style="color: #e74c3c;">Ошибка подключения:</strong> ${error.message}
                <p style="margin-top: 0.5rem; color: #666;">Проверьте подключение к интернету или попробуйте позже.</p>
            </div>
        `;
    }
}

function displayCase4SimulationResults(data) {
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

            <div style="text-align: center; margin-bottom: 2rem;">
                <button onclick="showCase4RealVotingComparison()" class="btn-primary" style="padding: 1rem 2rem; font-size: 1.1rem; background: linear-gradient(135deg, #3498db 0%, #2980b9 100%); color: white; border: none; border-radius: 8px; cursor: pointer; transition: transform 0.2s;">
                    <i class="fas fa-balance-scale"></i> Сравнить с реальным голосованием
                </button>
                <p style="color: #666; margin-top: 0.5rem; font-size: 0.9rem;">
                    Загрузит реальные данные и покажет разницу между прогнозом и реальностью
                </p>
            </div>

            <div style="display: grid; grid-template-columns: repeat(5, 1fr); gap: 1rem; margin-bottom: 2rem;">
                ${generateCase4VoteCards(data.vote_counts)}
            </div>

            <div style="background: white; padding: 1.5rem; border-radius: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); margin-bottom: 2rem;">
                <h3 style="margin-bottom: 1rem;"><i class="fas fa-users"></i> Голосование по фракциям</h3>
                <div style="overflow-x: auto;">
                    ${generateCase4FactionTable(data.faction_votes)}
                </div>
            </div>

            <details style="background: white; padding: 1.5rem; border-radius: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
                <summary style="cursor: pointer; font-size: 1.2rem; font-weight: 600; padding: 0.5rem;">
                    <i class="fas fa-list"></i> Показать детали по всем депутатам (${data.total_deputies})
                </summary>
                <div style="margin-top: 1rem;">
                    <div style="display: flex; gap: 1rem; margin-bottom: 1rem; flex-wrap: wrap;">
                        <select id="case4FactionFilter" onchange="applyCase4Filters()" style="padding: 0.5rem; border-radius: 4px; border: 1px solid #ddd;">
                            <option value="all">Все фракции</option>
                            ${getCase4UniqueFactions(data.deputies).map(f => `<option value="${f}">${f}</option>`).join('')}
                        </select>
                        <select id="case4VoteFilter" onchange="applyCase4Filters()" style="padding: 0.5rem; border-radius: 4px; border: 1px solid #ddd;">
                            <option value="all">Все голоса</option>
                            <option value="За">За</option>
                            <option value="Против">Против</option>
                            <option value="Воздержался">Воздержался</option>
                            <option value="Не голосовал">Не голосовал</option>
                            <option value="Отсутствовал">Отсутствовал</option>
                        </select>
                    </div>
                    <div id="case4DeputiesTable" style="max-height: 500px; overflow-y: auto;">
                        ${generateCase4DeputiesTable(data.deputies)}
                    </div>
                </div>
            </details>
        </div>
    `;
}

function getCase4UniqueFactions(deputies) {
    return [...new Set(deputies.map(d => d.faction))].sort();
}

function applyCase4Filters() {
    if (!case4SimulationResults) return;

    const factionFilter = document.getElementById('case4FactionFilter').value;
    const voteFilter = document.getElementById('case4VoteFilter').value;

    let filtered = case4SimulationResults.deputies;

    if (factionFilter !== 'all') {
        filtered = filtered.filter(d => d.faction === factionFilter);
    }

    if (voteFilter !== 'all') {
        filtered = filtered.filter(d => d.vote === voteFilter);
    }

    document.getElementById('case4DeputiesTable').innerHTML = generateCase4DeputiesTable(filtered);
}

async function showCase4RealVotingComparison() {
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

        displayCase4VotingComparison(case4SimulationResults, realData);

    } catch (error) {
        console.error('Ошибка загрузки реального голосования:', error);
        document.getElementById('real-voting-section').innerHTML = `
            <div style="background: #fee; padding: 1rem; border-radius: 8px; border-left: 4px solid #e74c3c;">
                <strong style="color: #e74c3c;">Ошибка подключения:</strong> ${error.message}
            </div>
        `;
    }
}

function displayCase4VotingComparison(simulationData, realData) {
    const section = document.getElementById('real-voting-section');
    const voteTypes = ['За', 'Против', 'Воздержался', 'Не голосовал', 'Отсутствовал'];

    section.innerHTML = `
        <h3 style="margin-bottom: 1.5rem; color: #2c3e50; text-align: center;">
            <i class="fas fa-balance-scale"></i> Сравнение: Симуляция vs Прогноз vs Реальность
        </h3>

        <div style="background: #fff3cd; padding: 1rem; border-radius: 8px; margin-bottom: 1.5rem; border-left: 4px solid #ffc107;">
            <strong>📌 Примечание:</strong> Показано реальное голосование от 08.04.2016 (ID: 94008) для сравнения с вашей симуляцией.
        </div>

        <style>
            .comparison-block {
                background: white;
                padding: 1.5rem;
                border-radius: 12px;
                box-shadow: 0 2px 8px rgba(0,0,0,0.1);
            }
            .comparison-block h3 {
                margin: 0 0 1rem 0;
                font-size: 1.1rem;
                color: #2c3e50;
                text-align: center;
            }
            .vote-breakdown {
                display: flex;
                flex-direction: column;
                gap: 0.5rem;
            }
            .vote-item {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 0.5rem;
                border-radius: 4px;
                background: #f8f9fa;
            }
            .vote-label {
                color: white;
                padding: 0.25rem 0.75rem;
                border-radius: 4px;
                font-weight: 600;
                font-size: 0.85rem;
                min-width: 100px;
                text-align: center;
            }
            .vote-count {
                font-weight: bold;
                font-size: 1.1rem;
            }
        </style>

        <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 1.5rem; margin-bottom: 2rem;">
            <div class="comparison-block">
                <h3><i class="fas fa-robot"></i> Ваша симуляция</h3>
                <div class="vote-breakdown">
                    ${voteTypes.map(type => {
                        const count = simulationData.vote_counts[type] || 0;
                        const color = getCase4VoteColor(type);
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

            <div class="comparison-block">
                <h3><i class="fas fa-brain"></i> Прогноз модели</h3>
                <div class="vote-breakdown">
                    ${voteTypes.map(type => {
                        const count = realData.statistics.pred_counts[type] || 0;
                        const color = getCase4VoteColor(type);
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

            <div class="comparison-block">
                <h3><i class="fas fa-flag-checkered"></i> Реальность</h3>
                <div class="vote-breakdown">
                    ${voteTypes.map(type => {
                        const count = realData.statistics.real_counts[type] || 0;
                        const color = getCase4VoteColor(type);
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

        <div style="background: white; padding: 1.5rem; border-radius: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); margin-bottom: 2rem;">
            <h3 style="margin-bottom: 1rem;"><i class="fas fa-users"></i> Реальное голосование по фракциям</h3>
            <div style="overflow-x: auto;">
                ${generateCase4FactionTableFromRealData(realData.deputies)}
            </div>
        </div>

        <details style="background: white; padding: 1.5rem; border-radius: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
            <summary style="cursor: pointer; font-size: 1.2rem; font-weight: 600; padding: 0.5rem;">
                <i class="fas fa-list"></i> Показать детали реального голосования (${realData.deputies.length} депутатов)
            </summary>
            <div style="margin-top: 1rem; max-height: 500px; overflow-y: auto;">
                ${generateCase4RealVotingTable(realData.deputies)}
            </div>
        </details>
    `;
}

function getCase4VoteColor(vote) {
    const colors = {
        'За': '#27ae60',
        'Против': '#e74c3c',
        'Воздержался': '#f39c12',
        'Не голосовал': '#95a5a6',
        'Отсутствовал': '#34495e'
    };
    return colors[vote] || '#95a5a6';
}

function generateCase4VoteCards(counts) {
    const voteConfig = {
        'За': { color: '#27ae60', icon: 'fa-thumbs-up' },
        'Против': { color: '#e74c3c', icon: 'fa-thumbs-down' },
        'Воздержался': { color: '#f39c12', icon: 'fa-hand-paper' },
        'Не голосовал': { color: '#95a5a6', icon: 'fa-minus-circle' },
        'Отсутствовал': { color: '#34495e', icon: 'fa-user-slash' }
    };

    const total = Object.values(counts).reduce((a, b) => a + b, 0);

    return Object.entries(counts).map(([vote, count]) => {
        const config = voteConfig[vote] || { color: '#95a5a6', icon: 'fa-question' };
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

function generateCase4FactionTable(factionVotes) {
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
                <td style="padding: 0.75rem; text-align: center; background: rgba(39, 174, 96, 0.13);">${votes['За'] || 0}</td>
                <td style="padding: 0.75rem; text-align: center; background: rgba(231, 76, 60, 0.13);">${votes['Против'] || 0}</td>
                <td style="padding: 0.75rem; text-align: center; background: rgba(243, 156, 18, 0.13);">${votes['Воздержался'] || 0}</td>
                <td style="padding: 0.75rem; text-align: center; background: rgba(149, 165, 166, 0.13);">${votes['Не голосовал'] || 0}</td>
                <td style="padding: 0.75rem; text-align: center; background: rgba(52, 73, 79, 0.13);">${votes['Отсутствовал'] || 0}</td>
            </tr>
        `;
    }

    html += `</tbody></table>`;
    return html;
}

function generateCase4FactionTableFromRealData(deputies) {
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
                <td style="padding: 0.75rem; text-align: center; background: rgba(39, 174, 96, 0.13);">${votes['За']}</td>
                <td style="padding: 0.75rem; text-align: center; background: rgba(231, 76, 60, 0.13);">${votes['Против']}</td>
                <td style="padding: 0.75rem; text-align: center; background: rgba(243, 156, 18, 0.13);">${votes['Воздержался']}</td>
                <td style="padding: 0.75rem; text-align: center; background: rgba(149, 165, 166, 0.13);">${votes['Не голосовал']}</td>
                <td style="padding: 0.75rem; text-align: center; background: rgba(52, 73, 79, 0.13);">${votes['Отсутствовал']}</td>
            </tr>
        `;
    }

    html += `</tbody></table>`;
    return html;
}

function generateCase4DeputiesTable(deputies) {
    let html = `
        <table style="width: 100%; border-collapse: collapse; font-size: 0.9rem;">
            <thead style="background: #34495e; color: white; position: sticky; top: 0;">
                <tr>
                    <th style="padding: 0.75rem; text-align: center; width: 50px;">№</th>
                    <th style="padding: 0.75rem; text-align: left;">ФИО</th>
                    <th style="padding: 0.75rem; text-align: left;">Фракция</th>
                    <th style="padding: 0.75rem; text-align: center;">Голос</th>
                    <th style="padding: 0.75rem; text-align: center;">Уверенность</th>
                </tr>
            </thead>
            <tbody>
    `;

    deputies.forEach((deputy, index) => {
        const voteColor = getCase4VoteColor(deputy.vote);
        html += `
            <tr style="border-bottom: 1px solid #ecf0f1;">
                <td style="padding: 0.75rem; text-align: center; color: #999;">${index + 1}</td>
                <td style="padding: 0.75rem;">${deputy.name}</td>
                <td style="padding: 0.75rem;">${deputy.faction}</td>
                <td style="padding: 0.75rem; text-align: center;">
                    <span style="background: ${voteColor}; color: white; padding: 0.3rem 0.6rem; border-radius: 4px; font-weight: 600; display: inline-block; min-width: 100px;">
                        ${deputy.vote}
                    </span>
                </td>
                <td style="padding: 0.75rem; text-align: center;">${deputy.confidence || '-'}%</td>
            </tr>
        `;
    });

    html += `</tbody></table>`;
    return html;
}

function generateCase4RealVotingTable(deputies) {
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

        const rowBg = !deputy.is_correct ? 'background: #fff5f5;' : '';
        const realVoteColor = getCase4VoteColor(deputy.real_vote);
        const predVoteColor = getCase4VoteColor(deputy.predicted_vote);

        html += `
            <tr style="border-bottom: 1px solid #ecf0f1; ${rowBg}">
                <td style="padding: 0.75rem;">${deputy.fio}</td>
                <td style="padding: 0.75rem;">${deputy.faction}</td>
                <td style="padding: 0.75rem; text-align: center;">
                    <span style="background: ${realVoteColor}; color: white; padding: 0.3rem 0.6rem; border-radius: 4px; font-weight: 600; display: inline-block; min-width: 100px;">
                        ${deputy.real_vote}
                    </span>
                </td>
                <td style="padding: 0.75rem; text-align: center;">
                    <span style="background: ${predVoteColor}; color: white; padding: 0.3rem 0.6rem; border-radius: 4px; font-weight: 600; display: inline-block; min-width: 100px;">
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

        const rowBg = !deputy.is_correct ? 'background: #fff5f5;' : '';

        html += `
            <tr style="border-bottom: 1px solid #ecf0f1; ${rowBg}">
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

console.log('✅ Case4.js загружен успешно');
console.log('📡 API URL:', API_URL);
