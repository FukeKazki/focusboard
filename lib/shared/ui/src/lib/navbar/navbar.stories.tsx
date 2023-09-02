import type { Meta, StoryObj } from '@storybook/react';
import{ NavbarWithDropdown } from './navbar'

const meta: Meta<typeof NavbarWithDropdown> = {
  component: NavbarWithDropdown,
  title: 'NavbarWithDropdown',
};
export default meta;
type Story = StoryObj<typeof NavbarWithDropdown>;

export const Primary = {
  args: {},
};

