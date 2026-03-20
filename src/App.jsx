import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HashRouter as Router, Routes, Route, Link, useNavigate, useLocation, useParams } from 'react-router-dom';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import { 
  Heart, Home as HomeIcon, TrendingUp, Coins, Globe, Download, 
  MapPin, Phone, Mail, MessageCircle, ChevronDown, 
  ShieldCheck, Search, FileCheck, Key, ArrowRight, Quote, Star, 
  Calendar, Clock, ArrowLeft, Menu, X, ArrowUp, Award, Trophy, Crown
} from 'lucide-react';

// --- Стили ---
const styles = `
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

    .font-cormorant { font-family: 'Cormorant Garamond', serif; }
    .font-montserrat { font-family: 'Montserrat', sans-serif; }
    
    .gold-text { color: var(--color-gold) !important; }
    .gold-bg { background-color: var(--color-gold) !important; }
    .lining-nums { font-variant-numeric: lining-nums; }

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

// --- ДАННЫЕ СТАТЕЙ БЛОГА ---
const blogPosts = [
    {
        id: "dubai-market-2026",
        title: "Рынок недвижимости Дубая 2026: Главные прогнозы, цифры и новые тренды",
        date: "14 Октября, 2025",
        readTime: "6 мин",
        img: "./images/blog1.jpg",
        alt: "Панорама рынка недвижимости Дубая, аналитика",
        excerpt: "Глубокий аналитический разбор тенденций рынка недвижимости ОАЭ. Узнайте, в каких районах ожидается максимальный рост капитала (ROI) и почему фокус смещается на Ultra-Luxury.",
        content: `
            <p>Рынок недвижимости Дубая продолжает демонстрировать феноменальную устойчивость, привлекая капиталы инвесторов со всего мира. Вступая в 2026 год, многие задаются главным вопросом: сохранится ли двузначный рост стоимости активов, или рынок перейдет в фазу плавной стабилизации? В этом экспертном обзоре от аналитиков <strong>Alpha Star Properties</strong> мы подробно разберем ключевые тренды и инвестиционные зоны с максимальным потенциалом доходности.</p>
            
            <h3>Смещение фокуса на Ultra-Luxury и брендированные резиденции</h3>
            <p>Спрос на <strong>элитную недвижимость в Дубае</strong> со стороны HNWI (High Net Worth Individuals — лиц с крупным частным капиталом) бьет абсолютные исторические рекорды. Проекты от таких мировых брендов, как Cavalli, Bulgari, Baccarat и Mercedes-Benz, распродаются на стадии закрытых пресейлов (Private Sales).</p>
            <p>Покупка брендированных резиденций (Branded Residences) обеспечивает первичным инвесторам прирост капитала от 30% до 50% еще до сдачи объекта в эксплуатацию, так как ликвидность таких лотов на вторичном рынке остается запредельно высокой.</p>
            
            <h3>Топ-3 района с максимальной доходностью (ROI) в 2026 году</h3>
            <p>Классические локации, такие как Downtown Dubai и Palm Jumeirah, остаются надежным инструментом сохранения средств. Однако для максимизации спекулятивной и арендной прибыли стоит обратить внимание на развивающиеся кластеры:</p>
            <ul>
                <li><strong>Dubai Maritime City и Rashid Yachts & Marina:</strong> Новые прибрежные районы с огромным потенциалом для сдачи в краткосрочную аренду (Holiday Homes). Строительство новой марины и круизных терминалов привлекает яхтсменов и состоятельных туристов.</li>
                <li><strong>Dubai South и JVC:</strong> Безоговорочные лидеры по доходности от долгосрочной аренды (в среднем 7.5% – 9.5% годовых чистого ROI). Развитие грандиозной инфраструктуры вокруг нового аэропорта Al Maktoum International делает инвестиции в этот район максимально надежными.</li>
                <li><strong>Palm Jebel Ali:</strong> Флагманский мегапроект правительства ОАЭ. Цены на старте продаж здесь значительно привлекательнее, чем на классической Palm Jumeirah, что гарантирует высокую капитализацию вилл в горизонте 3-5 лет.</li>
            </ul>

            <h3>Первичный рынок (Off-plan) или Вторичное жилье?</h3>
            <p>Покупка <strong>новостройки Дубая от застройщика (Off-plan)</strong> остается самым популярным инструментом за счет беспроцентной рассрочки (Payment Plan). Она позволяет оплачивать от 40% до 60% стоимости объекта уже после получения ключей. Все средства инвесторов надежно защищены государством (DLD) на специальных эскроу-счетах.</p>
            <p>С другой стороны, вторичный рынок предлагает мгновенную генерацию пассивного дохода от сдачи в аренду и возможность получения Золотой визы ОАЭ (Golden Visa) сразу после переоформления титула собственности (Title Deed).</p>

            <div class="bg-[#f9f9f9] p-8 border-l-4 border-[#C5A059] mt-10">
                <p class="font-cormorant italic text-xl m-0 text-gray-700">Инвестиции в недвижимость ОАЭ требуют глубокого анализа и доступа к инсайдерской информации. Запишитесь на закрытую консультацию к экспертам Private Office Alpha Star Properties для разработки вашей индивидуальной стратегии прибыльности.</p>
            </div>
        `
    },
    {
        id: "golden-visa-uae",
        title: "Как получить Золотую визу ОАЭ (Golden Visa) за инвестиции",
        date: "28 Сентября, 2025",
        readTime: "5 мин",
        img: "./images/blog2.png", 
        alt: "Резидентская виза ОАЭ за инвестиции в недвижимость",
        excerpt: "Полное руководство по получению Golden Visa в Дубае. Условия для инвесторов, налоги, порог входа и преимущества долгосрочного резидентства в 2026 году.",
        content: `
            <p>Объединенные Арабские Эмираты — это не только привлекательная безналоговая гавань, но и один из самых безопасных деловых хабов мира. Государственная программа <strong>Golden Visa (Золотая виза)</strong> сроком на 10 лет стала главным магнитом для международных инвесторов и предпринимателей. Эксперты Alpha Star Properties подготовили актуальный гайд по условиям получения резидентства в 2026 году.</p>
            
            <h3>5 главных преимуществ Золотой визы ОАЭ</h3>
            <p>Получив статус долгосрочного резидента Эмиратов (Emirates ID), вы открываете для себя и своей семьи доступ к премиальному уровню жизни и защиты активов:</p>
            <ul>
                <li><strong>Долгосрочная безопасность:</strong> Легальное проживание в стране в течение 10 лет с автоматическим правом продления неограниченное количество раз.</li>
                <li><strong>Спонсирование семьи:</strong> Возможность оформить визы для супруга(и) и детей любого возраста. В случае (не дай бог) смерти главного спонсора, члены семьи могут оставаться в ОАЭ до окончания срока действия их виз.</li>
                <li><strong>Свобода передвижений:</strong> В отличие от стандартных виз на 2 года, владельцам Golden Visa <strong>не нужно</strong> обязательно приезжать в ОАЭ каждые 6 месяцев, чтобы статус оставался активным.</li>
                <li><strong>Оптимизация налогов:</strong> 0% налога на доходы физических лиц, 0% на прирост капитала и дивиденды. Легкое открытие личных счетов в топовых банках Дубая (Emirates NBD, FAB, Mashreq).</li>
                <li><strong>Персонал:</strong> Право нанимать неограниченное количество домашнего персонала (водители, няни) и спонсировать их визы.</li>
            </ul>

            <h3>Условия получения через недвижимость в 2026 году</h3>
            <p>Правительство Дубая через Земельный департамент (DLD) сделало процесс максимально прозрачным. Главное условие — необходимо <strong>купить недвижимость в Дубае</strong> на общую сумму не менее <strong>2 000 000 дирхамов</strong> (около $545,000). Важные юридические нюансы:</p>
            <ul>
                <li><strong>Объекты Off-plan:</strong> Вы можете подать на визу даже при покупке строящегося жилья. Главное условие — девелопер должен быть одобрен государством, а вы должны оплатить застройщику минимально требуемую сумму от стоимости лота (обычно от 10% до 20%, зависит от застройщика).</li>
                <li><strong>Ипотека:</strong> Приобретение в ипотеку допускается! Банк просто выдает специальное письмо об отсутствии возражений (NOC).</li>
                <li><strong>Объединение активов:</strong> Если у вас есть несколько объектов недвижимости (например, две квартиры по 1 млн AED), их стоимость законно суммируется для достижения нужного порога в 2 млн AED.</li>
            </ul>

            <h3>Как мы помогаем нашим клиентам?</h3>
            <p>Оформление ВНЖ в другой стране может показаться сложным бюрократическим квестом. <strong>Alpha Star Properties</strong> предоставляет сервис «под ключ».</p>
            <p>Наш юридический департамент берет на себя 100% забот: от сбора документов и общения с DLD до трансфера на премиальном авто в VIP-центр прохождения медицинской комиссии (Medical Fitness Test). Ваша главная задача — выбрать идеальный инвестиционный актив, а всю бумажную работу мы берем на себя.</p>
        `
    },
    {
        id: "buy-property-dubai-step-by-step",
        title: "Пошаговое руководство: Как безопасно купить недвижимость в Дубае",
        date: "05 Сентября, 2025",
        readTime: "7 мин",
        img: "./images/blog3.jpg",
        alt: "Процесс покупки недвижимости в Дубае",
        excerpt: "Подробный разбор каждого этапа сделки: от выбора объекта и налогов до получения Title Deed. Узнайте, как защищены деньги иностранных покупателей в ОАЭ.",
        content: `
            <p>Покупка недвижимости за рубежом всегда вызывает множество вопросов, особенно касательно безопасности транзакций и скрытых комиссий. Дубай обладает одной из самых прозрачных и защищенных правовых систем в мире. В этой статье мы шаг за шагом разберем, как происходит процесс покупки <strong>элитной недвижимости в ОАЭ</strong> для иностранцев.</p>

            <h3>Шаг 1: Выбор стратегии и бронирование объекта (EOI)</h3>
            <p>Всё начинается с определения цели: вы ищете дом для переезда или актив для сдачи в аренду и перепродажи (Flip)? Когда идеальный объект (новостройка или вторичка) выбран, покупатель вносит возвращаемый депозит — <strong>EOI (Expression of Interest)</strong>. Это закрепляет за вами лот и фиксирует его цену.</p>

            <h3>Шаг 2: Договор купли-продажи (SPA)</h3>
            <p>После внесения депозита застройщик или продавец готовит официальный договор купли-продажи — <strong>SPA (Sales and Purchase Agreement)</strong>. В нем детально прописаны все условия: график платежей (Payment Plan), сроки сдачи объекта, штрафные санкции и технические характеристики недвижимости. Эксперты Alpha Star Properties всегда проводят строгий юридический аудит SPA до того, как клиент поставит свою подпись.</p>

            <h3>Шаг 3: Как защищены ваши деньги? (Escrow-счета)</h3>
            <p>Если вы покупаете недвижимость на стадии строительства (Off-plan), вы переводите деньги <strong>не на личный счет застройщика</strong>, а на специальный эскроу-счет (Escrow Account). Этот счет жестко контролируется государственным органом RERA (Агентство по регулированию рынка недвижимости). Застройщик получает доступ к вашим деньгам только частями и только после того, как независимый государственный инспектор подтвердит завершение определенного этапа стройки. Это на 100% исключает риск появления «долгостроев».</p>

            <h3>Шаг 4: Налоги и государственные сборы в Дубае</h3>
            <p>Дубай — рай для инвесторов, так как здесь <strong>отсутствуют ежегодные налоги на недвижимость</strong>. Нет налога на прирост капитала, нет налога на доход от сдачи в аренду. Единственные платежи, к которым нужно быть готовым при покупке:</p>
            <ul>
                <li><strong>Сбор DLD (Dubai Land Department):</strong> Разовый государственный сбор за регистрацию права собственности. Составляет ровно <strong>4%</strong> от стоимости недвижимости.</li>
                <li><strong>Registration Fee:</strong> Административный сбор за выдачу документа (около 4,000 AED + НДС).</li>
                <li><strong>Oqood:</strong> Сбор за регистрацию договора для строящейся недвижимости.</li>
            </ul>

            <h3>Шаг 5: Получение Title Deed (Титул собственности)</h3>
            <p>После выплаты необходимой суммы (или 100% на вторичном рынке) вы получаете главный документ — <strong>Title Deed</strong>. Это официальный государственный сертификат, подтверждающий ваше абсолютное и безусловное право собственности (Freehold) на объект.</p>

            <div class="bg-[#f9f9f9] p-8 border-l-4 border-[#C5A059] mt-10">
                <p class="font-cormorant italic text-xl m-0 text-gray-700">Более 70% сделок Alpha Star Properties проходят полностью <strong>дистанционно</strong>. Благодаря защищенным цифровым платформам правительства Дубая, вы можете стать владельцем премиальной недвижимости и получать пассивный доход, даже не вылетая из своей страны.</p>
            </div>
        `
    }
];

const mockProperties = [
    { id: 1, type: 'novostroyki', beds: 1, title: 'Emaar Beachfront Residence', price: '1,500,000', location: 'Dubai Harbour', img: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&q=80&w=800' },
    { id: 2, type: 'novostroyki', beds: 2, title: 'Cavalli Couture', price: '2,800,000', location: 'Dubai Water Canal', img: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=800' },
    { id: 3, type: 'villas', beds: 3, title: 'District One Villa', price: '5,500,000', location: 'MBR City', img: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&q=80&w=800' },
    { id: 4, type: 'secondary', beds: 1, title: 'Downtown Views', price: '950,000', location: 'Downtown Dubai', img: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=800' },
    { id: 5, type: 'commercial', beds: 0, title: 'Business Bay Office', price: '3,200,000', location: 'Business Bay', img: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=800' },
    { id: 6, type: 'invest', beds: 2, title: 'High ROI Apartment', price: '1,100,000', location: 'JVC', img: 'https://images.unsplash.com/photo-1554995207-c18c203602cb?auto=format&fit=crop&q=80&w=800' },
    { id: 7, type: 'plots', beds: 0, title: 'Pearl Jumeirah Plot', price: '12,500,000', location: 'Pearl Jumeirah', img: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80&w=800' }
];

const steps = [
    { icon: Search, title: "Глубокий анализ", desc: "Анализируем лоты по 54 параметрам ликвидности до их выхода в паблик." },
    { icon: ShieldCheck, title: "Юридический аудит", desc: "Проверяем застройщика, эскроу-счета и чистоту титула собственности." },
    { icon: FileCheck, title: "Сопровождение", desc: "Личное присутствие на сделке, регистрация в DLD и управление активами." },
    { icon: Key, title: "Выход из сделки", desc: "Стратегия перепродажи или сдачи в аренду с гарантированной доходностью." }
];

const caseStudies = [
    { img: "./images/case1.png", roi: '120-200%', location: 'Bluewaters Island', title: 'BLUEWATERS RESIDENCES', project: '1 BEDROOM (РАЙОН)', launch: '1.9М — 2.2М AED', now: '4.7М — 6.8М AED' },
    { img: "./images/case2.png", roi: '60-70%', location: 'Dubai Hills Estate', title: 'ELLINGTON HOUSE', project: '3 BEDROOM (ПРОЕКТ)', launch: '3.3М — 4.0М AED', now: '5.5М — 6.5М AED' },
    { img: "./images/case3.png", roi: '90-120%', location: 'Emaar Beachfront', title: 'BEACH ISLE', project: '3 BEDROOM (ПРОЕКТ)', launch: '4.5М AED', now: '8.5М — 10.3М AED' },
    { img: "./images/case4.png", roi: '70%', location: 'JVC', title: 'BINGHATTI CORNER', project: '1 BEDROOM (ПРОЕКТ)', launch: '600,000 AED', now: '1М AED' }
];

const awardsList = [
    { img: "" },
    { img: "" },
    { img: "" },
    { img: "" }
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

const SectionHeading = ({ top, main, light = false }) => (
    <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }} className={`text-center mb-10 md:mb-16 ${light ? 'text-white' : 'text-[#121212]'}`}>
        {top && <h2 className="text-[9px] md:text-[10px] gold-text uppercase tracking-[0.5em] font-bold font-montserrat mb-3 md:mb-4">{top}</h2>}
        <h3 className="font-cormorant text-3xl md:text-4xl px-4 font-bold">{main}</h3>
    </motion.div>
);

const LeadForm = ({ title, subtitle, isModal = false }) => {
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [selectedGoal, setSelectedGoal] = useState('Выберите цель');

    return (
        <div className={`relative bg-white shadow-2xl overflow-visible w-full ${isModal ? 'p-6 md:p-14 rounded-sm' : 'max-w-4xl mx-auto p-6 md:px-16 md:py-12 border border-gray-100'}`}>
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-1 gold-bg opacity-30"></div>
            <div className="text-center mb-6 md:mb-8">
                <h2 className="font-montserrat text-xl md:text-4xl uppercase tracking-[0.2em] md:tracking-[0.3em] font-bold mb-2 md:mb-3 text-[#121212]">{title}</h2>
                <p className="font-cormorant text-base md:text-lg text-gray-400">{subtitle}</p>
            </div>
            <form className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5 text-left" onSubmit={e => e.preventDefault()}>
                <div className="space-y-1 md:space-y-2 font-montserrat">
                    <label className="text-[9px] md:text-[10px] uppercase tracking-[0.2em] font-bold opacity-30 ml-1">Ваше имя</label>
                    <input type="text" className="w-full p-3 md:p-4 bg-gray-50 border border-gray-100 focus:border-[#C5A059] outline-none font-bold text-sm transition-all duration-300 focus:bg-white focus:shadow-md" placeholder="Иван Иванов" />
                </div>
                <div className="space-y-1 md:space-y-2 font-montserrat">
                    <label className="text-[9px] md:text-[10px] uppercase tracking-[0.2em] font-bold opacity-30 ml-1">Номер телефона</label>
                    <input 
                        type="tel" 
                        onInput={(e) => e.target.value = e.target.value.replace(/[^0-9+]/g, '')}
                        className="w-full p-3 md:p-4 bg-gray-50 border border-gray-100 focus:border-[#C5A059] outline-none font-bold text-sm transition-all duration-300 focus:bg-white focus:shadow-md" 
                        placeholder="+7 / +971" 
                    />
                </div>
                <div className="md:col-span-2 space-y-1 md:space-y-2 font-montserrat relative">
                    <label className="text-[9px] md:text-[10px] uppercase tracking-[0.2em] font-bold opacity-30 ml-1 mb-1 md:mb-2 block">Цель запроса</label>
                    <div className="relative">
                        <div className={`w-full p-3 md:p-4 bg-gray-50 border cursor-pointer transition-all duration-300 flex items-center justify-between ${dropdownOpen ? 'border-[#C5A059] bg-white shadow-md' : 'border-gray-100 hover:border-gray-300'}`} onClick={() => setDropdownOpen(!dropdownOpen)}>
                            <span className={`text-sm font-bold transition-colors ${selectedGoal !== 'Выберите цель' ? 'text-[#121212]' : 'text-gray-400'}`}>{selectedGoal}</span>
                            <ChevronDown className={`w-4 h-4 md:w-5 md:h-5 text-[#C5A059] transition-transform duration-500 ${dropdownOpen ? 'rotate-180' : ''}`} />
                        </div>
                        <AnimatePresence>
                            {dropdownOpen && (
                                <motion.div initial={{ opacity: 0, y: -10, scaleY: 0.95 }} animate={{ opacity: 1, y: 0, scaleY: 1 }} exit={{ opacity: 0, y: -10, scaleY: 0.95 }} transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }} className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-100 shadow-2xl z-[100] origin-top rounded-sm overflow-hidden">
                                    {['Переезд / Релокация', 'Инвестиции', 'Управление недвижимостью'].map(item => (
                                        <div key={item} onClick={() => { setSelectedGoal(item); setDropdownOpen(false); }} className="p-3 md:p-4 border-b border-gray-50 hover:bg-gray-50 cursor-pointer text-sm font-bold text-[#121212] transition-colors flex items-center justify-between group">
                                            <span className="group-hover:text-[#C5A059] transition-colors">{item}</span>
                                            {selectedGoal === item && <div className="w-2 h-2 rounded-full bg-[#C5A059]"></div>}
                                        </div>
                                    ))}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
                <div className="md:col-span-2 flex justify-center mt-2 md:mt-4">
                    <button type="submit" className="btn-premium w-full md:w-3/4 py-4 md:py-6 bg-[#C5A059] text-white font-montserrat uppercase tracking-widest font-bold shadow-lg text-xs md:text-sm">Отправить заявку</button>
                </div>
            </form>
        </div>
    );
};

