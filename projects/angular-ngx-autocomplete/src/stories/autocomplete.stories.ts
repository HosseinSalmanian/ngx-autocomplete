import { Meta, StoryObj } from '@storybook/angular';
import {
  AutocompleteComponent,
  AutocompleteModule,
} from 'angular-ngx-autocomplete';
import { Observable, delay, of, switchMap } from 'rxjs';
import PERSON_LIST from './data/person-list';
import { Person } from './models/person.model';

type Autocomplete = AutocompleteComponent<Person>;
const meta: Meta<Autocomplete> = {
  component: AutocompleteComponent,
  tags: ['autodocs'],
  render: (args: Autocomplete) => ({
    moduleMetadata: {
      imports: [AutocompleteModule],
    },
    props: {
      ...args,
      searchMethod: (term: Observable<string>) => {
        return term.pipe(
          switchMap((term) => {
            return of(
              PERSON_LIST.filter(
                (t) => term.trim() === '' || t.email.indexOf(term) > -1 ||  t.name.indexOf(term) > -1
              )
            ).pipe(delay(1000));
          })
        );
      },
    },
  }),
};

export default meta;
type Story = StoryObj<Autocomplete>;

export const Demo: Story = {
  args: {
    viewKey: 'email',
    minimumCharacterForSearch: 0,

    debounceTime: 500,

    suggestionItemClass: 'custom-class',

    suggestionContainerHeight: 150,
    // suggestionKey!: keyof T;
    // suggestionMethod!: (item?: T) => string;
    // idKey: keyof T = 'id' as keyof T;
    // viewKey!: keyof T;
    // viewMethod!: (selection?: T) => string;
    placeholder: 'type to search',
    autocomplete: 'off',

    noSuggestionText: 'no item found.',

    clearButton: true,

    fitOverlayWidth: false,
  },
};
