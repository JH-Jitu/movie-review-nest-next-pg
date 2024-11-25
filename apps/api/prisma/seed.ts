import {
  PrismaClient,
  Prisma,
  Role,
  TitleType,
  CertificationType,
} from '@prisma/client';
import * as argon2 from 'argon2';

const prisma = new PrismaClient();

// Utility function to generate random number within range
const randomInt = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

// Utility function to get random items from array
const getRandomItems = <T>(array: T[], count: number): T[] => {
  const shuffled = [...array].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};

async function main() {
  console.log('Starting seed...');

  try {
    // Create users
    const users = [
      { email: 'admin@example.com', name: 'Admin User', role: Role.ADMIN },
      {
        email: 'moderator1@example.com',
        name: 'Mod One',
        role: Role.MODERATOR,
      },
      {
        email: 'moderator2@example.com',
        name: 'Mod Two',
        role: Role.MODERATOR,
      },
      { email: 'user1@example.com', name: 'User One', role: Role.USER },
      { email: 'user2@example.com', name: 'User Two', role: Role.USER },
      { email: 'user3@example.com', name: 'User Three', role: Role.USER },
    ];

    for (const user of users) {
      const hashedPassword = await argon2.hash('password123');
      await prisma.user.upsert({
        where: { email: user.email },
        update: {},
        create: {
          email: user.email,
          name: user.name,
          password: hashedPassword,
          role: user.role,
        },
      });
    }
    console.log('Created users');

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
      'Western',
      'Musical',
      'Biography',
      'Sport',
      'History',
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
      { name: 'Italian', code: 'it' },
      { name: 'Russian', code: 'ru' },
      { name: 'Portuguese', code: 'pt' },
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
      { name: 'Lionsgate', country: 'USA' },
      { name: 'Netflix Studios', country: 'USA' },
      { name: 'Canal+', country: 'France' },
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
      { type: CertificationType.PG, country: 'UK' },
      { type: CertificationType.R, country: 'UK' },
      { type: CertificationType.PG13, country: 'Canada' },
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
        primaryTitle: 'Inception',
        originalTitle: 'Inception',
        titleType: TitleType.MOVIE,
        slug: 'inception-2010',
        releaseDate: new Date('2010-07-16'),
        plot: 'A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.',
        runtime: 148,
        isReleased: true,
        originalLanguage: 'en',
        budget: 160000000,
        revenue: 836836967,
        imdbRating: 8.8,
        genres: ['Action', 'Sci-Fi', 'Thriller'],
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
      {
        primaryTitle: 'The Crown',
        originalTitle: 'The Crown',
        titleType: TitleType.TV_SERIES,
        slug: 'the-crown-2016',
        releaseDate: new Date('2016-11-04'),
        plot: "Follows the political rivalries and romance of Queen Elizabeth II's reign and the events that shaped the second half of the twentieth century.",
        runtime: 58,
        isReleased: true,
        originalLanguage: 'en',
        budget: 130000000,
        revenue: 0,
        imdbRating: 8.7,
        genres: ['Biography', 'Drama', 'History'],
        productionCompanies: ['Netflix Studios'],
        certifications: [{ type: CertificationType.TV14, country: 'USA' }],
      },
      {
        primaryTitle: 'Parasite',
        originalTitle: '기생충',
        titleType: TitleType.MOVIE,
        slug: 'parasite-2019',
        releaseDate: new Date('2019-05-30'),
        plot: 'Greed and class discrimination threaten the newly formed symbiotic relationship between the wealthy Park family and the destitute Kim clan.',
        runtime: 132,
        isReleased: true,
        originalLanguage: 'ko',
        budget: 11400000,
        revenue: 258773645,
        imdbRating: 8.6,
        genres: ['Comedy', 'Drama', 'Thriller'],
        productionCompanies: ['Canal+'],
        certifications: [{ type: CertificationType.R, country: 'USA' }],
      },
      {
        primaryTitle: 'The Lord of the Rings: The Fellowship of the Ring',
        originalTitle: 'The Lord of the Rings: The Fellowship of the Ring',
        titleType: TitleType.MOVIE,
        slug: 'the-lord-of-the-rings-the-fellowship-of-the-ring-2001',
        releaseDate: new Date('2001-12-19'),
        plot: 'A meek Hobbit from the Shire and eight companions set out on a journey to destroy the powerful One Ring and save Middle-earth from the Dark Lord Sauron.',
        runtime: 178,
        isReleased: true,
        originalLanguage: 'en',
        budget: 93000000,
        revenue: 897690072,
        imdbRating: 8.8,
        genres: ['Action', 'Adventure', 'Fantasy'],
        productionCompanies: ['Universal Pictures'],
        certifications: [{ type: CertificationType.PG13, country: 'USA' }],
      },
      {
        primaryTitle: 'Pulp Fiction',
        originalTitle: 'Pulp Fiction',
        titleType: TitleType.MOVIE,
        slug: 'pulp-fiction-1994',
        releaseDate: new Date('1994-10-14'),
        plot: 'The lives of two mob hitmen, a boxer, a gangster and his wife, and a pair of diner bandits intertwine in four tales of violence and redemption.',
        runtime: 154,
        isReleased: true,
        originalLanguage: 'en',
        budget: 8000000,
        revenue: 213928762,
        imdbRating: 8.9,
        genres: ['Crime', 'Drama'],
        productionCompanies: ['Lionsgate'],
        certifications: [{ type: CertificationType.R, country: 'USA' }],
      },
      {
        primaryTitle: 'Stranger Things',
        originalTitle: 'Stranger Things',
        titleType: TitleType.TV_SERIES,
        slug: 'stranger-things-2016',
        releaseDate: new Date('2016-07-15'),
        plot: 'When a young boy disappears, his mother, a police chief, and his friends must confront terrifying supernatural forces in order to get him back.',
        runtime: 51,
        isReleased: true,
        originalLanguage: 'en',
        budget: 8000000,
        revenue: 0,
        imdbRating: 8.7,
        genres: ['Drama', 'Fantasy', 'Horror'],
        productionCompanies: ['Netflix Studios'],
        certifications: [{ type: CertificationType.TV14, country: 'USA' }],
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
      {
        name: 'Quentin Tarantino',
        slug: 'quentin-tarantino',
        birthDate: new Date('1963-03-27'),
        birthPlace: 'Knoxville, Tennessee, USA',
        biography:
          'Quentin Tarantino is an American filmmaker, actor, film programmer, and cinema owner. His films are characterized by nonlinear storylines, dark humor, stylized violence, and references to popular culture.',
      },
      {
        name: 'Peter Jackson',
        slug: 'peter-jackson',
        birthDate: new Date('1961-10-31'),
        birthPlace: 'Wellington, New Zealand',
        biography:
          'Sir Peter Jackson is a New Zealand film director, producer, and screenwriter. He is best known for directing The Lord of the Rings trilogy and The Hobbit trilogy.',
      },
      {
        name: 'Bong Joon-ho',
        slug: 'bong-joon-ho',
        birthDate: new Date('1969-09-14'),
        birthPlace: 'Daegu, South Korea',
        biography:
          "Bong Joon-ho is a South Korean film director and screenwriter. He gained worldwide recognition for his film Parasite, which became the first South Korean film to win the Palme d'Or at Cannes.",
      },
      {
        name: 'Leonardo DiCaprio',
        slug: 'leonardo-dicaprio',
        birthDate: new Date('1974-11-11'),
        birthPlace: 'Los Angeles, California, USA',
        biography:
          'Leonardo DiCaprio is an American actor and producer known for his work in biopics and unconventional characters.',
      },
      {
        name: 'Millie Bobby Brown',
        slug: 'millie-bobby-brown',
        birthDate: new Date('2004-02-19'),
        birthPlace: 'Marbella, Spain',
        biography:
          'Millie Bobby Brown is a British actress who gained recognition for her role as Eleven in the Netflix series Stranger Things.',
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

    // Create crew relationships with different roles
    const crewRelationships = [
      {
        personSlug: 'christopher-nolan',
        titleSlug: 'the-dark-knight-2008',
        role: 'Director',
        department: 'Directing',
      },
      {
        personSlug: 'christopher-nolan',
        titleSlug: 'inception-2010',
        role: 'Director',
        department: 'Directing',
      },
      {
        personSlug: 'christopher-nolan',
        titleSlug: 'inception-2010',
        role: 'Writer',
        department: 'Writing',
      },
      {
        personSlug: 'hayao-miyazaki',
        titleSlug: 'spirited-away-2001',
        role: 'Director',
        department: 'Directing',
      },
      {
        personSlug: 'hayao-miyazaki',
        titleSlug: 'spirited-away-2001',
        role: 'Writer',
        department: 'Writing',
      },
      {
        personSlug: 'quentin-tarantino',
        titleSlug: 'pulp-fiction-1994',
        role: 'Director',
        department: 'Directing',
      },
      {
        personSlug: 'quentin-tarantino',
        titleSlug: 'pulp-fiction-1994',
        role: 'Writer',
        department: 'Writing',
      },
      {
        personSlug: 'peter-jackson',
        titleSlug: 'the-lord-of-the-rings-the-fellowship-of-the-ring-2001',
        role: 'Director',
        department: 'Directing',
      },
      {
        personSlug: 'bong-joon-ho',
        titleSlug: 'parasite-2019',
        role: 'Director',
        department: 'Directing',
      },
      {
        personSlug: 'bong-joon-ho',
        titleSlug: 'parasite-2019',
        role: 'Writer',
        department: 'Writing',
      },
      {
        personSlug: 'leonardo-dicaprio',
        titleSlug: 'inception-2010',
        role: 'Actor',
        department: 'Acting',
      },
      {
        personSlug: 'millie-bobby-brown',
        titleSlug: 'stranger-things-2016',
        role: 'Actor',
        department: 'Acting',
      },
    ];

    for (const relationship of crewRelationships) {
      const person = await prisma.person.findUnique({
        where: { slug: relationship.personSlug },
        select: { id: true },
      });

      const title = await prisma.title.findUnique({
        where: { slug: relationship.titleSlug },
        select: { id: true },
      });

      if (person && title) {
        await prisma.crewMember.create({
          data: {
            title: { connect: { id: title.id } },
            person: { connect: { id: person.id } },
            role: relationship.role,
            department: relationship.department,
          },
        });
      }
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
