from flask import Flask, request, jsonify
from flask_cors import CORS
import os
from collections import defaultdict

app = Flask(__name__)

CORS(app, resources={
    r"/*": {
        "origins": [
            "https://karasevdy.github.io",  # твой GitHub Pages
            "https://*.github.io",  # все поддомены github.io
            "http://localhost:*",  # для локальной разработки
            "http://127.0.0.1:*"
        ]
    }
})

# ============================================
# ЗАГРУЗКА ML МОДЕЛИ
# ============================================
MODEL_LOADED = False
PANDAS_LOADED = False
SKLEARN_LOADED = False
model = None
np = None
pd = None

try:
    from catboost import CatBoostClassifier
    import numpy as np_module

    np = np_module
    model = CatBoostClassifier()
    model.load_model('catboost_model_4_08_08_25.json')
    print("✅ Модель CatBoost загружена!")
    MODEL_LOADED = True
except ImportError as e:
    print(f"⚠️ CatBoost или NumPy не установлен: {e}")
except Exception as e:
    print(f"⚠️ Модель не загружена: {e}")

try:
    import pandas as pd_module

    pd = pd_module
    print("✅ Pandas установлен!")
    PANDAS_LOADED = True
except ImportError:
    print("❌ Pandas НЕ установлен!")

try:
    from sklearn.metrics import precision_recall_fscore_support
    from sklearn.preprocessing import StandardScaler

    SKLEARN_LOADED = True
    print("✅ sklearn установлен!")
except ImportError:
    print("⚠️ sklearn не установлен")


# ============================================
# ROOT ENDPOINT
# ============================================

@app.route('/')
def index():
    """API информация"""
    return jsonify({
        'status': 'ok',
        'message': 'Legislative Behaviour Modeling API',
        'version': '1.0',
        'endpoints': {
            'health': '/api/health',
            'deputies_list': '/api/deputies/list',
            'votings_list': '/api/votings_list',
            'predict': '/api/predict (POST)',
            'predict_all': '/api/predict_all (POST)',
            'simulate': '/api/simulate (POST)',
            'predict_voting': '/api/predict_voting/<voting_id> (POST)',
            'graph_real': '/api/graph/real/<deputy_name>',
            'graph_coauthorship': '/api/graph/coauthorship'
        },
        'models': {
            'catboost_loaded': MODEL_LOADED,
            'pandas_loaded': PANDAS_LOADED,
            'sklearn_loaded': SKLEARN_LOADED
        }
    })


# ============================================
# API ENDPOINTS - HEALTH CHECK
# ============================================

@app.route('/api/health', methods=['GET'])
def health():
    return jsonify({
        'status': 'ok',
        'model_loaded': MODEL_LOADED,
        'pandas_loaded': PANDAS_LOADED,
        'sklearn_loaded': SKLEARN_LOADED
    })


# ============================================
# API ENDPOINTS - ML MODEL
# ============================================

@app.route('/api/predict', methods=['POST'])
def predict():
    if not MODEL_LOADED:
        return jsonify({'success': False, 'error': 'Модель не загружена'}), 503

    try:
        data = request.get_json()
        features = data.get('features', [])

        if len(features) != 42:
            return jsonify({'success': False, 'error': f'Нужно 42 признака, получено {len(features)}'}), 400

        features_array = np.array(features, dtype=np.float64).reshape(1, -1)
        prediction = model.predict(features_array)
        proba = model.predict_proba(features_array)

        vote_classes = ['За', 'Против', 'Воздержался', 'Не голосовал', 'Отсутствовал']

        predicted_class = int(prediction.flatten()[0])
        probabilities_array = proba.flatten()

        probabilities = {}
        for i in range(min(len(vote_classes), len(probabilities_array))):
            probabilities[vote_classes[i]] = float(probabilities_array[i])

        confidence = float(max(probabilities_array)) * 100

        return jsonify({
            'success': True,
            'prediction': vote_classes[predicted_class] if predicted_class < len(vote_classes) else 'Неизвестно',
            'prediction_code': predicted_class,
            'probabilities': probabilities,
            'confidence': confidence
        })

    except Exception as e:
        print(f"❌ Ошибка прогноза: {e}")
        import traceback
        traceback.print_exc()
        return jsonify({'success': False, 'error': str(e)}), 500


