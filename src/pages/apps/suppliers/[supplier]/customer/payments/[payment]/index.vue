<script setup>
import { useRoute } from 'vue-router';
const route = useRoute()
const supplier_id = route.params.supplier
const date = JSON.parse(localStorage.getItem('invoice'))
</script>
<template>
      <VCard class="pt-3 pb-3">
    <VRow>
      <VCol
        cols="12"
        relative
        sm="4"
        md="3"
        lg="3"
      >
        <h3 class="ml-3">Home / Orders</h3>
        <VList
          v-model:opened="open"
          style="height: 100%;"
        >
          <VListItem
            prepend-icon="tabler-home"
            title="Dashboard"
            :to="`/apps/suppliers/${supplier_id}/customer/dashboard`"
          />
          <VListItem
            prepend-icon="tabler-user"
            title="Profile"
            :to="`/apps/suppliers/${supplier_id}/customer/profile`"
          />
          <VListItem
            prepend-icon="tabler-map"
            title="Addresses"
            :to="`/apps/suppliers/${supplier_id}/customer/address`"
          />
          <VListItem
            prepend-icon="tabler-list"
            title="Orders"
            :to="`/apps/suppliers/${supplier_id}/customer/orders`"
          />
          <VListItem
            prepend-icon="tabler-adjustments"
            title="Rewards"
            :to="`/apps/suppliers/${supplier_id}/customer/rewards`"
          />
          <VListItem
            prepend-icon="tabler-credit-card"
            title="Payments"
            :to="`/apps/suppliers/${supplier_id}/customer/payments`"
          />        
        </VList>
      </VCol>
      <VCol
        cols="12"
        relative
        sm="8"
        md="9"
        lg="9"
      >
        <v-card color="#fff" class="title-total-amount mb-2">
            <div class="total-payable-amount">
                <p class="amount">TOTAL PAYABLE AMOUNT</p>
                <p class="total-number">{{date.invoice_total}}</p>
            </div>
            <div class="paying-amount">
                <p class="amount">PAYING AMOUNT</p>
                <p class="total-number">{{ date.num }}</p>
            </div>
        </v-card>
        <v-card color="#fff" class="payment-collection-main">
            <div class="payment-collection">
                <p class="payment-collection-title pb-2">PAYMENT COLLECTION</p>
                <div class="paid-remaining-select">
                    <div class="paid-remaining d-flex mb-5 mt-3">
                        <div class="paid-amount mr-1">
                            <p>AMOUNT TO BE PAID : </p>
                            <span>145.95</span>
                        </div>
                        <div class="remaining-amount d-flex">
                            <p class="mr-3">REMAINING AMOUNT : </p>
                            <span>0.95</span>
                        </div>
                    </div>
                    <div class="select-method pb-5">
                        <p class="mb-3">SELECT PAYMENT METHOD</p>
                        <v-select
                            v-model="select"
                            :items="items"
                            item-title="state"
                            item-value="abbr"
                            label="Select"
                            persistent-hint
                            return-object
                            single-line
                            color="#b89292"
                        ></v-select>
                    </div>
                </div>
                <div class="selected-payment-method">
                    <p class="pt-3 pb-3">SELECTED PAYMENT METHODS</p>
                    <div class="cash-div">
                        <p>CASH</p>
                        <div class="d-flex amount-number amount-border-top">
                            <span>AMOUNT : <b>100</b></span>
                            <VBtn
                              size="small"
                              class="trash-button"
                            >
                              <VIcon
                                size="15"
                                icon="tabler-trash"
                              />
                            </VBtn>
                        </div>
                    </div>
                    <div class="credit-card-div">
                        <div class="d-flex credit-card-p">
                            <p>CREDIT CARD</p>
                            <p class="credit-card-color">#45fdf</p>
                        </div>
                        <div class="d-flex amount-number amount-border-top">
                            <span>AMOUNT : <b>45</b></span>
                            <VBtn
                              size="small"
                              class="trash-button"
                            >
                              <VIcon
                                size="15"
                                icon="tabler-trash"
                              />
                            </VBtn>
                        </div>
                    </div>
                    <v-btn class="pay-button mb-5">PAY OUTSTANDING</v-btn>
                </div>
            </div>
        </v-card>
      </VCol>
    </VRow>
  </VCard>
    
</template>
<style>
.title-total-amount,.payment-collection-main{
    width: 97%;
    padding: 20px;
}
p{margin-bottom: 5px;}
p.amount{font-size: 25px;}
.total-payable-amount,.paying-amount{
    text-align: center;
    padding: 10px 20px 10px 20px;
    border: 1px solid #EDEDED;
    border-radius: 5px;
}
.total-payable-amount{
    margin-bottom: 10px;
}
.total-number{
    font-size: 30px;
    font-weight: 900;
    color: #7367F0;
}
.payment-collection-title{
    font-size: 20px;
    font-weight: 600;
    color: #555555;
    border-bottom: 1px solid #e5e1e1;
}
.paid-amount,.remaining-amount{
    background-color: #7367F0;
    padding: 20px;
    color: #fff;
    font-size: 20px;
    width: 50%;
}
.paid-amount span,.remaining-amount span{font-weight: 800;}
.paid-amount{border-radius: 5px 0 0px 5px;}
.remaining-amount{border-radius: 0 5px 5px 0;}
.select-method p{
    font-size: 16px;
    color: #b89292;
}
.paid-remaining-select{
    border-bottom: 1px solid #e5e1e1
}
.selected-payment-method p{
    font-size: 15px;
    color: #555555;
    font-weight: 500;
}
.cash-div,.credit-card-div{
    width: 100%;
    border: 1px solid #7367F0;
    padding: 20px;
    border-radius: 7px;
    margin-bottom: 25px;
}
.pay-button,.credit-card-p{width: 100%;}
.credit-card-p, .cash-div p{
    justify-content: space-between;
    padding: 10px 0;
}
.credit-card-color{color: #8787d8 !important;}
.amount-border-top{
    border-top: 1px solid #e5e1e1;
    padding: 20px 0;
    color: #484849;
}
.trash-button{
    background-color: red !important;
}
.amount-number{justify-content: space-between;}
</style>