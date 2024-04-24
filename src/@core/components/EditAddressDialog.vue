<script setup>
const props = defineProps({
  billingAddress: {
    type: Object,
    required: true,
  },
  isDialogVisible: {
    type: Boolean,
    required: true,
  },
})


const emit = defineEmits([
  'update:isDialogVisible',
  'submit',
])

const billingAddress = ref(structuredClone(toRaw(props.billingAddress)))

const resetForm = () => {
  emit('update:isDialogVisible', false)
  billingAddress.value = structuredClone(toRaw(props.billingAddress))
}

const onFormSubmit = (data) => {
  emit('update:isDialogVisible', false)
  emit('submit', billingAddress.value)
  emit('update:billingAddress',  billingAddress.value)
}

const dialogModelValueUpdate = val => {
  emit('update:isDialogVisible', val)
}
</script>

<template>
  <VDialog
    :width="$vuetify.display.smAndDown ? 'auto' : 650 "
    :model-value="props.isDialogVisible"
    @update:model-value="dialogModelValueUpdate"
  >
    <!-- Dialog close btn -->
    <DialogCloseBtn @click="dialogModelValueUpdate(false)" />

    <VCard
      v-if="props.billingAddress"
      class="pa-sm-9 pa-5"
    >
      <VCardItem>
        <VCardTitle class="text-h5 text-center mb-3">
          Delivery Address
        </VCardTitle>
      </VCardItem>

      <VCardText>
        <VForm @submit.prevent="onFormSubmit">
          <VRow>
            <VCol
              cols="12"
              md="6"
            >
              <VTextField
                v-model="billingAddress.first_name"
                label="First Name"
              />
            </VCol>
            <VCol
              cols="12"
              md="6"
            >
              <VTextField
                v-model="billingAddress.last_name"
                label="Last Name"
              />
            </VCol>

            <VCol
              cols="12"
              md="6"
            >
              <VTextField
                v-model="billingAddress.city"
                label="City"
              />
            </VCol>
            <VCol
              cols="12"
              md="6"
            >
              <VTextField
                v-model="billingAddress.state"
                label="State"
              />
            </VCol>

            <!-- 👉 VAT Number -->
            <VCol
              cols="12"
              md="12"
            >
              <VTextField
                v-model="billingAddress.phone"
                label="Phone Number"
              />
            </VCol>

            <VCol
              cols="12"
              md="6"
            >
              <VTextField
                v-model="billingAddress.address1"
                label="Address 1"
              />
            </VCol>
            <VCol
              cols="12"
              md="6"
            >
              <VTextField
                v-model="billingAddress.address2"
                label="Address 2"
              />
            </VCol>
.
            <VCol
              cols="12"
              md="12"
            >
              <VSelect
                v-model="billingAddress.country"
                label="Country"
                :items="['UAE', 'USA', 'Uk', 'France', 'Germany', 'Japan']"
              />
            </VCol>

            <VCol
              cols="12"
              md="12"
            >
              <VTextField
                v-model="billingAddress.email"
                label="Email"
              />
            </VCol>

            <VCol
              cols="12"
              class="text-center"
            >
              <VBtn
                type="submit"
                class="me-3"
              >
                submit
              </VBtn>

              <VBtn
                variant="tonal"
                color="secondary"
                @click="resetForm"
              >
                Cancel
              </VBtn>
            </VCol>
          </VRow>
        </VForm>
      </VCardText>
    </VCard>
  </VDialog>
</template>
