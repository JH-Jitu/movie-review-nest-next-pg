// src/recommendations/recommendation.service.ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Genre } from '@prisma/client';

@Injectable()
export class RecommendationService {
  constructor(private readonly prisma: PrismaService) {}

  private calculateTitleSimilarity(title1: any, title2: any): number {
    let score = 0;

    // Genre matching
    const commonGenres = title1.genres.filter((g1) =>
      title2.genres.some((g2) => g1.id === g2.id),
    ).length;
    score +=
      (commonGenres / Math.max(title1.genres.length, title2.genres.length)) *
      40;

    // Release date proximity (max 20 points)
    const yearDiff = Math.abs(
      new Date(title1.releaseDate).getFullYear() -
        new Date(title2.releaseDate).getFullYear(),
    );
    score += Math.max(0, 20 - yearDiff * 2);

    // Rating similarity (max 20 points)
    const ratingDiff = Math.abs(title1.imdbRating - title2.imdbRating);
    score += Math.max(0, 20 - ratingDiff * 4);

    // Runtime similarity (max 10 points)
    if (title1.runtime && title2.runtime) {
      const runtimeDiff = Math.abs(title1.runtime - title2.runtime);
      score += Math.max(0, 10 - runtimeDiff / 15);
    }

    // Same production companies (10 points)
    const commonProduction = title1.production.filter((p1) =>
      title2.production.some((p2) => p1.id === p2.id),
    ).length;
    score += commonProduction > 0 ? 10 : 0;

    return score;
  }

  async getPersonalizedRecommendations(userId: number) {
    // Get user's history
    const [ratings, watchHistory, watchlist] = await Promise.all([
      this.prisma.rating.findMany({
        where: { userId },
        include: { title: { include: { genres: true, production: true } } },
      }),
      this.prisma.watchHistory.findMany({
        where: { userId },
        include: { title: { include: { genres: true, production: true } } },
      }),
      this.prisma.watchlist.findMany({
        where: { userId },
        include: { title: { include: { genres: true, production: true } } },
      }),
    ]);

    // Calculate genre preferences
    const genreScores = new Map<string, { score: number; count: number }>();
    const processTitle = (title: any, weight: number) => {
      title.genres.forEach((genre: Genre) => {
        const current = genreScores.get(genre.id) || { score: 0, count: 0 };
        genreScores.set(genre.id, {
          score: current.score + weight,
          count: current.count + 1,
        });
      });
    };

    // Weight different interactions
    ratings.forEach((r) => processTitle(r.title, r.value));
    watchHistory.forEach((w) => processTitle(w.title, 5));
    watchlist.forEach((w) => processTitle(w.title, 3));

    // Get weighted genre preferences
    const genrePreferences = Array.from(genreScores.entries())
      .map(([id, data]) => ({
        id,
        score: data.score / data.count,
      }))
      .sort((a, b) => b.score - a.score);

    // Get initial recommendations pool
    const recommendationPool = await this.prisma.title.findMany({
      where: {
        AND: [
          {
            id: {
              notIn: [
                ...ratings.map((r) => r.titleId),
                ...watchHistory.map((w) => w.titleId),
              ],
            },
          },
          {
            genres: {
              some: {
                id: {
                  in: genrePreferences.slice(0, 3).map((g) => g.id),
                },
              },
            },
          },
          { isReleased: true },
        ],
      },
      include: {
        genres: true,
        production: true,
        ratings: {
          take: 1,
          orderBy: { createdAt: 'desc' },
        },
      },
      take: 50,
    });

    // Calculate final scores for recommendations
    const scoredRecommendations = recommendationPool.map((title) => {
      let score = 0;

      // Genre preference matching
      title.genres.forEach((genre) => {
        const preference = genrePreferences.find((g) => g.id === genre.id);
        if (preference) {
          score += preference.score * 10;
        }
      });

      // Popularity and rating factors
      score += (title.popularity || 0) * 0.5;
      score += (title.imdbRating || 0) * 5;

      // Recency bonus
      const ageInYears =
        (new Date().getTime() - new Date(title.releaseDate).getTime()) /
        (365 * 24 * 60 * 60 * 1000);
      score += Math.max(0, 20 - ageInYears);

      return {
        ...title,
        recommendationScore: score,
      };
    });

    // Sort and return top recommendations
    return scoredRecommendations
      .sort((a, b) => b.recommendationScore - a.recommendationScore)
      .slice(0, 10);
  }

  //   prev

  async getSimilarTitles(titleId: string) {
    // Get the source title with all necessary relations
    const sourceTitle = await this.prisma.title.findUnique({
      where: { id: titleId },
      include: {
        genres: true,
        production: true,
      },
    });

    if (!sourceTitle) return [];

    // Get potential similar titles
    const potentialSimilarTitles = await this.prisma.title.findMany({
      where: {
        AND: [
          { id: { not: titleId } },
          { titleType: sourceTitle.titleType },
          {
            genres: {
              some: {
                id: {
                  in: sourceTitle.genres.map((g) => g.id),
                },
              },
            },
          },
        ],
      },
      include: {
        genres: true,
        production: true,
      },
      take: 50, // Get a larger pool first
    });

    // Calculate similarity scores for each potential match
    const scoredTitles = potentialSimilarTitles.map((title) => ({
      ...title,
      similarityScore: this.calculateTitleSimilarity(sourceTitle, title),
    }));

    // Sort by similarity score and return top 10
    return scoredTitles
      .sort((a, b) => b.similarityScore - a.similarityScore)
      .slice(0, 10);
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
