import {
  PrismaClient,
  Prisma,
  Role,
  TitleType,
  CertificationType,
} from '@prisma/client';
import * as argon2 from 'argon2';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting seed...');

  try {
    // Create admin user
    const hashedPassword = await argon2.hash('admin123');
    const adminUser = await prisma.user.upsert({
      where: { email: 'admin@example.com' },
      update: {},
      create: {
        email: 'admin@example.com',
        name: 'Admin User',
        password: hashedPassword,
        role: Role.ADMIN,
      },
    });
    console.log('Created admin user:', adminUser.email);

    // Create genres
    const genres = [
      'Action',
      'Adventure',
      'Animation',
      'Comedy',
      'Crime',
      'Documentary',
      'Drama',
      'Family',
      'Fantasy',
      'Horror',
      'Mystery',
      'Romance',
      'Sci-Fi',
      'Thriller',
      'War',
    ];

    await Promise.all(
      genres.map(async (name) => {
        await prisma.genre.upsert({
          where: { name },
          update: {},
          create: { name },
        });
      }),
    );
    console.log('Created genres');

    // Create languages
    const languages = [
      { name: 'English', code: 'en' },
      { name: 'Spanish', code: 'es' },
      { name: 'French', code: 'fr' },
      { name: 'German', code: 'de' },
      { name: 'Japanese', code: 'ja' },
      { name: 'Korean', code: 'ko' },
      { name: 'Chinese', code: 'zh' },
    ];

    await Promise.all(
      languages.map(async (lang) => {
        await prisma.language.upsert({
          where: { code: lang.code },
          update: {},
          create: lang,
        });
      }),
    );
    console.log('Created languages');

    // Create production companies
    const companies = [
      { name: 'Warner Bros.', country: 'USA' },
      { name: 'Universal Pictures', country: 'USA' },
      { name: 'Paramount Pictures', country: 'USA' },
      { name: 'Walt Disney Pictures', country: 'USA' },
      { name: 'Sony Pictures', country: 'USA' },
      { name: 'BBC Films', country: 'UK' },
      { name: 'Studio Ghibli', country: 'Japan' },
    ];

    await Promise.all(
      companies.map(async (company) => {
        await prisma.productionCompany.upsert({
          where: { name: company.name },
          update: {},
          create: company,
        });
      }),
    );
    console.log('Created production companies');

    // Create certifications
    const certifications = [
      { type: CertificationType.G, country: 'USA' },
      { type: CertificationType.PG, country: 'USA' },
      { type: CertificationType.PG13, country: 'USA' },
      { type: CertificationType.R, country: 'USA' },
      { type: CertificationType.NC17, country: 'USA' },
      { type: CertificationType.TV14, country: 'USA' },
      { type: CertificationType.TVMA, country: 'USA' },
    ] as const;

    await Promise.all(
      certifications.map(async (cert) => {
        await prisma.certification.upsert({
          where: {
            type_country: {
              type: cert.type,
              country: cert.country,
            },
          },
          update: {},
          create: {
            type: cert.type,
            country: cert.country,
          },
        });
      }),
    );
    console.log('Created certifications');

    // Create sample movies with relationships
    const sampleMovies = [
      {
        primaryTitle: 'The Dark Knight',
        originalTitle: 'The Dark Knight',
        titleType: TitleType.MOVIE,
        slug: 'the-dark-knight-2008',
        releaseDate: new Date('2008-07-18'),
        plot: 'When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.',
        runtime: 152,
        isReleased: true,
        originalLanguage: 'en',
        budget: 185000000,
        revenue: 1004558444,
        imdbRating: 9.0,
        genres: ['Action', 'Crime', 'Drama'],
        productionCompanies: ['Warner Bros.'],
        certifications: [{ type: CertificationType.PG13, country: 'USA' }],
      },
      {
        primaryTitle: 'Spirited Away',
        originalTitle: '千と千尋の神隠し',
        titleType: TitleType.MOVIE,
        slug: 'spirited-away-2001',
        releaseDate: new Date('2001-07-20'),
        plot: "During her family's move to the suburbs, a sullen 10-year-old girl wanders into a world ruled by gods, witches, and spirits, where humans are changed into beasts.",
        runtime: 125,
        isReleased: true,
        originalLanguage: 'ja',
        budget: 19000000,
        revenue: 395802706,
        imdbRating: 8.6,
        genres: ['Animation', 'Adventure', 'Family'],
        productionCompanies: ['Studio Ghibli'],
        certifications: [{ type: CertificationType.PG, country: 'USA' }],
      },
    ] as const;

    for (const movie of sampleMovies) {
      const genres = await Promise.all(
        movie.genres.map((name) =>
          prisma.genre.findUnique({
            where: { name },
            select: { id: true },
          }),
        ),
      );

      const companies = await Promise.all(
        movie.productionCompanies.map((name) =>
          prisma.productionCompany.findUnique({
            where: { name },
            select: { id: true },
          }),
        ),
      );

      const certifications = await Promise.all(
        movie.certifications.map((cert) =>
          prisma.certification.findFirst({
            where: {
              type: cert.type,
              country: cert.country,
            },
            select: { id: true },
          }),
        ),
      );

      await prisma.title.upsert({
        where: { slug: movie.slug },
        update: {},
        create: {
          primaryTitle: movie.primaryTitle,
          originalTitle: movie.originalTitle,
          titleType: movie.titleType,
          slug: movie.slug,
          releaseDate: movie.releaseDate,
          plot: movie.plot,
          runtime: movie.runtime,
          isReleased: movie.isReleased,
          originalLanguage: movie.originalLanguage,
          budget: movie.budget,
          revenue: movie.revenue,
          imdbRating: movie.imdbRating,
          genres: {
            connect: genres
              .filter((g): g is { id: string } => g !== null)
              .map((g) => ({ id: g.id })),
          },
          production: {
            connect: companies
              .filter((c): c is { id: string } => c !== null)
              .map((c) => ({ id: c.id })),
          },
          certification: {
            connect: certifications
              .filter((c): c is { id: string } => c !== null)
              .map((c) => ({ id: c.id })),
          },
        },
      });
    }
    console.log('Created sample movies');

    // Create sample people
    const samplePeople = [
      {
        name: 'Christopher Nolan',
        slug: 'christopher-nolan',
        birthDate: new Date('1970-07-30'),
        birthPlace: 'London, England',
        biography:
          'Christopher Nolan is a British-American film director, producer, and screenwriter known for his innovative narrative style and complex storytelling.',
      },
      {
        name: 'Hayao Miyazaki',
        slug: 'hayao-miyazaki',
        birthDate: new Date('1941-01-05'),
        birthPlace: 'Tokyo, Japan',
        biography:
          'Hayao Miyazaki is a Japanese animator, filmmaker, and manga artist. He is a co-founder of Studio Ghibli and is known for his animated feature films.',
      },
    ];

    for (const person of samplePeople) {
      await prisma.person.upsert({
        where: { slug: person.slug },
        update: {},
        create: person,
      });
    }
    console.log('Created sample people');

    // Create crew relationships
    const nolan = await prisma.person.findUnique({
      where: { slug: 'christopher-nolan' },
      select: { id: true },
    });
    const darkKnight = await prisma.title.findUnique({
      where: { slug: 'the-dark-knight-2008' },
      select: { id: true },
    });

    if (nolan && darkKnight) {
      await prisma.crewMember.create({
        data: {
          title: { connect: { id: darkKnight.id } },
          person: { connect: { id: nolan.id } },
          role: 'Director',
          department: 'Directing',
        },
      });
    }

    const miyazaki = await prisma.person.findUnique({
      where: { slug: 'hayao-miyazaki' },
      select: { id: true },
    });
    const spiritedAway = await prisma.title.findUnique({
      where: { slug: 'spirited-away-2001' },
      select: { id: true },
    });

    if (miyazaki && spiritedAway) {
      await prisma.crewMember.create({
        data: {
          title: { connect: { id: spiritedAway.id } },
          person: { connect: { id: miyazaki.id } },
          role: 'Director',
          department: 'Directing',
        },
      });
    }
    console.log('Created crew relationships');
  } catch (error) {
    console.error('Error seeding data:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
