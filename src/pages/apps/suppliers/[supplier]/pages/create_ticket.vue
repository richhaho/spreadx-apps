<script setup>
import { createFormData } from "@/helpers/helpers";
import axios_lite from '@/plugins/axios_lite';
import { useUiStore } from "@/store/uiStore";
import { ref } from "vue";
import { useRoute, useRouter } from 'vue-router';
const uiStore = useUiStore();
const router = useRouter();
const route = useRoute();
const supplier_id = route.params.supplier;
uiStore.$subscribe(() => { });

const issueTypes = 
  [
    {
      title: "Orders",
      value: 1,
    },
    {
      title: "Invoices",
      value: 2,
    },
    {
      title: "Payments",
      value: 3,
    }
  ];
const business_logo = ref();
const selectedIssueTypes = ref();
const ticketTitle = ref()
const ticketDetails = ref();
const refInputEl = ref();
const businessAvator = ref(null);
const changeAvatar = (file) => {
  businessAvator.value = null;
  const fileReader = new FileReader();
  const { files } = file.target;
  business_logo.value = files[0];
  if (files && files.length) {
    fileReader.readAsDataURL(files[0]);
    fileReader.onload = () => {
      if (typeof fileReader.result === "string")
        businessAvator.value = fileReader.result;
    };
  }
};
const resetAvatar = () => {
  businessAvator.value = null;
};
const createNewTicket = (supplier_id) => {
  const formData = {
    title: ticketTitle.value,
    details: ticketDetails.value,
    issue_type: selectedIssueTypes.value.value,
    image: business_logo.value,
    supplier_id: supplier_id
  }

  axios_lite
    .post(`v1/create_new_ticket`, createFormData(formData))
    .then(() => {
      uiStore.setSnackBar(true, 'success', 'Ticket Created Successfully')
      router.push(`/apps/suppliers/${supplier_id}/ticket/tickets`);
    })
    .catch((error) => {
      uiStore.setSnackBar(true, 'error', JSON.parse(error.request.response).errors.message)
    })
};
const refNewRecuringBillVForm = ref();

const onNewSupplierSubmit = () => {
  createNewTicket(supplier_id);
};
</script>

<template>
  <div class="">
    <VRow>
      <VCol cols="12">
        <VCard title="CREATE NEW TICKET">
          <!-- 👉 Filters -->
          <VCardText>
            <VDivider></VDivider>
            <VForm ref="refNewRecuringBillVForm"
              @submit.prevent="onNewSupplierSubmit">
              <VCardText>

                <VRow>

                  <VCol cols="6"
                    md="6">
                    <VTextField label="Ticket Title"
                      v-model="ticketTitle"
                      :rules="[requiredValidator]"
                      type="text" />
                  </VCol>
                  <VCol cols="6"
                  md="6">
                  <VSelect v-model="selectedIssueTypes"
                      label="Issue Type"
                      return-object
                      item-value="value"
                      item-text="title"
                      :items="issueTypes"
                      :rules="[requiredValidator]"
                      />
                  </VCol>
                </VRow>


                <VRow>
         
                  <VCol cols="12"
                    sm="12">
                    <VTextarea v-model="ticketDetails"
                      clearable
                      :rules="[requiredValidator]"
                      clear-icon="tabler-circle-x"
                      label="Details"
                      />
                  </VCol>
                  <VCol cols="12"
                    sm="12">
                    <h4 class="text-uppercase">Attach Images</h4>
                    <div class="d-flex justify-start align-center">
                      <VAvatar size="lg"
                        class="pa-2"
                        color="primary"
                        variant="tonal"
                        rounded="lg">
                        <img rounded="lg"
                          width="150"
                          :src="businessAvator ? businessAvator : avatar1" />

                        <div class="">
                          <VBtn size="small"
                            class="mr-1"
                            color="info"
                            variant="tonal"
                            @click="refInputEl?.click()">
                            <VIcon color="info"
                              icon="mdi-pencil-outline"></VIcon>
                          </VBtn>

                          <VBtn size="small"
                            color="error"
                            variant="tonal">
                            <VIcon color="error"
                              varriant="tonal"
                              icon="mdi-delete"
                              @click="resetAvatar"></VIcon>
                          </VBtn>
                        </div>
                      </VAvatar>

                      <input ref="refInputEl"
                        type="file"
                        name="file"
                        accept=".jpeg,.png,.jpg,GIF"
                        hidden
                        @input="changeAvatar" />
                    </div>

                  </VCol>
                </VRow>
              </VCardText>

              <VCardText class="d-flex justify-end flex-wrap gap-3">
         
                <div>
                  <VBtn variant="tonal"
                    color="secondary"
                    @click="isDialogVisible = false"
                    class="mx-1">
                    Close
                  </VBtn>
                  <VBtn type="submit">Create</VBtn>
                </div>
              </VCardText>
            </VForm>

          </VCardText>
        </VCard>
      </VCol>
    </VRow>
  </div>
</template>