@app.route('/api/deputies', methods=['GET'])
def get_deputies():
    if not PANDAS_LOADED:
        return jsonify({'success': False, 'error': 'Pandas не установлен'}), 500

    try:
        X_path = '../data/X_2273_94008.csv'
        y_path = '../data/y_2273_94008.csv'

        if not os.path.exists(X_path):
            return jsonify({'success': False, 'error': f'Файл не найден: {X_path}'}), 404

        if not os.path.exists(y_path):
            return jsonify({'success': False, 'error': f'Файл не найден: {y_path}'}), 404

        X = pd.read_csv(X_path)
        y = pd.read_csv(y_path)

        deputies = []
        for idx in range(len(X)):
            fio = X.iloc[idx]['fio']
            faction = X.iloc[idx]['fr_8']
            features = X.iloc[idx].drop(['fio', 'fr_8']).values.tolist()

            if 'vote' in y.columns:
                vote = int(y.iloc[idx]['vote'])
            else:
                vote = int(y.iloc[idx, -1])

            deputies.append({
                'index': idx,
                'name': fio,
                'faction': faction,
                'features': features,
                'real_vote': vote
            })

        return jsonify({
            'success': True,
            'deputies': deputies,
            'count': len(deputies)
        })

    except Exception as e:
        print(f"❌ Ошибка загрузки депутатов: {e}")
        import traceback
        traceback.print_exc()
        return jsonify({'success': False, 'error': str(e)}), 500


@app.route('/api/predict_all', methods=['POST'])
def predict_all():
    if not MODEL_LOADED or not PANDAS_LOADED:
        return jsonify({'success': False, 'error': 'Модель или Pandas не загружены'}), 503

    try:
        X_path = '../data/X_2273_94008.csv'
        y_path = '../data/y_2273_94008.csv'

        if not os.path.exists(X_path) or not os.path.exists(y_path):
            return jsonify({'success': False, 'error': 'Файлы данных не найдены'}), 404

        X = pd.read_csv(X_path)
        y = pd.read_csv(y_path)

        fio_list = X['fio'].tolist()
        faction_list = X['fr_8'].tolist()

        X_features = X.drop(columns=['fio', 'fr_8']).fillna(0)

        predictions = model.predict(X_features.values)
        probabilities = model.predict_proba(X_features.values)

        vote_classes = ['За', 'Против', 'Воздержался', 'Не голосовал', 'Отсутствовал']

        results = []
        real_counts = {'За': 0, 'Против': 0, 'Воздержался': 0, 'Не голосовал': 0, 'Отсутствовал': 0}
        pred_counts = {'За': 0, 'Против': 0, 'Воздержался': 0, 'Не голосовал': 0, 'Отсутствовал': 0}

        predictions_flat = predictions.flatten() if hasattr(predictions, 'flatten') else predictions

        for idx in range(len(X)):
            if 'vote' in y.columns:
                real_vote_code = int(y.iloc[idx]['vote'])
            else:
                real_vote_code = int(y.iloc[idx, -1])

            real_vote = vote_classes[real_vote_code]
            predicted_class = int(predictions_flat[idx])
            predicted_vote = vote_classes[predicted_class]
            confidence = float(probabilities[idx, predicted_class]) * 100
            is_correct = real_vote == predicted_vote

            real_counts[real_vote] += 1
            pred_counts[predicted_vote] += 1

            results.append({
                'name': fio_list[idx],
                'faction': faction_list[idx],
                'real_vote': real_vote,
                'real_vote_code': real_vote_code,
                'predicted_vote': predicted_vote,
                'predicted_vote_code': predicted_class,
                'confidence': round(confidence, 1),
                'is_correct': is_correct
            })

        total = len(results)
        correct = sum(1 for r in results if r['is_correct'])
        accuracy = (correct / total * 100) if total > 0 else 0

        real_passed = real_counts['За'] >= 226
        pred_passed = pred_counts['За'] >= 226

        return jsonify({
            'success': True,
            'deputies': results,
            'total': total,
            'correct': correct,
            'accuracy': round(accuracy, 2),
            'real_counts': real_counts,
            'pred_counts': pred_counts,
            'real_passed': real_passed,
            'pred_passed': pred_passed
        })

    except Exception as e:
        print(f"❌ Ошибка predict_all: {e}")
        import traceback
        traceback.print_exc()
        return jsonify({'success': False, 'error': str(e)}), 500


