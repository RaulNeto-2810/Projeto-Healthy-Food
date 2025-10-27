// frontend/src/components/ProducerCard.tsx
import styles from './ProducerCard.module.css';
import { IonIcon } from '@ionic/react';
import { heartOutline, heart } from 'ionicons/icons'; // Ícones para avaliação
import iconeFazenda from '@/assets/imagens/icone-fazenda.png';
import { useNavigate } from 'react-router-dom';

// Interface para definir os dados esperados pelo card
interface ProducerProfileData {
    id: number;
    name: string;
    // Adicionaremos mais campos como imagem e avaliação no futuro
}

interface ProducerCardProps {
    producer: ProducerProfileData;
}

export function ProducerCard({ producer }: ProducerCardProps) {
    // Simulação de avaliação (ex: 3 de 5 corações)
    const rating = 3;
    const navigate = useNavigate();

    const handleCardClick = () => {
        navigate(`/fazenda/${producer.id}`);
    };

    return (
        <div className={styles.cardContainer} onClick={handleCardClick}>
            {/* Imagem padrão da fazenda */}
            <div className={styles.imagePlaceholder}>
                <img src={iconeFazenda} alt={`Fazenda ${producer.name}`} className={styles.farmImage} />
            </div>
            <div className={styles.cardContent}>
                <h3 className={styles.producerName}>{producer.name}</h3>
                <div className={styles.ratingContainer}>
                    <span className={styles.ratingLabel}>Avaliação:</span>
                    <div className={styles.hearts}>
                        {[1, 2, 3, 4, 5].map((star) => (
                            <IonIcon
                                key={star}
                                icon={star <= rating ? heart : heartOutline}
                                className={styles.heartIcon}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}