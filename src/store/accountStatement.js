import axios_object from "@/plugins/axios_local";
import { defineStore } from "pinia";
const v1 = import.meta.env.VITE_API_V1
const v2 = import.meta.env.VITE_API_V2
export const useAccountStatementStore = defineStore("useAccountStatementStore", {
    state: () => ({
        statements: [],
        statementTotal: 0,
        openingBalance: 0,
        balanceDate: '',
        balanceToDate: ''

        
    }),
    actions: {
        getAccountStatements(params) {
            axios_object.get(`${v1}petty_cash/get-account-statement`, {
                params: params
            }).then((response) => {
                console.log("data" + response.data.data);
                this.statements = response.data.data.statement_list;
                this.balanceDate = response.data.data.balance_date;
                this.balanceToDate = response.data.data.balance_to;
                this.openingBalance = response.data.data.opening_balance[0];
            }).catch((error) => {

            }).finally(() => {

            })

        }
    }

});