@app.route('/api/simulate', methods=['POST'])
def simulate_voting():
    if not MODEL_LOADED or not PANDAS_LOADED:
        return jsonify({'success': False, 'error': 'Модель или Pandas не загружены'}), 503

    try:
        import pickle

        data = request.get_json()

        print("=" * 60)
        print("📥 Получены параметры:")
        for k, v in data.items():
            print(f"   {k}: {v} (тип: {type(v).__name__})")
        print("=" * 60)

        # Загружаем данные депутатов
        deputies_df = pd.read_csv('../data/for_interact_when_user_chooses.csv')

        # Сохраняем ФИО и фракции
        fio_list = deputies_df['fio'].tolist()
        faction_list = deputies_df['fr_8'].tolist()

        # Удаляем ФИО и фракции для признаков
        features_df = deputies_df.drop(columns=['fio', 'fr_8'])

        # Список всех колонок в правильном порядке (как ожидает модель)
        expected_columns = features_df.columns.tolist()
        print(f"✅ Ожидаемый порядок колонок: {len(expected_columns)} шт")

        # ============================================
        # КАТЕГОРИАЛЬНЫЕ ПРИЗНАКИ - кодируем через encoder
        # ============================================
        categorical_features = [
            'mainExecutives',
            'rubric',
            'type',
            'initiators_sort',
            'ammendments_authors_sorted',
            'meta_type_name_eng'
        ]

        # Создаем DataFrame для кодирования (423 строки с одинаковыми значениями)
        cat_values = {}
        for col in categorical_features:
            if col in data:
                cat_values[col] = [data[col]] * len(features_df)
            else:
                cat_values[col] = ['x'] * len(features_df)  # значение по умолчанию

        cat_df = pd.DataFrame(cat_values)
        print(f"📋 Категориальные значения для кодирования:")
        for col in categorical_features:
            print(f"   {col}: '{cat_df[col].iloc[0]}'")

        # Загружаем CatBoostEncoder и кодируем
        try:
            encoder_path = 'CatBoostEncoder_for_case_5.pkl'
            with open(encoder_path, 'rb') as f:
                catboost_encoder = pickle.load(f)
            print(f"✅ CatBoostEncoder загружен из {encoder_path}")

            # Кодируем категориальные признаки
            encoded_values = catboost_encoder.transform(cat_df)

            # Преобразуем в DataFrame
            encoded_df = pd.DataFrame(
                encoded_values,
                columns=categorical_features,
                index=features_df.index
            )

            print(f"✅ Закодированные значения:")
            for col in categorical_features:
                print(f"   {col}: {encoded_df[col].iloc[0]:.6f}")

            # ЗАМЕНЯЕМ значения в features_df (не удаляем колонки!)
            for col in categorical_features:
                features_df[col] = encoded_df[col].values

        except FileNotFoundError:
            print(f"⚠️ {encoder_path} не найден!")
            # Используем значения по умолчанию (средние)
            for col in categorical_features:
                features_df[col] = 1.7  # примерное среднее значение
        except Exception as e:
            print(f"⚠️ Ошибка encoder: {e}")
            import traceback
            traceback.print_exc()
            for col in categorical_features:
                features_df[col] = 1.7

        # ============================================
        # КОЛИЧЕСТВЕННЫЕ ПРИЗНАКИ - нормализуем
        # ============================================

        # N_initiators (количество инициаторов)
        n_init = float(data.get('N_initiators', 10))
        # Нормализация: (x - mean) / std
        # Примерные значения из обучающей выборки: mean ~= 30, std ~= 50
        n_init_normalized = (n_init - 30) / 50
        features_df['N_initiators'] = n_init_normalized
        print(f"✅ N_initiators: {n_init} -> {n_init_normalized:.4f} (нормализовано)")

        # law_circ (количество поправок)
        law_circ = float(data.get('law_circ', 200))
        # Примерные значения: mean ~= 500, std ~= 800
        law_circ_normalized = (law_circ - 500) / 800
        features_df['law_circ'] = law_circ_normalized
        print(f"✅ law_circ: {law_circ} -> {law_circ_normalized:.4f} (нормализовано)")

        # Session - уже нормализована в исходных данных, но заменяем на выбранную
        session = float(data.get('Session', 4))
        # Примерные значения: mean ~= 4, std ~= 2
        session_normalized = (session - 4) / 2
        features_df['Session'] = session_normalized
        print(f"✅ Session: {session} -> {session_normalized:.4f} (нормализовано)")

        # ============================================
        # ПРОВЕРЯЕМ ПОРЯДОК КОЛОНОК
        # ============================================
        features_df = features_df[expected_columns]
        print(f"✅ Порядок колонок сохранён: {len(features_df.columns)} колонок")

        # ============================================
        # ДЕЛАЕМ ПРОГНОЗ
        # ============================================

        # Заполняем NaN нулями (на случай если остались пустые значения)
        features_df = features_df.fillna(0)

        predictions = model.predict(features_df.values)
        probabilities = model.predict_proba(features_df.values)

        vote_classes = ['За', 'Против', 'Воздержался', 'Не голосовал', 'Отсутствовал']

        results = []
        vote_counts = {'За': 0, 'Против': 0, 'Воздержался': 0, 'Не голосовал': 0, 'Отсутствовал': 0}
        faction_votes = {}

        predictions_flat = predictions.flatten() if hasattr(predictions, 'flatten') else predictions

        for i in range(len(predictions_flat)):
            predicted_class = int(predictions_flat[i])
            vote = vote_classes[predicted_class]

            confidence = float(probabilities[i, predicted_class]) * 100
            probs_dict = {vote_classes[j]: round(float(probabilities[i, j]) * 100, 1) for j in range(len(vote_classes))}

            vote_counts[vote] += 1

            faction = faction_list[i]
            if faction not in faction_votes:
                faction_votes[faction] = {v: 0 for v in vote_classes}
            faction_votes[faction][vote] += 1

            results.append({
                'name': fio_list[i],
                'faction': faction,
                'vote': vote,
                'confidence': round(confidence, 1),
                'probabilities': probs_dict
            })

        total_za = vote_counts['За']
        passed = total_za >= 226

        print("=" * 60)
        print(f"🗳️ РЕЗУЛЬТАТЫ СИМУЛЯЦИИ:")
        for vote_type, count in vote_counts.items():
            print(f"   {vote_type}: {count}")
        print(f"   ИТОГО 'За': {total_za} / 226 необходимо")
        print(f"   РЕШЕНИЕ: {'✅ ПРИНЯТ' if passed else '❌ НЕ ПРИНЯТ'}")
        print("=" * 60)

        return jsonify({
            'success': True,
            'passed': passed,
            'vote_counts': vote_counts,
            'faction_votes': faction_votes,
            'deputies': results,
            'total_deputies': len(results)
        })

    except Exception as e:
        print(f"❌ Ошибка симуляции: {e}")
        import traceback
        traceback.print_exc()
        return jsonify({'success': False, 'error': str(e)}), 500


