import { NotFoundException } from '@nestjs/common';
import { Model, Types, UpdateQuery } from 'mongoose';
import { Entity } from './entity.interface';
import { Repository } from './repository.interface';

const ENTITY_NOT_FOUND = 'Entity not found';

export abstract class MongoRepository<
  EntityType extends Entity<DocumentType>,
  DocumentType extends UpdateQuery<DocumentType>,
> implements Repository<EntityType, DocumentType>
{
  constructor(
    protected readonly model: Model<DocumentType>,
    private readonly createEntity: (document: DocumentType) => EntityType,
  ) {}

  protected createEntityFromDocument(document: DocumentType): EntityType {
    return this.createEntity(document);
  }

  public async findById(id: EntityType['id']): Promise<EntityType | null> {
    const document = await this.model.findById(id).exec();
    if (document) {
      return this.createEntityFromDocument(document);
    }
    return null;
  }

  public async save(entity: EntityType): Promise<EntityType> {
    const newEntity = new this.model(entity.toPOJO());
    await newEntity.save();
    const newEntityId = newEntity._id as Types.ObjectId;
    entity.id = newEntityId.toString();
    return entity;
  }

  public async update(
    id: EntityType['id'],
    entity: EntityType,
  ): Promise<EntityType | null> {
    const updatedDocument = await this.model
      .findByIdAndUpdate(id, entity.toPOJO(), {
        new: true,
        runValidators: true,
      })
      .exec();
    if (!updatedDocument) {
      throw new NotFoundException(ENTITY_NOT_FOUND);
    }
    return this.createEntityFromDocument(updatedDocument);
  }

  public async deleteById(id: EntityType['id']): Promise<void> {
    const deletedDocument = await this.model.findByIdAndDelete(id).exec();
    if (!deletedDocument) {
      throw new NotFoundException(ENTITY_NOT_FOUND);
    }
  }
}
