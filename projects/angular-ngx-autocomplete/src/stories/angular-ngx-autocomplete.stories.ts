import { Meta, StoryObj } from '@storybook/angular';
import {
  AutocompleteComponent,
  AutocompleteModule,
} from 'angular-ngx-autocomplete';
import { Observable, of, switchMap } from 'rxjs';
const data = [
  {
    name: 'Boyd',
    email: 'Christelle.Franey36@hotmail.com',
    id: '1',
  },
  {
    name: 'Liana',
    email: 'Rollin.Bartoletti20@yahoo.com',
    id: '2',
  },
  {
    name: 'Jacky',
    email: 'Brianne1@yahoo.com',
    id: '3',
  },
  {
    name: 'Jose',
    email: 'Liliane_Huels@yahoo.com',
    id: '4',
  },
  {
    name: 'Katarina',
    email: 'Leonardo76@gmail.com',
    id: '5',
  },
];

const meta: Meta<AutocompleteComponent<any>> = {
  title: 'Example/autocomplete',
  component: AutocompleteComponent,
  tags: ['autodocs'],
  render: (args: AutocompleteComponent<any>) => ({
    moduleMetadata: {
      imports: [AutocompleteModule],
    },
    props: {
      ...args,
    },
  }),
};

export default meta;
type Story = StoryObj<AutocompleteComponent<any>>;

export const Demo: Story = {
  args: {
    viewKey: 'name',
    searchMethod: (term: Observable<string>) => {
      return term.pipe(
        switchMap((term) => {
          return of(data);
        })
      );
    },
  },
};