# ============================================
# ENDPOINTS ДЛЯ КЕЙСА 3
# ============================================

@app.route('/api/votings_list', methods=['GET'])
def get_votings_list():
    votings = [
        {'id': '94008', 'date': '08.04.2016', 'name': 'Первое чтение', 'has_predictions': True},
        {'id': '94108', 'date': '08.01.2016', 'name': 'Голосование 94108', 'has_predictions': False},
        {'id': '121108', 'date': '08.11.2016', 'name': 'Голосование 121108', 'has_predictions': False},
        {'id': '121208', 'date': '08.12.2016', 'name': 'Голосование 121208', 'has_predictions': False},
        {'id': '121308', 'date': '08.01.2017', 'name': 'Голосование 121308', 'has_predictions': False},
        {'id': '121408', 'date': '08.02.2017', 'name': 'Голосование 121408', 'has_predictions': False},
        {'id': '121508', 'date': '08.03.2017', 'name': 'Голосование 121508', 'has_predictions': False}
    ]
    return jsonify({'success': True, 'votings': votings})


@app.route('/api/predict_voting/<voting_id>', methods=['POST'])
def predict_voting(voting_id):
    if not MODEL_LOADED or not PANDAS_LOADED:
        return jsonify({'success': False, 'error': 'Модель или Pandas не загружены'}), 503

    try:
        X_path = f'../data/X_2273_{voting_id}.csv'
        y_path = f'../data/y_2273_{voting_id}.csv'

        print(f"🔍 Ищу файлы:")
        print(f"   X: {X_path}")
        print(f"   y: {y_path}")

        if not os.path.exists(X_path):
            return jsonify({'success': False, 'error': f'Файл признаков не найден: {X_path}'}), 404

        if not os.path.exists(y_path):
            return jsonify({'success': False, 'error': f'Файл голосов не найден: {y_path}'}), 404

        X_df = pd.read_csv(X_path)
        y_df = pd.read_csv(y_path)

        fio_list = X_df['fio'].tolist()
        faction_list = X_df['fr_8'].tolist()

        X_features = X_df.drop(columns=['fio', 'fr_8']).fillna(0)

        predictions = model.predict(X_features.values)
        probabilities = model.predict_proba(X_features.values)

        vote_dict = {0: 'Воздержался', 1: 'За', 2: 'Не голосовал', 3: 'Отсутствовал', 4: 'Против'}

        if 'vote' in y_df.columns:
            real_votes_codes = y_df['vote'].astype(int).tolist()
        else:
            real_votes_codes = y_df.iloc[:, -1].astype(int).tolist()

        real_votes_text = [vote_dict.get(code, 'Неизвестно') for code in real_votes_codes]

        results = []
        real_counts = {v: 0 for v in vote_dict.values()}
        pred_counts = {v: 0 for v in vote_dict.values()}
        correct_count = 0

        predictions_flat = predictions.flatten() if hasattr(predictions, 'flatten') else predictions

        for i in range(len(fio_list)):
            predicted_code = int(predictions_flat[i])
            predicted_vote = vote_dict[predicted_code]
            real_vote = real_votes_text[i]

            if real_vote in real_counts:
                real_counts[real_vote] += 1
            else:
                if 'Неизвестно' not in real_counts:
                    real_counts['Неизвестно'] = 0
                    pred_counts['Неизвестно'] = 0
                real_counts['Неизвестно'] += 1
                real_vote = 'Неизвестно'

            pred_counts[predicted_vote] += 1

            confidence = float(probabilities[i, predicted_code]) * 100
            is_correct = (predicted_vote == real_vote)

            if is_correct:
                correct_count += 1

            results.append({
                'fio': fio_list[i],
                'faction': faction_list[i],
                'real_vote': real_vote,
                'predicted_vote': predicted_vote,
                'confidence': round(confidence, 1),
                'is_correct': is_correct
            })

        total = len(results)
        accuracy = (correct_count / total * 100) if total > 0 else 0

        real_passed = real_counts.get('За', 0) >= 226
        pred_passed = pred_counts.get('За', 0) >= 226

        print(f"✅ Обработано {total} депутатов, точность: {accuracy:.2f}%")

        metrics = {}
        if SKLEARN_LOADED:
            try:
                precision, recall, f1, support = precision_recall_fscore_support(
                    real_votes_codes, predictions_flat, labels=list(vote_dict.keys()), zero_division=0
                )

                for i, (code, name) in enumerate(vote_dict.items()):
                    metrics[name] = {
                        'precision': round(float(precision[i]), 3),
                        'recall': round(float(recall[i]), 3),
                        'f1': round(float(f1[i]), 3),
                        'support': int(support[i])
                    }
            except Exception as e:
                print(f"⚠️ Ошибка метрик: {e}")

        return jsonify({
            'success': True,
            'voting_id': voting_id,
            'deputies': results,
            'statistics': {
                'total': total,
                'correct': correct_count,
                'accuracy': round(accuracy, 2),
                'real_counts': real_counts,
                'pred_counts': pred_counts,
                'real_passed': real_passed,
                'pred_passed': pred_passed
            },
            'metrics': metrics
        })

    except Exception as e:
        print(f"❌ Ошибка predict_voting: {e}")
        import traceback
        traceback.print_exc()
        return jsonify({'success': False, 'error': str(e)}), 500


