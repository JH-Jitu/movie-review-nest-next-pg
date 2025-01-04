// src/common/filters/query-filter.ts
export class QueryFilters {
  static createTitleFilters(query: any) {
    const filters: any = {};

    console.log('Incoming query parameters:', query);

    if (query.type) {
      filters.titleType = query.type;
    }

    if (query.year) {
      const year = parseInt(query.year);
      filters.releaseDate = {
        gte: new Date(`${year}-01-01`),
        lt: new Date(`${year + 1}-01-01`),
      };
    }

    if (query.genre) {
      filters.genres = {
        some: {
          name: { equals: query.genre, mode: 'insensitive' },
        },
      };
    }

    if (query.language) {
      filters.originalLanguage = {
        equals: query.language,
        mode: 'insensitive',
      };
    }

    if (query.minRating) {
      filters.imdbRating = {
        gte: parseFloat(query?.minRating),
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
