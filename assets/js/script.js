document.addEventListener('DOMContentLoaded', () => {

    // --- 1. Демонстрационные данные ---
    const mockDatabase = [
        { type: 'category', name: 'Медицинские центрифуги', count: 247, url: '/category/centrifugi' },
        { type: 'category', name: 'Магнитные мешалки', count: 153, url: '/category/meshalki' },
        { type: 'category', name: 'Негатоскопы', count: 89, url: '/category/negatoskopy' },
        { type: 'product', name: 'Штатив для дозаторов ТАГЛЕР', category: 'Лабораторное оборудование', price: 5904, oldPrice: 6541, imageUrl: './assets/img/image 1819.png', url: '/product/shtativ-tagler' },
        { type: 'product', name: 'Центрифуга медицинская СМ-6МТ', category: 'Медицинские центрифуги', price: 25000, oldPrice: 27500, imageUrl: './assets/img/image 1819.png', url: '/product/cm-6mt' },
        { type: 'product', name: 'Мешалка магнитная Tagler ММ-2', category: 'Магнитные мешалки', price: 8300, oldPrice: null, imageUrl: './assets/img/image 1819.png', url: '/product/mm-2' },
    ];

    // Демонстрационные данные для истории поиска
    const searchHistory = [
        'УФ облучатели рециркуляторы',
        'Негатоскопы',
        'Инакваторы сыворотки'
    ];


    // --- 2. Получаем ссылки на DOM-элементы ---
    const searchInput = document.getElementById('search-input');
    const searchResultsContainer = document.getElementById('search-results');
    const searchWrapper = document.querySelector('.search-wrapper');

    // --- 3. Функция для отрисовки НАЙДЕННЫХ результатов ---
    function renderResults(results) {
        // Очищаем контейнер перед новой отрисовкой
        searchResultsContainer.innerHTML = '';

        results.forEach(item => {
            let resultElement;
            if (item.type === 'category') {
                resultElement = `
                    <a href="${item.url}" class="result-item category">
                        <div class="category-title">
                            <img src="./assets/img/Vectord.svg" alt="search icon" />
                            <span>${item.name}</span>
                        </div>
                        <div class="category-count">${item.count} товаров</div>
                    </a>
                `;
            } else if (item.type === 'product') {
                resultElement = `
                    <a href="${item.url}" class="result-item product">
                        <img src="${item.imageUrl}" alt="${item.name}" class="product-image">
                        <div class="product-info">
                             <div class="product-category">${item.category}</div>
                             <div class="product-title">${item.name}</div>
                        </div>
                        <div class="product-details">
                            <div class="product-price">
                                <span class="current-price">${item.price.toLocaleString('ru-RU')} руб.</span>
                                ${item.oldPrice ? `<span class="old-price">${item.oldPrice.toLocaleString('ru-RU')} руб. <img src="./assets/img/Group 3.svg" /> </span>` : ''}
                            </div>
                            <button class="product-add-btn" data-product-id="123">Добавить в заказ</button>
                        </div>
                    </a>
                `;
            }
            searchResultsContainer.innerHTML += resultElement;
        });

        searchResultsContainer.classList.add('visible');
    }

    // --- НОВАЯ ФУНКЦИЯ для отрисовки состояния "Ничего не найдено" ---
    function renderNotFound() {
        // Создаем HTML для тегов истории поиска
        const historyTagsHTML = searchHistory
            .map(tag => `<button class="search-history-tag">${tag}</button>`)
            .join('');

        const notFoundHTML = `
            <div class="no-results-container">
                <div class="search-history">
                    <p class="search-history-title">Вы искали:</p>
                    <div class="search-history-tags">
                        ${historyTagsHTML}
                    </div>
                </div>
                <div class="no-results-message">
                    <img src="./assets/img/warning-2.svg" />
                    <span>Товаров по вашему запросу не найдено</span>
                </div>
            </div>
        `;

        searchResultsContainer.innerHTML = notFoundHTML;
        searchResultsContainer.classList.add('visible');
    }


    // --- 4. Обработчик ввода в поле поиска (ОБНОВЛЕН) ---
    searchInput.addEventListener('input', (event) => {
        const query = event.target.value.trim().toLowerCase();

        if (query.length < 2) { // Начинаем поиск, если введено 2 или больше символов
            searchResultsContainer.classList.remove('visible');
            return;
        }

        // Фильтруем нашу "базу данных"
        const filteredResults = mockDatabase.filter(item =>
            item.name.toLowerCase().includes(query)
        );

        // В зависимости от результата вызываем нужную функцию
        if (filteredResults.length > 0) {
            renderResults(filteredResults);
        } else {
            renderNotFound();
        }
    });

    // --- 5. Закрытие выпадающего списка при клике вне его области ---
    document.addEventListener('click', (event) => {
        // Проверяем, был ли клик внутри компонента поиска
        if (!searchWrapper.contains(event.target)) {
            searchResultsContainer.classList.remove('visible');
        }
    });

    // Предотвращаем закрытие списка при клике на его элементы
    searchResultsContainer.addEventListener('click', (event) => {
        if (event.target.classList.contains('product-add-btn')) {
            event.preventDefault(); // Отменяем переход по ссылке родителя <a>
            console.log('Добавлен товар:', event.target.dataset.productId);
            // Здесь может быть ваша логика добавления товара в корзину
        }
        // Можно добавить логику для кнопок истории
        if (event.target.classList.contains('search-history-tag')) {
            const query = event.target.textContent;
            console.log('Клик по тегу истории:', query);
            searchInput.value = query; // Вставляем текст тега в инпут
            searchInput.dispatchEvent(new Event('input')); // Имитируем событие ввода для запуска поиска
        }
    });

    const dropdownWrapper = document.querySelector('.footer-dropdown-wrapper');
    const dropdownTrigger = document.getElementById('footer-dropdown');
    const dropdownMenu = document.getElementById('footer-dropdown-menu');

    if (dropdownWrapper && dropdownTrigger && dropdownMenu) {

        // Показываем меню, когда мышь входит в область обертки
        dropdownWrapper.addEventListener('mouseenter', () => {
            dropdownMenu.classList.add('visible');
            dropdownTrigger.setAttribute('aria-expanded', 'true');
        });

        // Скрываем меню, когда мышь покидает область обертки
        dropdownWrapper.addEventListener('mouseleave', () => {
            dropdownMenu.classList.remove('visible');
            dropdownTrigger.setAttribute('aria-expanded', 'false');
        });
    }
});