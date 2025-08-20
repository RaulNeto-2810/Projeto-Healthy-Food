// frontend/src/components/ProductCarousel.tsx

import { useState, useRef } from 'react'; // 1. Importar o useRef
import Slider from 'react-slick'; // 2. Importar o TIPO Slider

// Importando os estilos necessários da biblioteca
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

// Importando nossos estilos e imagens
import styles from './ProductCarousel.module.css';

// Importando as imagens dos produtos
import product1 from '../assets/imagens/Product 1.png';
import product2 from '../assets/imagens/Product 2.png';
import product3 from '../assets/imagens/Product 3.png';
import product4 from '../assets/imagens/Product 4.png';
import product5 from '../assets/imagens/Product 5.png';
import product6 from '../assets/imagens/Product 6.png';
import product61 from '../assets/imagens/Product 6-1.png';
import product7 from '../assets/imagens/Product 7.png';
import product8 from '../assets/imagens/Product 8.png';

// Importando os ícones das setas
import nextArrowIcon from '../assets/icons/seta-direita.png';
import prevArrowIcon from '../assets/icons/seta-esquerda.png';

const products = [
    { id: 1, name: 'Rabanete', image: product1, color: '#F0728B' },
    { id: 2, name: 'Brócolis', image: product2, color: '#94CF7D' },
    { id: 3, name: 'Banana', image: product3, color: '#EDD251' },
    { id: 4, name: 'Cenoura', image: product4, color: '#F7B18C' },
    { id: 5, name: 'Tomate', image: product5, color: '#F6795B' },
    { id: 6, name: 'Alface', image: product6, color: '#C0E08E' },
    { id: 7, name: 'Morango', image: product61, color: '#F8766B' },
    { id: 8, name: 'Alho', image: product7, color: '#DDB69A' },
    { id: 9, name: 'Quiabo', image: product8, color: '#99D47B' },
];

// 3. REMOVEMOS os componentes customizados de setas daqui

export function ProductCarousel() {
    const [currentSlide, setCurrentSlide] = useState(4);
    const sliderRef = useRef<Slider>(null); // 4. Criamos uma referência para o Slider

    const settings = {
        className: "center",
        centerMode: true,
        infinite: true,
        slidesToShow: 5,
        speed: 500,
        initialSlide: 4,
        beforeChange: (current: number, next: number) => setCurrentSlide(next),
        arrows: false, // 5. Desabilitamos as setas padrão da biblioteca
        responsive: [
            {
                breakpoint: 768,
                settings: { slidesToShow: 3 }
            },
            {
                breakpoint: 480,
                settings: { slidesToShow: 1 }
            }
        ]
    };

    const goToNext = () => {
        sliderRef.current?.slickNext(); // 6. Função para avançar
    };

    const goToPrev = () => {
        sliderRef.current?.slickPrev(); // 7. Função para retroceder
    };

    return (
        <div className={styles.carouselContainer}>
            <h2 className={styles.title}>Aqui você encontra:</h2>
            <h3
                className={styles.productName}
                style={{ color: products[currentSlide]?.color }}
            >
                {products[currentSlide]?.name}
            </h3>

            {/* 8. Adicionamos a referência ao componente Slider */}
            <Slider ref={sliderRef} {...settings}>
                {products.map(product => (
                    <div key={product.id} className={styles.slide}>
                        <img src={product.image} alt={product.name} />
                    </div>
                ))}
            </Slider>

            {/* 9. Criamos nossos próprios controles de navegação */}
            <div className={styles.controls}>
                <button onClick={goToPrev} className={styles.controlButton}>
                    <img src={prevArrowIcon} alt="Anterior" />
                </button>
                <button onClick={goToNext} className={styles.controlButton}>
                    <img src={nextArrowIcon} alt="Próximo" />
                </button>
            </div>
        </div>
    );
}