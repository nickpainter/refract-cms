import * as React from 'react';
import { PropertyEditorProps } from '../properties/property-editor-props';
import {
  Theme,
  withStyles,
  WithStyles,
  CircularProgress,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Checkbox,
  Dialog,
  DialogContent,
  Typography,
  Button,
  DialogActions,
  DialogTitle,
  createStyles,
  Chip,
  Avatar
} from '@material-ui/core';
import { combineContainers } from 'combine-containers';
import { graphql, DataProps } from 'react-apollo';
import { graphqlQueryHelper } from '../graphql/graphql-query-helper';
import { EntitySchema } from '../entities/entity-schema';
import { Entity } from '../entities/entity.model';
import EntityListItem from '../entities/EntityListItem';
import { entityService } from '../entities/services/entity.service';
import pluralize from 'pluralize';

export interface MultipleEntityPickerOptions {
  schema: EntitySchema;
}

const styles = (theme: Theme) =>
  createStyles({
    editor: {
      width: '100%'
    },
    textLink: {
      cursor: 'pointer',
      color: theme.palette.secondary.main,
      '&:hover': {
        textDecoration: 'underline'
      }
    },
    chip: {
      margin: theme.spacing.unit
    }
  });

interface Props
  extends PropertyEditorProps<string[]>,
    WithStyles<typeof styles>,
    MultipleEntityPickerOptions,
    DataProps<{
      items: Entity[];
    }> {}

interface State {
  dialogOpen: boolean;
}

class MultipleEntityPickerEditor extends React.Component<Props, State> {
  state: State = {
    dialogOpen: false
  };

  handleOnChange = ({ entity }: { entity: Entity }) => () => {
    const { setValue, value } = this.props;
    const selectedEntityIds = value || [];
    const checked = this.isChecked({ entity });
    if (checked) {
      setValue(selectedEntityIds.filter(id => id !== entity._id));
    } else {
      setValue([...selectedEntityIds, entity._id]);
    }
  };

  isChecked = ({ entity }) => {
    const selectedEntityIds = this.props.value || [];
    return selectedEntityIds.some(id => entity._id === id);
  };

  render() {
    const { classes, value, data, setValue, schema } = this.props;
    if (data.loading) {
      return <CircularProgress />;
    }
    const selectedEntityIds = value || [];
    const instanceDisplayProps = entityService.instanceDisplayPropsOrDefault(schema);
    return data.items ? (
      <div>
        {value ? (
          <div>
            {selectedEntityIds.map(id => {
              const match = data.items ? data.items.find(entity => entity._id === id) : undefined;
              const url = match ? instanceDisplayProps(match).imageUrl : undefined;
              return match ? (
                <Chip
                  avatar={url ? <Avatar src={instanceDisplayProps(match).imageUrl} /> : undefined}
                  label={instanceDisplayProps(match).primaryText}
                  onDelete={this.handleOnChange({ entity: match })}
                  className={classes.chip}
                />
              ) : (
                <span />
              );
            })}
          </div>
        ) : (
          <span />
        )}
        <Button onClick={() => this.setState({ dialogOpen: true })}>
          Click to select a {schema.options.displayName}
        </Button>
        <Dialog open={this.state.dialogOpen}>
          <DialogTitle>Select a {schema.options.displayName}</DialogTitle>
          <DialogContent>
            <List style={{ width: 500 }}>
              {data.items.map(entity => {
                return (
                  <EntityListItem
                    entity={entity}
                    schema={schema}
                    key={entity._id}
                    button
                    onClick={this.handleOnChange({ entity })}
                    SecondaryAction={
                      <Checkbox onChange={this.handleOnChange({ entity })} checked={this.isChecked({ entity })} />
                    }
                  />
                );
              })}
            </List>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => this.setState({ dialogOpen: false })}>Done</Button>
          </DialogActions>
        </Dialog>
      </div>
    ) : (
      <div>None found</div>
    );
  }
}

export default (options: MultipleEntityPickerOptions) => {
  const ENTITY_PICKER_QUERY = graphqlQueryHelper.getAllQueryWithAllFields(options.schema);
  const Editor = combineContainers(withStyles(styles), graphql(ENTITY_PICKER_QUERY))(MultipleEntityPickerEditor);
  return (props: PropertyEditorProps<string[]>) => <Editor {...props} {...options} />;
};