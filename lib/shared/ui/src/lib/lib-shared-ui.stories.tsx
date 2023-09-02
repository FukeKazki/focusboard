import type { Meta, StoryObj } from '@storybook/react';
import { LibSharedUi } from './lib-shared-ui';

import { within } from '@storybook/testing-library';
import { expect } from '@storybook/jest';

const meta: Meta<typeof LibSharedUi> = {
  component: LibSharedUi,
  title: 'LibSharedUi',
};
export default meta;
type Story = StoryObj<typeof LibSharedUi>;

export const Primary = {
  args: {},
};

export const Heading: Story = {
  args: {},
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText(/Welcome to LibSharedUi!/gi)).toBeTruthy();
  },
};
