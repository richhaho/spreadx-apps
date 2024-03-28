export default [{
    heading: "PETTY CASH",
},

// {
//     title: "Spread Market",
//     to: {
//         name: "apps-marketplace",
//     },
//     icon: {
//         icon: "tabler-building-store",
//     },
// },

{
    title: "Spread Bills",
    to: {
        name: "apps-bills",
    },
    icon: {
        icon: "tabler-dashboard",
    },
},

{
    title: "Manage Accounts",
    icon: {
        icon: "tabler-device-floppy",
    },
    action: "MANAGE_ACCOUNTS",
    subject: "accounts",
    
    children: [
        // {
        //     title: "New",
        //     icon: {
        //         icon: "tabler-plus",
        //     },
        //     to: "apps-bills-accounts-add",
        //     action: "add account",
        //     subject: "accounts",
        // },

        {
            title: "Accounts List",
            icon: {
                icon: "tabler-list",
            },
            action: "view accounts",
            subject: "accounts",
            to: "apps-bills-accounts-accounts_list",
        },



        {
            title: "Statements",
            icon: {
                icon: "tabler-list",
            },
            action: "manage account receipts",
            subject: "receipts",
            to: { name: "apps-bills-accounts-statement-details-id", params: { id: 0} },
            // children: [
            //     //     {
            //     //     title: "New",
            //     //     icon: {
            //     //         icon: "tabler-list",
            //     //     },
            //     //     to: "apps-bills-accounts-arn-new",
            //     //     action: "create account receipts",
            //     //     subject: "receipts",
            //     // },
            //     {
            //         title: "List",
            //         icon: {
            //             icon: "tabler-list",
            //         },
            //         to: "apps-bills-accounts-arn-list",
            //         action: "view account receipts",
            //         subject: "receipts",
            //     }
            // ],
        },



        {
            title: "Requests",
            icon: {
                icon: "tabler-list",
            },
            action: "MANAGE_REQUESTS",
            subject: "requests",
            to: "apps-bills-accounts-requests-list",
            // children: [

            //     // {
            //     //     title: "new",
            //     //     icon: {
            //     //         icon: "tabler-plus",
            //     //     },
            //     //     to: "apps-bills-accounts-requests-new",
            //     //     action: "create requests",
            //     //     subject: "requests",
            //     //     params: {
            //     //         bill: 10,
            //     //     },
            //     // },

            //     {
            //         title: "List",
            //         icon: {
            //             icon: "tabler-plus",
            //         },
            //         to: "apps-bills-accounts-requests-list",
            //         action: "view requests",
            //         subject: "requests",
            //     },
            // ],
        },




        {
            title: "Receipts",
            icon: {
                icon: "tabler-list",
            },
            action: "MANANAGE_ACCOUNT_RECEIPTS",
            subject: "receipts",
            to: "apps-bills-accounts-arn-list",
            // children: [
            //     //     {
            //     //     title: "New",
            //     //     icon: {
            //     //         icon: "tabler-list",
            //     //     },
            //     //     to: "apps-bills-accounts-arn-new",
            //     //     action: "create account receipts",
            //     //     subject: "receipts",
            //     // },
            //     {
            //         title: "List",
            //         icon: {
            //             icon: "tabler-list",
            //         },
            //         to: "apps-bills-accounts-arn-list",
            //         action: "view account receipts",
            //         subject: "receipts",
            //     }
            // ],
        },


        {
            title: "Payments",
            icon: {
                icon: "tabler-list",
            },
            action: "MANAGE_ACCOUNT_ISSUES",
            subject: "issues",
            to: "apps-bills-accounts-issues-list",
            // children: [{
            //     title: "List",
            //     icon: {
            //         icon: "tabler-list",
            //     },
            //     to: "apps-bills-accounts-issues-list",
            //     action: "view account issues",
            //     subject: "issues",
            // },

            //     // {
            //     //     title: "New",
            //     //     icon: {
            //     //         icon: "tabler-plus",
            //     //     },
            //     //     to: "apps-bills-accounts-issues-issue",
            //     //     action: "create account issues",
            //     //     subject: "issues",
            //     // },

            //     // {
            //     //   title: "View",
            //     //   icon: {
            //     //     icon: "tabler-plus",
            //     //   },
            //     //   to: "accounts-issues-view",
            //     //   action: "view account issues",
            //     //   subject: "issues",
            //     // }
            // ],
        },



        {
            title: "transfers",
            icon: {
                icon: "tabler-list",
            },
            action: "MANAGE_ACCOUNT_TRANSFERS",
            subject: "transfers",
            to: "apps-bills-accounts-transfers-list",
            // children: [

            //     // {
            //     //     title: "new",
            //     //     icon: {
            //     //         icon: "tabler-plus",
            //     //     },
            //     //     to: "apps-bills-accounts-transfers-transfer",
            //     //     action: "create account transfers",
            //     //     subject: "transfers",
            //     // },

            //     {
            //         title: "List",
            //         icon: {
            //             icon: "tabler-plus",
            //         },
            //         to: "apps-bills-accounts-transfers-list",
            //         action: "view account transfers",
            //         subject: "transfers",
            //     },
            // ],
        },


    ],
},

// {
//     title: "Employees",
//     icon: {
//         icon: "tabler-device-floppy",
//     },
//     action: "ACCESS_USERS_MANAGEMENT",
//     subject: "users",
//     children: [

//         {
//             title: "New",
//             icon: {
//                 icon: "tabler-plus",
//             },
//             to: "apps-bills-users-new",
//             action: "ACCESS_USERS_MANAGEMENT",
//             subject: "create_user",
//         },

//         {
//             title: "List",
//             icon: {
//                 icon: "tabler-list",
//             },
//             to: "apps-bills-users-list",
//             action: "ACCESS_USERS_MANAGEMENT",
//             subject: "view_user",
//         },

//     ],
// },

{
    title: "Bills and Subscription",
    icon: {
        icon: "tabler-file-invoice",
    },
    action: "MANAGE_BILLS",
    subject: "bills",
    to: "apps-bills-bills-bills_list",

    children: [

        {
            title: "Bills",
            icon: {
                icon: "tabler-list",
            },
            to: "apps-bills-bills-bills_list",
            action: "VIEW_BILLS",
            subject: "bills",
        },

        {
            title: "Subscriptions",
            icon: {
                icon: "tabler-list",
            },
            to: { name: "apps-bills-bills-subscriptions-tab", params: { tab: 'list' } } ,
            action: "VIEW_BILLS",
            subject: "bills",
        },



        // {
        //     title: "Add",
        //     icon: {
        //         icon: "tabler-list",
        //     },
        //     to: "apps-bills-bills-new",
        //     action: "create bills",
        //     subject: "bills",
        // },

        // {
        //     title: "Payment List",
        //     icon: {
        //         icon: "tabler-list",
        //     },
        //     to: "apps-bills-payment_list",
        //     action: "view bills payments",
        //     subject: "bills",
        // },
        // {
        //     title: "Pay Bills",
        //     icon: {
        //         icon: "tabler-list",
        //     },
        //     to: "apps-bills-pay_bills",
        //     action: "pay bills",
        //     subject: "bills",
        // },
    ],
},


{
    title: "Settings",

    icon: {
        icon: "tabler-dashboard",
    },
    action: "MANAGE_ORGANIZATION",
    subject: "organization",
    children: [
        {
            title: "Organization",
            icon: {
                icon: "tabler-device-floppy",
            },
            action: "Manage companies",
            subject: "company",
            children: [{
                title: "Companies",
                icon: {
                    icon: "tabler-list",
                },
                action: "VIEW_COMPANIES",
                subject: "companies",
                to: "apps-bills-organization",
            },

            {
                title: "Divisions",
                icon: {
                    icon: "tabler-list",
                },
                to: "apps-bills-companies",
                action: "VIEW_DIVISIONS",
                subject: "divisions",
            },

            {
                title: "Locations",
                icon: {
                    icon: "tabler-list",
                },
                action: "VIEW_LOCATIONS",
                subject: "branches",
                to: "apps-bills-branches",
            },

            {
                title: "Departments",
                icon: {
                    icon: "tabler-list",
                },
                action: "VIEW_DEPARTMENTS",
                subject: "departments",
                to: "apps-bills-departments-list",
            },
            {
                title: "Employees",
                icon: {
                    icon: "tabler-list",
                },
                to: "apps-bills-users-list",
                action: "ACCESS_USERS_MANAGEMENT",
                subject: "view_user",
            },

            ],
        },
    ]
},

]