const MortgageInfo = () => {
    const [showForm, setShowForm] = useState(false);

    return (
        <div className="mb-12 md:mb-16 mx-5 md:mx-0">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="bg-[#121212] p-6 md:p-12 rounded-sm shadow-2xl flex flex-col lg:flex-row items-center justify-between gap-6 md:gap-8 border border-[#C5A059]/20">
                <div className="text-left flex-1">
                    <h3 className="font-cormorant text-2xl md:text-3xl mb-3 md:mb-4 gold-text font-bold">Ипотека для нерезидентов в ОАЭ</h3>
                    <p className="text-white/60 text-xs md:text-sm leading-relaxed max-w-3xl font-raleway">
                        Официальное финансирование до 50% от стоимости объекта. Процентная ставка от 4.5% годовых. Минимальный пакет документов. Мы полностью берем на себя процесс одобрения кредита (Mortgage Approval) в ведущих банках Дубая.
                    </p>
                </div>
                <button type="button" onClick={() => setShowForm(!showForm)} className="btn-premium bg-[#C5A059] text-white px-8 py-4 md:px-12 w-full lg:w-auto text-[10px] font-bold uppercase tracking-widest whitespace-nowrap">
                    {showForm ? 'Скрыть анкету' : 'Рассчитать ипотеку'}
                </button>
            </motion.div>
            
            <AnimatePresence>
                {showForm && (
                    <motion.div 
                        initial={{ opacity: 0, height: 0, marginTop: 0 }} 
                        animate={{ opacity: 1, height: 'auto', marginTop: '2rem' }} 
                        exit={{ opacity: 0, height: 0, marginTop: 0 }} 
                        transition={{ duration: 0.4 }}
                        className="overflow-hidden"
                    >
                        <LeadForm title="Заявка на ипотеку" subtitle="Оставьте данные, и наш ипотечный брокер свяжется с вами для расчета платежей" isModal={false} />
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
                        <LeadForm title="Связаться с нами" subtitle="Оставьте заявку, и эксперт свяжется с вами в течение 15 минут" isModal={true} />
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
            <div className="w-full lg:w-3/5 p-6 md:p-10 lg:p-16 text-left">
                <h4 className="font-montserrat text-[9px] md:text-[10px] gold-text uppercase font-bold tracking-[0.4em] mb-3 md:mb-4">Расчет прибыли</h4>
                <h3 className="font-cormorant text-3xl md:text-4xl mb-6 md:mb-8 font-bold">Рассчитайте параметры успеха</h3>
                <div className="space-y-8 md:space-y-10 text-left">
                    <div className="space-y-4">
                        <div className="flex justify-between items-center">
                            <label className="text-[10px] md:text-[11px] uppercase font-bold text-gray-400 tracking-widest">Инвестиции ($)</label>
                            <span className="text-xl md:text-2xl font-montserrat font-bold">${Number(amount).toLocaleString()}</span>
                        </div>
                        <input type="range" min="300000" max="2000000" step="50000" value={amount} onChange={(e) => setAmount(e.target.value)} style={bgStyle} className="w-full" />
                    </div>
                    <div className="grid grid-cols-3 gap-2 md:gap-4">
                        {Object.keys(strategies).map(s => (
                            <button type="button" key={s} onClick={() => setStrategy(s)} className={`p-3 md:p-4 border rounded-sm text-[9px] md:text-[10px] font-bold uppercase tracking-widest transition-all ${strategy === s ? 'bg-black text-white border-black' : 'bg-white text-gray-400 hover:border-gray-200'}`}>
                                {s === 'offplan' ? 'Off-plan' : s === 'rental' ? 'Аренда' : 'Flip'}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
            <div className="w-full lg:w-2/5 bg-[#121212] p-6 md:p-10 lg:p-16 text-white flex flex-col justify-between">
                <div className="text-left mb-8 lg:mb-0">
                    <p className="text-[9px] md:text-[10px] uppercase font-bold text-white/40 tracking-[0.3em] mb-2 md:mb-4">ROI (Прогноз)</p>
                    <p className="text-5xl md:text-6xl font-montserrat font-bold gold-text leading-none transition-all duration-700">{(config.roi * 100).toFixed(0)}%</p>
                </div>
                <div className="space-y-3 md:space-y-4 pt-6 md:pt-8 border-t border-white/10 text-left">
                    <div className="flex justify-between items-center">
                        <span className="text-white/40 text-[10px] md:text-[11px] uppercase font-bold tracking-widest">Прибыль</span>
                        <span className="text-lg md:text-xl font-bold transition-all duration-700">${profit.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-white/40 text-[10px] md:text-[11px] uppercase font-bold tracking-widest">Срок</span>
                        <span className="text-lg md:text-xl font-bold transition-all duration-700">{config.term}</span>
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
        const stars = Array.from({length: 100}, () => ({
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
                        className="relative z-10 text-center px-6 flex flex-col items-center"
                    >
                        <div className="font-cormorant text-3xl md:text-6xl font-bold uppercase text-white tracking-[0.3em] md:tracking-[0.4em] mb-2 flex justify-center overflow-hidden">
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
                            animate={phase >= 2 ? { width: '140px', opacity: 1 } : {}}
                            transition={{ duration: 1, ease: [0.65, 0, 0.35, 1] }}
                            className="h-px mx-auto mt-4 md:mt-6 md:!w-[180px]"
                            style={{ background: 'linear-gradient(90deg, transparent, #C5A059, transparent)', boxShadow: '0 0 15px rgba(197, 160, 89, 0.4)' }}
                        />
                        
                        <motion.div 
                            initial={{ opacity: 0, y: 10 }}
                            animate={phase >= 2 ? { opacity: 1, y: 0 } : {}}
                            transition={{ duration: 1 }}
                            className="text-[7px] md:text-[8px] tracking-[2em] ml-2 md:ml-3 text-white/30 mt-6 md:mt-8 uppercase font-bold"
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
        <div className="pt-32 pb-16 md:pt-40 md:pb-24 px-5 md:px-8 bg-[#FBFBFB] min-h-screen">
            <Helmet>
                <title>{seo.title}</title>
                <meta name="description" content={seo.description} />
            </Helmet>

            <div className="max-w-7xl mx-auto text-center">
                <h1 className="font-cormorant text-4xl md:text-5xl lg:text-7xl font-bold mb-4 md:mb-6 text-[#121212]">{seo.heading}</h1>
                <p className="max-w-2xl mx-auto text-gray-500 mb-8 md:mb-10 text-sm md:text-lg px-2">{seo.subtitle}</p>

                {seo.seoText && (
                    <div className="max-w-4xl mx-auto mb-12 md:mb-16 text-left border-l-2 border-[#C5A059] pl-4 md:pl-6 mx-2">
                        <p className="text-gray-600 font-raleway leading-relaxed text-sm md:text-base">{seo.seoText}</p>
                    </div>
                )}

                {showValuationBtn && (
                    <div className="flex justify-center mb-12 md:mb-16 px-2">
                        <button type="button" onClick={() => navigate('/valuation')} className="btn-premium px-8 md:px-16 py-4 md:py-5 border border-[#C5A059] text-[#121212] font-bold uppercase tracking-widest text-[10px] md:text-xs hover:bg-[#C5A059] hover:text-white transition-colors w-full md:w-auto">
                            Оценить недвижимость
                        </button>
                    </div>
                )}

                {category !== 'plots' && category !== 'empty' && <MortgageInfo />}

                {showBeds && (
                    <div className="flex flex-wrap justify-center gap-2 md:gap-4 mb-10 md:mb-16">
                        {['all', '1', '2', '3'].map(bed => (
                            <button type="button" key={bed} onClick={() => setActiveBed(bed)} className={`px-6 py-2 md:px-8 md:py-3 text-[9px] md:text-[10px] uppercase font-bold border transition-all duration-300 ${activeBed === bed ? 'bg-[#121212] text-white border-[#121212]' : 'bg-white text-gray-400 border-gray-200 hover:border-[#C5A059]'}`}>
                                {bed === 'all' ? 'Все объекты' : `${bed} Bedroom`}
                            </button>
                        ))}
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
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
                                    <div className="absolute top-3 left-3 md:top-4 md:left-4 bg-black/80 backdrop-blur-md px-2 py-1 md:px-3 md:py-1 text-white text-[8px] md:text-[9px] font-bold uppercase tracking-widest">${item.price}</div>
                                </div>
                                <div className="p-6 md:p-8 flex-grow flex flex-col justify-between">
                                    <div>
                                        <p className="text-gold uppercase tracking-widest text-[8px] md:text-[9px] font-bold mb-1 md:mb-2">{item.location}</p>
                                        <h4 className="font-montserrat font-bold text-base md:text-lg mb-4 md:mb-6 text-[#121212]">{item.title}</h4>
                                    </div>
                                    <button type="button" onClick={onOpenModal} className="btn-premium w-full py-3 md:py-4 text-[9px] md:text-[10px] text-white bg-[#121212] font-bold uppercase tracking-widest mt-auto">Смотреть детали</button>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                    {items.length === 0 && <div className="col-span-1 md:col-span-2 lg:col-span-3 py-16 md:py-20 text-gray-400 italic text-sm md:text-base">По вашему запросу объектов не найдено.</div>}
                </div>
            </div>
        </div>
    );
};

const ValuationPage = () => {
    const seo = seoData.valuation;
    return (
        <div className="pt-32 pb-16 md:pt-40 md:pb-24 px-5 md:px-8 bg-[#121212] text-white min-h-screen flex items-center">
            <Helmet>
                <title>{seo.title}</title>
                <meta name="description" content={seo.description} />
            </Helmet>
            <div className="max-w-4xl mx-auto text-center w-full">
                <h1 className="font-cormorant text-4xl md:text-5xl lg:text-6xl font-bold mb-4 md:mb-6">{seo.heading}</h1>
                <p className="text-white/60 mb-10 md:mb-16 text-sm md:text-lg font-raleway max-w-2xl mx-auto px-2">{seo.subtitle}</p>
                
                <div className="bg-white/5 p-6 md:p-10 lg:p-16 border border-white/10 text-left shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-[#C5A059] opacity-10 blur-[100px] pointer-events-none"></div>
                    <form className="space-y-6 md:space-y-8 relative z-10" onSubmit={e => e.preventDefault()}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                            <div className="space-y-1 md:space-y-2"><label className="text-[9px] md:text-[10px] uppercase font-bold text-white/40 tracking-widest">Локация / Комплекс</label><input type="text" className="w-full bg-transparent border-b border-white/20 p-3 md:p-4 outline-none focus:border-[#C5A059] transition-colors text-sm" placeholder="Dubai Marina" /></div>
                            <div className="space-y-1 md:space-y-2"><label className="text-[9px] md:text-[10px] uppercase font-bold text-white/40 tracking-widest">Площадь (Sq.ft) / Спален</label><input type="text" className="w-full bg-transparent border-b border-white/20 p-3 md:p-4 outline-none focus:border-[#C5A059] transition-colors text-sm" placeholder="1200 sq.ft, 2 BR" /></div>
                            <div className="space-y-1 md:space-y-2"><label className="text-[9px] md:text-[10px] uppercase font-bold text-white/40 tracking-widest">Ваш Email</label><input type="email" className="w-full bg-transparent border-b border-white/20 p-3 md:p-4 outline-none focus:border-[#C5A059] transition-colors text-sm" placeholder="email@example.com" /></div>
                            <div className="space-y-1 md:space-y-2">
                                <label className="text-[9px] md:text-[10px] uppercase font-bold text-white/40 tracking-widest">Телефон / WhatsApp</label>
                                <input 
                                    type="tel" 
                                    onInput={(e) => e.target.value = e.target.value.replace(/[^0-9+]/g, '')}
                                    className="w-full bg-transparent border-b border-white/20 p-3 md:p-4 outline-none focus:border-[#C5A059] transition-colors text-sm" 
                                    placeholder="+971 50..." 
                                />
                            </div>
                        </div>
                        <div className="flex justify-center pt-4 md:pt-8">
                            <button type="submit" className="btn-premium px-12 md:px-24 py-4 md:py-6 bg-[#C5A059] text-white uppercase font-bold text-[10px] md:text-[11px] tracking-widest shadow-2xl w-full md:w-auto">Запросить оценку</button>
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
        <div className="pt-32 pb-16 md:pt-40 md:pb-24 px-5 md:px-8 bg-white min-h-screen">
            <Helmet>
                <title>{seo.title}</title>
                <meta name="description" content={seo.description} />
            </Helmet>
            <div className="max-w-5xl mx-auto">
                <SectionHeading top="Insights & Analytics" main="Блог Alpha Star" />
                <div className="grid gap-16 md:gap-20">
                    {blogPosts.map((post) => (
                        <div key={post.id} className="group grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center border-b border-gray-100 pb-16 md:pb-20">
                            <Link to={`/blog/${post.id}`} className="block aspect-[4/3] bg-gray-50 overflow-hidden shadow-lg order-1 md:order-none relative">
                                {post.img ? (
                                    <img src={post.img} alt={post.alt} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center border border-dashed border-gray-300 group-hover:border-[#C5A059] transition-colors duration-500">
                                        <span className="text-gray-400 text-[10px] uppercase font-bold tracking-widest text-center leading-relaxed">Место для фото<br/>(1200x800)</span>
                                    </div>
                                )}
                            </Link>
                            <div className="text-left order-2 md:order-none">
                                <div className="flex flex-wrap items-center gap-3 md:gap-4 mb-3 md:mb-4">
                                    <span className="gold-text font-bold text-[8px] md:text-[9px] uppercase tracking-widest block">Аналитика рынка</span>
                                    <span className="text-gray-400 flex items-center gap-1 text-[8px] md:text-[9px] uppercase font-bold tracking-widest"><Clock size={12} /> {post.readTime}</span>
                                </div>
                                <Link to={`/blog/${post.id}`} className="block">
                                    <h4 className="font-cormorant text-3xl font-bold mb-4 md:mb-6 group-hover:text-[#C5A059] transition-colors">{post.title}</h4>
                                </Link>
                                <p className="text-gray-500 mb-6 md:mb-8 font-raleway leading-relaxed text-sm md:text-base">{post.excerpt}</p>
                                <Link to={`/blog/${post.id}`} className="text-[#121212] border-b border-[#121212] pb-1 text-[9px] md:text-[10px] font-bold uppercase tracking-widest hover:text-[#C5A059] hover:border-[#C5A059] transition-colors inline-block">Читать статью</Link>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

const BlogPostPage = ({ onOpenModal }) => {
    const { id } = useParams();
    const post = blogPosts.find(p => p.id === id);

    if (!post) {
        return (
            <div className="pt-40 pb-24 text-center min-h-[60vh] flex flex-col items-center justify-center px-5">
                <h1 className="font-cormorant text-3xl md:text-4xl font-bold mb-6">Статья не найдена</h1>
                <Link to="/blog" className="text-[#C5A059] border-b border-[#C5A059] pb-1 uppercase text-[10px] font-bold tracking-widest">Вернуться в блог</Link>
            </div>
        );
    }

    return (
        <div className="pt-28 pb-16 md:pt-32 md:pb-24 bg-white min-h-screen">
            <Helmet>
                <title>{post.title} | Блог Alpha Star</title>
                <meta name="description" content={post.excerpt} />
            </Helmet>

            <article className="max-w-4xl mx-auto px-5 md:px-8">
                <Link to="/blog" className="inline-flex items-center gap-2 text-gray-400 hover:text-[#C5A059] transition-colors mb-8 md:mb-12 text-[9px] md:text-[10px] uppercase font-bold tracking-widest">
                    <ArrowLeft size={14} /> Назад к статьям
                </Link>

                <div className="mb-8 md:mb-12">
                    <div className="flex flex-wrap items-center gap-4 md:gap-6 mb-4 md:mb-6 text-[9px] md:text-[10px] uppercase font-bold tracking-widest text-gray-400">
                        <span className="flex items-center gap-1 md:gap-2 text-[#C5A059]"><Calendar size={14} /> {post.date}</span>
                        <span className="flex items-center gap-1 md:gap-2"><Clock size={14} /> {post.readTime} чтения</span>
                    </div>
                    <h1 className="font-cormorant text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-[#121212]">{post.title}</h1>
                </div>

                <div className="aspect-video w-full mb-10 md:mb-16 overflow-hidden shadow-2xl rounded-sm bg-gray-50">
                    {post.img ? (
                        <img src={post.img} alt={post.alt} className="w-full h-full object-cover" />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center border border-dashed border-gray-300">
                            <span className="text-gray-400 text-[10px] md:text-xs uppercase font-bold tracking-widest text-center leading-relaxed">Главное фото статьи<br/>(1200x800)</span>
                        </div>
                    )}
                </div>

                {/* Контент статьи из HTML строки */}
                <div 
                    className="seo-article text-left"
                    dangerouslySetInnerHTML={{ __html: post.content }}
                />

                <div className="mt-20 pt-10 border-t border-gray-100 text-center">
                    <p className="font-montserrat text-lg font-bold mb-6">Готовы сделать шаг к успешным инвестициям?</p>
                    <button type="button" onClick={onOpenModal} className="btn-premium px-12 py-5 bg-[#121212] text-white uppercase text-[11px] tracking-widest font-bold">
                        Получить консультацию эксперта
                    </button>
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
            <section className="relative h-[100svh] flex items-center justify-center overflow-hidden bg-[#121212] text-white text-left">
                <HeroSlider /><StarField />
                <div className="relative z-30 w-full max-w-7xl px-5 md:px-8">
                    <div className="flex items-center gap-3 md:gap-4 mb-4 justify-center md:justify-start">
                        <div className="w-8 md:w-12 h-px gold-bg"></div>
                        <span className="text-[9px] md:text-[10px] uppercase tracking-[0.3em] md:tracking-[0.5em] gold-text font-bold">Boutique Agency</span>
                    </div>
                    <h1 className="font-montserrat text-[8.5vw] sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold leading-[1.1] mb-6 md:mb-8 uppercase tracking-tight text-center md:text-left">
                        Ваш путь к <br />
                        <span className="relative inline-block mt-1 md:mt-2">
                            <span className="font-cormorant font-medium text-transparent bg-clip-text bg-gradient-to-r from-[#C5A059] via-[#E2C384] to-[#C5A059] drop-shadow-[0_4px_12px_rgba(197,160,89,0.3)]">Недвижимости</span>
                        </span>
                        <br /> в Дубае
                    </h1>
                    <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center md:justify-start mt-8 md:mt-10 px-4 md:px-0">
                        <Link to="/buy/off-plan" className="btn-premium px-8 md:px-12 py-4 md:py-5 bg-[#C5A059] text-white text-[10px] md:text-[11px] font-bold uppercase tracking-[0.2em] md:tracking-[0.25em] text-center shadow-2xl w-full sm:w-auto">Каталог объектов</Link>
                        <button type="button" onClick={() => document.getElementById('guide-section').scrollIntoView({behavior:'smooth'})} className="btn-premium px-8 md:px-12 py-4 md:py-5 bg-white/10 backdrop-blur-md border border-white/20 text-white text-[10px] md:text-[11px] font-bold uppercase tracking-[0.2em] md:tracking-[0.25em] text-center hover:bg-black transition-all lining-nums w-full sm:w-auto">Аналитика 2026</button>
                    </div>
                </div>
            </section>

            {/* 2. О НАС */}
            <section id="about" className="py-16 lg:py-24 bg-white px-5 md:px-8">
                <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-16 items-center">
                    <div className="text-left order-2 lg:order-1">
                        <h2 className="text-[9px] md:text-[10px] font-bold uppercase tracking-[0.4em] md:tracking-[0.5em] gold-text mb-3 md:mb-4 font-montserrat text-center lg:text-left">Кто мы такие?</h2>
                        <h3 className="font-montserrat text-2xl md:text-3xl lg:text-4xl font-bold mb-4 md:mb-6 leading-tight text-center lg:text-left tracking-[0.2em] md:tracking-[0.3em] uppercase">ALPHASTAR PROPERTIES</h3>
                        <p className="text-gray-600 text-base md:text-lg border-l-2 border-[#C5A059] pl-4 md:pl-6 mb-6 md:mb-8 leading-relaxed font-cormorant font-medium">«Мы превращаем недвижимость в инструмент сохранения и приумножения капитала в самом стремительно растущем рынке мира.»</p>
                        <p className="text-gray-400 mb-8 md:mb-10 text-sm md:text-base leading-relaxed font-medium px-2 lg:px-0 text-center lg:text-left">Наше адвокатское сопровождение строится по принципам частного семейного офиса: максимальная конфиденциальность, прямой доступ к off-market активам и контроль каждой стадии сделки.</p>
                        <div className="flex justify-center lg:justify-start">
                            <button type="button" onClick={() => document.getElementById('strategy-section').scrollIntoView({behavior:'smooth'})} className="btn-premium px-12 md:px-24 lg:px-32 py-4 md:py-5 border border-gray-200 text-[#121212] text-[10px] md:text-[11px] font-bold uppercase tracking-[0.2em] md:tracking-[0.25em] hover:bg-gray-50 transition-all w-full md:w-auto">Наш подход</button>
                        </div>
                    </div>
                    <div className="relative order-1 lg:order-2 px-4 sm:px-12 lg:px-0">
                        <div className="hero-mask aspect-[4/5] md:aspect-square lg:aspect-[4/5] overflow-hidden shadow-2xl">
                            <img src="https://images.unsplash.com/photo-1582672060674-bc2bd808a8b5?auto=format&fit=crop&q=80&w=800" alt="Архитектура Дубая премиум класс" className="w-full h-full object-cover" />
                        </div>
                        <div className="absolute -bottom-4 -left-4 md:-bottom-6 md:-left-6 w-32 h-32 md:w-48 md:h-48 bg-[#C5A059]/10 -z-10 rounded-full blur-2xl md:blur-3xl"></div>
                    </div>
                </div>
            </section>

            {/* 2.5. НАГРАДЫ (Светлый дизайн с картинками без подписей) */}
            <section className="py-16 lg:py-24 bg-white px-5 md:px-8 border-y border-gray-100">
                <div className="max-w-7xl mx-auto">
                    <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 md:mb-20 gap-4 md:gap-6">
                        <div className="text-left">
                            <h2 className="text-[9px] md:text-[10px] gold-text uppercase tracking-[0.4em] md:tracking-[0.5em] font-bold font-montserrat mb-3">Наши награды</h2>
                            <h3 className="font-cormorant text-3xl md:text-4xl text-[#121212] font-bold">Признание на высшем уровне</h3>
                        </div>
                        <p className="text-gray-400 text-xs md:text-sm max-w-sm font-raleway leading-relaxed text-left md:text-right hidden sm:block">
                            Наша экспертиза подтверждена ведущими девелоперами и агентствами ОАЭ.
                        </p>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 lg:gap-10">
                        {awardsList.map((award, i) => (
                            <motion.div 
                                key={i}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.8, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
                                className="group flex flex-col items-center w-full"
                            >
                                <div className="w-full aspect-[3/2] sm:aspect-[4/3] relative flex items-center justify-center">
                                    {award.img ? (
                                        <img src={award.img} alt={`Награда ${i + 1}`} className="w-full h-full object-contain filter grayscale opacity-60 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700" />
                                    ) : (
                                        <div className="absolute inset-0 bg-transparent border border-dashed border-gray-200 group-hover:border-[#C5A059] transition-colors duration-500 flex items-center justify-center p-4 rounded-sm">
                                            <span className="text-gray-300 text-[8px] md:text-[10px] uppercase font-bold tracking-widest leading-relaxed text-center">Место для лого<br/>(PNG/JPG)</span>
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* 3. ДВА ВЕКТОРА */}
            <section id="strategy-section" className="py-16 lg:py-24 bg-gray-50 px-5 md:px-8">
                <div className="max-w-7xl mx-auto">
                    <SectionHeading top="Наша стратегия" main="Два вектора успеха" />
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
                        <div className="bg-white p-6 md:p-10 lg:p-14 strategy-card relative overflow-hidden group text-left border border-gray-100">
                            <div className="relative z-10">
                                <Heart size={32} className="gold-text mb-4 md:mb-6 opacity-40 md:w-10 md:h-10" />
                                <h3 className="font-montserrat text-xl md:text-2xl font-bold mb-3 md:mb-4 text-[#121212]">Дом для вашей семьи</h3>
                                <p className="text-gray-500 mb-6 md:mb-10 text-sm md:text-base leading-relaxed">Подбор районов от $300,000 с фокусом на инфраструктуру, лучшие школы и безопасность. Мы найдем место, которое вы назовете домом.</p>
                                <Link to="/buy/villas" className="btn-premium w-full py-3 md:py-4 text-[10px] md:text-[11px] font-bold uppercase tracking-widest border border-gray-200 hover:bg-black hover:text-white transition-all text-[#121212]">Подобрать локацию</Link>
                            </div>
                            <HomeIcon size={150} className="absolute -bottom-10 -right-10 md:-bottom-16 md:-right-16 text-[#121212]/[0.02] -rotate-12 group-hover:scale-110 transition-transform md:w-[200px] md:h-[200px]" />
                        </div>
                        <div className="bg-[#121212] p-6 md:p-10 lg:p-14 strategy-card relative overflow-hidden group text-left">
                            <div className="relative z-10 text-white">
                                <TrendingUp size={32} className="gold-text mb-4 md:mb-6 opacity-40 md:w-10 md:h-10" />
                                <h3 className="font-montserrat text-xl md:text-2xl font-bold mb-3 md:mb-4 tracking-tight">Инвестиционный капитал</h3>
                                <p className="text-white/50 mb-6 md:mb-10 text-sm md:text-base leading-relaxed font-light">Стратегии от $300,000. Формируем арендный доход и капитализацию объектов в самых ликвидных зонах Дубая.</p>
                                <Link to="/buy/invest" className="btn-premium w-full py-3 md:py-4 text-[10px] md:text-[11px] font-bold uppercase tracking-widest bg-[#C5A059] text-white hover:bg-[#b08d4a] transition-all">Инвест-пакеты</Link>
                            </div>
                            <Coins size={150} className="absolute -bottom-10 -right-10 md:-bottom-16 md:-right-16 text-white/[0.03] -rotate-12 group-hover:scale-110 transition-transform md:w-[200px] md:h-[200px]" />
                        </div>
                    </div>
                </div>
            </section>

            {/* 4. КОНТРОЛЬ НА КАЖДОМ ЭТАПЕ */}
            <section id="process" className="py-16 lg:py-24 bg-[#121212] text-white px-5 md:px-8">
                <div className="max-w-7xl mx-auto">
                    <SectionHeading top="План работы" main="Контроль на каждом этапе" light={true} />
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

            {/* 5. ОБНОВЛЕННЫЕ КЕЙСЫ ДОСЬЕ */}
            <section id="real-deals" className="py-20 lg:py-32 bg-[#FBFBFB] px-5 md:px-8 overflow-hidden text-left">
                <div className="max-w-7xl mx-auto">
                    <div className="mb-12 md:mb-24 text-center">
                        <h3 className="font-cormorant text-4xl md:text-5xl lg:text-6xl uppercase font-bold text-[#121212]">Реальные сделки</h3>
                    </div>
                    
                    <div className="space-y-8 md:space-y-12">
                        {caseStudies.map((item, i) => (
                            <div key={i} className="bg-white shadow-[0_10px_40px_rgba(0,0,0,0.03)] hover:shadow-[0_20px_60px_rgba(197,160,89,0.12)] transition-all duration-700 group border border-gray-50 flex flex-col lg:flex-row overflow-hidden hover:-translate-y-1 rounded-sm">
                                <div className="w-full lg:w-2/5 bg-[#0A0A0A] aspect-video md:aspect-[4/3] lg:aspect-auto flex flex-col items-center justify-center relative overflow-hidden p-6 md:p-8 min-h-[200px]">
                                    {item.img ? (
                                        <>
                                            <img src={item.img} alt={item.title} className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000 opacity-90" />
                                            <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-700"></div>
                                        </>
                                    ) : (
                                        <>
                                            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-[#C5A059]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                                            <span className="font-cormorant text-white/20 text-3xl md:text-4xl lg:text-5xl tracking-[0.3em] lg:tracking-[0.4em] uppercase group-hover:scale-105 transition-transform duration-700 relative z-10 text-center font-bold">Private</span>
                                            <span className="font-montserrat text-[#C5A059] text-[8px] md:text-[9px] uppercase tracking-[0.2em] lg:tracking-[0.3em] mt-3 md:mt-4 opacity-50 group-hover:opacity-100 transition-opacity relative z-10">Confidential Asset</span>
                                        </>
                                    )}
                                </div>
                                <div className="w-full lg:w-3/5 p-6 md:p-10 lg:p-14 flex flex-col justify-center relative bg-white">
                                    <div className="flex flex-col sm:flex-row sm:items-start justify-between mb-6 md:mb-8 gap-4 md:gap-6">
                                        <div>
                                            <h4 className="font-montserrat text-[9px] md:text-[10px] gold-text uppercase font-bold tracking-[0.3em] lg:tracking-[0.4em] mb-2 md:mb-3">{item.location}</h4>
                                            <h3 className="font-cormorant text-2xl md:text-3xl lg:text-4xl font-bold text-[#121212] mb-2 md:mb-3">{item.title}</h3>
                                            <p className="text-gray-400 text-[9px] md:text-[10px] font-bold uppercase tracking-widest">{item.project}</p>
                                        </div>
                                        <div className="sm:text-right bg-gray-50 sm:bg-transparent p-4 sm:p-0 rounded-sm flex flex-row sm:flex-col items-center sm:items-end justify-between sm:justify-start">
                                            <span className="text-[8px] md:text-[9px] uppercase font-bold text-gray-400 tracking-widest block sm:mb-1">Total ROI</span>
                                            <span className="text-xl md:text-2xl lg:text-3xl font-montserrat font-bold gold-text lining-nums">{item.roi}</span>
                                        </div>
                                    </div>
                                    
                                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 mb-8 md:mb-12 bg-gray-50/50 p-4 md:p-6 border border-gray-50 rounded-sm">
                                        <div className="flex-1 w-full flex justify-between sm:block">
                                            <span className="text-[8px] md:text-[9px] uppercase font-bold text-gray-400 tracking-widest block mb-1 sm:mb-2">Вход (Ланч)</span>
                                            <span className="text-sm md:text-lg lg:text-xl font-montserrat font-bold text-[#121212] lining-nums">{item.launch}</span>
                                        </div>
                                        <div className="hidden sm:block w-8 md:w-16 lg:w-24 h-px bg-gray-300 relative mx-2">
                                            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 border-t border-r border-[#C5A059] rotate-45"></div>
                                        </div>
                                        <div className="w-full sm:hidden h-px bg-gray-200 my-1"></div>
                                        <div className="flex-1 w-full sm:text-right md:text-left flex justify-between sm:block">
                                            <span className="text-[8px] md:text-[9px] uppercase font-bold gold-text tracking-widest block mb-1 sm:mb-2">Выход (Продажа)</span>
                                            <span className="text-sm md:text-lg lg:text-xl font-montserrat font-bold text-[#121212] lining-nums">{item.now}</span>
                                        </div>
                                    </div>
                                    
                                    <div className="mt-auto pt-4 md:pt-6 border-t border-gray-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                                        <span className="text-[9px] md:text-[10px] text-gray-400 uppercase tracking-widest font-bold flex items-center gap-2">
                                            <ShieldCheck size={14} className="text-[#C5A059] flex-shrink-0" /> Цикл завершен
                                        </span>
                                        <button type="button" onClick={onOpenModal} className="text-[9px] md:text-[10px] font-bold uppercase tracking-widest text-[#121212] hover:text-[#C5A059] border-b border-[#121212] hover:border-[#C5A059] pb-1 transition-all flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-start">
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
            <section className="py-16 lg:py-24 bg-white px-5 md:px-8">
                <div className="max-w-7xl mx-auto">
                    <InvestmentCalculator />
                </div>
            </section>

            {/* 7. АНАЛИТИКА */}
            <section id="guide-section" className="py-16 lg:py-24 bg-white px-5 md:px-8">
                <div className="max-w-7xl mx-auto bg-[#C5A059] rounded-sm p-6 md:p-10 lg:p-16 text-white flex flex-col lg:flex-row items-center gap-8 lg:gap-12 relative overflow-hidden text-left">
                    <div className="absolute top-0 right-0 w-1/2 h-full opacity-10 pointer-events-none hidden md:block">
                        <Globe size={300} className="translate-x-1/2 -translate-y-1/4 lg:w-[400px] lg:h-[400px]" />
                    </div>
                    <div className="w-full lg:w-2/3 relative z-10 text-left">
                        <h3 className="font-cormorant text-3xl md:text-4xl lg:text-5xl font-bold mb-4 md:mb-6 lining-nums">Аналитический отчет 2026</h3>
                        <p className="mb-6 md:mb-10 opacity-90 text-sm md:text-lg leading-relaxed max-w-lg font-raleway text-left">Узнайте, какие районы Дубая покажут рост в 25% за следующий год и как избежать типичных ошибок при покупке.</p>
                        <div className="flex flex-col sm:flex-row gap-3 md:gap-4">
                            <input type="email" placeholder="Ваш Email" className="bg-white/20 border border-white/30 p-4 md:p-5 px-5 md:px-6 outline-none placeholder:text-white/60 flex-grow text-white font-montserrat rounded-sm transition-all focus:bg-white/30 text-sm" />
                            <button type="button" className="btn-premium !bg-[#121212] !text-white whitespace-nowrap !py-4 px-8 md:px-12 uppercase tracking-widest font-bold text-xs">
                                <span className="flex items-center justify-center gap-2 md:gap-3">Получить гайд <Download size={14} className="md:w-4 md:h-4" /></span>
                            </button>
                        </div>
                    </div>
                    <div className="w-full lg:w-1/3 flex justify-center relative h-64 md:h-80 mt-8 lg:mt-0 hidden sm:flex">
                        <div className="absolute w-40 md:w-48 h-56 md:h-64 bg-[#121212] shadow-2xl border-4 border-white/10 p-5 md:p-6 flex flex-col justify-between z-10 -rotate-12 translate-x-[-20px] md:translate-x-[-40px]">
                            <span className="text-[6px] md:text-[7px] gold-text uppercase font-bold">Guide 2026</span>
                            <h5 className="font-cormorant text-sm md:text-base font-bold">Top Locations</h5>
                        </div>
                        <div className="absolute w-44 md:w-52 h-64 md:h-72 bg-[#121212] shadow-2xl border-8 border-white p-6 md:p-8 flex flex-col justify-between z-30 rotate-3 translate-x-[20px] md:translate-x-0">
                            <div className="flex flex-col gap-2">
                                <span className="text-[8px] md:text-[10px] gold-text uppercase font-bold tracking-[0.2em] md:tracking-[0.3em]">Инвест-гайд</span>
                                <h5 className="font-cormorant text-xl md:text-2xl leading-tight lining-nums font-bold">Dubai 2026</h5>
                            </div>
                            <div className="h-0.5 w-10 md:w-12 gold-bg"></div>
                        </div>
                    </div>
                </div>
            </section>

            {/* 7.5. ОТЗЫВЫ */}
            <section className="py-20 lg:py-32 bg-[#FBFBFB] px-5 md:px-8 text-left">
                <div className="max-w-7xl mx-auto">
                    <SectionHeading main="Что говорят наши клиенты" />
                    <motion.div 
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"
                        initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.1 }}
                        variants={{ hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.15 } } }}
                    >
                        {testimonials.map((t, i) => (
                            <motion.div 
                                key={i} variants={{ hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } } }}
                                className="bg-white p-6 md:p-8 lg:p-10 shadow-[0_10px_30px_rgba(0,0,0,0.02)] hover:shadow-[0_20px_50px_rgba(197,160,89,0.12)] transition-all duration-500 relative group flex flex-col h-full border border-gray-50 hover:-translate-y-1 rounded-sm"
                            >
                                <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-[#C5A059] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                                
                                <div className="flex items-center gap-3 md:gap-4 mb-4 md:mb-6 border-b border-gray-100 pb-4 md:pb-6 relative z-10">
                                    <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-[#121212] flex items-center justify-center text-[#C5A059] font-cormorant font-bold text-lg md:text-xl shadow-inner flex-shrink-0">
                                        {t.initial}
                                    </div>
                                    <div>
                                        <h5 className="font-montserrat font-bold text-[#121212] text-[10px] md:text-xs uppercase tracking-widest mb-1">{t.name}</h5>
                                        <span className="text-[8px] md:text-[9px] text-gray-400 uppercase tracking-widest font-bold">{t.role}</span>
                                    </div>
                                </div>
                                
                                <p className="text-gray-600 font-cormorant text-base md:text-lg leading-relaxed mb-6 md:mb-8 flex-grow relative z-10">
                                    "{t.text}"
                                </p>
                                
                                <div className="mt-auto flex items-center justify-between relative z-10">
                                    <Quote className="text-[#C5A059] w-6 h-6 md:w-8 md:h-8 opacity-20 group-hover:opacity-60 transition-opacity duration-500" />
                                    <div className="flex gap-0.5 text-[#C5A059]">{[1,2,3,4,5].map(star => <Star key={star} size={10} className="md:w-3 md:h-3" fill="currentColor" />)}</div>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* 8. FAQ */}
            <section className="py-16 lg:py-24 bg-white px-5 md:px-8 text-left" itemScope itemType="https://schema.org/FAQPage">
                <div className="max-w-3xl mx-auto">
                    <SectionHeading top="FAQ" main="Вопросы и ответы" />
                    <div className="border-t border-gray-100">
                        {faqs.map((faq, i) => <FAQItem key={i} {...faq} />)}
                    </div>
                </div>
            </section>

            {/* 9. ФОРМА КОНТАКТОВ */}
            <section id="contact-form" className="py-16 lg:py-24 bg-[#f9f9f9] px-5 md:px-8 text-center overflow-visible">
                <LeadForm title="Связаться с нами" subtitle="Сценарий вашей прибыли: от выбора объекта до выхода из сделки" />
            </section>
        </div>
    );
};

// --- APP WRAPPER WITH ROUTER & HEADER ---
const AppContent = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [scrolled, setScrolled] = useState(false);
    const [showTopBtn, setShowTopBtn] = useState(false);
    const [isContactModalOpen, setIsContactModalOpen] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
            setShowTopBtn(window.scrollY > 500);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const isHome = location.pathname === '/';
    const headerClass = isHome 
        ? (scrolled ? 'bg-white text-[#121212] shadow-md py-3 md:py-4' : 'bg-transparent text-white py-4 md:py-6') 
        : 'bg-[#0A0A0A] text-white shadow-lg py-3 md:py-4 border-b border-white/5';

    const handleNav = (path, anchor) => {
        setIsMobileMenuOpen(false);
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
                <div className="max-w-7xl mx-auto px-5 md:px-8 flex justify-between items-center">
                    <Link to="/" className="flex flex-col cursor-pointer" onClick={() => setIsMobileMenuOpen(false)}>
                        <span className="font-cormorant text-xl md:text-2xl lg:text-3xl font-bold tracking-[0.15em] uppercase">ALPHA<span className="gold-text">STAR</span></span>
                        <span className="text-[6px] md:text-[7px] lg:text-[8px] tracking-[0.4em] lg:tracking-[0.55em] font-bold uppercase gold-text -mt-1 text-left">PROPERTIES</span>
                    </Link>
                    
                    {/* Desktop Navigation */}
                    <nav className="hidden lg:flex items-center space-x-8 xl:space-x-10 text-[10px] font-bold uppercase tracking-widest">
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

                        <button type="button" onClick={() => setIsContactModalOpen(true)} className="btn-premium bg-[#C5A059] text-white px-6 xl:px-8 py-3 text-[9px] xl:text-[10px] uppercase font-bold tracking-widest shadow-lg">Связаться с нами</button>
                    </nav>

                    {/* Mobile Hamburger Button */}
                    <button 
                        type="button" 
                        className="lg:hidden text-current hover:text-[#C5A059] transition-colors p-2 -mr-2"
                        onClick={() => setIsMobileMenuOpen(true)}
                    >
                        <Menu size={24} className="md:w-7 md:h-7" />
                    </button>
                </div>
            </header>

            {/* MOBILE MENU FULLSCREEN */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: 'tween', duration: 0.3, ease: 'easeInOut' }}
                        className="fixed inset-0 bg-[#0A0A0A] z-[2000] flex flex-col px-6 py-8 overflow-y-auto"
                    >
                        <div className="flex justify-between items-center mb-10">
                            <div className="flex flex-col cursor-pointer text-white">
                                <span className="font-cormorant text-2xl font-bold tracking-[0.15em] uppercase">ALPHA<span className="gold-text">STAR</span></span>
                            </div>
                            <button onClick={() => setIsMobileMenuOpen(false)} className="text-white/50 hover:text-[#C5A059] p-2 -mr-2 bg-white/5 rounded-full">
                                <X size={24} />
                            </button>
                        </div>

                        <nav className="flex flex-col gap-8 text-white font-montserrat">
                            <div className="border-b border-white/10 pb-6">
                                <span className="gold-text text-[10px] uppercase tracking-widest font-bold mb-4 block opacity-70">Купить</span>
                                <div className="flex flex-col gap-4 pl-2 text-sm font-semibold tracking-wide">
                                    <Link to="/buy/off-plan" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-[#C5A059] transition-colors">Новостройки</Link>
                                    <Link to="/buy/secondary" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-[#C5A059] transition-colors">Вторичное жилье</Link>
                                    <Link to="/buy/villas" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-[#C5A059] transition-colors">Виллы и Таунхаусы</Link>
                                    <Link to="/buy/invest" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-[#C5A059] transition-colors">Инвестиции</Link>
                                    <Link to="/buy/commercial" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-[#C5A059] transition-colors">Коммерция</Link>
                                </div>
                            </div>

                            <div className="border-b border-white/10 pb-6">
                                <span className="gold-text text-[10px] uppercase tracking-widest font-bold mb-4 block opacity-70">Аренда</span>
                                <div className="flex flex-col gap-4 pl-2 text-sm font-semibold tracking-wide">
                                    <Link to="/rent/apartments" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-[#C5A059] transition-colors">Апартаменты</Link>
                                    <Link to="/rent/villas" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-[#C5A059] transition-colors">Виллы</Link>
                                </div>
                            </div>

                            <div className="pb-4">
                                <span className="gold-text text-[10px] uppercase tracking-widest font-bold mb-4 block opacity-70">Компания</span>
                                <div className="flex flex-col gap-4 pl-2 text-sm font-semibold tracking-wide">
                                    <span onClick={() => handleNav('/', 'about')} className="cursor-pointer hover:text-[#C5A059] transition-colors">О нас</span>
                                    <Link to="/blog" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-[#C5A059] transition-colors">Аналитика рынка</Link>
                                    <Link to="/valuation" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-[#C5A059] transition-colors gold-text">Оценка недвижимости</Link>
                                </div>
                            </div>

                            <button type="button" onClick={() => { setIsMobileMenuOpen(false); setIsContactModalOpen(true); }} className="btn-premium bg-[#C5A059] text-white py-5 mt-2 text-xs uppercase tracking-widest font-bold shadow-lg w-full">
                                Оставить заявку
                            </button>
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
                        
                        <Route path="/rent/apartments" element={<PageWrapper><ListingPage category="apartments_rent" onOpenModal={() => setIsContactModalOpen(true)} /></PageWrapper>} />
                        <Route path="/rent/villas" element={<PageWrapper><ListingPage category="villas" onOpenModal={() => setIsContactModalOpen(true)} /></PageWrapper>} />
                        <Route path="/rent/commercial" element={<PageWrapper><ListingPage category="commercial" onOpenModal={() => setIsContactModalOpen(true)} /></PageWrapper>} />
                        
                        <Route path="/valuation" element={<PageWrapper><ValuationPage /></PageWrapper>} />
                        <Route path="/blog" element={<PageWrapper><BlogPage /></PageWrapper>} />
                        <Route path="/blog/:id" element={<PageWrapper><BlogPostPage onOpenModal={() => setIsContactModalOpen(true)} /></PageWrapper>} />
                    </Routes>
                </AnimatePresence>
            </main>

            {/* ФУТЕР */}
            <footer className="bg-[#0A0A0A] text-white pt-16 md:pt-24 pb-8 md:pb-12 px-5 md:px-8 relative overflow-hidden border-t border-white/5">
                <div className="absolute top-0 right-0 w-1/3 h-full bg-[#C5A059]/5 blur-[120px] pointer-events-none"></div>
                <div className="max-w-7xl mx-auto relative z-10 text-left">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 md:gap-16 mb-16 md:mb-20 text-left">
                        <div className="lg:col-span-5 space-y-6 md:space-y-8 text-left">
                            <div className="flex flex-col text-left">
                                <span className="font-cormorant text-2xl md:text-3xl font-bold tracking-[0.15em] uppercase">ALPHA<span className="gold-text">STAR</span></span>
                                <span className="text-[7px] md:text-[9px] tracking-[0.7em] md:tracking-[0.8em] font-bold uppercase gold-text -mt-1 ml-1 text-left">PROPERTIES</span>
                            </div>
                            <p className="text-white/40 text-sm md:text-base leading-relaxed max-w-md font-medium font-cormorant border-l border-[#C5A059] pl-4 md:pl-6 text-left">Мы защищаем ваш капитал и создаем преимущество на самом динамичном рынке мира.</p>
                            
                            {/* Иконки соцсетей */}
                            <div className="flex items-center gap-4 pt-4">
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
                        <div className="lg:col-span-3 space-y-6 md:space-y-8 text-left hidden md:block">
                            <h6 className="font-montserrat text-[9px] md:text-[10px] font-bold uppercase tracking-[0.4em] md:tracking-[0.5em] gold-text">Навигация</h6>
                            <ul className="space-y-3 md:space-y-4 text-xs md:text-sm font-bold uppercase tracking-widest text-white/30 text-left">
                                <li><span onClick={() => handleNav('/', 'about')} className="hover:text-white transition-colors cursor-pointer block">О компании</span></li>
                                <li><span onClick={() => handleNav('/', 'real-deals')} className="hover:text-white transition-colors cursor-pointer block">Кейсы</span></li>
                                <li><Link to="/buy/off-plan" className="hover:text-white transition-colors cursor-pointer block">Объекты</Link></li>
                            </ul>
                        </div>
                        <div className="lg:col-span-4 space-y-6 md:space-y-8 text-left">
                            <h6 className="font-montserrat text-[9px] md:text-[10px] font-bold uppercase tracking-[0.4em] md:tracking-[0.5em] gold-text">Контакты</h6>
                            <div className="space-y-5 md:space-y-6 text-left">
                                <div className="flex items-start gap-4 text-left"><MapPin className="gold-text mt-1 flex-shrink-0" size={18} /><p className="text-white/60 text-[10px] md:text-xs font-medium uppercase tracking-wider text-left">Palm Jumeirah, Shoreline 10, <br/>Dubai, UAE</p></div>
                                <div className="flex items-center gap-4 group cursor-pointer text-left"><Phone className="gold-text flex-shrink-0" size={18} /><p className="text-white font-montserrat font-bold text-lg md:text-xl tracking-tighter group-hover:text-[#C5A059] transition-colors text-left">+971 50 000 0000</p></div>
                                <div className="flex items-center gap-4 group cursor-pointer text-left"><Mail className="gold-text flex-shrink-0" size={18} /><p className="text-white/60 font-bold uppercase text-[9px] md:text-[10px] tracking-[0.2em] md:tracking-[0.3em] group-hover:text-white transition-colors text-left break-all">office@alphastar.ae</p></div>
                            </div>
                        </div>
                    </div>
                    <div className="pt-6 md:pt-8 border-t border-white/5 text-[8px] md:text-[9px] uppercase font-bold tracking-[0.3em] md:tracking-[0.4em] text-white/20 text-center md:text-left">
                        © 2026 Alpha Star Properties. Все права защищены.
                    </div>
                </div>
            </footer>

            <div className="fixed bottom-4 right-4 md:bottom-6 md:right-6 z-[1500] flex flex-col gap-3">
                <AnimatePresence>
                    {showTopBtn && (
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.5, y: 20 }} 
                            animate={{ opacity: 1, scale: 1, y: 0 }} 
                            exit={{ opacity: 0, scale: 0.5, y: 20 }} 
                            transition={{ duration: 0.3 }}
                        >
                            <button type="button" onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})} className="w-10 h-10 md:w-12 md:h-12 bg-[#121212] text-[#C5A059] border border-white/10 rounded-full flex items-center justify-center shadow-lg hover:bg-[#C5A059] hover:text-white active:scale-95 transition-all mx-auto">
                                <ArrowUp size={20} className="md:w-6 md:h-6" />
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>
                <button type="button" onClick={() => setIsContactModalOpen(true)} className="w-12 h-12 md:w-14 md:h-14 bg-[#C5A059] text-white rounded-full flex items-center justify-center shadow-2xl hover:scale-110 active:scale-95 transition-transform duration-300">
                    <MessageCircle size={24} className="md:w-7 md:h-7" />
                </button>
            </div>
        </>
    );
};

export default function App() {
    return (
        <HelmetProvider>
            <Helmet>
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
                <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600;700&family=Montserrat:wght@300;400;500;600;700&family=Raleway:wght@300;400;500;600&display=block" rel="stylesheet" />
            </Helmet>
            <Router>
                <style>{styles}</style>
                <AppContent />
            </Router>
        </HelmetProvider>
    );
}
