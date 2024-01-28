import { useContext } from 'react';
import { SeasonsContext } from '../context/SeasonsContext';

export const useSeasons = () => useContext(SeasonsContext);
