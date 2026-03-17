import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HashRouter as Router, Routes, Route, Link, useNavigate, useLocation, useParams } from 'react-router-dom';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import { 
  Heart, Home as HomeIcon, TrendingUp, Coins, Globe, Download, 
  MapPin, Phone, Mail, MessageCircle, ChevronDown, 
  ShieldCheck, Search, FileCheck, Key, ArrowRight, Quote, Star, 
  Calendar, Clock, ArrowLeft
} from 'lucide-react';

// --- Стили ---
const styles = `
    @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600;700&family=Playfair+Display:ital,wght@0,700;1,400&family=Raleway:wght@300;400;500;600&display=swap');

    :root {
        --color-gold: #C5A059;
        --color-gold-dark: #A67C37;
        --color-dark: #121212;
    }

    body {
        font-family: 'Raleway', sans-serif;
        background-color: #ffffff;
        color: var(--color-dark);
        overflow-x: hidden;
    }

    .font-playfair { font-family: 'Playfair Display', serif; }
    .font-montserrat { font-family: 'Montserrat', sans-serif; }
    
    .gold-text { color: var(--color-gold) !important; }
    .gold-bg { background-color: var(--color-gold) !important; }
    .lining-nums { font-variant-numeric: lining-nums; }

    .hero-mask { clip-path: polygon(10% 0, 100% 0, 100% 90%, 90% 100%, 0 100%, 0 10%); }

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
    .seo-article h3 { font-family: 'Playfair Display', serif; font-size: 1.75rem; font-weight: 700; color: #121212; margin-top: 2.5rem; margin-bottom: 1.25rem; line-height: 1.3; }
    .seo-article p { margin-bottom: 1.5rem; line-height: 1.8; color: #4b5563; font-size: 1.05rem; }
    .seo-article ul { list-style-type: disc; padding-left: 1.5rem; margin-bottom: 2rem; color: #4b5563; font-size: 1.05rem; }
    .seo-article li { margin-bottom: 0.75rem; leading-relaxed; }
    .seo-article strong { color: #121212; font-weight: 700; }
`;

// --- SEO КОНТЕНТ (СЕМАНТИЧЕСКОЕ ЯДРО) ---
const seoData = {
    home: {
        title: "Элитная недвижимость в Дубае | Купить квартиру и виллу | Alpha Star",
        description: "Инвестиции в недвижимость Дубая. Элитные квартиры, виллы и таунхаусы. Сопровождение сделок Private Office, доступ к off-market лотам и высокая доходность (ROI)."
    },
    novostroyki: {
        title: "Новостройки Дубая от застройщика | Купить недвижимость Off-plan",
        description: "Купить новостройку в Дубае (ОАЭ) без комиссии. Каталог лучших off-plan проектов, цены от застройщиков, беспроцентная рассрочка. Высокий ROI для инвесторов.",
        heading: "Новостройки",
        subtitle: "Эксклюзивные предложения от топовых застройщиков ОАЭ.",
        seoText: "Покупка недвижимости на стадии строительства (Off-plan) — это один из самых надежных инструментов для получения максимальной доходности в Дубае. Прирост стоимости актива к моменту сдачи объекта может составлять от 20% до 50%. Мы предоставляем нашим клиентам эксклюзивный доступ к закрытым пресейлам (pre-sales), где вы сможете выбрать лучшие планировки до их официального выхода на рынок. Все средства инвесторов надежно защищены государством на эскроу-счетах."
    },
    secondary: {
        title: "Вторичное жилье в Дубае | Купить готовую квартиру и апартаменты",
        description: "Готовая недвижимость в Дубае (вторичный рынок). Каталог ликвидных апартаментов и вилл, готовых к заселению. Полная юридическая проверка титула.",
        heading: "Вторичное жилье",
        subtitle: "Готовые объекты с полной юридической проверкой для заселения.",
        seoText: "Вторичный рынок недвижимости Дубая идеально подходит для инвесторов, желающих получать пассивный доход сразу после покупки, а также для тех, кто планирует быстрый переезд по программе резидентской визы (Golden Visa). Наши юристы проводят глубокий аудит каждого объекта, проверяют историю переходов права собственности (Title Deed) и обеспечивают кристальную чистоту сделки в Земельном департаменте Дубая (DLD)."
    },
    villas: {
        title: "Купить элитную виллу в Дубае | Таунхаусы премиум-класса",
        description: "Элитные виллы и таунхаусы в лучших районах Дубая: Palm Jumeirah, Dubai Hills, District One. Подобрать дом для комфортной жизни и инвестиций.",
        heading: "Виллы и Таунхаусы",
        subtitle: "Премиальные резиденции для вашей семьи.",
        seoText: "Рынок роскошных вилл и таунхаусов в Дубае переживает беспрецедентный бум. Элитные комьюнити, такие как Palm Jumeirah, Dubai Hills Estate и Emirates Hills, предлагают непревзойденный уровень приватности, безопасности и доступа к инфраструктуре мирового класса. Мы помогаем подобрать идеальный дом с учетом расположения международных школ, гольф-полей и транспортной доступности."
    },
    commercial: {
        title: "Коммерческая недвижимость в Дубае | Купить офис и торговые площади",
        description: "Инвестиции в коммерческую недвижимость ОАЭ. Продажа и аренда офисов, ритейла и складов в Business Bay, DIFC и других деловых центрах.",
        heading: "Коммерческая недвижимость",
        subtitle: "Офисы, ритейл и склады в лучших деловых районах Дубая.",
        seoText: "Коммерческая недвижимость в деловых центрах Дубая (таких как Business Bay, DIFC, JLT) демонстрирует стабильно высокую доходность от аренды (до 8-12% годовых). Мы предлагаем премиальные офисные пространства, торговые площади (ритейл) и готовые бизнес-центры, которые привлекают крупные международные корпорации."
    },
    invest: {
        title: "Инвестиции в недвижимость Дубая | Высокий ROI и пассивный доход",
        description: "Инвестиционные пакеты недвижимости в ОАЭ от 300,000$. Стратегии Flip, сдача в аренду, капитализация. Профессиональное управление активами.",
        heading: "Инвестиционные пакеты",
        subtitle: "Высокодоходные активы с гарантированным ROI.",
        seoText: "Грамотно сформированный портфель недвижимости в Дубае позволяет не только сохранить капитал, но и диверсифицировать доходы за счет привязки к стабильной валюте. Наша стратегия включает покупку недооцененных активов, спекулятивные сделки (Flip-стратегии) и приобретение объектов с гарантированным долгосрочным арендным доходом."
    },
    plots: {
        title: "Участки под застройку в Дубае | Купить землю",
        description: "Земля в престижных локациях Дубая для частного строительства или девелоперских проектов. Полное сопровождение сделки.",
        heading: "Участки под застройку",
        subtitle: "Земля в престижных локациях для девелоперских проектов.",
        seoText: "Приобретение земельного участка в Дубае — это редкая возможность создать премиальный проект по индивидуальному дизайну или реализовать прибыльный девелоперский проект. Мы предлагаем эксклюзивные участки на Pearl Jumeirah, La Mer, Dubai Hills и Palm Jebel Ali."
    },
    apartments_rent: {
        title: "Аренда элитных апартаментов в Дубае | Долгосрочная аренда",
        description: "Снять квартиру или апартаменты премиум-класса в Дубае. Долгосрочная аренда в Dubai Marina, Downtown, Palm Jumeirah.",
        heading: "Аренда апартаментов",
        subtitle: "Долгосрочная аренда в премиальных локациях.",
        seoText: "Мы предоставляем полный спектр услуг по подбору элитной недвижимости для долгосрочной аренды. Наши брокеры организуют просмотры, помогут согласовать оптимальные условия контракта с арендодателем (Tenancy Contract) и возьмут на себя регистрацию договора в системе Ejari."
    },
    valuation: {
        title: "Оценка стоимости недвижимости в Дубае | Узнать цену онлайн",
        description: "Профессиональная оценка стоимости квартир и вилл в Дубае. Актуальная аналитика рынка, данные Земельного департамента (DLD) за 24 часа.",
        heading: "Оценка вашей недвижимости",
        subtitle: "Наши аналитики подготовят точный отчет о рыночной стоимости вашего актива на основе актуальных транзакций Земельного Департамента Дубая."
    },
    blog: {
        title: "Блог о недвижимости Дубая | Аналитика рынка ОАЭ 2026",
        description: "Свежие новости рынка недвижимости ОАЭ, аналитика цен, прогнозы на 2026 год. Советы инвесторам: как получить визу, ипотеку и платить налоги."
    }
};

