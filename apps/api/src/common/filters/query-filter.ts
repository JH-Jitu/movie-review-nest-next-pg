// src/common/filters/query-filter.ts
export class QueryFilters {
  static createTitleFilters(query: any) {
    const filters: any = {};

    if (query.type) {
      filters.titleType = query.type;
    }

    if (query.releaseYear) {
      const year = parseInt(query.releaseYear);
      filters.releaseDate = {
        gte: new Date(`${year}-01-01`),
        lt: new Date(`${year + 1}-01-01`),
      };
    }

    if (query.genre) {
      filters.genres = {
        some: {
          name: query.genre,
        },
      };
    }

    if (query.language) {
      filters.originalLanguage = query.language;
    }

    if (query.minRating) {
      filters.imdbRating = {
        gte: parseFloat(query.minRating),
      };
    }

    if (query.search) {
      filters.OR = [
        { primaryTitle: { contains: query.search, mode: 'insensitive' } },
        { originalTitle: { contains: query.search, mode: 'insensitive' } },
        { plot: { contains: query.search, mode: 'insensitive' } },
      ];
    }

    return filters;
  }

  static createPersonFilters(query: any) {
    const filters: any = {};

    if (query.search) {
      filters.OR = [
        { name: { contains: query.search, mode: 'insensitive' } },
        { biography: { contains: query.search, mode: 'insensitive' } },
      ];
    }

    if (query.birthYear) {
      const year = parseInt(query.birthYear);
      filters.birthDate = {
        gte: new Date(`${year}-01-01`),
        lt: new Date(`${year + 1}-01-01`),
      };
    }

    return filters;
  }
}