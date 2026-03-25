import React, { useState, useEffect, useRef, createContext, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HashRouter as Router, Routes, Route, Link, useNavigate, useLocation, useParams } from 'react-router-dom';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import { 
  Heart, Home as HomeIcon, TrendingUp, Coins, Globe, Download, 
  MapPin, Phone, Mail, MessageCircle, ChevronDown, 
  ShieldCheck, Search, FileCheck, Key, ArrowRight, Quote, Star, 
  Calendar, Clock, ArrowLeft, Menu, X, ArrowUp, Award, Trophy, Crown
} from 'lucide-react';

// --- СТИЛИ ---
const styles = `
    @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600;700&family=Montserrat:wght@300;400;500;600;700&family=Raleway:wght@300;400;500;600&display=swap');

    :root {
        --color-gold: #C5A059;
        --color-gold-dark: #A67C37;
        --color-dark: #121212;
    }

    /* ПРИНУДИТЕЛЬНО РОВНЫЕ ЦИФРЫ ДЛЯ ВСЕГО САЙТА */
    *, *::before, *::after {
        font-variant-numeric: lining-nums tabular-nums;
        font-feature-settings: "lnum" 1, "tnum" 1;
    }

    body {
        font-family: 'Raleway', sans-serif;
        background-color: #ffffff;
        color: var(--color-dark);
        overflow-x: hidden;
        font-variant-numeric: lining-nums;
        font-feature-settings: "lnum" 1;
    }

    .font-cormorant { font-family: 'Cormorant Garamond', serif; }
    .font-montserrat { font-family: 'Montserrat', sans-serif; }
    
    .gold-text { color: var(--color-gold) !important; }
    .gold-bg { background-color: var(--color-gold) !important; }
    .lining-nums { font-variant-numeric: lining-nums tabular-nums; font-feature-settings: "lnum" 1, "tnum" 1; }

    .hero-mask { clip-path: polygon(10% 0, 100% 0, 100% 90%, 90% 100%, 0 100%, 0 10%); }
    .premium-underline {
        position: absolute;
        bottom: 8px;
        left: 0;
        right: 0;
        height: 3px;
        background-color: rgba(197, 160, 89, 0.6);
        transform-origin: left;
    }

    .strategy-card { transition: all 0.6s cubic-bezier(0.22, 1, 0.36, 1); }
    .strategy-card:hover { transform: translateY(-10px); box-shadow: 0 30px 60px -12px rgba(197, 160, 89, 0.25); }
    
    .control-card { transition: all 0.6s cubic-bezier(0.22, 1, 0.36, 1); }
    .control-card:hover { background-color: rgba(255, 255, 255, 0.1); transform: translateY(-8px); border-color: var(--color-gold); box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4); }

    .btn-premium { 
        position: relative; 
        overflow: hidden; 
        transition: all 0.5s cubic-bezier(0.22, 1, 0.36, 1); 
        display: inline-block; 
        text-align: center; 
    }
    .btn-premium::after { 
        content: ''; 
        position: absolute; 
        top: 0; 
        left: -100%; 
        width: 100%; 
        height: 100%; 
        background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent); 
        transition: 0.6s; 
    }
    .btn-premium:hover::after { left: 100%; }
    .btn-premium:hover { transform: translateY(-3px); box-shadow: 0 15px 30px rgba(197, 160, 89, 0.3); }

    .nav-item { position: relative; padding: 20px 0; }
    .nav-dropdown {
        position: absolute;
        top: 100%;
        left: 50%;
        transform: translateX(-50%) translateY(15px);
        background: rgba(255, 255, 255, 0.98);
        backdrop-filter: blur(20px);
        border: 1px solid rgba(197, 160, 89, 0.2);
        min-width: 260px;
        opacity: 0;
        visibility: hidden;
        transition: all 0.4s cubic-bezier(0.22, 1, 0.36, 1);
        box-shadow: 0 20px 40px rgba(0,0,0,0.1);
        padding: 15px 0;
        z-index: 500;
    }
    .nav-item:hover .nav-dropdown { opacity: 1; visibility: visible; transform: translateX(-50%) translateY(0); }
    .dropdown-link { display: block; padding: 10px 25px; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; color: #4b5563; transition: all 0.3s ease; cursor: pointer; text-align: left; }
    .dropdown-link:hover { color: var(--color-gold); background: rgba(197, 160, 89, 0.05); padding-left: 30px; }
    .dropdown-special-btn { background: var(--color-gold); color: white !important; margin: 10px 20px 0; text-align: center; font-size: 9px; padding: 12px; border-radius: 2px; }
    .dropdown-special-btn:hover { background: var(--color-gold-dark); transform: translateY(-2px); }

    input[type="range"] { -webkit-appearance: none; width: 100%; height: 6px; background: #f1f1f1; border-radius: 5px; outline: none; }
    input[type="range"]::-webkit-slider-thumb { -webkit-appearance: none; width: 24px; height: 24px; background: linear-gradient(135deg, var(--color-gold), var(--color-gold-dark)); cursor: pointer; border-radius: 50%; border: 2px solid #ffffff; box-shadow: 0 4px 12px rgba(0,0,0,0.2); margin-top: -9px; transition: transform 0.2s; }
    input[type="range"]:active::-webkit-slider-thumb { transform: scale(1.15); }
    ::-webkit-scrollbar { width: 8px; }
    ::-webkit-scrollbar-track { background: #f1f1f1; }
    ::-webkit-scrollbar-thumb { background: var(--color-gold); border-radius: 10px; }

    /* Поля для SEO-статей */
    .seo-article h3 { font-family: 'Cormorant Garamond', serif; font-size: 1.5rem; font-weight: 700; color: #121212; margin-top: 2rem; margin-bottom: 1rem; line-height: 1.3; }
    @media (min-width: 768px) {
        .seo-article h3 { font-size: 1.75rem; margin-top: 2.5rem; margin-bottom: 1.25rem; }
    }
    .seo-article p { margin-bottom: 1.5rem; line-height: 1.8; color: #4b5563; font-size: 1rem; }
    @media (min-width: 768px) { .seo-article p { font-size: 1.05rem; } }
    .seo-article ul { list-style-type: disc; padding-left: 1.5rem; margin-bottom: 2rem; color: #4b5563; font-size: 1rem; }
    @media (min-width: 768px) { .seo-article ul { font-size: 1.05rem; } }
    .seo-article li { margin-bottom: 0.75rem; }
    .seo-article strong { color: #121212; font-weight: 700; }
`;

// --- ЛОКАЛИЗАЦИЯ (СЛОВАРИ) ---
const translations = {
    RU: {
        nav: { buy: 'Купить', rent: 'Аренда', about: 'О нас', contact: 'Связаться с нами', offplan: 'Новостройки', secondary: 'Вторичное жилье', villas: 'Виллы и Таунхаусы', invest: 'Инвестиции', comm: 'Коммерция', plots: 'Участки', distress: 'Дистресс (Срочно)', apart: 'Апартаменты', val: 'Оценка недвижимости', blog: 'Аналитика рынка', company: 'Компания', btn: 'Оставить заявку' },
        hero: { boutique: 'Бутиковое Агентство', title1: 'Ваш путь к', title2: 'Недвижимости', title3: 'в Дубае', catBtn: 'Каталог объектов', anBtn: 'Аналитика 2026' },
        about: { top: 'Кто мы такие?', title: 'ALPHASTAR PROPERTIES', quote: '«Мы превращаем недвижимость в инструмент сохранения и приумножения капитала в самом стремительно растущем рынке мира.»', desc: 'Наше адвокатское сопровождение строится по принципам частного семейного офиса: максимальная конфиденциальность, прямой доступ к закрытым лотам вне рынка и контроль каждой стадии сделки.', btn: 'Наш подход' },
        awards: { 
            top: 'Наши награды', 
            title: 'Признание на высшем уровне',
            list: [
                'Больше всего успешных сделок за 2025 год',
                'Агентство года по версии клиентов',
                'Топ‑агентская команда по эксклюзивным объектам',
                'Лучшее агентство по продаже новостроек'
            ]
        },
        strategy: { top: 'Наша стратегия', title: 'Два вектора успеха', card1Title: 'Дом для вашей семьи', card1Desc: 'Подбор районов от $300,000 с фокусом на инфраструктуру, лучшие школы и безопасность. Мы найдем место, которое вы назовете домом.', card1Btn: 'Подобрать локацию', card2Title: 'Инвестиционный капитал', card2Desc: 'Стратегии от $300,000. Формируем арендный доход и капитализацию объектов в самых ликвидных зонах Дубая.', card2Btn: 'Инвест-пакеты' },
        process: { top: 'Нас выбирают', title: 'Контроль на каждом этапе' },
        deals: { title: 'Реальные сделки', private: 'Private', conf: 'Confidential Asset', roi: 'ROI (Годовых)', entry: 'Вход (Ланч)', exit: 'Выход (Продажа)', cycle: 'Цикл завершен', reqBtn: 'Запросить детали' },
        calc: { top: 'Расчет прибыли', title: 'Рассчитайте параметры успеха', invest: 'Инвестиции ($)', roi: 'ROI (Прогноз)', profit: 'Прибыль', term: 'Срок', stOffplan: 'Новостройки', stRental: 'Аренда', stFlip: 'Перепродажа' },
        guide: { top: 'Guide 2026', title: 'Аналитический отчет 2026', desc: 'Узнайте, какие районы Дубая покажут рост в 25% за следующий год и как избежать типичных ошибок при покупке.', email: 'Ваш Email', btn: 'Получить гайд' },
        testim: { title: 'Что говорят наши клиенты', more: 'Развернуть больше' },
        faq: { top: 'FAQ', title: 'Вопросы и ответы' },
        form: { title: 'Связаться с нами', subtitle: 'Сценарий вашей прибыли: от выбора объекта до выхода из сделки', name: 'Ваше имя', email: 'Ваш Email', phone: 'Телефон / WhatsApp', goal: 'Цель запроса', selGoal: 'Выберите цель', btn: 'Отправить заявку', goals: ['Переезд / Релокация', 'Инвестиции', 'Управление недвижимостью'], consent: 'Я соглашаюсь получать информацию о предложениях, сделках и услугах с этого веб-сайта (по желанию) и принимаю Политику конфиденциальности.' },
        quiz: {
            title: 'Инвестируете в Дубай?',
            q1: 'Что ищете в Дубае?',
            a1: ['Квартиру/виллу для покупки', 'Аренду', 'Коммерческую недвижимость', 'Инвестиции'],
            q2: 'Какой у вас бюджет? Будем учитывать в долларах $',
            a2: ['от 300.000$ до 500.000$', 'от 500.000$ до 1.000.000$', 'от 1.000.000$'],
            q3: 'Какой район вы предпочитаете?',
            a3: ['Downtown / Business Bay', 'Palm Jumeirah / JBR', 'Dubai Marina', 'Подобрать район под ваши цели'],
            finalTitle: 'Оставьте контакты',
            finalSub: 'Наш эксперт перезвонит, чтобы рассказать о скрытых жемчужинах рынка.',
            back: 'Назад',
            step: 'Шаг'
        },
        mortgage: { title: 'Ипотека для нерезидентов в ОАЭ', desc: 'Официальное финансирование до 50% от стоимости объекта. Процентная ставка от 4.5% годовых. Минимальный пакет документов. Мы полностью берем на себя процесс одобрения кредита (Mortgage Approval) в ведущих банках Дубая.', btn: 'Рассчитать ипотеку', hideBtn: 'Скрыть анкету', formTitle: 'Заявка на ипотеку', formSub: 'Оставьте данные, и наш ипотечный брокер свяжется с вами для расчета платежей' },
        valPage: { top: 'Property Valuation', heading: 'Оценка вашей недвижимости', subtitle: 'Наши аналитики подготовят точный отчет о рыночной стоимости вашего актива на основе актуальных транзакций Земельного Департамента Дубая.', name: 'Ваше имя', email: 'Ваш Email', loc: 'Локация / Комплекс', area: 'Площадь (Sq.ft) / Спален', phone: 'Телефон / WhatsApp', btn: 'Запросить оценку' },
        blog: { top: 'Insights & Analytics', title: 'Блог Alpha Star', readBtn: 'Читать статью', notFound: 'Статья не найдена', back: 'Назад к статьям', ready: 'Готовы сделать шаг к успешным инвестициям?', reqBtn: 'Получить консультацию эксперта', imgText: 'Главное фото статьи' },
        footer: { quote: 'Мы защищаем ваш капитал и создаем преимущество на самом динамичном рынке мира.', nav: 'Навигация', contacts: 'Контакты', rights: '© 2026 Alpha Star Properties. Все права защищены.', privacy: 'Политика конфиденциальности', terms: 'Условия использования', about: 'О компании', cases: 'Кейсы', catalog: 'Объекты' },
        listing: { all: 'Все объекты', bed: 'Bedroom', notFound: 'По вашему запросу объектов не найдено.', missing: 'Не нашли идеальный объект?', missingSub: 'Оставьте заявку, и мы пришлем подборку эксклюзивных вариантов закрытых продаж вне рынка', btn: 'Смотреть детали' },
        legal: {
            privacy: { title: 'Политика конфиденциальности', text: '<p>Настоящая Политика конфиденциальности описывает, как Alpha Star Properties собирает, использует и защищает вашу личную информацию.</p><p><strong>1. Сбор данных</strong><br/>Мы собираем данные (имя, email, телефон), когда вы оставляете заявку на сайте.</p><p><strong>2. Использование данных</strong><br/>Ваши данные используются исключительно для предоставления консультационных услуг в сфере недвижимости и не передаются третьим лицам без вашего прямого согласия.</p><p><strong>3. Защита информации</strong><br/>Мы применяем современные технологии шифрования для защиты ваших данных от несанкционированного доступа.</p>' },
            terms: { title: 'Условия использования', text: '<p>Добро пожаловать на сайт Alpha Star Properties. Используя данный веб-сайт, вы соглашаетесь с нижеперечисленными условиями.</p><p><strong>1. Информация на сайте</strong><br/>Вся информация, представленная на сайте (включая цены, ROI, спецификации объектов), носит ознакомительный характер и не является публичной офертой.</p><p><strong>2. Интеллектуальная собственность</strong><br/>Весь контент (тексты, графика, логотипы) защищен авторским правом и принадлежит Alpha Star Properties. Копирование без разрешения запрещено.</p>' }
        }
    },
    EN: {
        nav: { buy: 'Buy', rent: 'Rent', about: 'About', contact: 'Contact Us', offplan: 'Off-plan', secondary: 'Secondary Market', villas: 'Villas & Townhouses', invest: 'Investments', comm: 'Commercial', plots: 'Plots', distress: 'Distress Deals', apart: 'Apartments', val: 'Property Valuation', blog: 'Market Analytics', company: 'Company', btn: 'Leave a Request' },
        hero: { boutique: 'Boutique Agency', title1: 'Your Path to', title2: 'Real Estate', title3: 'in Dubai', catBtn: 'Property Catalog', anBtn: '2026 Analytics' },
        about: { top: 'Who We Are?', title: 'ALPHASTAR PROPERTIES', quote: '«We turn real estate into a tool for preserving and multiplying capital in the world\'s fastest-growing market.»', desc: 'Our legal support is built on the principles of a private family office: maximum confidentiality, direct access to off-market assets, and strict control over every stage of the transaction.', btn: 'Our Approach' },
        awards: { 
            top: 'Our Awards', 
            title: 'Top-tier Recognition',
            list: [
                'Most Successful Deals in 2025',
                'Agency of the Year by Clients',
                'Top Agency Team for Exclusive Properties',
                'Best Agency for Off-Plan Sales'
            ]
        },
        strategy: { top: 'Our Strategy', title: 'Two Vectors of Success', card1Title: 'A Home for Your Family', card1Desc: 'Selection of areas from $300,000 focusing on infrastructure, top schools, and safety. We will find a place you can call home.', card1Btn: 'Find a Location', card2Title: 'Investment Capital', card2Desc: 'Strategies from $300,000. We generate rental income and capital appreciation in Dubai\'s most liquid zones.', card2Btn: 'Investment Packages' },
        process: { top: 'Why Choose Us', title: 'Control at Every Stage' },
        deals: { title: 'Real Deals', private: 'Private', conf: 'Confidential Asset', roi: 'Annual ROI', entry: 'Entry (Launch)', exit: 'Exit (Sale)', cycle: 'Deal Completed', reqBtn: 'Request Details' },
        calc: { top: 'Profit Calculation', title: 'Calculate Your Success', invest: 'Investment ($)', roi: 'ROI (Forecast)', profit: 'Profit', term: 'Term', stOffplan: 'Off-plan', stRental: 'Rental', stFlip: 'Flipping' },
        guide: { top: 'Guide 2026', title: '2026 Analytical Report', desc: 'Find out which Dubai areas will show a 25% growth next year and how to avoid typical buying mistakes.', email: 'Your Email', btn: 'Get the Guide' },
        testim: { title: 'What Our Clients Say', more: 'Show More' },
        faq: { top: 'FAQ', title: 'Questions & Answers' },
        form: { title: 'Contact Us', subtitle: 'Your profit scenario: from selecting an object to exiting the deal', name: 'Your Name', email: 'Your Email', phone: 'Phone / WhatsApp', goal: 'Inquiry Purpose', selGoal: 'Select Purpose', btn: 'Submit Request', goals: ['Relocation', 'Investments', 'Property Management'], consent: 'I agree to receive information about offers, deals, and services from this website (optional) and accept the Privacy Policy.' },
        quiz: {
            title: 'Investing in Dubai?',
            q1: 'What are you looking for in Dubai?',
            a1: ['Buy an Apartment/Villa', 'Rent', 'Commercial Property', 'Investments'],
            q2: 'What is your budget? (In USD $)',
            a2: ['$300k - $500k', '$500k - $1M', 'Over $1M'],
            q3: 'Which area do you prefer?',
            a3: ['Downtown / Business Bay', 'Palm Jumeirah / JBR', 'Dubai Marina', 'Help me choose'],
            finalTitle: 'Leave your contacts',
            finalSub: 'Our expert will call you back to share hidden market gems.',
            back: 'Back',
            step: 'Step'
        },
        mortgage: { title: 'Mortgage for Non-Residents in the UAE', desc: 'Official financing up to 50% of the property value. Interest rate from 4.5% per annum. Minimum document package. We fully handle the Mortgage Approval process in leading Dubai banks.', btn: 'Calculate Mortgage', hideBtn: 'Hide Form', formTitle: 'Mortgage Application', formSub: 'Leave your details, and our mortgage broker will contact you to calculate payments' },
        valPage: { top: 'Property Valuation', heading: 'Evaluate Your Property', subtitle: 'Our analysts will prepare an accurate report on the market value of your asset based on current Dubai Land Department transactions.', name: 'Your Name', email: 'Your Email', loc: 'Location / Complex', area: 'Area (Sq.ft) / Bedrooms', phone: 'Phone / WhatsApp', btn: 'Request Valuation' },
        blog: { top: 'Insights & Analytics', title: 'Alpha Star Blog', readBtn: 'Read Article', notFound: 'Article not found', back: 'Back to Articles', ready: 'Ready to step into successful investments?', reqBtn: 'Get Expert Consultation', imgText: 'Article Main Photo' },
        footer: { quote: 'We protect your capital and create an advantage in the world\'s most dynamic market.', nav: 'Navigation', contacts: 'Contacts', rights: '© 2026 Alpha Star Properties. All rights reserved.', privacy: 'Privacy Policy', terms: 'Terms of Use', about: 'About Us', cases: 'Case Studies', catalog: 'Properties' },
        listing: { all: 'All Properties', bed: 'Bedroom', notFound: 'No properties found for your request.', missing: 'Didn\'t find the perfect property?', missingSub: 'Leave a request, and we will send you a selection of exclusive off-market options', btn: 'View Details' },
        legal: {
            privacy: { title: 'Privacy Policy', text: '<p>This Privacy Policy describes how Alpha Star Properties collects, uses, and protects your personal information.</p><p><strong>1. Data Collection</strong><br/>We collect data (name, email, phone) when you submit a request on the website.</p><p><strong>2. Data Usage</strong><br/>Your data is used solely to provide real estate consulting services and is not shared with third parties without your explicit consent.</p><p><strong>3. Information Security</strong><br/>We apply modern encryption technologies to protect your data from unauthorized access.</p>' },
            terms: { title: 'Terms of Use', text: '<p>Welcome to the Alpha Star Properties website. By using this website, you agree to the following terms.</p><p><strong>1. Information on the Site</strong><br/>All information presented on the site (including prices, ROI, property specifications) is for informational purposes and does not constitute a public offer.</p><p><strong>2. Intellectual Property</strong><br/>All content (texts, graphics, logos) is protected by copyright and belongs to Alpha Star Properties. Copying without permission is prohibited.</p>' }
        }
    }
};

