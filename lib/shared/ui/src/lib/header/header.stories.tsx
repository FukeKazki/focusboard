import type { Meta } from '@storybook/react';
import { Header } from './header';

const meta: Meta<typeof Header> = {
  component: Header,
  title: 'Header',
};
export default meta;
export const Primary = {
  args: {},
  render: () => <Header />,
};