// --- ДАННЫЕ СТАТЕЙ БЛОГА (SEO ОПТИМИЗИРОВАННЫЕ) ---
const blogPosts = [
    {
        id: "dubai-market-2026",
        title: "Рынок недвижимости Дубая 2026: прогнозы и новые тренды",
        date: "14 Октября, 2025",
        readTime: "5 мин",
        img: "https://images.unsplash.com/photo-1518684079-3c830dcef090?auto=format&fit=crop&q=80&w=1200",
        alt: "Панорама рынка недвижимости Дубая",
        excerpt: "Подробный разбор тенденций рынка недвижимости ОАЭ, изменения в законодательстве и новые инвестиционные зоны, которые покажут наибольший рост.",
        content: `
            <p>Рынок недвижимости Дубая продолжает демонстрировать феноменальную устойчивость, привлекая капиталы со всего мира. Вступая в 2026 год, инвесторы задаются главным вопросом: сохранится ли двузначный рост или рынок перейдет в фазу стабилизации? В этом аналитическом обзоре от экспертов Alpha Star Properties мы разберем ключевые тренды и зоны с максимальным потенциалом доходности (ROI).</p>
            
            <h3>Смещение фокуса на Ultra-Luxury и брендированные резиденции</h3>
            <p>Спрос на <strong>элитную недвижимость в Дубае</strong> со стороны HNWI (High Net Worth Individuals) бьет абсолютные исторические рекорды. Проекты от таких мировых брендов, как Cavalli, Bulgari, Baccarat и Mercedes-Benz, распродаются на стадии закрытых пресейлов. Это обеспечивает первичным инвесторам прирост капитала от 30% до 50% еще до сдачи объекта в эксплуатацию.</p>
            
            <h3>Какие районы покажут максимальный ROI в 2026 году?</h3>
            <p>Классические локации, такие как Downtown Dubai и Palm Jumeirah, остаются надежным инструментом сохранения средств, однако для максимизации прибыли стоит обратить внимание на развивающиеся кластеры:</p>
            <ul>
                <li><strong>Dubai Maritime City и Rashid Yachts & Marina:</strong> Новые прибрежные районы с огромным потенциалом для сдачи в краткосрочную аренду (Holiday Homes). Строительство новой марины привлекает яхтсменов и состоятельных туристов.</li>
                <li><strong>Dubai South и JVC:</strong> Безоговорочные лидеры по доходности от долгосрочной аренды (в среднем 7.5% – 9.5% годовых). Развитие инфраструктуры вокруг нового аэропорта Al Maktoum делает инвестиции сюда максимально надежными.</li>
                <li><strong>Palm Jebel Ali:</strong> Флагманский мегапроект правительства. Цены на старте продаж значительно ниже, чем на классической Palm Jumeirah, что гарантирует высокую капитализацию в горизонте 3-5 лет.</li>
            </ul>

            <h3>Off-plan против вторичного рынка: что выбрать?</h3>
            <p>Покупка <strong>новостройки Дубая от застройщика (Off-plan)</strong> остается самым привлекательным инструментом за счет беспроцентной рассрочки, которая позволяет оплачивать от 40% до 60% стоимости уже после получения ключей. Все средства инвесторов надежно защищены государством на эскроу-счетах.</p>
            <p>С другой стороны, вторичный рынок предлагает мгновенную генерацию пассивного дохода и возможность получения долгосрочной резидентской визы ОАЭ сразу после переоформления титула.</p>

            <div class="bg-[#f9f9f9] p-8 border-l-4 border-[#C5A059] mt-10">
                <p class="font-playfair italic text-lg m-0 text-gray-700">Инвестиции в недвижимость ОАЭ требуют глубокого анализа и доступа к инсайдерской информации. Запишитесь на консультацию к экспертам Private Office Alpha Star Properties для разработки вашей индивидуальной инвестиционной стратегии.</p>
            </div>
        `
    },
    {
        id: "golden-visa-uae",
        title: "Как получить Golden Visa (Золотую визу) инвестору в ОАЭ",
        date: "28 Сентября, 2025",
        readTime: "4 мин",
        img: "https://images.unsplash.com/photo-1549944850-84e00be4203b?auto=format&fit=crop&q=80&w=1200",
        alt: "Резидентская виза ОАЭ за инвестиции",
        excerpt: "Пошаговая инструкция по получению Золотой визы в Дубае за инвестиции в недвижимость. Условия, преимущества и новые правила 2026 года.",
        content: `
            <p>Объединенные Арабские Эмираты — это не только одна из самых привлекательных безналоговых гаваней, но и один из самых безопасных мировых хабов. Государственная программа <strong>Golden Visa (Золотая виза)</strong> сроком на 10 лет стала главным магнитом для международных инвесторов и предпринимателей. Разбираем актуальные правила и условия получения визы в 2026 году.</p>
            
            <h3>Главные преимущества Золотой визы ОАЭ</h3>
            <p>Получив статус долгосрочного резидента Эмиратов, вы открываете для себя и своей семьи доступ к премиальному уровню жизни. Основные привилегии включают:</p>
            <ul>
                <li><strong>Долгосрочная безопасность:</strong> Проживание в стране в течение 10 лет с автоматическим правом продления.</li>
                <li><strong>Спонсирование семьи:</strong> Возможность оформить визы для супруга(и) и детей любого возраста, а также для домашнего персонала без ограничений по количеству.</li>
                <li><strong>Свобода передвижений:</strong> В отличие от стандартных виз, владельцам Golden Visa не нужно приезжать в ОАЭ каждые 6 месяцев, чтобы статус оставался активным.</li>
                <li><strong>Финансовая свобода:</strong> Доступ к открытию личных и корпоративных счетов в надежных банках ОАЭ, 0% налога на доходы физических лиц.</li>
            </ul>

            <h3>Условия получения через инвестиции в недвижимость</h3>
            <p>Правительство Дубая (через DLD - Земельный департамент) максимально упростило требования для инвесторов. Главное условие — необходимо <strong>купить недвижимость в Дубае</strong> на общую сумму не менее <strong>2 000 000 дирхамов</strong> (около $545,000). Важные нюансы, о которых нужно знать:</p>
            <ul>
                <li><strong>Объекты Off-plan:</strong> Вы можете получить визу даже при покупке строящегося жилья. Главное условие — проект должен возводиться девелопером, одобренным правительством.</li>
                <li><strong>Использование ипотеки:</strong> Приобретение в ипотеку допускается. Однако ваш собственный выплаченный капитал (первоначальный взнос) должен составлять не менее 2 млн AED, либо банк должен предоставить специальное письмо об отсутствии возражений (NOC).</li>
                <li><strong>Объединение активов:</strong> Если у вас есть несколько объектов недвижимости (например, две квартиры по 1 млн AED), их стоимость суммируется для достижения нужного порога.</li>
            </ul>

            <h3>Процесс оформления под ключ</h3>
            <p>Стандартный процесс подачи заявления включает прохождение медицинской комиссии, получение Emirates ID и подачу документов в Федеральное управление по вопросам идентификации (ICA). Это может занять от нескольких недель до месяца, если заниматься этим самостоятельно.</p>
            
            <p><strong>Alpha Star Properties</strong> предоставляет VIP-сервис. Наш юридический департамент берет на себя 100% забот по оформлению Golden Visa для инвестора и его семьи: от сбора документов до трансфера на премиальном авто в VIP-центр прохождения медкомиссии. Ваша главная задача — выбрать идеальный инвестиционный объект, а бюрократию мы оставим себе.</p>
        `
    }
];

