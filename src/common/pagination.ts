import { FindManyOptions, ObjectLiteral, Repository } from 'typeorm';

export interface PaginationOptions {
  page: number;
  limit: number;
}

export interface PaginationMeta {
  totalItems: number;
  itemCount: number;
  itemsPerPage: number;
  totalPages: number;
  currentPage: number;
}

export interface Pagination<T> {
  items: T[];
  meta: PaginationMeta;
}

// nestjs-typeorm-paginate가 TypeORM 1.x를 지원하지 않아 동일한 응답 형태로 대체
export async function paginate<T extends ObjectLiteral>(
  repository: Repository<T>,
  options: PaginationOptions,
  findOptions: FindManyOptions<T> = {},
): Promise<Pagination<T>> {
  const page = Math.max(1, +options.page || 1);
  const limit = Math.max(1, +options.limit || 10);

  const [items, totalItems] = await repository.findAndCount({
    ...findOptions,
    skip: (page - 1) * limit,
    take: limit,
  });

  return {
    items,
    meta: {
      totalItems,
      itemCount: items.length,
      itemsPerPage: limit,
      totalPages: Math.ceil(totalItems / limit),
      currentPage: page,
    },
  };
}