# ============================================
# ENDPOINTS ДЛЯ КЕЙСА 2: СЕТЕВОЙ ГРАФ
# ============================================

# Маппинг КВЭД в крупные категории
ACTIVITY_MAPPING = {
    'Інформація та телекомунікації': 'Информационные технологии и телекоммуникация',
    'Професійна, наукова та технічна діяльність': 'Научно-техническая и конструкторская деятельность',
    'Фінансова та страхова діяльність': 'Финансовая и страховая деятельность',
    'Операції з нерухомим майном': 'Операции с недвижимостью',
    'Переробна промисловість': 'Перерабатывающая промышленность',
    'Сільське господарство, лісове господарство та рибне господарство': 'Сельское хозяйство',
    'Транспорт, складське господарство, поштова та кур\'єрська діяльність': 'Транспорт и логистика',
    'Будівництво': 'Строительство',
    'Оптова та роздрібна торгівля; ремонт автотранспортних засобів і мотоциклів': 'Торговля',
    'Надання інших видів послуг': 'Прочие услуги',
    'Діяльність у сфері адміністративного та допоміжного обслуговування': 'Административные услуги',
}

SPECIALIZATION_KEYWORDS = {
    'Інформаційні технології': 'Информационные технологии и телекоммуникация',
    'ТЕК': 'ТЭК',
    'енергетик': 'ТЭК',
    'газ': 'ТЭК',
    'нафт': 'ТЭК',
    'паливо': 'ТЭК',
    'Финанс': 'Финансовая и страховая деятельность',
    'страхов': 'Финансовая и страховая деятельность',
    'Сільське': 'Сельское хозяйство',
    'зернов': 'Сельское хозяйство',
    'Транспорт': 'Транспорт и логистика',
    'Госуправ': 'Госуправление',
}