// --- ДАННЫЕ И МИНИ-КОМПОНЕНТЫ ---
const mockProperties = [
    { id: 1, type: 'novostroyki', beds: 1, title: 'Emaar Beachfront Residence', price: '1,500,000', location: 'Dubai Harbour', img: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&q=80&w=800', alt: 'Роскошные апартаменты с 1 спальней Emaar Beachfront в Дубае' },
    { id: 2, type: 'novostroyki', beds: 2, title: 'Cavalli Couture', price: '2,800,000', location: 'Dubai Water Canal', img: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=800', alt: 'Элитная новостройка Cavalli Couture интерьер 2 спальни' },
    { id: 3, type: 'villas', beds: 3, title: 'District One Villa', price: '5,500,000', location: 'MBR City', img: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&q=80&w=800', alt: 'Купить виллу с 3 спальнями в District One Дубай' },
    { id: 4, type: 'secondary', beds: 1, title: 'Downtown Views', price: '950,000', location: 'Downtown Dubai', img: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=800', alt: 'Вторичное жилье апартаменты с видом на Бурдж Халифа' },
    { id: 5, type: 'commercial', beds: 0, title: 'Business Bay Office', price: '3,200,000', location: 'Business Bay', img: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=800', alt: 'Коммерческая недвижимость Дубай офис в Business Bay' },
    { id: 6, type: 'invest', beds: 2, title: 'High ROI Apartment', price: '1,100,000', location: 'JVC', img: 'https://images.unsplash.com/photo-1554995207-c18c203602cb?auto=format&fit=crop&q=80&w=800', alt: 'Инвестиционные апартаменты в JVC с высокой доходностью' },
    { id: 7, type: 'plots', beds: 0, title: 'Pearl Jumeirah Plot', price: '12,500,000', location: 'Pearl Jumeirah', img: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80&w=800', alt: 'Земельный участок Pearl Jumeirah Дубай' }
];

const steps = [
    { icon: Search, title: "Глубокий анализ", desc: "Анализируем лоты по 54 параметрам ликвидности до их выхода в паблик." },
    { icon: ShieldCheck, title: "Юридический аудит", desc: "Проверяем застройщика, эскроу-счета и чистоту титула собственности." },
    { icon: FileCheck, title: "Сопровождение", desc: "Личное присутствие на сделке, регистрация в DLD и управление активами." },
    { icon: Key, title: "Выход из сделки", desc: "Стратегия перепродажи или сдачи в аренду с гарантированной доходностью." }
];

const caseStudies = [
    { roi: '120-200%', location: 'Bluewaters Island', title: 'BLUEWATERS RESIDENCES', project: '1 BEDROOM (РАЙОН)', launch: '1.9М — 2.2М AED', now: '4.7М — 6.8М AED' },
    { roi: '60-70%', location: 'Dubai Hills Estate', title: 'ELLINGTON HOUSE', project: '3 BEDROOM (ПРОЕКТ)', launch: '3.3М — 4.0М AED', now: '5.5М — 6.5М AED' },
    { roi: '90-120%', location: 'Emaar Beachfront', title: 'BEACH ISLE', project: '3 BEDROOM (ПРОЕКТ)', launch: '4.5М AED', now: '8.5М — 10.3М AED' },
    { roi: '70%', location: 'JVC', title: 'BINGHATTI CORNER', project: '1 BEDROOM (ПРОЕКТ)', launch: '600,000 AED', now: '1М AED' }
];

const testimonials = [
    { name: "Александр В.", role: "Инвестор", initial: "А", text: "Сотрудничество с Alpha Star превзошло все ожидания. Мы зашли в проект на стадии ланча, и уже через год капитализация составила 45%. Отдельное спасибо за безупречное юридическое сопровождение." },
    { name: "Елена С.", role: "Предприниматель", initial: "Е", text: "Для меня была критична полная конфиденциальность. Команда работает по высшим стандартам Private Banking. Подобрали виллу off-market, закрыли сделку за 3 дня без лишней бюрократии." },
    { name: "Михаил Д.", role: "CEO", initial: "М", text: "Лучшая экспертиза на рынке Дубая. Показали реальные цифры, отговорили от покупки переоцененного объекта и предложили альтернативу, которая уже приносит стабильные 12% годовых." },
    { name: "Сергей К.", role: "Частный инвестор", initial: "С", text: "Закрыли сделку удаленно за 4 дня. Полная прозрачность на каждом этапе, отличный выбор закрытых объектов, до которых не добраться с улицы." },
    { name: "Мария Т.", role: "Архитектор", initial: "М", text: "Искали виллу для жизни с особыми требованиями к дизайну и локации. Команда Alpha Star нашла идеальный вариант на Palm Jumeirah." },
    { name: "Виктор Р.", role: "Учредитель", initial: "В", text: "Продали наш актив на пике цены с доходностью 60% за два года. Очень четкая аналитика и понимание трендов рынка. Рекомендую как надежного партнера." }
];

const faqs = [
    { question: "Можно ли купить недвижимость удаленно?", answer: "Да, более 70% сделок проводятся удаленно через цифровую платформу DLD (Земельный Департамент) и нотариальные доверенности. Мы полностью берем на себя взаимодействие с застройщиком и государственными органами ОАЭ." },
    { question: "Какие налоги на недвижимость существуют в Дубае?", answer: "Налог на владение недвижимостью, а также налог на доход от сдачи в аренду или прирост капитала составляет 0%. Разовый сбор при регистрации права собственности (Title Deed) в DLD составляет 4% от стоимости объекта." },
    { question: "Что такое резидентская виза (Golden Visa)?", answer: "«Золотая виза» на 10 лет выдается инвесторам при покупке недвижимости на сумму от 2 млн дирхамов (около $545,000). Она дает право на долгосрочное проживание, работу, открытие банковских счетов и спонсирование членов семьи." },
    { question: "Как получить ипотеку нерезиденту в ОАЭ?", answer: "Банки ОАЭ кредитуют нерезидентов. Первоначальный взнос (Down payment) обычно составляет от 40% до 50%. Процентная ставка варьируется от 4.5% до 5.5% годовых. Наша команда ипотечных брокеров поможет собрать документы и получить одобрение." }
];

const ScrollToTop = () => {
    const { pathname } = useLocation();
    useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
    return null;
};

const PremiumButton = ({ children, variant = 'primary', className = '', onClick }) => (
    <button 
        type="button"
        onClick={onClick} 
        className={`btn-premium font-bold uppercase tracking-widest ${variant === 'primary' ? 'bg-[#C5A059] text-white shadow-lg' : 'bg-transparent border border-gray-200 text-[#121212] hover:bg-gray-50'} ${className}`}
    >
        <span className="relative z-10 flex items-center justify-center gap-2">{children}</span>
    </button>
);

const SectionHeading = ({ top, main, light = false }) => (
    <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }} className={`text-center mb-16 ${light ? 'text-white' : 'text-[#121212]'}`}>
        {top && <h2 className="text-[10px] gold-text uppercase tracking-[0.5em] font-bold font-montserrat mb-4">{top}</h2>}
        <h3 className="font-playfair text-4xl italic">{main}</h3>
    </motion.div>
);

const MortgageInfo = () => (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="bg-[#121212] p-8 md:p-12 rounded-sm shadow-2xl mb-16 flex flex-col md:flex-row items-center justify-between gap-8 border border-[#C5A059]/20">
        <div className="text-left flex-1">
            <h3 className="font-playfair text-3xl italic mb-4 gold-text">Ипотека для нерезидентов в ОАЭ</h3>
            <p className="text-white/60 text-sm leading-relaxed max-w-3xl font-raleway">
                Официальное финансирование до 50% от стоимости объекта. Процентная ставка от 4.5% годовых. Минимальный пакет документов. Мы полностью берем на себя процесс одобрения кредита (Mortgage Approval) в ведущих банках Дубая (Emirates NBD, FAB, ADCB).
            </p>
        </div>
        <button type="button" className="btn-premium bg-[#C5A059] text-white px-12 py-4 text-[10px] font-bold uppercase tracking-widest whitespace-nowrap">Рассчитать ипотеку</button>
    </motion.div>
);

const FAQItem = ({ question, answer }) => {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <div className="border-b border-gray-100 last:border-0" itemScope itemProp="mainEntity" itemType="https://schema.org/Question">
            <button type="button" onClick={() => setIsOpen(!isOpen)} className="w-full py-6 flex items-center justify-between text-left group outline-none">
                <span itemProp="name" className="font-montserrat font-bold text-sm uppercase tracking-wider group-hover:text-[#C5A059] transition-colors">{question}</span>
                <ChevronDown className={`w-4 h-4 text-gray-300 transition-transform duration-500 ${isOpen ? 'rotate-180' : ''}`} />
            </button>
            <AnimatePresence>
                {isOpen && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.4 }} className="overflow-hidden" itemScope itemProp="acceptedAnswer" itemType="https://schema.org/Answer">
                        <p itemProp="text" className="pb-6 text-gray-400 text-sm leading-relaxed">{answer}</p>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

const LeadForm = ({ title, subtitle, isModal = false }) => {
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [selectedGoal, setSelectedGoal] = useState('Выберите цель');

    return (
        <div className={`relative bg-white shadow-2xl overflow-visible ${isModal ? 'p-8 md:p-14 rounded-sm' : 'max-w-4xl mx-auto px-8 md:px-16 py-12 border border-gray-100'}`}>
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-1 gold-bg opacity-30"></div>
            <div className="text-center mb-8">
                <h2 className="font-montserrat text-2xl md:text-4xl uppercase tracking-[0.3em] font-bold mb-3 text-[#121212]">{title}</h2>
                <p className="font-playfair italic text-base text-gray-400">{subtitle}</p>
            </div>
            <form className="grid md:grid-cols-2 gap-5 text-left" onSubmit={e => e.preventDefault()}>
                <div className="space-y-2 font-montserrat"><label className="text-[10px] uppercase tracking-[0.2em] font-bold opacity-30 ml-1">Ваше имя</label><input type="text" className="w-full p-4 bg-gray-50 border border-gray-100 focus:border-[#C5A059] outline-none font-bold text-sm transition-all duration-300 focus:bg-white focus:shadow-md" placeholder="Иван Иванов" /></div>
                <div className="space-y-2 font-montserrat"><label className="text-[10px] uppercase tracking-[0.2em] font-bold opacity-30 ml-1">Номер телефона</label><input type="tel" className="w-full p-4 bg-gray-50 border border-gray-100 focus:border-[#C5A059] outline-none font-bold text-sm transition-all duration-300 focus:bg-white focus:shadow-md" placeholder="+7 / +971" /></div>
                <div className="md:col-span-2 space-y-2 font-montserrat relative">
                    <label className="text-[10px] uppercase tracking-[0.2em] font-bold opacity-30 ml-1 mb-2 block">Цель запроса</label>
                    <div className="relative">
                        <div className={`w-full p-4 bg-gray-50 border cursor-pointer transition-all duration-300 flex items-center justify-between ${dropdownOpen ? 'border-[#C5A059] bg-white shadow-md' : 'border-gray-100 hover:border-gray-300'}`} onClick={() => setDropdownOpen(!dropdownOpen)}>
                            <span className={`text-sm font-bold transition-colors ${selectedGoal !== 'Выберите цель' ? 'text-[#121212]' : 'text-gray-400'}`}>{selectedGoal}</span>
                            <ChevronDown className={`w-5 h-5 text-[#C5A059] transition-transform duration-500 ${dropdownOpen ? 'rotate-180' : ''}`} />
                        </div>
                        <AnimatePresence>
                            {dropdownOpen && (
                                <motion.div initial={{ opacity: 0, y: -10, scaleY: 0.95 }} animate={{ opacity: 1, y: 0, scaleY: 1 }} exit={{ opacity: 0, y: -10, scaleY: 0.95 }} transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }} className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-100 shadow-2xl z-[100] origin-top rounded-sm overflow-hidden">
                                    {['Переезд / Релокация', 'Инвестиции', 'Управление недвижимостью'].map(item => (
                                        <div key={item} onClick={() => { setSelectedGoal(item); setDropdownOpen(false); }} className="p-4 border-b border-gray-50 hover:bg-gray-50 cursor-pointer text-sm font-bold text-[#121212] transition-colors flex items-center justify-between group">
                                            <span className="group-hover:text-[#C5A059] transition-colors">{item}</span>
                                            {selectedGoal === item && <div className="w-2 h-2 rounded-full bg-[#C5A059]"></div>}
                                        </div>
                                    ))}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
                <div className="md:col-span-2 flex justify-center mt-4">
                    <button type="submit" className="btn-premium w-full md:w-3/4 py-6 bg-[#C5A059] text-white font-montserrat uppercase tracking-widest font-bold shadow-lg">Отправить заявку</button>
                </div>
            </form>
        </div>
    );
};

const ContactModal = ({ isOpen, onClose }) => {
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
                        className="relative w-full max-w-2xl m-auto"
                        onClick={e => e.stopPropagation()}
                    >
                        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-[#C5A059] transition-colors z-[60] bg-gray-50 rounded-full p-2 shadow-sm">
                            <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6L6 18M6 6l12 12"/></svg>
                        </button>
                        <LeadForm title="Связаться с нами" subtitle="Оставьте заявку, и наш эксперт свяжется с вами в течение 15 минут для проведения консультации" isModal={true} />
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

const InvestmentCalculator = () => {
    const [amount, setAmount] = useState(300000);
    const [strategy, setStrategy] = useState('offplan');
    const strategies = { 
        offplan: { roi: 0.35, term: '18 мес' }, 
        rental: { roi: 0.12, term: '1 год' }, 
        flip: { roi: 0.18, term: '8 мес' } 
    };
    const config = strategies[strategy];
    const profit = Math.round(amount * config.roi);
    const percent = ((amount - 300000) / (2000000 - 300000)) * 100;
    const bgStyle = { background: `linear-gradient(90deg, #A67C37 0%, #C5A059 ${percent}%, #f1f1f1 ${percent}%, #f1f1f1 100%)` };

    return (
        <div className="bg-white border border-gray-100 shadow-2xl overflow-hidden rounded-sm flex flex-col lg:flex-row text-left">
            <div className="lg:w-3/5 p-8 lg:p-16 text-left">
                <h4 className="font-montserrat text-[10px] gold-text uppercase font-bold tracking-[0.4em] mb-4">Расчет прибыли</h4>
                <h3 className="font-playfair text-3xl mb-8">Рассчитайте параметры успеха</h3>
                <div className="space-y-10 text-left">
                    <div className="space-y-4">
                        <div className="flex justify-between items-center">
                            <label className="text-[11px] uppercase font-bold text-gray-400 tracking-widest">Инвестиции ($)</label>
                            <span className="text-2xl font-montserrat font-bold">${Number(amount).toLocaleString()}</span>
                        </div>
                        <input type="range" min="300000" max="2000000" step="50000" value={amount} onChange={(e) => setAmount(e.target.value)} style={bgStyle} className="w-full" />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {Object.keys(strategies).map(s => (
                            <button type="button" key={s} onClick={() => setStrategy(s)} className={`p-4 border rounded-sm text-[10px] font-bold uppercase tracking-widest transition-all ${strategy === s ? 'bg-black text-white border-black' : 'bg-white text-gray-400 hover:border-gray-200'}`}>
                                {s === 'offplan' ? 'Off-plan' : s === 'rental' ? 'Аренда' : 'Flip'}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
            <div className="lg:w-2/5 bg-[#121212] p-8 lg:p-16 text-white flex flex-col justify-between">
                <div className="text-left">
                    <p className="text-[10px] uppercase font-bold text-white/40 tracking-[0.3em] mb-4">ROI (Прогноз)</p>
                    <p className="text-6xl font-montserrat font-bold gold-text leading-none transition-all duration-700">{(config.roi * 100).toFixed(0)}%</p>
                </div>
                <div className="space-y-4 pt-8 border-t border-white/10 text-left">
                    <div className="flex justify-between items-center">
                        <span className="text-white/40 text-[11px] uppercase font-bold tracking-widest">Прибыль</span>
                        <span className="text-xl font-bold transition-all duration-700">${profit.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-white/40 text-[11px] uppercase font-bold tracking-widest">Срок</span>
                        <span className="text-xl font-bold transition-all duration-700">{config.term}</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

const HeroSlider = () => {
    const [current, setCurrent] = useState(0);
    const images = [
        { src: 'https://images.unsplash.com/photo-1518684079-3c830dcef090?auto=format&fit=crop&q=80&w=2000', alt: 'Элитная недвижимость в Дубае: панорамный вид' },
        { src: 'https://images.unsplash.com/photo-1549944850-84e00be4203b?auto=format&fit=crop&q=80&w=2000', alt: 'Роскошная вилла в Дубае с бассейном' },
        { src: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=2000', alt: 'Премиальный интерьер апартаментов Дубай Марина' }
    ];
    useEffect(() => {
        const timer = setInterval(() => setCurrent(c => (c + 1) % images.length), 6000);
        return () => clearInterval(timer);
    }, []);
    return (
        <div className="absolute inset-0 z-0">
            <div className="absolute inset-0 bg-black/60 z-10"></div>
            {images.map((img, i) => (
                <img key={i} src={img.src} alt={img.alt} className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${i === current ? 'opacity-100' : 'opacity-0'}`} />
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

const Preloader = ({ onFinish }) => {
    const [phase, setPhase] = useState(0);
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        const t1 = setTimeout(() => setPhase(1), 100);
        const t2 = setTimeout(() => setPhase(2), 900);
        const t3 = setTimeout(() => setIsVisible(false), 2400); 
        const t4 = setTimeout(() => onFinish(), 3400); 
        return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); clearTimeout(t4); };
    }, [onFinish]);

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div 
                    initial={{ y: 0 }}
                    exit={{ y: "-100%", transition: { duration: 1, ease: [0.82, 0, 0.18, 1] } }}
                    className="fixed inset-0 z-[9999] bg-[#0A0A0A] flex items-center justify-center"
                >
                    <motion.div 
                        exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.4 } }}
                        className="relative z-10 text-center px-10 flex flex-col items-center"
                    >
                        <div className="font-playfair text-3xl md:text-5xl font-bold uppercase text-white tracking-[0.4em] mb-2 flex justify-center overflow-hidden">
                            {"ALPHASTAR".split('').map((char, i) => (
                                <motion.span 
                                    key={i} 
                                    initial={{ opacity: 0, filter: 'blur(12px)', y: 40, rotateX: -90 }}
                                    animate={phase >= 1 ? { opacity: 1, filter: 'blur(0px)', y: 0, rotateX: 0 } : {}}
                                    transition={{ duration: 0.8, delay: i * 0.08, ease: [0.19, 1, 0.22, 1] }}
                                    className={`inline-block ${i > 4 ? 'text-[#C5A059]' : ''}`}
                                    style={{ transformOrigin: "bottom" }}
                                >
                                    {char}
                                </motion.span>
                            ))}
                        </div>
                        
                        <motion.div 
                            initial={{ width: 0, opacity: 0 }}
                            animate={phase >= 2 ? { width: '180px', opacity: 1 } : {}}
                            transition={{ duration: 1, ease: [0.65, 0, 0.35, 1] }}
                            className="h-px mx-auto mt-6"
                            style={{ background: 'linear-gradient(90deg, transparent, #C5A059, transparent)', boxShadow: '0 0 15px rgba(197, 160, 89, 0.4)' }}
                        />
                        
                        <motion.div 
                            initial={{ opacity: 0, y: 10 }}
                            animate={phase >= 2 ? { opacity: 1, y: 0 } : {}}
                            transition={{ duration: 1 }}
                            className="text-[8px] tracking-[2.5em] ml-3 text-white/30 mt-8 uppercase font-bold"
                        >
                            Properties
                        </motion.div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

// --- WRAPPER FOR PAGE TRANSITIONS ---
const PageWrapper = ({ children }) => (
    <motion.div
        initial={{ opacity: 0, filter: 'blur(8px)', y: 15 }}
        animate={{ opacity: 1, filter: 'blur(0px)', y: 0 }}
        exit={{ opacity: 0, filter: 'blur(8px)', y: -15 }}
        transition={{ duration: 0.4, ease: "easeInOut" }}
        className="w-full"
    >
        {children}
    </motion.div>
);

// --- PAGES ---
const ListingPage = ({ category, onOpenModal }) => {
    const navigate = useNavigate();
    const [activeBed, setActiveBed] = useState('all');
    let items = mockProperties.filter(p => category === 'all' || p.type === category || (category === 'villas' && p.type === 'villas'));
    if (activeBed !== 'all') items = items.filter(p => p.beds === Number(activeBed));

    const seo = seoData[category] || seoData.novostroyki;
    const showBeds = category !== 'commercial' && category !== 'invest' && category !== 'plots' && category !== 'empty';
    const showValuationBtn = category === 'secondary' || category === 'apartments_rent';

    return (
        <div className="pt-40 pb-24 px-8 bg-[#FBFBFB] min-h-screen">
            <Helmet>
                <title>{seo.title}</title>
                <meta name="description" content={seo.description} />
            </Helmet>

            <div className="max-w-7xl mx-auto text-center">
                <h1 className="font-playfair text-5xl md:text-7xl italic mb-6 text-[#121212]">{seo.heading}</h1>
                <p className="max-w-2xl mx-auto text-gray-500 mb-10 text-lg">{seo.subtitle}</p>

                {seo.seoText && (
                    <div className="max-w-4xl mx-auto mb-16 text-left border-l-2 border-[#C5A059] pl-6">
                        <p className="text-gray-600 font-raleway leading-relaxed italic">{seo.seoText}</p>
                    </div>
                )}

                {showValuationBtn && (
                    <div className="flex justify-center mb-16">
                        <button type="button" onClick={() => navigate('/valuation')} className="btn-premium px-16 py-5 border border-[#C5A059] text-[#121212] font-bold uppercase tracking-widest hover:bg-[#C5A059] hover:text-white transition-colors">
                            Сколько стоит ваша недвижимость?
                        </button>
                    </div>
                )}

                {category !== 'plots' && category !== 'empty' && <MortgageInfo />}

                {showBeds && (
                    <div className="flex justify-center gap-4 mb-16">
                        {['all', '1', '2', '3'].map(bed => (
                            <button type="button" key={bed} onClick={() => setActiveBed(bed)} className={`px-8 py-3 text-[10px] uppercase font-bold border transition-all duration-300 ${activeBed === bed ? 'bg-[#121212] text-white border-[#121212]' : 'bg-white text-gray-400 border-gray-200 hover:border-[#C5A059]'}`}>
                                {bed === 'all' ? 'Все объекты' : `${bed} Bedroom`}
                            </button>
                        ))}
                    </div>
                )}

                <div className="grid md:grid-cols-3 gap-8">
                    <AnimatePresence mode="popLayout">
                        {items.map(item => (
                            <motion.div 
                                key={item.id} 
                                layout 
                                initial={{ opacity: 0, y: 30, scale: 0.98 }} 
                                animate={{ opacity: 1, y: 0, scale: 1 }} 
                                exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }} 
                                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }} 
                                className="bg-white shadow-xl hover:shadow-2xl transition-all duration-500 rounded-sm overflow-hidden text-left group flex flex-col"
                            >
                                <div className="aspect-video bg-gray-200 overflow-hidden relative">
                                    <img src={item.img} alt={item.alt} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                                    <div className="absolute top-4 left-4 bg-black/80 backdrop-blur-md px-3 py-1 text-white text-[9px] font-bold uppercase tracking-widest">${item.price}</div>
                                </div>
                                <div className="p-8 flex-grow flex flex-col justify-between">
                                    <div>
                                        <p className="text-gold uppercase tracking-widest text-[9px] font-bold mb-2">{item.location}</p>
                                        <h4 className="font-montserrat font-bold text-lg mb-6 text-[#121212]">{item.title}</h4>
                                    </div>
                                    <button type="button" onClick={onOpenModal} className="btn-premium w-full py-4 text-[10px] text-white bg-[#121212] font-bold uppercase tracking-widest mt-auto">Смотреть детали</button>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                    {items.length === 0 && <div className="col-span-3 py-20 text-gray-400 italic">По вашему запросу объектов не найдено.</div>}
                </div>
            </div>
        </div>
    );
};

const ValuationPage = () => {
    const seo = seoData.valuation;
    return (
        <div className="pt-40 pb-24 px-8 bg-[#121212] text-white min-h-screen flex items-center">
            <Helmet>
                <title>{seo.title}</title>
                <meta name="description" content={seo.description} />
            </Helmet>
            <div className="max-w-4xl mx-auto text-center w-full">
                <h1 className="font-playfair text-4xl md:text-6xl italic mb-6">{seo.heading}</h1>
                <p className="text-white/60 mb-16 text-lg font-raleway max-w-2xl mx-auto">{seo.subtitle}</p>
                
                <div className="bg-white/5 p-10 md:p-16 border border-white/10 text-left shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-[#C5A059] opacity-10 blur-[100px] pointer-events-none"></div>
                    <form className="space-y-8 relative z-10" onSubmit={e => e.preventDefault()}>
                        <div className="grid md:grid-cols-2 gap-8">
                            <div className="space-y-2"><label className="text-[10px] uppercase font-bold text-white/40 tracking-widest">Локация / Комплекс</label><input type="text" className="w-full bg-transparent border-b border-white/20 p-4 outline-none focus:border-[#C5A059] transition-colors" placeholder="Dubai Marina" /></div>
                            <div className="space-y-2"><label className="text-[10px] uppercase font-bold text-white/40 tracking-widest">Площадь (Sq.ft) / Спален</label><input type="text" className="w-full bg-transparent border-b border-white/20 p-4 outline-none focus:border-[#C5A059] transition-colors" placeholder="1200 sq.ft, 2 BR" /></div>
                            <div className="space-y-2"><label className="text-[10px] uppercase font-bold text-white/40 tracking-widest">Ваш Email</label><input type="email" className="w-full bg-transparent border-b border-white/20 p-4 outline-none focus:border-[#C5A059] transition-colors" placeholder="email@example.com" /></div>
                            <div className="space-y-2"><label className="text-[10px] uppercase font-bold text-white/40 tracking-widest">Телефон / WhatsApp</label><input type="tel" className="w-full bg-transparent border-b border-white/20 p-4 outline-none focus:border-[#C5A059] transition-colors" placeholder="+971 50..." /></div>
                        </div>
                        <div className="flex justify-center pt-8">
                            <button type="submit" className="btn-premium px-24 py-6 bg-[#C5A059] text-white uppercase font-bold text-[11px] tracking-widest shadow-2xl">Запросить оценку</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

const BlogPage = () => {
    const seo = seoData.blog;
    return (
        <div className="pt-40 pb-24 px-8 bg-white min-h-screen">
            <Helmet>
                <title>{seo.title}</title>
                <meta name="description" content={seo.description} />
            </Helmet>
            <div className="max-w-5xl mx-auto">
                <SectionHeading top="Insights & Analytics" main="Блог Alpha Star" />
                <div className="grid gap-20">
                    {blogPosts.map((post) => (
                        <div key={post.id} className="group grid md:grid-cols-2 gap-12 items-center border-b border-gray-100 pb-20">
                            <Link to={`/blog/${post.id}`} className="block aspect-[4/3] bg-gray-100 overflow-hidden shadow-lg">
                                <img src={post.img} alt={post.alt} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000" />
                            </Link>
                            <div className="text-left">
                                <div className="flex items-center gap-4 mb-4">
                                    <span className="gold-text font-bold text-[9px] uppercase tracking-widest block">Аналитика рынка</span>
                                    <span className="text-gray-400 flex items-center gap-1 text-[9px] uppercase font-bold tracking-widest"><Clock size={12} /> {post.readTime}</span>
                                </div>
                                <Link to={`/blog/${post.id}`} className="block">
                                    <h4 className="font-playfair text-3xl font-bold mb-6 italic group-hover:text-[#C5A059] transition-colors">{post.title}</h4>
                                </Link>
                                <p className="text-gray-500 mb-8 font-raleway leading-relaxed">{post.excerpt}</p>
                                <Link to={`/blog/${post.id}`} className="text-[#121212] border-b border-[#121212] pb-1 text-[10px] font-bold uppercase tracking-widest hover:text-[#C5A059] hover:border-[#C5A059] transition-colors inline-block">Читать статью</Link>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

const BlogPostPage = () => {
    const { id } = useParams();
    const post = blogPosts.find(p => p.id === id);

    if (!post) {
        return (
            <div className="pt-40 pb-24 text-center min-h-[60vh] flex flex-col items-center justify-center">
                <h1 className="font-playfair text-4xl mb-6">Статья не найдена</h1>
                <Link to="/blog" className="text-[#C5A059] border-b border-[#C5A059] pb-1 uppercase text-[10px] font-bold tracking-widest">Вернуться в блог</Link>
            </div>
        );
    }

    return (
        <div className="pt-32 pb-24 bg-white min-h-screen">
            <Helmet>
                <title>{post.title} | Блог Alpha Star</title>
                <meta name="description" content={post.excerpt} />
            </Helmet>

            <article className="max-w-4xl mx-auto px-8">
                <Link to="/blog" className="inline-flex items-center gap-2 text-gray-400 hover:text-[#C5A059] transition-colors mb-12 text-[10px] uppercase font-bold tracking-widest">
                    <ArrowLeft size={14} /> Назад к статьям
                </Link>

                <div className="mb-12">
                    <div className="flex items-center gap-6 mb-6 text-[10px] uppercase font-bold tracking-widest text-gray-400">
                        <span className="flex items-center gap-2 text-[#C5A059]"><Calendar size={14} /> {post.date}</span>
                        <span className="flex items-center gap-2"><Clock size={14} /> {post.readTime} чтения</span>
                    </div>
                    <h1 className="font-playfair text-4xl md:text-6xl font-bold leading-tight text-[#121212]">{post.title}</h1>
                </div>

                <div className="aspect-video w-full mb-16 overflow-hidden shadow-2xl">
                    <img src={post.img} alt={post.alt} className="w-full h-full object-cover" />
                </div>

                <div 
                    className="seo-article text-left"
                    dangerouslySetInnerHTML={{ __html: post.content }}
                />

                <div className="mt-20 pt-10 border-t border-gray-100 text-center">
                    <p className="font-montserrat text-lg font-bold mb-6">Готовы сделать шаг к успешным инвестициям?</p>
                    <Link to="/" onClick={() => setTimeout(() => document.getElementById('contact-form')?.scrollIntoView({behavior: 'smooth'}), 100)} className="btn-premium px-12 py-5 bg-[#121212] text-white uppercase text-[11px] tracking-widest font-bold">
                        Получить консультацию эксперта
                    </Link>
                </div>
            </article>
        </div>
    );
};

const HomePage = ({ isLoading, onOpenModal }) => {
    return (
        <div>
            <Helmet>
                <title>{seoData.home.title}</title>
                <meta name="description" content={seoData.home.description} />
            </Helmet>

            {/* 1. HERO */}
            <section className="relative h-screen flex items-center justify-center overflow-hidden bg-[#121212] text-white text-left">
                <HeroSlider /><StarField />
                <div className="relative z-30 w-full max-w-7xl px-8">
                    <div className="flex items-center gap-4 mb-4 justify-center md:justify-start">
                        <div className="w-12 h-px gold-bg"></div>
                        <span className="text-[10px] uppercase tracking-[0.5em] gold-text font-bold">Boutique Agency</span>
                    </div>
                    <h1 className="font-montserrat text-5xl md:text-8xl font-bold leading-tight mb-6 uppercase tracking-tight text-center md:text-left">
                        Ваш путь к <br />
                        <span className="relative inline-block mt-2">
                            <span className="font-playfair italic font-medium text-transparent bg-clip-text bg-gradient-to-r from-[#C5A059] via-[#E2C384] to-[#C5A059] drop-shadow-[0_4px_12px_rgba(197,160,89,0.3)]">Недвижимости</span>
                        </span>
                        <br /> в Дубае
                    </h1>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start mt-10">
                        <Link to="/buy/off-plan" className="btn-premium px-12 py-5 bg-[#C5A059] text-white text-[11px] font-bold uppercase tracking-[0.25em] text-center shadow-2xl">Каталог объектов</Link>
                        <button type="button" onClick={() => document.getElementById('guide-section').scrollIntoView({behavior:'smooth'})} className="btn-premium px-12 py-5 bg-white/10 backdrop-blur-md border border-white/20 text-white text-[11px] font-bold uppercase tracking-[0.25em] text-center hover:bg-black transition-all lining-nums">Аналитика 2026</button>
                    </div>
                </div>
            </section>

            {/* 2. О НАС */}
            <section id="about" className="py-24 bg-white px-8">
                <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
                    <div className="text-left">
                        <h2 className="text-[10px] font-bold uppercase tracking-[0.5em] gold-text mb-4 font-montserrat text-center md:text-left">Кто мы такие?</h2>
                        <h3 className="font-montserrat text-2xl md:text-4xl font-bold mb-6 leading-tight text-center md:text-left tracking-[0.3em] uppercase">ALPHASTAR PROPERTIES</h3>
                        <p className="text-gray-600 text-lg italic border-l-2 border-[#C5A059] pl-6 mb-8 leading-relaxed">«Мы превращаем недвижимость в инструмент сохранения и приумножения капитала в самом стремительно растущем рынке мира.»</p>
                        <p className="text-gray-400 mb-10 leading-relaxed font-medium">Наше адвокатское сопровождение строится по принципам частного семейного офиса: максимальная конфиденциальность, прямой доступ к off-market активам и контроль каждой стадии сделки.</p>
                        <div className="flex justify-center md:justify-start">
                            <button type="button" onClick={() => document.getElementById('strategy-section').scrollIntoView({behavior:'smooth'})} className="btn-premium px-24 md:px-48 py-5 border border-gray-200 text-[#121212] text-[11px] font-bold uppercase tracking-[0.25em] hover:bg-gray-50 transition-all">Наш подход</button>
                        </div>
                    </div>
                    <div className="relative">
                        <div className="hero-mask aspect-[4/5] overflow-hidden shadow-2xl">
                            <img src="https://images.unsplash.com/photo-1582672060674-bc2bd808a8b5?auto=format&fit=crop&q=80&w=800" alt="Архитектура Дубая премиум класс" className="w-full h-full object-cover" />
                        </div>
                        <div className="absolute -bottom-6 -left-6 w-48 h-48 bg-[#C5A059]/10 -z-10 rounded-full blur-3xl"></div>
                    </div>
                </div>
            </section>

            {/* 3. ДВА ВЕКТОРА */}
            <section id="strategy-section" className="py-24 bg-gray-50 px-8">
                <div className="max-w-7xl mx-auto">
                    <SectionHeading top="Наша стратегия" main="Два вектора успеха" />
                    <div className="grid lg:grid-cols-2 gap-8">
                        <div className="bg-white p-10 md:p-14 strategy-card relative overflow-hidden group text-left border border-gray-100">
                            <div className="relative z-10">
                                <Heart size={40} className="gold-text mb-6 opacity-40" />
                                <h3 className="font-montserrat text-2xl font-bold mb-4 text-[#121212]">Дом для вашей семьи</h3>
                                <p className="text-gray-500 mb-10 text-base leading-relaxed">Подбор районов от $300,000 с фокусом на инфраструктуру, лучшие школы и безопасность. Мы найдем место, которое вы назовете домом.</p>
                                <Link to="/buy/villas" className="btn-premium w-full py-4 text-[11px] font-bold uppercase tracking-widest border border-gray-200 hover:bg-black hover:text-white transition-all text-[#121212]">Подобрать локацию</Link>
                            </div>
                            <HomeIcon size={200} className="absolute -bottom-16 -right-16 text-[#121212]/[0.02] -rotate-12 group-hover:scale-110 transition-transform" />
                        </div>
                        <div className="bg-[#121212] p-10 md:p-14 strategy-card relative overflow-hidden group text-left">
                            <div className="relative z-10 text-white">
                                <TrendingUp size={40} className="gold-text mb-6 opacity-40" />
                                <h3 className="font-montserrat text-2xl font-bold mb-4 tracking-tight">Инвестиционный капитал</h3>
                                <p className="text-white/50 mb-10 text-base leading-relaxed font-light">Стратегии от $300,000. Формируем арендный доход и капитализацию объектов в самых ликвидных зонах Дубая.</p>
                                <Link to="/buy/invest" className="btn-premium w-full py-4 text-[11px] font-bold uppercase tracking-widest bg-[#C5A059] text-white hover:bg-[#b08d4a] transition-all">Инвест-пакеты</Link>
                            </div>
                            <Coins size={200} className="absolute -bottom-16 -right-16 text-white/[0.03] -rotate-12 group-hover:scale-110 transition-transform" />
                        </div>
                    </div>
                </div>
            </section>

            {/* 4. КОНТРОЛЬ НА КАЖДОМ ЭТАПЕ */}
            <section id="process" className="py-24 bg-[#121212] text-white px-8">
                <div className="max-w-7xl mx-auto">
                    <SectionHeading top="План работы" main="Контроль на каждом этапе" light={true} />
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {steps.map((step, i) => {
                            const Icon = step.icon;
                            return (
                                <div key={i} className="bg-white/5 border border-white/10 p-10 rounded-sm relative group overflow-hidden text-left control-card">
                                    <div className="absolute top-0 right-0 p-4 text-white/5 font-montserrat font-bold text-6xl leading-none">0{i+1}</div>
                                    <div className="gold-text mb-6 relative z-10"><Icon size={28} /></div>
                                    <h4 className="font-montserrat font-bold text-sm uppercase mb-4 tracking-widest relative z-10">{step.title}</h4>
                                    <p className="text-white/40 text-sm leading-relaxed relative z-10 font-medium">{step.desc}</p>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* 5. ОБНОВЛЕННЫЕ КЕЙСЫ ДОСЬЕ */}
            <section id="real-deals" className="py-32 bg-[#FBFBFB] px-8 overflow-hidden text-left">
                <div className="max-w-7xl mx-auto">
                    <div className="mb-24 text-center">
                        <h3 className="font-playfair text-4xl md:text-6xl italic tracking-tighter uppercase font-bold text-[#121212]">Реальные сделки</h3>
                    </div>
                    
                    <div className="space-y-12">
                        {caseStudies.map((item, i) => (
                            <div key={i} className="bg-white shadow-[0_10px_40px_rgba(0,0,0,0.03)] hover:shadow-[0_20px_60px_rgba(197,160,89,0.12)] transition-all duration-700 group border border-gray-50 flex flex-col md:flex-row overflow-hidden hover:-translate-y-1">
                                <div className="md:w-2/5 bg-[#0A0A0A] aspect-[4/3] md:aspect-auto flex flex-col items-center justify-center relative overflow-hidden p-8">
                                    {item.img ? (
                                        <>
                                            <img src={item.img} alt={item.title} className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000 opacity-90" />
                                            <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-700"></div>
                                        </>
                                    ) : (
                                        <>
                                            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-[#C5A059]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                                            <span className="font-playfair text-white/20 text-3xl md:text-4xl tracking-[0.4em] uppercase group-hover:scale-105 transition-transform duration-700 relative z-10 text-center">Private</span>
                                            <span className="font-montserrat text-[#C5A059] text-[9px] uppercase tracking-[0.3em] mt-4 opacity-50 group-hover:opacity-100 transition-opacity relative z-10">Confidential Asset</span>
                                        </>
                                    )}
                                </div>
                                <div className="md:w-3/5 p-8 md:p-14 flex flex-col justify-center relative bg-white">
                                    <div className="flex flex-col md:flex-row md:items-start justify-between mb-8 gap-6">
                                        <div>
                                            <h4 className="font-montserrat text-[10px] gold-text uppercase font-bold tracking-[0.4em] mb-3">{item.location}</h4>
                                            <h3 className="font-playfair text-3xl md:text-4xl font-bold italic text-[#121212] mb-3">{item.title}</h3>
                                            <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest">{item.project}</p>
                                        </div>
                                        <div className="md:text-right bg-gray-50 md:bg-transparent p-4 md:p-0 rounded-sm">
                                            <span className="text-[9px] uppercase font-bold text-gray-400 tracking-widest block mb-1">Total ROI</span>
                                            <span className="text-3xl font-montserrat font-bold gold-text lining-nums">{item.roi}</span>
                                        </div>
                                    </div>
                                    
                                    <div className="flex items-center gap-4 mb-12 bg-gray-50/50 p-6 border border-gray-50 rounded-sm">
                                        <div className="flex-1">
                                            <span className="text-[9px] uppercase font-bold text-gray-400 tracking-widest block mb-2">Вход (Ланч)</span>
                                            <span className="text-lg md:text-xl font-montserrat font-bold text-[#121212] lining-nums">{item.launch}</span>
                                        </div>
                                        <div className="w-12 md:w-24 h-px bg-gray-300 relative mx-2 md:mx-6">
                                            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 border-t border-r border-[#C5A059] rotate-45"></div>
                                        </div>
                                        <div className="flex-1 text-right md:text-left">
                                            <span className="text-[9px] uppercase font-bold gold-text tracking-widest block mb-2">Выход (Продажа)</span>
                                            <span className="text-lg md:text-xl font-montserrat font-bold text-[#121212] lining-nums">{item.now}</span>
                                        </div>
                                    </div>
                                    
                                    <div className="mt-auto pt-6 border-t border-gray-100 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                                        <span className="text-[10px] text-gray-400 uppercase tracking-widest font-bold flex items-center gap-2">
                                            <ShieldCheck size={14} className="text-[#C5A059]" /> Цикл сделки завершен
                                        </span>
                                        <button type="button" onClick={onOpenModal} className="text-[10px] font-bold uppercase tracking-widest text-[#121212] hover:text-[#C5A059] border-b border-[#121212] hover:border-[#C5A059] pb-1 transition-all flex items-center gap-2">
                                            Запросить детали <ArrowRight size={14} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* 6. КАЛЬКУЛЯТОР */}
            <section className="py-24 bg-white px-8">
                <div className="max-w-7xl mx-auto">
                    <InvestmentCalculator />
                </div>
            </section>

            {/* 7. АНАЛИТИКА */}
            <section id="guide-section" className="py-24 bg-white px-8">
                <div className="max-w-7xl mx-auto bg-[#C5A059] rounded-sm p-10 md:p-16 text-white flex flex-col md:flex-row items-center gap-12 relative overflow-hidden text-left">
                    <div className="absolute top-0 right-0 w-1/2 h-full opacity-10 pointer-events-none">
                        <Globe size={400} className="translate-x-1/2 -translate-y-1/4" />
                    </div>
                    <div className="md:w-2/3 relative z-10 text-left">
                        <h3 className="font-playfair text-3xl md:text-5xl italic mb-6 lining-nums">Аналитический отчет 2026</h3>
                        <p className="mb-10 opacity-90 text-lg leading-relaxed max-w-lg font-raleway text-left">Узнайте, какие районы Дубая покажут рост в 25% за следующий год и как избежать типичных ошибок при покупке.</p>
                        <div className="flex flex-col sm:flex-row gap-4">
                            <input type="email" placeholder="Ваш Email" className="bg-white/20 border border-white/30 p-5 px-6 outline-none placeholder:text-white/60 flex-grow text-white font-montserrat rounded-sm transition-all focus:bg-white/30" />
                            <button type="button" className="btn-premium !bg-[#121212] !text-white whitespace-nowrap !py-4 px-12 uppercase tracking-widest font-bold">
                                <span className="flex items-center justify-center gap-3">Получить гайд <Download size={16} /></span>
                            </button>
                        </div>
                    </div>
                    <div className="md:w-1/3 flex justify-center relative h-80 w-full mt-12 md:mt-0">
                        <div className="absolute w-48 h-64 bg-[#121212] shadow-2xl border-4 border-white/10 p-6 flex flex-col justify-between z-10 -rotate-12 translate-x-[-40px]">
                            <span className="text-[7px] gold-text uppercase font-bold">Guide 2026</span>
                            <h5 className="font-playfair text-sm italic">Top Locations</h5>
                        </div>
                        <div className="absolute w-52 h-72 bg-[#121212] shadow-2xl border-8 border-white p-8 flex flex-col justify-between z-30 rotate-3">
                            <div className="flex flex-col gap-2">
                                <span className="text-[10px] gold-text uppercase font-bold tracking-[0.3em]">Инвест-гайд</span>
                                <h5 className="font-playfair text-xl italic leading-tight lining-nums">Dubai 2026</h5>
                            </div>
                            <div className="h-0.5 w-12 gold-bg"></div>
                        </div>
                    </div>
                </div>
            </section>

            {/* 7.5. ОТЗЫВЫ */}
            <section className="py-32 bg-[#FBFBFB] px-8 text-left">
                <div className="max-w-7xl mx-auto">
                    <SectionHeading main="Что говорят наши клиенты" />
                    <motion.div 
                        className="grid md:grid-cols-3 gap-8"
                        initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.1 }}
                        variants={{ hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.2 } } }}
                    >
                        {testimonials.map((t, i) => (
                            <motion.div 
                                key={i} variants={{ hidden: { opacity: 0, y: 40 }, visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } } }}
                                className="bg-white p-8 md:p-10 shadow-[0_10px_40px_rgba(0,0,0,0.03)] hover:shadow-[0_20px_60px_rgba(197,160,89,0.15)] transition-all duration-700 relative group flex flex-col h-full border border-gray-50 hover:-translate-y-2 rounded-sm"
                            >
                                <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-[#C5A059] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                                
                                <div className="flex items-center gap-4 mb-6 border-b border-gray-100 pb-6 relative z-10">
                                    <div className="w-12 h-12 rounded-full bg-[#121212] flex items-center justify-center text-[#C5A059] font-playfair font-bold text-lg shadow-inner">
                                        {t.initial}
                                    </div>
                                    <div>
                                        <h5 className="font-montserrat font-bold text-[#121212] text-xs uppercase tracking-widest mb-1">{t.name}</h5>
                                        <span className="text-[9px] text-gray-400 uppercase tracking-widest font-bold">{t.role}</span>
                                    </div>
                                </div>
                                
                                <p className="text-gray-600 font-playfair text-base leading-relaxed mb-8 flex-grow relative z-10 italic">
                                    "{t.text}"
                                </p>
                                
                                <div className="mt-auto flex items-center justify-between relative z-10">
                                    <Quote className="text-[#C5A059] w-8 h-8 opacity-20 group-hover:opacity-60 transition-opacity duration-700" />
                                    <div className="flex gap-0.5 text-[#C5A059]">{[1,2,3,4,5].map(star => <Star key={star} size={12} fill="currentColor" />)}</div>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* 8. FAQ */}
            <section className="py-24 bg-white px-8 text-left" itemScope itemType="https://schema.org/FAQPage">
                <div className="max-w-3xl mx-auto">
                    <SectionHeading top="FAQ" main="Вопросы и ответы" />
                    <div className="border-t border-gray-100">
                        {faqs.map((faq, i) => <FAQItem key={i} {...faq} />)}
                    </div>
                </div>
            </section>

            {/* 9. ФОРМА КОНТАКТОВ */}
            <section id="contact-form" className="py-24 bg-[#f9f9f9] px-8 text-center overflow-visible">
                <LeadForm title="Связаться с нами" subtitle="Сценарий вашей прибыли: от выбора объекта до выхода из сделки" />
            </section>
        </div>
    );
};

// --- APP WRAPPER WITH ROUTER & HEADER ---
const AppContent = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [scrolled, setScrolled] = useState(false);
    const [isContactModalOpen, setIsContactModalOpen] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 50);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const isHome = location.pathname === '/';
    const headerClass = isHome 
        ? (scrolled ? 'bg-white text-[#121212] shadow-md py-4' : 'bg-transparent text-white py-6') 
        : 'bg-[#0A0A0A] text-white shadow-lg py-4 border-b border-white/5';

    const handleNav = (path, anchor) => {
        if(path === '/') {
            if(!isHome) navigate('/');
            if(anchor) setTimeout(() => document.getElementById(anchor)?.scrollIntoView({behavior: 'smooth'}), 300);
            else window.scrollTo({top:0, behavior:'smooth'});
        }
    }

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
            {isLoading && <Preloader onFinish={() => setIsLoading(false)} />}
            
            <ContactModal isOpen={isContactModalOpen} onClose={() => setIsContactModalOpen(false)} />

            {/* ХЕДЕР */}
            <header className={`fixed w-full z-[1000] transition-all duration-500 ${headerClass}`}>
                <div className="max-w-7xl mx-auto px-8 flex justify-between items-center">
                    <Link to="/" className="flex flex-col cursor-pointer">
                        <span className="font-playfair text-xl md:text-2xl font-bold tracking-[0.15em] uppercase">ALPHA<span className="gold-text">STAR</span></span>
                        <span className="text-[7px] md:text-[8px] tracking-[0.55em] font-bold uppercase gold-text -mt-1 text-left">PROPERTIES</span>
                    </Link>
                    
                    <nav className="hidden lg:flex items-center space-x-10 text-[10px] font-bold uppercase tracking-widest">
                        <NavDropdown label="Купить" items={[
                            { label: 'Новостройки', path: '/buy/off-plan' },
                            { label: 'Участки', path: '/buy/plots' },
                            { label: 'Коммерция', path: '/buy/commercial' },
                            { label: 'Инвестиции', path: '/buy/invest' },
                            { label: 'Виллы', path: '/buy/villas' },
                            { divider: true },
                            { label: 'Вторичное жилье', path: '/buy/secondary' },
                            { label: 'Сколько стоит ваша недвижимость?', path: '/valuation', special: true }
                        ]} />

                        <NavDropdown label="Аренда" items={[
                            { label: 'Апартаменты', path: '/rent/apartments' },
                            { label: 'Виллы', path: '/rent/villas' },
                            { label: 'Коммерция', path: '/rent/commercial' },
                            { divider: true },
                            { label: 'Сколько стоит ваша недвижимость?', path: '/valuation', gold: true }
                        ]} />

                        <NavDropdown label="О нас" items={[
                            { label: 'Блог', path: '/blog' },
                            { label: 'Связаться с нами', onClick: () => setIsContactModalOpen(true) }
                        ]} />

                        <button type="button" onClick={() => setIsContactModalOpen(true)} className="btn-premium bg-[#C5A059] text-white px-8 py-3 text-[10px] uppercase font-bold tracking-widest shadow-lg">Связаться с нами</button>
                    </nav>
                </div>
            </header>

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
                        
                        <Route path="/rent/apartments" element={<PageWrapper><ListingPage category="apartments_rent" onOpenModal={() => setIsContactModalOpen(true)} /></PageWrapper>} />
                        <Route path="/rent/villas" element={<PageWrapper><ListingPage category="villas" onOpenModal={() => setIsContactModalOpen(true)} /></PageWrapper>} />
                        <Route path="/rent/commercial" element={<PageWrapper><ListingPage category="commercial" onOpenModal={() => setIsContactModalOpen(true)} /></PageWrapper>} />
                        
                        <Route path="/valuation" element={<PageWrapper><ValuationPage /></PageWrapper>} />
                        <Route path="/blog" element={<PageWrapper><BlogPage /></PageWrapper>} />
                        <Route path="/blog/:id" element={<PageWrapper><BlogPostPage /></PageWrapper>} />
                    </Routes>
                </AnimatePresence>
            </main>

            {/* ФУТЕР */}
            <footer className="bg-[#0A0A0A] text-white pt-24 pb-12 px-8 relative overflow-hidden border-t border-white/5">
                <div className="absolute top-0 right-0 w-1/3 h-full bg-[#C5A059]/5 blur-[120px] pointer-events-none"></div>
                <div className="max-w-7xl mx-auto relative z-10 text-left">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 mb-20 text-left">
                        <div className="lg:col-span-5 space-y-8 text-left">
                            <div className="flex flex-col text-left">
                                <span className="font-playfair text-3xl font-bold tracking-[0.15em] uppercase">ALPHA<span className="gold-text">STAR</span></span>
                                <span className="text-[9px] tracking-[0.8em] font-bold uppercase gold-text -mt-1 ml-1 text-left">PROPERTIES</span>
                            </div>
                            <p className="text-white/40 text-base leading-relaxed max-w-md font-medium italic border-l border-[#C5A059] pl-6 text-left">Мы защищаем ваш капитал и создаем преимущество на самом динамичном рынке мира.</p>
                        </div>
                        <div className="lg:col-span-3 space-y-8 text-left">
                            <h6 className="font-montserrat text-[10px] font-bold uppercase tracking-[0.5em] gold-text">Навигация</h6>
                            <ul className="space-y-4 text-sm font-bold uppercase tracking-widest text-white/30 text-left">
                                <li><span onClick={() => handleNav('/', 'about')} className="hover:text-white transition-colors cursor-pointer">О компании</span></li>
                                <li><span onClick={() => handleNav('/', 'real-deals')} className="hover:text-white transition-colors cursor-pointer">Кейсы</span></li>
                                <li><Link to="/buy/off-plan" className="hover:text-white transition-colors cursor-pointer">Объекты</Link></li>
                            </ul>
                        </div>
                        <div className="lg:col-span-4 space-y-8 text-left">
                            <h6 className="font-montserrat text-[10px] font-bold uppercase tracking-[0.5em] gold-text">Контакты</h6>
                            <div className="space-y-6 text-left">
                                <div className="flex items-start gap-4 text-left"><MapPin className="gold-text mt-1" size={20} /><p className="text-white/60 text-xs font-medium uppercase tracking-wider text-left">Palm Jumeirah, Shoreline 10, <br/>Dubai, UAE</p></div>
                                <div className="flex items-center gap-4 group cursor-pointer text-left"><Phone className="gold-text" size={20} /><p className="text-white font-montserrat font-bold text-xl tracking-tighter group-hover:text-[#C5A059] transition-colors text-left">+971 50 000 0000</p></div>
                                <div className="flex items-center gap-4 group cursor-pointer text-left"><Mail className="gold-text" size={20} /><p className="text-white/60 font-bold uppercase text-[10px] tracking-[0.3em] group-hover:text-white transition-colors text-left">office@alphastar.ae</p></div>
                            </div>
                        </div>
                    </div>
                    <div className="pt-8 border-t border-white/5 text-[9px] uppercase font-bold tracking-[0.4em] text-white/20 text-left">
                        © 2026 Alpha Star Properties. Все права защищены.
                    </div>
                </div>
            </footer>

            <div className="fixed bottom-6 right-6 z-[1500]">
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
            <Router>
                <style>{styles}</style>
                <AppContent />
            </Router>
        </HelmetProvider>
    );
}