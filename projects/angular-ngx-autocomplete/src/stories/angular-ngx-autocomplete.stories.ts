import { Meta, StoryObj } from '@storybook/angular';
import { AngularNgxAutocompleteComponent } from 'angular-ngx-autocomplete';

const meta: Meta<AngularNgxAutocompleteComponent> = {
  title: 'Example/autocomplete',
  component: AngularNgxAutocompleteComponent,
  tags: ['autodocs'],
  render: (args: AngularNgxAutocompleteComponent) => ({
    props: {
      ...args,
    },
  }),
};

export default meta;
type Story = StoryObj<AngularNgxAutocompleteComponent>;

export const Demo: Story = {
    args:{
        name:'Hossein'
    }
};
