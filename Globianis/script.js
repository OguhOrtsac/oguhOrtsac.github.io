// Constantes y configuración global
const CONFIG = {
    WHATSAPP_PHONE: '+XXXXXXXXXX', // Número de WhatsApp
    BALLOON_ANIMATION_INTERVAL: 5000, // Intervalo de explosión de globos
    MAX_FLOATING_BALLOONS: 15 // Máximo de globos flotantes
};

// Funciones de utilidad
const util = {
    // Genera un número aleatorio entre min y max
    randomBetween: (min, max) => Math.random() * (max - min) + min,

    // Crea un elemento HTML de manera sencilla
    createElement: (tag, classes = [], content = '') => {
        const element = document.createElement(tag);
        element.classList.add(...classes);
        element.innerHTML = content;
        return element;
    },

    // Formatear precio
    formatPrice: (price) => `$${price.toFixed(2)}`,

    // Generar enlace de WhatsApp
    getWhatsAppLink: (message) => {
        const encodedMessage = encodeURIComponent(message);
        return `https://wa.me/${CONFIG.WHATSAPP_PHONE}?text=${encodedMessage}`;
    }
};

// Gestión de productos
class ProductManager {
    constructor() {
        this.productos = [];
        this.loadProducts();
    }

    // Cargar productos desde productos.json
    async loadProducts() {
        try {
            const response = await fetch('productos.json');
            this.productos = await response.json();
            this.renderGallery();
        } catch (error) {
            console.error('Error cargando productos:', error);
        }
    }

    // Renderizar la galería de productos
    renderGallery() {
        const gallery = document.getElementById('gallery');
        gallery.innerHTML = '';

        this.productos.forEach(producto => {
            const galleryItem = util.createElement('div', ['gallery-item']);
            
            const img = util.createElement('img');
            img.src = `imagenes/${producto.imagen}`;
            img.alt = producto.nombre;

            const details = util.createElement('div', ['gallery-item-details']);
            details.innerHTML = `
                <h3>${producto.nombre}</h3>
                <p>${producto.descripcion}</p>
                <p class="price">${util.formatPrice(producto.precio)}</p>
            `;

            // Evento para abrir modal de detalles
            img.addEventListener('click', () => this.showProductModal(producto));

            galleryItem.appendChild(img);
            galleryItem.appendChild(details);
            gallery.appendChild(galleryItem);
        });
    }

    // Mostrar modal de detalles de producto
    showProductModal(producto) {
        const modal = document.getElementById('product-modal');
        const modalDetails = document.getElementById('modal-details');

        modalDetails.innerHTML = `
            <img src="imagenes/${producto.imagen}" alt="${producto.nombre}" style="max-width:100%; height:auto;">
            <h2>${producto.nombre}</h2>
            <p>${producto.descripcion}</p>
            <p>Precio: ${util.formatPrice(producto.precio)}</p>
            <a href="${util.getWhatsAppLink(`Hola, me interesa el arreglo: ${producto.nombre}`)}" 
               class="whatsapp-btn" target="_blank">
               Consultar por WhatsApp
            </a>
        `;

        modal.style.display = 'block';
    }
}

// Gestión de búsqueda y filtros
class SearchManager {
    constructor(productManager) {
        this.productManager = productManager;
        this.setupSearchListeners();
    }

    setupSearchListeners() {
        const searchInput = document.getElementById('search-input');
        const priceFilter = document.getElementById('price-filter');

        searchInput.addEventListener('input', () => this.filterProducts());
        priceFilter.addEventListener('change', () => this.filterProducts());
    }

    filterProducts() {
        const searchTerm = document.getElementById('search-input').value.toLowerCase();
        const priceFilter = document.getElementById('price-filter').value;

        const filteredProducts = this.productManager.productos.filter(producto => {
            const matchesSearch = producto.nombre.toLowerCase().includes(searchTerm) ||
                                  producto.descripcion.toLowerCase().includes(searchTerm);
            
            const matchesPrice = !priceFilter || this.checkPriceRange(producto.precio, priceFilter);

            return matchesSearch && matchesPrice;
        });

        this.renderFilteredProducts(filteredProducts);
    }

    checkPriceRange(price, range) {
        switch(range) {
            case 'low': return price < 500;
            case 'medium': return price >= 500 && price < 1000;
            case 'high': return price >= 1000;
            default: return true;
        }
    }

    renderFilteredProducts(productos) {
        const gallery = document.getElementById('gallery');
        gallery.innerHTML = '';

        productos.forEach(producto => {
            const galleryItem = util.createElement('div', ['gallery-item']);
            
            const img = util.createElement('img');
            img.src = `imagenes/${producto.imagen}`;
            img.alt = producto.nombre;

            const details = util.createElement('div', ['gallery-item-details']);
            details.innerHTML = `
                <h3>${producto.nombre}</h3>
                <p>${producto.descripcion}</p>
                <p class="price">${util.formatPrice(producto.precio)}</p>
            `;

            galleryItem.appendChild(img);
            galleryItem.appendChild(details);
            gallery.appendChild(galleryItem);
        });
    }
}

// Animaciones de globos
class BalloonAnimations {
    constructor() {
        this.backgroundBalloons = document.getElementById('background-balloons');
        this.setupFloatingBalloons();
        this.setupBalloonExplosions();
    }

    // Crear globos flotantes
    setupFloatingBalloons() {
        for (let i = 0; i < CONFIG.MAX_FLOATING_BALLOONS; i++) {
            const balloon = this.createBalloon();
            this.backgroundBalloons.appendChild(balloon);
            this.animateBalloonFloat(balloon);
        }
    }

