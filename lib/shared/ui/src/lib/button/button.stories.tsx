import type { Meta } from '@storybook/react';
import { Button } from './button';

const meta: Meta<typeof Button> = {
  component: Button,
  title: 'Button',
};
export default meta;
export const Primary = {
  args: {},
  render: () => <Button as="button">Hello</Button>,
};
