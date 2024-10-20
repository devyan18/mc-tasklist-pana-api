import { Tag } from '../models/tag.model';

export class TagService {
  static async createTag(tag: { name: string; color?: string }) {
    return Tag.create(tag);
  }

  // Método estático para crear múltiples etiquetas o recuperar sus IDs
  static async createManyOrGetIds(
    tags: { name: string; color?: string }[],
  ): Promise<string[]> {
    // Filtra solo nombres únicos para evitar duplicados en la misma petición
    const uniqueTags = [...new Map(tags.map(tag => [tag.name, tag])).values()];

    const tagIds: string[] = [];

    for (const tag of uniqueTags) {
      const existingTag = await Tag.findOne({ name: tag.name }).exec();

      if (existingTag) {
        // Si el tag ya existe, obtenemos su ID
        tagIds.push(existingTag._id as string);
      } else {
        // Si no existe, lo creamos y obtenemos su ID
        const newTag = await Tag.create(tag);
        tagIds.push(newTag._id as string);
      }
    }

    return tagIds;
  }

  static async getAllTags() {
    const allTags = await Tag.find();

    return allTags;
  }

  static async updateTagColor(
    tagId: string,
    data: {
      color?: string;
      name?: string;
    },
  ) {
    const updatedTag = await Tag.findByIdAndUpdate(
      tagId,
      {
        $set: data,
      },
      { new: true },
    );

    return updatedTag;
  }
}
