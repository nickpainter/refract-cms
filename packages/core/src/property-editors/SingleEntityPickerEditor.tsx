import React from 'react';
import { PropertyEditorProps } from '../properties/property-editor-props';
import { EntitySchema } from '../entities/entity-schema';
import { createMultipleEntityPickerEditor } from '..';

export interface SingleEntityPickerOptions {
  schema: EntitySchema;
}

export default (options: SingleEntityPickerOptions) => {
  const MultipleEntityPickerEditor = createMultipleEntityPickerEditor(options);
  return (props: PropertyEditorProps<string>) => (
    <MultipleEntityPickerEditor
      value={[props.value].filter(Boolean)}
      setValue={newValue => {
        props.setValue(newValue[newValue.length - 1]);
      }}
      propertyKey={props.propertyKey}
      propertyOptions={props.propertyOptions}
      {...options}
    />
  );
};