def map_activity(activity):
    if not PANDAS_LOADED or pd.isna(activity) or activity == '':
        return 'Не указана'

    if activity in ACTIVITY_MAPPING:
        return ACTIVITY_MAPPING[activity]

    for keyword, category in SPECIALIZATION_KEYWORDS.items():
        if keyword.lower() in str(activity).lower():
            return category

    return activity[:40] if len(str(activity)) > 40 else str(activity)


def calculate_graph_stats(nodes, edges):
    nodes_count = len(nodes)
    edges_count = len(edges)

    if nodes_count > 0:
        avg_degree = round(sum(n['degree'] for n in nodes) / nodes_count, 2)
    else:
        avg_degree = 0

    max_edges = nodes_count * (nodes_count - 1) / 2
    density = round(edges_count / max_edges, 3) if max_edges > 0 else 0

    return {
        'nodes_count': nodes_count,
        'edges_count': edges_count,
        'avg_degree': avg_degree,
        'density': density
    }


def build_graph_from_dataframe(df):
    nodes = []
    edges = []

    deputy_region_count = defaultdict(lambda: defaultdict(int))
    deputy_activity_count = defaultdict(lambda: defaultdict(int))
    region_activity_count = defaultdict(lambda: defaultdict(int))

    for idx, row in df.iterrows():
        deputy = row['full_name']
        region = row['obl']
        activity = row['activity']

        if pd.isna(deputy) or pd.isna(region) or pd.isna(activity):
            continue

        activity_mapped = map_activity(activity)

        deputy_region_count[deputy][region] += 1
        deputy_activity_count[deputy][activity_mapped] += 1
        region_activity_count[region][activity_mapped] += 1

    deputy_ids = {}
    for deputy in deputy_region_count.keys():
        deputy_id = f"dep_{len(deputy_ids)}"
        deputy_ids[deputy] = deputy_id

        total_companies = sum(deputy_region_count[deputy].values())

        nodes.append({
            'id': deputy_id,
            'label': deputy,
            'type': 'deputy',
            'degree': 0,
            'data': {'companies_count': total_companies}
        })

    region_ids = {}
    for deputy in deputy_region_count:
        for region in deputy_region_count[deputy]:
            if region not in region_ids:
                region_id = f"reg_{len(region_ids)}"
                region_ids[region] = region_id

                nodes.append({
                    'id': region_id,
                    'label': region,
                    'type': 'region',
                    'degree': 0,
                    'data': {}
                })

    activity_ids = {}
    all_activities = set()
    for activities in deputy_activity_count.values():
        all_activities.update(activities.keys())
    for activities in region_activity_count.values():
        all_activities.update(activities.keys())

    for activity in all_activities:
        if activity and activity != 'nan' and activity != 'Не указана':
            activity_id = f"act_{len(activity_ids)}"
            activity_ids[activity] = activity_id

            nodes.append({
                'id': activity_id,
                'label': activity,
                'type': 'activity',
                'degree': 0,
                'data': {}
            })

    edge_id = 0

    for deputy, regions in deputy_region_count.items():
        for region, count in regions.items():
            if count > 0:
                edges.append({
                    'id': f'e{edge_id}',
                    'source': deputy_ids[deputy],
                    'target': region_ids[region],
                    'weight': count,
                    'label': f'{count}'
                })
                edge_id += 1

    for region, activities in region_activity_count.items():
        for activity, count in activities.items():
            if count > 0 and activity in activity_ids:
                edges.append({
                    'id': f'e{edge_id}',
                    'source': region_ids[region],
                    'target': activity_ids[activity],
                    'weight': count,
                    'label': f'{count}'
                })
                edge_id += 1

    for deputy, activities in deputy_activity_count.items():
        for activity, count in activities.items():
            if count > 0 and activity in activity_ids:
                edges.append({
                    'id': f'e{edge_id}',
                    'source': deputy_ids[deputy],
                    'target': activity_ids[activity],
                    'weight': count,
                    'label': f'{count}'
                })
                edge_id += 1

    degree_count = defaultdict(int)
    for edge in edges:
        degree_count[edge['source']] += 1
        degree_count[edge['target']] += 1

    for node in nodes:
        node['degree'] = degree_count[node['id']]

    return nodes, edges


