import { generateUniqueID } from '@/utils';

export const createJamSession = async (currentTrackId) => {
  try {
    const userId = generateUniqueID();
    localStorage.setItem('userId', userId);
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/room`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userId, currentTrackId }),
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Erreur lors de la création de la session de jam :', error);
  }
};