// --- SEO КОНТЕНТ ---
const seoData = {
    home: { title: "Элитная недвижимость в Дубае | Купить квартиру и виллу | Alpha Star", description: "Инвестиции в недвижимость Дубая. Элитные квартиры, виллы и таунхаусы. Сопровождение сделок Private Office, доступ к off-market лотам и высокая доходность (ROI)." },
    novostroyki: { title: "Новостройки Дубая от застройщика | Купить недвижимость Off-plan", heading: "Новостройки", subtitle: "Эксклюзивные предложения от топовых застройщиков ОАЭ.", seoText: "Покупка недвижимости на стадии строительства (Off-plan) — это один из самых надежных инструментов для получения максимальной доходности в Дубае. Прирост стоимости актива к моменту сдачи объекта может составлять от 20% до 50%." },
    secondary: { title: "Вторичное жилье в Дубае | Купить готовую квартиру", heading: "Вторичное жилье", subtitle: "Готовые объекты с полной юридической проверкой для заселения.", seoText: "Вторичный рынок недвижимости Дубая идеально подходит для инвесторов, желающих получать пассивный доход сразу после покупки, а также для тех, кто планирует быстрый переезд по программе резидентской визы (Golden Visa)." },
    villas: { title: "Купить элитную виллу в Дубае | Таунхаусы премиум-класса", heading: "Виллы и Таунхаусы", subtitle: "Премиальные резиденции для вашей семьи.", seoText: "Рынок роскошных вилл и таунхаусов в Дубае переживает беспрецедентный бум. Элитные комьюнити, такие как Palm Jumeirah, Dubai Hills Estate и Emirates Hills, предлагают непревзойденный уровень приватности." },
    commercial: { title: "Коммерческая недвижимость в Дубае | Купить офис", heading: "Коммерческая недвижимость", subtitle: "Офисы, ритейл и склады в лучших деловых районах Дубая.", seoText: "Коммерческая недвижимость в деловых центрах Дубая демонстрирует стабильно высокую доходность от аренды (до 8-12% годовых). Мы предлагаем премиальные офисные пространства." },
    invest: { title: "Инвестиции в недвижимость Дубая | Высокий ROI", heading: "Инвестиционные пакеты", subtitle: "Высокодоходные активы с гарантированным ROI.", seoText: "Грамотно сформированный портфель недвижимости в Дубае позволяет не только сохранить капитал, но и диверсифицировать доходы за счет привязки к стабильной валюте." },
    plots: { title: "Участки под застройку в Дубае | Купить землю", heading: "Участки под застройку", subtitle: "Земля в престижных локациях для девелоперских проектов.", seoText: "Приобретение земельного участка в Дубае — это редкая возможность создать премиальный проект по индивидуальному дизайну или реализовать прибыльный девелоперский проект." },
    apartments_rent: { title: "Аренда элитных апартаментов в Дубае", heading: "Аренда апартаментов", subtitle: "Долгосрочная аренда в премиальных локациях.", seoText: "Мы предоставляем полный спектр услуг по подбору элитной недвижимости для долгосрочной аренды. Наши брокеры организуют просмотры и помогут согласовать условия." },
    valuation: { title: "Оценка стоимости недвижимости в Дубае", heading: "Оценка вашей недвижимости", subtitle: "Наши аналитики подготовят точный отчет о рыночной стоимости вашего актива на основе актуальных транзакций Земельного Департамента Дубая." },
    blog: { title: "Блог о недвижимости Дубая | Аналитика рынка ОАЭ 2026", description: "Свежие новости рынка недвижимости ОАЭ, аналитика цен, прогнозы на 2026 год." }
};

const getSeoData = (lang) => seoData;

const getSteps = (lang) => [
    { icon: Search, title: lang==='RU'?"Глубокий анализ":"Deep Analysis", desc: lang==='RU'?"Анализируем лоты по 54 параметрам ликвидности до их выхода в паблик.":"We analyze lots by 54 liquidity parameters before public release." },
    { icon: ShieldCheck, title: lang==='RU'?"Юридический аудит":"Legal Audit", desc: lang==='RU'?"Проверяем застройщика, эскроу-счета и чистоту титула собственности.":"We verify the developer, escrow accounts, and title deed clearance." },
    { icon: FileCheck, title: lang==='RU'?"Сопровождение":"Full Support", desc: lang==='RU'?"Личное присутствие на сделке, регистрация в DLD и управление активами.":"Personal presence at the deal, DLD registration, and asset management." },
    { icon: Key, title: lang==='RU'?"Выход из сделки":"Exit Strategy", desc: lang==='RU'?"Стратегия перепродажи или сдачи в аренду с гарантированной доходностью.":"Resale or rental strategy with guaranteed profitability." }
];

const getCaseStudies = (lang) => [
    { img: "./images/case1.png", roi: '25%', location: 'Bluewaters Island', title: 'BLUEWATERS RESIDENCES', project: lang==='RU'?'1 BEDROOM (РАЙОН)':'1 BEDROOM (AREA)', launchTitle: lang==='RU'?'Вход (Ланч 2018)':'Entry (Launch 2018)', launch: '1.9М — 2.2М AED', nowTitle: lang==='RU'?'Выход (Продажа 2025)':'Exit (Sale 2025)', now: '4.7М — 6.8М AED' },
    { img: "./images/case2.png", roi: '21%', location: 'Dubai Hills Estate', title: 'ELLINGTON HOUSE', project: lang==='RU'?'3 BEDROOM (ПРОЕКТ)':'3 BEDROOM (PROJECT)', launchTitle: lang==='RU'?'Вход (Ланч 2022)':'Entry (Launch 2022)', launch: '3.3М — 4.0М AED', nowTitle: lang==='RU'?'Выход (Продажа 2025)':'Exit (Sale 2025)', now: '5.5М — 6.5М AED' },
    { img: "./images/case3.png", roi: '22%', location: 'Emaar Beachfront', title: 'BEACH ISLE', project: lang==='RU'?'3 BEDROOM (ПРОЕКТ)':'3 BEDROOM (PROJECT)', launchTitle: lang==='RU'?'Вход (Ланч 2020)':'Entry (Launch 2020)', launch: '4.5М AED', nowTitle: lang==='RU'?'Выход (Продажа 2025)':'Exit (Sale 2025)', now: '8.5М — 10.3М AED' },
    { img: "./images/case4.png", roi: '20%', location: 'JVC', title: 'BINGHATTI CORNER', project: lang==='RU'?'1 BEDROOM (ПРОЕКТ)':'1 BEDROOM (PROJECT)', launchTitle: lang==='RU'?'Вход (Ланч 2022)':'Entry (Launch 2022)', launch: '600,000 AED', nowTitle: lang==='RU'?'Выход (Продажа 2025)':'Exit (Sale 2025)', now: '1М AED' },
    { img: "./images/case5.png", roi: '18%', location: 'Dubai Creek Harbour', title: 'DUBAI CREEK HARBOUR', project: lang==='RU'?'2 BEDROOM (РАЙОН)':'2 BEDROOM (AREA)', launchTitle: lang==='RU'?'Вход (Ланч 2019)':'Entry (Launch 2019)', launch: '1.3M — 1.7M AED', nowTitle: lang==='RU'?'Выход (Продажа 2025)':'Exit (Sale 2025)', now: '2.5М — 3.3M AED' }
];

const getTestimonials = (lang) => [
    { name: lang==='RU'?"Александр В.":"Alexander V.", role: lang==='RU'?"Инвестор":"Investor", initial: "А", text: lang==='RU'?"Сотрудничество с Alpha Star превзошло все ожидания. Мы зашли в проект на стадии ланча, и уже через год капитализация составила 45%. Отдельное спасибо за безупречное юридическое сопровождение.":"Cooperation with Alpha Star exceeded all expectations. We entered the project at launch, and within a year capitalization reached 45%. Special thanks for flawless legal support." },
    { name: lang==='RU'?"Елена С.":"Elena S.", role: lang==='RU'?"Предприниматель":"Entrepreneur", initial: "Е", text: lang==='RU'?"Для меня была критична полная конфиденциальность. Команда работает по высшим стандартам Private Banking. Подобрали виллу вне рынка, закрыли сделку за 3 дня без лишней бюрократии.":"Full confidentiality was critical for me. The team works according to the highest Private Banking standards. Picked up an off-market villa, closed the deal in 3 days without bureaucracy." },
    { name: lang==='RU'?"Михаил Д.":"Mikhail D.", role: lang==='RU'?"Бизнесмен":"Businessman", initial: "М", text: lang==='RU'?"Лучшая экспертиза на рынке Дубая. Показали реальные цифры, отговорили от покупки переоцененного объекта и предложили альтернативу, которая уже приносит стабильные 12% годовых.":"The best expertise in the Dubai market. Showed real numbers, talked me out of buying an overvalued property, and offered an alternative bringing stable 12% annually." },
    { name: lang==='RU'?"Сергей К.":"Sergey K.", role: lang==='RU'?"Частный инвестор":"Private Investor", initial: "С", text: lang==='RU'?"Закрыли сделку удаленно за 4 дня. Полная прозрачность на каждом этапе, отличный выбор закрытых объектов вне рынка, до которых не добраться с улицы.":"Closed the deal remotely in 4 days. Full transparency at every stage, excellent selection of closed off-market properties unavailable to the public." },
    { name: lang==='RU'?"Мария Т.":"Maria T.", role: lang==='RU'?"Архитектор":"Architect", initial: "М", text: lang==='RU'?"Искали виллу для жизни с особыми требованиями к дизайну и локации. Команда Alpha Star нашла идеальный вариант на Palm Jumeirah.":"We were looking for a villa to live in with specific design and location requirements. The Alpha Star team found the perfect option on Palm Jumeirah." },
    { name: lang==='RU'?"Виктор Р.":"Victor R.", role: lang==='RU'?"Учредитель":"Founder", initial: "В", text: lang==='RU'?"Продали наш актив на пике цены с доходностью 60% за два года. Очень четкая аналитика и понимание трендов рынка. Рекомендую как надежного партнера.":"Sold our asset at peak price with a 60% yield in two years. Very clear analytics and understanding of market trends. I recommend them as a reliable partner." },
    { name: lang==='RU'?"Анна В.":"Anna V.", role: lang==='RU'?"Топ-менеджер":"Top Manager", initial: "А", text: lang==='RU'?"Переезд в Дубай прошел максимально комфортно. Нам подобрали прекрасные апартаменты, помогли с оформлением всех документов и открытием счетов.":"Relocation to Dubai went as smoothly as possible. They found us great apartments, helped with all paperwork, and opened bank accounts." },
    { name: lang==='RU'?"Дмитрий Л.":"Dmitry L.", role: lang==='RU'?"Инвестор":"Investor", initial: "Д", text: lang==='RU'?"Работаем с Alpha Star уже третий год. Сформировали отличный портфель из коммерческой и жилой недвижимости. Доходность стабильно выше рынка.":"Have been working with Alpha Star for three years now. Built an excellent portfolio of commercial and residential real estate. Returns are consistently above market." }
];

const getFaqs = (lang) => lang === 'RU' ? [
    { question: "Можно ли купить недвижимость удаленно?", answer: "Да, более 70% сделок проводятся удаленно через цифровую платформу DLD (Земельный Департамент) и нотариальные доверенности. Мы полностью берем на себя взаимодействие с застройщиком и государственными органами ОАЭ." },
    { question: "Какие налоги на недвижимость существуют в Дубае?", answer: "Налог на владение недвижимостью, а также налог на доход от сдачи в аренду или прирост капитала составляет 0%. Разовый сбор при регистрации права собственности (Title Deed) в DLD составляет 4% от стоимости объекта." },
    { question: "Что такое резидентская виза (Golden Visa)?", answer: "«Золотая виза» на 10 лет выдается инвесторам при покупке недвижимости на сумму от 2 млн дирхамов (около $545,000). Она дает право на долгосрочное проживание, работу, открытие банковских счетов и спонсирование членов семьи." },
    { question: "Сколько стоит содержание недвижимости (Maintenance Fee)?", answer: "Стоимость содержания зависит от района и проекта. В среднем это от 12 до 25 дирхамов за квадратный фут в год. Эти средства идут на обслуживание бассейнов, спортзалов, охрану и уборку территории комьюнити." },
    { question: "Могу ли я открыть счет в банке ОАЭ после покупки?", answer: "Да, при покупке недвижимости и получении резидентской визы вы становитесь налоговым резидентом ОАЭ и можете беспрепятственно открывать личные и корпоративные счета в топовых банках (Emirates NBD, FAB, Mashreq)." },
    { question: "Что такое NOC (No Objection Certificate)?", answer: "Это сертификат об отсутствии задолженностей от застройщика. Он обязателен при продаже объекта на вторичном рынке и подтверждает, что у продавца нет долгов по сервисным платежам за обслуживание здания." },
    { question: "Как получить ипотеку нерезиденту в ОАЭ?", answer: "Банки ОАЭ кредитуют нерезидентов. Первоначальный взнос (Down payment) обычно составляет от 40% до 50%. Процентная ставка варьируется от 4.5% до 5.5% годовых. Наша команда брокеров поможет собрать документы и получить одобрение." }
] : [
    { question: "Can I buy property remotely?", answer: "Yes, over 70% of transactions are conducted remotely via the DLD digital platform and notarized POAs. We fully handle interactions with developers and UAE government authorities." },
    { question: "What are the real estate taxes in Dubai?", answer: "Property ownership tax, as well as rental income or capital gains tax, is 0%. There is a one-time DLD registration fee of 4% of the property value." },
    { question: "What is a Golden Visa?", answer: "A 10-year visa granted to investors purchasing property worth at least 2M AED (approx. $545,000). It allows long-term residency, work, bank account opening, and family sponsorship." },
    { question: "How much are maintenance fees?", answer: "Fees depend on the area and project. On average, it's 12 to 25 AED per sq.ft annually, covering pools, gyms, security, and community cleaning." },
    { question: "Can I open a UAE bank account after buying?", answer: "Yes, upon buying property and getting a residency visa, you become a UAE tax resident and can freely open personal and corporate accounts in top banks." },
    { question: "What is an NOC (No Objection Certificate)?", answer: "A certificate of no dues from the developer. It is mandatory when selling a secondary market property, proving the seller has no outstanding service charges." },
    { question: "How can a non-resident get a mortgage in the UAE?", answer: "UAE banks lend to non-residents. The down payment is usually 40% to 50%, with interest rates from 4.5% to 5.5% per annum. Our brokers help secure approval." }
];