@app.route('/api/deputies/list', methods=['GET'])
def get_deputies_list():
    if not PANDAS_LOADED:
        return jsonify({'success': False, 'error': 'Pandas не установлен'}), 500

    try:
        current_dir = os.path.dirname(os.path.abspath(__file__))

        possible_paths = [
            os.path.join(current_dir, 'data', 'example_Skr_Khom__3_.csv'),
            os.path.join(current_dir, '..', 'data', 'example_Skr_Khom__3_.csv'),
            'data/example_Skr_Khom__3_.csv',
            '../data/example_Skr_Khom__3_.csv',
            'example_Skr_Khom__3_.csv'
        ]

        csv_path = None
        for path in possible_paths:
            full_path = os.path.abspath(path)
            print(f"🔍 Проверяю путь: {full_path}")
            if os.path.exists(full_path):
                csv_path = full_path
                print(f"✅ Файл найден: {csv_path}")
                break

        if not csv_path:
            searched_paths = '\n'.join([os.path.abspath(p) for p in possible_paths])
            return jsonify({
                'success': False,
                'error': f'CSV файл не найден. Искал в:\n{searched_paths}\n\nТекущая директория: {os.getcwd()}'
            }), 404

        df = pd.read_csv(csv_path)

        if 'full_name' not in df.columns:
            return jsonify({
                'success': False,
                'error': f'В CSV файле нет колонки "full_name". Доступные колонки: {list(df.columns)}'
            }), 400

        deputies = df['full_name'].dropna().unique().tolist()

        print(f"✅ Найдено {len(deputies)} депутатов")

        return jsonify({
            'success': True,
            'deputies': deputies
        })

    except Exception as e:
        print(f"❌ Ошибка get_deputies_list: {e}")
        import traceback
        traceback.print_exc()
        return jsonify({'success': False, 'error': str(e)}), 500


