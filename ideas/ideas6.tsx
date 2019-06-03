type BasicPropertyType = StringConstructor | DateConstructor | NumberConstructor;

type ShapePropertyType = { [key: string]: PropertyType };

type PropertyType = BasicPropertyType | ShapePropertyType;

interface PropertyEditorProps<T> {
  setValue: (value: T | undefined) => void;
  propertyKey: string;
  value: T | undefined;
  propertyOptions: PropertyOptions<any, PropertyType>;
  serverUrl: string;
}

// type Properties<T extends {[K in keyof T]: PropertyType}> = { [K in keyof T]: PropertyOptions<T[K]> };

type ActualType<T extends PropertyType | any> = T extends BasicPropertyType
  ? T['prototype']
  : T extends ShapePropertyType
  ? { [K in keyof T]: ActualType<T[K]> }
  : never;

function composeFakeEditor<T>() {
  return (props: PropertyEditorProps<T>) => null;
}

export interface PropertyOptions<T, TPropertyType extends PropertyType | any> {
  displayName?: string;
  editorComponent?: React.ComponentType<PropertyEditorProps<ActualType<TPropertyType>>>;
  defaultValue?: (() => ActualType<TPropertyType>) | ActualType<TPropertyType> | Promise<ActualType<TPropertyType>>;
  type: TPropertyType;
  resolve?: Resolver<T, ActualType<TPropertyType>>;
}

interface EntityOptions {
  alias: string;
}

type Resolver<T, V> = (source: { [K in keyof T]: ActualType<T[K]> }) => V | Promise<V>;

// type Return<TProperties extends Properties<T>, T> = { [K in keyof TProperties]: ActualType<TProperties[K]> };

// type EntitySchema<T = any, TAlias extends string = any> = {
//   alias: TAlias;
//   options: EntityOptions;
//   properties: { [K in keyof T]: PropertyOptions<T[K]> };
//   prototypes: ActualType<T>;
// };

type EntitySchema<T = any> = ReturnType<typeof composeSchema>;

function composeSchema<T>(args: {
  properties: { [K in keyof T]: PropertyOptions<T, T[K]> };
  options: EntityOptions;
  // editors: { [K in keyof TProperties]: PropertyOptions<ActualType<TProperties[K]>> };
  // resolvers: { [K in keyof Partial<TProperties>]: Resolver<ActualType<TProperties>, ActualType<TProperties[K]>> };
}) {
  // EntitySchema<T, TAlias>
  type ObjectWithConstructorTypes = { [K in keyof T]: PropertyOptions<T, T[K]> };
  type Return = { [K in keyof ObjectWithConstructorTypes]: ActualType<ObjectWithConstructorTypes[K]['type']> };
  return {
    ...args,
    prototypes: {} as Return
  };
}

// function composeEditors<TProperties extends Properties<T>, T>(
//   schema: EntitySchema<TProperties, T>,
//   editors: { [K in keyof TProperties]: PropertyOptions<ActualType<TProperties[K]>> }
// ) {
//   return editors;
// }

const CommentSchema = composeSchema({
  options: { alias: 'comment' },
  properties: {
    text: {
      type: String,
      editorComponent: composeFakeEditor<string>(),
      defaultValue: 'hello',
      displayName: 'Text'
    },
    location: {
      editorComponent: composeFakeEditor<{ lat: number; lng: number }>(),
      displayName: 'Text',
      type: {
        lat: Number,
        lng: Number
      }
    },
    upperCaseText: {
      type: String,
      resolve: comment => comment.text.toUpperCase()
    }
  }
});

const ArticleSchema = composeSchema({
  options: { alias: 'article' },
  properties: {
    title: {
      type: String,
      editorComponent: composeFakeEditor<string>(),
      defaultValue: 'hello',
      displayName: 'Text'
    }
  }
});

interface Config<TEntitySchemas extends EntitySchema[] = []> {
  schemas: TEntitySchemas;
}

function configure<TEntitySchemas extends EntitySchema[]>(config: Config<TEntitySchemas>) {
  return config;
}
const config = configure({
  schemas: [CommentSchema, ArticleSchema]
});

CommentSchema.prototypes.text.toUpperCase();
CommentSchema.prototypes.location.lat.toFixed();