import React from 'react';
import {
  configure,
  composeSchema,
  createTextEditor,
  FileSystemImageSchema,
  createLocationEditor,
  createSingleDropdownEditor,
  createMultipleDropdownEditor
} from '@refract-cms/core';
import { NewsArticleSchema } from './news/news-article.schema';
import { SettingsSchema } from './settings/settings.model';
import { ProductSchema } from './products/product.schema';
import CustomDropdownEditor from './shared/CustomDropdownEditor';

export default configure({
  schema: [FileSystemImageSchema, ProductSchema, NewsArticleSchema, SettingsSchema]
});
