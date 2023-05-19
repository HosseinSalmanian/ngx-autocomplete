import { Meta, StoryObj } from '@storybook/angular';
import {
  AutocompleteComponent,
  AutocompleteModule,
} from 'angular-ngx-autocomplete';
import { Observable, of, switchMap } from 'rxjs';
import PERSON_LIST from './data/person-list';

const meta: Meta<AutocompleteComponent<any>> = {
  component: AutocompleteComponent,
  tags: ['autodocs'],
  render: (args: AutocompleteComponent<any>) => ({
    moduleMetadata: {
      imports: [AutocompleteModule],
    },
    props: {
      ...args,
      searchMethod: (term: Observable<string>) => {
        return term.pipe(
          switchMap((term) => {
            return of(PERSON_LIST);
          })
        );
      },
    },
  }),
};

export default meta;
type Story = StoryObj<AutocompleteComponent<any>>;

export const Demo: Story = {};
