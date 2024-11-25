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
    ConfigModule.forRoot({ isGlobal: true }),
    // GraphqlModule
  ],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}