    createBalloon() {
        const balloon = document.createElement('div');
        balloon.classList.add('floating-balloon');
        balloon.innerHTML = '🎈';
        balloon.style.fontSize = `${util.randomBetween(20, 50)}px`;
        balloon.style.left = `${util.randomBetween(0, 100)}%`;
        return balloon;
    }

    animateBalloonFloat(balloon) {
        gsap.to(balloon, {
            y: -window.innerHeight,
            duration: util.randomBetween(30, 60),
            ease: 'linear',
            repeat: -1,
            delay: util.randomBetween(0, 10)
        });
    }

    // Explosión de globos
    setupBalloonExplosions() {
        setInterval(() => this.explodeBalloon(), CONFIG.BALLOON_ANIMATION_INTERVAL);
    }

    explodeBalloon() {
        const balloons = document.querySelectorAll('.floating-balloon');
        if (balloons.length) {
            const balloon = balloons[Math.floor(Math.random() * balloons.length)];
            
            // Efecto de explosión con GSAP
            gsap.to(balloon, {
                scale: 1.5,
                opacity: 0,
                duration: 0.5,
                onComplete: () => {
                    balloon.remove();
                    this.backgroundBalloons.appendChild(this.createBalloon());
                }
            });
        }
    }
}

// Calculadora de presupuesto
class BudgetCalculator {
    constructor() {
        this.loadBudgetOptions();
        this.setupListeners();
    }

    async loadBudgetOptions() {
        try {
            const response = await fetch('opciones-extras.json');
            const options = await response.json();
            this.renderBudgetOptions(options);
        } catch (error) {
            console.error('Error cargando opciones:', error);
        }
    }

    renderBudgetOptions(options) {
        const optionsContainer = document.getElementById('budget-options');
        optionsContainer.innerHTML = '';

        options.forEach(option => {
            const optionElement = util.createElement('div', ['budget-option']);
            optionElement.innerHTML = `
                <label>
                    <input type="checkbox" 
                           name="${option.id}" 
                           data-price="${option.precio}">
                    ${option.nombre} - ${util.formatPrice(option.precio)}
                </label>
            `;
            optionsContainer.appendChild(optionElement);
        });

        // Agregar input para número de globos
        const balloonInput = util.createElement('div', ['balloon-quantity']);
        balloonInput.innerHTML = `
            <label>Número de globos:
                <input type="number" 
                       id="balloon-quantity" 
                       min="1" 
                       max="100" 
                       value="10">
            </label>
        `;
        optionsContainer.appendChild(balloonInput);

        // Botón de calcular
        const calculateButton = util.createElement('button', [], 'Calcular Presupuesto');
        calculateButton.addEventListener('click', () => this.calculateBudget());
        optionsContainer.appendChild(calculateButton);
    }

    calculateBudget() {
        const balloonQuantity = document.getElementById('balloon-quantity').value;
        const selectedOptions = Array.from(
            document.querySelectorAll('#budget-options input[type="checkbox"]:checked')
        );

        let basePrice = 50; // Precio base por arreglo
        let totalPrice = basePrice + (balloonQuantity * 5); // Precio por globo

        selectedOptions.forEach(option => {
            totalPrice += parseFloat(option.dataset.price);
        });

        this.showBudgetResult(totalPrice, balloonQuantity, selectedOptions);
    }

    showBudgetResult(total, quantity, options) {
        const resultContainer = document.getElementById('budget-result');
        
        const optionsList = options.map(opt => opt.closest('label').textContent.trim()).join(', ');

        resultContainer.innerHTML = `
            <h3>Presupuesto Estimado</h3>
            <p>Cantidad de globos: ${quantity}</p>
            <p>Opciones extras: ${optionsList || 'Ninguna'}</p>
            <p><strong>Total: ${util.formatPrice(total)}</strong></p>
            <a href="${util.getWhatsAppLink(`Quiero un presupuesto de arreglo de globos. Detalles:\nCantidad: ${quantity}\nOpciones: ${optionsList}\nTotal: ${util.formatPrice(total)}`)}" 
               class="whatsapp-btn" target="_blank">
               Solicitar por WhatsApp
            </a>
        `;
    }
}

// Preguntas frecuentes
class FAQManager {
    constructor() {
        this.loadFAQ();
    }

    async loadFAQ() {
        try {
            const response = await fetch('faq.json');
            const faqs = await response.json();
            this.renderFAQ(faqs);
        } catch (error) {
            console.error('Error cargando preguntas frecuentes:', error);
        }
    }

    renderFAQ(faqs) {
        const faqContainer = document.getElementById('faq-container');
        faqContainer.innerHTML = '';

        faqs.forEach(faq => {
            const faqItem = util.createElement('div', ['faq-item']);
            faqItem.innerHTML = `
                <h3>${faq.pregunta}</h3>
                <p>${faq.respuesta}</p>
            `;
            faqContainer.appendChild(faqItem);
        });
    }
}

// Configuración de modal
function setupModalClose() {
    const modal = document.getElementById('product-modal');
    const closeBtn = document.querySelector('.close-modal');

    closeBtn.onclick = () => {
        modal.style.display = 'none';
    };

    window.onclick = (event) => {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    };
}

// Inicialización al cargar la página
document.addEventListener('DOMContentLoaded', () => {
    const productManager = new ProductManager();
    new SearchManager(productManager);
    new BalloonAnimations();
    new BudgetCalculator();
    new FAQManager();
    setupModalClose();
});
