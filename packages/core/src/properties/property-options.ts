import React from 'react';
import { PropertyEditorProps } from './property-editor-props';
import { PropertyType, ActualType } from './property-types';

export type PropertyOptions<T, TPropertyType extends PropertyType | any> = {
  displayName?: string;
  editorComponent?: React.ComponentType<PropertyEditorProps<ActualType<TPropertyType>>>;
  defaultValue?: (() => ActualType<TPropertyType>) | ActualType<TPropertyType> | Promise<ActualType<TPropertyType>>;
  type: TPropertyType;
  resolverPlugin?: {
    alias: string;
    meta: any;
  };
};