@app.route('/api/graph/real/<deputy_name>', methods=['GET'])
def get_real_graph(deputy_name):
    if not PANDAS_LOADED:
        return jsonify({'success': False, 'error': 'Pandas не установлен'}), 500

    try:
        current_dir = os.path.dirname(os.path.abspath(__file__))

        possible_paths = [
            os.path.join(current_dir, 'data', 'example_Skr_Khom__3_.csv'),
            os.path.join(current_dir, '..', 'data', 'example_Skr_Khom__3_.csv'),
            'data/example_Skr_Khom__3_.csv',
            '../data/example_Skr_Khom__3_.csv',
            'example_Skr_Khom__3_.csv'
        ]

        csv_path = None
        for path in possible_paths:
            full_path = os.path.abspath(path)
            if os.path.exists(full_path):
                csv_path = full_path
                break

        if not csv_path:
            return jsonify({'success': False, 'error': 'CSV файл не найден'}), 404

        df = pd.read_csv(csv_path)

        if deputy_name == 'all':
            deputy_df = df
        else:
            deputy_df = df[df['full_name'].str.contains(deputy_name, na=False, case=False)]

        if deputy_df.empty:
            return jsonify({'success': False, 'error': f'Депутат {deputy_name} не найден'}), 404

        print(f"✅ Найдено {len(deputy_df)} записей для депутата {deputy_name}")

        nodes, edges = build_graph_from_dataframe(deputy_df)
        stats = calculate_graph_stats(nodes, edges)

        return jsonify({
            'success': True,
            'nodes': nodes,
            'edges': edges,
            'stats': stats
        })

    except Exception as e:
        print(f"❌ Ошибка get_real_graph: {e}")
        import traceback
        traceback.print_exc()
        return jsonify({'success': False, 'error': str(e)}), 500


@app.route('/api/graph/coauthorship', methods=['GET'])
def get_coauthorship_graph():
    if not PANDAS_LOADED:
        return jsonify({'success': False, 'error': 'Pandas не установлен'}), 500

    try:
        current_dir = os.path.dirname(os.path.abspath(__file__))

        possible_paths = [
            os.path.join(current_dir, 'data', 'example_Skr_Khom__3_.csv'),
            os.path.join(current_dir, '..', 'data', 'example_Skr_Khom__3_.csv'),
            'data/example_Skr_Khom__3_.csv',
            '../data/example_Skr_Khom__3_.csv',
            'example_Skr_Khom__3_.csv'
        ]

        csv_path = None
        for path in possible_paths:
            full_path = os.path.abspath(path)
            if os.path.exists(full_path):
                csv_path = full_path
                break

        if not csv_path:
            return jsonify({'success': False, 'error': 'CSV файл не найден'}), 404

        df = pd.read_csv(csv_path)

        deputy_activities = defaultdict(set)

        for idx, row in df.iterrows():
            deputy = row['full_name']
            activity = map_activity(row['activity'])

            if pd.notna(deputy) and activity != 'Не указана':
                deputy_activities[deputy].add(activity)

        nodes = []
        deputy_ids = {}

        for deputy, activities in deputy_activities.items():
            deputy_id = f"dep_{len(deputy_ids)}"
            deputy_ids[deputy] = deputy_id

            nodes.append({
                'id': deputy_id,
                'label': deputy,
                'type': 'deputy',
                'degree': 0,
                'data': {'activities_count': len(activities)}
            })

        edges = []
        edge_id = 0
        deputies_list = list(deputy_activities.keys())

        for i in range(len(deputies_list)):
            for j in range(i + 1, len(deputies_list)):
                dep1 = deputies_list[i]
                dep2 = deputies_list[j]

                common_activities = deputy_activities[dep1] & deputy_activities[dep2]

                if len(common_activities) > 0:
                    edges.append({
                        'id': f'e{edge_id}',
                        'source': deputy_ids[dep1],
                        'target': deputy_ids[dep2],
                        'weight': len(common_activities),
                        'label': f'{len(common_activities)} общих'
                    })
                    edge_id += 1

        degree_count = defaultdict(int)
        for edge in edges:
            degree_count[edge['source']] += 1
            degree_count[edge['target']] += 1

        for node in nodes:
            node['degree'] = degree_count[node['id']]

        stats = calculate_graph_stats(nodes, edges)

        print(f"✅ Создан граф соавторства: {len(nodes)} узлов, {len(edges)} рёбер")

        return jsonify({
            'success': True,
            'nodes': nodes,
            'edges': edges,
            'stats': stats
        })

    except Exception as e:
        print(f"❌ Ошибка get_coauthorship_graph: {e}")
        import traceback
        traceback.print_exc()
        return jsonify({'success': False, 'error': str(e)}), 500


# ============================================
# MAIN
# ============================================

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5001))
    app.run(host='0.0.0.0', port=port, debug=False)