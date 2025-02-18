export const advancedFilter = async (filters, sortOptions, page, limit) => {
  try {
    const queryParams = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      sorts: JSON.stringify([{
        field: sortOptions.field,
        direction: sortOptions.order
      }])
    });

    Object.entries(filters).forEach(([key, value]) => {
      if (value) {
        if (Array.isArray(value)) {
          queryParams.append(key, value.join(','));
        } else {
          queryParams.append(key, value);
        }
      }
    });

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/track/filter?${queryParams}`);

    if (!response.ok) {
      throw new Error(`Erreur: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Erreur lors de la récupération des résultats filtrés:', error);
    throw error;
  }
};
