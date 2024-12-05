// src/recommendations/recommendation.service.ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class RecommendationService {
  constructor(private readonly prisma: PrismaService) {}

  async getPersonalizedRecommendations(userId: number) {
    // Get user's watched titles and ratings
    const userRatings = await this.prisma.rating.findMany({
      where: { userId },
      include: {
        title: {
          include: {
            genres: true,
          },
        },
      },
    });

    // Get user's favorite genres based on highly rated titles
    const genreScores = new Map<string, number>();
    userRatings.forEach((rating) => {
      rating.title.genres.forEach((genre) => {
        const currentScore = genreScores.get(genre.name) || 0;
        genreScores.set(genre.name, currentScore + rating.value / 10);
      });
    });

    // Get recommendations based on favorite genres and similar users
    const recommendations = await this.prisma.title.findMany({
      where: {
        AND: [
          {
            id: {
              notIn: userRatings.map((r) => r.titleId),
            },
          },
          {
            genres: {
              some: {
                name: {
                  in: Array.from(genreScores.keys()).slice(0, 3), // Top 3 genres
                },
              },
            },
          },
        ],
      },
      orderBy: [{ imdbRating: 'desc' }, { popularity: 'desc' }],
      take: 10,
      include: {
        genres: true,
        certification: true,
      },
    });

    return recommendations;
  }

  async getSimilarTitles(titleId: string) {
    const title = await this.prisma.title.findUnique({
      where: { id: titleId },
      include: {
        genres: true,
      },
    });

    if (!title) return [];

    const similarTitles = await this.prisma.title.findMany({
      where: {
        AND: [
          { id: { not: titleId } },
          {
            genres: {
              some: {
                name: {
                  in: title.genres.map((g) => g.name),
                },
              },
            },
          },
        ],
      },
      orderBy: [{ imdbRating: 'desc' }, { popularity: 'desc' }],
      take: 5,
      include: {
        genres: true,
        certification: true,
      },
    });

    return similarTitles;
  }

  async getPopularInGenre(genreName: string) {
    return this.prisma.title.findMany({
      where: {
        genres: {
          some: {
            name: genreName,
          },
        },
      },
      orderBy: [{ popularity: 'desc' }, { imdbRating: 'desc' }],
      take: 10,
      include: {
        genres: true,
        certification: true,
      },
    });
  }

  async getTrendingTitles() {
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

    return this.prisma.title.findMany({
      where: {
        OR: [
          { releaseDate: { gte: oneMonthAgo } },
          {
            reviews: {
              some: {
                createdAt: { gte: oneMonthAgo },
              },
            },
          },
          {
            ratings: {
              some: {
                createdAt: { gte: oneMonthAgo },
              },
            },
          },
        ],
      },
      orderBy: [{ popularity: 'desc' }, { imdbRating: 'desc' }],
      take: 10,
      include: {
        genres: true,
        certification: true,
      },
    });
  }
}
