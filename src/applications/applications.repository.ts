import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Injectable } from '@nestjs/common';
import { MongoRepository, Application } from 'src/shared/libs/types';
import { ApplicationEntity } from './application.entity';
import { ApplicationModel } from './application.model';

@Injectable()
export class ApplicationsRepository extends MongoRepository<
  ApplicationEntity,
  Application
> {
  constructor(
    @InjectModel(ApplicationModel.name)
    applicationModel: Model<ApplicationModel>,
  ) {
    super(applicationModel, ApplicationEntity.fromObject);
  }

  public async findMany(userId: string): Promise<ApplicationEntity[]> {
    const applicationDocuments = await this.model.find({ userId }).exec();
    return applicationDocuments.map((application) =>
      this.createEntityFromDocument(application),
    );
  }

  public async findManyAuthor(authorId: string): Promise<ApplicationEntity[]> {
    const applicationDocuments = await this.model.find({ authorId }).exec();
    return applicationDocuments.map((application) =>
      this.createEntityFromDocument(application),
    );
  }
}
