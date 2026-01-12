import { useEffect, useState } from 'react';
import Card from '../components/Card';
import LoadButton from '../components/LoadButton';

export default function Home({ query, trigger, favorites, toggleFavorite }) {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(false);
    const [offset, setOffset] = useState(0);
    const limit = 20;

    async function loadData() {
        setLoading(true);
        try {
            const searchParam = query
                ? `&where=title LIKE "%${encodeURIComponent(query)}%" OR description LIKE "%${encodeURIComponent(query)}%" OR address_street LIKE "%${encodeURIComponent(query)}%"`
                : "";//si l'utilisateur saisit un mot(query) alors on declenche le where (condition de recherche )

            const res = await fetch(`https://opendata.paris.fr/api/explore/v2.1/catalog/datasets/que-faire-a-paris-/records?limit=${limit}&offset=${offset}${searchParam}`);
            const data = await res.json();

            // Si offset === 0, on remplace la liste ; sinon, on ajoute
            setEvents((prevEvents) =>
                offset === 0 ? data.results : [...prevEvents, ...data.results]
            );

        } catch (error) {
            console.error("Erreur lors de la récupération des données");
        } finally {
            setLoading(false);
        }
    }

    // useEffect pour query : Reset seulement offset (pas events) quand query change
    useEffect(() => {
        setOffset(0);
    }, [query]);

    // useEffect principal : Charge les données seulement quand offset ou trigger change
    useEffect(() => {
        loadData();
    }, [offset, trigger]);

    function loadMoreEvent() {
        setOffset((prevOffset) => prevOffset + limit);
    }

    return (
        <>
            <div>

                {events.length === 0 ? (
                    <div>Loading...</div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pt-7">
                        {events.map((element) => (
                            <Card
                                key={element.id || element.event_id}
                                title={element.title}
                                cover_url={element.cover_url}
                                description={element.description}
                                url={element.url}
                                element= {events}
                                isFavorite={favorites?.includes(element.id || element.event_id)}  // Vérifie si favori
                                toggleFavorite={toggleFavorite}  // Passe la fonction
                                event={element}  // Passe l'objet complet
                    />
                        ))}
                    </div>
                )}

                <LoadButton onClick={loadMoreEvent} loading={loading} />

            </div>
        </>
    );
}
