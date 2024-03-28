import { defineAbility } from '@casl/ability';

export const ability = defineAbility((can) => {
    can('navigate', 'Organization'),
        can('navigate', 'Accounts'),
        can('navigate', 'Users'),
        can('navigate', 'Bills'),
        can('navigate', 'Purchase Order'),
        can('navigate', 'Supplier Order')
});
