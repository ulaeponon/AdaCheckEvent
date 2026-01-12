import { Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Categories from './pages/Categories';
import Favorites from './pages/Favorites';
import { useState } from "react";
import './App.css';
import { useEffect } from 'react';

export default function App() {
    const [query, setQuery] = useState("");
    const [trigger, setTrigger] = useState(0);
    const [favorites, setFavorites] = useState([]);
    useEffect(() => {
        const storedFavorites = JSON.parse(localStorage.getItem("favorites")) || []; // recupere les elements sauvegardé s'il en a et passe le en tableau d'objet 
        setFavorites(storedFavorites)
    }, []);

    const toggleFavorite = (event) => {
        const eventId = event.id || event.event_id;
        setFavorites((previous) => {
            const newFavorites = previous.includes(eventId) // verifie si le nouvel element est sur la liste
                ? previous.filter(id => id !== eventId) : // retire le 
                [...previous, eventId]; // ajoute le
            localStorage.setItem("favorites", JSON.stringify(newFavorites));// passe le en texte pour le stocker dans localStorage


            const storedEvents = JSON.parse(localStorage.getItem('favoriteEvents')) || [];
            const updatedEvents = newFavorites.includes(eventId)
                ? [...storedEvents.filter(e => (e.id || e.event_id) !== eventId), event]  // Ajouter
                : storedEvents.filter(e => (e.id || e.event_id) !== eventId);  // Retirer
            localStorage.setItem('favoriteEvents', JSON.stringify(updatedEvents));

            return newFavorites
        })
    }
    return (
        <>
            <Navbar query={query} setQuery={setQuery} onSearch={() => setTrigger(t => t + 1)} />
            <Routes>
                <Route path='/' element={<Home query={query} trigger={trigger} favorites={favorites} toggleFavorite={toggleFavorite} />} />
                <Route path='/categories' element={<Categories />} />
                <Route path='/favorites' element={<Favorites favorites={favorites} toggleFavorite={toggleFavorite} />} />
            </Routes>
        </>
    );
}