const categoryImages = {
    novostroyki: [
        { src: 'https://images.unsplash.com/photo-1582672060674-bc2bd808a8b5?auto=format&fit=crop&q=80&w=2000' },
        { src: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&q=80&w=2000' },
        { src: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=2000' }
    ],
    villas: [
        { src: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&q=80&w=2000' },
        { src: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=2000' },
        { src: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80&w=2000' }
    ],
    commercial: [
        { src: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=2000' },
        { src: 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&q=80&w=2000' },
        { src: 'https://images.unsplash.com/photo-1431540015161-0bf868a2d407?auto=format&fit=crop&q=80&w=2000' }
    ],
    invest: [
        { src: 'https://images.unsplash.com/photo-1554995207-c18c203602cb?auto=format&fit=crop&q=80&w=2000' },
        { src: 'https://images.unsplash.com/photo-1522050212171-61b017285bf4?auto=format&fit=crop&q=80&w=2000' },
        { src: 'https://images.unsplash.com/photo-1460472178825-e5240623afd5?auto=format&fit=crop&q=80&w=2000' }
    ],
    plots: [
        { src: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80&w=2000' },
        { src: 'https://images.unsplash.com/photo-1485081669829-bacb8c7bb1f3?auto=format&fit=crop&q=80&w=2000' },
        { src: 'https://images.unsplash.com/photo-1433838552652-f9a46b332c40?auto=format&fit=crop&q=80&w=2000' }
    ],
    distress: [
        { src: 'https://images.unsplash.com/photo-1628611225249-6c170d10c14a?auto=format&fit=crop&q=80&w=2000' },
        { src: 'https://images.unsplash.com/photo-1582482329399-52e008ba7b30?auto=format&fit=crop&q=80&w=2000' },
        { src: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&q=80&w=2000' }
    ],
    default: [
        { src: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=2000' },
        { src: 'https://images.unsplash.com/photo-1502672260266-1c1c2c44158d?auto=format&fit=crop&q=80&w=2000' },
        { src: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&q=80&w=2000' }
    ]
};

const getMockProps = (lang) => [
    { id: 1, type: 'novostroyki', beds: 1, title: 'Emaar Beachfront Residence', price: '1,500,000', location: 'Dubai Harbour', img: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&q=80&w=800', dev: 'Emaar Properties', completion: 'Q4 2026', roi: '~8-10%' },
    { id: 2, type: 'novostroyki', beds: 2, title: 'Cavalli Couture', price: '2,800,000', location: 'Dubai Water Canal', img: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=800', dev: 'DAMAC Properties', completion: 'Q3 2025', roi: '~7-9%' },
    { id: 3, type: 'villas', beds: 3, title: 'District One Villa', price: '5,500,000', location: 'MBR City', img: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&q=80&w=800', dev: 'Meydan Group', completion: 'Готов', roi: '~6%' },
    { id: 4, type: 'secondary', beds: 1, title: 'Downtown Views', price: '950,000', location: 'Downtown Dubai', img: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=800', dev: 'Emaar Properties', completion: 'Готов', roi: '~7.5%' },
    { id: 5, type: 'commercial', beds: 0, title: 'Business Bay Office', price: '3,200,000', location: 'Business Bay', img: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=800', dev: 'Omniyat', completion: 'Готов', roi: '~10%' },
    { id: 6, type: 'invest', beds: 2, title: 'High ROI Apartment', price: '1,100,000', location: 'JVC', img: 'https://images.unsplash.com/photo-1554995207-c18c203602cb?auto=format&fit=crop&q=80&w=800', dev: 'Binghatti', completion: 'Q1 2026', roi: '~9-11%' },
    { id: 7, type: 'plots', beds: 0, title: 'Pearl Jumeirah Plot', price: '12,500,000', location: 'Pearl Jumeirah', img: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80&w=800', dev: 'Meraas', completion: 'Земля', roi: 'Капитализация' }
];

const getBlogPosts = (lang) => lang === 'RU' ? [
    { id: "dubai-market-2026", title: "Рынок недвижимости Дубая 2026: Главные прогнозы и тренды", date: "14 Октября, 2025", readTime: "6 мин", img: "https://images.unsplash.com/photo-1518684079-3c830dcef090?auto=format&fit=crop&q=80&w=1200", excerpt: "Узнайте, в каких районах ожидается максимальный рост капитала (ROI) и почему фокус смещается на Ultra-Luxury.", content: `<p>Вступая в 2026 год, многие задаются вопросом: сохранится ли двузначный рост стоимости активов? Разберем ключевые тренды.</p><h3>Смещение фокуса на Ultra-Luxury</h3><p>Спрос на элитную недвижимость со стороны HNWI бьет рекорды. Проекты от мировых брендов распродаются на пресейлах.</p><h3>Топ-3 района (ROI) в 2026 году</h3><ul><li><strong>Dubai Maritime City:</strong> Огромный потенциал для краткосрочной аренды.</li><li><strong>Dubai South:</strong> Лидеры по долгосрочной аренде (7.5% – 9.5% чистого ROI).</li><li><strong>Palm Jebel Ali:</strong> Флагманский мегапроект с гарантированной высокой капитализацией.</li></ul>` },
    { id: "golden-visa-uae", title: "Как получить Золотую визу ОАЭ (Golden Visa) за инвестиции", date: "28 Сентября, 2025", readTime: "5 мин", img: "https://images.unsplash.com/photo-1549944850-84e00be4203b?auto=format&fit=crop&q=80&w=1200", excerpt: "Условия для инвесторов, налоги, порог входа и преимущества долгосрочного резидентства в 2026 году.", content: `<p>Государственная программа Golden Visa сроком на 10 лет стала магнитом для международных инвесторов.</p><h3>Главные преимущества</h3><ul><li>Долгосрочная безопасность и право продления.</li><li>Спонсирование семьи и персонала.</li><li>0% налога на доходы физических лиц.</li></ul><h3>Условия получения</h3><p>Необходимо купить недвижимость в Дубае на общую сумму не менее <strong>2 000 000 дирхамов</strong>. Допускается ипотека и объекты Off-plan.</p>` },
    { id: "buy-property-dubai-step-by-step", title: "Пошаговое руководство: Как безопасно купить недвижимость в Дубае", date: "05 Сентября, 2025", readTime: "7 мин", img: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=1200", excerpt: "Разбор каждого этапа сделки: от выбора объекта до получения Title Deed. Узнайте, как защищены деньги.", content: `<p>Дубай обладает одной из самых прозрачных правовых систем.</p><h3>Шаг 1: Бронирование (EOI)</h3><p>Внесение возвращаемого депозита.</p><h3>Шаг 2: Договор (SPA)</h3><p>Официальный договор с графиком платежей.</p><h3>Шаг 3: Escrow-счета</h3><p>Деньги лежат на эскроу-счетах, контролируемых государством.</p><h3>Шаг 4: Налоги</h3><p>Разовый сбор DLD — 4% от стоимости.</p>` },
    { id: "dubai-taxes", title: "Налоги на недвижимость в Дубае: Полное руководство", date: "10 Августа, 2025", readTime: "4 мин", img: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=1200", excerpt: "Все, что нужно знать инвестору о налогах в ОАЭ. Скрытые платежи, сборы DLD и налог на прибыль.", content: `<p>ОАЭ привлекает инвесторов благодаря отсутствию налогов на прибыль, однако существуют другие важные сборы.</p><h3>Регистрационный сбор DLD</h3><p>Главный платеж при покупке недвижимости в Дубае составляет 4% от стоимости объекта. Он уплачивается в Земельный Департамент.</p><h3>Содержание недвижимости</h3><p>Владельцы обязаны оплачивать Maintenance Fee — сбор за обслуживание здания, который зависит от площади и престижности комплекса.</p>` }
] : [
    { id: "dubai-market-2026", title: "Dubai Real Estate Market 2026: Forecasts and Trends", date: "Oct 14, 2025", readTime: "6 min", img: "https://images.unsplash.com/photo-1518684079-3c830dcef090?auto=format&fit=crop&q=80&w=1200", excerpt: "Find out which areas expect maximum capital growth (ROI) and why the focus is shifting to Ultra-Luxury.", content: `<p>Entering 2026, many wonder: will the double-digit asset growth continue? Let's analyze key trends.</p><h3>Shift to Ultra-Luxury</h3><p>Demand for luxury real estate from HNWIs breaks records. World-brand projects sell out at pre-sales.</p><h3>Top 3 ROI Areas in 2026</h3><ul><li><strong>Dubai Maritime City:</strong> Huge short-term rental potential.</li><li><strong>Dubai South:</strong> Long-term rental leaders (7.5% – 9.5% net ROI).</li><li><strong>Palm Jebel Ali:</strong> Flagship megaproject with guaranteed high capitalization.</li></ul>` },
    { id: "golden-visa-uae", title: "How to Get a UAE Golden Visa through Investments", date: "Sep 28, 2025", readTime: "5 min", img: "https://images.unsplash.com/photo-1549944850-84e00be4203b?auto=format&fit=crop&q=80&w=1200", excerpt: "Conditions for investors, taxes, entry threshold, and benefits of long-term residency in 2026.", content: `<p>The 10-year Golden Visa program has become a magnet for international investors.</p><h3>Main Benefits</h3><ul><li>Long-term security and renewal rights.</li><li>Sponsorship of family and staff.</li><li>0% personal income tax.</li></ul><h3>Conditions</h3><p>Must buy property in Dubai worth at least <strong>2,000,000 AED</strong>. Mortgages and Off-plan objects are allowed.</p>` },
    { id: "buy-property-dubai-step-by-step", title: "Step-by-step Guide: Safe Property Buying in Dubai", date: "Sep 05, 2025", readTime: "7 min", img: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=1200", excerpt: "Detailed breakdown of each stage: from object selection to getting the Title Deed.", content: `<p>Dubai has one of the most transparent legal systems.</p><h3>Step 1: Booking (EOI)</h3><p>Making a refundable deposit.</p><h3>Step 2: Agreement (SPA)</h3><p>Official agreement with a payment plan.</p><h3>Step 3: Escrow Accounts</h3><p>Money is held in state-controlled escrow accounts.</p><h3>Step 4: Taxes</h3><p>One-time DLD fee — 4% of the value.</p>` },
    { id: "dubai-taxes", title: "Real Estate Taxes in Dubai: A Complete Guide", date: "Aug 10, 2025", readTime: "4 min", img: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=1200", excerpt: "Everything an investor needs to know about UAE taxes. Hidden fees, DLD charges, and income tax.", content: `<p>The UAE attracts investors due to the absence of income tax, but there are other important fees.</p><h3>DLD Registration Fee</h3><p>The main payment when buying property in Dubai is 4% of the property value, payable to the Land Department.</p><h3>Property Maintenance</h3><p>Owners must pay a Maintenance Fee for building upkeep, which depends on the size and prestige of the complex.</p>` }
];

// --- КОНТЕКСТ ЛОКАЛИЗАЦИИ ---
const LanguageContext = createContext();

const LanguageProvider = ({ children }) => {
    const [lang, setLang] = useState('RU');
    const t = translations[lang];
    return (
        <LanguageContext.Provider value={{ lang, setLang, t }}>
            {children}
        </LanguageContext.Provider>
    );
};
const useLang = () => useContext(LanguageContext);

// --- КОМПОНЕНТЫ ---
const LanguageSwitcher = () => {
    const [isOpen, setIsOpen] = useState(false);
    const { lang, setLang } = useLang();

    return (
        <div className="relative z-[1000]">
            <button type="button" onClick={() => setIsOpen(!isOpen)} className="flex items-center gap-1 text-[10px] md:text-[11px] font-bold uppercase tracking-widest hover:text-[#C5A059] transition-colors p-2">
                {lang} <ChevronDown size={12} className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>
            <AnimatePresence>
                {isOpen && (
                    <motion.div 
                        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} 
                        className="absolute top-full right-0 mt-2 bg-white text-[#121212] shadow-2xl border border-gray-100 rounded-sm overflow-hidden z-[1000] w-32"
                    >
                        <button onClick={() => {setLang('RU'); setIsOpen(false);}} className={`block w-full text-left px-5 py-3 text-[9px] md:text-[10px] font-bold uppercase tracking-widest transition-colors ${lang === 'RU' ? 'bg-gray-50 text-[#C5A059]' : 'hover:bg-gray-50 hover:text-[#C5A059]'}`}>Русский</button>
                        <button onClick={() => {setLang('EN'); setIsOpen(false);}} className={`block w-full text-left px-5 py-3 text-[9px] md:text-[10px] font-bold uppercase tracking-widest transition-colors ${lang === 'EN' ? 'bg-gray-50 text-[#C5A059]' : 'hover:bg-gray-50 hover:text-[#C5A059]'}`}>English</button>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

const ScrollToTop = () => {
    const { pathname } = useLocation();
    useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
    return null;
};

const SectionHeading = ({ top, main, light = false }) => (
    <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }} className={`text-center mb-10 md:mb-16 ${light ? 'text-white' : 'text-[#121212]'}`}>
        {top && <h2 className="text-[9px] md:text-[10px] gold-text uppercase tracking-[0.5em] font-bold font-montserrat mb-3 md:mb-4">{top}</h2>}
        <h3 className="font-cormorant text-3xl md:text-4xl px-4 font-bold">{main}</h3>
    </motion.div>
);

const LeadForm = ({ title, subtitle, isModal = false }) => {
    const { t } = useLang();
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [selectedGoal, setSelectedGoal] = useState(t.form.selGoal);

    useEffect(() => { setSelectedGoal(t.form.selGoal); }, [t]);

    return (
        <div className={`relative bg-white shadow-2xl overflow-visible w-full ${isModal ? 'p-6 md:p-14 rounded-sm' : 'max-w-4xl mx-auto p-6 md:px-16 md:py-12 border border-gray-100'}`}>
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-1 gold-bg opacity-30"></div>
            <div className="text-center mb-6 md:mb-8">
                <h2 className="font-montserrat text-xl md:text-3xl uppercase tracking-[0.2em] md:tracking-[0.3em] font-bold mb-2 md:mb-3 text-[#121212]">{title}</h2>
                <p className="font-cormorant text-base md:text-lg text-gray-400 font-medium">{subtitle}</p>
            </div>
            <form className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5 text-left" onSubmit={e => e.preventDefault()}>
                <div className="space-y-1 md:space-y-2 font-montserrat">
                    <label className="text-[9px] md:text-[10px] uppercase tracking-[0.2em] font-bold opacity-30 ml-1">{t.form.name}</label>
                    <input type="text" required className="w-full p-3 md:p-4 bg-gray-50 border border-gray-100 focus:border-[#C5A059] outline-none font-bold text-sm transition-all duration-300 focus:bg-white focus:shadow-md" />
                </div>
                <div className="space-y-1 md:space-y-2 font-montserrat">
                    <label className="text-[9px] md:text-[10px] uppercase tracking-[0.2em] font-bold opacity-30 ml-1">{t.form.email}</label>
                    <input type="email" required className="w-full p-3 md:p-4 bg-gray-50 border border-gray-100 focus:border-[#C5A059] outline-none font-bold text-sm transition-all duration-300 focus:bg-white focus:shadow-md" />
                </div>
                <div className="space-y-1 md:space-y-2 font-montserrat">
                    <label className="text-[9px] md:text-[10px] uppercase tracking-[0.2em] font-bold opacity-30 ml-1">{t.form.phone}</label>
                    <input type="tel" required onInput={(e) => e.target.value = e.target.value.replace(/[^0-9+]/g, '')} className="w-full p-3 md:p-4 bg-gray-50 border border-gray-100 focus:border-[#C5A059] outline-none font-bold text-sm transition-all duration-300 focus:bg-white focus:shadow-md" placeholder="+971..." />
                </div>
                <div className="space-y-1 md:space-y-2 font-montserrat relative">
                    <label className="text-[9px] md:text-[10px] uppercase tracking-[0.2em] font-bold opacity-30 ml-1 mb-1 md:mb-2 block">{t.form.goal}</label>
                    <div className="relative">
                        <div className={`w-full p-3 md:p-4 bg-gray-50 border cursor-pointer transition-all duration-300 flex items-center justify-between ${dropdownOpen ? 'border-[#C5A059] bg-white shadow-md' : 'border-gray-100 hover:border-gray-300'}`} onClick={() => setDropdownOpen(!dropdownOpen)}>
                            <span className={`text-sm font-bold transition-colors ${selectedGoal !== t.form.selGoal ? 'text-[#121212]' : 'text-gray-400'}`}>{selectedGoal}</span>
                            <ChevronDown className={`w-4 h-4 md:w-5 md:h-5 text-[#C5A059] transition-transform duration-500 ${dropdownOpen ? 'rotate-180' : ''}`} />
                        </div>
                        <AnimatePresence>
                            {dropdownOpen && (
                                <motion.div initial={{ opacity: 0, y: -10, scaleY: 0.95 }} animate={{ opacity: 1, y: 0, scaleY: 1 }} exit={{ opacity: 0, y: -10, scaleY: 0.95 }} transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }} className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-100 shadow-2xl z-[100] origin-top rounded-sm overflow-hidden">
                                    {t.form.goals.map((item, idx) => (
                                        <div key={idx} onClick={() => { setSelectedGoal(item); setDropdownOpen(false); }} className="p-3 md:p-4 border-b border-gray-50 hover:bg-gray-50 cursor-pointer text-sm font-bold text-[#121212] transition-colors flex items-center justify-between group">
                                            <span className="group-hover:text-[#C5A059] transition-colors">{item}</span>
                                            {selectedGoal === item && <div className="w-2 h-2 rounded-full bg-[#C5A059]"></div>}
                                        </div>
                                    ))}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
                <div className="md:col-span-2 mt-2 flex items-start gap-3">
                    <input type="checkbox" id="consent" className="mt-1 accent-[#C5A059] w-4 h-4 flex-shrink-0 cursor-pointer" defaultChecked required />
                    <label htmlFor="consent" className="text-[9px] md:text-[10px] text-gray-400 font-montserrat leading-relaxed cursor-pointer">
                        {t.form.consent}
                    </label>
                </div>
                <div className="md:col-span-2 flex justify-center mt-2 md:mt-4">
                    <button type="submit" className="btn-premium w-full md:w-3/4 py-4 md:py-6 bg-[#C5A059] text-white font-montserrat uppercase tracking-widest font-bold shadow-lg text-xs md:text-sm">{t.form.btn}</button>
                </div>
            </form>
        </div>
    );
};

const MortgageInfo = () => {
    const { t } = useLang();
    const [showForm, setShowForm] = useState(false);

    return (
        <div className="mb-12 md:mb-16 mx-5 md:mx-0 relative z-40">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="bg-[#121212] p-6 md:p-12 rounded-sm shadow-2xl flex flex-col lg:flex-row items-center justify-between gap-6 md:gap-8 border border-[#C5A059]/20">
                <div className="text-left flex-1">
                    <h3 className="font-cormorant text-2xl md:text-3xl mb-3 md:mb-4 gold-text font-bold">{t.mortgage.title}</h3>
                    <p className="text-white/60 text-xs md:text-sm leading-relaxed max-w-3xl font-raleway">{t.mortgage.desc}</p>
                </div>
                <button type="button" onClick={() => setShowForm(!showForm)} className="btn-premium bg-[#C5A059] text-white px-8 py-4 md:px-12 w-full lg:w-auto text-[10px] font-bold uppercase tracking-widest whitespace-nowrap">
                    {showForm ? t.mortgage.hideBtn : t.mortgage.btn}
                </button>
            </motion.div>
            <AnimatePresence>
                {showForm && (
                    <motion.div initial={{ opacity: 0, height: 0, marginTop: 0 }} animate={{ opacity: 1, height: 'auto', marginTop: '2rem' }} exit={{ opacity: 0, height: 0, marginTop: 0 }} className="overflow-hidden">
                        <LeadForm title={t.mortgage.formTitle} subtitle={t.mortgage.formSub} isModal={false} />
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

const FAQItem = ({ question, answer }) => {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <div className="border-b border-gray-100 last:border-0" itemScope itemProp="mainEntity" itemType="https://schema.org/Question">
            <button type="button" onClick={() => setIsOpen(!isOpen)} className="w-full py-5 md:py-6 flex items-center justify-between text-left group outline-none">
                <span itemProp="name" className="font-montserrat font-bold text-xs md:text-sm uppercase tracking-wider group-hover:text-[#C5A059] transition-colors pr-4">{question}</span>
                <ChevronDown className={`w-4 h-4 text-gray-300 transition-transform duration-500 flex-shrink-0 ${isOpen ? 'rotate-180' : ''}`} />
            </button>
            <AnimatePresence>
                {isOpen && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.4 }} className="overflow-hidden" itemScope itemProp="acceptedAnswer" itemType="https://schema.org/Answer">
                        <p itemProp="text" className="pb-5 md:pb-6 text-gray-400 text-xs md:text-sm leading-relaxed">{answer}</p>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

const ContactModal = ({ isOpen, onClose }) => {
    const { t } = useLang();
    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div 
                    initial={{ opacity: 0 }} 
                    animate={{ opacity: 1 }} 
                    exit={{ opacity: 0 }} 
                    transition={{ duration: 0.3 }}
                    className="fixed inset-0 z-[2000] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto"
                    onClick={onClose}
                >
                    <motion.div 
                        initial={{ scale: 0.95, opacity: 0, y: 20 }} 
                        animate={{ scale: 1, opacity: 1, y: 0 }} 
                        exit={{ scale: 0.95, opacity: 0, y: 20 }} 
                        transition={{ duration: 0.3 }}
                        className="relative w-full max-w-2xl m-auto max-h-[95vh] overflow-y-auto rounded-sm"
                        onClick={e => e.stopPropagation()}
                    >
                        <button onClick={onClose} className="absolute top-2 right-2 md:top-4 md:right-4 text-gray-400 hover:text-[#C5A059] transition-colors z-[60] bg-gray-50 rounded-full p-2 shadow-sm">
                            <X size={20} />
                        </button>
                        <LeadForm title={t.form.title} subtitle={t.form.subtitle} isModal={true} />
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

// МНОГОШАГОВЫЙ КВИЗ (АВТОПОПАП)
const CallbackModal = ({ isOpen, onClose }) => {
    const { t } = useLang();
    const [step, setStep] = useState(0);
    const [answers, setAnswers] = useState({ q1: '', q2: '', q3: '' });

    // Сброс состояния при закрытии
    useEffect(() => {
        if (!isOpen) {
            const timer = setTimeout(() => { setStep(0); setAnswers({ q1: '', q2: '', q3: '' }); }, 300);
            return () => clearTimeout(timer);
        }
    }, [isOpen]);

    const handleSelect = (key, value) => {
        setAnswers(prev => ({ ...prev, [key]: value }));
        setTimeout(() => setStep(step + 1), 300);
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[2500] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto" onClick={onClose}>
                    <motion.div initial={{ scale: 0.95, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.95, opacity: 0, y: 20 }} className="relative w-full max-w-lg m-auto" onClick={e => e.stopPropagation()}>
                        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-[#C5A059] transition-colors z-[60] bg-gray-50 rounded-full p-2 shadow-sm"><X size={20} /></button>
                        
                        <div className="relative bg-white shadow-2xl overflow-visible w-full p-8 md:p-12 rounded-sm border border-gray-100 min-h-[450px] flex flex-col">
                            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-1 gold-bg opacity-30"></div>
                            
                            {step < 3 ? (
                                <motion.div key="quiz" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="flex-1 flex flex-col text-left">
                                    <div className="text-[10px] gold-text uppercase font-bold tracking-widest mb-6 flex items-center justify-between">
                                        <span>{t.quiz.step} {step + 1} / 3</span>
                                        {step > 0 && <button onClick={() => setStep(step - 1)} className="hover:text-[#121212] transition-colors">{t.quiz.back}</button>}
                                    </div>
                                    <h2 className="font-montserrat text-xl md:text-2xl uppercase tracking-[0.1em] font-bold mb-8 text-[#121212]">
                                        {step === 0 ? t.quiz.q1 : step === 1 ? t.quiz.q2 : t.quiz.q3}
                                    </h2>
                                    <div className="flex flex-col gap-3">
                                        {(step === 0 ? t.quiz.a1 : step === 1 ? t.quiz.a2 : t.quiz.a3).map((opt, i) => (
                                            <button 
                                                key={i} 
                                                type="button"
                                                onClick={() => handleSelect(`q${step+1}`, opt)}
                                                className={`p-4 text-left border rounded-sm font-montserrat text-sm font-semibold transition-all duration-300 hover:border-[#C5A059] hover:bg-gray-50 ${answers[`q${step+1}`] === opt ? 'border-[#C5A059] bg-gray-50 gold-text' : 'border-gray-200 text-gray-700'}`}
                                            >
                                                {opt}
                                            </button>
                                        ))}
                                    </div>
                                </motion.div>
                            ) : (
                                <motion.div key="form" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="flex-1 flex flex-col text-left">
                                    <div className="text-center mb-6 md:mb-8">
                                        <h2 className="font-montserrat text-xl md:text-2xl uppercase tracking-[0.2em] font-bold mb-2 md:mb-3 text-[#121212]">{t.quiz.finalTitle}</h2>
                                        <p className="font-cormorant text-base md:text-lg text-gray-400 font-medium">{t.quiz.finalSub}</p>
                                    </div>
                                    <form className="flex flex-col gap-4 md:gap-5 text-left" onSubmit={e => { e.preventDefault(); onClose(); }}>
                                        <div className="space-y-1 md:space-y-2 font-montserrat">
                                            <label className="text-[9px] md:text-[10px] uppercase tracking-[0.2em] font-bold opacity-30 ml-1">{t.form.name}</label>
                                            <input type="text" required className="w-full p-3 md:p-4 bg-gray-50 border border-gray-100 focus:border-[#C5A059] outline-none font-bold text-sm transition-all duration-300 focus:bg-white focus:shadow-md" />
                                        </div>
                                        <div className="space-y-1 md:space-y-2 font-montserrat">
                                            <label className="text-[9px] md:text-[10px] uppercase tracking-[0.2em] font-bold opacity-30 ml-1">{t.form.email}</label>
                                            <input type="email" required className="w-full p-3 md:p-4 bg-gray-50 border border-gray-100 focus:border-[#C5A059] outline-none font-bold text-sm transition-all duration-300 focus:bg-white focus:shadow-md" />
                                        </div>
                                        <div className="space-y-1 md:space-y-2 font-montserrat">
                                            <label className="text-[9px] md:text-[10px] uppercase tracking-[0.2em] font-bold opacity-30 ml-1">{t.form.phone}</label>
                                            <input type="tel" required onInput={(e) => e.target.value = e.target.value.replace(/[^0-9+]/g, '')} className="w-full p-3 md:p-4 bg-gray-50 border border-gray-100 focus:border-[#C5A059] outline-none font-bold text-sm transition-all duration-300 focus:bg-white focus:shadow-md" placeholder="+971..." />
                                        </div>
                                        <div className="mt-2 flex items-start gap-3">
                                            <input type="checkbox" id="auto-consent" className="mt-1 accent-[#C5A059] w-4 h-4 flex-shrink-0 cursor-pointer" defaultChecked required />
                                            <label htmlFor="auto-consent" className="text-[9px] md:text-[10px] text-gray-400 font-montserrat leading-relaxed cursor-pointer">{t.form.consent}</label>
                                        </div>
                                        <div className="flex justify-center mt-2 md:mt-4">
                                            <button type="submit" className="btn-premium w-full py-4 md:py-6 bg-[#C5A059] text-white font-montserrat uppercase tracking-widest font-bold shadow-lg text-xs md:text-sm">{t.form.btn}</button>
                                        </div>
                                    </form>
                                </motion.div>
                            )}
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

const InvestmentCalculator = () => {
    const { lang, t } = useLang();
    const [amount, setAmount] = useState(300000);
    const [strategy, setStrategy] = useState('offplan');
    
    const strategies = { 
        offplan: { roi: 0.35, term: lang==='RU'?'18 мес':'18 mo', title: t.calc.stOffplan, desc: lang==='RU'?'Стратегия: Покупка объекта на стадии котлована для максимальной капитализации к моменту сдачи.':'Strategy: Buying at excavation stage for max capitalization.' }, 
        rental: { roi: 0.12, term: lang==='RU'?'1 год':'1 year', title: t.calc.stRental, desc: lang==='RU'?'Стратегия: Приобретение готовой недвижимости для сдачи в долгосрочную или краткосрочную аренду.':'Strategy: Buying ready properties for rent.' }, 
        flip: { roi: 0.18, term: lang==='RU'?'8 мес':'8 mo', title: t.calc.stFlip, desc: lang==='RU'?'Стратегия: Покупка ликвидного объекта ниже рынка для быстрой перепродажи с прибылью.':'Strategy: Buying below market for fast resale.' } 
    };
    const config = strategies[strategy];
    const profit = Math.round(amount * config.roi);
    const percent = ((amount - 300000) / (2000000 - 300000)) * 100;
    const bgStyle = { background: `linear-gradient(90deg, #A67C37 0%, #C5A059 ${percent}%, #f1f1f1 ${percent}%, #f1f1f1 100%)` };

    return (
        <div className="bg-white border border-gray-100 shadow-2xl overflow-hidden rounded-sm flex flex-col lg:flex-row text-left">
            <div className="w-full lg:w-3/5 p-6 md:p-10 lg:p-16 text-left">
                <h4 className="font-montserrat text-[9px] md:text-[10px] gold-text uppercase font-bold tracking-[0.4em] mb-3 md:mb-4">{t.calc.top}</h4>
                <h3 className="font-cormorant text-3xl md:text-4xl mb-6 md:mb-8 font-bold">{t.calc.title}</h3>
                <div className="space-y-8 md:space-y-10 text-left">
                    <div className="space-y-4">
                        <div className="flex justify-between items-center">
                            <label className="text-[10px] md:text-[11px] uppercase font-bold text-gray-400 tracking-widest">{t.calc.invest}</label>
                            <span className="text-xl md:text-2xl font-montserrat font-bold">${Number(amount).toLocaleString()}</span>
                        </div>
                        <input type="range" min="300000" max="2000000" step="50000" value={amount} onChange={(e) => setAmount(e.target.value)} style={bgStyle} className="w-full" />
                    </div>
                    <div>
                        <div className="grid grid-cols-3 gap-2 md:gap-4 mb-4">
                            {Object.keys(strategies).map(s => (
                                <button type="button" key={s} onClick={() => setStrategy(s)} className={`p-3 md:p-4 border rounded-sm text-[9px] md:text-[10px] font-bold uppercase tracking-widest transition-all ${strategy === s ? 'bg-black text-white border-black' : 'bg-white text-gray-400 hover:border-gray-200'}`}>
                                    {strategies[s].title}
                                </button>
                            ))}
                        </div>
                        <p className="text-gray-400 text-xs md:text-sm font-raleway italic">{config.desc}</p>
                    </div>
                </div>
            </div>
            <div className="w-full lg:w-2/5 bg-[#121212] p-6 md:p-10 lg:p-16 text-white flex flex-col justify-between">
                <div className="text-left mb-8 lg:mb-0">
                    <p className="text-[9px] md:text-[10px] uppercase font-bold text-white/40 tracking-[0.3em] mb-2 md:mb-4">{t.calc.roi}</p>
                    <p className="text-5xl md:text-6xl font-montserrat font-bold gold-text leading-none transition-all duration-700">{(config.roi * 100).toFixed(0)}%</p>
                </div>
                <div className="space-y-3 md:space-y-4 pt-6 md:pt-8 border-t border-white/10 text-left">
                    <div className="flex justify-between items-center">
                        <span className="text-white/40 text-[10px] md:text-[11px] uppercase font-bold tracking-widest">{t.calc.profit}</span>
                        <span className="text-lg md:text-xl font-bold transition-all duration-700">${profit.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-white/40 text-[10px] md:text-[11px] uppercase font-bold tracking-widest">{t.calc.term}</span>
                        <span className="text-lg md:text-xl font-bold transition-all duration-700">{config.term}</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

const HeroSlider = ({ customImages }) => {
    const [current, setCurrent] = useState(0);
    const defaultImages = [
        { src: 'https://images.unsplash.com/photo-1518684079-3c830dcef090?auto=format&fit=crop&q=80&w=2000' },
        { src: 'https://images.unsplash.com/photo-1549944850-84e00be4203b?auto=format&fit=crop&q=80&w=2000' },
        { src: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=2000' }
    ];
    const images = customImages || defaultImages;

    useEffect(() => {
        const timer = setInterval(() => setCurrent(c => (c + 1) % images.length), 6000);
        return () => clearInterval(timer);
    }, [images.length]);

    return (
        <div className="absolute inset-0 z-0 overflow-hidden">
            <div className="absolute inset-0 bg-black/60 z-10"></div>
            {images.map((img, i) => (
                <img 
                    key={i} 
                    src={img.src} 
                    alt="bg" 
                    className={`absolute inset-0 w-full h-full object-cover transition-all duration-[10000ms] ease-out ${i === current ? 'opacity-100 scale-105' : 'opacity-0 scale-100'}`} 
                />
            ))}
        </div>
    );
};

const StarField = () => {
    const canvasRef = useRef(null);
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas || typeof THREE === 'undefined') return;
        const ctx = canvas.getContext('2d');
        let w = canvas.width = window.innerWidth;
        let h = canvas.height = window.innerHeight;
        const stars = Array.from({length: 150}, () => ({
            x: Math.random() * w,
            y: Math.random() * h,
            size: Math.random() * 1.5,
            speed: Math.random() * 0.5
        }));
        let id;
        const render = () => {
            ctx.clearRect(0,0,w,h);
            ctx.fillStyle = '#C5A059';
            stars.forEach(s => {
                ctx.globalAlpha = Math.random() * 0.5 + 0.2;
                ctx.beginPath();
                ctx.arc(s.x, s.y, s.size, 0, Math.PI*2);
                ctx.fill();
                s.y -= s.speed;
                if(s.y < 0) s.y = h;
            });
            id = requestAnimationFrame(render);
        };
        render();
        const resize = () => { w = canvas.width = window.innerWidth; h = canvas.height = window.innerHeight; };
        window.addEventListener('resize', resize);
        return () => { window.removeEventListener('resize', resize); cancelAnimationFrame(id); };
    }, []);
    return <canvas ref={canvasRef} className="absolute inset-0 z-0 pointer-events-none opacity-40"></canvas>;
};

// ИДЕАЛЬНЫЙ ПРЕМИАЛЬНЫЙ ПРЕЛОАДЕР
const Preloader = ({ onFinish }) => {
    const [fontsLoaded, setFontsLoaded] = useState(false);
    const [phase, setPhase] = useState(0);

    useEffect(() => {
        let isMounted = true;
        
        const loadFonts = async () => {
            try {
                if (document.fonts && document.fonts.load) {
                    await document.fonts.load('400 16px "Cormorant Garamond"');
                }
            } catch (err) {
                console.warn("Font preloading issue:", err);
            } finally {
                if (isMounted) {
                    setTimeout(() => setFontsLoaded(true), 150);
                }
            }
        };

        loadFonts();

        return () => { isMounted = false; };
    }, []);

    useEffect(() => {
        if (!fontsLoaded) return;
        const t1 = setTimeout(() => setPhase(1), 50);    
        const t2 = setTimeout(() => setPhase(2), 2500);  
        const t3 = setTimeout(() => onFinish(), 3500);   
        return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
    }, [fontsLoaded, onFinish]);

    if (!fontsLoaded) return <div className="fixed inset-0 z-[9999] bg-[#0A0A0A]"></div>;

    return (
        <motion.div 
            initial={{ y: 0 }}
            animate={phase >= 2 ? { y: "-100%" } : { y: 0 }}
            transition={{ duration: 1.2, ease: [0.76, 0, 0.24, 1] }}
            className="fixed inset-0 z-[9999] bg-[#0A0A0A] flex flex-col items-center justify-center overflow-hidden"
        >
            <motion.div 
                animate={phase >= 2 ? { opacity: 0, scale: 0.9 } : { opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="relative z-10 flex flex-col items-center justify-center w-full"
            >
                <motion.div 
                    initial={{ opacity: 0, scale: 0.8 }} 
                    animate={{ opacity: 0.2, scale: 1 }} 
                    transition={{ duration: 2.5, ease: "easeOut" }}
                    className="absolute w-[300px] h-[300px] md:w-[500px] md:h-[500px] bg-[#C5A059] rounded-full blur-[100px] md:blur-[150px] pointer-events-none"
                />

                <div className="relative z-10 flex flex-col items-center justify-center mt-4" style={{ WebkitFontSmoothing: 'antialiased', transform: 'translateZ(0)' }}>
                    <motion.div 
                        initial="hidden"
                        animate="visible"
                        variants={{
                            hidden: { opacity: 1 },
                            visible: { transition: { staggerChildren: 0.08 } }
                        }}
                        className="font-cormorant text-5xl md:text-7xl font-normal tracking-[0.15em] uppercase flex overflow-hidden px-4 pb-2 relative z-10"
                        style={{ fontWeight: 400 }}
                    >
                        {"ALPHASTAR".split('').map((char, i) => (
                            <motion.span
                                key={i}
                                variants={{
                                    hidden: { opacity: 0, y: "100%" },
                                    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } }
                                }}
                                className={`inline-block origin-bottom ${i >= 5 ? 'text-[#C5A059]' : 'text-white'}`}
                                style={{ willChange: 'transform, opacity' }}
                            >
                                {char}
                            </motion.span>
                        ))}
                    </motion.div>

                    <div className="overflow-hidden mt-1 md:mt-2 w-full flex justify-center">
                        <motion.div
                            initial={{ y: "100%", opacity: 0, letterSpacing: "0.2em" }}
                            animate={phase >= 1 ? { y: 0, opacity: 1, letterSpacing: "0.55em" } : {}}
                            transition={{ duration: 1.2, delay: 0.8, ease: [0.16, 1, 0.3, 1] }}
                            className="text-[10px] md:text-[12px] font-bold uppercase gold-text text-center ml-2 font-montserrat"
                        >
                            PROPERTIES
                        </motion.div>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
};

const PageWrapper = ({ children }) => (
    <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -15 }} transition={{ duration: 0.4 }} className="w-full">
        {children}
    </motion.div>
);

// --- PAGES ---
const ListingPage = ({ category, onOpenModal }) => {
    const { lang, t } = useLang();
    const navigate = useNavigate();
    const [activeBed, setActiveBed] = useState('all');
    
    const propsData = getMockProps(lang);
    let items = propsData.filter(p => category === 'all' || p.type === category || (category === 'villas' && p.type === 'villas'));
    if (activeBed !== 'all') items = items.filter(p => p.beds === Number(activeBed));

    const seo = getSeoData(lang)[category] || getSeoData(lang).novostroyki;
    const showBeds = category !== 'commercial' && category !== 'invest' && category !== 'plots' && category !== 'distress' && category !== 'empty';
    const showValuationBtn = category === 'secondary' || category === 'apartments_rent';

    const imagesToUse = categoryImages[category] || categoryImages.default;

    return (
        <div className="bg-[#FBFBFB] min-h-screen">
            <Helmet><title>{seo.title}</title></Helmet>

            <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 px-5 md:px-8 flex flex-col items-center justify-center overflow-hidden bg-[#121212] text-white text-center min-h-[65vh]">
                <HeroSlider customImages={imagesToUse} />
                <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/50 to-[#121212] z-10"></div>
                <div className="relative z-30 max-w-4xl mx-auto mt-10 md:mt-0 flex flex-col items-center w-full">
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="w-full">
                        <h2 className="text-[9px] md:text-[11px] gold-text uppercase tracking-[0.4em] md:tracking-[0.6em] mb-4 font-bold font-montserrat">{seo.heading}</h2>
                        <h1 className="font-cormorant text-4xl md:text-5xl lg:text-7xl font-bold mb-4 md:mb-6 text-white">{seo.heading}</h1>
                        <p className="max-w-2xl mx-auto text-white/80 text-sm md:text-lg px-2 font-raleway mb-8">{seo.subtitle}</p>

                        {seo.seoText && (
                            <div className="max-w-3xl mx-auto mb-10 text-left border-l-2 border-[#C5A059] pl-4 md:pl-6 bg-black/40 backdrop-blur-md p-6 rounded-sm shadow-2xl">
                                <p className="text-white/90 font-raleway leading-relaxed text-sm md:text-base font-medium">{seo.seoText}</p>
                            </div>
                        )}

                        {showValuationBtn && (
                            <button type="button" onClick={() => navigate('/valuation')} className="btn-premium px-8 md:px-12 py-4 bg-[#C5A059] text-white font-bold uppercase tracking-widest text-[10px] md:text-xs hover:bg-[#A67C37] transition-colors w-full sm:w-auto shadow-2xl mt-4">
                                {t.nav.val}
                            </button>
                        )}
                    </motion.div>
                </div>
            </section>

            <div className="max-w-7xl mx-auto text-center py-16 md:py-20 px-5 md:px-8 relative z-40 -mt-16 md:-mt-20">
                {category !== 'plots' && category !== 'empty' && category !== 'distress' && <MortgageInfo />}

                {showBeds && (
                    <div className="flex flex-wrap justify-center gap-2 md:gap-4 mb-10 md:mb-16 mt-8">
                        {['all', '1', '2', '3'].map(bed => (
                            <button type="button" key={bed} onClick={() => setActiveBed(bed)} className={`px-6 py-2 md:px-8 md:py-3 text-[9px] md:text-[10px] uppercase font-bold border transition-all duration-300 ${activeBed === bed ? 'bg-[#121212] text-white border-[#121212]' : 'bg-white text-gray-400 border-gray-200 hover:border-[#C5A059]'}`}>
                                {bed === 'all' ? t.listing.all : `${bed} ${t.listing.bed}`}
                            </button>
                        ))}
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 mt-8">
                    <AnimatePresence mode="popLayout">
                        {items.map(item => (
                            <motion.div key={item.id} layout initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="bg-white shadow-xl hover:shadow-2xl transition-all duration-500 rounded-sm overflow-hidden text-left flex flex-col">
                                <div className="aspect-video bg-gray-200 overflow-hidden relative">
                                    <img src={item.img} alt={item.title} className="w-full h-full object-cover hover:scale-110 transition-transform duration-700" />
                                    <div className="absolute top-3 left-3 md:top-4 md:left-4 bg-black/80 backdrop-blur-md px-2 py-1 md:px-3 md:py-1 text-white text-[8px] md:text-[9px] font-bold uppercase tracking-widest">${item.price}</div>
                                </div>
                                <div className="p-6 md:p-8 flex-grow flex flex-col justify-between">
                                    <div>
                                        <p className="text-gold uppercase tracking-widest text-[8px] md:text-[9px] font-bold mb-1 md:mb-2">{item.location}</p>
                                        <h4 className="font-montserrat font-bold text-base md:text-lg mb-3 md:mb-4 text-[#121212]">{item.title}</h4>
                                        <div className="flex flex-wrap gap-2 mb-4 md:mb-6">
                                            {item.dev && <span className="bg-gray-50 text-gray-500 text-[8px] uppercase tracking-widest font-bold px-2 py-1 rounded-sm border border-gray-100">{item.dev}</span>}
                                            {item.completion && <span className="bg-gray-50 text-gray-500 text-[8px] uppercase tracking-widest font-bold px-2 py-1 rounded-sm border border-gray-100">Сдача: {item.completion}</span>}
                                            {item.roi && <span className="bg-[#C5A059]/10 text-[#C5A059] text-[8px] uppercase tracking-widest font-bold px-2 py-1 rounded-sm border border-[#C5A059]/20">ROI: {item.roi}</span>}
                                        </div>
                                    </div>
                                    <button type="button" onClick={onOpenModal} className="btn-premium w-full py-3 md:py-4 text-[9px] md:text-[10px] text-white bg-[#121212] font-bold uppercase tracking-widest mt-auto">{t.listing.btn}</button>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                    {items.length === 0 && <div className="col-span-1 md:col-span-2 lg:col-span-3 py-16 md:py-20 text-gray-400 italic text-sm md:text-base">{t.listing.notFound}</div>}
                </div>

                <div className="mt-20 md:mt-32">
                    <LeadForm title={t.listing.missing} subtitle={t.listing.missingSub} />
                </div>
                
                <div className="mt-16 md:mt-24 text-left">
                    <div className="bg-[#C5A059] rounded-sm p-6 md:p-10 lg:p-16 text-white flex flex-col lg:flex-row items-center gap-8 lg:gap-12 relative overflow-hidden text-left">
                        <div className="absolute top-0 right-0 w-1/2 h-full opacity-10 pointer-events-none hidden md:block"><Globe size={300} className="translate-x-1/2 -translate-y-1/4 lg:w-[400px] lg:h-[400px]" /></div>
                        <div className="w-full lg:w-2/3 relative z-10 text-left">
                            <h3 className="font-cormorant text-3xl md:text-4xl lg:text-5xl font-bold mb-4 md:mb-6 lining-nums">{t.guide.title}</h3>
                            <p className="mb-6 md:mb-10 opacity-90 text-sm md:text-lg leading-relaxed max-w-lg font-raleway text-left">{t.guide.desc}</p>
                            <div className="flex flex-col sm:flex-row gap-3 md:gap-4">
                                <input type="email" placeholder={t.guide.email} className="bg-white/20 border border-white/30 p-4 md:p-5 px-5 md:px-6 outline-none placeholder:text-white/60 flex-grow text-white font-montserrat rounded-sm transition-all focus:bg-white/30 text-sm" />
                                <button type="button" className="btn-premium !bg-[#121212] !text-white whitespace-nowrap !py-4 px-8 md:px-12 uppercase tracking-widest font-bold text-xs w-full sm:w-auto">
                                    <span className="flex items-center justify-center gap-2 md:gap-3">{t.guide.btn} <Download size={14} className="md:w-4 md:h-4" /></span>
                                </button>
                            </div>
                        </div>
                        <div className="w-full lg:w-1/3 flex justify-center relative h-64 md:h-80 mt-8 lg:mt-0 hidden sm:flex">
                            <div className="absolute w-40 md:w-48 h-56 md:h-64 bg-[#121212] shadow-2xl border-4 border-white/10 p-5 md:p-6 flex flex-col justify-between z-10 -rotate-12 translate-x-[-20px] md:translate-x-[-40px] overflow-hidden group">
                                <div className="absolute inset-0 z-0">
                                    <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/20 to-black/80 z-10"></div>
                                    <img src="https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&q=80&w=400" className="w-full h-full object-cover opacity-80 group-hover:scale-110 transition-transform duration-700" alt="Guide Cover" />
                                </div>
                                <div className="relative z-20 flex flex-col h-full justify-between">
                                    <span className="text-[6px] md:text-[7px] gold-text uppercase font-bold">Guide 2026</span>
                                    <h5 className="font-cormorant text-sm md:text-base font-bold">Top Locations</h5>
                                </div>
                            </div>
                            <div className="absolute w-44 md:w-52 h-64 md:h-72 bg-[#121212] shadow-2xl border-8 border-white p-6 md:p-8 flex flex-col justify-between z-30 rotate-3 translate-x-[20px] md:translate-x-0 overflow-hidden group">
                                <div className="absolute inset-0 z-0">
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-black/70 z-10"></div>
                                    <img src="https://images.unsplash.com/photo-1582672060674-bc2bd808a8b5?auto=format&fit=crop&q=80&w=400" className="w-full h-full object-cover opacity-80 group-hover:scale-110 transition-transform duration-700" alt="Guide Cover 2" />
                                </div>
                                <div className="relative z-20 flex flex-col h-full justify-between">
                                    <div className="flex flex-col gap-2">
                                        <span className="text-[8px] md:text-[10px] gold-text uppercase font-bold tracking-[0.2em] md:tracking-[0.3em]">Alpha Star</span>
                                        <h5 className="font-cormorant text-xl md:text-2xl leading-tight lining-nums font-bold">Dubai 2026</h5>
                                    </div>
                                    <div className="h-0.5 w-10 md:w-12 gold-bg"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

const ValuationPage = () => {
    const { t } = useLang();
    const seo = t.valPage;
    return (
        <div className="pt-32 pb-16 md:pt-40 md:pb-24 px-5 md:px-8 bg-[#121212] text-white min-h-screen flex items-center">
            <Helmet><title>{seo.top}</title></Helmet>
            <div className="max-w-4xl mx-auto text-center w-full">
                <h1 className="font-cormorant text-4xl md:text-5xl lg:text-6xl font-bold mb-4 md:mb-6">{seo.heading}</h1>
                <p className="text-white/60 mb-10 md:mb-16 text-sm md:text-lg font-raleway max-w-2xl mx-auto px-2">{seo.subtitle}</p>
                
                <div className="bg-white/5 p-6 md:p-10 lg:p-16 border border-white/10 text-left shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-[#C5A059] opacity-10 blur-[100px] pointer-events-none"></div>
                    <form className="space-y-6 md:space-y-8 relative z-10" onSubmit={e => e.preventDefault()}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                            <div className="space-y-1 md:space-y-2"><label className="text-[9px] md:text-[10px] uppercase font-bold text-white/40 tracking-widest">{seo.name}</label><input type="text" className="w-full bg-transparent border-b border-white/20 p-3 md:p-4 outline-none focus:border-[#C5A059] transition-colors text-sm" required/></div>
                            <div className="space-y-1 md:space-y-2"><label className="text-[9px] md:text-[10px] uppercase font-bold text-white/40 tracking-widest">{seo.email}</label><input type="email" className="w-full bg-transparent border-b border-white/20 p-3 md:p-4 outline-none focus:border-[#C5A059] transition-colors text-sm" required/></div>
                            <div className="space-y-1 md:space-y-2"><label className="text-[9px] md:text-[10px] uppercase font-bold text-white/40 tracking-widest">{seo.loc}</label><input type="text" className="w-full bg-transparent border-b border-white/20 p-3 md:p-4 outline-none focus:border-[#C5A059] transition-colors text-sm" /></div>
                            <div className="space-y-1 md:space-y-2"><label className="text-[9px] md:text-[10px] uppercase font-bold text-white/40 tracking-widest">{seo.area}</label><input type="text" className="w-full bg-transparent border-b border-white/20 p-3 md:p-4 outline-none focus:border-[#C5A059] transition-colors text-sm" /></div>
                            <div className="space-y-1 md:space-y-2 md:col-span-2 max-w-md mx-auto w-full">
                                <label className="text-[9px] md:text-[10px] uppercase font-bold text-white/40 tracking-widest">{seo.phone}</label>
                                <input type="tel" required onInput={(e) => e.target.value = e.target.value.replace(/[^0-9+]/g, '')} className="w-full bg-transparent border-b border-white/20 p-3 md:p-4 outline-none focus:border-[#C5A059] transition-colors text-sm" placeholder="+971..." />
                            </div>
                        </div>
                        <div className="flex justify-center pt-4 md:pt-8">
                            <button type="submit" className="btn-premium px-12 md:px-24 py-4 md:py-6 bg-[#C5A059] text-white uppercase font-bold text-[10px] md:text-[11px] tracking-widest shadow-2xl w-full md:w-auto">{seo.btn}</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

const BlogPage = () => {
    const { lang, t } = useLang();
    const posts = getBlogPosts(lang);
    return (
        <div className="pt-32 pb-16 md:pt-40 md:pb-24 px-5 md:px-8 bg-white min-h-screen">
            <Helmet><title>{t.blog.title}</title></Helmet>
            <div className="max-w-5xl mx-auto">
                <SectionHeading top={t.blog.top} main={t.blog.title} />
                <div className="grid gap-16 md:gap-20">
                    {posts.map((post) => (
                        <div key={post.id} className="group grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center border-b border-gray-100 pb-16 md:pb-20">
                            <Link to={`/blog/${post.id}`} className="block aspect-[4/3] bg-gray-50 overflow-hidden shadow-lg order-1 md:order-none relative">
                                {post.img ? <img src={post.img} alt="blog" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000" /> : <div className="w-full h-full flex items-center justify-center border border-dashed border-gray-300"><span className="text-gray-400 text-[10px]">{t.blog.imgText}</span></div>}
                            </Link>
                            <div className="text-left order-2 md:order-none">
                                <div className="flex flex-wrap items-center gap-3 md:gap-4 mb-3 md:mb-4">
                                    <span className="gold-text font-bold text-[8px] md:text-[9px] uppercase tracking-widest block">{t.nav.blog}</span>
                                    <span className="text-gray-400 flex items-center gap-1 text-[8px] md:text-[9px] uppercase font-bold tracking-widest"><Calendar size={12} /> {post.date}</span>
                                </div>
                                <Link to={`/blog/${post.id}`} className="block">
                                    <h4 className="font-cormorant text-3xl font-bold mb-4 md:mb-6 group-hover:text-[#C5A059] transition-colors">{post.title}</h4>
                                </Link>
                                <p className="text-gray-500 mb-6 md:mb-8 font-raleway leading-relaxed text-sm md:text-base">{post.excerpt}</p>
                                <Link to={`/blog/${post.id}`} className="text-[#121212] border-b border-[#121212] pb-1 text-[9px] md:text-[10px] font-bold uppercase tracking-widest hover:text-[#C5A059] hover:border-[#C5A059] transition-colors inline-block">{t.blog.readBtn}</Link>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

const BlogPostPage = ({ onOpenModal }) => {
    const { lang, t } = useLang();
    const { id } = useParams();
    const posts = getBlogPosts(lang);
    const post = posts.find(p => p.id === id);

    if (!post) {
        return (
            <div className="pt-40 pb-24 text-center min-h-[60vh] flex flex-col items-center justify-center px-5">
                <h1 className="font-cormorant text-3xl md:text-4xl font-bold mb-6">{t.blog.notFound}</h1>
                <Link to="/blog" className="text-[#C5A059] border-b border-[#C5A059] pb-1 uppercase text-[10px] font-bold tracking-widest">{t.blog.back}</Link>
            </div>
        );
    }

    return (
        <div className="pt-28 pb-16 md:pt-32 md:pb-24 bg-white min-h-screen">
            <Helmet><title>{post.title}</title></Helmet>
            <article className="max-w-4xl mx-auto px-5 md:px-8">
                <Link to="/blog" className="inline-flex items-center gap-2 text-gray-400 hover:text-[#C5A059] transition-colors mb-8 md:mb-12 text-[9px] md:text-[10px] uppercase font-bold tracking-widest">
                    <ArrowLeft size={14} /> {t.blog.back}
                </Link>
                <div className="mb-8 md:mb-12">
                    <div className="flex flex-wrap items-center gap-4 md:gap-6 mb-4 md:mb-6 text-[9px] md:text-[10px] uppercase font-bold tracking-widest text-gray-400">
                        <span className="flex items-center gap-1 md:gap-2 text-[#C5A059]"><Calendar size={14} /> {post.date}</span>
                        <span className="flex items-center gap-1 md:gap-2"><Clock size={14} /> {post.readTime}</span>
                    </div>
                    <h1 className="font-cormorant text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-[#121212]">{post.title}</h1>
                </div>
                <div className="aspect-video w-full mb-10 md:mb-16 overflow-hidden shadow-2xl rounded-sm bg-gray-50">
                    {post.img ? <img src={post.img} alt="blog" className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center border border-dashed border-gray-300"><span className="text-gray-400 text-[10px] text-center">{t.blog.imgText}</span></div>}
                </div>
                <div className="seo-article text-left px-2 md:px-0" dangerouslySetInnerHTML={{ __html: post.content }} />
                <div className="mt-16 md:mt-20 pt-8 md:pt-10 border-t border-gray-100 text-center">
                    <p className="font-montserrat text-base md:text-lg font-bold mb-4 md:mb-6 px-4">{t.blog.ready}</p>
                    <button type="button" onClick={onOpenModal} className="btn-premium w-full md:w-auto px-8 md:px-12 py-4 md:py-5 bg-[#121212] text-white uppercase text-[10px] md:text-[11px] tracking-widest font-bold">{t.blog.reqBtn}</button>
                </div>
            </article>
        </div>
    );
};

const LegalPage = ({ type }) => {
    const { t } = useLang();
    const content = t.legal[type];
    
    return (
        <div className="pt-32 pb-16 md:pt-40 md:pb-24 px-5 md:px-8 bg-white min-h-screen text-left">
            <Helmet><title>{content.title} | Alpha Star Properties</title></Helmet>
            <div className="max-w-4xl mx-auto">
                <h1 className="font-cormorant text-4xl md:text-5xl font-bold mb-8 md:mb-12 text-[#121212]">{content.title}</h1>
                <div className="seo-article text-gray-600" dangerouslySetInnerHTML={{ __html: content.text }} />
            </div>
        </div>
    );
};

const HomePage = ({ isLoading, onOpenModal }) => {
    const { lang, t } = useLang();
    const [showAllTestimonials, setShowAllTestimonials] = useState(false);
    const steps = getSteps(lang);
    const caseStudies = getCaseStudies(lang);
    const testimonials = getTestimonials(lang);
    const faqs = getFaqs(lang);
    
    const awardIcons = [Trophy, Star, Crown, Award];
    const awardsList = t.awards.list || [
        'Больше всего успешных сделок за 2025 год',
        'Агентство года по версии клиентов',
        'Топ‑агентская команда по эксклюзивным объектам',
        'Лучшее агентство по продаже новостроек'
    ];

    return (
        <div>
            <Helmet><title>{getSeoData(lang).home.title}</title></Helmet>

            {/* 1. HERO */}
            <section className="relative h-[100svh] flex items-center justify-center overflow-hidden bg-[#121212] text-white text-left">
                <HeroSlider /><StarField />
                <div className="relative z-30 w-full max-w-7xl px-5 md:px-8">
                    <div className="flex items-center gap-3 md:gap-4 mb-4 justify-center md:justify-start">
                        <div className="w-8 md:w-12 h-px gold-bg"></div>
                        <span className="text-[9px] md:text-[10px] uppercase tracking-[0.3em] md:tracking-[0.5em] gold-text font-bold">{t.hero.boutique}</span>
                    </div>
                    <h1 className="font-montserrat text-[8.5vw] sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold leading-[1.1] mb-6 md:mb-8 uppercase tracking-tight text-center md:text-left">
                        {t.hero.title1} <br />
                        <span className="relative inline-block mt-1 md:mt-2">
                            <span className="font-cormorant font-normal text-transparent bg-clip-text bg-gradient-to-r from-[#C5A059] via-[#E2C384] to-[#C5A059] drop-shadow-[0_4px_12px_rgba(197,160,89,0.3)]" style={{ fontWeight: 400 }}>{t.hero.title2}</span>
                        </span>
                        <br /> {t.hero.title3}
                    </h1>
                    <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center md:justify-start mt-8 md:mt-10 px-4 md:px-0">
                        <Link to="/buy/off-plan" className="btn-premium px-8 md:px-12 py-4 md:py-5 bg-[#C5A059] text-white text-[10px] md:text-[11px] font-bold uppercase tracking-[0.2em] md:tracking-[0.25em] text-center shadow-2xl w-full sm:w-auto">{t.hero.catBtn}</Link>
                        <button type="button" onClick={() => document.getElementById('guide-section').scrollIntoView({behavior:'smooth'})} className="btn-premium px-8 md:px-12 py-4 md:py-5 bg-white/10 backdrop-blur-md border border-white/20 text-white text-[10px] md:text-[11px] font-bold uppercase tracking-[0.2em] md:tracking-[0.25em] text-center hover:bg-black transition-all lining-nums w-full sm:w-auto">{t.hero.anBtn}</button>
                    </div>
                </div>
            </section>

            {/* 2. О НАС */}
            <section id="about" className="py-16 lg:py-24 bg-white px-5 md:px-8">
                <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-16 items-center">
                    <div className="text-left order-2 lg:order-1">
                        <h2 className="text-[9px] md:text-[10px] font-bold uppercase tracking-[0.4em] md:tracking-[0.5em] gold-text mb-3 md:mb-4 font-montserrat text-center lg:text-left">{t.about.top}</h2>
                        <h3 className="font-montserrat text-2xl md:text-3xl lg:text-4xl font-bold mb-4 md:mb-6 leading-tight text-center lg:text-left tracking-[0.2em] md:tracking-[0.3em] uppercase">{t.about.title}</h3>
                        <p className="text-gray-600 text-base md:text-lg border-l-2 border-[#C5A059] pl-4 md:pl-6 mb-6 md:mb-8 leading-relaxed font-cormorant font-medium">{t.about.quote}</p>
                        <p className="text-gray-400 mb-8 md:mb-10 text-sm md:text-base leading-relaxed font-medium px-2 lg:px-0 text-center lg:text-left">{t.about.desc}</p>
                        <div className="flex justify-center lg:justify-start">
                            <button type="button" onClick={() => document.getElementById('strategy-section').scrollIntoView({behavior:'smooth'})} className="btn-premium px-12 md:px-24 lg:px-32 py-4 md:py-5 border border-gray-200 text-[#121212] text-[10px] md:text-[11px] font-bold uppercase tracking-[0.2em] md:tracking-[0.25em] hover:bg-gray-50 transition-all w-full md:w-auto">{t.about.btn}</button>
                        </div>
                    </div>
                    <div className="relative order-1 lg:order-2 px-4 sm:px-12 lg:px-0">
                        <div className="hero-mask aspect-[4/5] md:aspect-square lg:aspect-[4/5] overflow-hidden shadow-2xl">
                            <img src="https://images.unsplash.com/photo-1582672060674-bc2bd808a8b5?auto=format&fit=crop&q=80&w=800" alt="Архитектура Дубая" className="w-full h-full object-cover" />
                        </div>
                        <div className="absolute -bottom-4 -left-4 md:-bottom-6 md:-left-6 w-32 h-32 md:w-48 md:h-48 bg-[#C5A059]/10 -z-10 rounded-full blur-2xl md:blur-3xl"></div>
                    </div>
                </div>
            </section>

            {/* 2.5. НАГРАДЫ */}
            <section className="py-16 lg:py-24 bg-white px-5 md:px-8 border-y border-gray-100">
                <div className="max-w-7xl mx-auto">
                    <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 md:mb-20 gap-4 md:gap-6">
                        <div className="text-left">
                            <h2 className="text-[9px] md:text-[10px] gold-text uppercase tracking-[0.4em] md:tracking-[0.5em] font-bold font-montserrat mb-3">{t.awards.top}</h2>
                            <h3 className="font-cormorant text-3xl md:text-4xl text-[#121212] font-bold">{t.awards.title}</h3>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
                        {awardsList.map((awardText, i) => {
                            const Icon = awardIcons[i] || Award;
                            return (
                                <motion.div 
                                    key={i} 
                                    initial={{ opacity: 0, y: 30 }} 
                                    whileInView={{ opacity: 1, y: 0 }} 
                                    viewport={{ once: true }} 
                                    transition={{ duration: 0.8, delay: i * 0.1 }} 
                                    className="group flex flex-col items-center text-center bg-white p-6 md:p-8 rounded-sm shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-[0_10px_40px_rgba(197,160,89,0.12)] border border-gray-50 hover:-translate-y-1 transition-all duration-500"
                                >
                                    <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 group-hover:text-[#C5A059] group-hover:bg-[#C5A059]/10 transition-all duration-500 mb-4 md:mb-6">
                                        <Icon size={28} strokeWidth={1.5} className="md:w-8 md:h-8" />
                                    </div>
                                    <div className="w-8 h-px bg-gray-200 group-hover:bg-[#C5A059] transition-colors duration-500 mb-4 md:mb-6"></div>
                                    <h4 className="font-montserrat font-bold text-[10px] md:text-[11px] uppercase tracking-[0.15em] text-[#121212] leading-relaxed group-hover:text-[#C5A059] transition-colors duration-500">
                                        {awardText}
                                    </h4>
                                </motion.div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* 3. ДВА ВЕКТОРА */}
            <section id="strategy-section" className="py-16 lg:py-24 bg-gray-50 px-5 md:px-8">
                <div className="max-w-7xl mx-auto">
                    <SectionHeading top={t.strategy.top} main={t.strategy.title} />
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
                        <div className="bg-white p-6 md:p-10 lg:p-14 strategy-card relative overflow-hidden group text-left border border-gray-100">
                            <div className="relative z-10">
                                <Heart size={32} className="gold-text mb-4 md:mb-6 opacity-40 md:w-10 md:h-10" />
                                <h3 className="font-montserrat text-xl md:text-2xl font-bold mb-3 md:mb-4 text-[#121212]">{t.strategy.card1Title}</h3>
                                <p className="text-gray-500 mb-6 md:mb-10 text-sm md:text-base leading-relaxed">{t.strategy.card1Desc}</p>
                                <Link to="/buy/villas" className="btn-premium w-full py-3 md:py-4 text-[10px] md:text-[11px] font-bold uppercase tracking-widest border border-gray-200 hover:bg-black hover:text-white transition-all text-[#121212]">{t.strategy.card1Btn}</Link>
                            </div>
                            <HomeIcon size={150} className="absolute -bottom-10 -right-10 md:-bottom-16 md:-right-16 text-[#121212]/[0.02] -rotate-12 group-hover:scale-110 transition-transform md:w-[200px] md:h-[200px]" />
                        </div>
                        <div className="bg-[#121212] p-6 md:p-10 lg:p-14 strategy-card relative overflow-hidden group text-left">
                            <div className="relative z-10 text-white">
                                <TrendingUp size={32} className="gold-text mb-4 md:mb-6 opacity-40 md:w-10 md:h-10" />
                                <h3 className="font-montserrat text-xl md:text-2xl font-bold mb-3 md:mb-4 tracking-tight">{t.strategy.card2Title}</h3>
                                <p className="text-white/50 mb-6 md:mb-10 text-sm md:text-base leading-relaxed font-light">{t.strategy.card2Desc}</p>
                                <Link to="/buy/invest" className="btn-premium w-full py-3 md:py-4 text-[10px] md:text-[11px] font-bold uppercase tracking-widest bg-[#C5A059] text-white hover:bg-[#b08d4a] transition-all">{t.strategy.card2Btn}</Link>
                            </div>
                            <Coins size={150} className="absolute -bottom-10 -right-10 md:-bottom-16 md:-right-16 text-white/[0.03] -rotate-12 group-hover:scale-110 transition-transform md:w-[200px] md:h-[200px]" />
                        </div>
                    </div>
                </div>
            </section>

            {/* 4. КОНТРОЛЬ НА КАЖДОМ ЭТАПЕ */}
            <section id="process" className="py-16 lg:py-24 bg-[#121212] text-white px-5 md:px-8">
                <div className="max-w-7xl mx-auto">
                    <SectionHeading top={t.process.top} main={t.process.title} light={true} />
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
                        {steps.map((step, i) => {
                            const Icon = step.icon;
                            return (
                                <div key={i} className="bg-white/5 border border-white/10 p-6 md:p-8 lg:p-10 rounded-sm relative group overflow-hidden text-left control-card">
                                    <div className="absolute top-0 right-0 p-3 md:p-4 text-white/5 font-montserrat font-bold text-4xl md:text-6xl leading-none">0{i+1}</div>
                                    <div className="gold-text mb-4 md:mb-6 relative z-10"><Icon size={24} className="md:w-7 md:h-7" /></div>
                                    <h4 className="font-montserrat font-bold text-xs md:text-sm uppercase mb-2 md:mb-4 tracking-widest relative z-10">{step.title}</h4>
                                    <p className="text-white/40 text-xs md:text-sm leading-relaxed relative z-10 font-medium">{step.desc}</p>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* 5. КЕЙСЫ ДОСЬЕ */}
            <section id="real-deals" className="py-20 lg:py-32 bg-[#FBFBFB] px-5 md:px-8 overflow-hidden text-left">
                <div className="max-w-7xl mx-auto">
                    <div className="mb-12 md:mb-24 text-center">
                        <h3 className="font-cormorant text-4xl md:text-5xl lg:text-6xl uppercase font-bold text-[#121212]">{t.deals.title}</h3>
                    </div>
                    <div className="space-y-8 md:space-y-12">
                        {caseStudies.map((item, i) => (
                            <div key={i} className="bg-white shadow-[0_10px_40px_rgba(0,0,0,0.03)] hover:shadow-[0_20px_60px_rgba(197,160,89,0.12)] transition-all duration-700 group border border-gray-50 flex flex-col lg:flex-row overflow-hidden hover:-translate-y-1 rounded-sm">
                                <div className="w-full lg:w-2/5 bg-[#0A0A0A] aspect-video md:aspect-[4/3] lg:aspect-auto flex flex-col items-center justify-center relative overflow-hidden p-6 md:p-8 min-h-[200px]">
                                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-[#C5A059]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                                    <img src={item.img} alt={item.title} className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000 opacity-90" />
                                </div>
                                <div className="w-full lg:w-3/5 p-6 md:p-10 lg:p-14 flex flex-col justify-center relative bg-white">
                                    <div className="flex flex-col sm:flex-row sm:items-start justify-between mb-6 md:mb-8 gap-4 md:gap-6">
                                        <div>
                                            <h4 className="font-montserrat text-[9px] md:text-[10px] gold-text uppercase font-bold tracking-[0.3em] lg:tracking-[0.4em] mb-2 md:mb-3">{item.location}</h4>
                                            <h3 className="font-cormorant text-2xl md:text-3xl lg:text-4xl font-bold text-[#121212] mb-2 md:mb-3">{item.title}</h3>
                                            <p className="text-gray-400 text-[9px] md:text-[10px] font-bold uppercase tracking-widest">{item.project}</p>
                                        </div>
                                        <div className="sm:text-right bg-gray-50 sm:bg-transparent p-4 sm:p-0 rounded-sm flex flex-row sm:flex-col items-center sm:items-end justify-between sm:justify-start">
                                            <span className="text-[8px] md:text-[9px] uppercase font-bold text-gray-400 tracking-widest block sm:mb-1">{t.deals.roi}</span>
                                            <span className="text-xl md:text-2xl lg:text-3xl font-montserrat font-bold gold-text lining-nums whitespace-nowrap">{item.roi}</span>
                                        </div>
                                    </div>
                                    
                                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 mb-8 md:mb-12 bg-gray-50/50 p-4 md:p-6 border border-gray-50 rounded-sm">
                                        <div className="flex-1 w-full flex justify-between sm:block">
                                            <span className="text-[8px] md:text-[9px] uppercase font-bold text-gray-400 tracking-widest block mb-1 sm:mb-2">{item.launchTitle || t.deals.entry}</span>
                                            <span className="text-sm md:text-lg lg:text-xl font-montserrat font-bold text-[#121212] lining-nums whitespace-nowrap">{item.launch}</span>
                                        </div>
                                        <div className="hidden sm:block w-8 md:w-16 lg:w-24 h-px bg-gray-300 relative mx-2">
                                            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 border-t border-r border-[#C5A059] rotate-45"></div>
                                        </div>
                                        <div className="w-full sm:hidden h-px bg-gray-200 my-1"></div>
                                        <div className="flex-1 w-full sm:text-right md:text-left flex justify-between sm:block">
                                            <span className="text-[8px] md:text-[9px] uppercase font-bold gold-text tracking-widest block mb-1 sm:mb-2">{item.nowTitle || t.deals.exit}</span>
                                            <span className="text-sm md:text-lg lg:text-xl font-montserrat font-bold text-[#121212] lining-nums whitespace-nowrap">{item.now}</span>
                                        </div>
                                    </div>
                                    
                                    <div className="mt-auto pt-4 md:pt-6 border-t border-gray-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                                        <span className="text-[9px] md:text-[10px] text-gray-400 uppercase tracking-widest font-bold flex items-center gap-2"><ShieldCheck size={14} className="text-[#C5A059] flex-shrink-0" /> {t.deals.cycle}</span>
                                        <button type="button" onClick={onOpenModal} className="text-[9px] md:text-[10px] font-bold uppercase tracking-widest text-[#121212] hover:text-[#C5A059] border-b border-[#121212] hover:border-[#C5A059] pb-1 transition-all flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-start">{t.deals.reqBtn} <ArrowRight size={14} /></button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* 6. КАЛЬКУЛЯТОР */}
            <section className="py-16 lg:py-24 bg-white px-5 md:px-8">
                <div className="max-w-7xl mx-auto"><InvestmentCalculator /></div>
            </section>

            {/* 7. АНАЛИТИКА */}
            <section id="guide-section" className="py-16 lg:py-24 bg-white px-5 md:px-8">
                <div className="max-w-7xl mx-auto bg-[#C5A059] rounded-sm p-6 md:p-10 lg:p-16 text-white flex flex-col lg:flex-row items-center gap-8 lg:gap-12 relative overflow-hidden text-left">
                    <div className="absolute top-0 right-0 w-1/2 h-full opacity-10 pointer-events-none hidden md:block"><Globe size={300} className="translate-x-1/2 -translate-y-1/4 lg:w-[400px] lg:h-[400px]" /></div>
                    <div className="w-full lg:w-2/3 relative z-10 text-left">
                        <h3 className="font-cormorant text-3xl md:text-4xl lg:text-5xl font-bold mb-4 md:mb-6 lining-nums">{t.guide.title}</h3>
                        <p className="mb-6 md:mb-10 opacity-90 text-sm md:text-lg leading-relaxed max-w-lg font-raleway text-left">{t.guide.desc}</p>
                        <div className="flex flex-col sm:flex-row gap-3 md:gap-4">
                            <input type="email" placeholder={t.guide.email} className="bg-white/20 border border-white/30 p-4 md:p-5 px-5 md:px-6 outline-none placeholder:text-white/60 flex-grow text-white font-montserrat rounded-sm transition-all focus:bg-white/30 text-sm" />
                            <button type="button" className="btn-premium !bg-[#121212] !text-white whitespace-nowrap !py-4 px-8 md:px-12 uppercase tracking-widest font-bold text-xs w-full sm:w-auto">
                                <span className="flex items-center justify-center gap-2 md:gap-3">{t.guide.btn} <Download size={14} className="md:w-4 md:h-4" /></span>
                            </button>
                        </div>
                    </div>
                    <div className="w-full lg:w-1/3 flex justify-center relative h-64 md:h-80 mt-8 lg:mt-0 hidden sm:flex">
                        <div className="absolute w-40 md:w-48 h-56 md:h-64 bg-[#121212] shadow-2xl border-4 border-white/10 p-5 md:p-6 flex flex-col justify-between z-10 -rotate-12 translate-x-[-20px] md:translate-x-[-40px] overflow-hidden group">
                            <div className="absolute inset-0 z-0">
                                <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/20 to-black/80 z-10"></div>
                                <img src="https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&q=80&w=400" className="w-full h-full object-cover opacity-80 group-hover:scale-110 transition-transform duration-700" alt="Guide Cover" />
                            </div>
                            <div className="relative z-20 flex flex-col h-full justify-between">
                                <span className="text-[6px] md:text-[7px] gold-text uppercase font-bold">Guide 2026</span>
                                <h5 className="font-cormorant text-sm md:text-base font-bold">Top Locations</h5>
                            </div>
                        </div>
                        <div className="absolute w-44 md:w-52 h-64 md:h-72 bg-[#121212] shadow-2xl border-8 border-white p-6 md:p-8 flex flex-col justify-between z-30 rotate-3 translate-x-[20px] md:translate-x-0 overflow-hidden group">
                            <div className="absolute inset-0 z-0">
                                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-black/70 z-10"></div>
                                <img src="https://images.unsplash.com/photo-1582672060674-bc2bd808a8b5?auto=format&fit=crop&q=80&w=400" className="w-full h-full object-cover opacity-80 group-hover:scale-110 transition-transform duration-700" alt="Guide Cover 2" />
                            </div>
                            <div className="relative z-20 flex flex-col h-full justify-between">
                                <div className="flex flex-col gap-2">
                                    <span className="text-[8px] md:text-[10px] gold-text uppercase font-bold tracking-[0.2em] md:tracking-[0.3em]">Alpha Star</span>
                                    <h5 className="font-cormorant text-xl md:text-2xl leading-tight lining-nums font-bold">Dubai 2026</h5>
                                </div>
                                <div className="h-0.5 w-10 md:w-12 gold-bg"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* 7.5. ОТЗЫВЫ */}
            <section className="py-20 lg:py-32 bg-[#FBFBFB] px-5 md:px-8 text-left">
                <div className="max-w-7xl mx-auto">
                    <SectionHeading main={t.testim.title} />
                    <motion.div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 mb-10">
                        {testimonials.slice(0, showAllTestimonials ? testimonials.length : 4).map((testim, i) => (
                            <motion.div key={i} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: i*0.1 }} className="bg-white p-6 md:p-8 lg:p-10 shadow-[0_10px_30px_rgba(0,0,0,0.02)] hover:shadow-[0_20px_50px_rgba(197,160,89,0.12)] transition-all duration-500 relative group flex flex-col h-full border border-gray-50 hover:-translate-y-1 rounded-sm">
                                <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-[#C5A059] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                                <div className="flex items-center gap-3 md:gap-4 mb-4 md:mb-6 border-b border-gray-100 pb-4 md:pb-6 relative z-10">
                                    <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-[#121212] flex items-center justify-center text-[#C5A059] font-cormorant font-bold text-lg md:text-xl shadow-inner flex-shrink-0">{testim.initial}</div>
                                    <div><h5 className="font-montserrat font-bold text-[#121212] text-[10px] md:text-xs uppercase tracking-widest mb-1">{testim.name}</h5><span className="text-[8px] md:text-[9px] text-gray-400 uppercase tracking-widest font-bold">{testim.role}</span></div>
                                </div>
                                <p className="text-gray-600 font-cormorant text-base md:text-lg leading-relaxed mb-6 md:mb-8 flex-grow relative z-10">{testim.text}</p>
                                <div className="mt-auto flex items-center justify-between relative z-10">
                                    <div className="flex gap-1 text-[#C5A059]">{[1,2,3,4,5].map(star => <Star key={star} size={24} fill="currentColor" />)}</div>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                    {!showAllTestimonials && testimonials.length > 4 && (
                        <div className="flex justify-center mt-8">
                            <button onClick={() => setShowAllTestimonials(true)} className="btn-premium w-full sm:w-auto px-8 md:px-12 py-4 border border-gray-200 text-[#121212] text-[10px] font-bold uppercase tracking-widest hover:bg-gray-50 transition-all">{t.testim.more}</button>
                        </div>
                    )}
                </div>
            </section>

            {/* 8. FAQ */}
            <section className="py-16 lg:py-24 bg-white px-5 md:px-8 text-left">
                <div className="max-w-3xl mx-auto">
                    <SectionHeading top={t.faq.top} main={t.faq.title} />
                    <div className="border-t border-gray-100">{faqs.map((faq, i) => <FAQItem key={i} {...faq} />)}</div>
                </div>
            </section>

            {/* 9. ФОРМА КОНТАКТОВ */}
            <section id="contact-form" className="py-16 lg:py-24 bg-[#f9f9f9] px-5 md:px-8 text-center overflow-visible">
                <LeadForm title={t.form.title} subtitle={t.form.subtitle} />
            </section>
        </div>
    );
};

// --- APP WRAPPER WITH ROUTER & HEADER ---
const AppContent = () => {
    const { lang, t } = useLang();
    const [isLoading, setIsLoading] = useState(true);
    const [scrolled, setScrolled] = useState(false);
    const [showTopBtn, setShowTopBtn] = useState(false);
    const [isContactModalOpen, setIsContactModalOpen] = useState(false);
    const [isAutoModalOpen, setIsAutoModalOpen] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        const handleScroll = () => { setScrolled(window.scrollY > 50); setShowTopBtn(window.scrollY > 500); };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        const hasSeenPopup = sessionStorage.getItem('popupShown');
        if (!hasSeenPopup) {
            const timer = setTimeout(() => {
                setIsAutoModalOpen(true);
                sessionStorage.setItem('popupShown', 'true');
            }, 21000); // 21 Секунда
            return () => clearTimeout(timer);
        }
    }, []);

    const isHome = location.pathname === '/';
    const headerClass = isHome ? (scrolled ? 'bg-white text-[#121212] shadow-md py-3 md:py-4' : 'bg-transparent text-white py-4 md:py-6 border-b border-white/10') : 'bg-[#0A0A0A] text-white shadow-lg py-3 md:py-4 border-b border-white/5';

    const handleNav = (path, anchor) => {
        setIsMobileMenuOpen(false);
        if(path === '/') {
            if(!isHome) navigate('/');
            if(anchor) setTimeout(() => document.getElementById(anchor)?.scrollIntoView({behavior: 'smooth'}), 300);
            else window.scrollTo({top:0, behavior:'smooth'});
        }
    };

    const NavDropdown = ({ label, items }) => (
        <div className="nav-item group">
            <span className="flex items-center gap-1 cursor-pointer hover:text-[#C5A059] transition-colors">{label} <ChevronDown size={12}/></span>
            <div className="nav-dropdown">
                {items.map((item, idx) => {
                    if (item.divider) return <div key={idx} className="h-px bg-gray-100 my-2 mx-4"></div>;
                    if (item.special) return <Link key={idx} to={item.path} className="dropdown-link dropdown-special-btn block">{item.label}</Link>;
                    if (item.onClick) return <span key={idx} onClick={item.onClick} className="dropdown-link">{item.label}</span>;
                    if (item.anchor) return <span key={idx} onClick={() => handleNav('/', item.anchor)} className="dropdown-link">{item.label}</span>;
                    return <Link key={idx} to={item.path} className={`dropdown-link ${item.gold ? 'gold-text font-bold' : ''}`}>{item.label}</Link>;
                })}
            </div>
        </div>
    );

    return (
        <>
            <AnimatePresence>
                {isLoading && <Preloader key="preloader" onFinish={() => setIsLoading(false)} />}
            </AnimatePresence>

            <ContactModal isOpen={isContactModalOpen} onClose={() => setIsContactModalOpen(false)} />
            <CallbackModal isOpen={isAutoModalOpen} onClose={() => setIsAutoModalOpen(false)} />

            {/* ХЕДЕР */}
            <header className={`fixed w-full z-[1000] transition-all duration-500 ${headerClass}`}>
                <div className="max-w-7xl mx-auto px-5 md:px-8 flex justify-between items-center">
                    <Link to="/" className="flex flex-col cursor-pointer" onClick={() => setIsMobileMenuOpen(false)}>
                        <span className="font-cormorant text-xl md:text-2xl lg:text-3xl font-normal tracking-[0.15em] uppercase" style={{ fontWeight: 400 }}>ALPHA<span className="gold-text">STAR</span></span>
                        <span className="text-[6px] md:text-[7px] lg:text-[8px] tracking-[0.4em] lg:tracking-[0.55em] font-bold uppercase gold-text -mt-1 text-left">PROPERTIES</span>
                    </Link>
                    
                    <nav className="hidden lg:flex items-center space-x-6 xl:space-x-8 text-[10px] font-bold uppercase tracking-widest">
                        <NavDropdown label={t.nav.buy} items={[
                            { label: t.nav.offplan, path: '/buy/off-plan' },
                            { label: t.nav.secondary, path: '/buy/secondary' },
                            { label: t.nav.villas, path: '/buy/villas' },
                            { label: t.nav.invest, path: '/buy/invest' },
                            { label: t.nav.comm, path: '/buy/commercial' },
                            { label: t.nav.plots, path: '/buy/plots' },
                            { divider: true },
                            { label: t.nav.distress, path: '/buy/distress' },
                            { label: t.nav.val, path: '/valuation', special: true }
                        ]} />
                        <NavDropdown label={t.nav.rent} items={[
                            { label: t.nav.apart, path: '/rent/apartments' },
                            { label: t.nav.villas, path: '/rent/villas' },
                            { label: t.nav.comm, path: '/rent/commercial' },
                            { divider: true },
                            { label: t.nav.val, path: '/valuation', gold: true }
                        ]} />
                        <NavDropdown label={t.nav.about} items={[
                            { label: t.nav.blog, path: '/blog' },
                            { label: t.nav.contact, onClick: () => setIsContactModalOpen(true) }
                        ]} />
                        <div className="flex items-center gap-4 pl-4 border-l border-white/20">
                            <LanguageSwitcher />
                            <button type="button" onClick={() => setIsContactModalOpen(true)} className="btn-premium bg-[#C5A059] text-white px-6 py-3 text-[9px] xl:text-[10px] uppercase font-bold tracking-widest shadow-lg">{t.nav.contact}</button>
                        </div>
                    </nav>
                    <div className="lg:hidden flex items-center gap-2">
                        <LanguageSwitcher />
                        <button type="button" className="text-current hover:text-[#C5A059] transition-colors p-2 -mr-2" onClick={() => setIsMobileMenuOpen(true)}>
                            <Menu size={24} className="md:w-7 md:h-7" />
                        </button>
                    </div>
                </div>
            </header>

            {/* MOBILE MENU (LIQUID GLASS) */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div 
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }} 
                        className="fixed inset-0 bg-black/60 backdrop-blur-2xl z-[2000] flex flex-col px-6 py-8 overflow-y-auto border-l border-white/10"
                    >
                        <div className="flex justify-between items-center mb-10">
                            <div className="flex flex-col cursor-pointer text-white" onClick={() => { handleNav('/'); setIsMobileMenuOpen(false); }}>
                                <span className="font-cormorant text-2xl font-normal tracking-[0.15em] uppercase" style={{ fontWeight: 400 }}>ALPHA<span className="gold-text">STAR</span></span>
                                <span className="text-[6px] tracking-[0.4em] font-bold uppercase gold-text -mt-1 text-left">PROPERTIES</span>
                            </div>
                            <button onClick={() => setIsMobileMenuOpen(false)} className="text-white/50 hover:text-[#C5A059] p-2 -mr-2 bg-white/5 rounded-full"><X size={24} /></button>
                        </div>
                        <nav className="flex flex-col gap-8 text-white font-montserrat">
                            <div className="border-b border-white/10 pb-6">
                                <span className="gold-text text-[10px] uppercase tracking-widest font-bold mb-4 block opacity-70">{t.nav.buy}</span>
                                <div className="flex flex-col gap-4 pl-2 text-sm font-semibold tracking-wide">
                                    <Link to="/buy/off-plan" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-[#C5A059] transition-colors">{t.nav.offplan}</Link>
                                    <Link to="/buy/secondary" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-[#C5A059] transition-colors">{t.nav.secondary}</Link>
                                    <Link to="/buy/villas" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-[#C5A059] transition-colors">{t.nav.villas}</Link>
                                    <Link to="/buy/invest" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-[#C5A059] transition-colors">{t.nav.invest}</Link>
                                    <Link to="/buy/commercial" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-[#C5A059] transition-colors">{t.nav.comm}</Link>
                                    <Link to="/buy/distress" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-[#C5A059] transition-colors text-red-400">{t.nav.distress}</Link>
                                    <Link to="/valuation" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-[#C5A059] transition-colors gold-text">{t.nav.val}</Link>
                                </div>
                            </div>
                            <div className="border-b border-white/10 pb-6">
                                <span className="gold-text text-[10px] uppercase tracking-widest font-bold mb-4 block opacity-70">{t.nav.rent}</span>
                                <div className="flex flex-col gap-4 pl-2 text-sm font-semibold tracking-wide">
                                    <Link to="/rent/apartments" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-[#C5A059] transition-colors">{t.nav.apart}</Link>
                                    <Link to="/rent/villas" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-[#C5A059] transition-colors">{t.nav.villas}</Link>
                                    <Link to="/rent/commercial" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-[#C5A059] transition-colors">{t.nav.comm}</Link>
                                    <Link to="/valuation" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-[#C5A059] transition-colors gold-text">{t.nav.val}</Link>
                                </div>
                            </div>
                            <div className="pb-4">
                                <span className="gold-text text-[10px] uppercase tracking-widest font-bold mb-4 block opacity-70">{t.nav.company}</span>
                                <div className="flex flex-col gap-4 pl-2 text-sm font-semibold tracking-wide">
                                    <span onClick={() => handleNav('/', 'about')} className="cursor-pointer hover:text-[#C5A059] transition-colors">{t.nav.about}</span>
                                    <Link to="/blog" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-[#C5A059] transition-colors">{t.nav.blog}</Link>
                                </div>
                            </div>
                            <button type="button" onClick={() => { setIsMobileMenuOpen(false); setIsContactModalOpen(true); }} className="btn-premium bg-[#C5A059] text-white py-5 mt-2 text-xs uppercase tracking-widest font-bold shadow-lg w-full">{t.nav.btn}</button>

                            {/* ИКОНКИ СОЦСЕТЕЙ В МОБИЛЬНОМ МЕНЮ */}
                            <div className="flex justify-center items-center gap-5 pt-8 mt-4 border-t border-white/10">
                                <a href="https://wa.me/971521208414" target="_blank" rel="noopener noreferrer" className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center text-white/50 hover:text-[#C5A059] hover:border-[#C5A059] bg-white/5 transition-all duration-300">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>
                                </a>
                                <a href="https://t.me/dubai_bestprice" target="_blank" rel="noopener noreferrer" className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center text-white/50 hover:text-[#C5A059] hover:border-[#C5A059] bg-white/5 transition-all duration-300">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><path d="m22 2-7 20-4-9-9-4Z"></path><path d="M22 2 11 13"></path></svg>
                                </a>
                                <a href="https://www.instagram.com/alphastar.dubai?igsh=a3A5ajM2NjV2ajl6&utm_source=qr" target="_blank" rel="noopener noreferrer" className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center text-white/50 hover:text-[#C5A059] hover:border-[#C5A059] bg-white/5 transition-all duration-300">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"></line></svg>
                                </a>
                            </div>
                        </nav>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* КОНТЕНТ */}
            <main className="min-h-screen bg-[#121212]">
                <AnimatePresence mode="wait" onExitComplete={() => window.scrollTo(0, 0)}>
                    <Routes location={location} key={location.pathname}>
                        <Route path="/" element={<PageWrapper><HomePage isLoading={isLoading} onOpenModal={() => setIsContactModalOpen(true)} /></PageWrapper>} />
                        <Route path="/buy/off-plan" element={<PageWrapper><ListingPage category="novostroyki" onOpenModal={() => setIsContactModalOpen(true)} /></PageWrapper>} />
                        <Route path="/buy/secondary" element={<PageWrapper><ListingPage category="secondary" onOpenModal={() => setIsContactModalOpen(true)} /></PageWrapper>} />
                        <Route path="/buy/villas" element={<PageWrapper><ListingPage category="villas" onOpenModal={() => setIsContactModalOpen(true)} /></PageWrapper>} />
                        <Route path="/buy/commercial" element={<PageWrapper><ListingPage category="commercial" onOpenModal={() => setIsContactModalOpen(true)} /></PageWrapper>} />
                        <Route path="/buy/invest" element={<PageWrapper><ListingPage category="invest" onOpenModal={() => setIsContactModalOpen(true)} /></PageWrapper>} />
                        <Route path="/buy/plots" element={<PageWrapper><ListingPage category="plots" onOpenModal={() => setIsContactModalOpen(true)} /></PageWrapper>} />
                        <Route path="/buy/distress" element={<PageWrapper><ListingPage category="distress" onOpenModal={() => setIsContactModalOpen(true)} /></PageWrapper>} />
                        <Route path="/rent/apartments" element={<PageWrapper><ListingPage category="apartments_rent" onOpenModal={() => setIsContactModalOpen(true)} /></PageWrapper>} />
                        <Route path="/rent/villas" element={<PageWrapper><ListingPage category="villas" onOpenModal={() => setIsContactModalOpen(true)} /></PageWrapper>} />
                        <Route path="/rent/commercial" element={<PageWrapper><ListingPage category="commercial" onOpenModal={() => setIsContactModalOpen(true)} /></PageWrapper>} />
                        <Route path="/valuation" element={<PageWrapper><ValuationPage /></PageWrapper>} />
                        <Route path="/blog" element={<PageWrapper><BlogPage /></PageWrapper>} />
                        <Route path="/blog/:id" element={<PageWrapper><BlogPostPage onOpenModal={() => setIsContactModalOpen(true)} /></PageWrapper>} />
                        <Route path="/privacy-policy" element={<PageWrapper><LegalPage type="privacy" /></PageWrapper>} />
                        <Route path="/terms-of-use" element={<PageWrapper><LegalPage type="terms" /></PageWrapper>} />
                    </Routes>
                </AnimatePresence>
            </main>

            {/* ФУТЕР */}
            <footer className="bg-[#0A0A0A] text-white pt-12 md:pt-24 pb-6 md:pb-12 px-6 md:px-8 relative overflow-hidden border-t border-white/5">
                <div className="absolute top-0 right-0 w-1/3 h-full bg-[#C5A059]/5 blur-[120px] pointer-events-none"></div>
                <div className="max-w-7xl mx-auto relative z-10 text-left">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 md:gap-16 mb-10 md:mb-20 text-left">
                        <div className="lg:col-span-5 space-y-4 md:space-y-8 text-left">
                            <div className="flex flex-col text-left">
                                <span className="font-cormorant text-2xl md:text-3xl font-normal tracking-[0.15em] uppercase" style={{ fontWeight: 400 }}>ALPHA<span className="gold-text">STAR</span></span>
                                <span className="text-[7px] md:text-[9px] tracking-[0.7em] md:tracking-[0.8em] font-bold uppercase gold-text -mt-1 ml-1 text-left">PROPERTIES</span>
                            </div>
                            <p className="text-white/40 text-xs md:text-base leading-relaxed max-w-md font-medium italic border-l border-[#C5A059] pl-3 md:pl-6 text-left">{t.footer.quote}</p>
                            
                            {/* Иконки соцсетей */}
                            <div className="flex items-center gap-3 pt-2 md:pt-4">
                                <a href="https://wa.me/971521208414" target="_blank" rel="noopener noreferrer" className="w-10 h-10 md:w-12 md:h-12 rounded-full border border-white/10 flex items-center justify-center text-white/40 hover:border-[#C5A059] hover:text-[#C5A059] hover:bg-[#C5A059]/5 transition-all duration-500 hover:shadow-[0_0_20px_rgba(197,160,89,0.15)] hover:-translate-y-1 group">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 md:w-5 md:h-5 transition-transform duration-500 group-hover:scale-110">
                                        <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
                                    </svg>
                                </a>
                                <a href="https://t.me/dubai_bestprice" target="_blank" rel="noopener noreferrer" className="w-10 h-10 md:w-12 md:h-12 rounded-full border border-white/10 flex items-center justify-center text-white/40 hover:border-[#C5A059] hover:text-[#C5A059] hover:bg-[#C5A059]/5 transition-all duration-500 hover:shadow-[0_0_20px_rgba(197,160,89,0.15)] hover:-translate-y-1 group">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 md:w-5 md:h-5 transition-transform duration-500 group-hover:scale-110">
                                        <path d="m22 2-7 20-4-9-9-4Z"></path>
                                        <path d="M22 2 11 13"></path>
                                    </svg>
                                </a>
                                <a href="https://www.instagram.com/alphastar.dubai?igsh=a3A5ajM2NjV2ajl6&utm_source=qr" target="_blank" rel="noopener noreferrer" className="w-10 h-10 md:w-12 md:h-12 rounded-full border border-white/10 flex items-center justify-center text-white/40 hover:border-[#C5A059] hover:text-[#C5A059] hover:bg-[#C5A059]/5 transition-all duration-500 hover:shadow-[0_0_20px_rgba(197,160,89,0.15)] hover:-translate-y-1 group">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 md:w-5 md:h-5 transition-transform duration-500 group-hover:scale-110">
                                        <rect width="20" height="20" x="2" y="2" rx="5" ry="5"></rect>
                                        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                                        <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"></line>
                                    </svg>
                                </a>
                            </div>
                        </div>
                        <div className="lg:col-span-3 space-y-4 md:space-y-8 text-left hidden md:block">
                            <h6 className="font-montserrat text-[9px] md:text-[10px] font-bold uppercase tracking-[0.4em] md:tracking-[0.5em] gold-text">{t.footer.nav}</h6>
                            <ul className="space-y-2 md:space-y-4 text-xs md:text-sm font-bold uppercase tracking-widest text-white/30 text-left">
                                <li><span onClick={() => handleNav('/', 'about')} className="hover:text-white transition-colors cursor-pointer block">{t.footer.about}</span></li>
                                <li><span onClick={() => handleNav('/', 'real-deals')} className="hover:text-white transition-colors cursor-pointer block">{t.footer.cases}</span></li>
                                <li><Link to="/buy/off-plan" className="hover:text-white transition-colors cursor-pointer block">{t.footer.catalog}</Link></li>
                            </ul>
                        </div>
                        <div className="lg:col-span-4 space-y-4 md:space-y-8 text-left mt-2 md:mt-0">
                            <h6 className="font-montserrat text-[9px] md:text-[10px] font-bold uppercase tracking-[0.4em] md:tracking-[0.5em] gold-text">{t.footer.contacts}</h6>
                            <div className="space-y-4 md:space-y-6 text-left">
                                <div className="flex items-start gap-3 md:gap-4 text-left">
                                    <MapPin className="gold-text mt-1 flex-shrink-0" size={16} />
                                    <div className="space-y-2 md:space-y-3">
                                        <p className="text-white/60 text-[9px] md:text-xs font-medium uppercase tracking-wider text-left">
                                            <span className="text-[#C5A059] block mb-1 text-[7px] md:text-[9px]">Офис в Дубае:</span>
                                            EMAAR Business Park - Building 4<br/>Office 112, Floor 1, Dubai
                                        </p>
                                        <p className="text-white/60 text-[9px] md:text-xs font-medium uppercase tracking-wider text-left">
                                            <span className="text-[#C5A059] block mb-1 text-[7px] md:text-[9px]">Офис в Москве:</span>
                                            ЗАО, район Можайский,<br/>метро Кунцевская
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 md:gap-4 group cursor-pointer text-left"><Phone className="gold-text flex-shrink-0" size={16} /><p className="text-white font-montserrat font-bold text-base md:text-xl tracking-tighter group-hover:text-[#C5A059] transition-colors text-left">+971 52 120 8414</p></div>
                                <div className="flex items-center gap-3 md:gap-4 group cursor-pointer text-left"><Mail className="gold-text flex-shrink-0" size={16} /><p className="text-white/60 font-bold uppercase text-[8px] md:text-[10px] tracking-[0.3em] group-hover:text-white transition-colors text-left break-all">sales@alphastardubai.ae</p></div>
                            </div>
                        </div>
                    </div>
                    <div className="pt-4 md:pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-3 md:gap-4">
                        <div className="text-[7px] md:text-[9px] uppercase font-bold tracking-[0.2em] md:tracking-[0.4em] text-white/20 text-center md:text-left">
                            © 2026 Alpha Star Properties. Все права защищены.
                        </div>
                        <div className="flex items-center gap-3 md:gap-4 text-[7px] md:text-[9px] uppercase font-bold tracking-widest text-white/20">
                            <Link to="/privacy-policy" className="cursor-pointer hover:text-white transition-colors">Политика конфиденциальности</Link>
                            <span className="hidden md:inline">|</span>
                            <Link to="/terms-of-use" className="cursor-pointer hover:text-white transition-colors">Условия использования</Link>
                        </div>
                    </div>
                </div>
            </footer>

            <div className="fixed bottom-6 right-6 z-[1500]">
                <AnimatePresence>
                    {showTopBtn && (
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.5, y: 20 }} 
                            animate={{ opacity: 1, scale: 1, y: 0 }} 
                            exit={{ opacity: 0, scale: 0.5, y: 20 }} 
                            transition={{ duration: 0.3 }}
                        >
                            <button type="button" onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})} className="w-10 h-10 md:w-12 md:h-12 bg-[#121212] text-[#C5A059] border border-white/10 rounded-full flex items-center justify-center shadow-lg hover:bg-[#C5A059] hover:text-white active:scale-95 transition-all mx-auto mb-3">
                                <ArrowUp size={20} className="md:w-6 md:h-6" />
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>
                <button type="button" onClick={() => setIsContactModalOpen(true)} className="w-14 h-14 bg-[#C5A059] text-white rounded-full flex items-center justify-center shadow-2xl hover:scale-110 active:scale-95 transition-transform duration-300">
                    <MessageCircle size={28} />
                </button>
            </div>
        </>
    );
};

export default function App() {
    return (
        <HelmetProvider>
            <LanguageProvider>
                <Helmet>
                    {/* Принудительное обновление кэша фавикона */}
                    <link rel="icon" type="image/x-icon" href="./favicon.ico?v=3" />
                    <link rel="shortcut icon" type="image/x-icon" href="./favicon.ico?v=3" />
                    <link rel="apple-touch-icon" sizes="180x180" href="./apple-touch-icon.png?v=3" />
                    
                    <link rel="preconnect" href="https://fonts.googleapis.com" />
                    <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
                    <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600;700&family=Montserrat:wght@300;400;500;600;700&family=Raleway:wght@300;400;500;600&display=swap" rel="stylesheet" />
                </Helmet>
                <Router>
                    <style>{styles}</style>
                    <AppContent />
                </Router>
            </LanguageProvider>
        </HelmetProvider>
    );
}
