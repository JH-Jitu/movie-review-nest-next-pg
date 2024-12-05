import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaService } from './prisma/prisma.service';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { ConfigModule } from '@nestjs/config';
import { TitleModule } from './title/title.module';
import { PersonModule } from './person/person.module';
import { ReviewModule } from './review/review.module';
import { RatingModule } from './rating/rating.module';
import { ListModule } from './list/list.module';
import { WatchlistModule } from './watchlist/watchlist.module';
import { ProductionCompanyModule } from './production-company/production-company.module';
import { CertificationModule } from './certification/certification.module';
import { GenreModule } from './genre/genre.module';
import { AwardModule } from './award/award.module';
import { CastModule } from './cast/cast.module';
import { CrewModule } from './crew/crew.module';
// import { GraphqlModule } from './graphql/graphql.module';

@Module({
  imports: [
    AuthModule,
    UserModule,
    TitleModule,
    PersonModule,
    ReviewModule,
    RatingModule,
    ListModule,
    WatchlistModule,
    GenreModule,
    CertificationModule,
    ProductionCompanyModule,
    AwardModule,
    CastModule,
    CrewModule,
    ConfigModule.forRoot({ isGlobal: true }),
    // GraphqlModule
  ],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}
